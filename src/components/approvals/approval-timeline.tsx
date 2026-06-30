"use client"

import { Check, X, Clock, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Approval {
  level: number
  status: string
  comment?: string | null
  decidedAt?: string | null
  approver?: { name: string | null } | null
}

interface Props {
  approvals: Approval[]
  currentStatus: string
}

const levelLabels: Record<number, string> = {
  1: "MD1 Review",
  2: "MD2 Review",
}

export function ApprovalTimeline({ approvals, currentStatus }: Props) {
  const totalLevels = [1, 2]

  function getStatus(level: number) {
    const a = approvals?.find((ap) => ap.level === level)
    if (!a) {
      if (level === 1 && currentStatus === "DRAFT") return "waiting"
      if (level === 2 && currentStatus === "PENDING_MD1") return "waiting"
      return "pending"
    }
    return a.status === "PENDING" ? "pending" : a.status === "APPROVED" ? "approved" : "rejected"
  }

  function getApproverComment(level: number) {
    const a = approvals?.find((ap) => ap.level === level)
    return a?.comment || null
  }

  function getApproverName(level: number) {
    const a = approvals?.find((ap) => ap.level === level)
    return a?.approver?.name || null
  }

  return (
    <div className="space-y-0">
      {totalLevels.map((level, i) => {
        const status = getStatus(level)
        return (
          <div key={level} className="relative flex gap-4 pb-6 last:pb-0">
            {i < totalLevels.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-200" />
            )}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  status === "approved" && "border-green-500 bg-green-50",
                  status === "rejected" && "border-red-500 bg-red-50",
                  status === "pending" && "border-amber-500 bg-amber-50",
                  status === "waiting" && "border-gray-300 bg-white"
                )}
              >
                {status === "approved" && <Check className="h-4 w-4 text-green-600" />}
                {status === "rejected" && <X className="h-4 w-4 text-red-600" />}
                {status === "pending" && <Clock className="h-4 w-4 text-amber-600" />}
                {status === "waiting" && <Circle className="h-4 w-4 text-gray-300" />}
              </div>
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm font-medium text-gray-900">
                {levelLabels[level]}
              </p>
              {status === "approved" && getApproverName(level) && (
                <p className="text-xs text-green-600">
                  Approved by {getApproverName(level)}
                </p>
              )}
              {status === "rejected" && (
                <div>
                  <p className="text-xs text-red-600">
                    {getApproverName(level) ? `Rejected by ${getApproverName(level)}` : "Rejected"}
                  </p>
                  {getApproverComment(level) && (
                    <p className="mt-1 text-xs text-gray-500 italic">
                      &ldquo;{getApproverComment(level)}&rdquo;
                    </p>
                  )}
                </div>
              )}
              {status === "pending" && (
                <p className="text-xs text-amber-600">Awaiting approval...</p>
              )}
              {status === "waiting" && (
                <p className="text-xs text-gray-400">Waiting for previous step</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
