"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Receipt,
  TrendingUp,
  BarChart3,
  Truck,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

function getNavItems(role: string) {
  const isMd = role === "MD1" || role === "MD2"
  const isCeo = role === "CEO"

  return [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/quotations", label: "Quotations", icon: FileText },
    ...(isCeo
      ? [
          { href: "/financial", label: "Actual Revenue", icon: TrendingUp },
          { href: "/financial/forecast", label: "Forecast", icon: BarChart3 },
          { href: "/financial/delivery-map", label: "Delivery Map", icon: Truck },
        ]
      : []),
    ...(isMd ? [{ href: "/approvals", label: "Approvals", icon: CheckSquare }] : []),
    { href: "/invoices", label: "Invoices", icon: Receipt },
  ]
}

function findBestMatch(navItems: { href: string }[], currentPath: string) {
  const sorted = [...navItems].sort((a, b) => b.href.length - a.href.length)
  return sorted.find(
    (n) => currentPath === n.href || (n.href !== "/" && currentPath.startsWith(n.href + "/"))
  )
}

export function Sidebar({ currentPath, userRole }: { currentPath: string; userRole: string }) {
  const navItems = getNavItems(userRole)
  const bestMatch = findBestMatch(navItems, currentPath)

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-1 bg-brand">
        <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm text-white font-bold text-sm">
            VV
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">
              QuotationFlow
            </span>
            <p className="text-[10px] text-blue-200/70 -mt-0.5">
              VVE Transformers
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = bestMatch?.href === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-blue-200/80 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/10 px-6 py-4">
          <div className="flex items-center gap-2 text-blue-300/60">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-[11px]">Powering India Since 1990</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
