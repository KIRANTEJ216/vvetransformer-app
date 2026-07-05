"use client"

import { useState } from "react"
import { Download, Loader2, Trash2 } from "lucide-react"

interface InvoiceItem {
  id: string
  invoiceNumber: string
  createdAt: string
  pdfUrl: string | null
  emailedAt: string | null
  quotation: {
    quoteNumber: string
    customerName: string
    total: number
    status: string
  }
}

interface Props {
  invoices: InvoiceItem[]
}

export function InvoiceList({ invoices }: Props) {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = invoices.filter((inv) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.quotation.customerName.toLowerCase().includes(q) ||
      inv.quotation.quoteNumber.toLowerCase().includes(q)
    )
  })

  async function handleDownload(id: string) {
    setDownloading(id)
    try {
      const res = await fetch(`/api/invoices/${id}/download`)
      if (!res.ok) throw new Error("Download failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${invoices.find((i) => i.id === id)?.invoiceNumber || "invoice"}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert("Failed to download invoice")
    } finally {
      setDownloading(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this invoice? The quotation will be reset to APPROVED.")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Delete failed")
      }
      window.location.reload()
    } catch (err: any) {
      alert(err.message || "Failed to delete invoice")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by invoice number, customer, or quote..."
          className="input"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-muted">No invoices match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => (
            <div key={inv.id} className="card p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {inv.invoiceNumber}
                    </p>
                    <span className="badge badge-green">
                      {inv.quotation.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted truncate">
                    {inv.quotation.customerName} · {inv.quotation.quoteNumber}
                  </p>
                  <p className="text-xs text-muted">
                    Generated {new Date(inv.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <p className="text-sm font-semibold text-foreground">
                    ₹{inv.quotation.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <button
                    onClick={() => handleDownload(inv.id)}
                    disabled={downloading === inv.id}
                    className="btn-secondary text-xs"
                  >
                    {downloading === inv.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    PDF
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    disabled={deleting === inv.id}
                    className="btn-danger text-xs"
                    aria-label="Delete invoice"
                  >
                    {deleting === inv.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
