import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { quotationSchema } from "@/lib/validations"

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
    include: {
      approvals: {
        include: { approver: { select: { name: true, email: true } } },
      },
      invoice: true,
    },
  })

  if (!quotation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (quotation.userId !== session.user.id &&
      session.user.role !== "MD1" &&
      session.user.role !== "MD2") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(quotation)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.quotation.findUnique({ where: { id } })

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (existing.status !== "DRAFT") {
    return NextResponse.json({ error: "Can only edit drafts" }, { status: 400 })
  }

  try {
    const body = await req.json()
    const parsed = quotationSchema.parse(body)

    const subtotal = parsed.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = subtotal * (parsed.taxPercent / 100)
    const total = subtotal + taxAmount

    const quotation = await prisma.quotation.update({
      where: { id },
      data: {
        customerName: parsed.customerName,
        customerEmail: parsed.customerEmail,
        customerPhone: parsed.customerPhone || null,
        companyName: parsed.companyName || null,
        validUntil: new Date(parsed.validUntil),
        lineItems: parsed.lineItems,
        subtotal,
        taxPercent: parsed.taxPercent,
        taxAmount,
        total,
        notes: parsed.notes || null,
      },
    })

    return NextResponse.json(quotation)
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
