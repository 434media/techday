import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { FieldValue } from "firebase-admin/firestore"
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

// PATCH - Update pitch (status, comments, logo)
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
    const { id, action } = data

    if (!id) {
      return NextResponse.json({ error: "Pitch ID is required" }, { status: 400 })
    }

    const docRef = adminDb.collection(COLLECTIONS.PITCH_SUBMISSIONS).doc(id)

    // Add a comment
    if (action === "addComment") {
      const { text } = data
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return NextResponse.json({ error: "Comment text is required" }, { status: 400 })
      }

      const comment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: text.trim().slice(0, 2000),
        authorEmail: session.email,
        authorName: session.name,
        createdAt: new Date().toISOString(),
      }

      await docRef.update({
        comments: FieldValue.arrayUnion(comment),
      })

      return NextResponse.json({ success: true, comment })
    }

    // Delete a comment
    if (action === "deleteComment") {
      const { commentId } = data
      if (!commentId) {
        return NextResponse.json({ error: "Comment ID is required" }, { status: 400 })
      }

      const doc = await docRef.get()
      if (!doc.exists) {
        return NextResponse.json({ error: "Pitch not found" }, { status: 404 })
      }

      const comments = (doc.data()?.comments || []).filter(
        (c: { id: string; authorEmail: string }) => {
          if (c.id !== commentId) return true
          // Only the comment author can delete their own comment
          return c.authorEmail !== session.email
        }
      )

      await docRef.update({ comments })
      return NextResponse.json({ success: true })
    }

    // Update logo
    if (action === "updateLogo") {
      const { logoUrl } = data
      await docRef.update({ logoUrl: logoUrl || "" })
      return NextResponse.json({ success: true })
    }

    // Default: update status
    const { status, reviewNotes } = data

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const validStatuses = ["pending", "reviewing", "accepted", "rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await docRef.update({
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

export async function DELETE(request: Request) {
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
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Pitch ID is required" }, { status: 400 })
    }

    if (id === "all") {
      const snapshot = await adminDb.collection(COLLECTIONS.PITCH_SUBMISSIONS).get()
      const batch = adminDb.batch()
      let count = 0

      for (const doc of snapshot.docs) {
        batch.delete(doc.ref)
        count++

        if (count % 500 === 0) {
          await batch.commit()
        }
      }

      if (count % 500 !== 0) {
        await batch.commit()
      }

      return NextResponse.json({ success: true, message: `Deleted ${count} pitches` })
    }

    await adminDb.collection(COLLECTIONS.PITCH_SUBMISSIONS).doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Pitch delete error:", error)
    return NextResponse.json({ error: "Failed to delete pitch" }, { status: 500 })
  }
}
