import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { verifyAdminSession } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

// The 5 finalists — company names must match pitchSubmissions exactly
const FINALIST_COMPANIES = [
  "Freyya, Inc.",
  "Openlane",
  "RentBamboo",
  "Bytewhisper Security, Inc.",
  "ComeBack Mobility",
]

export async function GET() {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json({ finalists: [] })
  }

  try {
    // Fetch all pitch submissions
    const pitchSnap = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .get()

    const finalists = []
    for (const doc of pitchSnap.docs) {
      const data = doc.data()
      if (FINALIST_COMPANIES.some((name) => name.toLowerCase() === data.companyName?.toLowerCase())) {
        finalists.push({
          id: doc.id,
          companyName: data.companyName,
          founderName: data.founderName,
          email: data.email,
          phone: data.phone || "",
          website: data.website || "",
          stage: data.stage || "",
          industry: data.industry || "",
          pitch: data.pitch || "",
          problem: data.problem || "",
          solution: data.solution || "",
          traction: data.traction || "",
          teamSize: data.teamSize || "",
          fundingRaised: data.fundingRaised || "",
          fundingGoal: data.fundingGoal || "",
          deckUrl: data.deckUrl || "",
          logoUrl: data.logoUrl || "",
          status: data.status || "accepted",
          submittedAt: data.submittedAt?.toDate?.()?.toISOString() || data.submittedAt,
          finalDeckUrl: data.finalDeckUrl || "",
        })
      }
    }

    // Sort by the FINALIST_COMPANIES order
    finalists.sort((a, b) => {
      const aIdx = FINALIST_COMPANIES.findIndex((n) => n.toLowerCase() === a.companyName.toLowerCase())
      const bIdx = FINALIST_COMPANIES.findIndex((n) => n.toLowerCase() === b.companyName.toLowerCase())
      return aIdx - bIdx
    })

    return NextResponse.json({ finalists })
  } catch (error) {
    console.error("Admin finalists error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

// Update finalist data (e.g. final deck URL)
export async function PATCH(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, finalDeckUrl } = body

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const docRef = adminDb.collection(COLLECTIONS.PITCH_SUBMISSIONS).doc(id)
    const doc = await docRef.get()
    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await docRef.update({ finalDeckUrl: finalDeckUrl || "" })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin finalists PATCH error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
