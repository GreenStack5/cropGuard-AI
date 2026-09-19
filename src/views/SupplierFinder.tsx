import { useMemo, useState } from 'react'
import { MapPin, PackageSearch, Pencil, Store } from 'lucide-react'
import type { FarmerLocation, Supplier } from '../lib/types'
import { getSuppliers } from '../lib/storage'
import { distanceKm } from '../lib/distance'
import { formatNaira } from '../lib/contact'
import { SupplierCard } from '../components/SupplierCard'
import { LocationPicker } from '../components/LocationPicker'

interface Match {
  supplier: Supplier
  product: Supplier['products'][number]
  distance: number
}

export function SupplierFinder({
  location,
  onChangeLocation,
  initialProduct,
  crop,
}: {
  location: FarmerLocation
  onChangeLocation: (next: FarmerLocation) => void
  initialProduct?: string
  crop?: string | null
}) {
  const [product, setProduct] = useState(initialProduct ?? '')
  const [editingLocation, setEditingLocation] = useState(false)

  const allProducts = useMemo(() => {
    const names = new Set<string>()
    for (const s of getSuppliers()) for (const p of s.products) names.add(p.name)
    return Array.from(names).sort()
  }, [])

  const activeProduct =
    product || (allProducts.includes('Mancozeb') ? 'Mancozeb' : allProducts[0]) || 'Mancozeb'

  const matches = useMemo<Match[]>(() => {
    const list = getSuppliers()
    const result: Match[] = []
    for (const supplier of list) {
      if (supplier.state !== location.state) continue
      for (const p of supplier.products) {
        if (p.name.toLowerCase() !== activeProduct.toLowerCase()) continue
        if (p.stock <= 0) continue
        result.push({ supplier, product: p, distance: distanceKm(location, supplier) })
      }
    }
    return result.sort((a, b) => a.distance - b.distance)
  }, [location, activeProduct])

  const closest = matches.length > 0 ? matches[0].distance : null
  const lowestPrice = matches.length > 0
    ? Math.min(...matches.map((m) => m.product.price))
    : null

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl bg-gradient-to-br from-forest-700 to-forest-900 p-6 text-white shadow-lg shadow-forest-800/20">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-300">
          <Store size={14} />
          Nearby Agro Suppliers
        </div>
        <h1 className="mt-1 text-2xl font-extrabold">
          {matches.length > 0
            ? `${matches.length} supplier${matches.length === 1 ? '' : 's'} near you`
            : 'Finding suppliers…'}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-forest-200/80">
          <MapPin size={14} />
          {location.lga}, {location.state} · {activeProduct}
        </p>
      </section>

      {editingLocation ? (
        <LocationPicker location={location} onChange={onChangeLocation} />
      ) : (
        <button
          onClick={() => setEditingLocation(true)}
          className="flex items-center justify-between rounded-2xl border border-forest-100 bg-white px-4 py-3 shadow-sm transition hover:border-forest-300"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-forest-900">
            <MapPin size={16} className="text-forest-500" />
            Location: {location.lga}, {location.state}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-forest-100 px-3 py-1 text-xs font-bold text-forest-700">
            <Pencil size={12} />
            Change
          </span>
        </button>
      )}

      <section>
        <div className="text-xs font-bold uppercase tracking-widest text-forest-800/60">
          Product
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {allProducts.map((name) => (
            <button
              key={name}
              onClick={() => setProduct(name)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                activeProduct === name
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'bg-white text-forest-800 border border-forest-200 hover:bg-forest-50'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-forest-100 bg-white p-10 text-center shadow-sm">
          <PackageSearch size={36} className="text-forest-300" />
          <div className="text-sm font-bold text-forest-900">
            No Agro Supplier currently stocks {activeProduct} in {location.state}.
          </div>
          <p className="text-xs text-forest-800/60">
            Try another product or change location. This demo ships seeded suppliers across Lagos
            and Ogun.
          </p>
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-forest-100 bg-forest-50/50 p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-widest text-forest-800/60">
              Price comparison — {activeProduct}
            </div>
            <div className="mt-3 space-y-2">
              {matches.map((m) => (
                <div
                  key={m.supplier.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-3.5 py-2.5 shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-extrabold text-forest-900">
                      {m.supplier.shopName}
                    </div>
                    <div className="text-xs text-forest-800/60">
                      {m.supplier.lga} · {m.distance.toFixed(1)} km ·{' '}
                      {m.product.stock.toLocaleString('en-NG')} {m.product.unit}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.distance === closest && (
                      <span className="rounded-full bg-forest-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                        Closest Supplier
                      </span>
                    )}
                    {m.product.price === lowestPrice && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-extrabold text-green-800">
                        Lowest Listed Price
                      </span>
                    )}
                    <span className="text-base font-extrabold text-forest-700">
                      {formatNaira(m.product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {matches.map((m) => (
              <SupplierCard
                key={m.supplier.id}
                supplier={m.supplier}
                location={location}
                product={m.product}
                crop={crop}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}