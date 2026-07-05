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
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"

function getNavItems(role: string) {
  const isUser = role === "USER"
  const isMd = role === "MD1" || role === "MD2"
  const isCeo = role === "CEO"

  return [
    { section: "MAIN MENU" as const, items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      ...(isUser ? [{ href: "/quotations", label: "Quotations", icon: FileText }] : []),
      ...(isCeo || isMd ? [{ href: "/approvals", label: "Approvals", icon: CheckSquare }] : []),
      { href: "/invoices", label: "Invoices", icon: Receipt },
    ]},
    ...(isCeo ? [{
      section: "FINANCIALS" as const, items: [
        { href: "/financial", label: "Actual Revenue", icon: TrendingUp },
        { href: "/financial/forecast", label: "Forecast", icon: BarChart3 },
        { href: "/financial/delivery-map", label: "Delivery Map", icon: Truck },
      ]
    }] : []),
  ]
}

function findBestMatch(navItems: { items: { href: string }[] }[], currentPath: string) {
  const allItems = navItems.flatMap(g => g.items)
  const sorted = [...allItems].sort((a, b) => b.href.length - a.href.length)
  return sorted.find(
    (n) => currentPath === n.href || (n.href !== "/" && currentPath.startsWith(n.href + "/"))
  )
}

const roleBadgeMap: Record<string, string> = {
  CEO: "bg-[#8C57FF]/20 text-[#8C57FF]",
  MD1: "bg-purple-500/20 text-purple-300",
  MD2: "bg-amber-500/20 text-amber-300",
  USER: "bg-gray-500/20 text-gray-300",
}

export function Sidebar({ currentPath, userRole }: { currentPath: string; userRole: string }) {
  const navGroups = getNavItems(userRole)
  const bestMatch = findBestMatch(navGroups, currentPath)

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-1 bg-sidebar">
        <div className="flex h-16 items-center gap-3 px-6 border-b border-stroke-dark">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm shadow-sm">
            VV
          </div>
          <div>
            <span className="text-base font-bold text-sidebar-text-active tracking-tight">
              QuotationFlow
            </span>
            <p className="text-[10px] text-sidebar-text -mt-0.5">
              VVE Transformers
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.section} className="mb-6">
              <h2 className="mb-5 px-2 text-[11px] font-semibold uppercase tracking-widest text-sidebar-text">
                {group.section}
              </h2>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = bestMatch?.href === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-sidebar-hover text-sidebar-text-active"
                          : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-sidebar-text group-hover:text-sidebar-text-active")} />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-stroke-dark px-5 py-4 space-y-3">
          <div className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
            roleBadgeMap[userRole] || "bg-gray-500/20 text-gray-300"
          )}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {userRole}
          </div>
          <div className="flex items-center gap-2 text-sidebar-text">
            <Zap className="h-3 w-3" />
            <span className="text-[10px]">Powering India Since 1990</span>
          </div>
        </div>
      </div>
    </aside>
  )
}