import { z } from 'zod'

export const ScanImageInputSchema = z.object({
  mimeType: z.string().min(1, 'Mime type is required'),
  data: z.string().min(1, 'Base64 image data is required'),
})

export const ScanRequestBodySchema = z.object({
  images: z.array(ScanImageInputSchema).min(1, 'At least one image is required').max(4),
})

export const CropScanResultSchema = z.object({
  cropName: z.string().min(1).default('Unknown crop'),
  condition: z.enum(['healthy', 'at-risk', 'affected']),
  confidence: z.number().min(0).max(100),
  diseaseName: z.string().nullable().optional().default(null),
  scientificName: z.string().nullable().optional().default(null),
  description: z.string().default(''),
  symptoms: z.array(z.string()).default([]),
  causes: z.array(z.string()).default([]),
  treatment: z.array(z.string()).default([]),
  prevention: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  precautions: z
    .string()
    .default(
      'This assessment is AI-generated and not a substitute for professional diagnosis. Confirm with a local agricultural expert before treating.',
    ),
})

export type CropScanResultType = z.infer<typeof CropScanResultSchema>

export const SupplierQuerySchema = z.object({
  state: z.string().optional(),
  city: z.string().optional(),
  crop: z.string().optional(),
  disease: z.string().optional(),
  category: z.string().optional(),
})

export const OrderCreateSchema = z.object({
  farmerId: z.string().optional().default('demo-farmer-1'),
  supplierId: z.string().min(1, 'Supplier ID is required'),
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1).default(1),
  deliveryState: z.string().min(1, 'Delivery state is required'),
  deliveryCity: z.string().min(1, 'Delivery city is required'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  receiptUrl: z.string().optional(),
})

export const NotificationReadSchema = z.object({
  read: z.boolean(),
})
