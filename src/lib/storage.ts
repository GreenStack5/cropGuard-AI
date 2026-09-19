import type { UserRole } from '../types'

const STORAGE_PREFIX = 'cropguard_'

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return defaultValue
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn(`[Storage] Failed to read key ${key}:`, error)
    return defaultValue
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    // Dispatch custom event so reactive hooks/components trigger re-renders
    window.dispatchEvent(new CustomEvent('cropguard_storage_change', { detail: { key } }))
  } catch (error) {
    console.warn(`[Storage] Failed to write key ${key}:`, error)
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
    window.dispatchEvent(new CustomEvent('cropguard_storage_change', { detail: { key } }))
  } catch (error) {
    console.warn(`[Storage] Failed to remove key ${key}:`, error)
  }
}

// Active Role State Management
export function getActiveRole(): UserRole {
  return getItem<UserRole>('active_role', 'farmer')
}

export function setActiveRole(role: UserRole): void {
  setItem<UserRole>('active_role', role)
}

// Async delay simulator helper for realistic loading states (300ms - 500ms)
export function simulateLatency(minMs = 300, maxMs = 500): Promise<void> {
  const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise((resolve) => setTimeout(resolve, duration))
}
