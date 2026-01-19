import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Cache for 60 seconds

// Public endpoint to fetch schedule for the website
export async function GET() {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ sessions: [] })
  }

  try {
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("schedule").get()
    
    if (!doc.exists) {
      return NextResponse.json({ sessions: [] })
    }

    const data = doc.data()
    return NextResponse.json({
      sessions: data?.sessions || [],
    })
  } catch (error) {
    console.error("Public schedule fetch error:", error)
    return NextResponse.json({ sessions: [] })
  }
}
