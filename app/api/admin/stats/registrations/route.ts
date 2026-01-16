import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { isApprovedAdmin } from "@/lib/admin/config"
import crypto from "crypto"

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "change-this-in-production"

// Verify admin session
async function verifySession(): Promise<string | null> {
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
    
    if (!isApprovedAdmin(payload.email)) return null
    
    return payload.email
  } catch {
    return null
  }
}

export async function GET() {
  const email = await verifySession()
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ count: 0, message: "Firebase not configured" })
  }

  try {
    const snapshot = await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .count()
      .get()

    return NextResponse.json({ count: snapshot.data().count })
  } catch (error) {
    console.error("Registrations count error:", error)
    return NextResponse.json({ count: 0 })
  }
}
