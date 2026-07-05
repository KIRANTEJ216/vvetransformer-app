import React from "react"
import { pdf } from "@react-pdf/renderer"
import { writeFile } from "fs/promises"
import { InvoicePDF } from "../src/components/invoices/invoice-pdf"

async function main() {
  const data = {
    invoiceNumber: "vve-2026-001",
    quoteNumber: "Q-2026-0042",
    customerName: "Rajesh Kumar",
    customerEmail: "rajesh@example.com",
    customerPhone: "+91 98765 43210",
    companyName: "TechNova Solutions Pvt. Ltd.",
    customerAddress: "Plot 42, HITEC City, Hyderabad, Telangana 500081",
    customerGst: "36ABCDE1234F1Z5",
    lineItems: [
      { description: "250 kVA Distribution Transformer", quantity: 2, rate: 485000, amount: 970000 },
      { description: "500 kVA Power Transformer", quantity: 1, rate: 875000, amount: 875000 },
      { description: "On-load Tap Changer (OLTC)", quantity: 3, rate: 95000, amount: 285000 },
      { description: "Transformer Oil Filtration Service", quantity: 1, rate: 45000, amount: 45000 },
    ],
    subtotal: 2175000,
    taxPercent: 18,
    taxAmount: 391500,
    total: 2566500,
    notes: "Delivery within 6-8 weeks from PO date. Price includes installation and commissioning at site. Warranty: 24 months from date of commissioning.",
    createdAt: "2026-06-15T10:30:00.000Z",
    validUntil: "2026-07-15T10:30:00.000Z",
    status: "Pending",
  }

  console.log("Generating sample invoice PDF...")
  const blob = await pdf(<InvoicePDF data={data} />).toBlob()
  const buffer = Buffer.from(await blob.arrayBuffer())
  await writeFile("sample-invoice.pdf", buffer)
  console.log("Done: sample-invoice.pdf")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
