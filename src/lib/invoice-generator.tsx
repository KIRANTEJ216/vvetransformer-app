import { renderToStream } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/invoices/invoice-pdf"

interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceData {
  invoiceNumber: string
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
  notes?: string | null
  createdAt: string
  validUntil?: string | null
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const stream = await renderToStream(
    <InvoicePDF data={data} />
  )

  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}
