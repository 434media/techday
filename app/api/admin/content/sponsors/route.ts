import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type SponsorContent } from "@/lib/firebase/collections"
import { verifyAdminSession, sessionHasPermission } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

type SponsorTier = "platinum" | "gold" | "silver" | "bronze" | "community"

interface SponsorsData {
  sponsors: Record<SponsorTier, SponsorContent[]>
  updatedAt?: string
  updatedBy?: string
}

const DEFAULT_SPONSORS: Record<SponsorTier, SponsorContent[]> = {
  platinum: [],
  gold: [],
  silver: [],
  bronze: [],
  community: [],
}

// Helper to create a fresh copy of sponsors data
function cloneSponsors(sponsors?: Record<SponsorTier, SponsorContent[]>): Record<SponsorTier, SponsorContent[]> {
  if (!sponsors) {
    return {
      platinum: [],
      gold: [],
      silver: [],
      bronze: [],
      community: [],
    }
  }
  return {
    platinum: [...(sponsors.platinum || [])],
    gold: [...(sponsors.gold || [])],
    silver: [...(sponsors.silver || [])],
    bronze: [...(sponsors.bronze || [])],
    community: [...(sponsors.community || [])],
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
    const { sponsor, tier }: { sponsor: SponsorContent; tier: SponsorTier } = await request.json()

    if (!sponsor.name || !tier) {
      return NextResponse.json({ error: "Name and tier are required" }, { status: 400 })
    }

    const validTiers: SponsorTier[] = ["platinum", "gold", "silver", "bronze", "community"]
    if (!validTiers.includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    if (!sponsor.id) {
      sponsor.id = `sponsor-${Date.now()}`
    }

    // Ensure the sponsor has the correct tier property
    sponsor.tier = tier

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    const currentSponsors = cloneSponsors(doc.exists ? doc.data()?.sponsors : undefined)

    currentSponsors[tier].push(sponsor)

    await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").set({
      sponsors: currentSponsors,
      updatedAt: new Date(),
      updatedBy: session.email,
    })

    return NextResponse.json({ success: true, sponsor })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Sponsor create error:", errorMessage)
    console.error("Full error:", error)
    return NextResponse.json({ 
      error: "Failed to create sponsor", 
      details: errorMessage,
      isFirebaseConfigured: isFirebaseConfigured(),
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
    const { sponsor, tier, oldTier }: { sponsor: SponsorContent; tier: SponsorTier; oldTier?: SponsorTier } = await request.json()

    if (!sponsor.id) {
      return NextResponse.json({ error: "Sponsor ID is required" }, { status: 400 })
    }

    // Ensure the sponsor has the correct tier property
    sponsor.tier = tier

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    const currentSponsors = cloneSponsors(doc.exists ? doc.data()?.sponsors : undefined)

    // Remove from old tier if tier changed
    const tierToRemoveFrom = oldTier || tier
    currentSponsors[tierToRemoveFrom] = currentSponsors[tierToRemoveFrom].filter(
      (s: SponsorContent) => s.id !== sponsor.id
    )

    // Add to new tier
    currentSponsors[tier].push(sponsor)

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
    const { tier, sponsors: reorderedSponsors }: { tier: SponsorTier; sponsors: SponsorContent[] } = await request.json()

    if (!tier || !reorderedSponsors || !Array.isArray(reorderedSponsors)) {
      return NextResponse.json({ error: "Tier and sponsors array are required" }, { status: 400 })
    }

    const validTiers: SponsorTier[] = ["platinum", "gold", "silver", "bronze", "community"]
    if (!validTiers.includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 })
    }

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    const currentSponsors = cloneSponsors(doc.exists ? doc.data()?.sponsors : undefined)

    // Update the specific tier with reordered sponsors
    currentSponsors[tier] = reorderedSponsors

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
    const tier = searchParams.get("tier") as SponsorTier

    if (!id || !tier) {
      return NextResponse.json({ error: "Sponsor ID and tier are required" }, { status: 400 })
    }

    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    const currentSponsors = cloneSponsors(doc.exists ? doc.data()?.sponsors : undefined)

    const originalLength = currentSponsors[tier].length
    currentSponsors[tier] = currentSponsors[tier].filter((s: SponsorContent) => s.id !== id)

    if (currentSponsors[tier].length === originalLength) {
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
