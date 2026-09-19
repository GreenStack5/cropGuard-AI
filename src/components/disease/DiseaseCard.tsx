import {
  ChevronRight,
  Leaf,
  Recycle,
  ShieldCheck,
  Sprout,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'motion/react'
import type { Disease } from '../../types'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/Badge'

const severityTone = {
  low: 'success',
  moderate: 'warning',
  high: 'danger',
} as const

const severityLabel = {
  low: 'Low severity',
  moderate: 'Moderate',
  high: 'High severity',
} as const

const headerGradient: Record<string, string> = {
  Cereal: 'from-amber-200/80 via-amber-100 to-stone-100',
  'Root crop': 'from-orange-200/80 via-amber-100 to-stone-100',
  Vegetable: 'from-green-200/80 via-brand-100 to-stone-100',
  Legume: 'from-lime-200/80 via-green-100 to-stone-100',
  Fruit: 'from-rose-200/80 via-red-100 to-stone-100',
}

const cropEmojiMap: Record<string, string> = {
  Maize: '🌽',
  Tomato: '🍅',
  Cassava: '🌱',
  Potato: '🥔',
  Rice: '🌾',
  Wheat: '🌾',
  Sorghum: '🌾',
  Millet: '🌾',
  Pawpaw: '🍈',
  Watermelon: '🍉',
  Mango: '🥭',
  Citrus: '🍊',
  Banana: '🍌',
  Apple: '🍎',
  Beans: '🫘',
  Cowpea: '🫛',
  Groundnut: '🥜',
  Soybean: '🫘',
  Chickpea: '🫛',
  Yam: '🍠',
  'Sweet Potato': '🥔',
  Pepper: '🫑',
  Cabbage: '🥬',
  Eggplant: '🍆',
  Okra: '🌶️',
  Cucumber: '🥒',
}

export interface DiseaseCardProps {
  disease: Disease
  onOpen: (disease: Disease) => void
  index?: number
}

export function DiseaseCard({ disease, onOpen, index = 0 }: DiseaseCardProps) {
  const tone = severityTone[disease.severity]
  const emoji = cropEmojiMap[disease.crop] ?? '🌿'

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      onClick={() => onOpen(disease)}
      className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-white text-left shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div
        className={cn(
          'relative flex h-48 w-full items-center justify-center overflow-hidden bg-stone-100',
          !disease.image && (headerGradient[disease.category] ?? headerGradient.Cereal),
        )}
      >
        {disease.image ? (
          <img
            src={disease.image}
            alt={disease.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Hide broken image and fall back to emoji header
              ;(e.currentTarget as HTMLElement).style.display = 'none'
            }}
          />
        ) : (
          <span className="text-6xl opacity-80 drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
            {emoji}
          </span>
        )}
        <span className="absolute left-4 top-4 z-10">
          <Badge tone={tone} className="bg-white/90 shadow-sm backdrop-blur" dot>
            {severityLabel[disease.severity]}
          </Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold leading-snug text-ink group-hover:text-brand-800">
          {disease.name}
        </h3>
        <p className="mt-0.5 text-xs italic text-stone-400">
          {disease.scientificName}
        </p>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-stone-500">
          {disease.summary}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-800">
            <Recycle className="size-3.5" />
            {disease.crop}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-700">
            View details
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.button>
  )
}

export function DiseaseDetail({ disease }: { disease: Disease }) {
  const sections: Array<{
    icon: LucideIcon
    title: string
    items: string[]
    iconClass: string
  }> = [
    {
      icon: Stethoscope,
      title: 'Symptoms',
      items: disease.symptoms,
      iconClass: 'bg-red-50 text-red-600',
    },
    {
      icon: Leaf,
      title: 'What causes it?',
      items: disease.causes,
      iconClass: 'bg-amber-50 text-amber-600',
    },
    {
      icon: ShieldCheck,
      title: 'How to prevent it?',
      items: disease.prevention,
      iconClass: 'bg-green-50 text-green-600',
    },
    {
      icon: Sprout,
      title: 'How to treat it?',
      items: disease.treatment,
      iconClass: 'bg-sky-50 text-sky-600',
    },
  ]

  return (
    <motion.div className="space-y-6">
      {/* Hero Banner with image overlay if present */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 p-6 text-white sm:p-8">
        {disease.image && (
          <div className="absolute inset-0 opacity-25 mix-blend-overlay">
            <img
              src={disease.image}
              alt={disease.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <Badge tone="neutral" className="bg-white/10 text-brand-100 backdrop-blur-sm">
              {disease.crop} / {disease.category}
            </Badge>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {disease.name}
            </h2>
            <p className="mt-1 text-sm italic text-brand-200">
              {disease.scientificName}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-brand-100 sm:text-base">
              {disease.summary}
            </p>
          </div>

          {disease.image && (
            <div className="shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 shadow-lg md:max-w-xs">
              <img
                src={disease.image}
                alt={disease.name}
                className="h-44 w-full object-cover sm:h-52 md:w-64"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {sections.map((section) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-[var(--shadow-card)] sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-lg',
                  section.iconClass,
                )}
              >
                <section.icon className="size-5" />
              </span>
              <h3 className="text-base font-bold text-ink">{section.title}</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-stone-600"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}