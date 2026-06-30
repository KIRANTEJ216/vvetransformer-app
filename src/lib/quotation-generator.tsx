import { renderToStream } from "@react-pdf/renderer"
import { QuotationPDF } from "@/components/quotations/quotation-pdf"

interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface QuotationData {
  quoteNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  companyName?: string | null
  lineItems: LineItem[]
  subtotal: number
  taxPercent: number
  taxAmount: number
  total: number
  status: string
  notes?: string | null
  createdAt: string
  validUntil?: string | null
}

export async function generateQuotationPDF(data: QuotationData): Promise<Buffer> {
  const stream = await renderToStream(<QuotationPDF data={data} />)

  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}
