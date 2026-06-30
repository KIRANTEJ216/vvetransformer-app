import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  IndianRupee,
  TrendingUp,
  Target,
  Receipt,
  Calendar,
  Users,
  Clock,
  ArrowUpRight,
  BarChart3,
  PieChart,
} from "lucide-react"

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default async function ForecastPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "CEO") redirect("/")

  const [
    approvedQuotes,
    draftQuotes,
    pendingQuotes,
    invoices,
    allQuotes,
    monthlyApprovals,
    userQuoteStats,
  ] = await Promise.all([
    // Approved quotes (forecasted revenue)
    prisma.quotation.findMany({
      where: { status: "APPROVED" },
      include: { invoice: { select: { id: true } } },
    }),
    // Draft quotes (pipeline)
    prisma.quotation.findMany({ where: { status: "DRAFT" } }),
    // Pending quotes (in approval)
    prisma.quotation.findMany({
      where: { status: { in: ["PENDING_MD1", "PENDING_MD2"] } },
    }),
    // All invoices
    prisma.invoice.findMany({
      include: { quotation: { select: { total: true, status: true } } },
      orderBy: { createdAt: "desc" },
    }),
    // All quotes for monthly trend
    prisma.quotation.findMany({
      select: { total: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    // Monthly approved totals
    prisma.quotation.findMany({
      where: { status: "APPROVED" },
      select: { total: true, createdAt: true },
    }),
    // Per-user stats
    prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        _count: { select: { quotations: true } },
        quotations: {
          where: { status: "APPROVED" },
          select: { total: true },
        },
      },
    }),
  ])

  // Core metrics
  const forecastedRevenue = approvedQuotes.reduce((s, q) => s + Number(q.total), 0)
  const pipelineValue = draftQuotes.reduce((s, q) => s + Number(q.total), 0)
  const pendingValue = pendingQuotes.reduce((s, q) => s + Number(q.total), 0)
  const invoicedAmount = invoices.reduce((s, inv) => s + Number(inv.quotation.total), 0)
  const totalPotential = forecastedRevenue + pipelineValue + pendingValue
  const invoiceCount = invoices.length
  const avgQuoteValue = allQuotes.length > 0
    ? allQuotes.reduce((s, q) => s + Number(q.total), 0) / allQuotes.length
    : 0
  const conversionRate = allQuotes.length > 0
    ? Math.round((approvedQuotes.length / allQuotes.length) * 100)
    : 0

  // Monthly forecast trend (approved quotes by month)
  const monthMap = new Map<string, { revenue: number; count: number }>()
  for (const q of monthlyApprovals) {
    const d = new Date(q.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const existing = monthMap.get(key) || { revenue: 0, count: 0 }
    existing.revenue += Number(q.total)
    existing.count += 1
    monthMap.set(key, existing)
  }
  const monthlyData = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({
      month: new Date(key + "-01").toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      revenue: val.revenue,
      count: val.count,
    }))
  const maxMonthlyRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1)

  // Top marketing users
  const topUsers = userQuoteStats
    .map((u) => ({
      name: u.name || u.email,
      totalQuotes: u._count.quotations,
      approvedValue: u.quotations.reduce((s, q) => s + Number(q.total), 0),
    }))
    .sort((a, b) => b.approvedValue - a.approvedValue)
    .slice(0, 5)

  // Quarterly breakdown
  const quarterMap = new Map<string, { revenue: number; count: number }>()
  for (const q of monthlyApprovals) {
    const d = new Date(q.createdAt)
    const qtr = Math.floor(d.getMonth() / 3) + 1
    const key = `Q${qtr} ${d.getFullYear()}`
    const existing = quarterMap.get(key) || { revenue: 0, count: 0 }
    existing.revenue += Number(q.total)
    existing.count += 1
    quarterMap.set(key, existing)
  }
  const quarterlyData = Array.from(quarterMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-4)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white text-sm font-bold shadow-sm">
              F
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Forecasted Revenue
              </h1>
              <p className="text-sm text-muted">
                Internal system · Marketing team projections
              </p>
            </div>
          </div>
        </div>
        <Link
          href="/financial"
          className="btn-secondary text-xs"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Actual Revenue
        </Link>
      </div>

      {/* Revenue stage pipeline */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Forecasted Revenue"
          value={forecastedRevenue}
          icon={TrendingUp}
          gradient="from-emerald-600 to-emerald-700"
          badge={{ text: `${approvedQuotes.length} approved quotes`, color: "badge-green" }}
        />
        <MetricCard
          title="Pipeline Value"
          value={pipelineValue}
          icon={Target}
          gradient="from-blue-600 to-blue-700"
          badge={{ text: `${draftQuotes.length} draft quotes`, color: "badge-blue" }}
        />
        <MetricCard
          title="Pending Approval"
          value={pendingValue}
          icon={Clock}
          gradient="from-amber-600 to-amber-700"
          badge={{ text: `${pendingQuotes.length} in review`, color: "badge-amber" }}
        />
        <MetricCard
          title="Total Potential"
          value={totalPotential}
          icon={PieChart}
          gradient="from-violet-600 to-violet-700"
          badge={{ text: "Forecast + Pipeline + Pending", color: "badge-blue" }}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SimpleMetric label="Invoices Generated" value={invoiceCount} icon={Receipt} color="text-blue-600 bg-blue-50" />
        <SimpleMetric label="Invoiced Amount" value={invoicedAmount} icon={IndianRupee} color="text-emerald-600 bg-emerald-50" />
        <SimpleMetric label="Conversion Rate" value={`${conversionRate}%`} icon={ArrowUpRight} color="text-violet-600 bg-violet-50" />
        <SimpleMetric label="Avg Quote Value" value={avgQuoteValue} icon={BarChart3} color="text-amber-600 bg-amber-50" />
      </div>

      {/* Monthly forecast chart */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-foreground">
              Monthly Forecast Trend
            </h2>
            {monthlyData.length > 0 && (
              <span className="text-xs text-muted">
                {monthlyData.length} months · Approved quotations
              </span>
            )}
          </div>
        </div>
        <div className="card-body">
          {monthlyData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted">
              <TrendingUp className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">No approved quotations yet.</p>
              <p className="text-xs">Forecast data appears once quotes are approved.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {monthlyData.map((m) => {
                const pct = (m.revenue / maxMonthlyRevenue) * 100
                return (
                  <div key={m.month} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-muted">{m.month}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted">{m.count} quotes</span>
                        <span className="font-semibold text-foreground">
                          ₹{m.revenue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quarterly + Top users */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quarterly breakdown */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-foreground">
              Quarterly Forecast
            </h2>
          </div>
          <div className="card-body">
            {quarterlyData.length === 0 ? (
              <p className="text-sm text-muted py-8 text-center">No data yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {quarterlyData.map((q) => (
                  <div key={q[0]} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{q[0]}</p>
                      <p className="text-xs text-muted">{q[1].count} approved quotes</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      ₹{q[1].revenue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top marketing users */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Marketing Team Performance
              </h2>
              <Users className="h-4 w-4 text-muted" />
            </div>
          </div>
          <div className="card-body p-0">
            {topUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted px-6">
                <Users className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">No marketing users yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {topUsers.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-muted">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {u.name}
                        </p>
                        <p className="text-xs text-muted">
                          {u.totalQuotes} quotes · {u.approvedValue > 0 ? `${u.totalQuotes > 0 ? Math.round((u.approvedValue / (u.totalQuotes * avgQuoteValue || 1)) * 100) : 0}% approved` : "no approvals"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-foreground shrink-0 ml-3">
                      ₹{u.approvedValue.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary to-primary-light p-5 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs opacity-80">Revenue Forecast Summary</p>
            <p className="text-xl font-bold mt-0.5 tracking-tight">
              ₹{totalPotential.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
            </p>
            <p className="text-xs opacity-70 mt-1">
              {forecastedRevenue > 0 ? `${Math.round((forecastedRevenue / totalPotential) * 100)}% confirmed` : "No confirmed revenue yet"} · {pipelineValue > 0 ? `${Math.round((pipelineValue / totalPotential) * 100)}% in draft` : "No drafts"} · {pendingValue > 0 ? `${Math.round((pendingValue / totalPotential) * 100)}% pending approval` : "Nothing pending"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80">Approved quotes</p>
            <p className="text-2xl font-bold">{approvedQuotes.length}</p>
          </div>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="text-center text-xs text-muted py-4 border-t border-gray-100">
        VVE Transformers Pvt. Ltd. · Forecasted Revenue · Internal System Data
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  gradient,
  badge,
}: {
  title: string
  value: number
  icon: React.ElementType
  gradient: string
  badge: { text: string; color: string }
}) {
  return (
    <div className="card overflow-hidden relative">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="stat-label">{title}</span>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl text-white bg-gradient-to-br",
              gradient
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="stat-value text-foreground mb-2">
          ₹{value.toLocaleString("en-IN", {
            minimumFractionDigits: value < 10000 ? 2 : 0,
          })}
        </p>
        <span className={cn("badge text-[10px]", badge.color)}>
          {badge.text}
        </span>
      </div>
    </div>
  )
}

function SimpleMetric({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 flex items-center gap-3">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-bold text-foreground mt-0.5">
          {typeof value === "number"
            ? `₹${value.toLocaleString("en-IN", { minimumFractionDigits: value < 10000 ? 2 : 0 })}`
            : value}
        </p>
      </div>
    </div>
  )
}
