import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ApprovalsDashboard } from "./approvals-dashboard"

export default async function ApprovalsPage() {
  const session = await auth()
  if (!session?.user?.id) {
    return (
        <div className="card p-12 text-center">
          <p className="text-muted">Please sign in to view approvals.</p>
      </div>
    )
  }

  const role = session.user.role

  if (role !== "MD1" && role !== "MD2" && role !== "CEO") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Approvals</h1>
          <p className="text-sm text-muted">
            Review and approve quotations
          </p>
        </div>
        <div className="card p-12 text-center">
          <p className="text-muted">
            Only CEO, MD1, and MD2 users can access this page.
          </p>
        </div>
      </div>
    )
  }

  const pendingApprovals = await prisma.approval.findMany({
    where: {
      approverId: session.user.id,
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
    include: {
      quotation: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
    },
  })

  const decidedApprovals = await prisma.approval.findMany({
    where: {
      approverId: session.user.id,
      status: { in: ["APPROVED", "REJECTED"] },
    },
    orderBy: { decidedAt: "desc" },
    take: 20,
    include: {
      quotation: {
        select: {
          quoteNumber: true,
          customerName: true,
          total: true,
        },
      },
    },
  })

  return (
    <ApprovalsDashboard
      pending={JSON.parse(JSON.stringify(pendingApprovals))}
      decided={JSON.parse(JSON.stringify(decidedApprovals))}
      role={role}
    />
  )
}