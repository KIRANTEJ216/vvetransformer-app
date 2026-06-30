import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FileText, CheckSquare, Receipt, Plus } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const role = session.user.role
  const userId = session.user.id

  const isMd = role === "MD1" || role === "MD2"

  const quotationWhere = isMd ? {} : { userId }
  const quoteCount = await prisma.quotation.count({ where: quotationWhere })

  const pendingCount = isMd
    ? await prisma.approval.count({
        where: { approverId: userId, status: "PENDING" },
      })
    : 0

  const invoiceWhere = isMd ? {} : { quotation: { userId } }
  const invoiceCount = await prisma.invoice.count({ where: invoiceWhere })

  const stats = [
    {
      label: "Total Quotations",
      value: String(quoteCount),
      href: "/quotations",
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
    },
    ...(isMd
      ? [
          {
            label: "Pending Approvals",
            value: String(pendingCount),
            href: "/approvals",
            icon: CheckSquare,
            color: "text-amber-600 bg-amber-50",
          },
        ]
      : []),
    {
      label: "Invoices",
      value: String(invoiceCount),
      href: "/invoices",
      icon: Receipt,
      color: "text-green-600 bg-green-50",
    },
  ]

  const recentQuotes = await prisma.quotation.findMany({
    where: quotationWhere,
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      quoteNumber: true,
      customerName: true,
      total: true,
      status: true,
      createdAt: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome to QuotationFlow
          </p>
        </div>
        <Link
          href="/quotations/new"
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          New Quotation
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="card p-6 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="card">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Quotations
          </h2>
        </div>
        {recentQuotes.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              No quotations yet
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create your first quotation to get started.
            </p>
            <Link
              href="/quotations/new"
              className="btn-primary mt-4"
            >
              <Plus className="h-4 w-4" />
              Create Quotation
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentQuotes.map((q) => (
              <Link
                key={q.id}
                href={`/quotations/${q.id}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {q.quoteNumber}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{q.customerName}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{Number(q.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className={`badge ${
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
    </div>
  )
}
