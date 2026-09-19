export interface ProductItem {
  id: string
  name: string
  price: number
  stock: number
  unit: string
}

export interface Supplier {
  id: string
  shopName: string
  ownerName: string
  phone: string
  state: string
  lga: string
  address: string
  verified: boolean
  createdAt: string
  x: number
  y: number
  products: ProductItem[]
}

export interface Diagnosis {
  crop: string
  issue: string
  confidence: number
  description: string
  treatment: string
  product: string
  priceRange: string
  severity: 'low' | 'medium' | 'high'
}

export interface ScanRecord {
  id: string
  crop: string
  issue: string
  confidence: number
  treatment: string
  product: string
  date: string
  thumb: string | null
}

export interface FarmerLocation {
  state: string
  lga: string
}

export type View =
  | 'landing'
  | 'roles'
  | 'auth'
  | 'how'
  | 'features'
  | 'dashboard'
  | 'scan'
  | 'result'
  | 'finders'
  | 'history'
  | 'location'
  | 'portal'
  | 'register'

export type Role = 'farmer' | 'supplier' | null

export interface FarmerProfile {
  name: string
  phone?: string
}