import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { verifyAdminSession, sessionHasPermission } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

interface Partner {
  id: string
  name: string
  logoUrl: string
  website: string
}

export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Use sponsors permission for partners as well
  if (!(await sessionHasPermission("sponsors", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ partners: [], message: "Firebase not configured" })
  }

  try {
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("partners").get()
    
    if (!doc.exists) {
      return NextResponse.json({ partners: [] })
    }

    const data = doc.data()
    return NextResponse.json({
      partners: data?.partners || [],
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || null,
      updatedBy: data?.updatedBy || null,
    })
  } catch (error) {
    console.error("Partners fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("sponsors", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const partner: Partner = await request.json()

    // Validate required fields
    if (!partner.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Generate ID if not provided
    if (!partner.id) {
      partner.id = `partner-${Date.now()}`
    }

    // Get current partners
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("partners").get()
    const currentPartners: Partner[] = doc.exists ? doc.data()?.partners || [] : []

    // Add new partner
    currentPartners.push(partner)

    // Save
    await adminDb.collection(COLLECTIONS.CONTENT).doc("partners").set({
      partners: currentPartners,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true, partner })
  } catch (error) {
    console.error("Partner create error:", error)
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("sponsors", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const partner: Partner = await request.json()

    if (!partner.id) {
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400 })
    }

    // Get current partners
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("partners").get()
    const currentPartners: Partner[] = doc.exists ? doc.data()?.partners || [] : []

    // Find and update partner
    const index = currentPartners.findIndex((p) => p.id === partner.id)
    if (index === -1) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    currentPartners[index] = partner

    // Save
    await adminDb.collection(COLLECTIONS.CONTENT).doc("partners").set({
      partners: currentPartners,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true, partner })
  } catch (error) {
    console.error("Partner update error:", error)
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("sponsors", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Partner ID is required" }, { status: 400 })
    }

    // Get current partners
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("partners").get()
    const currentPartners: Partner[] = doc.exists ? doc.data()?.partners || [] : []

    // Filter out the deleted partner
    const updatedPartners = currentPartners.filter((p) => p.id !== id)

    if (updatedPartners.length === currentPartners.length) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    // Save
    await adminDb.collection(COLLECTIONS.CONTENT).doc("partners").set({
      partners: updatedPartners,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Partner delete error:", error)
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
}
