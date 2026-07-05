"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Send } from "lucide-react"

export function ResubmitButton({ quotationId }: { quotationId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleResubmit() {
    setLoading(true)
    try {
      const res = await fetch(`/api/quotations/${quotationId}/submit`, {
        method: "POST",
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Failed to submit")
        return
      }
      setDone(true)
      router.refresh()
    } catch {
      alert("Failed to submit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (done) return null

  return (
    <button
      onClick={handleResubmit}
      disabled={loading}
      className="btn-success text-xs px-3 py-2"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Send className="h-3.5 w-3.5" />
      )}
      {loading ? "Submitting..." : "Submit for Approval"}
    </button>
  )
}