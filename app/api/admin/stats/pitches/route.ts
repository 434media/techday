import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { isApprovedAdmin } from "@/lib/admin/config"
import crypto from "crypto"

export const dynamic = "force-dynamic"

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "change-this-in-production"

async function verifySession(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value
    
    if (!sessionToken) return null
    
    const decoded = Buffer.from(sessionToken, "base64").toString("utf-8")
    const lastDotIndex = decoded.lastIndexOf(".")
    if (lastDotIndex === -1) return null
    const data = decoded.substring(0, lastDotIndex)
    const signature = decoded.substring(lastDotIndex + 1)
    
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
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .count()
      .get()

    return NextResponse.json({ count: snapshot.data().count })
  } catch (error) {
    console.error("Pitches count error:", error)
    return NextResponse.json({ count: 0 })
  }
}
