import { cookies } from "next/headers"
import { isApprovedAdmin, getAdminByEmail, hasPermission as checkPermission, type AdminPermission } from "@/lib/admin/config"
import crypto from "crypto"

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "change-this-in-production"

export interface SessionUser {
  email: string
  name: string
  role: string
}

// Verify admin session from cookies
export async function verifyAdminSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value
    
    if (!sessionToken) return null
    
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8")
    const [data, signature] = decoded.split(".")
    
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("hex")
    
    if (signature !== expectedSignature) return null
    
    const payload = JSON.parse(data)
    if (payload.exp < Date.now()) return null
    
    const admin = getAdminByEmail(payload.email)
    if (!admin) return null
    
    return {
      email: admin.email,
      name: admin.name,
      role: admin.role,
    }
  } catch {
    return null
  }
}

// Check if session has specific permission
export async function sessionHasPermission(permission: AdminPermission): Promise<boolean> {
  const session = await verifyAdminSession()
  if (!session) return false
  return checkPermission(session.email, permission)
}
