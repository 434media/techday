// Who may hold a Tech Day admin session.
//
// Firebase Auth alone is NOT authorization here: the Firebase project behind this
// site is shared with other 434 apps and has public email/password sign-up
// enabled, so anyone can obtain a valid ID token for it. Admin access therefore
// requires, on top of a valid token, BOTH:
//
//   - a verified email (`email_verified === true`), and
//   - that email listed in the ADMIN_EMAILS env var (comma-separated,
//     case-insensitive).
//
// There is deliberately no email-domain shortcut: Firebase ID tokens carry no
// Google Workspace `hd` claim, so "a Google sign-in on @434media.com" cannot be
// told apart from any other Google account using that address. Every admin,
// 434 staff included, is listed explicitly.
//
// Deny by default: no email, an unverified email, or an unset/empty ADMIN_EMAILS
// means no access.
//
// Pure (no Firebase imports) so it can be reasoned about and checked in isolation.

export interface AdminIdentityClaims {
  email?: string | null
  email_verified?: boolean
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
  return allowlist.includes(email)
}
