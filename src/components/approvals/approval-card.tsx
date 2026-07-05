"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X, MessageSquare, Loader2, Eye, EyeOff, ExternalLink } from "lucide-react"

interface ApprovalCardProps {
  approval: any
  onDecided: () => void
}

export function ApprovalCard({ approval, onDecided }: ApprovalCardProps) {
  const [showReview, setShowReview] = useState(false)
  const [action, setAction] = useState<"APPROVED" | "REJECTED" | null>(null)
  const [comment, setComment] = useState("")
  const [showComment, setShowComment] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const q = approval.quotation

  const roleLabels: Record<number, string> = {
    0: "CEO",
    1: "MD1",
    2: "MD2",
  }

  async function handleDecide(decision: "APPROVED" | "REJECTED") {
    setAction(decision)
    setError("")
    if (decision === "APPROVED") {
      setShowConfirm(true)
      return
    }
    setShowComment(true)
  }

  async function confirmApprove() {
    await submit("APPROVED", comment || "")
  }

  async function submitWithComment() {
    if (!action) return
    await submit(action, comment)
  }

  async function submit(decision: string, note: string) {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/approvals/${approval.id}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: decision, comment: note }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit decision")
      }
      onDecided()
    } catch (err: any) {
      setError(err.message || "Failed to submit decision")
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setAction(null)
    setShowComment(false)
    setShowConfirm(false)
    setComment("")
    setError("")
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/quotations/${q.id}`}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                {q.quoteNumber}
                <ExternalLink className="h-3 w-3 text-muted" />
              </Link>
              <span className="badge badge-blue">
                {roleLabels[approval.level] || `Level ${approval.level}`}
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
            <p className="mt-1.5 text-sm font-medium text-foreground">{q.customerName}</p>
            <p className="text-xs text-muted">
              by {q.user.name} · {q.companyName ? `${q.companyName} · ` : ""}₹{Number(q.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={() => setShowReview(!showReview)}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-stroke px-3 py-1.5 text-xs font-medium text-muted hover:bg-black/[0.04] hover:text-foreground transition-colors"
          >
            {showReview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showReview ? "Hide" : "Review"}
          </button>
        </div>

        {showReview && q.lineItems && Array.isArray(q.lineItems) && (
          <div className="mt-3 border-t border-stroke pt-3">
            <p className="text-xs font-medium text-muted mb-2">Line Items</p>
            <div className="space-y-1.5">
              {q.lineItems.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-muted truncate mr-2">
                    {item.description || `Item ${i + 1}`}
                    <span className="text-dark-5 ml-1">x{item.quantity || 1}</span>
                  </span>
                  <span className="text-foreground font-medium shrink-0">
                    ₹{(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-stroke flex justify-between text-sm font-semibold">
              <span className="text-muted">Total</span>
              <span className="text-foreground">
                ₹{Number(q.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-stroke pt-3">
          <p className="text-xs text-muted">
            Created: {new Date(q.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            {q.validUntil && ` · Valid till: ${new Date(q.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecide("APPROVED")}
              disabled={loading}
              className="btn-success text-sm !px-3 !py-1.5"
            >
              {loading && action === "APPROVED" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Approve
            </button>
            <button
              onClick={() => handleDecide("REJECTED")}
              disabled={loading}
              className="btn-danger text-sm !px-3 !py-1.5"
            >
              {loading && action === "REJECTED" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
              Reject
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Approve confirmation */}
      {showConfirm && (
        <div className="border-t border-stroke bg-green-50/50 px-4 sm:px-5 py-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="input text-sm"
            placeholder="Add a note..."
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={reset}
              disabled={loading}
              className="btn-secondary text-sm !px-3 !py-1.5"
            >
              Cancel
            </button>
            <button
              onClick={confirmApprove}
              disabled={loading}
              className="btn-success text-sm"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Confirm Approve
            </button>
          </div>
        </div>
      )}

      {/* Reject with comment */}
      {showComment && (
        <div className="border-t border-stroke bg-red-50/50 px-4 sm:px-5 py-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for rejection *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="input text-sm"
            placeholder="Explain why this quotation is rejected..."
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={reset}
              disabled={loading}
              className="btn-secondary text-sm !px-3 !py-1.5"
            >
              Cancel
            </button>
            <button
              onClick={submitWithComment}
              disabled={!comment.trim() || loading}
              className="btn-danger text-sm"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
              Confirm Reject
            </button>
          </div>
        </div>
      )}
    </div>
  )
}