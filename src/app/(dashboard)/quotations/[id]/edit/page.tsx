import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { QuotationStepper } from "@/components/forms/quotation-stepper"
import { QuotationFormData } from "@/lib/types"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditQuotationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  if (session.user.role && session.user.role !== "USER") {
    redirect("/approvals")
  }

  const { id } = await params

  const quotation = await prisma.quotation.findUnique({ where: { id } })
  if (!quotation) notFound()

  if (quotation.userId !== session.user.id) {
    return <p className="text-center text-muted">Access denied</p>
  }

  if (quotation.status !== "DRAFT") {
    redirect(`/quotations/${id}`)
  }

  const initialData: QuotationFormData = {
    customerName: quotation.customerName,
    customerEmail: quotation.customerEmail,
    customerPhone: quotation.customerPhone || "",
    companyName: quotation.companyName || "",
    validUntil: quotation.validUntil
      ? new Date(quotation.validUntil).toISOString().split("T")[0]
      : "",
    lineItems: (quotation.lineItems as any[]).map((item: any) => ({
      id: item.id || crypto.randomUUID(),
      description: item.description,
      quantity: item.quantity,
      rate: Number(item.rate),
      amount: Number(item.amount),
    })),
    taxPercent: Number(quotation.taxPercent),
    notes: quotation.notes || "",
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/quotations/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Quotation
      </Link>
      <h1 className="text-2xl font-bold text-foreground">Edit {quotation.quoteNumber}</h1>
      <QuotationStepper initialData={initialData} quotationId={id} />
    </div>
  )
}
