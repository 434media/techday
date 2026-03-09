import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { verifyAdminSession } from "@/lib/admin/session"
import { sendPitchSemifinalsNotification } from "@/lib/email/resend"

export const dynamic = "force-dynamic"

// Admin: send semifinals notification to all accepted pitches
export async function POST() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    // Get all accepted pitch submissions
    const snapshot = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .where("status", "==", "accepted")
      .get()

    const pitches = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email as string | undefined,
        founderName: data.founderName as string,
        companyName: data.companyName as string,
      }
    })

    const pitchesWithEmail = pitches.filter(
      (p) => p.email && p.email.trim()
    )

    if (pitchesWithEmail.length === 0) {
      return NextResponse.json({ error: "No accepted pitches with email addresses found" }, { status: 400 })
    }

    // Deduplicate by email
    const seen = new Set<string>()
    const uniquePitches: { email: string; founderName: string; companyName: string }[] = []
    for (const pitch of pitchesWithEmail) {
      const email = pitch.email!.toLowerCase().trim()
      if (!seen.has(email)) {
        seen.add(email)
        uniquePitches.push({
          email,
          founderName: pitch.founderName,
          companyName: pitch.companyName,
        })
      }
    }

    const results = await Promise.allSettled(
      uniquePitches.map((pitch) =>
        sendPitchSemifinalsNotification(pitch.email, pitch.founderName, pitch.companyName)
      )
    )

    const sent = results.filter((r) => r.status === "fulfilled" && r.value.success).length
    const failed = results.length - sent

    // Store the timestamp in Firebase
    await adminDb
      .collection(COLLECTIONS.PITCH_SCHEDULING)
      .doc("_bulk_notify_meta")
      .set({ lastSentAt: new Date(), sentBy: session.email, sentCount: sent }, { merge: true })

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: uniquePitches.length,
      lastSentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Admin bulk pitch notification error:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}

// Admin: get last notification timestamp
export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ lastSentAt: null })
  }

  try {
    const doc = await adminDb
      .collection(COLLECTIONS.PITCH_SCHEDULING)
      .doc("_bulk_notify_meta")
      .get()

    if (!doc.exists) {
      return NextResponse.json({ lastSentAt: null })
    }

    const data = doc.data()
    const lastSentAt = data?.lastSentAt?.toDate?.()?.toISOString() || data?.lastSentAt || null

    return NextResponse.json({ lastSentAt, sentBy: data?.sentBy, sentCount: data?.sentCount })
  } catch (error) {
    console.error("Admin pitch notify meta error:", error)
    return NextResponse.json({ lastSentAt: null })
  }
}
