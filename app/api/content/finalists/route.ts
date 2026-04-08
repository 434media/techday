import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"

export const dynamic = "force-dynamic"
export const revalidate = 60

const FINALIST_COMPANIES = [
  "Freyya, Inc.",
  "Openlane",
  "RentBamboo",
  "Bytewhisper Security, Inc.",
  "ComeBack Mobility",
]

export async function GET() {
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ finalists: [] })
  }

  try {
    const pitchSnap = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .get()

    const finalists = []
    for (const doc of pitchSnap.docs) {
      const data = doc.data()
      if (FINALIST_COMPANIES.some((name) => name.toLowerCase() === data.companyName?.toLowerCase())) {
        finalists.push({
          companyName: data.companyName,
          logoUrl: data.logoUrl || "",
          website: data.website || "",
        })
      }
    }

    // Sort by FINALIST_COMPANIES order
    finalists.sort((a, b) => {
      const aIdx = FINALIST_COMPANIES.findIndex((n) => n.toLowerCase() === a.companyName.toLowerCase())
      const bIdx = FINALIST_COMPANIES.findIndex((n) => n.toLowerCase() === b.companyName.toLowerCase())
      return aIdx - bIdx
    })

    return NextResponse.json({ finalists })
  } catch (error) {
    console.error("Public finalists fetch error:", error)
    return NextResponse.json({ finalists: [] })
  }
}
