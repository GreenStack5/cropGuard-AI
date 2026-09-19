import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Edit3, Package, Plus, Trash2, X } from 'lucide-react'
import type { AgroProduct } from '../../types'
import { addProduct, deleteProduct, getProducts, updateProduct } from '../../services/productService'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { PageHeader } from '../../components/ui/PageHeader'

export function SupplierProducts() {
  const supplierId = 'sup-1'
  const [products, setProducts] = useState<AgroProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AgroProduct | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Fungicide')
  const [description, setDescription] = useState('')
  const [whatItDoes, setWhatItDoes] = useState('')
  const [price, setPrice] = useState(5000)
  const [unit, setUnit] = useState('500g sachet')
  const [cropTypes, setCropTypes] = useState('Maize, Tomato, Potato')
  const [diseaseTypes, setDiseaseTypes] = useState('Blight, Rust, Spot')
  const [submitting, setSubmitting] = useState(false)

  const loadProducts = async () => {
    setLoading(true)
    const list = await getProducts(supplierId)
    setProducts(list)
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const openAddModal = () => {
    setEditingProduct(null)
    setName('')
    setCategory('Fungicide')
    setDescription('')
    setWhatItDoes('')
    setPrice(5000)
    setUnit('500g sachet')
    setCropTypes('Maize, Tomato, Potato')
    setDiseaseTypes('Blight, Rust, Spot')
    setShowModal(true)
  }

  const openEditModal = (prod: AgroProduct) => {
    setEditingProduct(prod)
    setName(prod.name)
    setCategory(prod.category)
    setDescription(prod.description)
    setWhatItDoes(prod.whatItDoes || '')
    setPrice(prod.price)
    setUnit(prod.unit)
    setCropTypes(prod.cropTypes.join(', '))
    setDiseaseTypes(prod.diseaseTypes.join(', '))
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    const crops = cropTypes.split(',').map((s) => s.trim()).filter(Boolean)
    const diseases = diseaseTypes.split(',').map((s) => s.trim()).filter(Boolean)

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name,
        category,
        description,
        whatItDoes,
        price,
        unit,
        cropTypes: crops,
        diseaseTypes: diseases,
      })
    } else {
      await addProduct({
        supplierId,
        supplierName: 'CropGuard Demo Agro Supplies',
        supplierState: 'Abuja',
        supplierCity: 'Gwagwalada',
        supplierPhone: '+234 802 123 4567',
        supplierVerified: true,
        bankName: 'First Bank of Nigeria',
        accountName: 'CropGuard Demo Agro Supplies',
        accountNumber: '2034918234',
        name,
        category,
        description,
        whatItDoes,
        price,
        unit,
        cropTypes: crops,
        diseaseTypes: diseases,
        stockStatus: 'in_stock',
      })
    }

    setSubmitting(false)
    setShowModal(false)
    loadProducts()
  }

  const handleToggleStock = async (prod: AgroProduct) => {
    const nextStatus = prod.stockStatus === 'in_stock' ? 'out_of_stock' : 'in_stock'
    await updateProduct(prod.id, { stockStatus: nextStatus })
    loadProducts()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this product?')) {
      await deleteProduct(id)
      loadProducts()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Agro-Products Inventory"
          subtitle="Manage your input product catalog, stock availability, and recommended dosages."
        />
        <Button
          onClick={openAddModal}
          leadingIcon={<Plus className="size-4" />}
          className="bg-brand-700 text-white hover:bg-brand-800"
        >
          Add Product
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-stone-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-stone-200/70 bg-white p-12 text-center">
          <Package className="mx-auto size-10 text-stone-300" />
          <h3 className="mt-4 text-base font-bold text-ink">No products listed</h3>
          <p className="mt-1 text-sm text-stone-500">
            Click Add Product to start listing agricultural inputs for farmers.
          </p>
          <Button onClick={openAddModal} className="mt-4 bg-brand-700 text-white">
            Add Product Now
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="flex flex-col justify-between rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge tone={prod.category === 'Fungicide' ? 'danger' : 'brand'}>
                    {prod.category}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => handleToggleStock(prod)}
                    className="cursor-pointer"
                  >
                    <Badge tone={prod.stockStatus === 'in_stock' ? 'success' : 'neutral'} dot>
                      {prod.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </button>
                </div>

                <h3 className="mt-4 text-lg font-bold text-ink">{prod.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-stone-500">{prod.description}</p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {prod.cropTypes.map((c) => (
                    <span
                      key={c}
                      className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-stone-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400">Price per {prod.unit}</span>
                  <p className="text-lg font-extrabold text-brand-800">
                    ₦{prod.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditModal(prod)}
                    className="text-stone-600 hover:text-ink"
                  >
                    <Edit3 className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(prod.id)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200"
            >
              <X className="size-5" />
            </button>

            <h2 className="text-xl font-extrabold text-ink">
              {editingProduct ? 'Edit Product' : 'Add New Agro-Product'}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Fill in product information to list it in the recommended inputs database.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Copper Hydroxide 50WP"
                  className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                  >
                    <option value="Fungicide">Fungicide</option>
                    <option value="Bio-pesticide">Bio-pesticide</option>
                    <option value="Foliar Fertilizer">Foliar Fertilizer</option>
                    <option value="Soil Treatment">Soil Treatment</option>
                    <option value="Organic Treatment">Organic Treatment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Price (₦)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Unit Packaging</label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. 500g sachet or 1L bottle"
                  className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of product formula..."
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Suitable Crops (comma-separated)</label>
                <input
                  type="text"
                  value={cropTypes}
                  onChange={(e) => setCropTypes(e.target.value)}
                  placeholder="Maize, Tomato, Potato"
                  className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Suitable Diseases/Problems (comma-separated)</label>
                <input
                  type="text"
                  value={diseaseTypes}
                  onChange={(e) => setDiseaseTypes(e.target.value)}
                  placeholder="Blight, Rust, Leaf Spot"
                  className="h-10 w-full rounded-xl border border-stone-200 px-3 text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-brand-700 text-white">
                  {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
