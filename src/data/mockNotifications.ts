import type { SupplierNotification } from '../types'

export const initialNotifications: SupplierNotification[] = [
  {
    id: 'notif-1',
    supplierId: 'sup-1',
    title: 'New Order Received',
    message: 'Amara Okafor placed an order for 2x Copper Hydroxide 50WP Fungicide (₦17,000). Receipt attached.',
    orderId: 'ORD-9482',
    farmerName: 'Amara Okafor',
    productName: 'Copper Hydroxide 50WP Fungicide',
    totalAmount: 17000,
    read: false,
    created_at: '2026-09-19T09:30:00Z',
  },
]
