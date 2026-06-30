import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica/v5/0e7123a5c1c3c1d8c0d5f3b3b3b3b3b3.woff2", fontWeight: "normal" },
  ],
})

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
    borderBottomColor: "#2563eb",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
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
    width: 80,
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
    color: "#1a1a1a",
  },
  grandTotalValue: {
    width: 100,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "bold",
    color: "#1a1a1a",
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

interface InvoiceData {
  invoiceNumber: string
  quoteNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  companyName?: string | null
  lineItems: Array<{ description: string; quantity: number; rate: number; amount: number }>
  subtotal: number
  taxPercent: number
  taxAmount: number
  total: number
  notes?: string | null
  createdAt: string
  validUntil?: string | null
}

export function InvoicePDF({ data }: { data: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>QUOTATIONFLOW</Text>
          <Text style={styles.subtitle}>INVOICE #{data.invoiceNumber}</Text>
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
          <View style={styles.row}>
            <Text style={styles.label}>Quote #:</Text>
            <Text style={styles.value}>{data.quoteNumber}</Text>
          </View>
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

        <View style={styles.footer}>
          <Text>
            Generated on {new Date(data.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {data.validUntil ? ` · Valid until ${new Date(data.validUntil).toLocaleDateString("en-IN")}` : ""}
          </Text>
          <Text style={{ marginTop: 4 }}>QuotationFlow · Invoice #{data.invoiceNumber}</Text>
        </View>
      </Page>
    </Document>
  )
}
