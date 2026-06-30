import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = session.user.role

  const where: any =
    role === "MD1" || role === "MD2"
      ? {}
      : { quotation: { userId: session.user.id } }

  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      quotation: {
        select: {
          quoteNumber: true,
          customerName: true,
          total: true,
          status: true,
        },
      },
    },
  })

  return NextResponse.json(invoices)
}
