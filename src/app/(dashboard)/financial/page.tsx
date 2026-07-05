import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchInvoiceData, aggregateMonthly } from "@/lib/sheets"
import { RevenueChart } from "@/components/financial/revenue-chart"
import {
  IndianRupee,
  TrendingUp,
  Landmark,
  Receipt,
  Calendar,
} from "lucide-react"

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default async function ActualRevenuePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "CEO") redirect("/")

  const sheetData = await fetchInvoiceData()
  const monthlyData = aggregateMonthly(sheetData.rows)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-bold shadow-sm">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Actual Revenue
              </h1>
              <p className="text-sm text-muted">
                Google Sheets · Real invoices from accounting
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Sheets config warning */}
      {sheetData.error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          <span className="font-medium">Google Sheets not connected.</span>{" "}
          {sheetData.error}.
        </div>
      )}

      {/* Metric cards — actuals only */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={sheetData.totals.invoiceTotal}
          icon={IndianRupee}
          gradient="from-primary to-primary-dark"
          badge={{ text: "Actual revenue", color: "badge-blue" }}
        />
        <MetricCard
          title="Tax Collected"
          value={sheetData.totals.totalTax}
          icon={Landmark}
          gradient="from-violet-600 to-violet-700"
          badge={{ text: "CGST + SGST + IGST", color: "badge-blue" }}
        />
        <MetricCard
          title="Invoice Count"
          value={sheetData.totals.invoiceCount}
          icon={Receipt}
          gradient="from-emerald-600 to-emerald-700"
          badge={{ text: "From accounting", color: "badge-green" }}
          currency={false}
        />
        <MetricCard
          title="Avg per Invoice"
          value={
            sheetData.totals.invoiceCount > 0
              ? Math.round(sheetData.totals.invoiceTotal / sheetData.totals.invoiceCount)
              : 0
          }
          icon={TrendingUp}
          gradient="from-amber-600 to-amber-700"
          badge={{ text: "Average value", color: "badge-amber" }}
        />
      </div>

      {/* Monthly revenue chart */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Monthly Revenue Trend
            </h2>
            {monthlyData.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-muted">
                  {monthlyData.length} months
                </span>
                <span className="hidden sm:inline text-xs text-muted">·</span>
                <span className="text-xs font-medium text-primary">
                  ₹{monthlyData.reduce((s, m) => s + m.revenue, 0).toLocaleString("en-IN", { minimumFractionDigits: 0 })} total
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="card-body">
          {monthlyData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted">
              <TrendingUp className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">No revenue data yet.</p>
              <p className="text-xs">Connect Google Sheets to see trends.</p>
            </div>
          ) : (
            <div className="pt-2 pb-1">
              <RevenueChart data={monthlyData} color="#5750f1" gradientId="actualRevenueGrad" />
            </div>
          )}
        </div>
      </div>

      {/* Tax breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        <TaxCard
          label="CGST Collected"
          value={sheetData.totals.cgstAmount}
          gradient="from-primary-light to-primary"
        />
        <TaxCard
          label="SGST Collected"
          value={sheetData.totals.sgstAmount}
          gradient="from-emerald-500 to-emerald-600"
        />
        <TaxCard
          label="IGST Collected"
          value={sheetData.totals.igstAmount}
          gradient="from-violet-500 to-violet-600"
        />
      </div>

      {/* Recent invoices from sheet */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Invoices
            </h2>
            {sheetData.rows.length > 0 && (
              <span className="badge badge-blue text-xs">
                {sheetData.rows.length} total
              </span>
            )}
          </div>
        </div>
        <div className="card-body p-0">
          {sheetData.rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted px-6">
              <Receipt className="h-10 w-10 mb-2 opacity-30" />
              <p className="text-sm">No invoice data.</p>
              <p className="text-xs">Connect Google Sheets to populate.</p>
            </div>
          ) : (
            <div className="divide-y divide-stroke-dark max-h-72 overflow-y-auto">
              {sheetData.rows.slice(0, 8).map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-3 hover:bg-black/[0.04] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {row.invoiceNumber || "N/A"}
                      </p>
                      <span className="shrink-0 badge badge-green">
                        ₹{(row.invoiceTotal || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate mt-0.5">
                      {row.buyerName || "Unknown"} ·{" "}
                      {row.invoiceDate || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom branding */}
      <div className="text-center text-xs text-muted py-4 border-t border-stroke">
        VVE Transformers Pvt. Ltd. · Actual Revenue · Google Sheets Data
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
  currency = true,
}: {
  title: string
  value: number
  icon: React.ElementType
  gradient: string
  badge: { text: string; color: string }
  currency?: boolean
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
          {currency ? "₹" : ""}{value.toLocaleString("en-IN", {
            minimumFractionDigits: currency && value < 10000 ? 2 : 0,
          })}
        </p>
        <span className={cn("badge text-[10px]", badge.color)}>
          {badge.text}
        </span>
      </div>
    </div>
  )
}

function TaxCard({
  label,
  value,
  gradient,
}: {
  label: string
  value: number
  gradient: string
}) {
  return (
    <div className="card overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="stat-label">{label}</span>
          <div className={`flex h-3 w-3 rounded-full bg-gradient-to-br ${gradient}`} />
        </div>
        <p className="stat-value text-foreground">
          ₹{value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}
