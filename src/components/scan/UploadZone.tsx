import { useRef, useState, type DragEvent } from 'react'
import { Camera, ImagePlus, UploadCloud } from 'lucide-react'
import { cn } from '../../lib/utils'

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export function UploadZone({
  onFile,
  onCamera,
}: {
  onFile: (file: File) => void
  onCamera?: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = Array.from(files).find(isImageFile)
    if (file) onFile(file)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div className="rounded-3xl border border-brand-200/60 bg-[rgba(226,255,219,0.4)] p-5 sm:p-8">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFiles(event.currentTarget.files)}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-150 sm:py-16',
          dragging
            ? 'border-brand-600 bg-white/70'
            : 'border-brand-500/40 bg-white/0 hover:border-brand-500 hover:bg-white/50',
        )}
      >
        <span
          className={cn(
            'flex size-16 items-center justify-center rounded-2xl transition-colors',
            dragging ? 'bg-brand-700 text-white' : 'bg-brand-700/10 text-brand-800',
          )}
        >
          <UploadCloud className="size-8" />
        </span>
        <h3 className="mt-5 text-lg font-extrabold text-ink">
          {dragging ? 'Drop the image here' : 'Upload a crop image'}
        </h3>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-stone-600">
          Drag and drop a clear photo of the affected leaves, or{' '}
          <span className="font-bold text-brand-700">browse files</span>. JPG or
          PNG, up to 10 MB.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm">
          <ImagePlus className="size-4" />
          Choose image
        </span>
      </div>

      {onCamera ? (
        <div className="mt-5 flex items-center gap-4">
          <span className="hidden h-px flex-1 bg-brand-200/70 sm:block" />
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            or
          </p>
          <span className="hidden h-px flex-1 bg-brand-200/70 sm:block" />
          <button
            type="button"
            onClick={onCamera}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-700/20 bg-white px-5 py-2.5 text-sm font-bold text-brand-800 shadow-sm transition-colors hover:border-brand-500 hover:bg-brand-50"
          >
            <Camera className="size-4" />
            Use live camera
          </button>
        </div>
      ) : null}
    </div>
  )
}