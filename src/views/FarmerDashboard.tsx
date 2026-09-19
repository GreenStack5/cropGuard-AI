import { useState } from 'react'
import { ArrowRight, History, MapPin, Pencil, ScanLine, Store } from 'lucide-react'
import type { FarmerLocation, ScanRecord } from '../lib/types'
import { LocationPicker } from '../components/LocationPicker'

function formatDay(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function FarmerDashboard({
  farmerName,
  location,
  onChangeLocation,
  onScan,
  onFindSuppliers,
  onHistory,
  scans,
}: {
  farmerName: string | null
  location: FarmerLocation
  onChangeLocation: (next: FarmerLocation) => void
  onScan: () => void
  onFindSuppliers: () => void
  onHistory: () => void
  scans: ScanRecord[]
}) {
  const [editingLocation, setEditingLocation] = useState(false)
  const recent = [...scans].slice(-3).reverse()

  return (
    <div className="flex flex-col gap-5">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-forest-700 via-forest-800 to-forest-950 p-6 text-white shadow-lg shadow-forest-800/30 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-md">
            <div className="text-xs font-bold uppercase tracking-widest text-forest-300">
              Overview
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {farmerName
                ? `Welcome back, ${farmerName.split(' ')[0]}.`
                : 'How can we help your farm today?'}
            </h1>
            <p className="mt-1 text-sm text-forest-200/80">
              Scan a crop, get a recommendation and find nearby Agro Suppliers — all in one place.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur">
            <MapPin size={18} className="text-forest-300" />
            <div className="leading-tight">
              <div className="text-xs text-forest-200/80">{location.state}</div>
              <div className="text-sm font-bold text-white">{location.lga}</div>
            </div>
            <button
              onClick={() => setEditingLocation(true)}
              className="ml-1 rounded-lg bg-white/15 p-1.5 text-forest-200 transition hover:bg-white/25"
              aria-label="Change location"
            >
              <Pencil size={14} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={onScan}
            className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-forest-800 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <ScanLine size={20} className="text-forest-600" />
            Scan my crop
          </button>
          <button
            onClick={onFindSuppliers}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
          >
            <Store size={18} />
            Find Agro Suppliers
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <button
          onClick={onFindSuppliers}
          className="group rounded-2xl border border-forest-100 bg-white p-4 text-left shadow-sm transition hover:border-forest-400 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600/10 text-forest-700">
            <Store size={20} />
          </div>
          <div className="mt-3 text-sm font-extrabold text-forest-900">Find Agro Suppliers</div>
          <div className="mt-0.5 text-xs text-forest-800/60">
            Compare price, distance and stock near {location.lga}.
          </div>
        </button>
        <button
          onClick={onHistory}
          className="group rounded-2xl border border-forest-100 bg-white p-4 text-left shadow-sm transition hover:border-forest-400 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600/10 text-forest-700">
            <History size={20} />
          </div>
          <div className="mt-3 text-sm font-extrabold text-forest-900">Scan history</div>
          <div className="mt-0.5 text-xs text-forest-800/60">
            {scans.length > 0
              ? `${scans.length} saved scan${scans.length === 1 ? '' : 's'} on this device.`
              : 'Revisit past scans and re-find suppliers.'}
          </div>
        </button>
        <button
          onClick={() => setEditingLocation(true)}
          className="group rounded-2xl border border-forest-100 bg-white p-4 text-left shadow-sm transition hover:border-forest-400 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600/10 text-forest-700">
            <MapPin size={20} />
          </div>
          <div className="mt-3 text-sm font-extrabold text-forest-900">Working area</div>
          <div className="mt-0.5 text-xs text-forest-800/60">
            {location.state} · {location.lga} — change anytime.
          </div>
        </button>
      </section>

      {editingLocation && (
        <section className="animate-[fadeIn_.2s_ease-out]">
          <LocationPicker location={location} onChange={onChangeLocation} />
          <button
            onClick={() => setEditingLocation(false)}
            className="mt-2 w-full rounded-xl border border-forest-200 bg-white px-4 py-2.5 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
          >
            Done
          </button>
        </section>
      )}

      {recent.length > 0 && (
        <section className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-forest-800/50">
              Recent scans
            </div>
            <button
              onClick={onHistory}
              className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 transition hover:text-forest-900"
            >
              View all
              <ArrowRight size={13} />
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-2.5">
            {recent.map((s) => (
              <button
                key={s.id}
                onClick={onHistory}
                className="flex items-center gap-3 rounded-xl border border-forest-100 bg-forest-50/50 p-2.5 text-left transition hover:border-forest-300 hover:bg-forest-50"
              >
                {s.thumb ? (
                  <img
                    src={s.thumb}
                    alt={s.crop}
                    className="h-11 w-11 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest-100 text-forest-600">
                    <ScanLine size={20} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-extrabold text-forest-900">{s.crop}</span>
                    <span className="rounded-full bg-forest-600/10 px-2 py-0.5 text-[11px] font-bold text-forest-700">
                      {s.issue}
                    </span>
                  </div>
                  <div className="text-[11px] text-forest-800/60">
                    {formatDay(s.date)} · {s.confidence}% confidence · {s.product}
                  </div>
                </div>
                <ArrowRight size={15} className="shrink-0 text-forest-400" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}