import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase/admin"
import type { AdminPermission } from "@/lib/firebase/collections"
import { isAllowedAdmin } from "@/lib/admin/allowlist"

// Default permissions for authenticated admins
const DEFAULT_PERMISSIONS: AdminPermission[] = [
  "registrations",
  "newsletter", 
  "pitches",
  "speakers",
  "schedule",
  "sponsors",
  "users"
]

export interface SessionUser {
  email: string
  name: string
  role: "admin"
  permissions: AdminPermission[]
  uid: string
}

// Verify admin session from Firebase session cookie
// Firebase Auth proves identity; lib/admin/allowlist.ts decides who is an admin
export async function verifyAdminSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("admin_session")?.value
    
    if (!sessionCookie) return null
    
    // Verify the session cookie with Firebase
    let decodedClaims
    try {
      decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
    } catch {
      return null
    }
    
    const email = decodedClaims.email
    if (!email) return null
    
    // Firebase Auth is shared and open to public sign-up, so a valid session is
    // not enough: re-apply the admin allowlist on every request (deny by default).
    if (!isAllowedAdmin(decodedClaims)) return null
    
    return {
      email,
      name: decodedClaims.name || email.split("@")[0],
      role: "admin",
      permissions: DEFAULT_PERMISSIONS,
      uid: decodedClaims.uid,
    }
  } catch (error) {
    console.error("[Session] Error:", error)
    return null
  }
}

// Check if session has specific permission
export async function sessionHasPermission(permission: AdminPermission): Promise<boolean>
export async function sessionHasPermission(permission: AdminPermission, session: SessionUser | null): Promise<boolean>
export async function sessionHasPermission(permission: AdminPermission, session?: SessionUser | null): Promise<boolean> {
  const currentSession = session !== undefined ? session : await verifyAdminSession()
  if (!currentSession) return false
  // All authenticated users have all permissions
  return currentSession.permissions.includes(permission)
}

// Check if session has role or higher (simplified - all users are admins)
export async function sessionHasRole(requiredRole: "admin" | "viewer" | "editor" | "superadmin"): Promise<boolean> {
  const session = await verifyAdminSession()
  if (!session) return false
  
  // All authenticated users are admins, which is equal to or higher than most roles
  const roleHierarchy = ["viewer", "editor", "admin", "superadmin"]
  const userRoleIndex = roleHierarchy.indexOf(session.role)
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)
  
  return userRoleIndex >= requiredRoleIndex
}
