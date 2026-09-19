import { motion } from 'motion/react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Camera,
  CloudRain,
  History,
  Info,
  Radar,
  type LucideIcon,
} from 'lucide-react'
import type { Alert } from '../../types'
import { alertTypeMeta } from '../../data/mock'
import { useRoute } from '../../hooks/useRoute'
import { cn, formatRelativeDate } from '../../lib/utils'
import type { BadgeTone } from '../ui/Badge'
import { Badge } from '../ui/Badge'

const typeIcon: Record<Alert['type'], LucideIcon> = {
  'crop-warning': AlertTriangle,
  disease: Radar,
  reminder: BookOpenCheck,
  weather: CloudRain,
  system: Info,
}

const iconTone: Record<Alert['type'], string> = {
  'crop-warning': 'bg-amber-50 text-amber-600',
  disease: 'bg-red-50 text-red-600',
  reminder: 'bg-brand-50 text-brand-700',
  weather: 'bg-sky-50 text-sky-600',
  system: 'bg-stone-100 text-stone-500',
}

export interface AlertItemProps {
  alert: Alert
  onToggleRead: (id: string) => void
  index?: number
}

export function AlertItem({
  alert,
  onToggleRead,
  index = 0,
}: AlertItemProps) {
  const Icon = typeIcon[alert.type]
  const meta = alertTypeMeta[alert.type]
  const { navigate } = useRoute()

  const actions: Array<{
    label: string
    icon: LucideIcon
    onClick: () => void
  }> = []

  if (alert.type === 'disease' || alert.type === 'crop-warning') {
    actions.push({
      label: 'Check Crop',
      icon: Camera,
      onClick: () => navigate('scan'),
    })
  }
  if (alert.type === 'reminder' || alert.type === 'weather') {
    actions.push({
      label: 'View History',
      icon: History,
      onClick: () => navigate('history'),
    })
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        'relative flex items-start gap-3.5 rounded-2xl border bg-white p-4 shadow-[var(--shadow-card)] transition-colors sm:p-5',
        alert.read ? 'border-stone-200/70' : 'border-brand-200 bg-brand-50/30',
      )}
    >
      {!alert.read ? (
        <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />
      ) : null}

      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl',
          iconTone[alert.type],
        )}
      >
        <Icon className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Badge tone={meta.tone as BadgeTone}>{meta.label}</Badge>
          <span className="text-xs text-stone-400">
            {formatRelativeDate(alert.date)}
          </span>
        </div>
        <h3 className="mt-1.5 text-sm font-bold text-ink sm:text-base">
          {alert.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-stone-500">
          {alert.message}
        </p>

        {actions.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-800"
              >
                <action.icon className="size-3.5" />
                {action.label}
                <ArrowRight className="size-3.5" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onToggleRead(alert.id)}
        className={cn(
          'shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors',
          alert.read
            ? 'text-stone-400 hover:bg-stone-100 hover:text-ink'
            : 'text-brand-700 hover:bg-brand-100',
        )}
      >
        {alert.read ? 'Mark unread' : 'Mark read'}
      </button>
    </motion.li>
  )
}