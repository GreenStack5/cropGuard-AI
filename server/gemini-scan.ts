import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import { GoogleGenAI, Type } from '@google/genai'
import {
  CropScanResultSchema,
  ScanRequestBodySchema,
  type CropScanResultType,
} from './schema.js'

const DEFAULT_MODEL = 'gemini-3.6-flash'
const MAX_BODY_BYTES = 20 * 1024 * 1024

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

function sendJson(res: ServerResponse, status: number, payload: object): void {
  const body = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Content-Length', Buffer.byteLength(body))
  res.end(body)
}

async function readBody(req: IncomingMessage, maxBytes = MAX_BODY_BYTES): Promise<string> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > maxBytes) {
      throw new Error('Request body too large.')
    }
    chunks.push(buffer)
  }
  return Buffer.concat(chunks).toString('utf8')
}

export function resolveGeminiEnv(mode?: string) {
  const env = mode ? loadEnv(mode, process.cwd(), '') : process.env
  const apiKey =
    process.env.GEMINI_API_KEY ??
    env.cropGaurd_API_Key ??
    env.GEMINI_API_KEY ??
    process.env.cropGaurd_API_Key ??
    ''
  const model =
    process.env.GEMINI_MODEL ??
    env.GEMINI_MODEL ??
    DEFAULT_MODEL

  return { apiKey, model }
}

export async function analyzeWithGeminiSDK(
  apiKey: string,
  model: string,
  images: Array<{ mimeType: string; data: string }>,
): Promise<{ ok: true; result: CropScanResultType } | { ok: false; message: string }> {
  try {
    const ai = new GoogleGenAI({ apiKey })

    const parts = [
      ...images.map((image) => ({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      })),
      { text: SYSTEM_PROMPT },
    ]

    const response = await ai.models.generateContent({
      model: model || DEFAULT_MODEL,
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
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
      return { ok: false, message: 'The analysis service returned an empty response.' }
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(rawText)
    } catch {
      return { ok: false, message: 'The analysis service returned invalid JSON output.' }
    }

    const zodResult = CropScanResultSchema.safeParse(parsed)
    if (!zodResult.success) {
      console.warn('Gemini validation schema error:', zodResult.error.format())
      return { ok: false, message: 'The analysis service returned incomplete or malformed data.' }
    }

    // Normalize confidence
    const result = zodResult.data
    result.confidence = Math.max(0, Math.min(100, Math.round(result.confidence)))

    return { ok: true, result }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown Gemini SDK error'
    return { ok: false, message: `Analysis failed: ${errorMessage}` }
  }
}

function createScanHandler(mode: string) {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: (error?: unknown) => void,
  ) => {
    const url = req.url ?? ''
    const path = url.split('?')[0]
    if (path !== '/api/analyze') {
      next()
      return
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method not allowed. Use POST.' })
      return
    }

    const { apiKey, model } = resolveGeminiEnv(mode)
    if (!apiKey) {
      sendJson(res, 503, {
        error:
          'The analysis service is not configured. Ask an administrator to add the API key to .env.local.',
        code: 'ANALYSIS_NOT_CONFIGURED',
      })
      return
    }

    let rawBody: string
    try {
      rawBody = await readBody(req)
    } catch {
      sendJson(res, 413, { error: 'Request body too large (max 20 MB).' })
      return
    }

    let parsedBody: unknown
    try {
      parsedBody = JSON.parse(rawBody)
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON body.' })
      return
    }

    const bodyResult = ScanRequestBodySchema.safeParse(parsedBody)
    if (!bodyResult.success) {
      sendJson(res, 400, {
        error: 'Invalid request parameters.',
        details: bodyResult.error.issues,
      })
      return
    }

    const outcome = await analyzeWithGeminiSDK(apiKey, model, bodyResult.data.images)

    if (!outcome.ok) {
      sendJson(res, 502, { error: outcome.message })
      return
    }

    sendJson(res, 200, { result: outcome.result })
  }
}

export function geminiScanPlugin(): Plugin {
  return {
    name: 'cropguard-gemini-scan',
    configureServer(server) {
      server.middlewares.use(createScanHandler(server.config.mode))
    },
    configurePreviewServer(server) {
      server.middlewares.use(createScanHandler(server.config.mode))
    },
  }
}