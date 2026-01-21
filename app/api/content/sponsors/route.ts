import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Cache for 60 seconds

type SponsorTier = "platinum" | "gold" | "silver" | "bronze" | "community"

const DEFAULT_SPONSORS: Record<SponsorTier, unknown[]> = {
  platinum: [],
  gold: [],
  silver: [],
  bronze: [],
  community: [],
}

// Public endpoint to fetch sponsors for the website
export async function GET() {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ sponsors: DEFAULT_SPONSORS })
  }

  try {
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("sponsors").get()
    
    if (!doc.exists) {
      return NextResponse.json({ sponsors: DEFAULT_SPONSORS })
    }

    const data = doc.data()
    return NextResponse.json({
      sponsors: data?.sponsors || DEFAULT_SPONSORS,
    })
  } catch (error) {
    console.error("Public sponsors fetch error:", error)
    return NextResponse.json({ sponsors: DEFAULT_SPONSORS })
  }
}
