import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { fetchInvoiceData } from "@/lib/sheets"
import { extractCity, getOfficeLocation, type CityCoord } from "@/lib/indian-cities"
import { DeliveryMapClient } from "./delivery-map-client"

export interface DeliveryLocation {
  city: string
  state: string
  lat: number
  lng: number
  deliveries: number
  totalValue: number
  vehicles: string[]
  avgDistanceKm: number
  invoices: string[]
  buyers: string[]
}

export default async function DeliveryMapPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "CEO") redirect("/")

  const sheetData = await fetchInvoiceData()
  const office = getOfficeLocation()

  const cityMap = new Map<string, DeliveryLocation>()

  for (const row of sheetData.rows) {
    const address = row.consigneeAddress || row.buyerAddress
    const coord = extractCity(address)
    if (!coord) continue

    const key = `${coord.lat},${coord.lng}`
    const existing = cityMap.get(key)

    if (existing) {
      existing.deliveries++
      existing.totalValue += row.invoiceTotal || 0
      existing.avgDistanceKm = (existing.avgDistanceKm + (row.approxDistanceKm || 0)) / 2
      if (row.vehicleNumber && !existing.vehicles.includes(row.vehicleNumber)) {
        existing.vehicles.push(row.vehicleNumber)
      }
      if (row.invoiceNumber) existing.invoices.push(row.invoiceNumber)
      if (row.buyerName && !existing.buyers.includes(row.buyerName)) {
        existing.buyers.push(row.buyerName)
      }
    } else {
      cityMap.set(key, {
        city: coord.city,
        state: coord.state,
        lat: coord.lat,
        lng: coord.lng,
        deliveries: 1,
        totalValue: row.invoiceTotal || 0,
        avgDistanceKm: row.approxDistanceKm || 0,
        vehicles: row.vehicleNumber ? [row.vehicleNumber] : [],
        invoices: row.invoiceNumber ? [row.invoiceNumber] : [],
        buyers: row.buyerName ? [row.buyerName] : [],
      })
    }
  }

  const locations = Array.from(cityMap.values())
  const totalDeliveries = locations.reduce((s, l) => s + l.deliveries, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white text-sm font-bold shadow-sm">
              D
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Delivery Map
              </h1>
              <p className="text-sm text-muted">
                Vehicle distance tracking & transformer delivery locations
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">
            {sheetData.rows.length > 0
              ? `${locations.length} cities · ${totalDeliveries} deliveries`
              : "Google Sheets data"}
          </p>
        </div>
      </div>

      {sheetData.error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
          <span className="font-medium">Google Sheets not connected.</span>{" "}
          {sheetData.error}
        </div>
      )}

      {locations.length > 0 ? (
        <DeliveryMapClient office={office} locations={locations} />
      ) : !sheetData.error ? (
        <div className="card">
          <div className="card-body text-center py-12 text-muted">
            <p className="text-sm">No delivery addresses found in sheet data.</p>
            <p className="text-xs mt-1">Ensure your sheet has consignee_address or buyer_address columns.</p>
          </div>
        </div>
      ) : null}

      {locations.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-foreground">
              Delivery Summary
            </h2>
          </div>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-medium text-muted uppercase">
                  <tr>
                    <th className="text-left px-5 py-3">City</th>
                    <th className="text-left px-5 py-3">State</th>
                    <th className="text-right px-5 py-3">Deliveries</th>
                    <th className="text-right px-5 py-3">Total Value</th>
                    <th className="text-right px-5 py-3">Avg Dist (km)</th>
                    <th className="text-left px-5 py-3">Vehicles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {locations
                    .sort((a, b) => b.deliveries - a.deliveries)
                    .map((loc) => (
                      <tr key={`${loc.lat},${loc.lng}`} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 font-medium text-foreground capitalize">
                          {loc.city}
                        </td>
                        <td className="px-5 py-3 text-muted capitalize">{loc.state}</td>
                        <td className="px-5 py-3 text-right font-medium">{loc.deliveries}</td>
                        <td className="px-5 py-3 text-right">
                          ₹{loc.totalValue.toLocaleString("en-IN")}
                        </td>
                        <td className="px-5 py-3 text-right">{Math.round(loc.avgDistanceKm)}</td>
                        <td className="px-5 py-3 text-muted max-w-[200px] truncate">
                          {loc.vehicles.join(", ") || "—"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-muted py-4 border-t border-gray-100">
        VVE Transformers Pvt. Ltd. · Delivery Map · Data from Google Sheets
      </div>
    </div>
  )
}
