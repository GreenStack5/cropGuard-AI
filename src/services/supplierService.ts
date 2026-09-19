import type { Supplier } from '../types'
import { getItem, setItem, simulateLatency } from '../lib/storage'
import { initialSuppliers } from '../data/mockSuppliers'

const SUPPLIERS_KEY = 'suppliers_v1'

function getStoredSuppliers(): Supplier[] {
  const current = getItem<Supplier[]>(SUPPLIERS_KEY, [])
  if (current.length === 0) {
    setItem(SUPPLIERS_KEY, initialSuppliers)
    return initialSuppliers
  }
  return current
}

export async function getSuppliers(): Promise<Supplier[]> {
  await simulateLatency(200, 400)
  return getStoredSuppliers()
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  await simulateLatency(150, 300)
  const suppliers = getStoredSuppliers()
  return suppliers.find((s) => s.id === id) || null
}

export async function getRecommendedSuppliers(params: {
  state?: string
  city?: string
  crop?: string
  disease?: string
}): Promise<Supplier[]> {
  await simulateLatency(300, 500)
  const all = getStoredSuppliers()

  // Priority ranking algorithm:
  // 1. Verified suppliers first
  // 2. Exact city match
  // 3. Exact state match
  // 4. All other verified suppliers
  return [...all].sort((a, b) => {
    // Verified boost
    if (a.verified !== b.verified) return a.verified ? -1 : 1

    // City match
    const aCityMatch = params.city && a.city.toLowerCase() === params.city.toLowerCase()
    const bCityMatch = params.city && b.city.toLowerCase() === params.city.toLowerCase()
    if (aCityMatch !== bCityMatch) return aCityMatch ? -1 : 1

    // State match
    const aStateMatch = params.state && a.state.toLowerCase() === params.state.toLowerCase()
    const bStateMatch = params.state && b.state.toLowerCase() === params.state.toLowerCase()
    if (aStateMatch !== bStateMatch) return aStateMatch ? -1 : 1

    // Rank score fallback
    return (b.rankScore || 0) - (a.rankScore || 0)
  })
}

export async function updateSupplierProfile(id: string, updates: Partial<Supplier>): Promise<Supplier | null> {
  await simulateLatency(300, 600)
  const suppliers = getStoredSuppliers()
  const index = suppliers.findIndex((s) => s.id === id)
  if (index === -1) return null

  const updated = { ...suppliers[index], ...updates }
  suppliers[index] = updated
  setItem(SUPPLIERS_KEY, suppliers)
  return updated
}
