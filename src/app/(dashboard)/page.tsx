import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FileText, CheckSquare, Receipt, Plus, TrendingUp, DollarSign, Eye } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const role = session.user.role
  const userId = session.user.id

  const isUser = role === "USER"
  const isMd = role === "MD1" || role === "MD2"
  const isCeo = role === "CEO"
  const isApprover = isMd || isCeo

  async function getUserStats() {
    if (isUser) {
      const [quoteCount, invoiceCount, approvedTotal] = await Promise.all([
        prisma.quotation.count({ where: { userId } }),
        prisma.invoice.count({ where: { quotation: { userId } } }),
        prisma.quotation.aggregate({
          where: { userId, status: "APPROVED" },
          _sum: { total: true },
        }).then(r => r._sum?.total || 0),
      ])
      return { quoteCount, invoiceCount, approvedTotal, pendingCount: 0 }
    } else {
      const [pendingCount, invoiceCount, approvedTotal] = await Promise.all([
        prisma.approval.count({ where: { approverId: userId, status: "PENDING" } }),
        prisma.invoice.count(),
        prisma.quotation.aggregate({
          where: { status: "APPROVED" },
          _sum: { total: true },
        }).then(r => r._sum?.total || 0),
      ])
      return { quoteCount: 0, invoiceCount, approvedTotal, pendingCount }
    }
  }

  const statsData = await getUserStats()

  const stats = [
    ...(isUser
      ? [{
          label: "Total Quotations",
          value: String(statsData.quoteCount),
          href: "/quotations",
          icon: FileText,
          gradient: "from-primary to-primary-light",
        }]
      : [{
          label: "Pending Approvals",
          value: String(statsData.pendingCount),
          href: "/approvals",
          icon: CheckSquare,
          gradient: "from-warning to-warning-dark",
        }]),
    ...(isCeo || isUser
      ? [{
          label: "Approved Revenue",
          value: `₹${Number(statsData.approvedTotal).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`,
          href: isCeo ? "/financial" : "#",
          icon: DollarSign,
          gradient: "from-success to-success-dark",
        }]
      : []),
    {
      label: "Invoices",
      value: String(statsData.invoiceCount),
      href: "/invoices",
      icon: Receipt,
      gradient: "from-accent to-primary",
    },
  ]

  const recentQuotes = await prisma.quotation.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      quoteNumber: true,
      customerName: true,
      total: true,
      status: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted">
            Welcome back, {session.user.name || session.user.email}
            {isApprover && <span className="ml-2 text-primary font-medium">· {role === "CEO" ? "CEO" : role === "MD1" ? "MD1" : "MD2"} Approver</span>}
          </p>
        </div>
        {isUser && (
          <Link href="/quotations/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            New Quotation
          </Link>
        )}
        {isApprover && statsData.pendingCount > 0 && (
          <Link href="/approvals" className="btn-primary">
            <Eye className="h-4 w-4" />
            Review ({statsData.pendingCount})
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="card p-5 hover:shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-dark-3 overflow-hidden">
                <div className={`h-full w-1/2 rounded-full bg-gradient-to-r ${stat.gradient}`} />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between border-b border-stroke px-6 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              {isApprover ? "Recent Quotations" : "Recent Quotations"}
            </h2>
            {isUser && (
              <Link href="/quotations" className="text-xs font-medium text-primary hover:text-primary-light transition-colors">
                View all
              </Link>
            )}
          </div>
          {recentQuotes.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-dark-4" />
              <h3 className="mt-3 text-sm font-medium text-foreground">
                No quotations yet
              </h3>
              <p className="mt-1 text-xs text-muted">
                {isUser ? "Create your first quotation to get started." : "No quotations have been created yet."}
              </p>
              {isUser && (
                <Link href="/quotations/new" className="btn-primary mt-4 text-xs px-4 py-2">
                  <Plus className="h-3.5 w-3.5" />
                  Create Quotation
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-stroke">
              {recentQuotes.map((q) => (
                <Link
                  key={q.id}
                  href={`/quotations/${q.id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-black/[0.04] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {q.quoteNumber}
                    </p>
                    <p className="text-xs text-muted truncate mt-0.5">
                      {q.customerName}{isApprover && q.user?.name ? ` · by ${q.user.name}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-sm font-semibold text-foreground">
                      ₹{Number(q.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`badge text-[10px] ${
                      q.status === "DRAFT" ? "badge-gray" :
                      q.status === "APPROVED" ? "badge-green" :
                      q.status === "REJECTED" ? "badge-red" :
                      "badge-amber"
                    }`}>
                      {q.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center border-b border-stroke px-6 py-4">
            <TrendingUp className="h-4 w-4 text-primary mr-2" />
            <h2 className="text-sm font-semibold text-foreground">
              {isApprover ? "Approval Actions" : "Quick Actions"}
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {isApprover ? (
              <>
                <Link
                  href="/approvals"
                  className="flex items-center gap-3 rounded-xl border border-stroke p-3.5 hover:bg-black/[0.04] transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-warning to-warning-dark shadow">
                    <CheckSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-warning transition-colors">
                      Review Approvals {statsData.pendingCount > 0 ? `(${statsData.pendingCount} pending)` : ""}
                    </p>
                    <p className="text-xs text-muted">{role === "CEO" ? "CEO" : role === "MD1" ? "MD1" : "MD2"} approver panel</p>
                  </div>
                </Link>
                <Link
                  href="/invoices"
                  className="flex items-center gap-3 rounded-xl border border-stroke p-3.5 hover:bg-black/[0.04] transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-success to-success-dark shadow">
                    <Receipt className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-success-light transition-colors">
                      View Invoices
                    </p>
                    <p className="text-xs text-muted">Download generated invoices</p>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/quotations/new"
                  className="flex items-center gap-3 rounded-xl border border-stroke p-3.5 hover:bg-black/[0.04] transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-light shadow">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary-light transition-colors">
                      Create Quotation
                    </p>
                    <p className="text-xs text-muted">New quote for a customer</p>
                  </div>
                </Link>
                <Link
                  href="/quotations"
                  className="flex items-center gap-3 rounded-xl border border-stroke p-3.5 hover:bg-black/[0.04] transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-success to-success-dark shadow">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-success-light transition-colors">
                      Browse Quotations
                    </p>
                    <p className="text-xs text-muted">View and manage all quotes</p>
                  </div>
                </Link>
                <Link
                  href="/invoices"
                  className="flex items-center gap-3 rounded-xl border border-stroke p-3.5 hover:bg-black/[0.04] transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-primary shadow">
                    <Receipt className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                      View Invoices
                    </p>
                    <p className="text-xs text-muted">Download generated invoices</p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}