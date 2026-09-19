import type { CropScanResult, ScanRecord } from '../types'

const STORAGE_KEY = 'cropguard:ai-scans'

function cropEmoji(name: string): string {
  const map: Record<string, string> = {
    maize: '🌽',
    corn: '🌽',
    tomato: '🍅',
    cassava: '🌱',
    potato: '🥔',
    rice: '🌾',
    wheat: '🌾',
    beans: '🫘',
    cabbage: '🥬',
    cucumber: '🥒',
    pepper: '🌶️',
    yam: '🍠',
  }
  return map[name.toLowerCase()] ?? '🌿'
}

export function readScans(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ScanRecord[]) : []
  } catch {
    return []
  }
}

export function saveScan(scan: ScanRecord): ScanRecord[] {
  const current = readScans()
  const next = [scan, ...current].slice(0, 50)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 10)))
    } catch {
      // Storage unavailable fallback
    }
  }

  // Asynchronously save to SQLite backend
  if (scan.result) {
    fetch('/api/scans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: scan.id,
        cropName: scan.cropName,
        condition: scan.status,
        confidence: scan.confidence,
        diseaseName: scan.diseaseName,
        scientificName: scan.result.scientificName,
        description: scan.result.description,
        symptoms: scan.result.symptoms,
        causes: scan.result.causes,
        treatment: scan.result.treatment,
        prevention: scan.result.prevention,
        recommendations: scan.result.recommendations,
        precautions: scan.result.precautions,
        thumbnail: scan.thumbnail,
      }),
    }).catch((err) => console.warn('Syncing scan to backend failed:', err))
  }

  return next
}

export function buildScanRecord(
  fileName: string,
  thumbnail: string,
  result: CropScanResult,
): ScanRecord {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return {
    id: `ai-${Date.now()}`,
    cropName: result.cropName,
    cropEmoji: cropEmoji(result.cropName),
    fileName,
    date,
    time,
    status: result.condition,
    confidence: result.confidence,
    diseaseName: result.diseaseName ?? undefined,
    location: 'AI camera scan',
    source: 'ai',
    result,
    thumbnail,
  }
}

export async function fileToThumbnail(
  file: File,
  maxSize = 320,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not resize the image.'))
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load the image.'))
    }
    img.src = url
  })
}

export function subscribeScans(onChange: (scans: ScanRecord[]) => void): () => void {
  const handler = () => onChange(readScans())
  window.addEventListener('cropguard-scan-saved', handler)
  return () => window.removeEventListener('cropguard-scan-saved', handler)
}

export function notifyScanSaved(): void {
  window.dispatchEvent(new Event('cropguard-scan-saved'))
}