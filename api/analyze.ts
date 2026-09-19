import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenAI, Type } from '@google/genai'
import { CropScanResultSchema, ScanRequestBodySchema } from '../server/schema.js'

const DEFAULT_MODEL = 'gemini-2.5-flash'

const SYSTEM_PROMPT = `You are CropGuard, an agricultural plant-disease expert helping smallholder farmers.

Analyze the crop photo(s) provided (one or more images of the same crop). Detect whether the crop is healthy or shows signs of a disease or pest damage, and give practical, field-safe advice.

Rules:
- Only diagnose based on visible visual evidence in the photos.
- If the plant looks healthy, set condition to "healthy", confidence high, and leave diseaseName/scientificName null.
- If you are uncertain, keep confidence low and be honest that the image is not conclusive (that is "at-risk", not a confirmed disease).
- Never invent a confirmed disease when the evidence is ambiguous. Never present an uncertain AI output as a confirmed scientific diagnosis.
- Recommend consulting a local agricultural extension officer for confirmation before applying treatment.
- Keep all advice plain-language and appropriate for a farmer with limited chemical inputs.

Return ONLY valid JSON matching this exact schema:
{
  "cropName": string,
  "condition": "healthy" | "at-risk" | "affected",
  "confidence": number (0-100),
  "diseaseName": string | null,
  "scientificName": string | null,
  "description": string (1-3 sentences, plain language),
  "symptoms": string[] (max 5),
  "causes": string[] (max 4),
  "treatment": string[] (max 4, recommended actions),
  "prevention": string[] (max 4, prevention steps),
  "recommendations": string[] (max 3, immediate next steps),
  "precautions": string (short safety disclaimer)
}`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.cropGaurd_API_Key || ''
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL

  if (!apiKey) {
    return res.status(503).json({
      error: 'The analysis service is not configured on Vercel. Add GEMINI_API_KEY in Vercel Environment Variables.',
      code: 'ANALYSIS_NOT_CONFIGURED',
    })
  }

  const parseResult = ScanRequestBodySchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request body.',
      details: parseResult.error.issues,
    })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const parts = [
      ...parseResult.data.images.map((image) => ({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      })),
      { text: SYSTEM_PROMPT },
    ]

    const response = await ai.models.generateContent({
      model: model || DEFAULT_MODEL,
      contents: [{ role: 'user', parts }],
      config: {
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING },
            condition: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            diseaseName: { type: Type.STRING, nullable: true },
            scientificName: { type: Type.STRING, nullable: true },
            description: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            causes: { type: Type.ARRAY, items: { type: Type.STRING } },
            treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            precautions: { type: Type.STRING },
          },
          required: ['cropName', 'condition', 'confidence', 'description'],
        },
      },
    })

    const rawText = response.text
    if (!rawText) {
      return res.status(502).json({ error: 'The analysis service returned an empty response.' })
    }

    const parsed = JSON.parse(rawText)
    const zodResult = CropScanResultSchema.safeParse(parsed)
    if (!zodResult.success) {
      return res.status(502).json({ error: 'The analysis service returned incomplete data.' })
    }

    const result = zodResult.data
    result.confidence = Math.max(0, Math.min(100, Math.round(result.confidence)))

    return res.status(200).json({ result })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown Gemini error'
    return res.status(502).json({ error: `Analysis failed: ${message}` })
  }
}
