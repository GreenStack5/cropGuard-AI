import { useState } from 'react'
import { Bell, Truck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'

export function SupplierSettings() {
  const [notifyOrders, setNotifyOrders] = useState(true)
  const [notifyStock, setNotifyStock] = useState(true)
  const [autoReceiptCheck, setAutoReceiptCheck] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Portal Settings"
        subtitle="Manage order notifications, automated receipt validation rules, and delivery coverage zones."
      />

      <div className="max-w-2xl space-y-6">
        <div className="rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)] space-y-4">
          <h3 className="flex items-center gap-2 text-base font-bold text-ink">
            <Bell className="size-5 text-brand-700" />
            Notification Preferences
          </h3>

          <div className="flex items-center justify-between border-t border-stone-100 pt-3">
            <div>
              <p className="text-sm font-bold text-ink">Order Notifications</p>
              <p className="text-xs text-stone-500">Alert me when a farmer submits a new order and transfer receipt.</p>
            </div>
            <input
              type="checkbox"
              checked={notifyOrders}
              onChange={(e) => setNotifyOrders(e.target.checked)}
              className="size-5 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 pt-3">
            <div>
              <p className="text-sm font-bold text-ink">Low Stock Alerts</p>
              <p className="text-xs text-stone-500">Notify me when product stock runs low.</p>
            </div>
            <input
              type="checkbox"
              checked={notifyStock}
              onChange={(e) => setNotifyStock(e.target.checked)}
              className="size-5 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)] space-y-4">
          <h3 className="flex items-center gap-2 text-base font-bold text-ink">
            <Truck className="size-5 text-brand-700" />
            Fulfillment Coverage
          </h3>

          <div className="flex items-center justify-between border-t border-stone-100 pt-3">
            <div>
              <p className="text-sm font-bold text-ink">Inter-state Delivery Dispatch</p>
              <p className="text-xs text-stone-500">Accept orders from neighboring states in Nigeria.</p>
            </div>
            <input
              type="checkbox"
              checked={autoReceiptCheck}
              onChange={(e) => setAutoReceiptCheck(e.target.checked)}
              className="size-5 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} className="bg-brand-700 text-white">
            Save Preferences
          </Button>
          {saved && <span className="text-xs font-bold text-green-600">Settings saved successfully!</span>}
        </div>
      </div>
    </div>
  )
}
