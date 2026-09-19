import { ArrowLeft, Info, MapPin } from 'lucide-react'
import type { FarmerLocation } from '../lib/types'
import { LocationPicker } from '../components/LocationPicker'
import { LOCATIONS } from '../lib/storage'

export function FarmerLocation({
  location,
  onChangeLocation,
  onBack,
}: {
  location: FarmerLocation
  onChangeLocation: (next: FarmerLocation) => void
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl bg-gradient-to-br from-forest-700 to-forest-900 p-6 text-white shadow-lg shadow-forest-800/20">
        <div className="text-xs font-bold uppercase tracking-widest text-forest-300">
          Farmer settings
        </div>
        <h1 className="mt-1 text-2xl font-extrabold">My location</h1>
        <p className="mt-1 text-sm text-forest-200/80">
          Supplier results are matched to your State and LGA, then sorted by distance from your
          area.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur">
          <MapPin size={16} className="text-forest-300" />
          <span className="text-sm font-bold text-white">
            {location.state} · {location.lga}
          </span>
        </div>
      </section>

      <LocationPicker location={location} onChange={onChangeLocation} />

      <section className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-forest-800">
          <Info size={16} className="text-forest-500" />
          Areas covered by the demo
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.keys(LOCATIONS).map((s) => (
            <span
              key={s}
              className="rounded-full bg-forest-50 px-3 py-1 text-xs font-bold text-forest-700"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-forest-800/60">
          Changing your location updates every search instantly — prices and stock belong to each
          supplier, so you will only see shops that actually carry the recommended product.
        </p>
      </section>

      <button
        onClick={onBack}
        className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-forest-200 bg-white px-4 py-2.5 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
      >
        <ArrowLeft size={15} />
        Back to dashboard
      </button>
    </div>
  )
}