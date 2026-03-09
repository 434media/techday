import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type JudgeSchedulingDocument } from "@/lib/firebase/collections"
import { sendJudgeSchedulingConfirmation } from "@/lib/email/resend"

// Slot capacity
const MAX_PER_SLOT = 5

// Valid slots configuration
const VALID_SLOTS: Record<string, string[]> = {
  "2026-04-02": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM", "1:00 PM - 2:30 PM"],
  "2026-04-03": ["9:00 AM - 10:30 AM", "11:00 AM - 12:30 PM"],
}

// Get current slot counts
async function getSlotCounts(): Promise<Record<string, number>> {
  const snapshot = await adminDb
    .collection(COLLECTIONS.JUDGE_SCHEDULING)
    .get()

  const counts: Record<string, number> = {}
  for (const doc of snapshot.docs) {
    const data = doc.data()
    const key = `${data.date}|${data.timeSlot}`
    counts[key] = (counts[key] || 0) + 1
  }
  return counts
}

export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Firebase is not configured." },
        { status: 503 }
      )
    }

    const counts = await getSlotCounts()
    const availability: Record<string, Record<string, { total: number; remaining: number }>> = {}

    for (const [date, slots] of Object.entries(VALID_SLOTS)) {
      availability[date] = {}
      for (const slot of slots) {
        const key = `${date}|${slot}`
        const taken = counts[key] || 0
        availability[date][slot] = {
          total: MAX_PER_SLOT,
          remaining: Math.max(0, MAX_PER_SLOT - taken),
        }
      }
    }

    return NextResponse.json({ availability })
  } catch (error) {
    console.error("Judge scheduling availability error:", error)
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}

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
    if (!data.judgeName?.trim()) {
      return NextResponse.json({ error: "Judge name is required" }, { status: 400 })
    }
    if (!data.date || !VALID_SLOTS[data.date]) {
      return NextResponse.json({ error: "Invalid date selected" }, { status: 400 })
    }
    if (!data.timeSlot || !VALID_SLOTS[data.date].includes(data.timeSlot)) {
      return NextResponse.json({ error: "Invalid time slot selected" }, { status: 400 })
    }

    // If custom name, email is required
    if (data.isCustomName) {
      if (!data.email?.trim()) {
        return NextResponse.json({ error: "Email is required for custom names" }, { status: 400 })
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
      }
    }

    // Check if this judge already registered
    const existingQuery = await adminDb
      .collection(COLLECTIONS.JUDGE_SCHEDULING)
      .where("judgeName", "==", data.judgeName.trim())
      .get()

    if (!existingQuery.empty) {
      return NextResponse.json(
        { error: "This judge has already selected a time slot" },
        { status: 409 }
      )
    }

    // Check slot capacity
    const counts = await getSlotCounts()
    const slotKey = `${data.date}|${data.timeSlot}`
    const currentCount = counts[slotKey] || 0
    if (currentCount >= MAX_PER_SLOT) {
      return NextResponse.json(
        { error: "This time slot is full. Please select a different slot." },
        { status: 409 }
      )
    }

    const doc: JudgeSchedulingDocument = {
      judgeName: data.judgeName.trim(),
      email: (data.email || data.judgeEmail || "").toLowerCase().trim(),
      isCustomName: !!data.isCustomName,
      date: data.date,
      timeSlot: data.timeSlot,
      submittedAt: new Date(),
    }

    const docRef = await adminDb
      .collection(COLLECTIONS.JUDGE_SCHEDULING)
      .add(doc)

    console.log(`Judge scheduling: ${docRef.id} — ${doc.judgeName} on ${doc.date} at ${doc.timeSlot}`)

    // Send confirmation email if we have an email
    if (doc.email) {
      const emailResult = await sendJudgeSchedulingConfirmation(
        doc.email,
        doc.judgeName,
        doc.date,
        doc.timeSlot
      )
      if (!emailResult.success) {
        console.warn(`Judge scheduling saved but email failed for ${doc.email}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Time slot confirmed",
    })
  } catch (error) {
    console.error("Judge scheduling error:", error)
    return NextResponse.json(
      { error: "Failed to submit scheduling" },
      { status: 500 }
    )
  }
}
