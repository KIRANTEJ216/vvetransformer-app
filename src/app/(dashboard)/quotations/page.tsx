import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { QuotationList } from "./quotation-list"

export default async function QuotationsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  if (session.user.role && session.user.role !== "USER") {
    redirect("/approvals")
  }

  const quotations = await prisma.quotation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      approvals: true,
    },
  })

  const statusBadge: Record<string, string> = {
    DRAFT: "badge-gray",
    PENDING_MD1: "badge-amber",
    PENDING_MD2: "badge-amber",
    APPROVED: "badge-green",
    REJECTED: "badge-red",
  }

  const serialized = quotations.map((q) => ({
    id: q.id,
    quoteNumber: q.quoteNumber,
    customerName: q.customerName,
    total: Number(q.total),
    status: q.status,
    createdAt: q.createdAt.toISOString(),
    approvals: q.approvals,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quotations</h1>
          <p className="text-sm text-muted">
            Manage your quotations
          </p>
        </div>
        <Link href="/quotations/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Quotation
        </Link>
      </div>

      {quotations.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-muted">No quotations yet. Create your first one.</p>
          <Link href="/quotations/new" className="btn-primary mt-4"
          >
            <Plus className="h-4 w-4" />
            Create Quotation
          </Link>
        </div>
      ) : (
        <QuotationList quotations={serialized} statusBadge={statusBadge} />
      )}
    </div>
  )
}
