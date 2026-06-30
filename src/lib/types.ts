export interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface QuotationFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  companyName: string
  validUntil: string
  lineItems: LineItem[]
  taxPercent: number
  notes: string
}

export interface QuotationSubmission extends QuotationFormData {
  subtotal: number
  taxAmount: number
  total: number
}
