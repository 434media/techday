import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase/admin"
import { verifyAdminSession } from "@/lib/admin/session"

const VOTE_COLLECTION = "votes"

export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const snapshot = await adminDb
      .collection(VOTE_COLLECTION)
      .orderBy("createdAt", "desc")
      .get()

    const votes = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        email: data.email,
        finalist: data.finalist,
        isRegistered: data.isRegistered ?? false,
        registrationId: data.registrationId ?? null,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
      }
    })

    // Tally votes per finalist
    const tally: Record<string, number> = {}
    for (const vote of votes) {
      tally[vote.finalist] = (tally[vote.finalist] || 0) + 1
    }

    return NextResponse.json({
      votes,
      tally,
      total: votes.length,
    })
  } catch (error) {
    console.error("Failed to fetch votes:", error)
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { ids } = await request.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No vote IDs provided" },
        { status: 400 }
      )
    }

    const batch = adminDb.batch()
    for (const id of ids) {
      if (typeof id !== "string") continue
      batch.delete(adminDb.collection(VOTE_COLLECTION).doc(id))
    }
    await batch.commit()

    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (error) {
    console.error("Failed to delete votes:", error)
    return NextResponse.json(
      { error: "Failed to delete votes" },
      { status: 500 }
    )
  }
}
