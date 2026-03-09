import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { verifyAdminSession } from "@/lib/admin/session"
import { sendJudgeInvitationEmail } from "@/lib/email/resend"

export const dynamic = "force-dynamic"

// Admin: send invitation email to all judges who have an email
export async function POST() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const snapshot = await adminDb
      .collection(COLLECTIONS.JUDGE_SCHEDULING)
      .get()

    const judges = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email as string | undefined,
        judgeName: data.judgeName as string,
      }
    })

    const judgesWithEmail = judges.filter(
      (j) => j.email && j.email.trim()
    )

    if (judgesWithEmail.length === 0) {
      return NextResponse.json({ error: "No judges with email addresses found" }, { status: 400 })
    }

    // Deduplicate by email (a judge may appear in multiple slots)
    const seen = new Set<string>()
    const uniqueJudges: { email: string; judgeName: string }[] = []
    for (const judge of judgesWithEmail) {
      const email = judge.email!.toLowerCase().trim()
      if (!seen.has(email)) {
        seen.add(email)
        uniqueJudges.push({ email, judgeName: judge.judgeName })
      }
    }

    const results = await Promise.allSettled(
      uniqueJudges.map((judge) =>
        sendJudgeInvitationEmail(judge.email, judge.judgeName)
      )
    )

    const sent = results.filter((r) => r.status === "fulfilled" && r.value.success).length
    const failed = results.length - sent

    // Store the timestamp in Firebase
    await adminDb
      .collection(COLLECTIONS.JUDGE_SCHEDULING)
      .doc("_bulk_notify_meta")
      .set({ lastSentAt: new Date(), sentBy: session.email, sentCount: sent }, { merge: true })

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: uniqueJudges.length,
      lastSentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Admin bulk judge notification error:", error)
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
      .collection(COLLECTIONS.JUDGE_SCHEDULING)
      .doc("_bulk_notify_meta")
      .get()

    if (!doc.exists) {
      return NextResponse.json({ lastSentAt: null })
    }

    const data = doc.data()
    const lastSentAt = data?.lastSentAt?.toDate?.()?.toISOString() || data?.lastSentAt || null

    return NextResponse.json({ lastSentAt, sentBy: data?.sentBy, sentCount: data?.sentCount })
  } catch (error) {
    console.error("Admin judge notify meta error:", error)
    return NextResponse.json({ lastSentAt: null })
  }
}
