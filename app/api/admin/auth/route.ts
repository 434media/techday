import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase/admin"
import type { AdminPermission } from "@/lib/firebase/collections"
import { isAllowedAdmin } from "@/lib/admin/allowlist"

export const dynamic = "force-dynamic"

// Firebase Authentication-based admin access.
// Firebase Auth proves identity only: the project is shared with other apps and
// allows public sign-up. Who is an admin is decided by lib/admin/allowlist.ts
// (a verified email that is listed in ADMIN_EMAILS; no domain shortcut).

const SESSION_COOKIE_NAME = "admin_session"
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

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

// POST - Verify Firebase ID token and create session
export async function POST(request: Request) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      )
    }

    const idToken = authHeader.substring(7) // Remove "Bearer "

    // Verify the Firebase ID token
    let decodedToken
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken)
    } catch (error) {
      console.error("Token verification failed:", error)
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    const email = decodedToken.email
    if (!email) {
      return NextResponse.json(
        { error: "Email not found in token" },
        { status: 401 }
      )
    }

    // Deny by default: a valid Firebase token is not admin access
    if (!isAllowedAdmin(decodedToken)) {
      return NextResponse.json(
        { error: "This account is not authorized for admin access" },
        { status: 403 }
      )
    }

    // Create a session cookie for subsequent requests
    const expiresIn = SESSION_DURATION * 1000 // Convert to milliseconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    })

    // Get display name from token
    const displayName = decodedToken.name || email.split("@")[0]

    // Return admin info
    return NextResponse.json({
      success: true,
      user: {
        email,
        name: displayName,
        role: "admin" as const,
        permissions: DEFAULT_PERMISSIONS,
      },
    })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}

// GET - Check current session
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false })
    }

    // Verify the session cookie
    let decodedClaims
    try {
      decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true)
    } catch {
      return NextResponse.json({ authenticated: false })
    }

    const email = decodedClaims.email
    if (!email) {
      return NextResponse.json({ authenticated: false })
    }

    // Re-apply the allowlist so removed admins lose access immediately
    if (!isAllowedAdmin(decodedClaims)) {
      return NextResponse.json({ authenticated: false })
    }

    const displayName = decodedClaims.name || email.split("@")[0]

    return NextResponse.json({
      authenticated: true,
      user: {
        email,
        name: displayName,
        role: "admin" as const,
        permissions: DEFAULT_PERMISSIONS,
      },
    })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ authenticated: false })
  }
}

// DELETE - Logout / Revoke session
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (sessionCookie) {
      // Optionally revoke refresh tokens for extra security
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
        await adminAuth.revokeRefreshTokens(decodedClaims.sub)
      } catch {
        // Ignore verification errors during logout
      }
    }

    // Clear the session cookie
    cookieStore.delete(SESSION_COOKIE_NAME)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    )
  }
}
