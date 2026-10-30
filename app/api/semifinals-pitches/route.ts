import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type PitchSchedulingDocument } from "@/lib/firebase/collections"
import { sendPitchSchedulingConfirmation } from "@/lib/email/resend"

// Each pitch slot holds exactly 1 company
const MAX_PER_SLOT = 1

// Pitch slots within each judge block — 10-min pitches, 5-min gaps, starting at :05
const PITCH_SLOTS: Record<string, string[]> = {
  "9:00 AM - 10:30 AM": [
    "9:05 AM - 9:15 AM",
    "9:20 AM - 9:30 AM",
    "9:35 AM - 9:45 AM",
    "9:50 AM - 10:00 AM",
    "10:05 AM - 10:15 AM",
  ],
  "11:00 AM - 12:30 PM": [
    "11:05 AM - 11:15 AM",
    "11:20 AM - 11:30 AM",
    "11:35 AM - 11:45 AM",
    "11:50 AM - 12:00 PM",
    "12:05 PM - 12:15 PM",
  ],
  "1:00 PM - 2:30 PM": [
    "1:05 PM - 1:15 PM",
    "1:20 PM - 1:30 PM",
    "1:35 PM - 1:45 PM",
    "1:50 PM - 2:00 PM",
    "2:05 PM - 2:15 PM",
  ],
}

// Valid judge blocks per date
const JUDGE_BLOCKS: Record<string, string[]> = {
  "2026-04-02": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "1:00 PM - 2:30 PM"],
  "2026-04-03": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM"],
}

// Get slots already taken
async function getTakenSlots(): Promise<Set<string>> {
  const snapshot = await adminDb
    .collection(COLLECTIONS.PITCH_SCHEDULING)
    .get()

  const taken = new Set<string>()
  for (const doc of snapshot.docs) {
    const data = doc.data()
    taken.add(`${data.date}|${data.judgeBlock}|${data.pitchSlot}`)
  }
  return taken
}

// GET: Return availability for all pitch slots
export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json({ error: "Firebase is not configured." }, { status: 503 })
    }

    const taken = await getTakenSlots()

    // Also fetch approved pitches for the dropdown. This route is public, so the
    // response carries only the id and company name — never the founder's name
    // or email. POST looks those up server-side from the id.
    const pitchesSnapshot = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .where("status", "==", "accepted")
      .get()

    const approvedPitches = pitchesSnapshot.docs.map((doc) => ({
      id: doc.id,
      companyName: doc.data().companyName as string,
    }))

    // Check which companies already have a scheduled pitch
    const scheduledSnapshot = await adminDb
      .collection(COLLECTIONS.PITCH_SCHEDULING)
      .get()

    const scheduledCompanies = new Set(
      scheduledSnapshot.docs.map((doc) => doc.data().companyName)
    )

    const availability: Record<string, Record<string, Record<string, boolean>>> = {}

    for (const [date, blocks] of Object.entries(JUDGE_BLOCKS)) {
      availability[date] = {}
      for (const block of blocks) {
        availability[date][block] = {}
        const slots = PITCH_SLOTS[block] || []
        for (const slot of slots) {
          const key = `${date}|${block}|${slot}`
          availability[date][block][slot] = !taken.has(key)
        }
      }
    }

    return NextResponse.json({
      availability,
      approvedPitches: approvedPitches.filter((p) => !scheduledCompanies.has(p.companyName)),
    })
  } catch (error) {
    console.error("Pitch scheduling availability error:", error)
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 })
  }
}

// POST: Submit a pitch time selection
export async function POST(request: Request) {
  try {
    // Bot protection
    if (process.env.DISABLE_BOT_PROTECTION !== "true") {
      const verification = await checkBotId()
      if (verification.isBot) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Firebase is not configured. Please contact the administrator." },
        { status: 503 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (typeof data.pitchId !== "string" || !data.pitchId.trim()) {
      return NextResponse.json({ error: "Please select your company" }, { status: 400 })
    }
    if (!data.date || !JUDGE_BLOCKS[data.date]) {
      return NextResponse.json({ error: "Invalid date selected" }, { status: 400 })
    }
    if (!data.judgeBlock || !JUDGE_BLOCKS[data.date].includes(data.judgeBlock)) {
      return NextResponse.json({ error: "Invalid judge block selected" }, { status: 400 })
    }
    const validPitchSlots = PITCH_SLOTS[data.judgeBlock] || []
    if (!data.pitchSlot || !validPitchSlots.includes(data.pitchSlot)) {
      return NextResponse.json({ error: "Invalid pitch slot selected" }, { status: 400 })
    }

    // Resolve the company, founder and email from the accepted submission
    // rather than trusting the client — the public GET no longer exposes them.
    const pitchDoc = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .doc(data.pitchId.trim())
      .get()
    const pitch = pitchDoc.data()
    if (!pitchDoc.exists || !pitch || pitch.status !== "accepted") {
      return NextResponse.json({ error: "Please select your company" }, { status: 400 })
    }
    const companyName = String(pitch.companyName ?? "").trim()
    const founderName = String(pitch.founderName ?? "").trim()
    const email = String(pitch.email ?? "").toLowerCase().trim()
    if (!companyName) {
      return NextResponse.json({ error: "Please select your company" }, { status: 400 })
    }

    // Check if this company already scheduled
    const existingQuery = await adminDb
      .collection(COLLECTIONS.PITCH_SCHEDULING)
      .where("companyName", "==", companyName)
      .get()

    if (!existingQuery.empty) {
      return NextResponse.json(
        { error: "This company has already selected a pitch time" },
        { status: 409 }
      )
    }

    // Check slot availability
    const taken = await getTakenSlots()
    const slotKey = `${data.date}|${data.judgeBlock}|${data.pitchSlot}`
    if (taken.has(slotKey)) {
      return NextResponse.json(
        { error: "This pitch slot has already been taken. Please select a different time." },
        { status: 409 }
      )
    }

    const doc: PitchSchedulingDocument = {
      companyName,
      founderName,
      email,
      date: data.date,
      judgeBlock: data.judgeBlock,
      pitchSlot: data.pitchSlot,
      submittedAt: new Date(),
    }

    const docRef = await adminDb
      .collection(COLLECTIONS.PITCH_SCHEDULING)
      .add(doc)

    console.log(`Pitch scheduling: ${docRef.id} — ${doc.companyName} on ${doc.date} at ${doc.pitchSlot}`)

    // Send confirmation email
    if (doc.email) {
      const emailResult = await sendPitchSchedulingConfirmation(
        doc.email,
        doc.companyName,
        doc.founderName,
        doc.date,
        doc.pitchSlot,
        doc.judgeBlock
      )
      if (!emailResult.success) {
        console.error("Pitch scheduling email failed but submission saved")
      }
    }

    return NextResponse.json({
      success: true,
      id: docRef.id,
    })
  } catch (error) {
    console.error("Pitch scheduling submission error:", error)
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }
}
