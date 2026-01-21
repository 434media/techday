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
    
    console.log("[Session] Cookie present:", !!sessionToken)
    console.log("[Session] SECRET length:", SESSION_SECRET.length, "starts with:", SESSION_SECRET.substring(0, 5))
    
    if (!sessionToken) return null
    
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8")
    const lastDotIndex = decoded.lastIndexOf(".")
    if (lastDotIndex === -1) {
      console.log("[Session] No dot separator found")
      return null
    }
    const data = decoded.substring(0, lastDotIndex)
    const signature = decoded.substring(lastDotIndex + 1)
    
    console.log("[Session] Token data:", data.substring(0, 50))
    
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("hex")
    
    console.log("[Session] Expected sig:", expectedSignature.substring(0, 20))
    console.log("[Session] Received sig:", signature?.substring(0, 20))
    
    if (signature !== expectedSignature) {
      console.log("[Session] Signature mismatch")
      return null
    }
    
    const payload = JSON.parse(data)
    if (payload.exp < Date.now()) {
      console.log("[Session] Token expired")
      return null
    }
    
    const admin = getAdminByEmail(payload.email)
    if (!admin) {
      console.log("[Session] Admin not found for:", payload.email)
      return null
    }
    
    console.log("[Session] Valid session for:", admin.email)
    return {
      email: admin.email,
      name: admin.name,
      role: admin.role,
    }
  } catch (error) {
    console.log("[Session] Error:", error)
    return null
  }
}

// Check if session has specific permission
export async function sessionHasPermission(permission: AdminPermission): Promise<boolean>
export async function sessionHasPermission(permission: AdminPermission, session: SessionUser | null): Promise<boolean>
export async function sessionHasPermission(permission: AdminPermission, session?: SessionUser | null): Promise<boolean> {
  const currentSession = session !== undefined ? session : await verifyAdminSession()
  if (!currentSession) return false
  return checkPermission(currentSession.email, permission)
}
