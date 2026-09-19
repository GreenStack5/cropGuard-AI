import type { Order, OrderStatus, PaymentReceipt } from '../types'
import { getItem, setItem, simulateLatency } from '../lib/storage'
import { initialOrders } from '../data/mockOrders'
import { getProductById } from './productService'
import { createNotification } from './notificationService'

const ORDERS_KEY = 'orders_v1'

function getStoredOrders(): Order[] {
  const current = getItem<Order[]>(ORDERS_KEY, [])
  if (current.length === 0) {
    setItem(ORDERS_KEY, initialOrders)
    return initialOrders
  }
  return current
}

export async function getOrders(filter?: {
  supplierId?: string
  farmerId?: string
  status?: OrderStatus
}): Promise<Order[]> {
  await simulateLatency(250, 450)
  let orders = getStoredOrders()

  if (filter?.supplierId) {
    orders = orders.filter((o) => o.supplierId === filter.supplierId)
  }
  if (filter?.farmerId) {
    orders = orders.filter((o) => o.farmerId === filter.farmerId)
  }
  if (filter?.status) {
    orders = orders.filter((o) => o.status === filter.status)
  }

  // Return sorted by date newest first
  return orders.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export async function getOrderById(id: string): Promise<Order | null> {
  await simulateLatency(150, 300)
  const orders = getStoredOrders()
  return orders.find((o) => o.id === id) || null
}

export async function createOrder(input: {
  farmerId?: string
  farmerName?: string
  farmerPhone?: string
  supplierId: string
  productId: string
  quantity: number
  deliveryState: string
  deliveryCity: string
  deliveryAddress: string
  deliveryNote?: string
  receipt?: PaymentReceipt
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  await simulateLatency(400, 700)

  // 1. Validate product existence in mock data layer
  const product = await getProductById(input.productId)
  if (!product) {
    return { success: false, error: 'Product not found or no longer available.' }
  }

  // 2. Validate quantity
  const qty = Math.max(1, Math.floor(input.quantity || 1))

  // 3. NEVER TRUST FRONTEND PRICE: Calculate totalAmount on mock server layer
  const totalAmount = product.price * qty

  // 4. Validate delivery location
  if (!input.deliveryState.trim() || !input.deliveryCity.trim() || !input.deliveryAddress.trim()) {
    return { success: false, error: 'Please enter a complete delivery state, city, and farm address.' }
  }

  // 5. Validate payment receipt attachment
  if (!input.receipt || !input.receipt.dataUrl) {
    return { success: false, error: 'Payment receipt is required to place your order.' }
  }

  // Generate realistic order ID
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
  const farmerName = input.farmerName || 'Amara Okafor'

  const newOrder: Order = {
    id: orderId,
    farmerId: input.farmerId || 'farmer-1',
    farmerName,
    farmerPhone: input.farmerPhone || '+234 803 555 0192',
    supplierId: input.supplierId || product.supplierId,
    supplierName: product.supplierName,
    supplierPhone: product.supplierPhone,
    productId: product.id,
    productName: product.name,
    unitPrice: product.price,
    quantity: qty,
    totalAmount,
    deliveryState: input.deliveryState,
    deliveryCity: input.deliveryCity,
    deliveryAddress: input.deliveryAddress,
    deliveryNote: input.deliveryNote,
    receipt: input.receipt,
    status: 'payment_submitted',
    created_at: new Date().toISOString(),
  }

  const orders = getStoredOrders()
  orders.unshift(newOrder)
  setItem(ORDERS_KEY, orders)

  // Trigger real notification for the supplier dashboard
  await createNotification({
    supplierId: newOrder.supplierId,
    title: 'New Order Received',
    message: `${farmerName} placed an order for ${qty}x ${product.name} (₦${totalAmount.toLocaleString()}). Payment receipt attached.`,
    orderId: newOrder.id,
    farmerName,
    productName: product.name,
    totalAmount,
  })

  return { success: true, order: newOrder }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
): Promise<{ success: boolean; order?: Order; error?: string }> {
  await simulateLatency(300, 500)
  const orders = getStoredOrders()
  const index = orders.findIndex((o) => o.id === orderId)
  if (index === -1) {
    return { success: false, error: 'Order not found' }
  }

  const updated: Order = {
    ...orders[index],
    status: newStatus,
    updated_at: new Date().toISOString(),
  }

  orders[index] = updated
  setItem(ORDERS_KEY, orders)

  return { success: true, order: updated }
}
