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

  const { id } = await params
  const quotation = await prisma.quotation.findUnique({ where: { id } })

  if (!quotation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  if (quotation.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  if (quotation.status !== "DRAFT") {
    return NextResponse.json({ error: "Already submitted" }, { status: 400 })
  }

  const [md1, md2] = await Promise.all([
    prisma.user.findFirst({ where: { role: "MD1" } }),
    prisma.user.findFirst({ where: { role: "MD2" } }),
  ])

  if (!md1 && !md2) {
    return NextResponse.json({ error: "No MD configured" }, { status: 500 })
  }

  const approvalData = []
  if (md1) approvalData.push({ quotationId: id, approverId: md1.id, level: 1, status: "PENDING" })
  if (md2) approvalData.push({ quotationId: id, approverId: md2.id, level: 2, status: "PENDING" })

  await prisma.approval.createMany({ data: approvalData })

  const updated = await prisma.quotation.update({
    where: { id },
    data: { status: "PENDING_MD1" },
  })

  return NextResponse.json(updated)
}
