import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ApprovalTimeline } from "@/components/approvals/approval-timeline"
import { ResubmitButton } from "@/components/quotations/resubmit-button"
import Link from "next/link"
import { ArrowLeft, Download, Edit } from "lucide-react"

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { id } = await params

  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      approvals: {
        include: { approver: { select: { name: true } } },
        orderBy: { level: "asc" },
      },
      invoice: true,
    },
  })

  if (!quotation) notFound()

  if (
    quotation.userId !== session.user.id &&
    session.user.role !== "MD1" &&
    session.user.role !== "MD2" &&
    session.user.role !== "CEO"
  ) {
    return <p className="text-center text-muted">Access denied</p>
  }

  const statusBadge: Record<string, string> = {
    DRAFT: "badge-gray",
    PENDING_MD1: "badge-amber",
    PENDING_MD2: "badge-amber",
    APPROVED: "badge-green",
    REJECTED: "badge-red",
  }

  const items = quotation.lineItems as any[]
  const subtotal = items.reduce((s: number, i: any) => s + (i.amount || 0), 0)
  const taxAmount = subtotal * (Number(quotation.taxPercent) / 100)
  const total = Number(quotation.total)

  const serializedApprovals = quotation.approvals.map((a) => ({
    id: a.id,
    level: a.level,
    status: a.status,
    comment: a.comment,
    decidedAt: a.decidedAt?.toISOString() ?? null,
    createdAt: a.createdAt.toISOString(),
    approver: a.approver,
  }))

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/quotations"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Quotations
      </Link>

      <div className="card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {quotation.quoteNumber}
            </h1>
            <p className="text-sm text-muted">
              Created by {quotation.user.name} on{" "}
              {new Date(quotation.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {quotation.userId === session.user.id && quotation.status === "DRAFT" && (
              <Link
                href={`/quotations/${quotation.id}/edit`}
                className="btn-secondary text-xs px-3 py-2"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Link>
            )}
            {quotation.userId === session.user.id && quotation.status === "PENDING_MD1" && quotation.approvals.length === 0 && (
              <ResubmitButton quotationId={quotation.id} />
            )}
            <Link
              href={`/api/quotations/${quotation.id}/pdf`}
              className="inline-flex items-center gap-1 rounded-lg border border-stroke px-3 py-2 text-xs font-medium text-dark-5 hover:bg-black/[0.04] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              PDF
            </Link>
            <span
              className={`badge ${
                statusBadge[quotation.status] || "badge-gray"
              }`}
            >
              {quotation.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div>
            <p className="text-xs text-muted">Customer</p>
            <p className="text-sm font-medium text-foreground">
              {quotation.customerName}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Email</p>
            <p className="text-sm text-foreground">{quotation.customerEmail}</p>
          </div>
          {quotation.customerPhone && (
            <div>
              <p className="text-xs text-muted">Phone</p>
              <p className="text-sm text-foreground">{quotation.customerPhone}</p>
            </div>
          )}
          {quotation.companyName && (
            <div>
              <p className="text-xs text-muted">Company</p>
              <p className="text-sm text-foreground">{quotation.companyName}</p>
            </div>
          )}
          {quotation.validUntil && (
            <div>
              <p className="text-xs text-muted">Valid Until</p>
              <p className="text-sm text-foreground">
                {new Date(quotation.validUntil).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-stroke pt-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="border-b border-stroke text-left text-xs text-muted">
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium text-right">Qty</th>
                <th className="pb-2 font-medium text-right">Rate</th>
                <th className="pb-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke-dark">
              {items.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="py-2 text-foreground">{item.description}</td>
                  <td className="py-2 text-right text-muted">{item.quantity}</td>
<td className="py-2 text-right text-muted">
                      ₹{Number(item.rate).toFixed(2)}
                  </td>
                  <td className="py-2 text-right font-medium text-foreground">
                    ₹{Number(item.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 space-y-1 border-t border-stroke pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-foreground">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tax ({Number(quotation.taxPercent)}%)</span>
              <span className="text-foreground">₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-1 border-t border-stroke">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {quotation.notes && (
          <div className="mt-4 border-t border-stroke pt-4">
            <p className="text-xs text-muted mb-1">Notes</p>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {quotation.notes}
            </p>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Approval Progress
        </h2>
        <ApprovalTimeline
          approvals={serializedApprovals}
          currentStatus={quotation.status}
        />
      </div>

      {quotation.invoice && (
        <div className="rounded-xl border border-success-light bg-success-light/20 p-4">
          <p className="text-sm font-medium text-green-400">
            Invoice {quotation.invoice.invoiceNumber} generated on{" "}
            {new Date(quotation.invoice.createdAt).toLocaleDateString()}
          </p>
          {quotation.invoice.pdfUrl && (
            <a
              href={quotation.invoice.pdfUrl}
              target="_blank"
              className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
            >
              Download Invoice
            </a>
          )}
        </div>
      )}
    </div>
  )
}
