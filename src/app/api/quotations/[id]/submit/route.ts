import { NextResponse } from "next/server"
import { auth, SAMPLE_USERS } from "@/lib/auth"
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

  // Allow submit if DRAFT, or if PENDING_MD1 with no existing approvals (stuck fix)
  const existingApprovals = await prisma.approval.count({ where: { quotationId: id } })
  const isStuck = quotation.status === "PENDING_MD1" && existingApprovals === 0
  if (quotation.status !== "DRAFT" && !isStuck) {
    return NextResponse.json({ error: "Already submitted" }, { status: 400 })
  }

  // Ensure all 3 approver roles exist in DB (upsert by known emails)
  const approverEmails = SAMPLE_USERS.filter(u => u.role !== "USER")
  const approvers = await Promise.all(
    approverEmails.map(u =>
      prisma.user.upsert({
        where: { email: u.email },
        create: { email: u.email, name: u.name, role: u.role },
        update: { name: u.name, role: u.role },
      })
    )
  )

  // Create approval records (level: CEO=0, MD1=1, MD2=2) — skip if already exist
  const levelMap: Record<string, number> = { CEO: 0, MD1: 1, MD2: 2 }
  const existingLevels = new Set(
    (await prisma.approval.findMany({
      where: { quotationId: id },
      select: { level: true },
    })).map(a => a.level)
  )

  const approvalData = approvers
    .filter(u => !existingLevels.has(levelMap[u.role]))
    .map(u => ({
      quotationId: id,
      approverId: u.id,
      level: levelMap[u.role],
      status: "PENDING" as const,
    }))

  if (approvalData.length > 0) {
    await prisma.approval.createMany({ data: approvalData })
  }

  // Update status to PENDING_MD1 if still DRAFT
  if (quotation.status === "DRAFT") {
    await prisma.quotation.update({
      where: { id },
      data: { status: "PENDING_MD1" },
    })
  }

  return NextResponse.json({ success: true })
}