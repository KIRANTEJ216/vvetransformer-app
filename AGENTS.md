<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

See `/Users/kirantej/Documents/AGENTS.md` for full project docs, commands, approval flow, and code conventions.

## Recent additions (Jun 2026)

- **CEO role** added to schema (CEO, USER, MD1, MD2). Seed: `ceo@example.com` / `password123`
- **Financial dashboard** at `/financial` — CEO-only, pulls from Google Sheets (invoice/GST data)
- **Nav role-gated**: "Approvals" shown to MD1/MD2 only. "Financial" shown to CEO only.
- Dashboard stats are live (DB queries), not hardcoded.
- Root page conflict resolved — `app/page.tsx` removed; `(dashboard)/page.tsx` serves `/`.
- **Quotation form** is now a single-page layout (not multi-step stepper). All sections (Customer, Items, Pricing, Summary) visible at once with Save Draft + Submit buttons at bottom. Step files removed. All logic in `quotation-stepper.tsx`.
- **Approval flow changed**: either MD1 or MD2 approving is enough. On submit, both MDs get a pending approval. The first MD to approve triggers APPROVED + Invoice auto-creation; the other's approval is auto-skipped.
- **PDF generation** wired for both quotations and invoices. Download PDF button on quotation detail page and invoice list. Uses `@react-pdf/renderer` with VVE Transformers branding.

### Google Sheets setup
For the financial dashboard to work, add to `.env`:
```
GOOGLE_SHEETS_CLIENT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_SHEETS_RANGE=Sheet1
```
If unset, the dashboard shows a config warning and falls back to internal DB stats.
