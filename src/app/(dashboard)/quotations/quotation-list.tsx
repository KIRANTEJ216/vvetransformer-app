"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuotationItem {
  id: string
  quoteNumber: string
  customerName: string
  total: number
  status: string
  createdAt: string
  approvals: any[]
}

interface Props {
  quotations: QuotationItem[]
  statusBadge: Record<string, string>
}

const statuses = ["ALL", "DRAFT", "PENDING_MD1", "PENDING_MD2", "APPROVED", "REJECTED"]

export function QuotationList({ quotations, statusBadge }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filtered = quotations.filter((q) => {
    const matchesSearch =
      !search ||
      q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || q.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by quote number or customer..."
            className="input pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1 overflow-x-auto w-full sm:w-fit">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-md px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap",
                statusFilter === s
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {s === "ALL" ? "All" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">No quotations match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <Link
              key={q.id}
              href={`/quotations/${q.id}`}
              className="card p-4 sm:p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {q.quoteNumber}
                    </p>
                    <span
                      className={cn(
                        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                        statusBadge[q.status] || "bg-gray-100 text-gray-700"
                      )}
                    >
                      {q.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 truncate">
                    {q.customerName}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{Number(q.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
