import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { FieldValue } from "firebase-admin/firestore"
import { verifyAdminSession } from "@/lib/admin/session"
import { sendPitchNonSelectNotification } from "@/lib/email/resend"

export const dynamic = "force-dynamic"

// Admin: send non-select notification to all pitch applicants NOT scheduled as semi-finalists
// Tracks successfully sent emails to prevent double-sending on retry
export async function POST(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    // Check for retryOnly flag (only send to previously failed emails)
    const body = await request.json().catch(() => ({}))
    const retryOnly = body.retryOnly === true

    // 1. Get all semi-finalist emails (from pitchScheduling)
    const schedulingSnapshot = await adminDb
      .collection(COLLECTIONS.PITCH_SCHEDULING)
      .get()

    const semifinalistEmails = new Set<string>()
    for (const doc of schedulingSnapshot.docs) {
      if (doc.id === "_bulk_notify_meta" || doc.id === "_bulk_nonselect_meta") continue
      const email = doc.data().email as string | undefined
      if (email && email.trim()) {
        semifinalistEmails.add(email.toLowerCase().trim())
      }
    }

    // 2. Get already-sent emails from metadata to prevent double-sending
    const metaDoc = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .doc("_bulk_nonselect_meta")
      .get()
    const alreadySentEmails = new Set<string>(
      (metaDoc.exists && metaDoc.data()?.sentEmails) || []
    )

    // 3. Get all pitch submissions
    const submissionsSnapshot = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .get()

    const allApplicants = submissionsSnapshot.docs
      .filter((doc) => doc.id !== "_bulk_nonselect_meta")
      .map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          email: (data.email as string || "").toLowerCase().trim(),
          founderName: data.founderName as string,
          companyName: data.companyName as string,
        }
      })

    // 4. Filter to non-selected applicants (those NOT in pitchScheduling)
    const nonSelected = allApplicants.filter(
      (a) => a.email && !semifinalistEmails.has(a.email)
    )

    // Deduplicate by email
    const seen = new Set<string>()
    const uniqueNonSelected: typeof nonSelected = []
    for (const applicant of nonSelected) {
      if (!seen.has(applicant.email)) {
        seen.add(applicant.email)
        uniqueNonSelected.push(applicant)
      }
    }

    // 5. If retryOnly or re-run, skip already-sent emails
    const toSend = retryOnly
      ? uniqueNonSelected.filter((a) => !alreadySentEmails.has(a.email))
      : uniqueNonSelected.filter((a) => !alreadySentEmails.has(a.email))

    if (toSend.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        failed: 0,
        total: 0,
        alreadySent: alreadySentEmails.size,
        message: "All non-selected applicants have already been notified",
      })
    }

    // 6. Send in batches of 3 with 2s delay (Resend limit is 5/second)
    const BATCH_SIZE = 3
    const BATCH_DELAY_MS = 2000
    let sent = 0
    let failed = 0
    const newlySentEmails: string[] = []
    const failedEmails: string[] = []

    for (let i = 0; i < toSend.length; i += BATCH_SIZE) {
      const batch = toSend.slice(i, i + BATCH_SIZE)
      const results = await Promise.allSettled(
        batch.map((applicant) =>
          sendPitchNonSelectNotification(applicant.email, applicant.founderName, applicant.companyName)
        )
      )
      for (let j = 0; j < results.length; j++) {
        const r = results[j]
        if (r.status === "fulfilled" && r.value.success) {
          sent++
          newlySentEmails.push(batch[j].email)
        } else {
          failed++
          failedEmails.push(batch[j].email)
        }
      }
      if (i + BATCH_SIZE < toSend.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS))
      }
    }

    // 7. Store metadata — append newly sent emails to the tracked list
    await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .doc("_bulk_nonselect_meta")
      .set({
        lastSentAt: new Date(),
        sentBy: session.email,
        sentCount: alreadySentEmails.size + sent,
        failedCount: failed,
        semifinalistsExcluded: semifinalistEmails.size,
        sentEmails: FieldValue.arrayUnion(...newlySentEmails),
        failedEmails,
      }, { merge: true })

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: toSend.length,
      alreadySent: alreadySentEmails.size,
      semifinalistsExcluded: semifinalistEmails.size,
      failedEmails,
      lastSentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Admin bulk non-select notification error:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}

// Admin: get non-select send status and preview count
export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ lastSentAt: null, nonSelectedCount: 0, semifinalistCount: 0 })
  }

  try {
    // Get semi-finalist emails
    const schedulingSnapshot = await adminDb
      .collection(COLLECTIONS.PITCH_SCHEDULING)
      .get()

    const semifinalistEmails = new Set<string>()
    for (const doc of schedulingSnapshot.docs) {
      if (doc.id === "_bulk_notify_meta" || doc.id === "_bulk_nonselect_meta") continue
      const email = doc.data().email as string | undefined
      if (email && email.trim()) {
        semifinalistEmails.add(email.toLowerCase().trim())
      }
    }

    // Get all pitch submissions
    const submissionsSnapshot = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .get()

    const allEmails = new Set<string>()
    const nonSelectedEmails = new Set<string>()
    for (const doc of submissionsSnapshot.docs) {
      if (doc.id === "_bulk_nonselect_meta") continue
      const email = (doc.data().email as string || "").toLowerCase().trim()
      if (email) {
        allEmails.add(email)
        if (!semifinalistEmails.has(email)) {
          nonSelectedEmails.add(email)
        }
      }
    }

    // Get last sent metadata
    const metaDoc = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .doc("_bulk_nonselect_meta")
      .get()

    const meta = metaDoc.exists ? metaDoc.data() : null
    const alreadySentEmails = new Set<string>(meta?.sentEmails || [])
    const unsentCount = [...nonSelectedEmails].filter((e) => !alreadySentEmails.has(e)).length

    return NextResponse.json({
      nonSelectedCount: nonSelectedEmails.size,
      semifinalistCount: semifinalistEmails.size,
      totalApplicants: allEmails.size,
      lastSentAt: meta?.lastSentAt?.toDate?.()?.toISOString() || null,
      lastSentCount: meta?.sentCount || 0,
      alreadySent: alreadySentEmails.size,
      unsent: unsentCount,
      failedEmails: meta?.failedEmails || [],
    })
  } catch (error) {
    console.error("Admin non-select status error:", error)
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 })
  }
}
