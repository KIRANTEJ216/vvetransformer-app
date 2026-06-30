"use client"

import { useSession, signOut } from "next-auth/react"
import { LogOut, User as UserIcon } from "lucide-react"

const roleBadge: Record<string, string> = {
  USER: "bg-gray-100 text-gray-700",
  CEO: "bg-blue-100 text-blue-700",
  MD1: "bg-purple-100 text-purple-700",
  MD2: "bg-amber-100 text-amber-700",
}

export function TopBar() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
      <div className="lg:hidden">
        <span className="text-base font-semibold text-gray-900">
          QuotationFlow
        </span>
      </div>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <UserIcon className="h-4 w-4" />
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || "User"}
            </p>
            {user?.role && (
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  roleBadge[user.role] || "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="rounded-lg p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
