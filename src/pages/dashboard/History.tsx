import { useEffect, useMemo, useState } from 'react'
import { History as HistoryIcon, ScanSearch, ShoppingBag } from 'lucide-react'
import type { Order, ScanRecord } from '../../types'
import { useRoute } from '../../hooks/useRoute'
import { useScans } from '../../hooks/useScans'
import { getOrders } from '../../services/orderService'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { EmptyState } from '../../components/ui/EmptyState'
import { PageHeader } from '../../components/ui/PageHeader'
import { ScanListItem } from '../../components/history/ScanListItem'

type Filter = 'all' | ScanRecord['status']

const filters: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'All scans' },
  { key: 'healthy', label: 'Healthy' },
  { key: 'at-risk', label: 'At risk' },
  { key: 'affected', label: 'Affected' },
]

const statusTone: Record<string, 'brand' | 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
  payment_submitted: 'warning',
  confirmed: 'info',
  processing: 'brand',
  out_for_delivery: 'warning',
  delivered: 'success',
  cancelled: 'danger',
}

export function History() {
  const { navigate } = useRoute()
  const [filter, setFilter] = useState<Filter>('all')
  const scans = useScans()
  const [farmerOrders, setFarmerOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'scans' | 'orders'>('scans')

  useEffect(() => {
    getOrders({ farmerId: 'farmer-1' }).then(setFarmerOrders)
  }, [])

  const filtered = useMemo(
    () => (filter === 'all' ? scans : scans.filter((s) => s.status === filter)),
    [filter, scans],
  )

  const healthyCount = scans.filter((s) => s.status === 'healthy').length
  const needsAttention = scans.filter((s) => s.status !== 'healthy').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farm Activity & Order History"
        subtitle="Review your crop scan diagnostics, order fulfillments, and transfer receipts."
        action={
          <Button
            onClick={() => navigate('scan')}
            leadingIcon={<ScanSearch className="size-4" />}
          >
            New scan
          </Button>
        }
      />

      {/* Main Tab Switcher */}
      <div className="flex border-b border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab('scans')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
            activeTab === 'scans'
              ? 'border-brand-700 text-brand-900'
              : 'border-transparent text-stone-400 hover:text-ink'
          }`}
        >
          <ScanSearch className="size-4" />
          Scan Diagnostics ({scans.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
            activeTab === 'orders'
              ? 'border-brand-700 text-brand-900'
              : 'border-transparent text-stone-400 hover:text-ink'
          }`}
        >
          <ShoppingBag className="size-4" />
          Input Orders ({farmerOrders.length})
        </button>
      </div>

      {activeTab === 'scans' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total scans', value: scans.length },
              { label: 'Healthy results', value: healthyCount },
              { label: 'Needs attention', value: needsAttention },
              { label: 'Input Orders', value: farmerOrders.length },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-[var(--shadow-card)] sm:p-5"
              >
                <p className="text-2xl font-extrabold tracking-tight text-ink">
                  {item.value}
                </p>
                <p className="mt-0.5 text-sm font-medium text-stone-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <Chip
                key={item.key}
                label={item.label}
                count={item.key === 'all' ? scans.length : scans.filter((s) => s.status === item.key).length}
                active={filter === item.key}
                onClick={() => setFilter(item.key)}
              />
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-stone-200/70 bg-white shadow-[var(--shadow-card)]">
              <EmptyState
                icon={HistoryIcon}
                title="No scans yet"
                message="Scan your first crop to see results here."
                action={
                  <Button onClick={() => navigate('scan')}>
                    Scan your first crop
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((scan, index) => (
                <ScanListItem key={scan.id} scan={scan} index={index} />
              ))}
            </ul>
          )}
        </div>
      ) : (
        /* ORDERS TAB FOR FARMER */
        <div className="space-y-4">
          {farmerOrders.length === 0 ? (
            <div className="rounded-3xl border border-stone-200/70 bg-white p-12 text-center">
              <ShoppingBag className="mx-auto size-10 text-stone-300" />
              <h3 className="mt-4 text-base font-bold text-ink">No treatment input orders</h3>
              <p className="mt-1 text-sm text-stone-500">
                When you order recommended treatments after scanning crops, your orders will appear here.
              </p>
              <Button onClick={() => navigate('scan')} className="mt-4 bg-brand-700 text-white">
                Scan Crop Now
              </Button>
            </div>
          ) : (
            farmerOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex flex-col gap-4 rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-brand-800">{ord.id}</span>
                    <Badge tone={statusTone[ord.status] || 'neutral'} dot>
                      {ord.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-ink">{ord.productName}</h3>
                  <p className="mt-1 text-xs text-stone-500">
                    Supplier: <span className="font-bold text-ink">{ord.supplierName}</span> ({ord.supplierPhone})
                  </p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    Delivery to: {ord.deliveryAddress}, {ord.deliveryCity}, {ord.deliveryState}
                  </p>
                </div>

                <div className="text-right border-t border-stone-100 pt-3 sm:border-none sm:pt-0">
                  <span className="text-xs text-stone-400">Quantity: {ord.quantity}x</span>
                  <p className="text-xl font-extrabold text-brand-800">
                    ₦{ord.totalAmount.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] text-stone-400">
                    {new Date(ord.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}