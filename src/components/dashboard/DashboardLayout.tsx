import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useRoute } from '../../hooks/useRoute'
import { useRole } from '../../hooks/useRole'
import type { Route } from '../../types'
import { MobileNav } from '../navigation/MobileNav'
import { SidebarContent } from '../navigation/Sidebar'
import { SupplierSidebarContent } from '../navigation/SupplierSidebar'
import { Topbar } from '../navigation/Topbar'
import { Home } from '../../pages/dashboard/Home'
import { ScanCrop } from '../../pages/dashboard/ScanCrop'
import { DiseaseLibrary } from '../../pages/dashboard/DiseaseLibrary'
import { Alerts } from '../../pages/dashboard/Alerts'
import { PreventionTips } from '../../pages/dashboard/PreventionTips'
import { History } from '../../pages/dashboard/History'
import { Profile } from '../../pages/dashboard/Profile'
import { Settings } from '../../pages/dashboard/Settings'
import { SupplierDashboard } from '../../pages/supplier/SupplierDashboard'
import { SupplierProducts } from '../../pages/supplier/SupplierProducts'
import { SupplierOrders } from '../../pages/supplier/SupplierOrders'
import { SupplierNotifications } from '../../pages/supplier/SupplierNotifications'
import { SupplierProfile } from '../../pages/supplier/SupplierProfile'
import { SupplierSettings } from '../../pages/supplier/SupplierSettings'

const pages: Record<Route, () => React.JSX.Element> = {
  home: Home,
  scan: ScanCrop,
  disease: DiseaseLibrary,
  alerts: Alerts,
  tips: PreventionTips,
  history: History,
  profile: Profile,
  settings: Settings,
  supplier: SupplierDashboard,
  'supplier-products': SupplierProducts,
  'supplier-orders': SupplierOrders,
  'supplier-notifications': SupplierNotifications,
  'supplier-profile': SupplierProfile,
  'supplier-settings': SupplierSettings,
}

export function DashboardLayout() {
  const { route } = useRoute()
  const { role } = useRole()
  const [menuOpen, setMenuOpen] = useState(false)
  const Page = pages[route] || Home

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[269px] bg-white shadow-[0_0_2px_rgba(0,0,0,0.25)] lg:block lg:rounded-r-[12px]">
        {role === 'supplier' ? <SupplierSidebarContent /> : <SidebarContent />}
      </aside>

      <div className="flex min-h-screen w-full flex-col lg:pl-[269px]">
        <Topbar onMenuClick={() => setMenuOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={route}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="mx-auto w-full max-w-[1400px]"
            >
              <Page />
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t border-stone-200/60 px-4 py-4 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-6xl text-xs text-stone-400">
            © {new Date().getFullYear()} CropGuard AI · Prototype Architecture with Persistent Mock Ecosystem.
          </p>
        </footer>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}