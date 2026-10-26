import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type SponsorContent } from "@/lib/firebase/collections"
import { verifyAdminSession, sessionHasPermission } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

type SponsorEvent = "techday" | "techfuel"
type SponsorCategory = "sponsors" | "community"

// event and category arrive from the request and index the sponsors object, so
// only the known values are accepted; anything else ("__proto__", "constructor")
// is refused before it can be used as a key (CodeQL js/prototype-polluting-assignment).
const SPONSOR_EVENTS: readonly string[] = ["techday", "techfuel"]
const SPONSOR_CATEGORIES: readonly string[] = ["sponsors", "community"]
const isSponsorEvent = (v: unknown): v is SponsorEvent => typeof v === "string" && SPONSOR_EVENTS.includes(v)
const isSponsorCategory = (v: unknown): v is SponsorCategory => typeof v === "string" && SPONSOR_CATEGORIES.includes(v)
const invalidKeys = () => NextResponse.json({ error: "Invalid event or category" }, { status: 400 })

interface EventSponsors {
  sponsors: SponsorContent[]
  community: SponsorContent[]
}

interface AllSponsors {
  techday: EventSponsors
  techfuel: EventSponsors
}

const DEFAULT_EVENT: EventSponsors = {
  sponsors: [],
  community: [],
}

const DEFAULT_SPONSORS: AllSponsors = {
  techday: { sponsors: [], community: [] },
  techfuel: { sponsors: [], community: [] },
}

// Helper to create a fresh copy of sponsors data
function cloneSponsors(sponsors?: AllSponsors): AllSponsors {
  if (!sponsors) {
    return {
      techday: { sponsors: [], community: [] },
      techfuel: { sponsors: [], community: [] },
    }
  }
  return {
    techday: {
      sponsors: [...(sponsors.techday?.sponsors || [])],
      community: [...(sponsors.techday?.community || [])],
    },
    techfuel: {
      sponsors: [...(sponsors.techfuel?.sponsors || [])],
      community: [...(sponsors.techfuel?.community || [])],
    },
  }
}

export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!(await sessionHasPermission("sponsors", session))) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ sponsors: DEFAULT_SPONSORS, message: "Firebase not configured" })
  }

  try {
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    
    if (!doc.exists) {
      return NextResponse.json({ sponsors: DEFAULT_SPONSORS })
    }

    const data = doc.data()
    return NextResponse.json({
      sponsors: data?.sponsors || DEFAULT_SPONSORS,
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || null,
      updatedBy: data?.updatedBy || null,
    })
  } catch (error) {
    console.error("Sponsors fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch sponsors" }, { status: 500 })
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
    const { sponsor, event, category }: { sponsor: SponsorContent; event: SponsorEvent; category: SponsorCategory } = await request.json()

    if (!sponsor.name || !event || !category) {
      return NextResponse.json({ error: "Name, event, and category are required" }, { status: 400 })
    }

    if (!isSponsorEvent(event) || !isSponsorCategory(category)) {
      return invalidKeys()
    }

    if (!sponsor.id) {
      sponsor.id = `sponsor-${Date.now()}`
    }

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    const currentSponsors = cloneSponsors(doc.exists ? doc.data()?.sponsors : undefined)

    currentSponsors[event][category].push(sponsor)

    await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").set({
      sponsors: currentSponsors,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true, sponsor })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Sponsor create error:", errorMessage)
    return NextResponse.json({ 
      error: "Failed to create sponsor", 
      details: errorMessage,
    }, { status: 500 })
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
    const { sponsor, event, category, oldEvent, oldCategory }: { 
      sponsor: SponsorContent
      event: SponsorEvent
      category: SponsorCategory
      oldEvent?: SponsorEvent
      oldCategory?: SponsorCategory
    } = await request.json()

    if (!sponsor.id) {
      return NextResponse.json({ error: "Sponsor ID is required" }, { status: 400 })
    }
    if (
      !isSponsorEvent(event) || !isSponsorCategory(category) ||
      (oldEvent !== undefined && !isSponsorEvent(oldEvent)) ||
      (oldCategory !== undefined && !isSponsorCategory(oldCategory))
    ) {
      return invalidKeys()
    }

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    const currentSponsors = cloneSponsors(doc.exists ? doc.data()?.sponsors : undefined)

    // Remove from old location
    const removeEvent = oldEvent || event
    const removeCategory = oldCategory || category
    currentSponsors[removeEvent][removeCategory] = currentSponsors[removeEvent][removeCategory].filter(
      (s: SponsorContent) => s.id !== sponsor.id
    )

    // Add to new location
    currentSponsors[event][category].push(sponsor)

    await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").set({
      sponsors: currentSponsors,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true, sponsor })
  } catch (error) {
    console.error("Sponsor update error:", error)
    return NextResponse.json({ error: "Failed to update sponsor" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
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
    const { event, category, sponsors: reorderedSponsors }: { 
      event: SponsorEvent
      category: SponsorCategory
      sponsors: SponsorContent[] 
    } = await request.json()

    if (!event || !category || !reorderedSponsors || !Array.isArray(reorderedSponsors)) {
      return NextResponse.json({ error: "Event, category, and sponsors array are required" }, { status: 400 })
    }
    if (!isSponsorEvent(event) || !isSponsorCategory(category)) {
      return invalidKeys()
    }

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    const currentSponsors = cloneSponsors(doc.exists ? doc.data()?.sponsors : undefined)

    currentSponsors[event][category] = reorderedSponsors

    await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").set({
      sponsors: currentSponsors,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sponsor reorder error:", error)
    return NextResponse.json({ error: "Failed to reorder sponsors" }, { status: 500 })
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
    const event = searchParams.get("event") as SponsorEvent
    const category = searchParams.get("category") as SponsorCategory

    if (!id) {
      return NextResponse.json({ error: "Sponsor ID is required" }, { status: 400 })
    }

    // Bulk delete all sponsors
    if (id === "all") {
      await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").set({
        sponsors: { 
          techday: { sponsors: [], community: [] }, 
          techfuel: { sponsors: [], community: [] } 
        },
        updatedAt: new Date(),
        updatedBy: session.email,
      })
      return NextResponse.json({ success: true, message: "All sponsors deleted" })
    }

    if (!event || !category) {
      return NextResponse.json({ error: "Event and category are required for individual delete" }, { status: 400 })
    }
    if (!isSponsorEvent(event) || !isSponsorCategory(category)) {
      return invalidKeys()
    }

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    const currentSponsors = cloneSponsors(doc.exists ? doc.data()?.sponsors : undefined)

    const originalLength = currentSponsors[event][category].length
    currentSponsors[event][category] = currentSponsors[event][category].filter((s: SponsorContent) => s.id !== id)

    if (currentSponsors[event][category].length === originalLength) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 })
    }

    await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").set({
      sponsors: currentSponsors,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sponsor delete error:", error)
    return NextResponse.json({ error: "Failed to delete sponsor" }, { status: 500 })
  }
}
