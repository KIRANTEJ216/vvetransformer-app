import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InvoiceList } from "./invoice-list"
import { Download } from "lucide-react"

export default async function InvoicesPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)

  await prisma.invoice.updateMany({
    where: {
      archived: false,
      createdAt: { lt: fortyFiveDaysAgo },
    },
    data: {
      archived: true,
      archivedAt: new Date(),
    },
  })

  const role = session.user.role
  const where: any =
    role === "MD1" || role === "MD2"
      ? { archived: false }
      : { archived: false, quotation: { userId: session.user.id } }

  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      quotation: {
        select: {
          quoteNumber: true,
          customerName: true,
          total: true,
          status: true,
        },
      },
    },
  })

  const serialized = invoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    createdAt: inv.createdAt.toISOString(),
    pdfUrl: inv.pdfUrl,
    emailedAt: inv.emailedAt?.toISOString() ?? null,
    quotation: {
      quoteNumber: inv.quotation.quoteNumber,
      customerName: inv.quotation.customerName,
      total: Number(inv.quotation.total),
      status: inv.quotation.status,
    },
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
        <p className="text-sm text-muted">
          Download generated invoices
        </p>
      </div>

      {serialized.length === 0 ? (
        <div className="card p-12 text-center">
          <Download className="mx-auto h-12 w-12 text-muted" />
          <h2 className="mt-4 text-lg font-medium text-foreground">
            No invoices yet
          </h2>
          <p className="mt-1 text-sm text-muted">
            Invoices are automatically generated when a quotation is fully approved.
          </p>
        </div>
      ) : (
        <InvoiceList invoices={serialized} />
      )}
    </div>
  )
}
