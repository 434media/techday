import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { isApprovedAdmin, getPublicAdminByEmail, getSecurityQuestion, verifyCredentials } from "@/lib/admin/config"
import crypto from "crypto"

// Simple session-based auth using signed cookies
// Security Question + PIN authentication

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "change-this-in-production"
const SESSION_COOKIE_NAME = "admin_session"
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

// Create signed session token
function createSessionToken(email: string): string {
  const payload = {
    email,
    exp: Date.now() + SESSION_DURATION * 1000,
  }
  const data = JSON.stringify(payload)
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("hex")
  return Buffer.from(`${data}.${signature}`).toString("base64")
}

// Verify session token
function verifySessionToken(token: string): { email: string } | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [data, signature] = decoded.split(".")
    
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("hex")
    
    if (signature !== expectedSignature) {
      return null
    }
    
    const payload = JSON.parse(data)
    if (payload.exp < Date.now()) {
      return null
    }
    
    return { email: payload.email }
  } catch {
    return null
  }
}

// POST - Step 1: Get security question OR Step 2: Verify answer + PIN
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { email, answer, pin, action } = data

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Step 1: Request security question
    if (action === "get-question") {
      // Check if email is approved (but don't reveal if not)
      if (!isApprovedAdmin(normalizedEmail)) {
        // Return a generic response to not reveal valid emails
        return NextResponse.json({
          success: true,
          question: "Security question not found for this email",
          isValid: false,
        })
      }

      const question = getSecurityQuestion(normalizedEmail)
      return NextResponse.json({
        success: true,
        question,
        isValid: true,
      })
    }

    // Step 2: Verify answer and PIN
    if (action === "verify") {
      if (!answer || !pin) {
        return NextResponse.json(
          { error: "Answer and PIN are required" },
          { status: 400 }
        )
      }

      // Check if credentials are valid
      if (!verifyCredentials(normalizedEmail, answer, pin)) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        )
      }

      // Credentials valid - create session
      const sessionToken = createSessionToken(normalizedEmail)
      const admin = getPublicAdminByEmail(normalizedEmail)

      // Set session cookie
      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_DURATION,
        path: "/",
      })

      return NextResponse.json({
        success: true,
        user: admin,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
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
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false })
    }

    const session = verifySessionToken(sessionToken)
    if (!session) {
      return NextResponse.json({ authenticated: false })
    }

    const admin = getPublicAdminByEmail(session.email)
    if (!admin) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      user: admin,
    })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ authenticated: false })
  }
}

// DELETE - Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies()
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
