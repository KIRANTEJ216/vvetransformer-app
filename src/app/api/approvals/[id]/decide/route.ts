import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
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
  const body = await req.json()
  const { action, comment } = body

  if (!action || !["APPROVED", "REJECTED"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  const approval = await prisma.approval.findUnique({
    where: { id },
    include: { quotation: true },
  })

  if (!approval) {
    return NextResponse.json({ error: "Approval not found" }, { status: 404 })
  }

  if (approval.approverId !== session.user.id) {
    return NextResponse.json({ error: "Not your approval" }, { status: 403 })
  }

  if (approval.status !== "PENDING") {
    return NextResponse.json({ error: "Already decided" }, { status: 400 })
  }

  const quotationId = approval.quotationId

  // Mark this approval as decided
  await prisma.approval.update({
    where: { id },
    data: {
      status: action,
      comment: comment || null,
      decidedAt: new Date(),
    },
  })

  // Also resolve any other pending approvals for this quotation
  await prisma.approval.updateMany({
    where: { quotationId, status: "PENDING", id: { not: id } },
    data: { status: `${action}_SKIPPED`, decidedAt: new Date() },
  })

  if (action === "REJECTED") {
    await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: "REJECTED" },
    })
  } else {
    // Either MD approves -> APPROVED + Invoice created
    const year = new Date().getFullYear()
    const lastInvoice = await prisma.invoice.findFirst({
      where: { invoiceNumber: { startsWith: `vve-${year}-` } },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true },
    })
    let seq = 1
    if (lastInvoice) {
      const match = lastInvoice.invoiceNumber.match(/(\d+)$/)
      if (match) seq = parseInt(match[1]) + 1
    }
    const invoiceNumber = `vve-${year}-${String(seq).padStart(3, "0")}`

    await prisma.$transaction([
      prisma.quotation.update({
        where: { id: quotationId },
        data: { status: "APPROVED" },
      }),
      prisma.invoice.create({
        data: {
          quotationId,
          invoiceNumber,
        },
      }),
    ])
  }

  return NextResponse.json({ success: true })
}
