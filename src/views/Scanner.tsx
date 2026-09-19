import { useEffect, useRef, useState } from 'react'
import { Camera, ImageUp, Loader2, ScanLine, UploadCloud } from 'lucide-react'
import type { Diagnosis } from '../lib/types'
import { scanImage, SCAN_STEPS, SCAN_STEP_MS } from '../lib/analyze'

function makeThumb(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        const size = 160
        const scale = Math.min(1, size / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(null)
          return
        }
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.6))
      }
      img.onerror = () => resolve(null)
      img.src = url
    } catch {
      resolve(null)
    }
  })
}

export function Scanner({
  onComplete,
  onCancel,
}: {
  onComplete: (diagnosis: Diagnosis, thumb: string | null) => void
  onCancel: () => void
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [stepIndex, setStepIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cancelledRef = useRef(false)

  useEffect(() => {
    if (stepIndex < 0 || stepIndex >= SCAN_STEPS.length - 1) return
    const t = window.setTimeout(() => setStepIndex((i) => i + 1), SCAN_STEP_MS)
    return () => window.clearTimeout(t)
  }, [stepIndex])

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG or PNG).')
      return
    }
    setError(null)
    cancelledRef.current = false
    setPreview(URL.createObjectURL(file))
    setStepIndex(0)

    scanImage(file).then(async (diagnosis) => {
      if (cancelledRef.current) return
      const thumb = await makeThumb(file)
      if (cancelledRef.current) return
      onComplete(diagnosis, thumb)
    })
  }

  const cancel = () => {
    cancelledRef.current = true
    onCancel()
  }

  const working = stepIndex >= 0
  const progress = working
    ? Math.round(((stepIndex + 1) / SCAN_STEPS.length) * 100)
    : 0

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl bg-gradient-to-br from-forest-700 to-forest-900 p-6 text-white shadow-lg shadow-forest-800/20">
        <div className="text-xs font-bold uppercase tracking-widest text-forest-300">
          Scan a crop
        </div>
        <h1 className="mt-1 text-2xl font-extrabold">Snap or upload a clear photo of the leaves</h1>
        <p className="mt-1 text-sm text-forest-200/80">
          A well-lit close-up of the affected leaves gives the best result.
        </p>
      </section>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />

      <div
        onClick={() => !working && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files?.[0]
          if (f) handleFile(f)
        }}
        className={`relative flex min-h-72 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed bg-white p-6 text-center shadow-sm transition ${
          dragging ? 'border-forest-500 bg-forest-50' : 'border-forest-200'
        } ${working ? 'cursor-default' : 'cursor-pointer hover:border-forest-400'}`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Crop preview"
              className="max-h-64 rounded-2xl object-contain shadow-md"
            />
            {working && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-white/70 backdrop-blur-sm">
                <div className="relative">
                  <ScanLine size={44} className="animate-pulse text-forest-600" />
                  <Loader2 className="absolute inset-0 m-auto animate-spin text-forest-800" size={18} />
                </div>
                <div className="text-sm font-bold text-forest-900">
                  {SCAN_STEPS[Math.max(0, stepIndex)] ?? 'Analysing…'}
                </div>
                <div className="h-2 w-56 overflow-hidden rounded-full bg-forest-100">
                  <div
                    className="h-full rounded-full bg-forest-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-600/10 text-forest-600">
              <UploadCloud size={32} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-forest-900">
                Tap to upload or drag an image here
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-forest-800/60">
                <ImageUp size={14} />
                A tomato leaf photo is perfect for the demo
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-sm font-bold text-white">
              <Camera size={16} />
              Choose photo
            </span>
          </>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={cancel}
        disabled={working}
        className={`rounded-xl border border-forest-200 bg-white px-4 py-2.5 text-sm font-semibold text-forest-700 transition ${
          working ? 'cursor-not-allowed opacity-50' : 'hover:bg-forest-50'
        }`}
      >
        Cancel scan
      </button>
    </div>
  )
}