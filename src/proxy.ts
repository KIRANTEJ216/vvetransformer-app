import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SECRET = process.env.SESSION_SECRET || "dev-secret"
const COOKIE_NAME = "session"
const PUBLIC_ROUTES = ["/login"]

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function verifyToken(token: string): Promise<object | null> {
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [encoded, sig] = parts

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(encoded))
  const expectedArr = new Uint8Array(expectedSig)
  const actualArr = fromBase64Url(sig)

  if (expectedArr.length !== actualArr.length) return null
  let match = 0
  for (let i = 0; i < expectedArr.length; i++) match |= expectedArr[i] ^ actualArr[i]
  if (match !== 0) return null

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded)))
    if (payload.exp && Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.redirect(new URL("/login", request.url))

  const payload = await verifyToken(token)
  if (!payload) return NextResponse.redirect(new URL("/login", request.url))

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)"],
}
