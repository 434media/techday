import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { verifyAdminSession } from "@/lib/admin/session"
import { sendEcosystemToursNotification } from "@/lib/email/resend"

export const dynamic = "force-dynamic"

// Date range: registrations from Feb 5 – Feb 23, 2026 (before ecosystem tours was added)
const RANGE_START = new Date("2026-02-05T00:00:00Z")
const RANGE_END = new Date("2026-02-24T00:00:00Z") // exclusive — captures all of Feb 23

// Admin: send one-time ecosystem tours notification to early registrants
export async function POST() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    // Query registrations created in the date range
    const snapshot = await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .where("createdAt", ">=", RANGE_START)
      .where("createdAt", "<", RANGE_END)
      .get()

    // Filter to Tech Fuel registrants who haven't already opted in
    const eligible: { email: string; firstName: string; events: string[] }[] = []
    const seen = new Set<string>()

    for (const doc of snapshot.docs) {
      if (doc.id.startsWith("_")) continue // skip meta docs
      const data = doc.data()
      const email = (data.email as string | undefined)?.toLowerCase().trim()
      if (!email || seen.has(email)) continue

      const events = (data.events as string[]) || []
      const hasTechFuel =
        events.includes("techfuel") || events.includes("2day")
      if (!hasTechFuel) continue

      // Skip if already opted in
      if (data.ecosystemTours === true) continue

      seen.add(email)
      eligible.push({
        email,
        firstName: data.firstName as string,
        events,
      })
    }

    if (eligible.length === 0) {
      return NextResponse.json(
        { error: "No eligible registrants found in the Feb 5–23 window" },
        { status: 400 }
      )
    }

    // Send in batches of 8 to respect Resend's 10/second rate limit
    const BATCH_SIZE = 8
    const BATCH_DELAY_MS = 1500
    let sent = 0
    let failed = 0

    for (let i = 0; i < eligible.length; i += BATCH_SIZE) {
      const batch = eligible.slice(i, i + BATCH_SIZE)
      const results = await Promise.allSettled(
        batch.map((reg) =>
          sendEcosystemToursNotification(reg.email, reg.firstName, reg.events)
        )
      )
      for (const r of results) {
        if (r.status === "fulfilled" && r.value.success) {
          sent++
        } else {
          failed++
        }
      }
      // Wait between batches (skip delay after the last batch)
      if (i + BATCH_SIZE < eligible.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS))
      }
    }

    // Store the timestamp in a meta doc
    await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .doc("_ecosystem_tours_notify_meta")
      .set(
        {
          lastSentAt: new Date(),
          sentBy: session.email,
          sentCount: sent,
          failedCount: failed,
          totalEligible: eligible.length,
        },
        { merge: true }
      )

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: eligible.length,
      lastSentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Admin ecosystem tours notification error:", error)
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    )
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
      .collection(COLLECTIONS.REGISTRATIONS)
      .doc("_ecosystem_tours_notify_meta")
      .get()

    if (!doc.exists) {
      return NextResponse.json({ lastSentAt: null })
    }

    const data = doc.data()
    const lastSentAt =
      data?.lastSentAt?.toDate?.()?.toISOString() ||
      data?.lastSentAt ||
      null

    return NextResponse.json({
      lastSentAt,
      sentBy: data?.sentBy,
      sentCount: data?.sentCount,
    })
  } catch (error) {
    console.error("Admin ecosystem tours notify meta error:", error)
    return NextResponse.json({ lastSentAt: null })
  }
}
