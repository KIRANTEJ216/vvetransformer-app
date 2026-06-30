"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Receipt,
  TrendingUp,
  BarChart3,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"

function getNavItems(role: string) {
  const isMd = role === "MD1" || role === "MD2"
  const isCeo = role === "CEO"

  return [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/quotations", label: "Quotes", icon: FileText },
    ...(isCeo
      ? [
          { href: "/financial", label: "Actuals", icon: TrendingUp },
          { href: "/financial/forecast", label: "Forecast", icon: BarChart3 },
          { href: "/financial/delivery-map", label: "Map", icon: Truck },
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

export function BottomNav({ userRole }: { userRole: string }) {
  const navItems = getNavItems(userRole)
  const pathname = usePathname()
  const bestMatch = findBestMatch(navItems, pathname)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white lg:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = bestMatch?.href === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-3 text-xs font-medium transition-colors",
                isActive
                  ? "text-[#1a365d]"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
