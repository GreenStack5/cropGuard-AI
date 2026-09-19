import type { ComponentType, ReactNode } from 'react'
import { History, LayoutDashboard, LogOut, MapPin, ScanLine, Store } from 'lucide-react'
import type { FarmerLocation, View } from '../lib/types'
import { Logo } from './Shell'

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'scan', label: 'Scan My Crop', icon: ScanLine },
  { key: 'finders', label: 'Agro Suppliers', icon: Store },
  { key: 'history', label: 'Scan History', icon: History },
  { key: 'location', label: 'My Location', icon: MapPin },
] as const

function activeKey(view: View): View {
  return view === 'result' ? 'scan' : view
}

export function FarmerLayout({
  view,
  onNavigate,
  onSwitchRole,
  farmerName,
  location,
  children,
}: {
  view: View
  onNavigate: (view: View) => void
  onSwitchRole: () => void
  farmerName: string | null
  location: FarmerLocation
  children: ReactNode
}) {
  const active = activeKey(view)
  const initial = farmerName ? farmerName.charAt(0).toUpperCase() : 'F'

  return (
    <div className="bg-crop-grid min-h-screen">
      <header className="sticky top-0 z-30 border-b border-forest-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Logo size={34} />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-forest-600/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-forest-700 sm:inline-block">
              Farmer
            </span>
            <button
              onClick={onSwitchRole}
              className="rounded-full border border-forest-200 bg-white px-3 py-1 text-xs font-semibold text-forest-700 transition hover:bg-forest-50"
            >
              Switch role
            </button>
          </div>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto px-4 pb-2.5 md:hidden">
          {NAV.map((item) => (
            <SidebarItem
              key={item.key}
              item={item}
              active={active === item.key}
              onClick={() => onNavigate(item.key)}
            />
          ))}
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-7xl items-start gap-6 px-4 py-6">
        <aside className="sticky top-[76px] hidden w-60 shrink-0 md:block">
          <nav className="flex flex-col gap-1.5">
            {NAV.map((item) => (
              <SidebarItem
                key={item.key}
                item={item}
                active={active === item.key}
                onClick={() => onNavigate(item.key)}
              />
            ))}
          </nav>

          <div className="mt-5 rounded-2xl border border-forest-100 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-widest text-forest-800/50">
              Working from
            </div>
            <button
              onClick={() => onNavigate('location')}
              className="mt-1 flex w-full items-center gap-2 rounded-xl bg-forest-50/80 px-3 py-2 text-left transition hover:bg-forest-100"
            >
              <MapPin size={16} className="text-forest-500" />
              <span className="min-w-0 leading-tight">
                <span className="block text-xs font-bold text-forest-900">{location.lga}</span>
                <span className="block text-[11px] text-forest-800/60">{location.state}</span>
              </span>
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-forest-100 bg-white p-3 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-600 font-extrabold text-white">
              {initial}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-sm font-extrabold text-forest-900">
                {farmerName ?? 'Farmer'}
              </div>
              <div className="text-[11px] text-forest-800/60">Farmer account</div>
            </div>
            <button
              onClick={onSwitchRole}
              className="shrink-0 rounded-lg p-1.5 text-forest-500 transition hover:bg-forest-100 hover:text-forest-700"
              title="Switch role"
              aria-label="Switch role"
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <footer className="mt-4 border-t border-forest-100 py-6 text-center">
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

function SidebarItem({
  item,
  active,
  onClick,
}: {
  item: { key: string; label: string; icon: ComponentType<{ size?: number | string }> }
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-bold transition md:shrink ${
        active
          ? 'bg-forest-600 text-white shadow-sm shadow-forest-600/25'
          : 'text-forest-800/70 hover:bg-forest-100/70 hover:text-forest-900'
      }`}
    >
      <item.icon size={18} />
      {item.label}
    </button>
  )
}