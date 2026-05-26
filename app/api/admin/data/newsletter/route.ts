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

  if (!(await sessionHasPermission("newsletter", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ 
      subscribers: [], 
      total: 0,
      message: "Firebase not configured" 
    })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "active"
    const source = searchParams.get("source")
    const limit = parseInt(searchParams.get("limit") || "100")

    // When filtering by source, query with only `where("source", "==", …)` and
    // perform status filtering + date sort in memory. This avoids the composite
    // (source, status, subscribedAt) index Firestore would otherwise require.
    // The source-filtered audience (e.g. 2027-updates) stays small enough that
    // in-memory sort and limit is fine.
    if (source) {
      const snapshot = await adminDb
        .collection(COLLECTIONS.NEWSLETTER)
        .where("source", "==", source)
        .get()

      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        subscribedAt: doc.data().subscribedAt?.toDate?.()?.toISOString() || null,
      })) as Array<{ id: string; status?: string; subscribedAt: string | null }>

      const filtered = status === "all" ? all : all.filter((s) => s.status === status)
      filtered.sort((a, b) => {
        const aTime = a.subscribedAt ? Date.parse(a.subscribedAt) : 0
        const bTime = b.subscribedAt ? Date.parse(b.subscribedAt) : 0
        return bTime - aTime
      })
      const subscribers = filtered.slice(0, limit)

      return NextResponse.json({
        subscribers,
        total: subscribers.length,
      })
    }

    let query = adminDb
      .collection(COLLECTIONS.NEWSLETTER)
      .orderBy("subscribedAt", "desc")
      .limit(limit)

    if (status !== "all") {
      query = query.where("status", "==", status) as typeof query
    }

    const snapshot = await query.get()

    const subscribers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      subscribedAt: doc.data().subscribedAt?.toDate?.()?.toISOString() || null,
    }))

    return NextResponse.json({
      subscribers,
      total: subscribers.length,
    })
  } catch (error) {
    console.error("Newsletter fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("newsletter", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID is required" }, { status: 400 })
    }

    if (id === "all") {
      const source = searchParams.get("source")
      const baseRef = adminDb.collection(COLLECTIONS.NEWSLETTER)
      const snapshot = source
        ? await baseRef.where("source", "==", source).get()
        : await baseRef.get()
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

      return NextResponse.json({ success: true, message: `Deleted ${count} subscribers` })
    }

    await adminDb.collection(COLLECTIONS.NEWSLETTER).doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Newsletter delete error:", error)
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 })
  }
}
