import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type JudgeSchedulingDocument } from "@/lib/firebase/collections"
import { verifyAdminSession } from "@/lib/admin/session"
import { sendJudgeSchedulingConfirmation } from "@/lib/email/resend"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ judges: [] })
  }

  try {
    const snapshot = await adminDb
      .collection(COLLECTIONS.JUDGE_SCHEDULING)
      .get()

    const judges = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || doc.data().submittedAt,
    }))

    return NextResponse.json({ judges })
  } catch (error) {
    console.error("Admin judge scheduling error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

// Admin: manually add a judge
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

    if (!data.judgeName?.trim()) {
      return NextResponse.json({ error: "Judge name is required" }, { status: 400 })
    }
    if (!data.date || !data.timeSlot) {
      return NextResponse.json({ error: "Date and time slot are required" }, { status: 400 })
    }

    const doc: JudgeSchedulingDocument = {
      judgeName: data.judgeName.trim(),
      email: (data.email || "").toLowerCase().trim(),
      isCustomName: true,
      date: data.date,
      timeSlot: data.timeSlot,
      submittedAt: new Date(),
    }

    const docRef = await adminDb
      .collection(COLLECTIONS.JUDGE_SCHEDULING)
      .add(doc)

    return NextResponse.json({
      success: true,
      judge: {
        id: docRef.id,
        ...doc,
        submittedAt: doc.submittedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Admin add judge error:", error)
    return NextResponse.json({ error: "Failed to add judge" }, { status: 500 })
  }
}

// Admin: delete a judge
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
    const judgeId = searchParams.get("id")

    if (!judgeId) {
      return NextResponse.json({ error: "Judge ID is required" }, { status: 400 })
    }

    await adminDb
      .collection(COLLECTIONS.JUDGE_SCHEDULING)
      .doc(judgeId)
      .delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin delete judge error:", error)
    return NextResponse.json({ error: "Failed to delete judge" }, { status: 500 })
  }
}

// Admin: send/resend confirmation email to a judge
export async function PUT(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.email?.trim()) {
      return NextResponse.json({ error: "Judge has no email address" }, { status: 400 })
    }

    const result = await sendJudgeSchedulingConfirmation(
      data.email,
      data.judgeName,
      data.date,
      data.timeSlot
    )

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin send judge email error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
