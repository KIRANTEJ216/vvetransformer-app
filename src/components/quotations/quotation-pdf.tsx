import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a5f",
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  brandName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a5f",
  },
  brandSub: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "right",
  },
  docNumber: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "right",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: 100,
    color: "#6b7280",
  },
  value: {
    flex: 1,
    color: "#1a1a1a",
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    fontSize: 9,
    fontWeight: "bold",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    fontSize: 9,
  },
  colDesc: { width: "40%" },
  colQty: { width: "15%", textAlign: "right" },
  colRate: { width: "20%", textAlign: "right" },
  colAmount: { width: "25%", textAlign: "right" },
  totalsSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  totalLabel: {
    width: 100,
    textAlign: "right",
    color: "#6b7280",
    fontSize: 10,
  },
  totalValue: {
    width: 100,
    textAlign: "right",
    fontSize: 10,
    color: "#1a1a1a",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  grandTotalLabel: {
    width: 100,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e3a5f",
  },
  grandTotalValue: {
    width: 100,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e3a5f",
  },
  statusBadge: {
    marginTop: 20,
    padding: 10,
    borderRadius: 4,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
  },
  notes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9fafb",
    fontSize: 9,
    color: "#6b7280",
  },
})

interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface QuotationPDFData {
  quoteNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  companyName?: string | null
  lineItems: LineItem[]
  subtotal: number
  taxPercent: number
  taxAmount: number
  total: number
  status: string
  notes?: string | null
  createdAt: string
  validUntil?: string | null
}

export function QuotationPDF({ data }: { data: QuotationPDFData }) {
  const statusColor =
    data.status === "APPROVED" ? "#10b981" :
    data.status === "REJECTED" ? "#ef4444" :
    data.status === "DRAFT" ? "#6b7280" : "#f59e0b"

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>VVE TRANSFORMERS</Text>
            <Text style={styles.brandSub}>Quotation · {data.quoteNumber}</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>QUOTATION</Text>
            <Text style={styles.docNumber}>#{data.quoteNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{data.customerName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{data.customerEmail}</Text>
          </View>
          {data.customerPhone && (
            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{data.customerPhone}</Text>
            </View>
          )}
          {data.companyName && (
            <View style={styles.row}>
              <Text style={styles.label}>Company:</Text>
              <Text style={styles.value}>{data.companyName}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Line Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colDesc}>Description</Text>
              <Text style={styles.colQty}>Qty</Text>
              <Text style={styles.colRate}>Rate</Text>
              <Text style={styles.colAmount}>Amount</Text>
            </View>
            {data.lineItems.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colRate}>₹{Number(item.rate).toFixed(2)}</Text>
                <Text style={styles.colAmount}>₹{Number(item.amount).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>₹{data.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax ({data.taxPercent}%):</Text>
            <Text style={styles.totalValue}>₹{data.taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>₹{data.total.toFixed(2)}</Text>
          </View>
        </View>

        {data.notes && (
          <View style={styles.notes}>
            <Text>{data.notes}</Text>
          </View>
        )}

        <View style={styles.statusBadge}>
          <Text style={{ color: statusColor }}>Status: {data.status.replace(/_/g, " ")}</Text>
        </View>

        <View style={styles.footer}>
          <Text>
            Generated on {new Date(data.createdAt).toLocaleDateString("en-IN", {
              year: "numeric", month: "long", day: "numeric",
            })}
            {data.validUntil ? ` · Valid until ${new Date(data.validUntil).toLocaleDateString("en-IN")}` : ""}
          </Text>
          <Text style={{ marginTop: 4 }}>VVE Transformers · {data.quoteNumber}</Text>
        </View>
      </Page>
    </Document>
  )
}
