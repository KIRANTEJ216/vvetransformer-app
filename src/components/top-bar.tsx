"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface TopBarProps {
  userName?: string | null
  userEmail?: string | null
  userRole?: string | null
}

const roleColors: Record<string, string> = {
  CEO: "bg-primary/20 text-primary",
  MD1: "bg-purple-500/20 text-purple-600",
  MD2: "bg-amber-500/20 text-amber-600",
  USER: "bg-gray-500/20 text-gray-500",
}

export function TopBar({ userName, userEmail, userRole }: TopBarProps) {
  const router = useRouter()

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  const initials = (userName || userEmail || "U")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-card border-b border-stroke px-4 lg:px-8">
      <div className="lg:hidden">
        <span className="text-base font-bold text-foreground">QuotationFlow</span>
      </div>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-tight">
              {userName || userEmail || "User"}
            </p>
            <span className={cn(
              "inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold mt-0.5",
              roleColors[userRole || ""] || "bg-gray-500/20 text-gray-500"
            )}>
              {userRole || "Member"}
            </span>
          </div>
        </div>
        <div className="h-8 w-px bg-dark-4" />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-dark-5 hover:bg-black/[0.04] hover:text-foreground transition-colors"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}