import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type PitchSchedulingDocument } from "@/lib/firebase/collections"
import { verifyAdminSession } from "@/lib/admin/session"
import { sendPitchSemifinalsNotification } from "@/lib/email/resend"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ pitches: [] })
  }

  try {
    const snapshot = await adminDb
      .collection(COLLECTIONS.PITCH_SCHEDULING)
      .get()

    const pitches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || doc.data().submittedAt,
    }))

    return NextResponse.json({ pitches })
  } catch (error) {
    console.error("Admin pitch scheduling error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

// Admin: manually add a pitch
export async function POST(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const data = await request.json()

    if (!data.companyName?.trim()) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }
    if (!data.founderName?.trim()) {
      return NextResponse.json({ error: "Founder name is required" }, { status: 400 })
    }
    if (!data.date || !data.judgeBlock || !data.pitchSlot) {
      return NextResponse.json({ error: "Date, judge block, and pitch slot are required" }, { status: 400 })
    }

    const doc: PitchSchedulingDocument = {
      companyName: data.companyName.trim(),
      founderName: data.founderName.trim(),
      email: (data.email || "").toLowerCase().trim(),
      date: data.date,
      judgeBlock: data.judgeBlock,
      pitchSlot: data.pitchSlot,
      submittedAt: new Date(),
    }

    const docRef = await adminDb
      .collection(COLLECTIONS.PITCH_SCHEDULING)
      .add(doc)

    // Auto-send semi-finalist notification email when admin adds a pitch
    let emailSent = false
    if (doc.email) {
      const emailResult = await sendPitchSemifinalsNotification(
        doc.email,
        doc.founderName,
        doc.companyName,
        doc.date,
        doc.pitchSlot,
        doc.judgeBlock
      )
      emailSent = emailResult.success
      if (!emailSent) {
        console.error(`Failed to auto-send semi-finalist email to ${doc.email}`)
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      pitch: {
        id: docRef.id,
        ...doc,
        submittedAt: doc.submittedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Admin add pitch scheduling error:", error)
    return NextResponse.json({ error: "Failed to add pitch" }, { status: 500 })
  }
}

// Admin: delete a pitch
export async function DELETE(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const pitchId = searchParams.get("id")

    if (!pitchId) {
      return NextResponse.json({ error: "Pitch ID is required" }, { status: 400 })
    }

    await adminDb
      .collection(COLLECTIONS.PITCH_SCHEDULING)
      .doc(pitchId)
      .delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin delete pitch scheduling error:", error)
    return NextResponse.json({ error: "Failed to delete pitch" }, { status: 500 })
  }
}

// Admin: send/resend confirmation email
export async function PUT(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const result = await sendPitchSemifinalsNotification(
      data.email,
      data.founderName,
      data.companyName,
      data.date,
      data.pitchSlot,
      data.judgeBlock
    )

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin pitch scheduling email error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
