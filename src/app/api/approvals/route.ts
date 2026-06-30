import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = session.user.role
  if (role !== "MD1" && role !== "MD2") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get("filter") || "pending"

  const level = role === "MD1" ? 1 : 2

  const where: any = {
    approverId: session.user.id,
    level,
  }

  if (filter === "pending") {
    where.status = "PENDING"
  }

  const approvals = await prisma.approval.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      quotation: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
    },
  })

  return NextResponse.json(approvals)
}
