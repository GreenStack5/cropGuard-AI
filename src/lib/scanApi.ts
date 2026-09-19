import type { CropScanResult } from '../types'

export class ScanApiError extends Error {
  code: string
  constructor(message: string, code = 'SCAN_ERROR') {
    super(message)
    this.name = 'ScanApiError'
    this.code = code
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        resolve(result.split(',')[1] ?? '')
      } else {
        reject(new Error('Could not read the image file.'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read the image file.'))
    reader.readAsDataURL(file)
  })
}

export async function analyzeCropImages(files: File[]): Promise<CropScanResult> {
  const images = await Promise.all(
    files.slice(0, 4).map(async (file) => ({
      mimeType: file.type || 'image/jpeg',
      data: await fileToBase64(file),
    })),
  )

  let response: Response
  try {
    response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images }),
    })
  } catch (error) {
    const detail =
      error instanceof Error && error.message
        ? error.message
        : 'No connection to the analysis service.'
    throw new ScanApiError(detail, 'NETWORK_ERROR')
  }

  if (response.status === 503) {
    throw new ScanApiError(
      'The analysis service is not configured on the server yet. Please add the AI API key to the server environment.',
      'ANALYSIS_NOT_CONFIGURED',
    )
  }

  if (response.status === 413) {
    throw new ScanApiError('That image is too large. Please choose a smaller file.', 'PAYLOAD_TOO_LARGE')
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string
    } | null
    throw new ScanApiError(
      payload?.error ?? 'The analysis service failed. Please try again.',
      'UPSTREAM_ERROR',
    )
  }

  const payload = (await response.json()) as { result: CropScanResult }
  return payload.result
}