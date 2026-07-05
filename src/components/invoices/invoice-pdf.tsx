import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer"
import fs from "fs"
import path from "path"

const primaryBlue = "#0A4D9B"
const darkNavy = "#0D2340"
const accentOrange = "#F28C28"
const bgLight = "#F8FAFC"
const cardBg = "#FFFFFF"
const borderColor = "#D9E2EC"
const textPrimary = "#1F2937"
const textSecondary = "#6B7280"
const successGreen = "#2E7D32"
const danger = "#DC2626"

const COMPANY = "VVE Transformers Private Limited"
const ADDRESS_LINE1 = "Plot No.62/2, C.I.E, Gandhinagar, Balanagar"
const ADDRESS_CITY = "Hyderabad, Telangana"
const UDYAM = "UDYAM-TS-20-0009660"
const GSTIN = "36AAECV7146H1Z3"
const STATE_CODE = "36"
const CIN = "U31401TS2014PTC092478"
const PHONE = "+91 40 2345 6789"
const EMAIL = "vvetransformers@gmail.com"
const WEBSITE = "vvetransformers.com"

const logoBase64 = (() => {
  try {
    const logoPath = path.resolve(process.cwd(), "..", "logo.png")
    const data = fs.readFileSync(logoPath)
    return `data:image/png;base64,${data.toString("base64")}`
  } catch {
    return null
  }
})()

const styles = StyleSheet.create({
  page: {
    padding: 22,
    paddingBottom: 44,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: textPrimary,
    backgroundColor: cardBg,
  },

  header: {
    flexDirection: "row",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: primaryBlue,
  },
  headerLeft: {
    width: "60%",
    flexDirection: "row",
    gap: 12,
  },
  logoWrapper: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    maxWidth: 60,
    maxHeight: 60,
    objectFit: "contain",
  },
  brandBlock: {
    flex: 1,
    justifyContent: "center",
  },
  companyName: {
    fontSize: 17,
    fontWeight: "bold",
    color: darkNavy,
    letterSpacing: 1,
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: 7,
    color: textSecondary,
    marginBottom: 0.5,
    lineHeight: 1.5,
  },
  headerRight: {
    width: "40%",
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: darkNavy,
    letterSpacing: 2,
    marginBottom: 3,
  },
  invoiceNumber: {
    fontSize: 10,
    fontWeight: "bold",
    color: primaryBlue,
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerMeta: {
    fontSize: 7,
    color: textSecondary,
    marginBottom: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
    marginTop: 4,
  },
  statusText: {
    fontSize: 6,
    fontWeight: "bold",
    color: cardBg,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  customerSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  customerCard: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: borderColor,
    borderRadius: 6,
  },
  cardTitle: {
    fontSize: 7,
    fontWeight: "bold",
    color: primaryBlue,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  customerValue: {
    fontSize: 8,
    color: textPrimary,
    fontWeight: "bold",
    marginBottom: 1,
  },
  customerSub: {
    fontSize: 6.5,
    color: textSecondary,
    marginBottom: 0.5,
    lineHeight: 1.4,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    backgroundColor: bgLight,
    borderRadius: 6,
    padding: 8,
    gap: 4,
  },
  infoItem: {
    width: "23%",
  },
  infoLabel: {
    fontSize: 5.5,
    color: textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 0.5,
  },
  infoValue: {
    fontSize: 6.5,
    color: textPrimary,
    fontWeight: "medium",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: primaryBlue,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderText: {
    fontSize: 6,
    fontWeight: "bold",
    color: cardBg,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: bgLight,
    alignItems: "center",
  },
  tableCell: {
    fontSize: 6.5,
    color: textPrimary,
  },
  colSn: { width: "6%" },
  colDesc: { width: "28%" },
  colHsn: { width: "10%" },
  colQty: { width: "8%", textAlign: "right" },
  colRate: { width: "14%", textAlign: "right" },
  colGst: { width: "8%", textAlign: "center" },
  colTaxAmt: { width: "12%", textAlign: "right" },
  colAmount: { width: "14%", textAlign: "right" },

  totalsSection: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  totalsCard: {
    width: 200,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontSize: 7,
    color: textSecondary,
  },
  totalValue: {
    fontSize: 7,
    color: textPrimary,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: primaryBlue,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 2,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: cardBg,
  },
  grandTotalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: cardBg,
  },

  amountWords: {
    marginBottom: 14,
    borderTopWidth: 1,
    borderTopColor: borderColor,
    paddingTop: 8,
  },
  amountWordsLabel: {
    fontSize: 5.5,
    color: textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  amountWordsValue: {
    fontSize: 7.5,
    color: darkNavy,
    fontStyle: "italic",
    fontWeight: "medium",
    lineHeight: 1.5,
  },

  signatureArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: borderColor,
  },
  signatureCol: {
    alignItems: "center",
    width: "30%",
  },
  signatureLine: {
    width: "70%",
    borderTopWidth: 1,
    borderTopColor: primaryBlue,
    marginTop: 22,
    marginBottom: 3,
  },
  signatureLabel: {
    fontSize: 6,
    color: textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },

  notesSection: {
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderLeftWidth: 2,
    borderLeftColor: primaryBlue,
    backgroundColor: bgLight,
    borderRadius: 3,
  },
  notesTitle: {
    fontSize: 5.5,
    fontWeight: "bold",
    color: primaryBlue,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  noteText: {
    fontSize: 6.5,
    color: textSecondary,
    lineHeight: 1.5,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: darkNavy,
    paddingHorizontal: 22,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 6,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 0.5,
  },
  footerBold: {
    fontSize: 6.5,
    color: cardBg,
    fontWeight: "bold",
  },
})

function formatINR(n: number): string {
  return `\u20B9${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceData {
  invoiceNumber: string
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
  notes?: string | null
  createdAt: string
  validUntil?: string | null
  status?: string
  customerGst?: string | null
  customerAddress?: string | null
}

function numberToWords(n: number): string {
  if (n === 0) return "Zero Rupees Only"
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
  const convert = (num: number): string => {
    if (num < 20) return ones[num]
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convert(num % 100) : "")
    if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "")
    if (num < 10000000) return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "")
    return convert(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + convert(num % 10000000) : "")
  }
  const whole = Math.floor(n)
  const paise = Math.round((n - whole) * 100)
  let words = convert(whole) + " Rupees"
  if (paise > 0) words += " and " + convert(paise) + " Paise"
  return words + " Only"
}

export function InvoicePDF({ data }: { data: InvoiceData }) {
  const cgst = data.taxAmount / 2
  const sgst = data.taxAmount / 2
  const status = data.status || "Pending"

  const badgeBg = status === "Paid" ? successGreen : status === "Pending" ? accentOrange : status === "Cancelled" ? danger : textSecondary
  const createdAt = new Date(data.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  const dueDate = data.validUntil
    ? new Date(data.validUntil).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "Net 30"

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {logoBase64 && (
              <View style={styles.logoWrapper}>
                <Image style={styles.logo} src={logoBase64} />
              </View>
            )}
            <View style={styles.brandBlock}>
              <Text style={styles.companyName}>VVE TRANSFORMERS</Text>
              <Text style={styles.companyDetail}>{ADDRESS_LINE1}</Text>
              <Text style={styles.companyDetail}>{ADDRESS_CITY}</Text>
              <Text style={styles.companyDetail}>GSTIN: {GSTIN} | CIN: {CIN}</Text>
              <Text style={styles.companyDetail}>{EMAIL} | {WEBSITE}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
            <Text style={styles.headerMeta}>
              Date: <Text style={{ fontWeight: "bold", color: textPrimary }}>{createdAt}</Text>
            </Text>
            <Text style={styles.headerMeta}>
              Due Date: <Text style={{ fontWeight: "bold", color: textPrimary }}>{dueDate}</Text>
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.customerSection}>
          <View style={styles.customerCard}>
            <Text style={styles.cardTitle}>Bill To</Text>
            <Text style={styles.customerValue}>{data.companyName || data.customerName}</Text>
            {data.companyName && <Text style={styles.customerSub}>{data.customerName}</Text>}
            <Text style={styles.customerSub}>{data.customerEmail}</Text>
            {data.customerPhone && <Text style={styles.customerSub}>{data.customerPhone}</Text>}
            {data.customerAddress && <Text style={styles.customerSub}>{data.customerAddress}</Text>}
            {data.customerGst && <Text style={styles.customerSub}>GST: {data.customerGst}</Text>}
          </View>
          <View style={styles.customerCard}>
            <Text style={styles.cardTitle}>Ship To</Text>
            <Text style={styles.customerValue}>{data.companyName || data.customerName}</Text>
            {data.companyName && <Text style={styles.customerSub}>{data.customerName}</Text>}
            <Text style={styles.customerSub}>{data.customerEmail}</Text>
            {data.customerPhone && <Text style={styles.customerSub}>{data.customerPhone}</Text>}
            {data.customerAddress && <Text style={styles.customerSub}>{data.customerAddress}</Text>}
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Invoice Date</Text>
            <Text style={styles.infoValue}>{createdAt}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Due Date</Text>
            <Text style={styles.infoValue}>{dueDate}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Payment Terms</Text>
            <Text style={styles.infoValue}>Net 30</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>GSTIN</Text>
            <Text style={styles.infoValue}>{GSTIN}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Place of Supply</Text>
            <Text style={styles.infoValue}>Telangana</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>State Code</Text>
            <Text style={styles.infoValue}>{STATE_CODE}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Quote No.</Text>
            <Text style={styles.infoValue}>{data.quoteNumber}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>PO Number</Text>
            <Text style={styles.infoValue}>—</Text>
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colSn]}>#</Text>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.colHsn]}>HSN/SAC</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.colGst]}>GST%</Text>
            <Text style={[styles.tableHeaderText, styles.colTaxAmt]}>Tax Amt</Text>
            <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount</Text>
          </View>
          {data.lineItems.map((item, i) => {
            const itemTax = item.amount * (data.taxPercent / 100)
            return (
              <View key={i} style={i % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
                <Text style={[styles.tableCell, styles.colSn]}>{i + 1}</Text>
                <Text style={[styles.tableCell, styles.colDesc]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.colHsn, { color: textSecondary }]}>8504</Text>
                <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.colRate]}>{formatINR(item.rate)}</Text>
                <Text style={[styles.tableCell, styles.colGst]}>{data.taxPercent}%</Text>
                <Text style={[styles.tableCell, styles.colTaxAmt]}>{formatINR(itemTax)}</Text>
                <Text style={[styles.tableCell, styles.colAmount, { fontWeight: "bold", color: textPrimary }]}>{formatINR(item.amount)}</Text>
              </View>
            )
          })}
        </View>

        <View style={styles.totalsSection}>
          <View style={styles.totalsCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatINR(data.subtotal)}</Text>
            </View>
            {cgst > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>CGST @ {data.taxPercent / 2}%</Text>
                <Text style={styles.totalValue}>{formatINR(cgst)}</Text>
              </View>
            )}
            {sgst > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>SGST @ {data.taxPercent / 2}%</Text>
                <Text style={styles.totalValue}>{formatINR(sgst)}</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>{formatINR(data.total)}</Text>
            </View>
          </View>
        </View>

        {data.total > 0 && (
          <View style={styles.amountWords}>
            <Text style={styles.amountWordsLabel}>Amount in Words</Text>
            <Text style={styles.amountWordsValue}>{numberToWords(data.total)}</Text>
          </View>
        )}

        <View style={styles.signatureArea}>
          <View style={styles.signatureCol}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Prepared By</Text>
          </View>
          <View style={styles.signatureCol}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Authorised Signatory</Text>
          </View>
          <View style={styles.signatureCol}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Company Seal</Text>
          </View>
        </View>

        {data.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.noteText}>{data.notes}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerBold}>{COMPANY}</Text>
            <Text style={styles.footerText}>{ADDRESS_LINE1}, {ADDRESS_CITY}</Text>
            <Text style={styles.footerText}>{EMAIL} \u00B7 {WEBSITE} \u00B7 {PHONE}</Text>
          </View>
          <View>
            <Text style={styles.footerText}>GST: {GSTIN}</Text>
            <Text style={styles.footerText}>CIN: {CIN}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
