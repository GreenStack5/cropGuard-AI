import { useEffect, useState } from 'react'
import { Building2, CheckCircle2, CreditCard, MapPin, Phone } from 'lucide-react'
import type { Supplier } from '../../types'
import { getSupplierById, updateSupplierProfile } from '../../services/supplierService'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'

export function SupplierProfile() {
  const supplierId = 'sup-1'
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [editing, setEditing] = useState(false)

  // Form fields
  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [phone, setPhone] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSupplierById(supplierId).then((sup) => {
      if (sup) {
        setSupplier(sup)
        setBusinessName(sup.businessName)
        setOwnerName(sup.ownerName)
        setPhone(sup.phone)
        setState(sup.state)
        setCity(sup.city)
        setAddress(sup.address)
        setBankName(sup.bankName)
        setAccountName(sup.accountName)
        setAccountNumber(sup.accountNumber)
      }
    })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const updated = await updateSupplierProfile(supplierId, {
      businessName,
      ownerName,
      phone,
      state,
      city,
      address,
      bankName,
      accountName,
      accountNumber,
    })
    setSaving(false)
    if (updated) {
      setSupplier(updated)
      setEditing(false)
    }
  }

  if (!supplier) {
    return <div className="py-12 text-center text-sm text-stone-400">Loading profile...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Agro-Supplier Business Profile"
          subtitle="Manage your business verification details, location, and bank account for direct transfers."
        />
        <Button onClick={() => setEditing(!editing)} variant={editing ? 'outline' : 'primary'}>
          {editing ? 'Cancel Editing' : 'Edit Business Profile'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Business Info Card */}
        <div className="rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)] lg:col-span-2">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-base font-bold text-ink border-b border-stone-100 pb-3">
                Edit Business & Contact Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Contact Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Warehouse / Depot Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                />
              </div>

              <h3 className="text-base font-bold text-ink border-b border-stone-100 pb-3 pt-4">
                Edit Direct Bank Transfer Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Account Name</label>
                  <input
                    type="text"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="submit" disabled={saving} className="bg-brand-700 text-white">
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-sm">
                  <Building2 className="size-7" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-extrabold text-ink">{supplier.businessName}</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                      <CheckCircle2 className="size-3.5" /> Verified Supplier
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">Managed by {supplier.ownerName}</p>
                </div>
              </div>

              <div className="grid gap-4 border-t border-stone-100 pt-6 sm:grid-cols-2">
                <div>
                  <span className="text-xs font-bold text-stone-400 block uppercase">Contact Phone</span>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-ink">
                    <Phone className="size-4 text-brand-700" />
                    {supplier.phone}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-400 block uppercase">Location</span>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-ink">
                    <MapPin className="size-4 text-brand-700" />
                    {supplier.city}, {supplier.state}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs font-bold text-stone-400 block uppercase">Depot Address</span>
                  <p className="mt-1 text-sm text-stone-600">{supplier.address}</p>
                </div>
              </div>

              {/* Bank Details Box */}
              <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-950">
                  <CreditCard className="size-4 text-brand-700" />
                  Bank Transfer Account Details (Shown to Farmers)
                </p>
                <div className="mt-3 grid gap-3 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-stone-400 block">Bank Name:</span>
                    <p className="font-bold text-ink">{supplier.bankName}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Account Name:</span>
                    <p className="font-bold text-ink">{supplier.accountName}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Account Number:</span>
                    <p className="font-mono text-sm font-extrabold text-brand-800">
                      {supplier.accountNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Card */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-bold text-ink">Verification Badge</h3>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">
              Your business is verified by CropGuard AI for selling authentic agricultural inputs across Nigeria.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs font-bold text-green-800">
              <CheckCircle2 className="size-4 text-green-600" />
              Verified Status Active
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
