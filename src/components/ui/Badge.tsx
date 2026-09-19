import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type BadgeTone =
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'

const toneClasses: Record<BadgeTone, string> = {
  brand: 'bg-brand-50 text-brand-800',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-sky-50 text-sky-700',
  neutral: 'bg-stone-100 text-stone-600',
}

export interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  className?: string
  dot?: boolean
}

export function Badge({ tone = 'neutral', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        toneClasses[tone],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden
          className={cn(
            'size-1.5 rounded-full',
            {
              brand: 'bg-brand-600',
              success: 'bg-green-600',
              warning: 'bg-amber-500',
              danger: 'bg-red-600',
              info: 'bg-sky-600',
              neutral: 'bg-stone-400',
            }[tone],
          )}
        />
      ) : null}
      {children}
    </span>
  )
}