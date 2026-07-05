import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { QuotationStepper } from "@/components/forms/quotation-stepper"

export default async function NewQuotationPage() {
  const session = await auth()

  if (session?.user?.role && session.user.role !== "USER") {
    redirect("/approvals")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New Quotation</h1>
        <p className="text-sm text-muted">
          Fill in the details below to create a quotation
        </p>
      </div>
      <QuotationStepper />
    </div>
  )
}
