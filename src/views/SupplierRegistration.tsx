import { useState } from 'react'
import { Store } from 'lucide-react'
import type { Supplier } from '../lib/types'
import { LOCATIONS } from '../lib/storage'

const STATES = Object.keys(LOCATIONS)

export function SupplierRegistration({
  onCreated,
  onCancel,
}: {
  onCreated: (supplier: Supplier) => void
  onCancel: () => void
}) {
  const [shopName, setShopName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState('Lagos')
  const [lga, setLga] = useState(LOCATIONS['Lagos'][0])
  const [address, setAddress] = useState('')
  const [productName, setProductName] = useState('Mancozeb')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('units')
  const [error, setError] = useState<string | null>(null)

  const lgAs = LOCATIONS[state] ?? LOCATIONS['Lagos']

  const submit = () => {
    if (!shopName.trim() || !ownerName.trim() || !phone.trim()) {
      setError('Please fill in shop name, owner name and phone number.')
      return
    }
    const priceN = Number(price)
    const qtyN = Number(quantity)
    if (!productName.trim() || Number.isNaN(priceN) || Number.isNaN(qtyN) || qtyN < 0) {
      setError('Please add a valid product (name, price and quantity).')
      return
    }
    setError(null)
    const supplier: Supplier = {
      id: `shop-${Date.now()}`,
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      state,
      lga,
      address: address.trim() || `${lgAs[0] || ''}, ${state}`,
      verified: false,
      createdAt: new Date().toISOString(),
      x: 24 + Math.random() * 6,
      y: 16 + Math.random() * 6,
      products: [
        {
          id: `p-${Date.now()}`,
          name: productName.trim(),
          price: Math.max(0, priceN),
          stock: Math.max(0, qtyN),
          unit: unit.trim() || 'units',
        },
      ],
    }
    onCreated(supplier)
  }

  const field =
    'w-full rounded-xl border border-forest-200 bg-forest-50/50 px-3 py-2.5 text-sm outline-none transition focus:border-forest-500'
  const label = 'text-xs font-bold text-forest-800/60'

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl bg-gradient-to-br from-forest-700 to-forest-900 p-6 text-white shadow-lg shadow-forest-800/20">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-300">
          <Store size={14} />
          CropGuard AI · Agro Supplier
        </div>
        <h1 className="mt-1 text-2xl font-extrabold">Register your supplier profile</h1>
        <p className="mt-1 text-sm text-forest-200/80">
          Your shop will appear to nearby farmers once you add products.
        </p>
      </section>

      <section className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm">
        <div className="text-sm font-extrabold text-forest-900">Shop details</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className={label}>Shop name</span>
            <input value={shopName} onChange={(e) => setShopName(e.target.value)} className={field} placeholder="e.g. GreenFarm Agro Services" />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>Owner name</span>
            <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className={field} placeholder="Full name" />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>Phone number</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={field} placeholder="08000000000" inputMode="tel" />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>Shop address</span>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className={field} placeholder="Street, area" />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>State</span>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value)
                setLga(LOCATIONS[e.target.value]?.[0] ?? lga)
              }}
              className={field}
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>LGA / Area</span>
            <select value={lgAs.includes(lga) ? lga : lgAs[0]} onChange={(e) => setLga(e.target.value)} className={field}>
              {lgAs.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm">
        <div className="text-sm font-extrabold text-forest-900">First product</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className={label}>Product name</span>
            <input value={productName} onChange={(e) => setProductName(e.target.value)} className={field} placeholder="e.g. Mancozeb" />
          </label>
          <label className="flex flex-col gap-1">
            <span className={label}>Price (₦)</span>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className={field} placeholder="4000" inputMode="numeric" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className={label}>Quantity</span>
              <input value={quantity} onChange={(e) => setQuantity(e.target.value)} className={field} placeholder="10" inputMode="numeric" />
            </label>
            <label className="flex flex-col gap-1">
              <span className={label}>Unit</span>
              <input value={unit} onChange={(e) => setUnit(e.target.value)} className={field} placeholder="units / bags" />
            </label>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <button
          onClick={submit}
          className="rounded-2xl bg-forest-600 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-forest-600/25 transition hover:-translate-y-0.5 hover:bg-forest-700"
        >
          CREATE SUPPLIER PROFILE
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-forest-200 bg-white px-4 py-2.5 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}