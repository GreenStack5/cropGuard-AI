import { useEffect, useMemo, useState } from 'react'
import { scans as mockScans } from '../data/mock'
import type { ScanRecord } from '../types'
import { readScans, subscribeScans } from '../lib/scanStorage'

export function useScans(): ScanRecord[] {
  const [savedScans, setSavedScans] = useState<ScanRecord[]>(() => readScans())

  useEffect(() => {
    const unsubscribe = subscribeScans((scans) => setSavedScans(scans))
    return unsubscribe
  }, [])

  return useMemo(() => [...savedScans, ...mockScans], [savedScans])
}