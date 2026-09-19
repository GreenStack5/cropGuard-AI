import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { db } from './db.js'
import {
  OrderCreateSchema,
  NotificationReadSchema,
  ScanRequestBodySchema,
  SupplierQuerySchema,
} from './schema.js'
import { analyzeWithGeminiSDK, resolveGeminiEnv } from './gemini-scan.js'

dotenv.config({ path: '.env.local' })
dotenv.config()

export const app = express()

app.use(cors())
app.use(express.json({ limit: '25mb' }))

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Crop Analysis API
app.post('/api/analyze', async (req, res) => {
  const { apiKey, model } = resolveGeminiEnv()

  if (!apiKey) {
    res.status(503).json({
      error: 'The analysis service is not configured. Add GEMINI_API_KEY or cropGaurd_API_Key to .env.local.',
      code: 'ANALYSIS_NOT_CONFIGURED',
    })
    return
  }

  const parseResult = ScanRequestBodySchema.safeParse(req.body)
  if (!parseResult.success) {
    res.status(400).json({
      error: 'Invalid request body.',
      details: parseResult.error.issues,
    })
    return
  }

  const outcome = await analyzeWithGeminiSDK(apiKey, model, parseResult.data.images)
  if (!outcome.ok) {
    res.status(502).json({ error: outcome.message })
    return
  }

  res.json({ result: outcome.result })
})

// Scans API
app.get('/api/scans', (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM scans ORDER BY created_at DESC LIMIT 50').all() as Array<Record<string, unknown>>
    const scans = rows.map((r) => ({
      id: r.id,
      farmerId: r.farmer_id,
      cropName: r.crop_name,
      condition: r.condition,
      confidence: r.confidence,
      diseaseName: r.disease_name ?? null,
      scientificName: r.scientific_name ?? null,
      description: r.description ?? '',
      symptoms: r.symptoms ? JSON.parse(r.symptoms as string) : [],
      causes: r.causes ? JSON.parse(r.causes as string) : [],
      treatment: r.treatment ? JSON.parse(r.treatment as string) : [],
      prevention: r.prevention ? JSON.parse(r.prevention as string) : [],
      recommendations: r.recommendations ? JSON.parse(r.recommendations as string) : [],
      precautions: r.precautions ?? '',
      thumbnail: r.thumbnail ?? '',
      date: (r.created_at as string).split('T')[0] || new Date().toISOString().split('T')[0],
      created_at: r.created_at,
    }))

    res.json({ scans })
  } catch {
    res.status(500).json({ error: 'Could not fetch scans history.' })
  }
})

app.post('/api/scans', (req, res) => {
  try {
    const {
      id,
      cropName,
      condition,
      confidence,
      diseaseName,
      scientificName,
      description,
      symptoms,
      causes,
      treatment,
      prevention,
      recommendations,
      precautions,
      thumbnail,
    } = req.body

    const scanId = id || `scan-${Date.now()}`

    db.prepare(`
      INSERT INTO scans (id, farmer_id, crop_name, condition, confidence, disease_name, scientific_name, description, symptoms, causes, treatment, prevention, recommendations, precautions, thumbnail)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      scanId,
      'demo-farmer-1',
      cropName || 'Crop',
      condition || 'healthy',
      confidence || 80,
      diseaseName || null,
      scientificName || null,
      description || '',
      JSON.stringify(symptoms || []),
      JSON.stringify(causes || []),
      JSON.stringify(treatment || []),
      JSON.stringify(prevention || []),
      JSON.stringify(recommendations || []),
      precautions || '',
      thumbnail || '',
    )

    res.json({ success: true, id: scanId })
  } catch {
    res.status(500).json({ error: 'Failed to save scan record.' })
  }
})

// Supplier Matching API (Location-Aware)
app.get('/api/suppliers/recommended', (req, res) => {
  try {
    const parse = SupplierQuerySchema.safeParse(req.query)
    const { state, city, category, crop, disease } = parse.success ? parse.data : {}

    const allSuppliers = db.prepare(`
      SELECT s.*,
             (SELECT COUNT(*) FROM products p WHERE p.supplier_id = s.id) as product_count
      FROM suppliers s
      WHERE s.verified = 1
    `).all() as Array<Record<string, unknown>>

    const rankedSuppliers = allSuppliers.map((sup) => {
      let score = 0
      if (city && String(sup.city).toLowerCase() === city.toLowerCase()) {
        score += 50
      }
      if (state && String(sup.state).toLowerCase() === state.toLowerCase()) {
        score += 30
      }
      return { ...sup, rankScore: score }
    }).sort((a, b) => b.rankScore - a.rankScore)

    const products = db.prepare('SELECT p.*, s.business_name as supplier_name, s.state as supplier_state, s.city as supplier_city, s.phone as supplier_phone, s.bank_name, s.account_name, s.account_number FROM products p JOIN suppliers s ON p.supplier_id = s.id').all() as Array<Record<string, unknown>>

    const filteredProducts = products.filter((p) => {
      const cropTypes: string[] = JSON.parse(p.crop_types as string || '[]')
      const diseaseTypes: string[] = JSON.parse(p.disease_types as string || '[]')

      let matchesCrop = true
      let matchesDisease = true
      let matchesCategory = true

      if (crop) {
        matchesCrop = cropTypes.some((c) => c.toLowerCase().includes(crop.toLowerCase()))
      }
      if (disease) {
        matchesDisease = diseaseTypes.some((d) => d.toLowerCase().includes(disease.toLowerCase()))
      }
      if (category) {
        matchesCategory = String(p.category).toLowerCase().includes(category.toLowerCase())
      }

      return matchesCrop || matchesDisease || matchesCategory
    })

    res.json({
      suppliers: rankedSuppliers,
      recommendedProducts: filteredProducts.length > 0 ? filteredProducts : products,
    })
  } catch {
    res.status(500).json({ error: 'Could not fetch supplier recommendations.' })
  }
})

// Recommended Products API
app.get('/api/products/recommended', (req, res) => {
  try {
    const { crop, disease, state } = req.query
    const products = db.prepare(`
      SELECT p.*,
             s.business_name as supplier_name,
             s.owner_name as supplier_owner,
             s.state as supplier_state,
             s.city as supplier_city,
             s.phone as supplier_phone,
             s.verified as supplier_verified,
             s.bank_name,
             s.account_name,
             s.account_number
      FROM products p
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE s.verified = 1
    `).all() as Array<Record<string, unknown>>

    const ranked = products.map((p) => {
      let score = 0
      const cropTypes: string[] = JSON.parse(p.crop_types as string || '[]')
      const diseaseTypes: string[] = JSON.parse(p.disease_types as string || '[]')

      if (crop && cropTypes.some((c) => c.toLowerCase().includes(String(crop).toLowerCase()))) {
        score += 40
      }
      if (disease && diseaseTypes.some((d) => d.toLowerCase().includes(String(disease).toLowerCase()))) {
        score += 50
      }
      if (state && String(p.supplier_state).toLowerCase() === String(state).toLowerCase()) {
        score += 20
      }

      return {
        id: p.id,
        supplierId: p.supplier_id,
        supplierName: p.supplier_name,
        supplierState: p.supplier_state,
        supplierCity: p.supplier_city,
        supplierPhone: p.supplier_phone,
        supplierVerified: Boolean(p.supplier_verified),
        bankName: p.bank_name,
        accountName: p.account_name,
        accountNumber: p.account_number,
        name: p.name,
        category: p.category,
        description: p.description,
        price: p.price,
        unit: p.unit,
        cropTypes: cropTypes,
        diseaseTypes: diseaseTypes,
        stockStatus: p.stock_status,
        relevanceScore: score,
      }
    }).sort((a, b) => b.relevanceScore - a.relevanceScore)

    res.json({ products: ranked })
  } catch {
    res.status(500).json({ error: 'Could not fetch product recommendations.' })
  }
})

// Orders API
app.post('/api/orders', (req, res) => {
  try {
    const parse = OrderCreateSchema.safeParse(req.body)
    if (!parse.success) {
      res.status(400).json({ error: 'Invalid order input.', details: parse.error.issues })
      return
    }

    const { farmerId, supplierId, productId, quantity, deliveryState, deliveryCity, deliveryAddress, receiptUrl } = parse.data

    const product = db.prepare('SELECT price FROM products WHERE id = ?').get(productId) as { price: number } | undefined
    if (!product) {
      res.status(404).json({ error: 'Product not found.' })
      return
    }

    const totalAmount = product.price * quantity
    const orderId = `ord-${Date.now()}`

    db.prepare(`
      INSERT INTO orders (id, farmer_id, supplier_id, product_id, quantity, total_amount, delivery_state, delivery_city, delivery_address, receipt_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      farmerId,
      supplierId,
      productId,
      quantity,
      totalAmount,
      deliveryState,
      deliveryCity,
      deliveryAddress,
      receiptUrl || null,
      'payment_submitted',
    )

    // Notify Supplier
    const notifId = `notif-${Date.now()}`
    db.prepare(`
      INSERT INTO notifications (id, supplier_id, order_id, title, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      notifId,
      supplierId,
      orderId,
      'New Agro-Product Order Placed',
      `Farmer placed order #${orderId} for ₦${totalAmount.toLocaleString()} with bank transfer receipt attached.`,
    )

    res.json({
      success: true,
      order: {
        id: orderId,
        supplierId,
        productId,
        quantity,
        totalAmount,
        status: 'payment_submitted',
        deliveryState,
        deliveryCity,
      },
    })
  } catch {
    res.status(500).json({ error: 'Failed to create order.' })
  }
})

app.get('/api/orders', (_req, res) => {
  try {
    const rows = db.prepare(`
      SELECT o.*, p.name as product_name, p.price as unit_price, s.business_name as supplier_name, s.phone as supplier_phone
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN suppliers s ON o.supplier_id = s.id
      ORDER BY o.created_at DESC
    `).all()

    res.json({ orders: rows })
  } catch {
    res.status(500).json({ error: 'Could not fetch orders.' })
  }
})

// Supplier Notifications API
app.get('/api/supplier/notifications', (req, res) => {
  try {
    const supplierId = (req.query.supplierId as string) || 'sup-1'
    const rows = db.prepare('SELECT * FROM notifications WHERE supplier_id = ? ORDER BY created_at DESC').all(supplierId)
    res.json({ notifications: rows })
  } catch {
    res.status(500).json({ error: 'Could not fetch notifications.' })
  }
})

app.patch('/api/supplier/notifications/:id/read', (req, res) => {
  try {
    const notifId = req.params.id
    const parse = NotificationReadSchema.safeParse(req.body)
    if (!parse.success) {
      res.status(400).json({ error: 'Invalid body' })
      return
    }

    db.prepare('UPDATE notifications SET read = ? WHERE id = ?').run(parse.data.read ? 1 : 0, notifId)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Could not update notification.' })
  }
})

// Middleware fallback for non-API routes when mounted in Vite
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return next()
  }
  res.status(404).json({ error: 'API endpoint not found.' })
})

const PORT = process.env.PORT || 3001

if (process.env.START_SERVER === 'true') {
  app.listen(PORT, () => {
    console.log(`[CropGuard Backend Server] Running on http://localhost:${PORT}`)
  })
}
