import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type TextBlockContent, type TextBlockVersion } from "@/lib/firebase/collections"
import { verifyAdminSession } from "@/lib/admin/session"
import { sanitizeHtml } from "@/lib/sanitize-html"

export const dynamic = "force-dynamic"

// Get all text blocks (admin only)
export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ textBlocks: [], message: "Firebase not configured" })
  }

  try {
    const snapshot = await adminDb.collection(COLLECTIONS.SITE_TEXT).get()
    const textBlocks: TextBlockContent[] = []
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      textBlocks.push({
        id: doc.id,
        content: data.content,
        element: data.element || "p",
        page: data.page || "",
        section: data.section || "",
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        updatedBy: data.updatedBy || "",
        version: data.version || 1,
      })
    })

    return NextResponse.json({ textBlocks })
  } catch (error) {
    console.error("Text blocks fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch text blocks" }, { status: 500 })
  }
}

// Create or update a text block (with version history)
export async function PUT(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { id, element, page, section, restoreVersion } = body

    if (!id || typeof body.content !== "string") {
      return NextResponse.json({ error: "ID and content are required" }, { status: 400 })
    }

    // Rich blocks are rendered as HTML (dangerouslySetInnerHTML): allowlist them
    // here. Plain blocks are rendered as React text, so they are stored as-is.
    const content = element === "rich" ? sanitizeHtml(body.content) : body.content

    // Get existing document to determine version
    const existingDoc = await adminDb.collection(COLLECTIONS.SITE_TEXT).doc(id).get()
    const existingData = existingDoc.exists ? existingDoc.data() : null
    const currentVersion = existingData?.version || 0
    const newVersion = currentVersion + 1
    const isCreate = !existingDoc.exists
    const changeType = restoreVersion ? "restore" : isCreate ? "create" : "update"

    const textData = {
      content,
      element: element || "p",
      page: page || "",
      section: section || "",
      updatedAt: new Date(),
      updatedBy: session.email,
      version: newVersion,
    }

    // Save the text block
    await adminDb.collection(COLLECTIONS.SITE_TEXT).doc(id).set(textData, { merge: true })

    // Create version history entry
    const versionData: Omit<TextBlockVersion, "id"> = {
      textBlockId: id,
      content,
      version: newVersion,
      createdAt: new Date(),
      createdBy: session.email,
      changeType,
    }
    await adminDb.collection(COLLECTIONS.SITE_TEXT_HISTORY).add(versionData)

    return NextResponse.json({ 
      success: true, 
      textBlock: { id, ...textData },
      version: newVersion,
    })
  } catch (error) {
    console.error("Text block update error:", error)
    return NextResponse.json({ error: "Failed to update text block" }, { status: 500 })
  }
}

// Delete a text block
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
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await adminDb.collection(COLLECTIONS.SITE_TEXT).doc(id).delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Text block delete error:", error)
    return NextResponse.json({ error: "Failed to delete text block" }, { status: 500 })
  }
}
