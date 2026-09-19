import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CameraOff, RefreshCw, RotateCcw, ScanLine, X } from 'lucide-react'
import { useCamera } from '../../hooks/useCamera'
import { Button } from '../ui/Button'
import { Spinner } from '../ui/indicators'

export function CameraCapture({
  onCapture,
  onClose,
  initialImage,
}: {
  onCapture: (files: File[]) => void
  onClose: () => void
  initialImage?: string | null
}) {
  const { videoRef, status, capture, retry } = useCamera()
  const [captured, setCaptured] = useState<string | null>(initialImage ?? null)

  const take = async () => {
    try {
      const file = await capture()
      setCaptured(URL.createObjectURL(file))
    } catch {
      setCaptured(null)
    }
  }

  const confirm = () => {
    if (captured) {
      fetch(captured)
        .then((res) => res.blob())
        .then((blob) => {
          onCapture([new File([blob], 'camera.jpg', { type: 'image/jpeg' })])
        })
        .catch(() => onClose())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
        <p className="flex items-center gap-2 text-base font-bold text-ink">
          <ScanLine className="size-5 text-brand-700" />
          Live camera scan
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-ink"
          aria-label="Close camera"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="p-5 sm:p-6">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-black">
          {status === 'starting' || status === 'capturing' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-900 text-white">
              <Spinner className="border-white/20 border-t-white" />
              <p className="text-sm text-white/70">Starting camera…</p>
            </div>
          ) : status === 'ready' ? (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-900 px-6 text-center text-white">
              <CameraOff className="size-10 text-white/40" />
              <p className="text-sm font-bold">
                {status === 'denied'
                  ? 'Camera permission was blocked'
                  : 'Camera is not available'}
              </p>
              <p className="max-w-xs text-xs text-white/60">
                {status === 'denied'
                  ? 'Allow camera access in your browser settings, or upload a photo instead.'
                  : 'This device has no camera, or camera access is not supported here. You can still upload a photo.'}
              </p>
              {status === 'denied' ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={retry}
                  leadingIcon={<RotateCcw className="size-4" />}
                  className="text-white hover:bg-white/10"
                >
                  Try again
                </Button>
              ) : null}
            </div>
          )}

          {status === 'ready' ? (
            <>
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-brand-700/70 ring-inset">
                <div className="absolute left-1/2 top-1/2 aspect-[4/3] w-[70%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-dashed border-white/70" />
                <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90" />
              </div>
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={take}
                  aria-label="Take photo"
                  className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-brand-700/80 text-white shadow-lg backdrop-blur-sm"
                >
                  <span className="size-12 rounded-full bg-white" />
                </motion.button>
              </div>
            </>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-sm text-sm text-stone-500">
            Hold the camera 20–30 cm from the leaf in natural light.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {captured ? (
              <Button
                size="sm"
                onClick={confirm}
                leadingIcon={<RefreshCw className="size-4" />}
              >
                Use this photo
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {captured ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border-t border-stone-100 px-5 py-4 sm:px-6"
          >
            <div className="flex items-center gap-4">
              <img
                src={captured}
                alt="Captured preview"
                className="size-16 rounded-xl object-cover ring-2 ring-brand-700/40"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink">Photo captured</p>
                <p className="text-xs text-stone-500">
                  Review it, retake, or use it for the analysis.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={take}>
                  Retake
                </Button>
                <Button size="sm" onClick={confirm}>
                  Use photo
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}