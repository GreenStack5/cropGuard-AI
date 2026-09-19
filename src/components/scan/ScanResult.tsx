import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  Leaf,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Stethoscope,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import type { AgroProduct, CropScanResult, PaymentReceipt } from '../../types'
import { useRoute } from '../../hooks/useRoute'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { createOrder, fetchRecommendedProducts } from '../../lib/supplierApi'

const conditionMeta = {
  healthy: { label: 'Healthy', tone: 'success', icon: CheckCircle2 },
  'at-risk': { label: 'At risk', tone: 'warning', icon: AlertTriangle },
  affected: { label: 'Affected', tone: 'danger', icon: AlertTriangle },
} as const

export function ScanResult({
  result,
  onReset,
  image: _image,
}: {
  result: CropScanResult
  onReset: () => void
  image?: string | null
}) {
  const { navigate } = useRoute()
  const meta = conditionMeta[result.condition]

  const [products, setProducts] = useState<AgroProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [showSupplierModal, setShowSupplierModal] = useState(false)

  // Order state inside modal
  const [selectedProduct, setSelectedProduct] = useState<AgroProduct | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [deliveryState, setDeliveryState] = useState('Abuja')
  const [deliveryCity, setDeliveryCity] = useState('Gwagwalada')
  const [deliveryAddress, setDeliveryAddress] = useState('Farm Road 4, Gwagwalada')
  const [deliveryNote] = useState('')
  
  // Payment Receipt State
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | null>(null)
  const [receiptError, setReceiptError] = useState<string | null>(null)

  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [orderSuccess, setOrderSuccess] = useState<{ id: string } | null>(null)

  useEffect(() => {
    let isMounted = true
    fetchRecommendedProducts({
      crop: result.cropName,
      disease: result.diseaseName || undefined,
      state: deliveryState,
    })
      .then((items) => {
        if (isMounted) {
          setProducts(items)
          setLoadingProducts(false)
          if (items.length > 0 && !selectedProduct) {
            setSelectedProduct(items[0])
          }
        }
      })
      .catch(() => {
        if (isMounted) setLoadingProducts(false)
      })

    return () => {
      isMounted = false
    }
  }, [result, deliveryState])

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(label)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  const handleFileChange = (file: File | null) => {
    setReceiptError(null)
    if (!file) {
      setReceiptFile(null)
      setReceiptDataUrl(null)
      return
    }

    // Validate size (max 4MB for localStorage base64 safe limit)
    if (file.size > 4 * 1024 * 1024) {
      setReceiptError('File is too large. Please select a receipt under 4MB.')
      return
    }

    // Validate format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      setReceiptError('Invalid file type. Please upload a JPG, PNG, WEBP, or PDF receipt.')
      return
    }

    setReceiptFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setReceiptDataUrl(reader.result as string)
    }
    reader.onerror = () => {
      setReceiptError('Failed to read receipt file. Please try again.')
    }
    reader.readAsDataURL(file)
  }

  const handlePlaceOrder = async () => {
    if (!selectedProduct) return
    setOrderError(null)

    if (!receiptDataUrl || !receiptFile) {
      setOrderError('Please attach your payment receipt before submitting.')
      return
    }

    if (!deliveryState.trim() || !deliveryCity.trim() || !deliveryAddress.trim()) {
      setOrderError('Please fill in your state, city, and farm delivery address.')
      return
    }

    setIsSubmittingOrder(true)

    const receiptPayload: PaymentReceipt = {
      fileName: receiptFile.name,
      fileType: receiptFile.type,
      fileSize: receiptFile.size,
      dataUrl: receiptDataUrl,
    }

    const res = await createOrder({
      supplierId: selectedProduct.supplierId,
      productId: selectedProduct.id,
      quantity,
      deliveryState,
      deliveryCity,
      deliveryAddress,
      deliveryNote,
      receipt: receiptPayload,
    })

    setIsSubmittingOrder(false)

    if (res.success && res.order) {
      setOrderSuccess({ id: res.order.id })
    } else {
      setOrderError(res.error || 'Failed to submit order. Please try again.')
    }
  }

  const sections: Array<{
    icon: typeof Leaf
    title: string
    items: string[]
    iconClass: string
  }> = [
    {
      icon: Stethoscope,
      title: 'Symptoms',
      items: result.symptoms,
      iconClass: 'bg-red-50 text-red-600',
    },
    {
      icon: Leaf,
      title: 'What causes it?',
      items: result.causes,
      iconClass: 'bg-amber-50 text-amber-600',
    },
    {
      icon: ShieldCheck,
      title: 'How to prevent it?',
      items: result.prevention,
      iconClass: 'bg-green-50 text-green-600',
    },
    {
      icon: Sprout,
      title: 'How to treat it?',
      items: result.treatment,
      iconClass: 'bg-sky-50 text-sky-600',
    },
  ]

  return (
    <motion.div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={meta.tone} dot>
                {meta.label}
              </Badge>
              <span className="text-xs font-semibold text-stone-400">
                {result.confidence}% confidence score
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {result.cropName}{' '}
              {result.diseaseName ? `— ${result.diseaseName}` : 'Health Analysis'}
            </h1>
            {result.scientificName ? (
              <p className="mt-1 text-sm italic text-stone-400">
                {result.scientificName}
              </p>
            ) : null}
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base">
              {result.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            <Button
              onClick={() => setShowSupplierModal(true)}
              className="rounded-2xl bg-brand-700 px-6 font-bold text-white shadow-md hover:bg-brand-800"
              leadingIcon={<ShoppingBag className="size-5" />}
            >
              Order Treatment Inputs
            </Button>
            <Button variant="outline" onClick={onReset}>
              Scan another crop
            </Button>
          </div>
        </div>
      </div>

      {/* Disease Detail Sections */}
      <div className="grid gap-6 sm:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-xl',
                  section.iconClass,
                )}
              >
                <section.icon className="size-5" />
              </span>
              <h3 className="text-base font-bold text-ink">{section.title}</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-stone-600"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Path A vs Path B options */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[var(--shadow-card)]">
          <p className="flex items-center gap-2 text-base font-bold text-ink">
            <Leaf className="size-5 text-brand-600" />
            Path A: Organic Field Treatment
          </p>
          <p className="mt-2 text-xs leading-relaxed text-stone-500 sm:text-sm">
            Suitable for early mild symptoms. Prune affected leaves, adjust irrigation to dry out roots, and monitor progress over 5–7 days.
          </p>
        </div>
        <div className="rounded-3xl border border-brand-200 bg-brand-50/60 p-6 shadow-[var(--shadow-card)]">
          <p className="flex items-center gap-2 text-base font-bold text-brand-950">
            <Package className="size-5 text-brand-700" />
            Path B: Verified Local Agro-Inputs
          </p>
          <p className="mt-2 text-xs leading-relaxed text-brand-900 sm:text-sm">
            Source genuine, lab-verified fungicides or bio-treatments directly from local suppliers with direct bank transfer & farm delivery.
          </p>
          <Button
            onClick={() => setShowSupplierModal(true)}
            size="sm"
            className="mt-4 bg-brand-700 text-white hover:bg-brand-800"
            leadingIcon={<ShoppingBag className="size-4" />}
          >
            Source Verified Inputs
          </Button>
        </div>
      </div>

      {/* VERIFIED SUPPLIER & ORDER MODAL */}
      <AnimatePresence>
        {showSupplierModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => {
                  setShowSupplierModal(false)
                  setOrderSuccess(null)
                  setOrderError(null)
                }}
                className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
              >
                <X className="size-5" />
              </button>

              {orderSuccess ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="size-10" />
                  </div>
                  <h3 className="mt-4 text-2xl font-extrabold text-ink">Order Placed Successfully!</h3>
                  <p className="mt-2 text-sm text-stone-600">
                    Order <span className="font-mono font-bold text-brand-700">#{orderSuccess.id}</span> has been saved and dispatched to the supplier dashboard.
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    The supplier will verify your bank transfer receipt and arrange delivery to {deliveryCity}, {deliveryState}.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button
                      onClick={() => {
                        setShowSupplierModal(false)
                        setOrderSuccess(null)
                        navigate('history')
                      }}
                      className="bg-brand-700 text-white px-6"
                    >
                      View Order History
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowSupplierModal(false)
                        setOrderSuccess(null)
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone="brand">Verified Agro-Suppliers</Badge>
                    <span className="text-xs font-semibold text-stone-400">Direct Network</span>
                  </div>
                  <h2 className="mt-2 text-2xl font-extrabold text-ink">Source Agricultural Treatment Inputs</h2>
                  <p className="text-sm text-stone-500">
                    Select a verified product recommended for {result.cropName} ({result.diseaseName || 'General Care'}).
                  </p>

                  {/* PRODUCTS LIST */}
                  <div className="mt-6 space-y-3">
                    {loadingProducts ? (
                      <div className="py-8 text-center text-sm text-stone-400">
                        Finding matching verified agro-products...
                      </div>
                    ) : products.length === 0 ? (
                      <div className="py-6 text-center text-sm text-stone-500">
                        No chemical inputs required for this condition.
                      </div>
                    ) : (
                      products.map((prod) => {
                        const isSelected = selectedProduct?.id === prod.id
                        return (
                          <div
                            key={prod.id}
                            onClick={() => setSelectedProduct(prod)}
                            className={cn(
                              'cursor-pointer rounded-2xl border p-4 transition-all',
                              isSelected
                                ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20'
                                : 'border-stone-200 hover:border-stone-300 bg-white',
                            )}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-base font-bold text-ink">{prod.name}</h4>
                                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-800">
                                    <Check className="size-3" />
                                    Verified Supplier
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-stone-500">{prod.description}</p>
                                <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-stone-600">
                                  <Building2 className="size-3.5 text-stone-400" />
                                  {prod.supplierName} ·
                                  <MapPin className="size-3.5 text-stone-400" />
                                  {prod.supplierCity}, {prod.supplierState}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-extrabold text-brand-800">
                                  ₦{prod.price.toLocaleString()}
                                </p>
                                <span className="text-xs text-stone-400">per {prod.unit}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* ORDER DETAILS & BANK TRANSFER INSTRUCTIONS */}
                  {selectedProduct ? (
                    <div className="mt-6 rounded-2xl border border-stone-200 bg-surface/50 p-5 space-y-5">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-stone-500">
                        Order Form & Direct Bank Transfer
                      </h4>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-ink mb-1">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-ink mb-1">Total Amount (Server Calculated)</label>
                          <div className="flex h-10 w-full items-center rounded-xl border border-stone-200 bg-stone-100 px-3 text-base font-extrabold text-brand-900">
                            ₦{(selectedProduct.price * quantity).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* BANK DETAILS BOX WITH COPY BUTTONS */}
                      <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-brand-950">
                          Supplier Bank Transfer Account
                        </p>
                        <p className="mt-1 text-xs text-stone-600">
                          Transfer <span className="font-bold text-brand-900">₦{(selectedProduct.price * quantity).toLocaleString()}</span> to the verified account below, then attach your receipt.
                        </p>
                        <div className="mt-3 grid gap-3 text-xs sm:grid-cols-3">
                          <div>
                            <span className="text-stone-400 block">Bank Name:</span>
                            <p className="font-bold text-ink">{selectedProduct.bankName}</p>
                          </div>
                          <div>
                            <span className="text-stone-400 block">Account Name:</span>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-ink truncate">{selectedProduct.accountName}</p>
                              <button
                                type="button"
                                onClick={() => handleCopy(selectedProduct.accountName, 'name')}
                                className="rounded bg-white p-1 text-stone-600 shadow-xs hover:text-ink"
                                title="Copy account name"
                              >
                                {copiedAccount === 'name' ? (
                                  <Check className="size-3.5 text-green-600" />
                                ) : (
                                  <Copy className="size-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="text-stone-400 block">Account Number:</span>
                            <div className="flex items-center gap-1.5">
                              <p className="font-mono text-sm font-bold text-brand-800">
                                {selectedProduct.accountNumber}
                              </p>
                              <button
                                type="button"
                                onClick={() => handleCopy(selectedProduct.accountNumber, 'num')}
                                className="rounded bg-white p-1 text-stone-600 shadow-xs hover:text-ink"
                                title="Copy account number"
                              >
                                {copiedAccount === 'num' ? (
                                  <Check className="size-3.5 text-green-600" />
                                ) : (
                                  <Copy className="size-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PAYMENT RECEIPT ATTACHMENT WITH PREVIEW & VALIDATION */}
                      <div>
                        <label className="block text-xs font-bold text-ink mb-1">
                          Upload Payment Receipt (JPG, PNG, WEBP, PDF)
                        </label>
                        {receiptDataUrl ? (
                          <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50/80 p-3">
                            <div className="flex items-center gap-3">
                              {receiptFile?.type.startsWith('image/') ? (
                                <img
                                  src={receiptDataUrl}
                                  alt="Receipt preview"
                                  className="size-12 rounded-lg object-cover border border-green-300"
                                />
                              ) : (
                                <span className="flex size-12 items-center justify-center rounded-lg bg-green-100 text-green-700">
                                  <FileText className="size-6" />
                                </span>
                              )}
                              <div>
                                <p className="text-xs font-bold text-green-950">{receiptFile?.name}</p>
                                <p className="text-[11px] text-green-700">
                                  {(receiptFile?.size ? receiptFile.size / 1024 : 0).toFixed(1)} KB · Ready to send
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setReceiptFile(null)
                                setReceiptDataUrl(null)
                              }}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-white p-4 transition-colors hover:border-brand-500 hover:bg-brand-50/20">
                            <div className="flex items-center gap-2 text-xs font-bold text-brand-800">
                              <Upload className="size-4" />
                              Click to upload transfer receipt
                            </div>
                            <span className="mt-1 text-[11px] text-stone-400">
                              JPG, PNG, WEBP or PDF (Max 4MB)
                            </span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,application/pdf"
                              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                              className="hidden"
                            />
                          </label>
                        )}
                        {receiptError && (
                          <p className="mt-1 text-xs font-bold text-red-600">{receiptError}</p>
                        )}
                      </div>

                      {/* DELIVERY ADDRESS */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-ink mb-1">State & City</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={deliveryState}
                              onChange={(e) => setDeliveryState(e.target.value)}
                              placeholder="State"
                              className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-xs"
                            />
                            <input
                              type="text"
                              value={deliveryCity}
                              onChange={(e) => setDeliveryCity(e.target.value)}
                              placeholder="City"
                              className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-ink mb-1">Farm Delivery Address</label>
                          <input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Farm location or street address"
                            className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-xs"
                          />
                        </div>
                      </div>

                      {orderError && (
                        <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">
                          {orderError}
                        </div>
                      )}

                      <Button
                        onClick={handlePlaceOrder}
                        disabled={isSubmittingOrder || !receiptDataUrl}
                        className="w-full rounded-xl bg-brand-700 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-800 disabled:opacity-50"
                        leadingIcon={<ShoppingBag className="size-4" />}
                      >
                        {isSubmittingOrder ? 'Submitting Order & Uploading Receipt...' : 'Confirm Order & Send Receipt'}
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}