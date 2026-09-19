import { MapPin, MessageCircle, Phone, Store } from 'lucide-react'
import type { FarmerLocation, ProductItem, Supplier } from '../lib/types'
import { formatDistance } from '../lib/distance'
import { formatNaira, telLink, waLink, buildWhatsAppMessage } from '../lib/contact'
import { VerifiedBadge, PendingBadge, StockPill } from './Shell'

export interface SupplierCardProps {
  supplier: Supplier
  location: FarmerLocation
  product: ProductItem
  crop?: string | null
  badge?: string
}

export function SupplierCard({ supplier, location, product, crop, badge }: SupplierCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-forest-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      {badge && (
        <span className="-mb-1 w-fit rounded-full bg-forest-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
          {badge}
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-600/10 text-forest-700">
            <Store size={20} />
          </div>
          <div>
            <div className="text-sm font-extrabold uppercase tracking-wide text-forest-900">
              {supplier.shopName}
            </div>
            {supplier.verified ? <VerifiedBadge /> : <PendingBadge />}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-forest-800/80">
        <span className="inline-flex items-center gap-1 font-medium">
          <MapPin size={14} className="text-forest-500" />
          {supplier.lga}, {supplier.state}
        </span>
        <span className="inline-flex items-center gap-1 font-medium">
          <Phone size={14} className="text-forest-500" />
          {formatDistance(location, supplier)}
        </span>
      </div>

      <div className="rounded-xl bg-forest-50/60 p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-forest-900">{product.name}</div>
            <div className="text-lg font-extrabold text-forest-600">
              {formatNaira(product.price)}
            </div>
          </div>
          <StockPill stock={product.stock} unit={product.unit} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={telLink(supplier.phone)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-600 px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-forest-700"
        >
          <Phone size={16} />
          CALL
        </a>
        <a
          href={waLink(supplier.phone, buildWhatsAppMessage(product.name, crop))}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1fbf59]"
        >
          <MessageCircle size={16} />
          WHATSAPP
        </a>
      </div>
    </div>
  )
}