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

  if (!(await sessionHasPermission("registrations", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ 
      registrations: [], 
      total: 0,
      message: "Firebase not configured" 
    })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")?.toLowerCase()
    const limit = parseInt(searchParams.get("limit") || "100")

    let query = adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .orderBy("createdAt", "desc")
      .limit(limit)

    if (status) {
      query = query.where("status", "==", status) as typeof query
    }

    if (category) {
      query = query.where("category", "==", category) as typeof query
    }

    const snapshot = await query.get()

    let registrations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
    }))

    // Client-side search filtering (Firestore doesn't support full-text search)
    if (search) {
      registrations = registrations.filter((reg) => {
        const r = reg as Record<string, unknown>
        return (
          (r.firstName as string)?.toLowerCase().includes(search) ||
          (r.lastName as string)?.toLowerCase().includes(search) ||
          (r.email as string)?.toLowerCase().includes(search) ||
          (r.company as string)?.toLowerCase().includes(search) ||
          (r.ticketId as string)?.toLowerCase().includes(search)
        )
      })
    }

    return NextResponse.json({
      registrations,
      total: registrations.length,
    })
  } catch (error) {
    console.error("Registrations fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    )
  }
}
