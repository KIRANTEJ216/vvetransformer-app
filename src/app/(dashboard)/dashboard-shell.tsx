"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { TopBar } from "@/components/top-bar"

export function DashboardShell({
  children,
  userRole,
  userName,
  userEmail,
}: {
  children: React.ReactNode
  userRole: string
  userName?: string | null
  userEmail?: string | null
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentPath={pathname} userRole={userRole} />

      <div className="flex flex-col lg:pl-64">
        <TopBar userName={userName} userEmail={userEmail} userRole={userRole} />
        <main className="flex-1 pb-20 lg:pb-8">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      <BottomNav userRole={userRole} />
    </div>
  )
}
