import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { FileText, Search, ShoppingBag } from 'lucide-react'
import type { Order } from '../../types'
import { getOrders } from '../../services/orderService'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { PageHeader } from '../../components/ui/PageHeader'
import { SupplierOrderDetailsModal } from './SupplierOrderDetailsModal'

const statusFilterOptions: Array<{ key: string; label: string }> = [
  { key: 'ALL', label: 'All Orders' },
  { key: 'payment_submitted', label: 'Payment Submitted' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

const statusTone: Record<string, 'brand' | 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
  payment_submitted: 'warning',
  confirmed: 'info',
  processing: 'brand',
  out_for_delivery: 'warning',
  delivered: 'success',
  cancelled: 'danger',
}

export function SupplierOrders() {
  const supplierId = 'sup-1'
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadOrders = async () => {
    setLoading(true)
    const list = await getOrders({ supplierId })
    setOrders(list)
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus =
      selectedStatus === 'ALL' || ord.status === selectedStatus
    const term = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !term ||
      ord.id.toLowerCase().includes(term) ||
      ord.farmerName.toLowerCase().includes(term) ||
      ord.productName.toLowerCase().includes(term) ||
      ord.deliveryCity.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incoming Farmer Orders"
        subtitle="Review bank transfer payment receipts, process dispatches, and track order fulfillment."
      />

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, farmer, product…"
            className="h-10 w-full rounded-2xl border border-stone-200 bg-white pl-9 pr-3 text-xs text-ink focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {statusFilterOptions.map((opt) => (
            <Chip
              key={opt.key}
              label={opt.label}
              active={selectedStatus === opt.key}
              onClick={() => setSelectedStatus(opt.key)}
            />
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-stone-400">Loading incoming orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-stone-200/70 bg-white p-12 text-center">
          <ShoppingBag className="mx-auto size-10 text-stone-300" />
          <h3 className="mt-4 text-base font-bold text-ink">No matching orders</h3>
          <p className="mt-1 text-sm text-stone-500">
            {searchQuery || selectedStatus !== 'ALL'
              ? 'Try clearing your search query or status filter.'
              : 'When farmers place orders for your products, they will appear here.'}
          </p>
          {(searchQuery || selectedStatus !== 'ALL') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedStatus('ALL')
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <motion.div
              key={ord.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)] md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-brand-800">{ord.id}</span>
                  <Badge tone={statusTone[ord.status] || 'neutral'} dot>
                    {ord.status.replace(/_/g, ' ')}
                  </Badge>
                  {ord.receipt && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-800">
                      <FileText className="size-3" /> Receipt Attached
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-ink">{ord.productName}</h3>
                <p className="text-xs text-stone-500">
                  Farmer: <span className="font-bold text-ink">{ord.farmerName}</span> ({ord.farmerPhone}) ·{' '}
                  <span className="text-stone-400">
                    {ord.deliveryCity}, {ord.deliveryState}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between gap-6 border-t border-stone-100 pt-3 md:border-none md:pt-0">
                <div className="text-left md:text-right">
                  <span className="text-xs text-stone-400">Total ({ord.quantity}x)</span>
                  <p className="text-xl font-extrabold text-brand-800">
                    ₦{ord.totalAmount.toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedOrder(ord)}
                  className="bg-brand-700 text-white hover:bg-brand-800"
                >
                  Review Order & Receipt
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ORDER DETAILS MODAL WITH RECEIPT VIEWER & STATUS WORKFLOW */}
      {selectedOrder && (
        <SupplierOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={() => {
            setSelectedOrder(null)
            loadOrders()
          }}
        />
      )}
    </div>
  )
}
