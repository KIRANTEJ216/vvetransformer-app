"use client"

import { useState } from "react"
import { Check, X, MessageSquare, Loader2 } from "lucide-react"

interface ApprovalCardProps {
  approval: any
  onDecided: () => void
}

export function ApprovalCard({ approval, onDecided }: ApprovalCardProps) {
  const [action, setAction] = useState<"APPROVED" | "REJECTED" | null>(null)
  const [comment, setComment] = useState("")
  const [showComment, setShowComment] = useState(false)
  const [loading, setLoading] = useState(false)

  const q = approval.quotation

  async function handleDecide(decision: "APPROVED" | "REJECTED") {
    setAction(decision)
    if (decision === "REJECTED") {
      setShowComment(true)
      return
    }
    await submit(decision, "")
  }

  async function submitWithComment() {
    if (!action) return
    await submit(action, comment)
  }

  async function submit(decision: string, note: string) {
    setLoading(true)
    try {
      await fetch(`/api/approvals/${approval.id}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: decision, comment: note }),
      })
      onDecided()
    } catch {
      alert("Failed to submit decision")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {q.quoteNumber}
            </span>
            <span className="badge badge-blue">
              Level {approval.level}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-gray-900">{q.customerName}</p>
          <p className="text-xs text-gray-500">
            by {q.user.name} · ₹{Number(q.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => handleDecide("APPROVED")}
            disabled={loading}
            className="btn-success text-sm"
          >
            <Check className="h-4 w-4" /> Approve
          </button>
          <button
            onClick={() => handleDecide("REJECTED")}
            disabled={loading}
            className="btn-danger text-sm px-3 py-1.5"
          >
            <X className="h-4 w-4" /> Reject
          </button>
        </div>
      </div>

      {q.lineItems && Array.isArray(q.lineItems) && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500 mb-1">Items:</p>
          <div className="space-y-1">
            {q.lineItems.slice(0, 3).map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-xs text-gray-600">
                <span className="truncate">{item.description}</span>
                <span className="shrink-0 ml-2">₹{(item.amount || 0).toFixed(2)}</span>
              </div>
            ))}
            {q.lineItems.length > 3 && (
              <p className="text-xs text-gray-400">+{q.lineItems.length - 3} more items</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500">
          Created: {new Date(q.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm font-semibold text-gray-900">
          ₹{Number(q.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {showComment && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for rejection *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="input"
            placeholder="Explain why this quotation is rejected..."
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => { setShowComment(false); setAction(null) }}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              onClick={submitWithComment}
              disabled={!comment.trim() || loading}
            className="btn-danger text-sm"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Confirm Reject
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
