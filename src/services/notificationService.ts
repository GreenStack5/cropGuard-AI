import type { SupplierNotification } from '../types'
import { getItem, setItem, simulateLatency } from '../lib/storage'
import { initialNotifications } from '../data/mockNotifications'

const NOTIFICATIONS_KEY = 'notifications_v1'

function getStoredNotifications(): SupplierNotification[] {
  const current = getItem<SupplierNotification[]>(NOTIFICATIONS_KEY, [])
  if (current.length === 0) {
    setItem(NOTIFICATIONS_KEY, initialNotifications)
    return initialNotifications
  }
  return current
}

export async function getNotifications(supplierId?: string): Promise<SupplierNotification[]> {
  await simulateLatency(200, 350)
  const all = getStoredNotifications()
  if (supplierId) {
    return all.filter((n) => n.supplierId === supplierId)
  }
  return all
}

export async function getUnreadCount(supplierId?: string): Promise<number> {
  const all = getStoredNotifications()
  const list = supplierId ? all.filter((n) => n.supplierId === supplierId) : all
  return list.filter((n) => !n.read).length
}

export async function markAsRead(notificationId: string): Promise<boolean> {
  await simulateLatency(150, 250)
  const notifications = getStoredNotifications()
  const index = notifications.findIndex((n) => n.id === notificationId)
  if (index === -1) return false

  notifications[index].read = true
  setItem(NOTIFICATIONS_KEY, notifications)
  return true
}

export async function createNotification(
  input: Omit<SupplierNotification, 'id' | 'read' | 'created_at'>,
): Promise<SupplierNotification> {
  const notifications = getStoredNotifications()
  const newNotif: SupplierNotification = {
    ...input,
    id: `notif-${Date.now()}`,
    read: false,
    created_at: new Date().toISOString(),
  }
  notifications.unshift(newNotif)
  setItem(NOTIFICATIONS_KEY, notifications)
  return newNotif
}
