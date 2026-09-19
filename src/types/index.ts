export type UserRole = 'farmer' | 'supplier'

export type Route =
  | 'home'
  | 'scan'
  | 'disease'
  | 'alerts'
  | 'tips'
  | 'history'
  | 'profile'
  | 'settings'
  | 'supplier'
  | 'supplier-products'
  | 'supplier-orders'
  | 'supplier-notifications'
  | 'supplier-profile'
  | 'supplier-settings'

export type CropHealth = 'healthy' | 'at-risk' | 'affected'

export interface Crop {
  id: string
  name: string
  category: string
  image?: string
}

export interface Disease {
  id: string
  name: string
  scientificName: string
  crop: string
  category: string
  severity: 'low' | 'moderate' | 'high'
  summary: string
  symptoms: string[]
  causes: string[]
  prevention: string[]
  treatment: string[]
  image?: string
}

export interface ScanRecord {
  id: string
  cropName: string
  cropEmoji: string
  fileName: string
  date: string
  time: string
  status: 'healthy' | 'affected' | 'at-risk'
  confidence: number
  diseaseName?: string
  location: string
  source?: 'library' | 'ai'
  result?: CropScanResult
  thumbnail?: string
}

export type AlertType =
  | 'crop-warning'
  | 'disease'
  | 'reminder'
  | 'weather'
  | 'system'

export interface Alert {
  id: string
  type: AlertType
  title: string
  message: string
  date: string
  read: boolean
}

export interface PreventionTip {
  id: string
  category: string
  title: string
  excerpt: string
  steps: string[]
}

export interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  farmName: string
  farmSize: string
  primaryCrops: string
  memberSince: string
  timezone: string
}

export type ScanState =
  | 'idle'
  | 'camera'
  | 'preview'
  | 'scanning'
  | 'result'
  | 'error'

export interface DiseaseResult {
  disease: Disease
  confidence: number
  status: Extract<CropHealth, 'affected' | 'at-risk'>
}

export interface CropScanResult {
  cropName: string
  condition: CropHealth
  confidence: number
  diseaseName: string | null
  scientificName: string | null
  description: string
  symptoms: string[]
  causes: string[]
  treatment: string[]
  prevention: string[]
  recommendations: string[]
  precautions: string
}

export interface Supplier {
  id: string
  businessName: string
  ownerName: string
  email?: string
  phone: string
  state: string
  city: string
  address: string
  verified: boolean
  bankName: string
  accountName: string
  accountNumber: string
  productCount?: number
  rankScore?: number
}

export interface AgroProduct {
  id: string
  supplierId: string
  supplierName: string
  supplierState: string
  supplierCity: string
  supplierPhone: string
  supplierVerified: boolean
  bankName: string
  accountName: string
  accountNumber: string
  name: string
  category: string
  description: string
  whatItDoes?: string
  price: number
  unit: string
  cropTypes: string[]
  diseaseTypes: string[]
  stockStatus: 'in_stock' | 'out_of_stock'
  relevanceScore?: number
  created_at?: string
}

export interface PaymentReceipt {
  fileName: string
  fileType: string
  fileSize: number
  dataUrl: string
}

export type OrderStatus =
  | 'payment_submitted'
  | 'confirmed'
  | 'processing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  farmerId: string
  farmerName: string
  farmerPhone?: string
  supplierId: string
  supplierName: string
  supplierPhone?: string
  productId: string
  productName: string
  unitPrice: number
  quantity: number
  totalAmount: number
  deliveryState: string
  deliveryCity: string
  deliveryAddress: string
  deliveryNote?: string
  receipt?: PaymentReceipt
  receiptUrl?: string
  status: OrderStatus
  created_at: string
  updated_at?: string
}

export interface SupplierNotification {
  id: string
  supplierId: string
  title: string
  message: string
  orderId: string
  farmerName: string
  productName: string
  totalAmount: number
  read: boolean
  created_at: string
}