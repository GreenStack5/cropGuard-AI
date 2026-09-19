import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Lightbulb, Sprout } from 'lucide-react'
import type { PreventionTip } from '../../types'
import { cn } from '../../lib/utils'

export interface TipCardProps {
  tip: PreventionTip
  index?: number
}

export function TipCard({ tip, index = 0 }: TipCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-start gap-3.5 p-5 text-left transition-colors hover:bg-stone-50/60"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Sprout className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-800">
            {tip.category}
          </span>
          <h3 className="mt-1.5 text-base font-bold leading-snug text-ink">
            {tip.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-stone-500">
            {tip.excerpt}
          </p>
        </span>
        <ChevronDown
          className={cn(
            'mt-1 size-4 shrink-0 text-stone-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-stone-100 p-5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                <Lightbulb className="size-4 text-amber-500" />
                Simple steps to follow
              </p>
              <ol className="mt-3 space-y-2.5">
                {tip.steps.map((step, stepIndex) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-sm leading-relaxed text-stone-600"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                      {stepIndex + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  )
}