import type { AgroProduct, Order, PaymentReceipt, Supplier } from '../types'
import { getRecommendedProducts as fetchProductsService } from '../services/productService'
import { getRecommendedSuppliers as fetchSuppliersService } from '../services/supplierService'
import { createOrder as createOrderService } from '../services/orderService'

export async function fetchRecommendedProducts(params: {
  crop?: string
  disease?: string
  state?: string
}): Promise<AgroProduct[]> {
  try {
    return await fetchProductsService(params)
  } catch (error) {
    console.error('fetchRecommendedProducts error:', error)
    return []
  }
}

export async function fetchRecommendedSuppliers(params: {
  state?: string
  city?: string
  crop?: string
  disease?: string
}): Promise<{ suppliers: Supplier[]; recommendedProducts: AgroProduct[] }> {
  try {
    const suppliers = await fetchSuppliersService(params)
    const recommendedProducts = await fetchProductsService(params)
    return { suppliers, recommendedProducts }
  } catch (error) {
    console.error('fetchRecommendedSuppliers error:', error)
    return { suppliers: [], recommendedProducts: [] }
  }
}

export async function createOrder(orderData: {
  supplierId: string
  productId: string
  quantity: number
  deliveryState: string
  deliveryCity: string
  deliveryAddress: string
  deliveryNote?: string
  receipt?: PaymentReceipt
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    return await createOrderService(orderData)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Network error'
    return { success: false, error: msg }
  }
}
