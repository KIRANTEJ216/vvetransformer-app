import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateQuotationPDF } from "@/lib/quotation-generator"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: { user: { select: { id: true } } },
  })

  if (!quotation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const role = session.user.role
  if (quotation.userId !== session.user.id && role !== "MD1" && role !== "MD2" && role !== "CEO") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const items = quotation.lineItems as any[]
  const subtotal = items.reduce((s: number, i: any) => s + Number(i.amount || 0), 0)
  const taxPercent = Number(quotation.taxPercent)
  const taxAmount = subtotal * (taxPercent / 100)
  const total = Number(quotation.total)

  const pdfBuffer = await generateQuotationPDF({
    quoteNumber: quotation.quoteNumber,
    customerName: quotation.customerName,
    customerEmail: quotation.customerEmail,
    customerPhone: quotation.customerPhone,
    companyName: quotation.companyName,
    lineItems: items,
    subtotal,
    taxPercent,
    taxAmount,
    total,
    status: quotation.status,
    notes: quotation.notes,
    createdAt: quotation.createdAt.toISOString(),
    validUntil: quotation.validUntil?.toISOString(),
  })

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${quotation.quoteNumber}.pdf"`,
    },
  })
}
