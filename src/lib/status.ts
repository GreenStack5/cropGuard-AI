import type { ScanRecord } from '../types'

export const statusMeta = {
  healthy: { label: 'Healthy', tone: 'success' },
  'at-risk': { label: 'At risk', tone: 'warning' },
  affected: { label: 'Affected', tone: 'danger' },
} as const

export type StatusTone =
  (typeof statusMeta)[keyof typeof statusMeta]['tone']

export function confidenceTone(value: number) {
  if (value >= 85) return 'success'
  if (value >= 70) return 'warning'
  return 'danger'
}

export function severityTone(severity: ScanRecord['status']) {
  return statusMeta[severity].tone
}