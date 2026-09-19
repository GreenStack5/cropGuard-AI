import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  leadingIcon?: ReactNode
  error?: string
}

export function Input({
  label,
  hint,
  leadingIcon,
  error,
  className,
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <label className="block" htmlFor={inputId}>
      {label ? (
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
        </span>
      ) : null}
      <span className="relative block">
        {leadingIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            {leadingIcon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={cn(
            'h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 text-sm text-ink placeholder:text-stone-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
            leadingIcon ? 'pl-10' : '',
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : '',
            className,
          )}
          {...rest}
        />
      </span>
      {error ? (
        <span className="mt-1 block text-xs font-medium text-red-600">
          {error}
        </span>
      ) : hint && !error ? (
        <span className="mt-1 block text-xs text-stone-500">{hint}</span>
      ) : null}
    </label>
  )
}

export function Select({
  label,
  options,
  className,
  ...rest
}: {
  label?: string
  options: string[]
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const selectId = label ? label.toLowerCase().replace(/\s+/g, '-') : undefined

  return (
    <label className="block" htmlFor={selectId}>
      {label ? (
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
        </span>
      ) : null}
      <select
        id={selectId}
        className={cn(
          'h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-ink transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
          className,
        )}
        {...rest}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}