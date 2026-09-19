import { useState } from 'react'
import { Award, ShieldCheck } from 'lucide-react'
import { preventionTips, tipCategories } from '../../data/mock'
import { Chip } from '../../components/ui/Chip'
import { PageHeader } from '../../components/ui/PageHeader'
import { TipCard } from '../../components/tips/TipCard'

export function PreventionTips() {
  const [category, setCategory] = useState('All')

  const filtered = preventionTips.filter(
    (tip) => category === 'All' || tip.category === category,
  )

  const categoryCount = (name: string) =>
    name === 'All'
      ? preventionTips.length
      : preventionTips.filter((tip) => tip.category === name).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prevention Tips"
        subtitle="Practical, field-ready guidance to stop crop problems before they start."
      />

      <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-700 to-brand-800 p-5 text-white shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10">
            <Award className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold sm:text-base">
              Small habits, big harvests
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-brand-100">
              Farmers who check their crops weekly prevent most common
              diseases. This guide turns best practice into simple routines.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tipCategories.map((item) => (
          <Chip
            key={item}
            label={item}
            count={categoryCount(item)}
            active={category === item}
            onClick={() => setCategory(item)}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((tip, index) => (
          <TipCard key={tip.id} tip={tip} index={index} />
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-[var(--shadow-card)]">
        <p className="flex items-start gap-3 text-sm leading-relaxed text-stone-600">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-700" />
          Prevention is the cheapest treatment. Tips in this guide complement
          the treatments listed in the Disease Library — pair them for the best
          results.
        </p>
      </div>
    </div>
  )
}