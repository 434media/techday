import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Cache for 60 seconds

// Public endpoint to fetch speakers for the website
export async function GET() {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ speakers: [] })
  }

  try {
    const doc = await adminDb.collection(COLLECTIONS.CONTENT).doc("speakers").get()
    
    if (!doc.exists) {
      return NextResponse.json({ speakers: [] })
    }

    const data = doc.data()
    return NextResponse.json({
      speakers: data?.speakers || [],
    })
  } catch (error) {
    console.error("Public speakers fetch error:", error)
    return NextResponse.json({ speakers: [] })
  }
}
