import type { FarmerLocation, Supplier } from './types'
import { LGA_CENTERS } from './storage'

// Distance between the farmer's location and a supplier.
// Reference points are currently the centre of the farmer's LGA.
// A future GPS build can pass real co-ordinates into getFarmerCoords
// without changing the callers below.
export function getFarmerCoords(location: FarmerLocation): { x: number; y: number } {
  return LGA_CENTERS[location.lga] ?? LGA_CENTERS['Ikeja'] ?? { x: 0, y: 0 }
}

export function distanceKm(location: FarmerLocation, supplier: Supplier): number {
  const ref = getFarmerCoords(location)
  const dx = supplier.x - ref.x
  const dy = supplier.y - ref.y
  const d = Math.sqrt(dx * dx + dy * dy)
  return Math.round(d * 10) / 10
}

export function formatDistance(location: FarmerLocation, supplier: Supplier): string {
  const d = distanceKm(location, supplier)
  if (d < 1) return `${Math.max(1, Math.round(d * 1000))} m away`
  return `${d.toFixed(1)} km away`
}