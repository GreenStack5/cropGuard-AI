import { ArrowLeft, ScanLine, Store, Wheat } from 'lucide-react'
import { Logo } from '../components/Shell'
import type { Role } from '../lib/types'

export function RoleSelect({
  onSelect,
  onBack,
}: {
  onSelect: (role: Exclude<Role, null>) => void
  onBack: () => void
}) {
  return (
    <div className="bg-crop-grid min-h-screen">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-5">
        <Logo size={40} />
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-white px-3.5 py-2 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 pb-16 pt-4">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-forest-800/50">
            Welcome to CropGuard AI
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-forest-950 sm:text-4xl">
            How will you use CropGuard AI?
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-forest-800/70">
            Choose a role to create an account or sign in. The dashboards are tailored for each
            side of your farm's supply chain.
          </p>
        </div>

        <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
          <button
            onClick={() => onSelect('farmer')}
            className="group flex flex-col items-start gap-3 rounded-3xl border-2 border-forest-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-forest-500 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-600 text-white shadow-md shadow-forest-600/30 transition group-hover:scale-105">
              <Wheat size={26} />
            </div>
            <div>
              <div className="text-lg font-extrabold text-forest-900">I'm a Farmer</div>
              <p className="mt-1 text-sm text-forest-800/70">
                Scan crops, get a diagnosis, compare Agro Suppliers near you and connect by phone
                or WhatsApp.
              </p>
            </div>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-sm font-bold text-white transition group-hover:bg-forest-700">
              <ScanLine size={16} />
              Continue as Farmer
            </span>
          </button>

          <button
            onClick={() => onSelect('supplier')}
            className="group flex flex-col items-start gap-3 rounded-3xl border-2 border-forest-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-forest-800 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-800 text-white shadow-md shadow-forest-800/30 transition group-hover:scale-105">
              <Store size={26} />
            </div>
            <div>
              <div className="text-lg font-extrabold text-forest-900">I'm an Agro Supplier</div>
              <p className="mt-1 text-sm text-forest-800/70">
                Register your shop, add products, set prices and keep stock up to date so farmers
                find you.
              </p>
            </div>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-4 py-2 text-sm font-bold text-white transition group-hover:bg-forest-900">
              <Store size={16} />
              Continue as Store
            </span>
          </button>
        </div>
      </main>

      <footer className="pb-6 text-center">
        <p className="text-[11px] text-forest-800/40">
          CropGuard AI — Hackathon MVP · Demo accounts are stored locally in your browser
        </p>
      </footer>
    </div>
  )
}