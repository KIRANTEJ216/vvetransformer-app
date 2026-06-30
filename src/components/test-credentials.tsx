"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react"

const accounts = [
  { role: "USER", email: "alice@example.com", name: "Alice Johnson" },
  { role: "CEO", email: "ceo@example.com", name: "Kiran Tej (CEO)" },
  { role: "MD1", email: "md1@example.com", name: "Bob Smith (MD1)" },
  { role: "MD2", email: "md2@example.com", name: "Carol Williams (MD2)" },
]

const PASSWORD = "password123"

export function TestCredentials() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-[#1a1a2e] text-white px-4 py-2 text-xs font-medium shadow-lg hover:bg-[#2d2d44] transition-all"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        Test Accounts
      </button>
      {open && (
        <div className="mt-2 rounded-xl bg-[#1a1a2e]/95 backdrop-blur-md border border-[#2d2d44] p-3 shadow-2xl">
          <p className="text-[10px] text-[#c9a84c] uppercase tracking-wider font-semibold mb-2 px-1">
            All accounts: <span className="text-white/80 normal-case tracking-normal">password123</span>
          </p>
          <div className="space-y-1.5">
            {accounts.map((a) => (
              <div key={a.role} className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                      a.role === "CEO" ? "bg-[#c9a84c]" :
                      a.role === "MD1" ? "bg-purple-400" :
                      a.role === "MD2" ? "bg-amber-400" :
                      "bg-gray-400"
                    }`} />
                    <span className="font-medium text-white/90">{a.role}</span>
                  </div>
                  <p className="text-white/50 truncate">{a.email}</p>
                </div>
                <button
                  onClick={() => copy(a.email, a.email)}
                  className="shrink-0 rounded-md p-1.5 text-white/40 hover:text-[#c9a84c] hover:bg-white/10 transition-colors"
                  title="Copy email"
                >
                  {copied === a.email ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-3 py-2 text-xs mt-1">
              <span className="text-white/70">Password</span>
              <button
                onClick={() => copy(PASSWORD, "password")}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-white/50 hover:text-[#c9a84c] hover:bg-white/10 transition-colors"
              >
                {copied === "password" ? (
                  <><Check className="h-3 w-3 text-green-400" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3" /> {PASSWORD}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
