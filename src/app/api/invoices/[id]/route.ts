import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    include: {
      quotation: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
    },
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

  return NextResponse.json(invoice)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = session.user.role
  if (role !== "MD1" && role !== "MD2" && role !== "CEO") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { quotation: { select: { status: true } } },
  })

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (invoice.quotation.status !== "APPROVED") {
    return NextResponse.json({ error: "Can only delete invoice for approved quotations" }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.invoice.delete({ where: { id } }),
    prisma.quotation.update({
      where: { id: invoice.quotationId },
      data: { status: "APPROVED" },
    }),
  ])

  return NextResponse.json({ success: true })
}
