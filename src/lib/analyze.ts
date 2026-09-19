import type { Diagnosis } from './types'

// Curated demo disease profiles used by the MVP scanner.
// These are illustrative matches for the hackathon — a production
// build would run a real vision model.
export const DIAGNOSES: Diagnosis[] = [
  {
    crop: 'Tomato',
    issue: 'Early Blight',
    confidence: 86,
    severity: 'medium',
    description:
      'The symptoms appear consistent with early blight, a fungal infection that causes dark, target-like spots on older leaves with yellowing around them.',
    treatment: 'Fungicide',
    product: 'Mancozeb',
    priceRange: '₦3,500 – ₦5,000',
  },
  {
    crop: 'Tomato',
    issue: 'Late Blight',
    confidence: 81,
    severity: 'high',
    description:
      'The symptoms are consistent with late blight — water-soaked, greasy patches on leaves and fruit that spread quickly in cool, wet weather.',
    treatment: 'Fungicide',
    product: 'Copper-based fungicide',
    priceRange: '₦6,000 – ₦8,500',
  },
  {
    crop: 'Maize',
    issue: 'Fall Armyworm',
    confidence: 84,
    severity: 'high',
    description:
      'The signs are consistent with fall armyworm feeding — ragged holes and window-pane damage on young leaves with frass in the whorl.',
    treatment: 'Insecticide',
    product: 'Chlorpyrifos 480EC',
    priceRange: '₦4,500 – ₦6,500',
  },
  {
    crop: 'Cassava',
    issue: 'Mosaic Disease',
    confidence: 79,
    severity: 'medium',
    description:
      'The symptoms are consistent with cassava mosaic disease — a yellow-green mosaic pattern and distorted, stunted leaves.',
    treatment: 'Virus-free planting material',
    product: 'Certified disease-free cuttings',
    priceRange: '₦250 – ₦500 per bundle',
  },
  {
    crop: 'Pepper',
    issue: 'Leaf Curl Virus',
    confidence: 82,
    severity: 'high',
    description:
      'The symptoms are consistent with leaf curl virus — upward curling, puckered leaves with plant stunting. Often spread by whiteflies.',
    treatment: 'Insecticide + virus management',
    product: 'Imidacloprid 70WG',
    priceRange: '₦4,000 – ₦6,000',
  },
  {
    crop: 'Rice',
    issue: 'Blast Disease',
    confidence: 80,
    severity: 'medium',
    description:
      'The symptoms are consistent with rice blast — spindle-shaped lesions with grey centres on leaves and brown spots on leaf margins.',
    treatment: 'Fungicide',
    product: 'Tricyclazole 75WP',
    priceRange: '₦5,500 – ₦7,500',
  },
]

export const SCAN_STEPS = [
  'Uploading image…',
  'Detecting crop type…',
  'Analysing leaf patterns…',
  'Matching disease signatures…',
  'Estimating confidence…',
  'Preparing recommendation…',
]

export const SCAN_STEP_MS = 520

// For the demo, a photo whose file name mentions a crop (e.g. tomato.jpg)
// produces a deterministic profile so the flow is easy to demonstrate.
// Otherwise a lightweight hash of the image content picks the result.
function pickDiagnosis(file: File): Diagnosis {
  const name = file.name.toLowerCase()
  const matching = DIAGNOSES.filter((d) => name.includes(d.crop.toLowerCase()))
  if (matching.length > 0) {
    if (name.includes('tomato')) return { ...DIAGNOSES[0] }
    const byCrop = matching[matching.length - 1]
    const jitter = Math.round(Math.random() * 6)
    return { ...byCrop, confidence: Math.min(94, byCrop.confidence + jitter - 2) }
  }
  const index = Math.floor(Math.random() * DIAGNOSES.length)
  return { ...DIAGNOSES[index] }
}

export function scanImage(file: File): Promise<Diagnosis> {
  return new Promise((resolve) => {
    void file
    const result = pickDiagnosis(file)
    window.setTimeout(() => resolve(result), SCAN_STEPS.length * SCAN_STEP_MS)
  })
}