import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { quotationSchema } from "@/lib/validations"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = quotationSchema.parse(body)

    const subtotal = parsed.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = subtotal * (parsed.taxPercent / 100)
    const total = subtotal + taxAmount

    const count = await prisma.quotation.count()
    const quoteNumber = `Q-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`

    const quotation = await prisma.quotation.create({
      data: {
        quoteNumber,
        userId: session.user.id,
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
        status: "DRAFT",
      },
    })

    return NextResponse.json(quotation, { status: 201 })
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const where: any = { userId: session.user.id }
  if (status) where.status = status

  const quotations = await prisma.quotation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { approvals: true },
  })

  return NextResponse.json(quotations)
}
