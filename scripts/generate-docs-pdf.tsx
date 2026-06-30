import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer"
import { writeFile } from "fs/promises"

const COLORS = {
  primary: "#1a365d",
  secondary: "#2b4f8e",
  accent: "#f59e0b",
  success: "#10b981",
  error: "#ef4444",
  gray: "#6b7280",
  light: "#f3f4f6",
}

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", padding: 40, fontSize: 10, color: "#111" },
  h1: { fontSize: 22, fontWeight: 700, color: COLORS.primary, marginBottom: 6 },
  h2: { fontSize: 16, fontWeight: 700, color: COLORS.secondary, marginTop: 24, marginBottom: 8, paddingBottom: 4, borderBottom: `1 solid ${COLORS.light}` },
  h3: { fontSize: 12, fontWeight: 700, color: COLORS.primary, marginTop: 16, marginBottom: 6 },
  h4: { fontSize: 10, fontWeight: 700, color: COLORS.secondary, marginTop: 12, marginBottom: 4 },
  p: { fontSize: 10, lineHeight: 1.6, marginBottom: 6, color: "#333" },
  code: { fontFamily: "Courier", fontSize: 8, backgroundColor: COLORS.light, padding: "2 4", borderRadius: 2 },
  codeBlock: { fontFamily: "Courier", fontSize: 8, backgroundColor: "#1e293b", color: "#e2e8f0", padding: 10, marginVertical: 6, lineHeight: 1.5 },
  bullet: { flexDirection: "row", marginBottom: 3, paddingLeft: 8 },
  bulletDot: { width: 10, fontSize: 10, color: COLORS.accent },
  bulletText: { fontSize: 10, lineHeight: 1.5, flex: 1 },
  table: { marginVertical: 8 },
  tableRow: { flexDirection: "row", borderBottom: `1 solid ${COLORS.light}` },
  tableHeader: { backgroundColor: COLORS.primary, padding: "6 8" },
  tableHeaderText: { color: "#fff", fontSize: 9, fontWeight: 700 },
  tableCell: { padding: "6 8", fontSize: 9, flex: 1 },
  tableCellAlt: { backgroundColor: "#f9fafb" },
  tag: { fontSize: 8, padding: "2 6", borderRadius: 3, color: "#fff", marginRight: 4 },
  tagGreen: { backgroundColor: COLORS.success },
  tagRed: { backgroundColor: COLORS.error },
  tagBlue: { backgroundColor: COLORS.secondary },
  tagAmber: { backgroundColor: COLORS.accent },
  coverTitle: { fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 },
  coverSubtitle: { fontSize: 14, color: "#93c5fd", marginBottom: 4 },
  coverInfo: { fontSize: 10, color: "#bfdbfe", marginTop: 20 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 3, gap: 6 },
  section: { marginBottom: 4 },
})

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  )
}

function Tag({ label, color }: { label: string; color: "green" | "red" | "blue" | "amber" }) {
  const bg = color === "green" ? styles.tagGreen : color === "red" ? styles.tagRed : color === "blue" ? styles.tagBlue : styles.tagAmber
  return <Text style={[styles.tag, bg]}>{label}</Text>
}

const Doc = () => (
  <Document>
    {/* Cover */}
    <Page size="A4" style={{ backgroundColor: COLORS.primary, padding: 60, justifyContent: "center" }}>
      <Text style={styles.coverTitle}>VVE Transformers</Text>
      <Text style={styles.coverTitle}>QuotationFlow</Text>
      <Text style={styles.coverSubtitle}>Complete Application Guide</Text>
      <Text style={styles.coverSubtitle}>Errors, Fixes & Use Cases</Text>
      <Text style={styles.coverInfo}>Version 1.0 — June 2026</Text>
      <Text style={styles.coverInfo}>Next.js 16.2 · Prisma 7 · Tailwind v4 · PostgreSQL</Text>
    </Page>

    {/* TOC */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>Table of Contents</Text>
      {["System Overview", "User Roles & Access Control", "Authentication", "Quotations", "Approval Flow", "Invoices", "Dashboards", "Delivery Map", "Known Errors & Fixes", "Troubleshooting Guide", "Environment Variables", "Deployment"].map((t, i) => (
        <Text key={i} style={{ fontSize: 11, marginBottom: 6, color: COLORS.secondary }}>
          {String(i + 1).padStart(2, "0")}.  {t}
        </Text>
      ))}
    </Page>

    {/* 1. System Overview */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>1. System Overview</Text>
      <Text style={styles.p}>QuotationFlow is a web-based quotation, invoice, and approval management system for VVE Transformers Pvt. Ltd. Built with modern web technologies and deployed on Vercel.</Text>

      <Text style={styles.h3}>Technology Stack</Text>
      <View style={styles.table}>
        {[
          ["Framework", "Next.js 16.2 (Turbopack)"],
          ["Language", "TypeScript 5.9"],
          ["Database", "PostgreSQL (via Prisma 7)"],
          ["Auth", "NextAuth v5 (JWT, Credentials)"],
          ["Styling", "Tailwind CSS v4"],
          ["PDF", "@react-pdf/renderer"],
          ["Maps", "Leaflet + react-leaflet"],
          ["Validation", "Zod v4 + react-hook-form"],
          ["Google Sheets", "google-auth-library (REST API)"],
          ["Hosting", "Vercel"],
        ].map(([k, v], i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableCellAlt]}>
            <Text style={[styles.tableCell, { fontWeight: 700, flex: 0.4 }]}>{k}</Text>
            <Text style={[styles.tableCell, { flex: 0.6 }]}>{v}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.h3}>Architecture</Text>
      <Bullet>App Router with route groups: (auth) for login/register, (dashboard) for protected pages</Bullet>
      <Bullet>JWT-based authentication with role stored in token (USER, MD1, MD2, CEO)</Bullet>
      <Bullet>Server components for data fetching, client components for interactivity</Bullet>
      <Bullet>Google Sheets integration for accounting data (optional, opt-in via env vars)</Bullet>
    </Page>

    {/* 2. User Roles */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>2. User Roles & Access Control</Text>

      <View style={styles.table}>
        {[
          ["USER", "Marketing", "Create/view quotations, view invoices"],
          ["MD1", "Managing Director 1", "Approve/reject quotations (level 1), view all invoices"],
          ["MD2", "Managing Director 2", "Approve/reject quotations (level 2), view all invoices"],
          ["CEO", "Chief Executive", "All financial dashboards, delivery map, delete invoices, all data access"],
        ].map(([role, title, access], i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableCellAlt]}>
            <Text style={[styles.tableCell, { fontWeight: 700, flex: 0.2 }]}>{role}</Text>
            <Text style={[styles.tableCell, { flex: 0.25 }]}>{title}</Text>
            <Text style={[styles.tableCell, { flex: 0.55 }]}>{access}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.h3}>Route Mapping</Text>
      {[
        ["/", "Dashboard (live stats)", "All"],
        ["/quotations", "Quotation list + create", "All"],
        ["/quotations/[id]", "Quotation detail", "Owner + MD1/MD2/CEO"],
        ["/quotations/[id]/edit", "Edit draft", "Owner only (DRAFT status)"],
        ["/approvals", "Approval queue", "MD1, MD2 only"],
        ["/invoices", "Invoice list", "All (MD sees all, USER sees own)"],
        ["/financial", "Actual Revenue (GSheets)", "CEO only"],
        ["/financial/forecast", "Forecasted Revenue (internal)", "CEO only"],
        ["/financial/delivery-map", "Delivery Map", "CEO only"],
      ].map(([route, desc, access], i) => (
        <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableCellAlt]}>
          <Text style={[styles.tableCell, { fontFamily: "Courier", fontSize: 8, flex: 0.35 }]}>{route}</Text>
          <Text style={[styles.tableCell, { flex: 0.4 }]}>{desc}</Text>
          <Text style={[styles.tableCell, { flex: 0.25 }]}>{access}</Text>
        </View>
      ))}

      <Text style={styles.h3}>Seeded Users (development only)</Text>
      <Text style={styles.p}>All passwords: password123</Text>
      <Bullet>alice@example.com — USER (Marketing)</Bullet>
      <Bullet>md1@example.com — MD1</Bullet>
      <Bullet>md2@example.com — MD2</Bullet>
      <Bullet>ceo@example.com — CEO</Bullet>
    </Page>

    {/* 3. Authentication */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>3. Authentication</Text>

      <Text style={styles.h3}>Login</Text>
      <Bullet>Route: /login (public, client component)</Bullet>
      <Bullet>Uses NextAuth signIn() with credentials provider</Bullet>
      <Bullet>On success, redirects to / (dashboard)</Bullet>
      <Bullet>Split layout: VVE brand hero image (left) + form (right)</Bullet>

      <Text style={styles.h3}>Register</Text>
      <Bullet>Route: /register (public)</Bullet>
      <Bullet>POST to /api/auth/register</Bullet>
      <Bullet>Rate limited: 5 requests per IP per minute (in-memory)</Bullet>
      <Bullet>Email validated with regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/</Bullet>
      <Bullet>Password minimum: 6 characters</Bullet>
      <Bullet>Created with role: USER by default</Bullet>

      <Text style={styles.h3}>Session</Text>
      <Bullet>JWT strategy (not database sessions)</Bullet>
      <Bullet>Role stored in JWT token, read via session.user.role</Bullet>
      <Bullet>Auth guard in dashboard layout: redirects to /login if no session</Bullet>
    </Page>

    {/* 4. Quotations */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>4. Quotations</Text>

      <Text style={styles.h3}>Create (DRAFT)</Text>
      <Bullet>Route: /quotations/new</Bullet>
      <Bullet>Single-page form: Customer → Items → Pricing → Summary (all visible)</Bullet>
      <Bullet>Fields: customer name, email, phone, address, items (description, quantity, rate, HSN), GST, discount, shipping</Bullet>
      <Bullet>Validated with Zod + react-hook-form</Bullet>
      <Bullet>Creates quotation with status DRAFT</Bullet>

      <Text style={styles.h3}>View</Text>
      <Bullet>Route: /quotations/[id]</Bullet>
      <Bullet>Shows all quotation details, line items, GST breakdown, totals</Bullet>
      <Bullet>Download PDF button (via /api/quotations/[id]/pdf)</Bullet>
      <Bullet>Edit button shown only for DRAFT status + owner</Bullet>
      <Bullet>Approval timeline component for submitted quotations</Bullet>

      <Text style={styles.h3}>Edit (DRAFT only)</Text>
      <Bullet>Route: /quotations/[id]/edit</Bullet>
      <Bullet>Pre-populated form with existing data</Bullet>
      <Bullet>PUT to /api/quotations/[id] (owner-only, DRAFT-only)</Bullet>

      <Text style={styles.h3}>Submit for Approval</Text>
      <Bullet>POST to /api/quotations/[id]/submit</Bullet>
      <Bullet>Creates approval records for BOTH MD1 and MD2 simultaneously</Bullet>
      <Bullet>Changes status to PENDING_MD1</Bullet>

      <Text style={styles.h3}>Search & Filter</Text>
      <Bullet>Search by customer name, quotation number</Bullet>
      <Bullet>Filter chips: All, Draft, Pending, Approved, Rejected</Bullet>
    </Page>

    {/* 5. Approval Flow */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>5. Approval Flow</Text>

      <Text style={styles.h3}>Process</Text>
      <Bullet>1. Marketing creates DRAFT quotation</Bullet>
      <Bullet>2. Marketing submits → creates approvals for both MD1 and MD2</Bullet>
      <Bullet>3. Either MD approves OR either MD rejects (first to decide wins)</Bullet>
      <Bullet>4. If approved → status APPROVED, invoice auto-created with vve-YYYY-NNN format</Bullet>
      <Bullet>5. If rejected → status REJECTED, comment required</Bullet>
      <Bullet>6. Other MD's approval is auto-skipped (APPROVED_SKIPPED or REJECTED_SKIPPED)</Bullet>

      <Text style={styles.h3}>Approval Card (MD dashboard)</Text>
      <Bullet>Route: /approvals (MD1/MD2 only)</Bullet>
      <Bullet>Two tabs: Pending (queue) / History (past decisions)</Bullet>
      <Bullet>Approve button (no comment required)</Bullet>
      <Bullet>Reject button (comment input shown on click)</Bullet>

      <Text style={styles.h3}>Timeline</Text>
      <Bullet>2-step visual indicator on quotation detail page</Bullet>
      <Bullet>Shows status of both MDs' approvals</Bullet>
    </Page>

    {/* 6. Invoices */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>6. Invoices</Text>

      <Text style={styles.h3}>Generation</Text>
      <Bullet>Auto-created when a quotation is approved (first MD to decide)</Bullet>
      <Bullet>Numbering format: vve-YYYY-NNN (sequential per year)</Bullet>
      <Bullet>Stores: invoice number, total, GST breakdown, quotation reference</Bullet>

      <Text style={styles.h3}>List & View</Text>
      <Bullet>Route: /invoices</Bullet>
      <Bullet>Search by invoice number or customer name</Bullet>
      <Bullet>MD1/MD2 see all invoices; USER sees only own</Bullet>
      <Bullet>Download PDF button (via /api/invoices/[id]/download)</Bullet>

      <Text style={styles.h3}>Delete</Text>
      <Bullet>MD1/MD2/CEO only (API + UI both restricted)</Bullet>
      <Bullet>Trash icon with confirmation dialog</Bullet>
      <Bullet>Reverts quotation status to APPROVED</Bullet>
      <Bullet>USER role never sees the delete button</Bullet>
    </Page>

    {/* 7. Dashboards */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>7. Dashboards</Text>

      <Text style={styles.h3}>Dashboard Home (/)</Text>
      <Bullet>Live stats: quotation count, pending approvals, invoice count</Bullet>
      <Bullet>Role-gated navigation in sidebar</Bullet>

      <Text style={styles.h3}>Actual Revenue (/financial) — CEO</Text>
      <Bullet>Data source: Google Sheets only (real accounting invoices)</Bullet>
      <Bullet>4 metric cards: Total Revenue, Tax Collected (CGST/SGST/IGST), Invoice Count, Avg per Invoice</Bullet>
      <Bullet>Monthly revenue bar chart</Bullet>
      <Bullet>Recent invoices list from accounting</Bullet>
      <Bullet>Shows warning if Google Sheets not configured</Bullet>

      <Text style={styles.h3}>Forecasted Revenue (/financial/forecast) — CEO</Text>
      <Bullet>Data source: Internal system only (quotations/invoices)</Bullet>
      <Bullet>Pipeline breakdown: Forecasted (approved), Pipeline (draft), Pending Approval, Total Potential</Bullet>
      <Bullet>Monthly and quarterly forecast charts</Bullet>
      <Bullet>Marketing team leaderboard (top 5 by approved value)</Bullet>
      <Bullet>Conversion rate, avg quote value</Bullet>
    </Page>

    {/* 8. Delivery Map */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>8. Delivery Map</Text>

      <Text style={styles.h3}>Route: /financial/delivery-map — CEO only</Text>

      <Text style={styles.h3}>Data Source</Text>
      <Bullet>Reads from Google Sheet columns: consignee_address, buyer_address, approx_distance_km, vehicle_number</Bullet>

      <Text style={styles.h3}>Features</Text>
      <Bullet>Interactive Leaflet map with OpenStreetMap tiles (no API key needed)</Bullet>
      <Bullet>Central office marker (VVE Transformers HQ in Mumbai)</Bullet>
      <Bullet>Delivery location markers scaled by delivery count (size + color intensity)</Bullet>
      <Bullet>Click marker → popup with deliveries, total value, avg distance, vehicles, buyers</Bullet>
      <Bullet>Click marker → detail card below map with metrics + vehicle/buyer lists</Bullet>
      <Bullet>Delivery summary table: city, state, deliveries, value, distance, vehicles</Bullet>
      <Bullet>200+ Indian cities in coordinate lookup (covers all states)</Bullet>

      <Text style={styles.h3}>Address Parsing</Text>
      <Bullet>src/lib/indian-cities.ts contains city→coordinates mapping</Bullet>
      <Bullet>Matches city names case-insensitively from addresses</Bullet>
      <Bullet>Falls back to state-level positioning if city not found</Bullet>
    </Page>

    {/* 9. Known Errors & Fixes */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>9. Known Errors & Fixes</Text>

      <Text style={styles.h2}>9.1 Lint Errors (Pre-existing)</Text>
      <Text style={styles.p}>These errors existed before current changes and are not introduced by new features:</Text>

      <View style={styles.table}>
        {[
          ["@typescript-eslint/no-explicit-any", "Various files", "Replace `any` with proper type. Low priority — functional."],
          ["@typescript-eslint/no-unused-vars", "financial/forecast", "Remove unused `Calendar` import."],
          ["react-hooks/exhaustive-deps", "quotation-stepper.tsx", "Add missing dependency or disable line."],
        ].map(([err, file, fix], i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableCellAlt]}>
            <Text style={[styles.tableCell, { fontFamily: "Courier", fontSize: 7, flex: 0.25 }]}>{err}</Text>
            <Text style={[styles.tableCell, { fontFamily: "Courier", fontSize: 7, flex: 0.25 }]}>{file}</Text>
            <Text style={[styles.tableCell, { fontSize: 8, flex: 0.5 }]}>{fix}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.h2}>9.2 Google Sheets — Not Configured</Text>
      <Text style={styles.p}><Tag label="WARNING" color="amber" /> Shows amber banner on /financial and /financial/delivery-map</Text>
      <Text style={styles.p}>Fix: Set GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, GOOGLE_SHEET_ID, GOOGLE_SHEETS_RANGE in .env</Text>

      <Text style={styles.h2}>9.3 Database Connection Failure</Text>
      <Text style={styles.p}><Tag label="ERROR" color="red" /> Application crashes on build/start if PostgreSQL is unreachable</Text>
      <Text style={styles.p}>Fix: Ensure PostgreSQL is running. Check DATABASE_URL in .env. Run: npm run db:migrate</Text>

      <Text style={styles.h2}>9.4 Prisma Client Not Generated</Text>
      <Text style={styles.p}><Tag label="ERROR" color="red" /> Import errors for @/generated/prisma/client</Text>
      <Text style={styles.p}>Fix: Run `npx prisma generate` (auto-runs on postinstall)</Text>

      <Text style={styles.h2}>9.5 AUTH_SECRET Missing</Text>
      <Text style={styles.p}><Tag label="ERROR" color="red" /> NextAuth throws on sign-in</Text>
      <Text style={styles.p}>Fix: Generate with `openssl rand -base64 32` and set AUTH_SECRET in .env</Text>

      <Text style={styles.h2}>9.6 Build Fails — Missing Dependencies</Text>
      <Text style={styles.p}><Tag label="ERROR" color="red" /> Module not found errors during build</Text>
      <Text style={styles.p}>Fix: npm install (or npm ci for clean install)</Text>
    </Page>

    {/* 10. Troubleshooting */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>10. Troubleshooting Guide</Text>

      <Text style={styles.h3}>App won't start (npm run dev)</Text>
      <Bullet>Check PostgreSQL is running: `psql postgresql://kirantej@localhost:5432/quotation_app`</Bullet>
      <Bullet>Check .env exists with required vars: DATABASE_URL, AUTH_SECRET</Bullet>
      <Bullet>Run `npm install` to ensure node_modules are installed</Bullet>
      <Bullet>Run `npx prisma generate` to generate Prisma client</Bullet>
      <Bullet>Run `npm run db:migrate` to apply schema changes</Bullet>

      <Text style={styles.h3}>Build fails on Vercel</Text>
      <Bullet>Ensure all env vars are set in Vercel project dashboard</Bullet>
      <Bullet>Check build logs for specific error</Bullet>
      <Bullet>Run `npm run build` locally to reproduce</Bullet>
      <Bullet>Prisma client generated at build time via postinstall hook</Bullet>
      <Bullet>Database migrations run via vercel-build script before next build</Bullet>

      <Text style={styles.h3}>Login/Register not working</Text>
      <Bullet>Check AUTH_SECRET is set consistently across environments</Bullet>
      <Bullet>Check NEXTAUTH_URL matches your deployment URL</Bullet>
      <Bullet>For register, check rate limit (5/min per IP)</Bullet>

      <Text style={styles.h3}>Google Sheets dashboard blank</Text>
      <Bullet>Verify all 4 GOOGLE_SHEETS_* vars are set in .env</Bullet>
      <Bullet>Check service account has read access to the sheet</Bullet>
      <Bullet>Verify sheet column headers match InvoiceRow interface</Bullet>

      <Text style={styles.h3}>PDF download fails</Text>
      <Bullet>Check @react-pdf/renderer is installed</Bullet>
      <Bullet>Font registration: API routes use renderToStream</Bullet>
      <Bullet>May need to check browser console for download errors</Bullet>
    </Page>

    {/* 11. Environment Variables */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>11. Environment Variables</Text>

      <View style={styles.table}>
        {[
          ["DATABASE_URL", "PostgreSQL connection string", "Required", "postgresql://user@localhost:5432/quotation_app"],
          ["AUTH_SECRET", "NextAuth JWT encryption key", "Required", "openssl rand -base64 32"],
          ["GOOGLE_SHEETS_CLIENT_EMAIL", "GCP service account email", "Optional", "sa@project.iam.gserviceaccount.com"],
          ["GOOGLE_SHEETS_PRIVATE_KEY", "GCP service account private key", "Optional", "-----BEGIN PRIVATE KEY-----"],
          ["GOOGLE_SHEET_ID", "Google Spreadsheet ID", "Optional", "abc123...xyz"],
          ["GOOGLE_SHEETS_RANGE", "Sheet range (default Sheet1)", "Optional", "Sheet1"],
        ].map(([varName, desc, required, example], i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableCellAlt]}>
            <Text style={[styles.tableCell, { fontFamily: "Courier", fontSize: 7, flex: 0.25 }]}>{varName}</Text>
            <Text style={[styles.tableCell, { fontSize: 8, flex: 0.3 }]}>{desc}</Text>
            <Text style={[styles.tableCell, { fontSize: 8, flex: 0.15 }]}>{required}</Text>
            <Text style={[styles.tableCell, { fontFamily: "Courier", fontSize: 7, flex: 0.3 }]}>{example}</Text>
          </View>
        ))}
      </View>
    </Page>

    {/* 12. Deployment */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.h1}>12. Deployment (Vercel)</Text>

      <Text style={styles.h3}>Pre-deploy Checklist</Text>
      <Bullet>Set all 6 env vars in Vercel dashboard</Bullet>
      <Bullet>Push to GitHub/GitLab and connect to Vercel</Bullet>
      <Bullet>Build command: vercel-build (prisma migrate deploy + next build)</Bullet>
      <Bullet>Node.js version {">"}= 20 (set in package.json engines)</Bullet>
      <Bullet>PostgreSQL database must be reachable from Vercel (use hosted DB like Neon, Railway, or AWS RDS)</Bullet>

      <Text style={styles.h3}>Build Process</Text>
      <Bullet>1. npm install (includes postinstall: prisma generate)</Bullet>
      <Bullet>2. npx prisma migrate deploy (applies pending migrations)</Bullet>
      <Bullet>3. next build (production build)</Bullet>
      <Bullet>4. Deploy to Vercel edge network</Bullet>

      <Text style={styles.h3}>Post-deploy</Text>
      <Bullet>Run `npm run db:seed` locally (or on a one-off dyno) to create seed users</Bullet>
      <Bullet>Configure custom domain in Vercel dashboard</Bullet>
      <Bullet>Set up Google Sheets service account (share sheet with service account email)</Bullet>
    </Page>
  </Document>
)

async function main() {
  const blob = await pdf(<Doc />).toBlob()
  const buffer = Buffer.from(await blob.arrayBuffer())
  await writeFile("QuotationFlow_Guide.pdf", buffer)
  console.log("✅ PDF generated: QuotationFlow_Guide.pdf")
}

main().catch(console.error)
