import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface ChipProps {
  label: string
  active: boolean
  onClick: () => void
  icon?: ReactNode
  count?: number
  tone?: 'green' | 'stone'
}

const tones = {
  green: {
    active: 'border-brand-700 bg-brand-700 text-white shadow-sm',
    idle: 'border-stone-300 bg-white text-stone-600 hover:border-brand-400 hover:text-brand-700',
  },
  stone: {
    active: 'border-stone-700 bg-stone-800 text-white shadow-sm',
    idle: 'border-stone-300 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-800',
  },
} as const

export function Chip({
  label,
  active,
  onClick,
  icon,
  count,
  tone = 'green',
}: ChipProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors duration-150',
        active ? tones[tone].active : tones[tone].idle,
      )}
    >
      {icon}
      {label}
      {typeof count === 'number' ? (
        <span
          className={cn(
            'rounded-full px-1.5 text-xs font-bold',
            active ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500',
          )}
        >
          {count}
        </span>
      ) : null}
    </motion.button>
  )
}