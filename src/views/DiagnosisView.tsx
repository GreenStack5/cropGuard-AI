import {
  Activity,
  AlertTriangle,
  Check,
  Info,
  MapPin,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import type { Diagnosis } from '../lib/types'

export function DiagnosisView({
  diagnosis,
  onFindSuppliers,
  onScanAgain,
}: {
  diagnosis: Diagnosis
  onFindSuppliers: () => void
  onScanAgain: () => void
}) {
  const sev =
    diagnosis.severity === 'high'
      ? { label: 'High', cls: 'bg-red-100 text-red-700' }
      : diagnosis.severity === 'medium'
        ? { label: 'Medium', cls: 'bg-amber-100 text-amber-800' }
        : { label: 'Low', cls: 'bg-green-100 text-green-800' }

  return (
    <div className="flex flex-col gap-5">
      <section
        className={`flex items-center justify-between rounded-t-3xl p-5 text-white shadow-sm ${
          diagnosis.severity === 'high'
            ? 'bg-gradient-to-br from-red-600 to-red-800'
            : 'bg-gradient-to-br from-forest-600 to-forest-800'
        }`}
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/70">
            Scan result
          </div>
          <h1 className="mt-1 text-2xl font-extrabold">{diagnosis.crop}</h1>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${sev.cls}`}>
          Severity: {sev.label}
        </span>
      </section>

      <section className="-mt-5 space-y-5 rounded-3xl border border-forest-100 bg-white p-5 shadow-md">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-forest-50/70 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-forest-800/60">
              <Activity size={14} />
              Possible issue
            </div>
            <div className="mt-1 text-lg font-extrabold text-forest-900">{diagnosis.issue}</div>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-forest-100">
                <div
                  className="h-full rounded-full bg-forest-600"
                  style={{ width: `${diagnosis.confidence}%` }}
                />
              </div>
              <span className="text-sm font-extrabold text-forest-700">
                {diagnosis.confidence}%
              </span>
            </div>
            <div className="mt-1 text-[11px] text-forest-800/50">Confidence</div>
          </div>

          <div className="rounded-2xl bg-forest-50/70 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-forest-800/60">
              <Check size={14} />
              Recommended treatment
            </div>
            <div className="mt-1 text-lg font-extrabold text-forest-900">{diagnosis.treatment}</div>
            <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-forest-700">
              <PackageCheck size={16} />
              {diagnosis.product}
            </div>
            <div className="mt-1 text-sm font-bold text-forest-800/70">
              Est. price: {diagnosis.priceRange}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-forest-100 bg-white p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-forest-800/60">
            Description
          </div>
          <p className="mt-1 text-sm leading-relaxed text-forest-900/80">{diagnosis.description}</p>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          AI-assisted result. Confirm diagnosis with a qualified agricultural professional before
          treatment.
        </div>
      </section>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={onFindSuppliers}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-forest-600 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-forest-600/25 transition hover:-translate-y-0.5 hover:bg-forest-700"
        >
          <MapPin size={20} />
          FIND NEARBY SUPPLIERS
        </button>
        <div className="flex items-center justify-center gap-2 text-xs text-forest-800/60">
          <ShieldCheck size={14} className="text-forest-500" />
          <Info size={14} className="text-forest-500" />
          We'll match you with Agro Suppliers that stock {diagnosis.product}.
        </div>
        <button
          onClick={onScanAgain}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-forest-200 bg-white px-6 py-3 text-sm font-bold text-forest-700 transition hover:bg-forest-50"
        >
          <RotateCcw size={16} />
          SCAN ANOTHER CROP
        </button>
      </div>
    </div>
  )
}