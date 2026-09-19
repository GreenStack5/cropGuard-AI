import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'

const dbDir = path.resolve(process.cwd(), 'data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'cropguard.db')
export const db = new Database(dbPath)

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL')

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS farmers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      state TEXT NOT NULL DEFAULT 'Abuja',
      city TEXT NOT NULL DEFAULT 'FCT',
      farm_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      business_name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      state TEXT NOT NULL,
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      verified INTEGER NOT NULL DEFAULT 1,
      bank_name TEXT NOT NULL,
      account_name TEXT NOT NULL,
      account_number TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      supplier_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      unit TEXT NOT NULL DEFAULT 'bottle',
      crop_types TEXT NOT NULL,
      disease_types TEXT NOT NULL,
      stock_status TEXT NOT NULL DEFAULT 'in_stock',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );

    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      farmer_id TEXT,
      crop_name TEXT NOT NULL,
      condition TEXT NOT NULL,
      confidence INTEGER NOT NULL,
      disease_name TEXT,
      scientific_name TEXT,
      description TEXT,
      symptoms TEXT,
      causes TEXT,
      treatment TEXT,
      prevention TEXT,
      recommendations TEXT,
      precautions TEXT,
      thumbnail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      farmer_id TEXT NOT NULL DEFAULT 'demo-farmer-1',
      supplier_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      total_amount REAL NOT NULL,
      delivery_state TEXT NOT NULL,
      delivery_city TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      receipt_url TEXT,
      status TEXT NOT NULL DEFAULT 'pending_payment',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      supplier_id TEXT NOT NULL,
      order_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `)

  seedDemoData()
}

function seedDemoData() {
  const existingSuppliers = db.prepare('SELECT COUNT(*) as count FROM suppliers').get() as { count: number }
  if (existingSuppliers.count > 0) return

  const insertSupplier = db.prepare(`
    INSERT INTO suppliers (id, business_name, owner_name, email, phone, state, city, address, verified, bank_name, account_name, account_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertProduct = db.prepare(`
    INSERT INTO products (id, supplier_id, name, category, description, price, unit, crop_types, disease_types, stock_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertFarmer = db.prepare(`
    INSERT INTO farmers (id, name, email, phone, state, city, farm_name)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  // Seed Farmer
  insertFarmer.run('demo-farmer-1', 'Ibrahim Musa', 'ibrahim.musa@example.com', '+2348031234567', 'Abuja', 'Gwagwalada', 'GreenPastures Farm')

  // Seed Suppliers
  const suppliersData = [
    {
      id: 'sup-1',
      business_name: 'AgroCare Supplies (Demo)',
      owner_name: 'Dr. Chidi Okafor',
      email: 'contact@agrocare.demo',
      phone: '+2348021112233',
      state: 'Abuja',
      city: 'Gwagwalada',
      address: 'Plot 14 Agro Industrial Estate, Gwagwalada, Abuja',
      verified: 1,
      bank_name: 'First Bank Nigeria',
      account_name: 'AgroCare Enterprise',
      account_number: '3012948172',
    },
    {
      id: 'sup-2',
      business_name: 'GreenYield Inputs (Demo)',
      owner_name: 'Alhaji Sani Umar',
      email: 'sales@greenyield.demo',
      phone: '+2348054445566',
      state: 'Kano',
      city: 'Kano Municipal',
      address: '22 Bompai Road, Kano',
      verified: 1,
      bank_name: 'Zenith Bank',
      account_name: 'GreenYield Agro Ltd',
      account_number: '1015829301',
    },
    {
      id: 'sup-3',
      business_name: 'HarvestPro Solutions (Demo)',
      owner_name: 'Mrs. Folake Adebayo',
      email: 'info@harvestpro.demo',
      phone: '+2348037778899',
      state: 'Oyo',
      city: 'Ibadan',
      address: '8 Bodija Market Road, Ibadan, Oyo',
      verified: 1,
      bank_name: 'GTBank',
      account_name: 'HarvestPro Ventures',
      account_number: '0129481029',
    },
    {
      id: 'sup-4',
      business_name: 'Lagos Agro Hub (Demo)',
      owner_name: 'Babajide Martins',
      email: 'hub@lagosagro.demo',
      phone: '+2348098889900',
      state: 'Lagos',
      city: 'Ikeja',
      address: '12 Oba Akran Avenue, Ikeja, Lagos',
      verified: 1,
      bank_name: 'Access Bank',
      account_name: 'Lagos Agro Hub Ltd',
      account_number: '0049281726',
    },
  ]

  for (const s of suppliersData) {
    insertSupplier.run(
      s.id,
      s.business_name,
      s.owner_name,
      s.email,
      s.phone,
      s.state,
      s.city,
      s.address,
      s.verified,
      s.bank_name,
      s.account_name,
      s.account_number,
    )
  }

  // Seed Products
  const productsData = [
    {
      id: 'prod-1',
      supplier_id: 'sup-1',
      name: 'CopperMax 50WP Fungicide',
      category: 'Fungicide',
      description: 'Broad-spectrum copper hydroxide fungicide designed to treat Early Blight, Late Blight, and Leaf Spot on Tomatoes, Potatoes, and Maize.',
      price: 18500,
      unit: '1kg pack',
      crop_types: JSON.stringify(['Tomato', 'Potato', 'Maize', 'Pepper']),
      disease_types: JSON.stringify(['Early Blight', 'Late Blight', 'Leaf Spot', 'Bacterial Spot']),
      stock_status: 'in_stock',
    },
    {
      id: 'prod-2',
      supplier_id: 'sup-1',
      name: 'BioShield Neem Oil Extract',
      category: 'Bio-Pesticide',
      description: 'Organic cold-pressed neem oil formulation for managing aphids, whiteflies, and caterpillar infestations.',
      price: 14000,
      unit: '1 Litre bottle',
      crop_types: JSON.stringify(['Tomato', 'Cassava', 'Yam', 'Cabbage', 'Maize']),
      disease_types: JSON.stringify(['Aphid Infestation', 'Whitefly Pest', 'Leaf Miner', 'Pest Attack']),
      stock_status: 'in_stock',
    },
    {
      id: 'prod-3',
      supplier_id: 'sup-2',
      name: 'RustCure Systemic Fungicide',
      category: 'Fungicide',
      description: 'High-potency triazole systemic fungicide formulated specifically for Common Rust and Northern Leaf Blight in Maize and Wheat.',
      price: 24500,
      unit: '500ml bottle',
      crop_types: JSON.stringify(['Maize', 'Wheat', 'Rice']),
      disease_types: JSON.stringify(['Common Rust', 'Southern Rust', 'Northern Leaf Blight']),
      stock_status: 'in_stock',
    },
    {
      id: 'prod-4',
      supplier_id: 'sup-3',
      name: 'Trichoderma Bio-Fungicide',
      category: 'Bio-Control',
      description: 'Beneficial soil fungus inoculation that protects roots against Fusarium Wilt, Root Rot, and Damping Off.',
      price: 16000,
      unit: '500g pouch',
      crop_types: JSON.stringify(['Tomato', 'Pepper', 'Cassava', 'Yam', 'Beans']),
      disease_types: JSON.stringify(['Fusarium Wilt', 'Root Rot', 'Damping Off', 'Cassava Mosaic']),
      stock_status: 'in_stock',
    },
    {
      id: 'prod-5',
      supplier_id: 'sup-4',
      name: 'AgroBoost Foliar Micronutrient',
      category: 'Fertilizer',
      description: 'Enriched Zinc, Magnesium, and Nitrogen foliar fertilizer to aid rapid recovery from nutrient deficiency and yellowing leaves.',
      price: 12500,
      unit: '1 Litre bottle',
      crop_types: JSON.stringify(['Maize', 'Rice', 'Tomato', 'Yam', 'Cassava']),
      disease_types: JSON.stringify(['Nutrient Deficiency', 'Yellowing', 'Magnesium Deficiency']),
      stock_status: 'in_stock',
    },
  ]

  for (const p of productsData) {
    insertProduct.run(
      p.id,
      p.supplier_id,
      p.name,
      p.category,
      p.description,
      p.price,
      p.unit,
      p.crop_types,
      p.disease_types,
      p.stock_status,
    )
  }
}

// Initialize database on import
initDb()
