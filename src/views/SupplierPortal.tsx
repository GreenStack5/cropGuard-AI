import { useState } from 'react'
import {
  BadgeCheck,
  Check,
  MapPin,
  PackagePlus,
  Pencil,
  Plus,
  Store,
  X,
} from 'lucide-react'
import type { ProductItem, Supplier } from '../lib/types'
import { getSuppliers, saveSuppliers, setCurrentSupplierId } from '../lib/storage'
import { formatNaira } from '../lib/contact'
import { PendingBadge, StockPill, VerifiedBadge } from '../components/Shell'

const SUGGESTED_PRODUCTS = [
  'Mancozeb',
  'NPK Fertilizer',
  'Urea',
  'Imidacloprid 70WG',
  'Chlorpyrifos 480EC',
  'Tricyclazole 75WP',
]

function ShieldMark({ verified }: { verified: boolean }) {
  return verified ? <VerifiedBadge /> : <PendingBadge />
}

export function SupplierPortal({
  currentSupplierId,
  onRegister,
}: {
  currentSupplierId: string | null
  onRegister: () => void
}) {
  const [supplierId, setSupplierIdState] = useState(currentSupplierId)
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<{ id: string; field: 'price' | 'stock' } | null>(null)
  const [draft, setDraft] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [, setRev] = useState(0)

  const suppliers = getSuppliers()
  const supplier = suppliers.find((s) => s.id === supplierId) ?? suppliers[0]

  const persist = (next: Supplier[]) => {
    saveSuppliers(next)
    setRev((r) => r + 1)
    setToast('Changes saved locally')
    window.setTimeout(() => setToast(null), 2500)
  }

  const patchProduct = (productId: string, patch: Partial<ProductItem>) => {
    if (!supplier) return
    const next = suppliers.map((s) =>
      s.id === supplier.id
        ? {
            ...s,
            products: s.products.map((p) => (p.id === productId ? { ...p, ...patch } : p)),
          }
        : s,
    )
    persist(next)
  }

  const removeProduct = (productId: string) => {
    if (!supplier) return
    const next = suppliers.map((s) =>
      s.id === supplier.id ? { ...s, products: s.products.filter((p) => p.id !== productId) } : s,
    )
    persist(next)
  }

  const addProduct = (name: string, price: number, stock: number, unit: string) => {
    if (!supplier) return
    const next = suppliers.map((s) =>
      s.id === supplier.id
        ? {
            ...s,
            products: [
              ...s.products,
              { id: `p-${Date.now()}`, name, price, stock, unit: unit || 'units' },
            ],
          }
        : s,
    )
    setAdding(false)
    persist(next)
  }

  const switchShop = (id: string) => {
    setCurrentSupplierId(id)
    setSupplierIdState(id)
  }

  if (!supplier) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-forest-100 bg-white p-10 text-center shadow-sm">
        <Store size={36} className="text-forest-300" />
        <div className="text-sm font-bold text-forest-900">No supplier profile found</div>
        <button
          onClick={onRegister}
          className="rounded-xl bg-forest-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-forest-700"
        >
          Register your shop
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl bg-gradient-to-br from-forest-700 via-forest-800 to-forest-950 p-6 text-white shadow-lg shadow-forest-800/30">
        <div className="text-xs font-bold uppercase tracking-widest text-forest-300">
          CropGuard AI
        </div>
        <h1 className="mt-1 text-2xl font-extrabold">Agro Supplier Portal</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ShieldMark verified={supplier.verified} />
          {supplier.verified && (
            <span className="inline-flex items-center gap-1 text-xs text-forest-200/80">
              <BadgeCheck size={13} />
              Shown on the farmer network
            </span>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold text-forest-900">{supplier.shopName}</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-forest-800/70">
              <MapPin size={14} className="text-forest-500" />
              {supplier.lga}, {supplier.state} · {supplier.address}
            </div>
            <div className="text-xs text-forest-800/50">Owner: {supplier.ownerName}</div>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-forest-800/60">Manage shop</span>
            <select
              value={supplier.id}
              onChange={(e) => switchShop(e.target.value)}
              className="rounded-xl border border-forest-200 bg-forest-50/50 px-3 py-2 text-sm font-semibold text-forest-900 outline-none"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shopName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-forest-100 px-5 py-3.5">
          <div className="text-sm font-extrabold text-forest-900">Inventory</div>
          <div className="flex gap-2">
            <button
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-forest-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-forest-700"
            >
              <Plus size={14} />
              ADD PRODUCT
            </button>
            <button
              onClick={onRegister}
              className="inline-flex items-center gap-1.5 rounded-xl border border-forest-200 bg-white px-3.5 py-2 text-xs font-bold text-forest-700 transition hover:bg-forest-50"
            >
              REGISTER NEW SHOP
            </button>
          </div>
        </div>

        <div className="no-scrollbar overflow-x-auto">
          <table className="w-full min-w-130 text-left">
            <thead>
              <tr className="bg-forest-50/70 text-[11px] uppercase tracking-wide text-forest-800/60">
                <th className="px-5 py-2.5 font-bold">Product</th>
                <th className="px-3 py-2.5 font-bold">Price</th>
                <th className="px-3 py-2.5 font-bold">Stock</th>
                <th className="px-3 py-2.5 font-bold">Status</th>
                <th className="px-5 py-2.5 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {supplier.products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-sm text-forest-800/60">
                    No products yet. Add your first product to appear in farmer matches.
                  </td>
                </tr>
              )}
              {supplier.products.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3 text-sm font-extrabold text-forest-900">{p.name}</td>
                  <td className="px-3 py-3">
                    {editing?.id === p.id && editing.field === 'price' ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          autoFocus
                          type="number"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          className="w-24 rounded-lg border border-forest-300 px-2 py-1 text-sm outline-none"
                        />
                        <button
                          onClick={() => {
                            const v = Number(draft)
                            if (!Number.isNaN(v) && v >= 0) patchProduct(p.id, { price: v })
                            setEditing(null)
                          }}
                          className="rounded-lg bg-forest-600 p-1.5 text-white"
                          aria-label="Save"
                        >
                          <Check size={13} />
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="rounded-lg bg-forest-100 p-1.5 text-forest-700"
                          aria-label="Cancel"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-forest-800">
                        {formatNaira(p.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {editing?.id === p.id && editing.field === 'stock' ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          autoFocus
                          type="number"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          className="w-20 rounded-lg border border-forest-300 px-2 py-1 text-sm outline-none"
                        />
                        <button
                          onClick={() => {
                            const v = Number(draft)
                            if (!Number.isNaN(v) && v >= 0) patchProduct(p.id, { stock: v })
                            setEditing(null)
                          }}
                          className="rounded-lg bg-forest-600 p-1.5 text-white"
                          aria-label="Save"
                        >
                          <Check size={13} />
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="rounded-lg bg-forest-100 p-1.5 text-forest-700"
                          aria-label="Cancel"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm">{p.stock.toLocaleString('en-NG')} {p.unit}</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <StockPill stock={p.stock} unit={p.unit} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditing({ id: p.id, field: 'price' })
                          setDraft(String(p.price))
                        }}
                        className="rounded-lg bg-forest-100 p-2 text-forest-700 transition hover:bg-forest-200"
                        title="Update price"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => {
                          setEditing({ id: p.id, field: 'stock' })
                          setDraft(String(p.stock))
                        }}
                        className="rounded-lg bg-forest-100 p-2 text-forest-700 transition hover:bg-forest-200"
                        title="Update stock"
                      >
                        <PackagePlus size={13} />
                      </button>
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        title="Remove product"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-forest-800 px-4 py-2.5 text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}

      {adding && (
        <AddProductModal
          suggested={SUGGESTED_PRODUCTS}
          onCancel={() => setAdding(false)}
          onSave={addProduct}
        />
      )}
    </div>
  )
}

function AddProductModal({
  suggested,
  onCancel,
  onSave,
}: {
  suggested: string[]
  onCancel: () => void
  onSave: (name: string, price: number, stock: number, unit: string) => void
}) {
  const [name, setName] = useState(suggested[0])
  const [price, setPrice] = useState('4000')
  const [stock, setStock] = useState('10')
  const [unit, setUnit] = useState('units')

  const submit = () => {
    const priceN = Number(price)
    const stockN = Number(stock)
    if (!name.trim() || Number.isNaN(priceN) || Number.isNaN(stockN)) return
    onSave(name.trim(), priceN, Math.max(0, stockN), unit)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-sm font-extrabold text-forest-900">
            <Plus size={16} className="text-forest-600" />
            Add product
          </div>
          <button onClick={onCancel} className="rounded-lg p-1.5 text-forest-800/50 hover:bg-forest-50">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-forest-800/60">Product name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              list="product-suggestions"
              className="rounded-xl border border-forest-200 bg-forest-50/50 px-3 py-2.5 text-sm outline-none focus:border-forest-500"
            />
            <datalist id="product-suggestions">
              {suggested.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-forest-800/60">Price (₦)</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="rounded-xl border border-forest-200 bg-forest-50/50 px-3 py-2.5 text-sm outline-none focus:border-forest-500"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-forest-800/60">Stock</span>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="rounded-xl border border-forest-200 bg-forest-50/50 px-3 py-2.5 text-sm outline-none focus:border-forest-500"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-forest-800/60">Unit</span>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="units / bags"
                className="rounded-xl border border-forest-200 bg-forest-50/50 px-3 py-2.5 text-sm outline-none focus:border-forest-500"
              />
            </label>
          </div>
          <button
            onClick={submit}
            className="rounded-xl bg-forest-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-forest-700"
          >
            SAVE PRODUCT
          </button>
        </div>
      </div>
    </div>
  )
}