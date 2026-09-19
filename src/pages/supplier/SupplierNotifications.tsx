import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Bell, ShoppingBag } from 'lucide-react'
import type { Order, SupplierNotification } from '../../types'
import { getNotifications, markAsRead } from '../../services/notificationService'
import { getOrderById } from '../../services/orderService'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'
import { SupplierOrderDetailsModal } from './SupplierOrderDetailsModal'

export function SupplierNotifications() {
  const supplierId = 'sup-1'
  const [notifications, setNotifications] = useState<SupplierNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadNotifications = async () => {
    setLoading(true)
    const list = await getNotifications(supplierId)
    setNotifications(list)
    setLoading(false)
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleNotificationClick = async (notif: SupplierNotification) => {
    await markAsRead(notif.id)
    loadNotifications()

    if (notif.orderId) {
      const ord = await getOrderById(notif.orderId)
      if (ord) {
        setSelectedOrder(ord)
      }
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Notifications"
        subtitle="Real-time alerts for incoming farmer orders, payment receipt submissions, and inventory alerts."
      />

      {loading ? (
        <div className="py-12 text-center text-sm text-stone-400">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="rounded-3xl border border-stone-200/70 bg-white p-12 text-center">
          <Bell className="mx-auto size-10 text-stone-300" />
          <h3 className="mt-4 text-base font-bold text-ink">No notifications yet</h3>
          <p className="mt-1 text-sm text-stone-500">
            When farmers place orders or upload transfer receipts, you will be notified here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleNotificationClick(notif)}
              className={`group flex cursor-pointer items-start justify-between gap-4 rounded-3xl border p-5 transition-all ${
                !notif.read
                  ? 'border-brand-300 bg-brand-50/50 shadow-sm'
                  : 'border-stone-200/70 bg-white hover:bg-stone-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-xs">
                  <ShoppingBag className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-ink">{notif.title}</h4>
                    {!notif.read && (
                      <span className="size-2 rounded-full bg-brand-600" title="Unread" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-stone-600">{notif.message}</p>
                  <p className="mt-2 text-xs font-semibold text-stone-400">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <Button size="sm" variant="outline" className="shrink-0">
                View Order
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <SupplierOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={() => {
            setSelectedOrder(null)
            loadNotifications()
          }}
        />
      )}
    </div>
  )
}
