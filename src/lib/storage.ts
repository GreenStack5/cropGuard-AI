import type { FarmerProfile, Supplier, ScanRecord, FarmerLocation } from './types'

export const LOCATIONS: Record<string, string[]> = {
  Lagos: ['Ikeja', 'Alimosho', 'Mushin', 'Surulere', 'Ojo', 'Epe', 'Ikorodu', 'Badagry'],
  Ogun: ['Abeokuta North', 'Sagamu', 'Ijebu Ode'],
  Oyo: ['Ibadan North', 'Ibadan South West'],
}

export const LGA_CENTERS: Record<string, { x: number; y: number }> = {
  Ikeja: { x: 0, y: 0 },
  Alimosho: { x: 5.4, y: 0 },
  Mushin: { x: 7.2, y: 0 },
  Surulere: { x: 8.6, y: -1.8 },
  Ojo: { x: 12.4, y: -5.6 },
  Epe: { x: 14, y: -9 },
  Ikorodu: { x: 11.5, y: 3.2 },
  Badagry: { x: 16, y: -8 },
  'Abeokuta North': { x: 18, y: 14 },
  Sagamu: { x: 16, y: 10 },
  'Ijebu Ode': { x: 22, y: 13 },
  'Ibadan North': { x: 55, y: 25 },
  'Ibadan South West': { x: 56, y: 27 },
}

export const DEFAULT_FARMER_LOCATION: FarmerLocation = { state: 'Lagos', lga: 'Ikeja' }

export interface DemoSupplierSeed {
  id: string
  shopName: string
  ownerName: string
  phone: string
  state: string
  lga: string
  address: string
  x: number
  y: number
  products: { name: string; price: number; stock: number; unit: string }[]
}

const DEMO_SUPPLIERS: DemoSupplierSeed[] = [
  {
    id: 'sup-greenfarm',
    shopName: 'GreenFarm Agro Services',
    ownerName: 'Adebayo Ogunleye',
    phone: '08000000001',
    state: 'Lagos',
    lga: 'Ikeja',
    address: '12 Oba Akran Avenue, Ikeja, Lagos',
    x: 1.4,
    y: 1.57,
    products: [
      { name: 'Mancozeb', price: 4000, stock: 23, unit: 'units' },
      { name: 'NPK Fertilizer', price: 18500, stock: 12, unit: 'bags' },
      { name: 'Urea', price: 15000, stock: 8, unit: 'bags' },
    ],
  },
  {
    id: 'sup-farmcare',
    shopName: 'FarmCare Supplies',
    ownerName: 'Ngozi Eze',
    phone: '08000000002',
    state: 'Lagos',
    lga: 'Alimosho',
    address: '5 Ipaja Road, Alimosho, Lagos',
    x: 5.3,
    y: 1.0,
    products: [
      { name: 'Mancozeb', price: 3700, stock: 12, unit: 'units' },
      { name: 'Urea', price: 15500, stock: 6, unit: 'bags' },
    ],
  },
  {
    id: 'sup-harvesthub',
    shopName: 'Harvest Hub Agro',
    ownerName: 'Musa Ibrahim',
    phone: '08000000003',
    state: 'Lagos',
    lga: 'Mushin',
    address: '20 Ladipo Street, Mushin, Lagos',
    x: 7.0,
    y: 1.7,
    products: [
      { name: 'Mancozeb', price: 4200, stock: 7, unit: 'units' },
      { name: 'NPK Fertilizer', price: 19000, stock: 10, unit: 'bags' },
    ],
  },
  {
    id: 'sup-agrolink',
    shopName: 'AgroLink Traders',
    ownerName: 'Yetunde Adeleke',
    phone: '08000000004',
    state: 'Lagos',
    lga: 'Surulere',
    address: '3 Adeniran Ogunsanya St, Surulere, Lagos',
    x: 8.8,
    y: -2.2,
    products: [{ name: 'Mancozeb', price: 4100, stock: 15, unit: 'units' }],
  },
  {
    id: 'sup-lagosfarm',
    shopName: 'Lagos Farm Mart',
    ownerName: 'Chidi Okonkwo',
    phone: '08000000005',
    state: 'Lagos',
    lga: 'Ojo',
    address: '9 LASU Road, Ojo, Lagos',
    x: 12.9,
    y: -6.0,
    products: [{ name: 'Mancozeb', price: 3900, stock: 9, unit: 'units' }],
  },
  {
    id: 'sup-agricdepot',
    shopName: 'Agric Depot Abeokuta',
    ownerName: 'Tunde Alabi',
    phone: '08000000006',
    state: 'Ogun',
    lga: 'Abeokuta North',
    address: '11 Ijemo Road, Abeokuta, Ogun',
    x: 18.9,
    y: 14.8,
    products: [{ name: 'Mancozeb', price: 3600, stock: 20, unit: 'units' }],
  },
]

const SUPPLIERS_KEY = 'cg.suppliers'
const SCANS_KEY = 'cg.scans'
const LOCATION_KEY = 'cg.location'
const ROLE_KEY = 'cg.role'
const CURRENT_SUPPLIER_KEY = 'cg.currentSupplierId'
const FARMER_PROFILE_KEY = 'cg.farmerProfile'

function seed(): Supplier[] {
  return DEMO_SUPPLIERS.map((s) => ({
    ...s,
    verified: true,
    createdAt: new Date().toISOString(),
    products: s.products.map((p, i) => ({ ...p, id: `seed-${s.id}-${i}` })),
  }))
}

export function getSuppliers(): Supplier[] {
  try {
    const raw = localStorage.getItem(SUPPLIERS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Supplier[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // fall through to seed
  }
  const seeded = seed()
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(seeded))
  return seeded
}

export function saveSuppliers(list: Supplier[]): void {
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(list))
}

export function getSupplierById(id: string | null): Supplier | null {
  const list = getSuppliers()
  return list.find((s) => s.id === id) ?? list[0] ?? null
}

export function getScans(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(SCANS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ScanRecord[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // ignore corrupt data
  }
  return []
}

export function addScan(record: ScanRecord): ScanRecord[] {
  const next = [record, ...getScans()].slice(0, 30)
  localStorage.setItem(SCANS_KEY, JSON.stringify(next))
  return next
}

export function getStoredLocation(): FarmerLocation {
  try {
    const raw = localStorage.getItem(LOCATION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as FarmerLocation
      if (parsed && parsed.state && parsed.lga) return parsed
    }
  } catch {
    // fall through
  }
  return DEFAULT_FARMER_LOCATION
}

export function saveStoredLocation(loc: FarmerLocation): void {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(loc))
}

export function getStoredRole(): 'farmer' | 'supplier' | null {
  const raw = localStorage.getItem(ROLE_KEY)
  return raw === 'farmer' || raw === 'supplier' ? raw : null
}

export function saveStoredRole(role: 'farmer' | 'supplier' | null): void {
  if (role) localStorage.setItem(ROLE_KEY, role)
  else localStorage.removeItem(ROLE_KEY)
}

export function getCurrentSupplierId(): string | null {
  return localStorage.getItem(CURRENT_SUPPLIER_KEY)
}

export function setCurrentSupplierId(id: string): void {
  localStorage.setItem(CURRENT_SUPPLIER_KEY, id)
}

export function getFarmerProfile(): FarmerProfile | null {
  try {
    const raw = localStorage.getItem(FARMER_PROFILE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as FarmerProfile
      if (parsed && parsed.name) return parsed
    }
  } catch {
    // fall through
  }
  return null
}

export function saveFarmerProfile(profile: FarmerProfile): void {
  localStorage.setItem(FARMER_PROFILE_KEY, JSON.stringify(profile))
}