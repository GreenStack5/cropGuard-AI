import { motion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ProgressBarProps {
  value: number
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
  label?: string
  className?: string
}

const toneBar = {
  brand: 'bg-brand-700',
  success: 'bg-green-600',
  warning: 'bg-amber-500',
  danger: 'bg-red-600',
  neutral: 'bg-stone-400',
} as const

const toneText = {
  brand: 'text-brand-800',
  success: 'text-green-700',
  warning: 'text-amber-700',
  danger: 'text-red-700',
  neutral: 'text-stone-600',
} as const

export function ProgressBar({
  value,
  tone = 'brand',
  label,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-stone-500">{label}</span>
          <span className={cn('text-xs font-bold', toneText[tone])}>
            {Math.round(clamped)}%
          </span>
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', toneBar[tone])}
        />
      </div>
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <motion.span
      aria-label="Loading"
      className={cn(
        'block size-5 rounded-full border-2 border-brand-200 border-t-brand-700',
        className,
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = 'brand',
  hint,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  hint?: string
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info'
}) {
  const iconTone = {
    brand: 'bg-brand-50 text-brand-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-sky-50 text-sky-700',
  } as const

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'flex size-11 items-center justify-center rounded-full',
            iconTone[tone],
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
        {value}
      </p>
      <p className="mt-0.5 text-sm font-medium text-stone-500">{label}</p>
      {hint ? <p className="mt-0.5 text-xs text-stone-400">{hint}</p> : null}
    </motion.div>
  )
}