import { cookies } from "next/headers"
import { prisma } from "./prisma"

const SECRET = process.env.SESSION_SECRET || "dev-secret"
const COOKIE_NAME = "session"

export const SAMPLE_USERS = [
  { email: "ceo@vve.com", password: "password123", name: "Kiran Tej (CEO)", role: "CEO" as const },
  { email: "md1@vve.com", password: "password123", name: "Rajesh Sharma (MD1)", role: "MD1" as const },
  { email: "md2@vve.com", password: "password123", name: "Vikram Patel (MD2)", role: "MD2" as const },
  { email: "user1@vve.com", password: "password123", name: "Priya Singh", role: "USER" as const },
  { email: "user2@vve.com", password: "password123", name: "Amit Kumar", role: "USER" as const },
]

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

async function signToken(payload: object): Promise<string> {
  const encoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)))
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encoded))
  return `${encoded}.${toBase64Url(new Uint8Array(sig))}`
}

async function verifyToken(token: string): Promise<object | null> {
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [encoded, sig] = parts

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const expectedSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encoded))
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

export async function auth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return { user: null }
  const payload = await verifyToken(token) as any
  if (!payload || !payload.id) return { user: null }
  return { user: { id: payload.id, name: payload.name, email: payload.email, role: payload.role } }
}

export async function validateCredentials(email: string, password: string) {
  const match = SAMPLE_USERS.find((u) => u.email === email && u.password === password)
  if (!match) return null

  const dbUser = await prisma.user.upsert({
    where: { email },
    create: { email, name: match.name, role: match.role },
    update: { name: match.name, role: match.role },
  })

  return { id: dbUser.id, name: dbUser.name || "", email: dbUser.email, role: dbUser.role }
}

export async function createSession(user: { id: string; name: string; email: string; role: string }): Promise<string> {
  const payload = { ...user, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }
  return signToken(payload)
}
