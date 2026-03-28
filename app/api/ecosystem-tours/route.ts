import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, ECOSYSTEM_TOURS_LIMIT } from "@/lib/firebase/collections"

// Helper to count current ecosystem tours registrations
async function getEcosystemToursCount(): Promise<number> {
  const snapshot = await adminDb
    .collection(COLLECTIONS.REGISTRATIONS)
    .where("ecosystemTours", "==", true)
    .where("status", "in", ["confirmed", "pending", "checked-in"])
    .get()
  return snapshot.size
}

export async function POST(request: Request) {
  try {
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

    if (!data.firstName?.trim() || !data.lastName?.trim() || !data.email?.trim()) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const email = data.email.toLowerCase().trim()
    const firstName = data.firstName.trim()
    const lastName = data.lastName.trim()

    // Handle waitlist signup
    if (data.waitlist === true) {
      // Check if already on waitlist
      const existingWaitlist = await adminDb
        .collection(COLLECTIONS.ECOSYSTEM_TOURS_WAITLIST)
        .where("email", "==", email)
        .get()

      if (!existingWaitlist.empty) {
        return NextResponse.json(
          { error: "You're already on the ecosystem tours waitlist!" },
          { status: 409 }
        )
      }

      await adminDb.collection(COLLECTIONS.ECOSYSTEM_TOURS_WAITLIST).add({
        firstName,
        lastName,
        email,
        createdAt: new Date(),
      })

      console.log(`Ecosystem tours waitlist signup for ${email}`)

      return NextResponse.json({
        success: true,
        waitlisted: true,
        message: "You've been added to the ecosystem tours waitlist! We'll notify you if spots open up.",
      })
    }

    // Look up existing registration by email
    const snapshot = await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .where("email", "==", email)
      .get()

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "No registration found with this email. Please register first at sanantoniotechday.com/register" },
        { status: 404 }
      )
    }

    const doc = snapshot.docs[0]
    const registration = doc.data()

    // Verify name matches (case-insensitive)
    if (
      registration.firstName?.toLowerCase() !== firstName.toLowerCase() ||
      registration.lastName?.toLowerCase() !== lastName.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Name does not match the registration on file. Please use the same name you registered with." },
        { status: 400 }
      )
    }

    // Check if already opted in
    if (registration.ecosystemTours === true) {
      return NextResponse.json(
        { error: "You're already registered for ecosystem tours!" },
        { status: 409 }
      )
    }

    // Check ecosystem tours capacity
    const currentCount = await getEcosystemToursCount()
    if (currentCount >= ECOSYSTEM_TOURS_LIMIT) {
      return NextResponse.json(
        { error: "Ecosystem tours have reached capacity. Please join the waitlist to be notified if spots open up.", isFull: true },
        { status: 409 }
      )
    }

    // Update the registration
    await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .doc(doc.id)
      .update({
        ecosystemTours: true,
        updatedAt: new Date(),
      })

    console.log(`Ecosystem tours opt-in updated for ${email} (doc: ${doc.id})`)

    return NextResponse.json({
      success: true,
      message: "You're signed up for ecosystem tours!",
      ticketId: registration.ticketId,
    })
  } catch (error) {
    console.error("Ecosystem tours opt-in error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}

// GET endpoint to check ecosystem tours capacity
export async function GET() {
  try {
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Firebase is not configured." },
        { status: 503 }
      )
    }

    const count = await getEcosystemToursCount()
    return NextResponse.json({
      ecosystemTours: {
        count,
        limit: ECOSYSTEM_TOURS_LIMIT,
        remaining: Math.max(0, ECOSYSTEM_TOURS_LIMIT - count),
        isFull: count >= ECOSYSTEM_TOURS_LIMIT,
      },
    })
  } catch (error) {
    console.error("Ecosystem tours capacity check error:", error)
    return NextResponse.json(
      { error: "Failed to check capacity" },
      { status: 500 }
    )
  }
}
