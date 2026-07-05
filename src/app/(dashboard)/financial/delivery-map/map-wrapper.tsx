"use client"

import dynamic from "next/dynamic"
import type { DeliveryLocation } from "./page"

const DeliveryMapClient = dynamic(
  () => import("./delivery-map-client").then((m) => m.DeliveryMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="card">
        <div className="card-body text-center py-12 text-muted">
          <p className="text-sm">Loading delivery map...</p>
        </div>
      </div>
    ),
  }
)

export function MapWrapper({
  office,
  locations,
}: {
  office: { lat: number; lng: number }
  locations: DeliveryLocation[]
}) {
  return <DeliveryMapClient office={office} locations={locations} />
}
