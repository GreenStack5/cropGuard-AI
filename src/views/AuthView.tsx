import { useState } from 'react'
import { ArrowLeft, KeyRound, ScanLine, Store, UserPlus, Wheat } from 'lucide-react'
import type { Role } from '../lib/types'
import {
  getFarmerProfile,
  getSuppliers,
  saveFarmerProfile,
  setCurrentSupplierId,
} from '../lib/storage'
import { phoneDigits } from '../lib/contact'
import { Logo } from '../components/Shell'

type Mode = 'signin' | 'signup'

export function AuthView({
  role,
  onBack,
  onAuthenticated,
  onCreateSupplier,
}: {
  role: Exclude<Role, null>
  onBack: () => void
  onAuthenticated: () => void
  onCreateSupplier: () => void
}) {
  const profile = role === 'farmer' ? getFarmerProfile() : null
  const [mode, setMode] = useState<Mode>(profile ? 'signin' : 'signup')
  const [name, setName] = useState(profile?.name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [shopName, setShopName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isFarmer = role === 'farmer'

  const submit = () => {
    setError(null)
    if (isFarmer) {
      if (!name.trim()) {
        setError('Please enter your full name.')
        return
      }
      if (mode === 'signin') {
        const stored = getFarmerProfile()
        if (!stored) {
          setError('No farmer account found on this device. Create an account instead.')
          return
        }
        const nameOk = stored.name.trim().toLowerCase() === name.trim().toLowerCase()
        const phoneOk =
          phone.trim() === '' ||
          phoneDigits(phone) === phoneDigits(stored.phone ?? '') ||
          phoneDigits(phone) === ''
        if (!nameOk || !phoneOk) {
          setError('Name or phone does not match the saved farmer account.')
          return
        }
      } else {
        saveFarmerProfile({ name: name.trim(), phone: phone.trim() || undefined })
      }
      onAuthenticated()
      return
    }

    if (!shopName.trim()) {
      setError('Please enter your shop name.')
      return
    }
    const match = getSuppliers().find(
      (s) =>
        s.shopName.trim().toLowerCase() === shopName.trim().toLowerCase() &&
        phoneDigits(s.phone) === phoneDigits(phone),
    )
    if (!match) {
      setError(
        'No Agro Supplier profile matches this shop name and phone. Create an account instead.',
      )
      return
    }
    setCurrentSupplierId(match.id)
    onAuthenticated()
  }

  const field =
    'w-full rounded-xl border border-forest-200 bg-forest-50/50 px-3.5 py-3 text-sm outline-none transition focus:border-forest-500'
  const label = 'text-xs font-bold text-forest-800/60'

  return (
    <div className="bg-crop-grid min-h-screen">
      <header className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-5">
        <Logo size={40} />
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-white px-3.5 py-2 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-col px-4 pb-10">
        <section
          className={`flex items-center gap-4 rounded-3xl p-6 text-white shadow-lg ${
            isFarmer
              ? 'bg-gradient-to-br from-forest-600 to-forest-800'
              : 'bg-gradient-to-br from-forest-800 to-forest-950'
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            {isFarmer ? <Wheat size={28} /> : <Store size={28} />}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/70">
              {isFarmer ? 'CropGuard AI · Farmer' : 'CropGuard AI · Agro Supplier'}
            </div>
            <h1 className="mt-1 text-2xl font-extrabold">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-white/75">
              {isFarmer
                ? mode === 'signin'
                  ? 'Sign in to scan crops and find Agro Suppliers.'
                  : 'A quick profile lets us save your scans and location.'
                : mode === 'signin'
                  ? 'Sign in to manage your shop and inventory.'
                  : 'Register your shop to reach nearby farmers.'}
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-forest-100 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-forest-100/70 p-1">
            <button
              onClick={() => setMode('signin')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition ${
                mode === 'signin' ? 'bg-white text-forest-900 shadow-sm' : 'text-forest-800/60'
              }`}
            >
              <KeyRound size={15} />
              Sign in
            </button>
            <button
              onClick={() => {
                if (isFarmer) setMode('signup')
                else onCreateSupplier()
              }}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition ${
                mode === 'signup' ? 'bg-white text-forest-900 shadow-sm' : 'text-forest-800/60'
              }`}
            >
              <UserPlus size={15} />
              Create account
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {isFarmer ? (
              <>
                <label className="flex flex-col gap-1">
                  <span className={label}>Full name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={field}
                    placeholder="e.g. Adewale Okafor"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={label}>Phone (optional)</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={field}
                    placeholder="08000000000"
                    inputMode="tel"
                  />
                </label>
              </>
            ) : (
              <>
                <label className="flex flex-col gap-1">
                  <span className={label}>Shop name</span>
                  <input
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className={field}
                    placeholder="e.g. GreenFarm Agro Services"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={label}>Phone number</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={field}
                    placeholder="08000000001"
                    inputMode="tel"
                  />
                </label>
              </>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={submit}
              className="rounded-2xl bg-forest-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-forest-600/25 transition hover:-translate-y-0.5 hover:bg-forest-700"
            >
              {mode === 'signin'
                ? isFarmer
                  ? 'SIGN IN TO MY FARM'
                  : 'SIGN IN TO MY SHOP'
                : 'CREATE FARMER ACCOUNT'}
            </button>

            {!isFarmer && mode === 'signin' && (
              <div className="rounded-xl border border-forest-100 bg-forest-50/60 px-4 py-3">
                <div className="text-xs font-bold text-forest-800">
                  Demo shop account
                </div>
                <p className="mt-0.5 text-xs text-forest-800/70">
                  Shop: GreenFarm Agro Services · Phone: 08000000001
                </p>
              </div>
            )}
          </div>
        </section>

        {isFarmer && (
          <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs text-forest-800/60">
            <ScanLine size={13} />
            Demo account data is stored locally on this device.
          </p>
        )}
      </main>
    </div>
  )
}