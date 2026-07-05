"use client"

import { useState, useMemo } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2, Send, Save, IndianRupee } from "lucide-react"
import { quotationSchema } from "@/lib/validations"
import { QuotationFormData } from "@/lib/types"

interface Props {
  initialData?: QuotationFormData
  quotationId?: string
}

export function QuotationStepper({ initialData, quotationId }: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [saving, setSaving] = useState(false)
  const isEditing = !!quotationId

  const todayPlus25 = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 25)
    return d.toISOString().split("T")[0]
  }, [])

  const form = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema) as any,
    defaultValues: initialData || {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      companyName: "",
      validUntil: todayPlus25,
      lineItems: [{ id: crypto.randomUUID(), description: "", quantity: 1, rate: 0, amount: 0 }],
      taxPercent: 18,
      notes: "",
    },
    mode: "onChange",
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: "lineItems",
  })

  const { register, watch, formState: { errors } } = form
  const { fields, append, remove } = fieldArray

  const data = watch()
  const subtotal = data.lineItems.reduce((sum, item) => sum + (item.amount || 0), 0)
  const taxAmount = subtotal * ((data.taxPercent || 0) / 100)
  const total = subtotal + taxAmount

  function addItem() {
    append({ id: crypto.randomUUID(), description: "", quantity: 1, rate: 0, amount: 0 })
  }

  function calcAmount(index: number) {
    const qty = (document.querySelector(`[name="lineItems.${index}.quantity"]`) as HTMLInputElement)?.value
    const rate = (document.querySelector(`[name="lineItems.${index}.rate"]`) as HTMLInputElement)?.value
    const amountEl = document.querySelector(`[name="lineItems.${index}.amount"]`) as HTMLInputElement
    if (amountEl) {
      amountEl.value = (Number(qty) * Number(rate)).toFixed(2)
      amountEl.dispatchEvent(new Event("input", { bubbles: true }))
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const payload = watch()
      if (isEditing) {
        const res = await fetch(`/api/quotations/${quotationId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to update")

        const submitRes = await fetch(`/api/quotations/${quotationId}/submit`, {
          method: "POST",
        })
        if (!submitRes.ok) throw new Error("Failed to submit")

        router.push(`/quotations/${quotationId}`)
      } else {
        const res = await fetch("/api/quotations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create")
        const quote = await res.json()

        const submitRes = await fetch(`/api/quotations/${quote.id}/submit`, {
          method: "POST",
        })
        if (!submitRes.ok) throw new Error("Failed to submit")

        router.push("/quotations")
      }
      router.refresh()
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSaveDraft() {
    setSaving(true)
    try {
      const payload = watch()
      if (isEditing) {
        const res = await fetch(`/api/quotations/${quotationId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to save")
        router.push(`/quotations/${quotationId}`)
      } else {
        const res = await fetch("/api/quotations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to save")
        router.push("/quotations")
      }
      router.refresh()
    } catch {
      alert("Failed to save draft.")
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "input mt-1"
  const labelClass = "block text-sm font-medium text-foreground"
  const errorClass = "mt-1 text-xs text-red-600"

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Customer Details */}
      <div className="card p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Customer Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Customer Name *</label>
            <input {...register("customerName")} className={inputClass} />
            {errors.customerName && <p className={errorClass}>{errors.customerName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" {...register("customerEmail")} className={inputClass} />
            {errors.customerEmail && <p className={errorClass}>{errors.customerEmail.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input {...register("customerPhone")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input {...register("companyName")} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Line Items</h2>
          <button
            type="button"
            onClick={addItem}
            className="btn-primary text-sm px-3 py-1.5"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-muted">No items yet. Click &quot;Add Item&quot; to start.</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-stroke bg-card/50 p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted">Description</label>
                    <input
                      {...register(`lineItems.${index}.description`)}
                      placeholder="Service or product name"
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-muted">Qty</label>
                      <input
                        type="number" min="1"
                        {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                        onChange={() => calcAmount(index)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted">Rate (₹)</label>
                      <input
                        type="number" min="0" step="0.01"
                        {...register(`lineItems.${index}.rate`, { valueAsNumber: true })}
                        onChange={() => calcAmount(index)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted">Amount</label>
                      <input
                        type="number" step="0.01" readOnly
                        {...register(`lineItems.${index}.amount`, { valueAsNumber: true })}
                        className="rounded-lg border border-stroke bg-card px-3 py-2 text-sm text-foreground w-full"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded-lg p-1.5 text-muted hover:bg-danger-light/20 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {errors.lineItems?.message && <p className="text-sm text-red-600 mt-2">{errors.lineItems.message}</p>}
      </div>

      {/* Pricing & Terms */}
      <div className="card p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Pricing & Terms</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Tax (%)</label>
            <input type="number" min="0" max="100" step="0.01" {...register("taxPercent")} className={inputClass} />
            {errors.taxPercent && <p className={errorClass}>{errors.taxPercent.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Valid Until *</label>
            <input type="date" {...register("validUntil")} className={inputClass} />
            {errors.validUntil && <p className={errorClass}>{errors.validUntil.message}</p>}
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Notes</label>
          <textarea rows={3} {...register("notes")} placeholder="Additional terms, payment details, etc." className={inputClass} />
        </div>
      </div>

      {/* Summary */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Summary</h2>
        </div>
        {data.lineItems.length > 0 && (
          <div className="divide-y divide-stroke-dark mb-4">
            {data.lineItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.description || `Item ${i + 1}`}</p>
                  <p className="text-xs text-muted">{item.quantity || 0} x ₹{(item.rate || 0).toFixed(2)}</p>
                </div>
                <p className="text-sm font-medium text-foreground">₹{(item.amount || 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-stroke pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="font-medium">₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Tax ({(data.taxPercent || 0)}%)</span><span className="font-medium">₹{taxAmount.toFixed(2)}</span></div>
          <div className="flex justify-between border-t border-stroke pt-2 text-base"><span className="font-semibold">Total</span><span className="font-bold text-primary">₹{total.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={saving}
          className="btn-secondary"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Draft"}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-success"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isEditing ? "Submit for Approval" : "Submit for Approval"}
        </button>
      </div>
    </div>
  )
}
