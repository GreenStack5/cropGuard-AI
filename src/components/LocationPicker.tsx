import { useMemo, useState } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import type { FarmerLocation } from '../lib/types'
import { LOCATIONS } from '../lib/storage'

const STATES = Object.keys(LOCATIONS)

export function LocationPicker({
  location,
  onChange,
}: {
  location: FarmerLocation
  onChange: (next: FarmerLocation) => void
}) {
  const [state, setState] = useState(location.state)
  const [lga, setLga] = useState(location.lga)

  const lgAs = useMemo(() => LOCATIONS[state] ?? LOCATIONS['Lagos'], [state])

  const apply = () => {
    onChange({ state, lga })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-forest-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold text-forest-800">
        <MapPin size={16} className="text-forest-500" />
        Your location
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-forest-800/60">State</span>
          <div className="relative">
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value)
                setLga(LOCATIONS[e.target.value]?.[0] ?? lga)
              }}
              className="w-full appearance-none rounded-xl border border-forest-200 bg-forest-50/50 px-3 py-2.5 pr-8 text-sm font-medium text-forest-900 outline-none transition focus:border-forest-500"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-forest-400"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-forest-800/60">Area / LGA</span>
          <div className="relative">
            <select
              value={lgAs.includes(lga) ? lga : lgAs[0]}
              onChange={(e) => setLga(e.target.value)}
              className="w-full appearance-none rounded-xl border border-forest-200 bg-forest-50/50 px-3 py-2.5 pr-8 text-sm font-medium text-forest-900 outline-none transition focus:border-forest-500"
            >
              {lgAs.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-forest-400"
            />
          </div>
        </label>
      </div>
      <button
        onClick={apply}
        className="rounded-xl bg-forest-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-forest-600/20 transition hover:bg-forest-700"
      >
        Save location
      </button>
    </div>
  )
}