import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Package,
  Plus,
  ShoppingBag,
} from 'lucide-react'
import type { AgroProduct, Order } from '../../types'
import { getOrders } from '../../services/orderService'
import { getProducts } from '../../services/productService'
import { useRoute } from '../../hooks/useRoute'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { StatCard } from '../../components/ui/indicators'
import { PageHeader } from '../../components/ui/PageHeader'
import { SupplierOrderDetailsModal } from './SupplierOrderDetailsModal'

export function SupplierDashboard() {
  const { navigate } = useRoute()
  const supplierId = 'sup-1' // Current seeded demo supplier

  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<AgroProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadData = async () => {
    setLoading(true)
    const [fetchedOrders, fetchedProducts] = await Promise.all([
      getOrders({ supplierId }),
      getProducts(supplierId),
    ])
    setOrders(fetchedOrders)
    setProducts(fetchedProducts)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate real metrics from mock services
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.stockStatus === 'in_stock').length
  const pendingOrders = orders.filter(
    (o) => o.status === 'payment_submitted' || o.status === 'confirmed' || o.status === 'processing',
  ).length
  const completedOrders = orders.filter((o) => o.status === 'delivered').length
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const statusTone: Record<string, 'brand' | 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
    payment_submitted: 'warning',
    confirmed: 'info',
    processing: 'brand',
    out_for_delivery: 'warning',
    delivered: 'success',
    cancelled: 'danger',
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PageHeader
            title="Agro-Supplier Dashboard"
            subtitle="Manage your inventory, incoming farmer orders, payment receipts, and delivery tracking."
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('supplier-products')}
            leadingIcon={<Plus className="size-4" />}
            className="bg-brand-700 text-white hover:bg-brand-800"
          >
            Add New Product
          </Button>
        </div>
      </div>

      {/* METRICS STAT CARDS */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          icon={Package}
          label="Active Products"
          value={`${activeProducts} / ${totalProducts}`}
          hint="In stock"
        />
        <StatCard
          icon={ShoppingBag}
          label="Pending Orders"
          value={pendingOrders}
          tone="warning"
          hint="Requires review / delivery"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Orders"
          value={completedOrders}
          tone="success"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₦${totalRevenue.toLocaleString()}`}
          tone="brand"
        />
      </motion.section>

      {/* RECENT ORDERS TABLE */}
      <section className="rounded-3xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-ink">Incoming Farmer Orders</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Orders placed by local farmers with attached bank payment receipts
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('supplier-orders')}
            trailingIcon={<ArrowRight className="size-4" />}
          >
            View All Orders
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-stone-400">Loading order records...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-sm text-stone-500">
            No farmer orders received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-100 bg-stone-50/60 text-xs uppercase text-stone-400">
                <tr>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Farmer</th>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-brand-800">{ord.id}</td>
                    <td className="px-6 py-4 font-semibold text-ink">{ord.farmerName}</td>
                    <td className="px-6 py-4 text-stone-600">
                      {ord.productName}{' '}
                      <span className="text-xs text-stone-400">({ord.quantity}x)</span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-ink">
                      ₦{ord.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-500">
                      {ord.deliveryCity}, {ord.deliveryState}
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-400">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone={statusTone[ord.status] || 'neutral'} dot>
                        {ord.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(ord)}
                      >
                        View Order
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <SupplierOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={(_updated) => {
            setSelectedOrder(null)
            loadData()
          }}
        />
      )}
    </div>
  )
}
