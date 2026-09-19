import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Bell, Menu, Search } from 'lucide-react'
import { Link } from '../../lib/router'
import { useRoute } from '../../hooks/useRoute'
import { useRole } from '../../hooks/useRole'
import { alerts, currentUser, diseases } from '../../data/mock'
import { getUnreadCount } from '../../services/notificationService'
import { Avatar } from '../ui/Avatar'
import { navLabel } from './navItems'
import { BrandMark } from './Sidebar'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { route, navigate } = useRoute()
  const { role, switchRole } = useRole()
  const farmerUnreadCount = alerts.filter((a) => !a.read).length
  const [supplierUnreadCount, setSupplierUnreadCount] = useState(0)

  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    if (role === 'supplier') {
      getUnreadCount('sup-1').then((cnt) => {
        if (isMounted) setSupplierUnreadCount(cnt)
      })
    }
    return () => {
      isMounted = false
    }
  }, [role, route])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return diseases
      .filter(
        (disease) =>
          disease.name.toLowerCase().includes(term) ||
          disease.scientificName.toLowerCase().includes(term) ||
          disease.crop.toLowerCase().includes(term),
      )
      .slice(0, 5)
  }, [query])

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-stone-200/70 bg-surface/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-10 items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-ink lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <BrandMark compact className="lg:hidden" />

      <div className="hidden lg:flex lg:items-center lg:gap-2">
        <span className="text-sm font-semibold text-stone-400">
          {role === 'supplier' ? 'Supplier Portal' : 'Farmer Dashboard'}
        </span>
        <span className="text-stone-300">/</span>
        <span className="text-sm font-bold text-ink">{navLabel[route] || 'Dashboard'}</span>
      </div>

      {role === 'farmer' && (
        <div
          ref={containerRef}
          className="relative ml-auto hidden w-full max-w-xs md:block lg:max-w-md"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search diseases or crops…"
            className="h-10 w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-stone-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <AnimatePresence>
            {focused && query.trim() ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-stone-200/70 bg-white p-2 shadow-lg"
              >
                {results.length === 0 ? (
                  <p className="px-3 py-4 text-center text-sm text-stone-400">
                    No matching diseases
                  </p>
                ) : (
                  <ul className="space-y-0.5">
                    {results.map((disease) => (
                      <li key={disease.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setQuery('')
                            setFocused(false)
                            navigate('disease')
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-brand-50"
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-sm">
                            {disease.crop.slice(0, 1)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-ink">
                              {disease.name}
                            </span>
                            <span className="block text-xs text-stone-400">
                              {disease.crop}
                            </span>
                          </span>
                          <ArrowRight className="ml-auto size-4 shrink-0 text-brand-700" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}

      {/* DEMO ROLE SWITCHER TOGGLE & NOTIFICATIONS */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Pill */}
        <div className="flex items-center rounded-2xl border border-stone-200 bg-stone-100 p-1 shadow-xs">
          <button
            type="button"
            onClick={() => switchRole('farmer')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${role === 'farmer'
                ? 'bg-white text-brand-900 shadow-xs'
                : 'text-stone-500 hover:text-ink'
              }`}
          >
            <span>👨‍🌾</span>
            <span className="hidden sm:inline">Farmer</span>
          </button>
          <button
            type="button"
            onClick={() => switchRole('supplier')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${role === 'supplier'
                ? 'bg-brand-700 text-white shadow-xs'
                : 'text-stone-500 hover:text-ink'
              }`}
          >
            <span>🚜</span>
            <span className="hidden sm:inline">Agro Supplier</span>
          </button>
        </div>

        {/* Notifications Icon */}
        <Link
          to={role === 'supplier' ? 'supplier-notifications' : 'alerts'}
          className="relative flex size-10 items-center justify-center rounded-xl text-stone-500 transition-colors hover:bg-stone-100 hover:text-ink"
          aria-label="Alerts & Notifications"
        >
          <Bell className="size-5" />
          {(role === 'farmer' ? farmerUnreadCount : supplierUnreadCount) > 0 ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full border-2 border-surface bg-brand-700 text-[10px] font-bold text-white"
            >
              {role === 'farmer' ? farmerUnreadCount : supplierUnreadCount}
            </motion.span>
          ) : null}
        </Link>

        {/* Profile Avatar Pill */}
        <Link
          to={role === 'supplier' ? 'supplier-profile' : 'profile'}
          className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-stone-100"
        >
          <Avatar
            name={role === 'supplier' ? 'CropGuard Agro' : currentUser.name}
            size="sm"
          />
          <span className="hidden xl:block">
            <span className="block text-sm font-bold leading-tight text-ink">
              {role === 'supplier' ? 'CropGuard Agro' : currentUser.name.split(' ')[0]}
            </span>
            <span className="block text-xs text-stone-400">
              {role === 'supplier' ? '✓ Verified Supplier' : 'Farmer'}
            </span>
          </span>
        </Link>
      </div>
    </header>
  )
}