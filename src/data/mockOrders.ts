import type { Order } from '../types'

export const initialOrders: Order[] = [
  {
    id: 'ORD-9482',
    farmerId: 'farmer-1',
    farmerName: 'Amara Okafor',
    farmerPhone: '+234 803 555 0192',
    supplierId: 'sup-1',
    supplierName: 'CropGuard Demo Agro Supplies',
    supplierPhone: '+234 802 123 4567',
    productId: 'prod-1',
    productName: 'Copper Hydroxide 50WP Fungicide',
    unitPrice: 8500,
    quantity: 2,
    totalAmount: 17000,
    deliveryState: 'Kwara State',
    deliveryCity: 'Ilorin',
    deliveryAddress: 'Greenleaf Acres, Plot B, Ilorin',
    deliveryNote: 'Please call on arrival at main gate',
    receipt: {
      fileName: 'bank_transfer_receipt_9482.png',
      fileType: 'image/png',
      fileSize: 142000,
      dataUrl:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f4f4f5"/><rect x="40" y="40" width="520" height="320" rx="16" fill="%23ffffff" stroke="%23e4e4e7" stroke-width="2"/><text x="70" y="90" font-family="sans-serif" font-size="20" font-weight="bold" fill="%2318181b">TRANSFER RECEIPT</text><text x="70" y="130" font-family="sans-serif" font-size="14" fill="%2371717a">Reference: TXN-8392019482</text><text x="70" y="160" font-family="sans-serif" font-size="14" fill="%2371717a">Amount: ₦17,000.00</text><text x="70" y="190" font-family="sans-serif" font-size="14" fill="%2371717a">Sender: Amara Okafor</text><text x="70" y="220" font-family="sans-serif" font-size="14" fill="%2371717a">Beneficiary: CropGuard Demo Agro Supplies</text><text x="70" y="250" font-family="sans-serif" font-size="14" fill="%2371717a">Bank: First Bank of Nigeria (2034918234)</text><text x="70" y="300" font-family="sans-serif" font-size="13" font-weight="bold" fill="%2316a34a">STATUS: SUCCESSFUL</text></svg>',
    },
    status: 'payment_submitted',
    created_at: '2026-09-19T09:30:00Z',
  },
]
