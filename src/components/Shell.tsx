import type { ReactNode } from 'react'
import { ArrowLeft, Sprout } from 'lucide-react'
import type { Role } from '../lib/types'

export function Logo({ size = 38 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-xl bg-gradient-to-br from-forest-600 to-forest-800 shadow-md shadow-forest-600/20"
        style={{ width: size, height: size }}
      >
        <Sprout size={size * 0.55} className="text-white" strokeWidth={2.4} />
      </div>
      <div className="leading-none">
        <div className="text-lg font-extrabold tracking-tight text-forest-800">
          CROPGUARD <span className="text-forest-500">AI</span>
        </div>
        <div className="text-[11px] font-medium text-forest-700/70">
          Protect your crops. Find the right solution.
        </div>
      </div>
    </div>
  )
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2l2.4 2.4 3.2-.5 1.1 3.1 3 1.3-1.2 3 1.2 3-3 1.3-1.1 3.1-3.2-.5L12 21.5 9.6 19l-3.2.5-1.1-3.1-3-1.3 1.2-3-1.2-3 3-1.3 1.1-3.1 3.2.5L12 2z"
          fill="currentColor"
          opacity="0.25"
        />
        <path
          d="M8.5 11.8l2.2 2.2 4.8-4.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      Verified Supplier
    </span>
  )
}

export function PendingBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
      Pending verification
    </span>
  )
}

export function StockPill({ stock, unit }: { stock: number; unit: string }) {
  const tone =
    stock === 0
      ? 'bg-red-100 text-red-700'
      : stock <= 8
        ? 'bg-amber-100 text-amber-800'
        : 'bg-green-100 text-green-800'
  const label = stock === 0 ? 'Out of stock' : stock <= 8 ? 'Low stock' : 'In stock'
  return (
    <div>
      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>
        {label}
      </span>
      <span className="ml-2 text-sm font-medium text-forest-800">
        {stock.toLocaleString('en-NG')} {unit} {stock === 1 ? '' : ''}
      </span>
    </div>
  )
}

export function Shell({
  role,
  onSwitchRole,
  onBack,
  backLabel,
  children,
}: {
  role: Role
  onSwitchRole: () => void
  onBack?: () => void
  backLabel?: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-5">
      <header className="flex items-center justify-between gap-3">
        <Logo />
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
              role === 'farmer'
                ? 'bg-forest-600/10 text-forest-700'
                : 'bg-forest-800/10 text-forest-800'
            }`}
          >
            {role === 'farmer' ? 'Farmer' : 'Agro Supplier'}
          </span>
          <button
            onClick={onSwitchRole}
            className="rounded-full border border-forest-200 bg-white px-3 py-1 text-xs font-semibold text-forest-700 transition hover:bg-forest-50"
          >
            Switch role
          </button>
        </div>
      </header>

      {onBack && (
        <button
          onClick={onBack}
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-forest-700 transition hover:bg-forest-100/70"
        >
          <ArrowLeft size={16} />
          {backLabel ?? 'Back'}
        </button>
      )}

      <main className="flex-1 py-5">{children}</main>

      <footer className="border-t border-forest-100 pt-4 pb-2 text-center">
        <p className="text-xs leading-relaxed text-forest-800/60">
          AI-assisted result. Confirm diagnosis with a qualified agricultural professional before
          treatment.
        </p>
        <p className="mt-1 text-[11px] text-forest-800/40">
          CropGuard AI — Hackathon MVP. Demo data is stored locally in your browser.
        </p>
      </footer>
    </div>
  )
}

export function PageChrome({
  active,
  onBack,
  onHow,
  onFeatures,
  onGetStarted,
  children,
}: {
  active: 'how' | 'features'
  onBack: () => void
  onHow: () => void
  onFeatures: () => void
  onGetStarted: () => void
  children: ReactNode
}) {
  return (
    <div className="bg-crop-grid min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-5">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-semibold text-forest-800/70 sm:flex">
          <button
            onClick={onHow}
            className={`transition hover:text-forest-700 ${active === 'how' ? 'font-extrabold text-forest-700' : ''}`}
          >
            How it works
          </button>
          <button
            onClick={onFeatures}
            className={`transition hover:text-forest-700 ${active === 'features' ? 'font-extrabold text-forest-700' : ''}`}
          >
            Features
          </button>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-white px-3.5 py-2 text-sm font-semibold text-forest-700 transition hover:bg-forest-50"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <button
            onClick={onGetStarted}
            className="hidden rounded-full bg-forest-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-forest-600/20 transition hover:bg-forest-700 sm:inline-block"
          >
            Get started
          </button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-4 border-t border-forest-100 py-8 text-center">
        <p className="mx-auto max-w-lg px-4 text-xs leading-relaxed text-forest-800/60">
          AI-assisted result. Confirm diagnosis with a qualified agricultural professional before
          treatment. Demo supplier data is stored locally in your browser.
        </p>
      </footer>
    </div>
  )
}