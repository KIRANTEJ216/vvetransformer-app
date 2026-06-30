import { QuotationStepper } from "@/components/forms/quotation-stepper"

export default function NewQuotationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Quotation</h1>
        <p className="text-sm text-gray-500">
          Fill in the details below to create a quotation
        </p>
      </div>
      <QuotationStepper />
    </div>
  )
}
