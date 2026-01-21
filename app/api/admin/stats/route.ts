import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { verifyAdminSession } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

// Combined stats endpoint to reduce cold starts and API calls
export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({
      registrations: 0,
      newsletter: 0,
      pitches: 0,
      message: "Firebase not configured",
    })
  }

  try {
    // Fetch all counts in parallel for better performance
    const [registrationsSnapshot, newsletterSnapshot, pitchesSnapshot] = await Promise.all([
      adminDb.collection(COLLECTIONS.REGISTRATIONS).count().get(),
      adminDb.collection(COLLECTIONS.NEWSLETTER).where("status", "==", "active").count().get(),
      adminDb.collection(COLLECTIONS.PITCH_SUBMISSIONS).count().get(),
    ])

    return NextResponse.json({
      registrations: registrationsSnapshot.data().count,
      newsletter: newsletterSnapshot.data().count,
      pitches: pitchesSnapshot.data().count,
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({
      registrations: 0,
      newsletter: 0,
      pitches: 0,
      error: "Failed to fetch stats",
    })
  }
}
