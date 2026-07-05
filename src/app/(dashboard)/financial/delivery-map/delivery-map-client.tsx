"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { cn } from "@/lib/utils"
import type { DeliveryLocation } from "./page"

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

function officeIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;background:#1a365d;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);">V</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function deliveryIcon(count: number) {
  const size = Math.min(18 + count * 4, 44)
  const colors = ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"]
  const color = colors[Math.min(count - 1, colors.length - 1)]
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${Math.max(10, size / 2.5)}px;font-weight:bold;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export function DeliveryMapClient({
  office,
  locations,
}: {
  office: { lat: number; lng: number }
  locations: DeliveryLocation[]
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [selected, setSelected] = useState<DeliveryLocation | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      scrollWheelZoom: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map)

    const officeMarker = L.marker([office.lat, office.lng], { icon: officeIcon() })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:sans-serif;min-width:180px;">
          <p style="font-weight:700;margin:0 0 4px;font-size:14px;color:#1a365d;">🏭 VVE Transformers</p>
          <p style="margin:0;font-size:12px;color:#666;">Plot No.62/2, C.I.E, Gandhinagar, Balanagar</p>
          <p style="margin:0;font-size:12px;color:#666;">Hyderabad, Telangana</p>
        </div>
      `)

    const markers: L.Marker[] = []
    const polylines: L.Polyline[] = []

    locations.forEach((loc) => {
      const polyline = L.polyline(
        [
          [office.lat, office.lng],
          [loc.lat, loc.lng],
        ],
        {
          color: "#0A4D9B",
          weight: 1.5,
          opacity: 0.25,
          dashArray: "6, 6",
        }
      ).addTo(map)
      polylines.push(polyline)

      const marker = L.marker([loc.lat, loc.lng], { icon: deliveryIcon(loc.deliveries) })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:180px;">
            <p style="font-weight:700;margin:0 0 4px;font-size:14px;color:#059669;">
              📍 ${loc.city.charAt(0).toUpperCase() + loc.city.slice(1)}
            </p>
            <p style="margin:0 0 8px;font-size:11px;color:#888;">${loc.state.charAt(0).toUpperCase() + loc.state.slice(1)}</p>
            <div style="font-size:12px;color:#444;line-height:1.6;">
              <p style="margin:0;"><strong>Deliveries:</strong> ${loc.deliveries}</p>
              <p style="margin:0;"><strong>Total Value:</strong> ₹${loc.totalValue.toLocaleString("en-IN")}</p>
              <p style="margin:0;"><strong>Avg Distance:</strong> ${Math.round(loc.avgDistanceKm)} km</p>
              ${loc.vehicles.length ? `<p style="margin:0;"><strong>Vehicles:</strong> ${loc.vehicles.join(", ")}</p>` : ""}
              ${loc.buyers.length ? `<p style="margin:0;"><strong>Buyers:</strong> ${loc.buyers.slice(0, 3).join(", ")}${loc.buyers.length > 3 ? "…" : ""}</p>` : ""}
            </div>
          </div>
        `)
        .on("click", () => setSelected(loc))

      markers.push(marker)
    })

    if (locations.length > 0) {
      const allCoords = [officeMarker, ...markers].map((m) => m.getLatLng())
      const bounds = L.latLngBounds(allCoords)
      map.fitBounds(bounds, { padding: [50, 50] })
    }

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [office, locations])

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden">
        <div ref={mapRef} className="h-[500px] w-full" />

        <div className="flex items-center justify-between px-5 py-3 bg-card border-t border-stroke">
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-[#1a365d]" />
              Office (Hyderabad)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
              Delivery Location
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-5" style={{ borderTop: "2px dashed #0A4D9B", opacity: 0.5 }} />
              Route
            </span>
            <span className="text-muted">
              {locations.length} cities · {locations.reduce((s, l) => s + l.deliveries, 0)} deliveries
            </span>
          </div>
        </div>
      </div>

      {selected && (
        <div className="card border-emerald-200">
          <div className="card-body">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground capitalize">
                  📍 {selected.city}
                </h3>
                <p className="text-sm text-muted capitalize">{selected.state}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-muted hover:text-foreground text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-muted">Deliveries</p>
                <p className="text-lg font-bold text-foreground">{selected.deliveries}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Total Value</p>
                <p className="text-lg font-bold text-foreground">
                  ₹{selected.totalValue.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">Avg Distance</p>
                <p className="text-lg font-bold text-foreground">
                  {Math.round(selected.avgDistanceKm)} km
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">Vehicles</p>
                <p className="text-lg font-bold text-foreground">
                  {selected.vehicles.length}
                </p>
              </div>
            </div>
            {selected.vehicles.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stroke">
                <p className="text-xs text-muted mb-2 font-medium">Vehicles Used</p>
                <div className="flex flex-wrap gap-2">
                  {selected.vehicles.map((v) => (
                    <span key={v} className="badge badge-blue text-xs">{v}</span>
                  ))}
                </div>
              </div>
            )}
            {selected.buyers.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-muted mb-2 font-medium">Buyers</p>
                <div className="flex flex-wrap gap-2">
                  {selected.buyers.map((b) => (
                    <span key={b} className="badge badge-amber text-xs">{b}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
