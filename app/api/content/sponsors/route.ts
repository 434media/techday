import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Cache for 60 seconds

type SponsorEvent = "techday" | "techfuel"

const DEFAULT_EVENT_SPONSORS = {
  sponsors: [],
  community: [],
}

const DEFAULT_SPONSORS = {
  techday: { ...DEFAULT_EVENT_SPONSORS },
  techfuel: { ...DEFAULT_EVENT_SPONSORS },
}

// Public endpoint to fetch sponsors for a specific event
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const event = (searchParams.get("event") || "techday") as SponsorEvent

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ sponsors: DEFAULT_EVENT_SPONSORS })
  }

  try {
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    
    if (!doc.exists) {
      return NextResponse.json({ sponsors: DEFAULT_EVENT_SPONSORS })
    }

    const data = doc.data()
    const allSponsors = data?.sponsors || DEFAULT_SPONSORS
    const eventSponsors = allSponsors[event] || DEFAULT_EVENT_SPONSORS

    return NextResponse.json({
      sponsors: eventSponsors,
    })
  } catch (error) {
    console.error("Public sponsors fetch error:", error)
    return NextResponse.json({ sponsors: DEFAULT_EVENT_SPONSORS })
  }
}
