import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  AlertCircle,
  Camera,
  Check,
  ImageOff,
  Lightbulb,
  ScanLine,
  ScanSearch,
  Sparkles,
  X,
} from 'lucide-react'

import { crops, scanningSteps } from '../../data/mock'
import type { CropScanResult, ScanState } from '../../types'
import { analyzeCropImages, ScanApiError } from '../../lib/scanApi'
import {
  buildScanRecord,
  fileToThumbnail,
  notifyScanSaved,
  saveScan,
} from '../../lib/scanStorage'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import { Spinner } from '../../components/ui/indicators'
import { CameraCapture } from '../../components/scan/CameraCapture'
import { ScanResult } from '../../components/scan/ScanResult'
import { UploadZone } from '../../components/scan/UploadZone'
import { cn } from '../../lib/utils'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export function ScanCrop() {
  const [state, setState] = useState<ScanState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CropScanResult | null>(null)
  const [step, setStep] = useState(0)
  const [showCamera, setShowCamera] = useState(false)
  const [activeFile, setActiveFile] = useState<File | null>(null)

  const runSteps = () => {
    scanningSteps().forEach((_, index) => {
      window.setTimeout(
        () => setStep((current) => Math.max(current, index + 1)),
        (index + 1) * 1100,
      )
    })
  }

  const handleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError('That image is larger than 10 MB. Please choose a smaller file.')
      setState('error')
      setPreview(null)
      setActiveFile(null)
      return
    }
    setError(null)
    setFileName(file.name)
    setActiveFile(file)
    setPreview(URL.createObjectURL(file))
    setState('preview')
    setResult(null)
    setStep(0)
  }

  const reset = () => {
    setPreview(null)
    setFileName(null)
    setActiveFile(null)
    setError(null)
    setState('idle')
    setResult(null)
    setStep(0)
    setShowCamera(false)
  }

  const startScan = async () => {
    if (!activeFile) return
    setStep(0)
    runSteps()
    setState('scanning')
    setError(null)

    try {
      const analysis = await analyzeCropImages([activeFile])
      setResult(analysis)
      setStep(scanningSteps().length)

      let thumbnail = ''
      try {
        thumbnail = await fileToThumbnail(activeFile)
      } catch {
        thumbnail = ''
      }

      const record = buildScanRecord(activeFile.name, thumbnail, analysis)
      saveScan(record)
      notifyScanSaved()

      setState('result')
    } catch (scanError) {
      const message =
        scanError instanceof ScanApiError
          ? scanError.message
          : 'The analysis service failed. Please try again in a moment.'
      setError(message)
      setState('error')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scan Your Crop"
        subtitle="Upload a photo to identify possible crop diseases."
      />

      {state === 'result' && result ? (
        <ScanResult result={result} onReset={reset} image={preview} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {showCamera && state !== 'scanning' ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CameraCapture
                    initialImage={preview}
                    onCapture={(files) => {
                      const file = files[0]
                      if (file) handleFile(file)
                      setShowCamera(false)
                    }}
                    onClose={() => setShowCamera(false)}
                  />
                </motion.div>
              ) : state === 'idle' ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UploadZone
                    onFile={handleFile}
                    onCamera={() => setShowCamera(true)}
                  />
                </motion.div>
              ) : state === 'preview' || state === 'scanning' ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]">
                    <div className="relative">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                        {preview ? (
                          <img
                            src={preview}
                            alt="Crop preview"
                            className="size-full object-contain"
                          />
                        ) : null}

                        {state === 'scanning' ? (
                          <div className="absolute inset-0">
                            <div
                              className="pointer-events-none absolute inset-0 overflow-hidden"
                              style={{
                                background:
                                  'linear-gradient(to bottom, transparent 30%, rgba(46,108,69,0.18) 35%, rgba(46,108,69,0.18) 40%, transparent 45%)',
                              }}
                            />
                            <motion.div
                              initial={{ top: '-10%' }}
                              animate={{ top: '110%' }}
                              transition={{
                                duration: 1.4,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                              className="absolute left-0 right-0 z-10 flex items-center justify-center"
                            >
                              <ScanLine className="size-5 text-brand-700 drop-shadow" />
                            </motion.div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/25 to-transparent p-4">
                              <p className="text-center text-sm font-bold text-white drop-shadow">
                                Analysing {fileName ?? 'image'}…
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 p-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-ink">
                            {fileName}
                          </p>
                          <p className="text-xs text-stone-400">
                            {state === 'preview'
                              ? 'Image ready to analyse'
                              : 'Analysing with AI…'}
                          </p>
                        </div>
                        {state === 'preview' ? (
                          <div className="flex shrink-0 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={reset}
                              leadingIcon={<X className="size-4" />}
                            >
                              Remove
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowCamera(true)}
                              leadingIcon={<Camera className="size-4" />}
                            >
                              Retake
                            </Button>
                            <Button
                              size="sm"
                              onClick={startScan}
                              leadingIcon={<Sparkles className="size-4" />}
                            >
                              Start analysis
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {state === 'scanning' ? (
                    <AnalyzingPanel step={step} fileName={fileName ?? 'image'} />
                  ) : null}
                </motion.div>
              ) : state === 'error' ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
                >
                  <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <AlertCircle className="size-7" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-red-800">
                    Could not analyse that image
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-red-700">
                    {error}
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={reset}
                      leadingIcon={<ImageOff className="size-4" />}
                    >
                      Try a different image
                    </Button>
                    {activeFile ? (
                      <Button
                        onClick={startScan}
                        leadingIcon={<Sparkles className="size-4" />}
                      >
                        Retry analysis
                      </Button>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-[var(--shadow-card)]">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <Camera className="size-4 text-brand-700" />
                Tips for a good scan
              </p>
              <ul className="mt-3 space-y-2.5 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                  Hold the camera 20–30 cm from the leaf.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                  Shoot in natural light, avoiding strong shadows.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                  Capture the affected area and a bit of healthy leaf.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                  Remove dust with a soft cloth before shooting.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-800">
                <Lightbulb className="size-4" />
                About this tool
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-800/90">
                Results are generated by AI and should be confirmed with a local
                agricultural expert before applying any treatment.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-[var(--shadow-card)]">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <ScanSearch className="size-4 text-brand-700" />
                Supported crops
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {crops.map((crop) => (
                  <Badge key={crop.id} tone="brand">
                    {crop.name}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function AnalyzingPanel({ step, fileName }: { step: number; fileName: string }) {
  const done = step >= scanningSteps().length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-2xl border border-stone-200/70 bg-white p-5 shadow-[var(--shadow-card)]"
    >
      <p className="flex items-center gap-3 text-base font-extrabold text-ink">
        <Spinner className="size-5" />
        {done ? 'Preparing your report…' : 'Analyzing your crop....'}
      </p>
      <p className="mt-1.5 text-sm text-stone-500">
        CropGuard AI is examining {fileName} for possible disease symptoms.
      </p>
      <ul className="mt-4 space-y-3">
        {scanningSteps().map((text, index) => {
          const isDone = step > index
          const active = step === index + 1
          return (
            <li key={text} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full',
                  isDone && 'bg-green-100 text-green-700',
                  active && 'bg-brand-700 text-white',
                  !isDone && !active && 'bg-stone-100 text-stone-400',
                )}
              >
                {isDone ? (
                  <Check className="size-3.5" />
                ) : active ? (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="size-2 rounded-full bg-white"
                  />
                ) : (
                  <span className="size-2 rounded-full bg-stone-300" />
                )}
              </span>
              <span
                className={cn(
                  'font-medium',
                  isDone ? 'text-stone-400' : active ? 'text-ink' : 'text-stone-400',
                )}
              >
                {text}
              </span>
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}