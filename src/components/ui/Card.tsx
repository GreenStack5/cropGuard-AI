import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface CardProps extends HTMLMotionProps<'div'> {
  interactive?: boolean
  children?: ReactNode
}

export function Card({ className, interactive, children, ...rest }: CardProps) {
  if (interactive) {
    return (
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className={cn(
          'rounded-2xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]',
          className,
        )}
        {...rest}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn(
        'rounded-2xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-stone-100 px-5 py-4 sm:px-6',
        className,
      )}
    >
      <div>
        <h2 className="text-base font-bold text-ink">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}