import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type SessionContent } from "@/lib/firebase/collections"
import { verifyAdminSession, sessionHasPermission } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("schedule", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ sessions: [], message: "Firebase not configured" })
  }

  try {
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("schedule").get()
    
    if (!doc.exists) {
      return NextResponse.json({ sessions: [] })
    }

    const data = doc.data()
    return NextResponse.json({
      sessions: data?.sessions || [],
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || null,
      updatedBy: data?.updatedBy || null,
    })
  } catch (error) {
    console.error("Schedule fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("schedule", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const sessionData: SessionContent = await request.json()

    if (!sessionData.title || !sessionData.time) {
      return NextResponse.json({ error: "Title and time are required" }, { status: 400 })
    }

    if (!sessionData.id) {
      sessionData.id = `session-${Date.now()}`
    }

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("schedule").get()
    const currentSessions: SessionContent[] = doc.exists ? doc.data()?.sessions || [] : []

    currentSessions.push(sessionData)

    // Sort by time
    currentSessions.sort((a, b) => a.time.localeCompare(b.time))

    await adminDb.collection(COLLECTIONS.CONTENT).doc("schedule").set({
      sessions: currentSessions,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true, session: sessionData })
  } catch (error) {
    console.error("Session create error:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("schedule", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const sessionData: SessionContent = await request.json()

    if (!sessionData.id) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("schedule").get()
    const currentSessions: SessionContent[] = doc.exists ? doc.data()?.sessions || [] : []

    const index = currentSessions.findIndex((s) => s.id === sessionData.id)
    if (index === -1) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    currentSessions[index] = sessionData

    // Sort by time
    currentSessions.sort((a, b) => a.time.localeCompare(b.time))

    await adminDb.collection(COLLECTIONS.CONTENT).doc("schedule").set({
      sessions: currentSessions,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true, session: sessionData })
  } catch (error) {
    console.error("Session update error:", error)
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("schedule", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("schedule").get()
    const currentSessions: SessionContent[] = doc.exists ? doc.data()?.sessions || [] : []

    const updatedSessions = currentSessions.filter((s) => s.id !== id)

    if (updatedSessions.length === currentSessions.length) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    await adminDb.collection(COLLECTIONS.CONTENT).doc("schedule").set({
      sessions: updatedSessions,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Session delete error:", error)
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 })
  }
}
