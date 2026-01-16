// Admin Authentication Configuration
// Security Question + PIN based access control
// Admin users are configured via ADMIN_USERS environment variable

export type AdminRole = "superadmin" | "admin" | "editor" | "viewer"

export interface AdminUser {
  email: string
  role: AdminRole
  name: string
  permissions: AdminPermission[]
  securityQuestion: string
  securityAnswer: string // stored lowercase for comparison
  pin: string
}

// Public admin info (without sensitive data)
export interface PublicAdminUser {
  email: string
  role: AdminRole
  name: string
  permissions: AdminPermission[]
}

export type AdminPermission = 
  | "registrations"
  | "newsletter"
  | "pitches"
  | "speakers"
  | "schedule"
  | "sponsors"
  | "users"

// Role-based default permissions
const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  superadmin: ["registrations", "newsletter", "pitches", "speakers", "schedule", "sponsors", "users"],
  admin: ["registrations", "newsletter", "pitches", "speakers", "schedule", "sponsors"],
  editor: ["speakers", "schedule", "sponsors"],
  viewer: [],
}

/**
 * Parse admin users from environment variable
 * Format: email|role|name|question|answer|pin,email2|role|name|question|answer|pin
 * 
 * Example:
 * ADMIN_USERS=jesse@434media.com|superadmin|Jesse|What year was Tech Day founded?|2023|1234,team@example.com|editor|Team|Favorite color?|blue|5678
 */
function parseAdminUsers(): AdminUser[] {
  const envValue = process.env.ADMIN_USERS
  
  if (!envValue) {
    console.warn("⚠️ ADMIN_USERS environment variable not set. No admins configured.")
    return []
  }

  try {
    return envValue.split(",").map((entry) => {
      const [email, role, name, question, answer, pin] = entry.trim().split("|")
      
      if (!email || !role || !name || !question || !answer || !pin) {
        console.error(`Invalid admin entry: ${entry}`)
        return null
      }

      const validRole = ["superadmin", "admin", "editor", "viewer"].includes(role) 
        ? role as AdminRole 
        : "viewer"

      return {
        email: email.toLowerCase().trim(),
        role: validRole,
        name: name.trim(),
        permissions: ROLE_PERMISSIONS[validRole],
        securityQuestion: question.trim(),
        securityAnswer: answer.toLowerCase().trim(),
        pin: pin.trim(),
      }
    }).filter((admin): admin is AdminUser => admin !== null)
  } catch (error) {
    console.error("Error parsing ADMIN_USERS:", error)
    return []
  }
}

// Cache parsed admins
let cachedAdmins: AdminUser[] | null = null

function getAdminUsers(): AdminUser[] {
  if (cachedAdmins === null) {
    cachedAdmins = parseAdminUsers()
  }
  return cachedAdmins
}

// Permission descriptions for UI
export const PERMISSION_LABELS: Record<AdminPermission, string> = {
  registrations: "Event Registrations",
  newsletter: "Newsletter Subscribers",
  pitches: "Pitch Submissions",
  speakers: "Speaker Management",
  schedule: "Schedule Management",
  sponsors: "Sponsor Management",
  users: "User Management",
}

// Role hierarchy (higher index = more permissions)
export const ROLE_HIERARCHY: AdminRole[] = ["viewer", "editor", "admin", "superadmin"]

// Check if email is approved
export function isApprovedAdmin(email: string): boolean {
  return getAdminUsers().some(
    (admin) => admin.email.toLowerCase() === email.toLowerCase()
  )
}

// Get admin user by email (full data - server only)
export function getAdminByEmail(email: string): AdminUser | null {
  return (
    getAdminUsers().find(
      (admin) => admin.email.toLowerCase() === email.toLowerCase()
    ) || null
  )
}

// Get public admin info (safe to send to client)
export function getPublicAdminByEmail(email: string): PublicAdminUser | null {
  const admin = getAdminByEmail(email)
  if (!admin) return null
  
  return {
    email: admin.email,
    role: admin.role,
    name: admin.name,
    permissions: admin.permissions,
  }
}

// Get security question for an email (for login form)
export function getSecurityQuestion(email: string): string | null {
  const admin = getAdminByEmail(email)
  return admin?.securityQuestion || null
}

// Verify security answer and PIN
export function verifyCredentials(email: string, answer: string, pin: string): boolean {
  const admin = getAdminByEmail(email)
  if (!admin) return false
  
  const normalizedAnswer = answer.toLowerCase().trim()
  const normalizedPin = pin.trim()
  
  return admin.securityAnswer === normalizedAnswer && admin.pin === normalizedPin
}

// Check if user has specific permission
export function hasPermission(email: string, permission: AdminPermission): boolean {
  const admin = getAdminByEmail(email)
  if (!admin) return false
  
  // Superadmin has all permissions
  if (admin.role === "superadmin") return true
  
  return admin.permissions.includes(permission)
}

// Check if user has role or higher
export function hasRole(email: string, requiredRole: AdminRole): boolean {
  const admin = getAdminByEmail(email)
  if (!admin) return false
  
  const userRoleIndex = ROLE_HIERARCHY.indexOf(admin.role)
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole)
  
  return userRoleIndex >= requiredRoleIndex
}

// Clear cached admins (useful for testing or env var changes)
export function clearAdminCache(): void {
  cachedAdmins = null
}
