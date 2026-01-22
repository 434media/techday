import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase/admin"
import type { AdminPermission } from "@/lib/firebase/collections"

export const dynamic = "force-dynamic"

// Firebase Authentication-based admin access
// Uses Firebase Auth as the source of truth - no Firestore admins collection
// Google Sign-in: Only @434.media workspace accounts (enforced by client + server)
// Email/Password: Only users created in Firebase Authentication

const SESSION_COOKIE_NAME = "admin_session"
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

// Allowed email domain for Google Sign-in
const ALLOWED_DOMAIN = "434media.com"

// Default permissions for authenticated admins
// All Firebase Auth users get full admin access
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

    // Check sign-in provider
    const signInProvider = decodedToken.firebase?.sign_in_provider

    // For Google sign-in, verify the domain is @434.media
    if (signInProvider === "google.com") {
      const emailDomain = email.split("@")[1]
      if (emailDomain !== ALLOWED_DOMAIN) {
        return NextResponse.json(
          { error: `Only @${ALLOWED_DOMAIN} accounts are allowed for Google sign-in` },
          { status: 403 }
        )
      }
    }

    // For email/password sign-in, the user must exist in Firebase Auth
    // (already verified by verifyIdToken - if they authenticated, they exist)

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

    // Return admin info - all authenticated Firebase users are admins
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

    // For Google sign-in sessions, re-verify domain
    const signInProvider = decodedClaims.firebase?.sign_in_provider
    if (signInProvider === "google.com") {
      const emailDomain = email.split("@")[1]
      if (emailDomain !== ALLOWED_DOMAIN) {
        return NextResponse.json({ authenticated: false })
      }
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
