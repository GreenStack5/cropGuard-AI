import type { AgroProduct } from '../types'
import { getItem, setItem, simulateLatency } from '../lib/storage'
import { initialProducts } from '../data/mockProducts'

const PRODUCTS_KEY = 'products_v1'

function getStoredProducts(): AgroProduct[] {
  const current = getItem<AgroProduct[]>(PRODUCTS_KEY, [])
  if (current.length === 0) {
    setItem(PRODUCTS_KEY, initialProducts)
    return initialProducts
  }
  return current
}

export async function getProducts(supplierId?: string): Promise<AgroProduct[]> {
  await simulateLatency(200, 400)
  const all = getStoredProducts()
  if (supplierId) {
    return all.filter((p) => p.supplierId === supplierId)
  }
  return all
}

export async function getProductById(id: string): Promise<AgroProduct | null> {
  await simulateLatency(150, 300)
  const all = getStoredProducts()
  return all.find((p) => p.id === id) || null
}

export async function getRecommendedProducts(params: {
  crop?: string
  disease?: string
  state?: string
}): Promise<AgroProduct[]> {
  await simulateLatency(300, 500)
  const all = getStoredProducts()

  // Filter and score products matching crop / disease
  return all
    .filter((prod) => prod.stockStatus === 'in_stock')
    .map((prod) => {
      let score = prod.relevanceScore || 80
      const matchesCrop =
        params.crop &&
        prod.cropTypes.some((c) => c.toLowerCase().includes(params.crop!.toLowerCase()))
      const matchesDisease =
        params.disease &&
        prod.diseaseTypes.some((d) => d.toLowerCase().includes(params.disease!.toLowerCase()))
      const matchesState =
        params.state && prod.supplierState.toLowerCase() === params.state.toLowerCase()

      if (matchesDisease) score += 40
      if (matchesCrop) score += 20
      if (matchesState) score += 10

      return { ...prod, relevanceScore: score }
    })
    .filter((prod) => {
      // If crop or disease specified, must match at least one unless general fertilizer
      if (!params.crop && !params.disease) return true
      const matchesCrop =
        params.crop &&
        prod.cropTypes.some((c) => c.toLowerCase().includes(params.crop!.toLowerCase()))
      const matchesDisease =
        params.disease &&
        prod.diseaseTypes.some((d) => d.toLowerCase().includes(params.disease!.toLowerCase()))
      return Boolean(matchesCrop || matchesDisease || prod.category === 'Foliar Fertilizer')
    })
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
}

export async function addProduct(
  productData: Omit<AgroProduct, 'id' | 'created_at'>,
): Promise<AgroProduct> {
  await simulateLatency(350, 600)
  const products = getStoredProducts()
  const newProduct: AgroProduct = {
    ...productData,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  products.unshift(newProduct)
  setItem(PRODUCTS_KEY, products)
  return newProduct
}

export async function updateProduct(
  id: string,
  updates: Partial<AgroProduct>,
): Promise<AgroProduct | null> {
  await simulateLatency(300, 500)
  const products = getStoredProducts()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return null

  const updated = { ...products[index], ...updates }
  products[index] = updated
  setItem(PRODUCTS_KEY, products)
  return updated
}

export async function deleteProduct(id: string): Promise<boolean> {
  await simulateLatency(300, 500)
  const products = getStoredProducts()
  const filtered = products.filter((p) => p.id !== id)
  if (filtered.length === products.length) return false
  setItem(PRODUCTS_KEY, filtered)
  return true
}
