import { motion } from 'motion/react'
import { cn } from '../../lib/utils'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  className?: string
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
}: ToggleProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      {label || description ? (
        <div>
          {label ? (
            <p className="text-sm font-semibold text-ink">{label}</p>
          ) : null}
          {description ? (
            <p className="mt-0.5 text-sm text-stone-500">{description}</p>
          ) : null}
        </div>
      ) : null}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-50',
          checked ? 'bg-brand-700' : 'bg-stone-300',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className={cn(
            'inline-block size-5 rounded-full bg-white shadow',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}