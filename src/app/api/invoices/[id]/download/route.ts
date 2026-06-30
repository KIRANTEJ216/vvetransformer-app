import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateInvoicePDF } from "@/lib/invoice-generator"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { quotation: true },
  })

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const role = session.user.role
  if (
    invoice.quotation.userId !== session.user.id &&
    role !== "MD1" &&
    role !== "MD2"
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const items = invoice.quotation.lineItems as any[]
  const subtotal = items.reduce((s: number, i: any) => s + Number(i.amount || 0), 0)
  const taxPercent = Number(invoice.quotation.taxPercent)
  const taxAmount = subtotal * (taxPercent / 100)
  const total = Number(invoice.quotation.total)

  const pdfBuffer = await generateInvoicePDF({
    invoiceNumber: invoice.invoiceNumber,
    quoteNumber: invoice.quotation.quoteNumber,
    customerName: invoice.quotation.customerName,
    customerEmail: invoice.quotation.customerEmail,
    customerPhone: invoice.quotation.customerPhone,
    companyName: invoice.quotation.companyName,
    lineItems: items,
    subtotal,
    taxPercent,
    taxAmount,
    total,
    notes: invoice.quotation.notes,
    createdAt: invoice.createdAt.toISOString(),
    validUntil: invoice.quotation.validUntil?.toISOString(),
  })

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    },
  })
}
