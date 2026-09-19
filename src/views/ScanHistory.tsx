import { MapPin, ScanLine } from 'lucide-react'
import type { ScanRecord } from '../lib/types'

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function ScanHistory({
  scans,
  onViewSuppliers,
  onScanNew,
}: {
  scans: ScanRecord[]
  onViewSuppliers: (record: ScanRecord) => void
  onScanNew: () => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl bg-gradient-to-br from-forest-700 to-forest-900 p-6 text-white shadow-lg shadow-forest-800/20">
        <div className="text-xs font-bold uppercase tracking-widest text-forest-300">
          Farmer history
        </div>
        <h1 className="mt-1 text-2xl font-extrabold">My scan history</h1>
        <p className="mt-1 text-sm text-forest-200/80">
          {scans.length > 0
            ? `${scans.length} saved scan${scans.length === 1 ? '' : 's'} stored on this device.`
            : 'No scans saved yet. Scan your first crop to start.'}
        </p>
      </section>

      {scans.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-forest-100 bg-white p-10 text-center shadow-sm">
          <ScanLine size={36} className="text-forest-300" />
          <div className="text-sm font-bold text-forest-900">Nothing here yet</div>
          <button
            onClick={onScanNew}
            className="rounded-xl bg-forest-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-forest-700"
          >
            Scan your first crop
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {scans.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-2xl border border-forest-100 bg-white p-3.5 shadow-sm"
            >
              {s.thumb ? (
                <img
                  src={s.thumb}
                  alt={s.crop}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-forest-100 text-forest-600">
                  <ScanLine size={24} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-sm font-extrabold text-forest-900">{s.crop}</span>
                  <span className="rounded-full bg-forest-600/10 px-2 py-0.5 text-[11px] font-bold text-forest-700">
                    {s.issue}
                  </span>
                  <span className="text-[11px] font-semibold text-forest-800/60">
                    {s.confidence}% confidence
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-forest-800/60">
                  {s.date && formatDate(s.date)} · Suggested: {s.product}
                </div>
              </div>
              <button
                onClick={() => onViewSuppliers(s)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-forest-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-forest-700"
              >
                <MapPin size={13} />
                Find suppliers
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}