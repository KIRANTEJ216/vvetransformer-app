"use client"

import { useState } from "react"
import Link from "next/link"
import { ApprovalCard } from "@/components/approvals/approval-card"
import { CheckCheck, Clock, History, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  pending: any[]
  decided: any[]
  role: string
}

type Tab = "pending" | "history"

export function ApprovalsDashboard({ pending, decided, role }: Props) {
  const [tab, setTab] = useState<Tab>("pending")
  const [pendingList, setPendingList] = useState(pending)

  function handleDecided() {
    setPendingList((prev) => prev.slice(1))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Approvals</h1>
        <p className="text-sm text-muted">
          {role === "CEO" ? "CEO" : role === "MD1" ? "Level 1" : "Level 2"} approver
        </p>
      </div>

      <div className="flex gap-1 rounded-lg bg-card p-1 w-fit">
        <button
          onClick={() => setTab("pending")}
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "pending"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          <Clock className="h-4 w-4" />
          Pending ({pendingList.length})
        </button>
        <button
          onClick={() => setTab("history")}
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "history"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          )}
        >
          <History className="h-4 w-4" />
          History
        </button>
      </div>

      {tab === "pending" && (
        <div className="space-y-3">
          {pendingList.length === 0 ? (
            <div className="card p-12 text-center">
              <CheckCheck className="mx-auto h-12 w-12 text-green-300" />
              <h2 className="mt-4 text-lg font-medium text-foreground">
                All caught up!
              </h2>
              <p className="mt-1 text-sm text-muted">
                No pending approvals at this time.
              </p>
            </div>
          ) : (
            pendingList.map((approval) => (
              <ApprovalCard
                key={approval.id}
                approval={approval}
                onDecided={handleDecided}
              />
            ))
          )}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-2">
          {decided.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-muted">No decision history yet.</p>
            </div>
          ) : (
            decided.map((a: any) => (
              <Link
                key={a.id}
                href={`/quotations/${a.quotationId}`}
                className="flex items-center justify-between rounded-lg border border-stroke bg-card px-4 py-3 hover:bg-black/[0.04] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground inline-flex items-center gap-1">
                    {a.quotation.quoteNumber}
                    <ExternalLink className="h-3 w-3 text-muted" />
                  </p>
                  <p className="text-xs text-muted">
                    {a.quotation.customerName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("badge", a.status === "APPROVED" ? "badge-green" : "badge-red")}>
                    {a.status}
                  </span>
                  {a.comment && (
                    <p className="hidden text-xs text-muted sm:block max-w-[200px] truncate">
                      &ldquo;{a.comment}&rdquo;
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
