// Who may hold a Tech Day admin session.
//
// Firebase Auth alone is NOT authorization here: the Firebase project behind this
// site is shared with other 434 apps and has public email/password sign-up
// enabled, so anyone can obtain a valid ID token for it. Admin access therefore
// requires, on top of a valid token:
//
//   - a verified email (`email_verified === true`), and
//   - either the email is listed in the ADMIN_EMAILS env var (comma-separated,
//     case-insensitive), or the user signed in with Google on a 434media.com
//     Workspace account.
//
// Deny by default: no email, an unverified email, or an unset ADMIN_EMAILS
// (for anyone outside the Workspace domain) means no access.
//
// Pure (no Firebase imports) so it can be reasoned about and checked in isolation.

export const ALLOWED_GOOGLE_DOMAIN = "434media.com"

export interface AdminIdentityClaims {
  email?: string | null
  email_verified?: boolean
  firebase?: { sign_in_provider?: string }
}

export function adminEmailAllowlist(raw: string | undefined = process.env.ADMIN_EMAILS): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAllowedAdmin(
  claims: AdminIdentityClaims,
  allowlist: string[] = adminEmailAllowlist(),
): boolean {
  const email = claims.email?.trim().toLowerCase()
  if (!email) return false
  if (claims.email_verified !== true) return false

  if (allowlist.includes(email)) return true

  const provider = claims.firebase?.sign_in_provider
  const domain = email.split("@")[1]
  if (provider === "google.com" && domain === ALLOWED_GOOGLE_DOMAIN) return true

  return false
}
