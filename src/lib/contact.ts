export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

// Nigerian local numbers (e.g. 08000000001) become international (2348000000001) for wa.me
export function internationalPhone(phone: string): string {
  const digits = phoneDigits(phone)
  if (digits.length === 11) return `234${digits.slice(1)}`
  if (digits.startsWith('234') && digits.length === 13) return digits
  return digits
}

export function telLink(phone: string): string {
  return `tel:${phoneDigits(phone)}`
}

export function waLink(phone: string, message: string): string {
  return `https://wa.me/${internationalPhone(phone)}?text=${encodeURIComponent(message)}`
}

export function buildWhatsAppMessage(product: string, crop?: string | null): string {
  const cropPart = crop ? ` for a ${crop} crop problem` : ''
  return `Hello, I found your supplier profile on CropGuard AI. I am looking for ${product}${cropPart}. Is it currently available?`
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`
}