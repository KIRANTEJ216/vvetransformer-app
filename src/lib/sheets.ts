import { JWT } from "google-auth-library"

export interface InvoiceRow {
  documentType: string
  invoiceNumber: string
  invoiceDate: string
  irn: string
  ackNumber: string
  ackDate: string
  eWayBillNumber: string
  placeOfSupply: string
  stateCode: string
  state: string
  sellerName: string
  sellerGstin: string
  sellerPan: string
  sellerAddress: string
  sellerState: string
  sellerEmail: string
  sellerWebsite: string
  buyerName: string
  buyerGstin: string
  buyerPan: string
  buyerAddress: string
  buyerState: string
  consigneeName: string
  consigneeGstin: string
  consigneeAddress: string
  consigneeState: string
  itemIndex: number
  itemDescription: string
  itemHsnCode: string
  itemQuantity: number
  itemUnit: string
  itemRate: number
  itemAmount: number
  taxableValue: number
  cgstRate: number
  cgstAmount: number
  sgstRate: number
  sgstAmount: number
  igstRate: number
  igstAmount: number
  totalTax: number
  invoiceTotal: number
  amountInWords: string
  taxInWords: string
  bankName: string
  accountHolder: string
  accountNumber: string
  ifscCode: string
  bankBranch: string
  vehicleNumber: string
  transportMode: string
  approxDistanceKm: number
  validUpto: string
}

async function getAccessToken(): Promise<string | null> {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
  if (!privateKey || !clientEmail) return null

  const auth = new JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })

  const token = await auth.getAccessToken()
  return token?.token || null
}

export async function fetchInvoiceData(): Promise<{
  rows: InvoiceRow[]
  totals: {
    invoiceTotal: number
    totalTax: number
    cgstAmount: number
    sgstAmount: number
    igstAmount: number
    invoiceCount: number
  }
  error?: string
}> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  const token = await getAccessToken()

  if (!token || !sheetId) {
    return {
      rows: [],
      totals: {
        invoiceTotal: 0,
        totalTax: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        invoiceCount: 0,
      },
      error: "Google Sheets not configured. Set GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and GOOGLE_SHEET_ID in .env",
    }
  }

  try {
    const range = process.env.GOOGLE_SHEETS_RANGE || "Sheet1"
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueRenderOption=UNFORMATTED_VALUE`

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Google Sheets API error ${res.status}: ${errText}`)
    }

    const data = await res.json()
    const values = data.values as unknown[][] | undefined
    if (!values || values.length < 2) {
      return {
        rows: [],
        totals: { invoiceTotal: 0, totalTax: 0, cgstAmount: 0, sgstAmount: 0, igstAmount: 0, invoiceCount: 0 },
        error: "No data found in sheet",
      }
    }

    const headers = values[0] as string[]
    const rows = values.slice(1).map((row) => rowToInvoice(headers, row))

    const totals = rows.reduce(
      (acc, row) => ({
        invoiceTotal: acc.invoiceTotal + (row.invoiceTotal || 0),
        totalTax: acc.totalTax + (row.totalTax || 0),
        cgstAmount: acc.cgstAmount + (row.cgstAmount || 0),
        sgstAmount: acc.sgstAmount + (row.sgstAmount || 0),
        igstAmount: acc.igstAmount + (row.igstAmount || 0),
        invoiceCount: acc.invoiceCount + 1,
      }),
      { invoiceTotal: 0, totalTax: 0, cgstAmount: 0, sgstAmount: 0, igstAmount: 0, invoiceCount: 0 }
    )

    rows.sort((a, b) => {
      const dateA = new Date(a.invoiceDate).getTime()
      const dateB = new Date(b.invoiceDate).getTime()
      if (isNaN(dateA) && isNaN(dateB)) return 0
      if (isNaN(dateA)) return 1
      if (isNaN(dateB)) return -1
      return dateB - dateA
    })

    return { rows, totals }
  } catch (err: unknown) {
    return {
      rows: [],
      totals: { invoiceTotal: 0, totalTax: 0, cgstAmount: 0, sgstAmount: 0, igstAmount: 0, invoiceCount: 0 },
      error: err instanceof Error ? err.message : "Failed to fetch sheet data",
    }
  }
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  count: number
}

export function aggregateMonthly(rows: InvoiceRow[]): MonthlyRevenue[] {
  const monthMap = new Map<string, { revenue: number; count: number }>()

  for (const row of rows) {
    const dateStr = row.invoiceDate
    if (!dateStr) continue
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const existing = monthMap.get(key) || { revenue: 0, count: 0 }
    existing.revenue += row.invoiceTotal || 0
    existing.count += 1
    monthMap.set(key, existing)
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({
      month: new Date(key + "-01").toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      revenue: val.revenue,
      count: val.count,
    }))
}

function rowToInvoice(headers: string[], row: unknown[]): InvoiceRow {
  const get = (key: string): string => {
    const idx = headers.indexOf(key)
    return idx >= 0 ? String(row[idx] ?? "") : ""
  }

  const getNum = (key: string): number => {
    const val = get(key)
    const num = Number(val)
    return isNaN(num) ? 0 : num
  }

  return {
    documentType: get("document_type"),
    invoiceNumber: get("invoice_number"),
    invoiceDate: get("invoice_date"),
    irn: get("irn"),
    ackNumber: get("ack_number"),
    ackDate: get("ack_date"),
    eWayBillNumber: get("e_way_bill_number"),
    placeOfSupply: get("place_of_supply"),
    stateCode: get("state_code"),
    state: get("state"),
    sellerName: get("seller_name"),
    sellerGstin: get("seller_gstin"),
    sellerPan: get("seller_pan"),
    sellerAddress: get("seller_address"),
    sellerState: get("seller_state"),
    sellerEmail: get("seller_email"),
    sellerWebsite: get("seller_website"),
    buyerName: get("buyer_name"),
    buyerGstin: get("buyer_gstin"),
    buyerPan: get("buyer_pan"),
    buyerAddress: get("buyer_address"),
    buyerState: get("buyer_state"),
    consigneeName: get("consignee_name"),
    consigneeGstin: get("consignee_gstin"),
    consigneeAddress: get("consignee_address"),
    consigneeState: get("consignee_state"),
    itemIndex: getNum("item_index"),
    itemDescription: get("item_description"),
    itemHsnCode: get("item_hsn_code"),
    itemQuantity: getNum("item_quantity"),
    itemUnit: get("item_unit"),
    itemRate: getNum("item_rate"),
    itemAmount: getNum("item_amount"),
    taxableValue: getNum("taxable_value"),
    cgstRate: getNum("cgst_rate"),
    cgstAmount: getNum("cgst_amount"),
    sgstRate: getNum("sgst_rate"),
    sgstAmount: getNum("sgst_amount"),
    igstRate: getNum("igst_rate"),
    igstAmount: getNum("igst_amount"),
    totalTax: getNum("total_tax"),
    invoiceTotal: getNum("invoice_total"),
    amountInWords: get("amount_in_words"),
    taxInWords: get("tax_in_words"),
    bankName: get("bank_name"),
    accountHolder: get("account_holder"),
    accountNumber: get("account_number"),
    ifscCode: get("ifsc_code"),
    bankBranch: get("bank_branch"),
    vehicleNumber: get("vehicle_number"),
    transportMode: get("transport_mode"),
    approxDistanceKm: getNum("approx_distance_km"),
    validUpto: get("valid_upto"),
  }
}
