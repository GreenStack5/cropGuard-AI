import {
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  UserCheck,
} from 'lucide-react'
import { Link } from '../../lib/router'
import { useRoute } from '../../hooks/useRoute'
import type { Route } from '../../types'

export interface NavItem {
  to: Route
  label: string
  icon: typeof LayoutDashboard
}

export const supplierNavItems: NavItem[] = [
  { to: 'supplier', label: 'Dashboard', icon: LayoutDashboard },
  { to: 'supplier-products', label: 'Products', icon: Package },
  { to: 'supplier-orders', label: 'Orders', icon: ShoppingBag },
  { to: 'supplier-notifications', label: 'Notifications', icon: Bell },
  { to: 'supplier-profile', label: 'Profile', icon: UserCheck },
  { to: 'supplier-settings', label: 'Settings', icon: Settings },
]

export function SupplierSidebarContent() {
  const { route } = useRoute()

  return (
    <div className="flex h-full flex-col p-6">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-stone-100 pb-5">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-sm">
          <Building2 className="size-5" />
        </span>
        <div>
          <h2 className="text-base font-extrabold leading-tight text-ink">
            CropGuard Agro
          </h2>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700">
            <CheckCircle2 className="size-3" /> Verified Supplier
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1.5">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
          Supplier Menu
        </div>
        {supplierNavItems.map((item) => {
          const active = route === item.to
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                active
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-ink'
              }`}
            >
              <Icon className={`size-5 ${active ? 'text-white' : 'text-stone-400 group-hover:text-ink'}`} />
              <span>{item.label}</span>
              <ChevronRight
                className={`ml-auto size-4 transition-transform ${
                  active ? 'text-white' : 'opacity-0 group-hover:opacity-100'
                }`}
              />
            </Link>
          )
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="rounded-2xl border border-stone-200/70 bg-stone-50 p-4">
        <p className="text-xs font-bold text-stone-700">Verified Agro Network</p>
        <p className="mt-1 text-[11px] text-stone-500">
          Receiving direct bank transfer orders from local farmers across Nigeria.
        </p>
      </div>
    </div>
  )
}
