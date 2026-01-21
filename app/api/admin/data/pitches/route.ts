import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { verifyAdminSession, sessionHasPermission } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("pitches", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ 
      pitches: [], 
      total: 0,
      message: "Firebase not configured" 
    })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "100")

    let query = adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .orderBy("submittedAt", "desc")
      .limit(limit)

    if (status) {
      query = query.where("status", "==", status) as typeof query
    }

    const snapshot = await query.get()

    const pitches = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || null,
      reviewedAt: doc.data().reviewedAt?.toDate?.()?.toISOString() || null,
    }))

    return NextResponse.json({
      pitches,
      total: pitches.length,
    })
  } catch (error) {
    console.error("Pitches fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pitches" },
      { status: 500 }
    )
  }
}

// PATCH - Update pitch status
export async function PATCH(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("pitches", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const data = await request.json()
    const { id, status, reviewNotes } = data

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 })
    }

    const validStatuses = ["pending", "reviewing", "accepted", "rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await adminDb.collection(COLLECTIONS.PITCH_SUBMISSIONS).doc(id).update({
      status,
      reviewNotes: reviewNotes || "",
      reviewedAt: new Date(),
      reviewedBy: session.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Pitch update error:", error)
    return NextResponse.json(
      { error: "Failed to update pitch" },
      { status: 500 }
    )
  }
}
