"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Login failed")
        return
      }
      router.push("/")
      router.refresh()
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#2A3347] via-[#1E2835] to-[#141A26] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://vvetransformers.com/assets/img/banner/1.jpg')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141A26]/90 via-[#1E2835]/50 to-transparent" />
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6">
            <span className="text-2xl font-bold text-primary">VV</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            VVE Transformers
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Powering India since 1990 — quotation and invoice management system for transformer manufacturing and distribution.
          </p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
              VV
            </div>
            <span className="text-lg font-bold text-foreground">VVE Transformers</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="input"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-stroke bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted mb-2">Sample credentials</p>
            <div className="space-y-1.5 text-xs text-muted">
              <p><span className="text-foreground font-medium">CEO:</span> kktej3d@gmail.com / password123</p>
              <p><span className="text-foreground font-medium">MD1:</span> md1@vve.com / password123</p>
              <p><span className="text-foreground font-medium">MD2:</span> md2@vve.com / password123</p>
              <p><span className="text-foreground font-medium">User:</span> user@vve.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}