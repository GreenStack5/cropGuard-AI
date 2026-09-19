import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, BookOpen, ChevronRight, Layers, Search, SlidersHorizontal } from 'lucide-react'
import { diseaseCategories, diseases, type DiseaseCategory } from '../../data/mock'
import type { Disease } from '../../types'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'
import { DiseaseCard, DiseaseDetail } from '../../components/disease/DiseaseCard'

export function DiseaseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<DiseaseCategory | null>(null)
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null)
  const [query, setQuery] = useState('')
  const [selectedCropFilter, setSelectedCropFilter] = useState('All')

  // Search filter across all diseases if searching on main view
  const searchResults = query.trim()
    ? diseases.filter((d) => {
        const term = query.trim().toLowerCase()
        return (
          d.name.toLowerCase().includes(term) ||
          d.scientificName.toLowerCase().includes(term) ||
          d.crop.toLowerCase().includes(term) ||
          d.category.toLowerCase().includes(term)
        )
      })
    : []

  // Filter within selected category
  const categoryDiseases = selectedCategory
    ? diseases.filter((d) => {
        const matchesCategory = d.category === selectedCategory.key
        const matchesCrop =
          selectedCropFilter === 'All' || d.crop.toLowerCase() === selectedCropFilter.toLowerCase()
        const term = query.trim().toLowerCase()
        const matchesQuery =
          term === '' ||
          d.name.toLowerCase().includes(term) ||
          d.scientificName.toLowerCase().includes(term) ||
          d.crop.toLowerCase().includes(term)
        return matchesCategory && matchesCrop && matchesQuery
      })
    : []

  // Case 1: Viewing a specific disease's detail view
  if (selectedDisease) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedDisease(null)}
          leadingIcon={<ArrowLeft className="size-4" />}
          className="-ml-3"
        >
          {selectedCategory ? `Back to ${selectedCategory.name} Diseases` : 'Back to Disease Library'}
        </Button>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDisease.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <DiseaseDetail disease={selectedDisease} />
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // Case 2: User opened a specific category card (e.g., Cereals, Fruits, etc.)
  if (selectedCategory) {
    const availableCrops = ['All', ...Array.from(new Set(diseases.filter(d => d.category === selectedCategory.key).map(d => d.crop)))]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategory(null)
              setSelectedCropFilter('All')
              setQuery('')
            }}
            leadingIcon={<ArrowLeft className="size-4" />}
            className="-ml-3"
          >
            Back to Categories
          </Button>
          <span className="text-xs font-semibold text-stone-400">
            {categoryDiseases.length} disease{categoryDiseases.length === 1 ? '' : 's'} found
          </span>
        </div>

        <PageHeader
          title={`${selectedCategory.name} Diseases`}
          subtitle={`Explore common diseases, symptoms, and treatment guidelines for ${selectedCategory.name.toLowerCase()} crops.`}
        />

        {/* Search & Sub-Crop Filters inside Category */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${selectedCategory.name.toLowerCase()} diseases or crops…`}
              className="h-11 w-full rounded-3xl border border-stone-300 bg-white pl-9 pr-3 text-sm text-ink placeholder:text-stone-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {availableCrops.map((cropName) => (
              <Chip
                key={cropName}
                label={cropName}
                active={selectedCropFilter === cropName}
                onClick={() => setSelectedCropFilter(cropName)}
              />
            ))}
          </div>
        </motion.div>

        {/* Diseases Grid inside category */}
        {categoryDiseases.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-2xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]">
              <EmptyState
                icon={Search}
                title="No diseases found"
                message={`No diseases match your current filter in ${selectedCategory.name}. Try adjusting your search or crop filter.`}
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery('')
                      setSelectedCropFilter('All')
                    }}
                  >
                    Reset filters
                  </Button>
                }
              />
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {categoryDiseases.map((disease, index) => (
              <DiseaseCard
                key={disease.id}
                disease={disease}
                onOpen={setSelectedDisease}
                index={index}
              />
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-[var(--shadow-card)]">
          <p className="flex items-center gap-2 text-sm text-stone-500">
            <BookOpen className="size-4 text-brand-700" />
            Always confirm diagnosis before applying treatment. Consult a local agricultural officer when in doubt.
          </p>
        </div>
      </div>
    )
  }

  // Case 3: Main Category Cards View (Root Disease Library Page)
  return (
    <div className="space-y-6">
      <PageHeader
        title="Disease Library"
        subtitle="Select a category card below to browse diseases, symptoms, and treatment plans."
      />

      {/* Global Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search all diseases, crops (e.g. Maize, Pawpaw, Tomato)…"
            className="h-11 w-full rounded-3xl border border-stone-300 bg-white pl-10 pr-4 text-sm text-ink placeholder:text-stone-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-400">
          <SlidersHorizontal className="size-4" />
          {diseases.length} total diseases across {diseaseCategories.length} categories
        </div>
      </motion.div>

      {/* If global search is active */}
      {query.trim().length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink">
              Search Results for “{query}” ({searchResults.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setQuery('')}>
              Clear search
            </Button>
          </div>

          {searchResults.length === 0 ? (
            <div className="rounded-2xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]">
              <EmptyState
                icon={Search}
                title="No matching diseases found"
                message={`Nothing matches “${query}”. Try searching for crops like Maize, Rice, Cassava, Pawpaw, or Tomato.`}
                action={<Button variant="outline" onClick={() => setQuery('')}>Clear search</Button>}
              />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {searchResults.map((disease, index) => (
                <DiseaseCard
                  key={disease.id}
                  disease={disease}
                  onOpen={setSelectedDisease}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Default State: 5 Category Cards */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {diseaseCategories.map((cat, index) => {
            const count = diseases.filter((d) => d.category === cat.key).length

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setSelectedCategory(cat)
                  setSelectedCropFilter('All')
                  setQuery('')
                }}
                className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border ${cat.borderAccent} bg-white text-left shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)]`}
              >
                {/* Category Cover Image Header */}
                <div className="relative h-36 w-full overflow-hidden bg-stone-100 sm:h-40">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${cat.bgGradient}`}
                    >
                      <span className="text-5xl">{cat.emoji}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="flex items-center gap-1.5 font-bold drop-shadow">
                      <span className="text-xl">{cat.emoji}</span>
                      {cat.name}
                    </span>
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-md">
                      {count} Diseases
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="line-clamp-2 text-sm leading-relaxed text-stone-500">
                    {cat.description}
                  </p>

                  {/* Sample crops tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {cat.crops.slice(0, 4).map((crop) => (
                      <span
                        key={crop}
                        className="rounded-lg bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600"
                      >
                        {crop}
                      </span>
                    ))}
                    {cat.crops.length > 4 && (
                      <span className="rounded-lg bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-400">
                        +{cat.crops.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500">
                      <Layers className="size-3.5 text-stone-400" />
                      Browse {cat.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition-transform group-hover:translate-x-1">
                      Explore
                      <ChevronRight className="size-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-[var(--shadow-card)]">
        <p className="flex items-center gap-2 text-sm text-stone-500">
          <BookOpen className="size-4 text-brand-700" />
          Always confirm diagnosis before applying treatment. When in doubt, contact a local agricultural extension officer.
        </p>
      </div>
    </div>
  )
}