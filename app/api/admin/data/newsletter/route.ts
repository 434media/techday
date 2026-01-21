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
    const limit = parseInt(searchParams.get("limit") || "100")

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
