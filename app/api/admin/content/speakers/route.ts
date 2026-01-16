import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type SpeakerContent } from "@/lib/firebase/collections"
import { verifyAdminSession, sessionHasPermission } from "@/lib/admin/session"

export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("speakers"))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ speakers: [], message: "Firebase not configured" })
  }

  try {
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("speakers").get()
    
    if (!doc.exists) {
      return NextResponse.json({ speakers: [] })
    }

    const data = doc.data()
    return NextResponse.json({
      speakers: data?.speakers || [],
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || null,
      updatedBy: data?.updatedBy || null,
    })
  } catch (error) {
    console.error("Speakers fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch speakers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("speakers"))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const speaker: SpeakerContent = await request.json()

    // Validate required fields
    if (!speaker.name || !speaker.title) {
      return NextResponse.json({ error: "Name and title are required" }, { status: 400 })
    }

    // Generate ID if not provided
    if (!speaker.id) {
      speaker.id = `speaker-${Date.now()}`
    }

    // Get current speakers
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("speakers").get()
    const currentSpeakers: SpeakerContent[] = doc.exists ? doc.data()?.speakers || [] : []

    // Add new speaker
    currentSpeakers.push(speaker)

    // Save
    await adminDb.collection(COLLECTIONS.CONTENT).doc("speakers").set({
      speakers: currentSpeakers,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true, speaker })
  } catch (error) {
    console.error("Speaker create error:", error)
    return NextResponse.json({ error: "Failed to create speaker" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("speakers"))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const speaker: SpeakerContent = await request.json()

    if (!speaker.id) {
      return NextResponse.json({ error: "Speaker ID is required" }, { status: 400 })
    }

    // Get current speakers
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("speakers").get()
    const currentSpeakers: SpeakerContent[] = doc.exists ? doc.data()?.speakers || [] : []

    // Find and update speaker
    const index = currentSpeakers.findIndex((s) => s.id === speaker.id)
    if (index === -1) {
      return NextResponse.json({ error: "Speaker not found" }, { status: 404 })
    }

    currentSpeakers[index] = speaker

    // Save
    await adminDb.collection(COLLECTIONS.CONTENT).doc("speakers").set({
      speakers: currentSpeakers,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true, speaker })
  } catch (error) {
    console.error("Speaker update error:", error)
    return NextResponse.json({ error: "Failed to update speaker" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("speakers"))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Speaker ID is required" }, { status: 400 })
    }

    // Get current speakers
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("speakers").get()
    const currentSpeakers: SpeakerContent[] = doc.exists ? doc.data()?.speakers || [] : []

    // Filter out the deleted speaker
    const updatedSpeakers = currentSpeakers.filter((s) => s.id !== id)

    if (updatedSpeakers.length === currentSpeakers.length) {
      return NextResponse.json({ error: "Speaker not found" }, { status: 404 })
    }

    // Save
    await adminDb.collection(COLLECTIONS.CONTENT).doc("speakers").set({
      speakers: updatedSpeakers,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Speaker delete error:", error)
    return NextResponse.json({ error: "Failed to delete speaker" }, { status: 500 })
  }
}
