import { motion } from 'motion/react'
import { Globe, Sprout } from 'lucide-react'
import { Link } from '../../lib/router'
import { useRoute } from '../../hooks/useRoute'
import { alerts } from '../../data/mock'
import { cn } from '../../lib/utils'
import { accountNav, primaryNav } from './navItems'

export function BrandMark({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
        <Sprout className="size-5" />
      </span>
      {!compact ? (
        <div className="leading-tight">
          <p className="text-base font-extrabold tracking-tight text-ink">
            CropGuard<span className="text-brand-700"> AI</span>
          </p>
          <p className="text-[11px] font-medium text-stone-400">
            Smart farm assistant
          </p>
        </div>
      ) : null}
    </div>
  )
}

function NavList({
  items,
  onNavigate,
}: {
  items: typeof primaryNav
  onNavigate?: () => void
}) {
  const { route } = useRoute()
  const unreadCount = alerts.filter((a) => !a.read).length

  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = route === item.route
        const Icon = item.icon
        const badge =
          item.badgeKey === 'alerts' && unreadCount > 0 ? unreadCount : null

        return (
          <li key={item.route}>
            <Link
              to={item.route}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150',
                active
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-ink',
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`active-pill-${item.route}`}
                  className="absolute inset-0 rounded-xl bg-brand-700"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              ) : null}
              <Icon
                className={cn(
                  'relative size-5 transition-colors',
                  active ? 'text-white' : 'text-stone-400 group-hover:text-ink',
                )}
              />
              <span className="relative">{item.label}</span>
              {badge ? (
                <span className="absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[11px] font-bold text-brand-700">
                  {badge}
                </span>
              ) : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function SidebarContent({
  onNavigate,
  compact = false,
}: {
  onNavigate?: () => void
  compact?: boolean
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className={cn('px-5', compact ? 'py-4' : 'py-7')}>
        <BrandMark compact={compact} />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3.5">
        <NavList items={primaryNav} onNavigate={onNavigate} />
        <div>
          <p className="px-3.5 pb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
            Account
          </p>
          <NavList items={accountNav} onNavigate={onNavigate} />
        </div>
      </nav>

      <div className="space-y-3 px-5 pb-7">
        <div className="flex items-center justify-between rounded-xl border border-[#d9d9d9] bg-white px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Globe className="size-4 text-stone-400" />
            English
          </span>
          <span className="text-xs text-stone-400">EN</span>
        </div>
      </div>
    </div>
  )
}