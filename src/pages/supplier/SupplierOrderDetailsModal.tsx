import { useState } from 'react'
import { motion } from 'motion/react'
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  MapPin,
  Phone,
  User,
  X,
} from 'lucide-react'
import type { Order, OrderStatus } from '../../types'
import { updateOrderStatus } from '../../services/orderService'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

export interface SupplierOrderDetailsModalProps {
  order: Order
  onClose: () => void
  onOrderUpdated: (updated: Order) => void
}

const statusOptions: Array<{ status: OrderStatus; label: string; tone: 'brand' | 'success' | 'warning' | 'info' | 'danger' | 'neutral' }> = [
  { status: 'payment_submitted', label: 'Payment Submitted', tone: 'warning' },
  { status: 'confirmed', label: 'Payment Confirmed', tone: 'info' },
  { status: 'processing', label: 'Processing Order', tone: 'brand' },
  { status: 'out_for_delivery', label: 'Out for Delivery', tone: 'warning' },
  { status: 'delivered', label: 'Delivered', tone: 'success' },
  { status: 'cancelled', label: 'Cancelled', tone: 'danger' },
]

export function SupplierOrderDetailsModal({
  order,
  onClose,
  onOrderUpdated,
}: SupplierOrderDetailsModalProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status)
  const [updating, setUpdating] = useState(false)
  const [showFullReceipt, setShowFullReceipt] = useState(false)

  const handleStatusChange = async (nextStatus: OrderStatus) => {
    setUpdating(true)
    const res = await updateOrderStatus(order.id, nextStatus)
    setUpdating(false)
    if (res.success && res.order) {
      setCurrentStatus(res.order.status)
      onOrderUpdated(res.order)
    }
  }

  const activeOption = statusOptions.find((s) => s.status === currentStatus) || statusOptions[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-stone-400">Order ID</span>
              <h2 className="text-xl font-extrabold text-ink">{order.id}</h2>
              <Badge tone={activeOption.tone} dot>
                {activeOption.label}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-stone-400">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Order Item & Amount */}
          <div className="rounded-2xl border border-stone-200 bg-surface/60 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Ordered Product
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-ink">{order.productName}</h3>
                <p className="text-xs text-stone-500">
                  Quantity: <span className="font-bold text-ink">{order.quantity}</span> · Unit price: ₦
                  {order.unitPrice.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400">Total Order Amount</span>
                <p className="text-2xl font-extrabold text-brand-800">
                  ₦{order.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Farmer & Delivery Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
                <User className="size-4 text-brand-700" />
                Farmer Details
              </p>
              <h4 className="mt-2 text-base font-bold text-ink">{order.farmerName}</h4>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-600">
                <Phone className="size-3.5 text-stone-400" />
                {order.farmerPhone || '+234 803 555 0192'}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
                <MapPin className="size-4 text-brand-700" />
                Delivery Address
              </p>
              <h4 className="mt-2 text-sm font-bold text-ink">
                {order.deliveryCity}, {order.deliveryState}
              </h4>
              <p className="mt-0.5 text-xs text-stone-600">{order.deliveryAddress}</p>
              {order.deliveryNote && (
                <p className="mt-2 text-xs italic text-amber-700 bg-amber-50 p-2 rounded-lg">
                  Note: {order.deliveryNote}
                </p>
              )}
            </div>
          </div>

          {/* PAYMENT RECEIPT SECTION (HIGH PRIORITY) */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-950">
                <FileText className="size-4 text-brand-700" />
                Uploaded Transfer Receipt
              </p>
              <Badge tone="success">Verified Attachment</Badge>
            </div>

            {order.receipt && order.receipt.dataUrl ? (
              <div className="mt-3">
                <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-brand-200 shadow-xs">
                  <div className="flex items-center gap-3">
                    {order.receipt.fileType.startsWith('image/') ? (
                      <img
                        src={order.receipt.dataUrl}
                        alt="Receipt thumbnail"
                        className="size-14 rounded-lg object-cover border border-stone-200"
                      />
                    ) : (
                      <span className="flex size-14 items-center justify-center rounded-lg bg-red-100 text-red-700">
                        <FileText className="size-7" />
                      </span>
                    )}
                    <div>
                      <p className="text-xs font-bold text-ink">{order.receipt.fileName}</p>
                      <p className="text-[11px] text-stone-400">
                        {(order.receipt.fileSize / 1024).toFixed(1)} KB · {order.receipt.fileType}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowFullReceipt(!showFullReceipt)}
                      leadingIcon={<ExternalLink className="size-3.5" />}
                    >
                      {showFullReceipt ? 'Hide Receipt' : 'View Full Receipt'}
                    </Button>
                  </div>
                </div>

                {/* Expanded Full Receipt Viewer */}
                {showFullReceipt && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-3 shadow-inner"
                  >
                    {order.receipt.fileType.startsWith('image/') ? (
                      <img
                        src={order.receipt.dataUrl}
                        alt="Full payment receipt"
                        className="max-h-96 w-full object-contain rounded-xl"
                      />
                    ) : (
                      <iframe
                        src={order.receipt.dataUrl}
                        title="PDF Receipt Viewer"
                        className="h-96 w-full rounded-xl border border-stone-200"
                      />
                    )}
                  </motion.div>
                )}
              </div>
            ) : (
              <p className="mt-3 text-xs italic text-stone-500">No receipt file available.</p>
            )}
          </div>

          {/* STATUS WORKFLOW SELECTOR */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Update Order Status Workflow
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {statusOptions.map((opt) => {
                const isCurrent = currentStatus === opt.status
                return (
                  <button
                    key={opt.status}
                    type="button"
                    disabled={updating}
                    onClick={() => handleStatusChange(opt.status)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${
                      isCurrent
                        ? 'border-brand-600 bg-brand-700 text-white shadow-sm'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isCurrent && <CheckCircle2 className="size-4 text-white" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={onClose} variant="outline" className="px-6">
            Close Order
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
