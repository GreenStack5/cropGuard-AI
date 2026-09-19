import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, ChevronDown, Clock, MapPin } from 'lucide-react'
import type { Disease, ScanRecord } from '../../types'
import { diseases } from '../../data/mock'
import { confidenceTone } from '../../lib/status'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/indicators'
import { ScanStatusBadge } from './ScanStatusBadge'

export interface ScanListItemProps {
  scan: ScanRecord
  index?: number
}

export function ScanListItem({ scan, index = 0 }: ScanListItemProps) {
  const [open, setOpen] = useState(false)
  const disease: Disease | undefined = diseases.find(
    (d) => d.name === scan.diseaseName,
  )

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28 }}
      className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-stone-50/70 sm:gap-4 sm:px-5"
      >
        {scan.thumbnail ? (
          <img
            src={scan.thumbnail}
            alt={scan.cropName}
            className="size-11 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl">
            {scan.cropEmoji}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-bold text-ink">{scan.cropName}</p>
            {scan.diseaseName ? (
              <span className="hidden text-sm text-stone-400 sm:inline">
                · {scan.diseaseName}
              </span>
            ) : null}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {scan.date}
            </span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <Clock className="size-3.5" />
              {scan.time}
            </span>
            <span className="hidden items-center gap-1 md:inline-flex">
              <MapPin className="size-3.5" />
              {scan.location}
            </span>
          </div>
        </div>

        <div className="hidden sm:block sm:w-28">
          <ProgressBar
            value={scan.confidence}
            tone={confidenceTone(scan.confidence)}
          />
        </div>

        <ScanStatusBadge status={scan.status} />

        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-stone-400 transition-transform duration-200',
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
            <div className="border-t border-stone-100 bg-brand-50/40 p-4 sm:p-5">
              {scan.source === 'ai' && scan.result ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={scan.status === 'affected' ? 'danger' : 'warning'} dot>
                      {scan.status === 'affected' ? 'Affected' : 'At risk'}
                    </Badge>
                    <Badge tone="neutral">
                      {scan.confidence}% match
                    </Badge>
                  </div>
                  {scan.result.description ? (
                    <p className="text-sm leading-relaxed text-stone-600">
                      {scan.result.description}
                    </p>
                  ) : null}
                  {scan.result.recommendations.length > 0 ? (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        Recommended next step
                      </p>
                      <p className="mt-1 text-sm text-stone-600">
                        {scan.result.recommendations[0]}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : scan.status === 'healthy' ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  <p className="font-bold">No disease detected</p>
                  <p className="mt-1">
                    This scan matched no known disease patterns at a
                    confidence of {scan.confidence}%. Keep up your current crop
                    care routine.
                  </p>
                </div>
              ) : disease ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={scan.status === 'affected' ? 'danger' : 'warning'} dot>
                      {scan.status === 'affected' ? 'Affected' : 'At risk'}
                    </Badge>
                    <Badge tone="neutral">
                      {scan.confidence}% match
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-stone-600">
                    Detected <strong className="text-ink">{disease.name}</strong>.{' '}
                    {disease.summary}
                  </p>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Recommended first step
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      {disease.prevention[0]}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.li>
  )
}