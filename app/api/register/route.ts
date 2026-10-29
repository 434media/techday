import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type RegistrationDocument, ECOSYSTEM_TOURS_LIMIT } from "@/lib/firebase/collections"
import { sendRegistrationConfirmation } from "@/lib/email/resend"
import crypto from "crypto"

// Registration limits per event
const REGISTRATION_LIMITS: Record<string, number> = {
  techfuel: 300,
  techday: 550,
}

// The one success response for POST, identical for new and already-registered
// emails. The ticket ID is delivered by email only, never in the response.
const REGISTRATION_ACCEPTED = {
  success: true,
  message: "Registration received. Check your email for your ticket.",
} as const

// Helper to count registrations per event (handles legacy "2day" entries)
async function getEventCounts(): Promise<Record<string, number>> {
  const snapshot = await adminDb
    .collection(COLLECTIONS.REGISTRATIONS)
    .where("status", "in", ["confirmed", "pending", "checked-in"])
    .get()

  const counts: Record<string, number> = { techday: 0, techfuel: 0 }

  for (const doc of snapshot.docs) {
    const events: string[] = doc.data().events || []
    // "2day" legacy entries count for both events
    if (events.includes("2day")) {
      counts.techday++
      counts.techfuel++
    } else {
      if (events.includes("techday")) counts.techday++
      if (events.includes("techfuel")) counts.techfuel++
    }
  }

  return counts
}

export async function POST(request: Request) {
  try {
    // Verify the request is not from a bot using BotID
    // Can be disabled via DISABLE_BOT_PROTECTION=true env var for debugging
    if (process.env.DISABLE_BOT_PROTECTION !== "true") {
      const verification = await checkBotId()
      if (verification.isBot) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Firebase is not configured. Please contact the administrator." },
        { status: 503 }
      )
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "category"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Normalize events — convert "2day" to ["techday", "techfuel"]
    let selectedEvents: string[] = data.events || ["techday"]
    if (selectedEvents.includes("2day")) {
      selectedEvents = [...new Set([...selectedEvents.filter((e: string) => e !== "2day"), "techday", "techfuel"])]
    }

    // Check registration capacity for each selected event
    const eventCounts = await getEventCounts()
    for (const event of selectedEvents) {
      const limit = REGISTRATION_LIMITS[event]
      if (limit && eventCounts[event] >= limit) {
        const eventLabel = event === "techday" ? "Tech Day Conference" : "Tech Fuel Pitch Competition"
        return NextResponse.json(
          { error: `${eventLabel} has reached venue capacity. Follow @techbloc on Instagram and LinkedIn for updates and results. @devsatx (DEVSA) will be sharing live updates throughout the day.` },
          { status: 409 }
        )
      }
    }

    // Existing registration with the same email: answer exactly as for a new
    // registration so the response never reveals whether an address is
    // registered. The ticket is re-sent to the address on file (using the stored
    // record, not the submitted fields), so the real owner can recover it.
    const existingRegistration = await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .where("email", "==", data.email.toLowerCase().trim())
      .limit(1)
      .get()

    if (!existingRegistration.empty) {
      const existing = existingRegistration.docs[0].data() as RegistrationDocument
      // A cancelled ticket is not re-sent; the response is still the same.
      if (existing.status !== "cancelled" && existing.ticketId) {
        const resendResult = await sendRegistrationConfirmation(
          existing.email,
          existing.firstName,
          existing.lastName,
          existing.ticketId,
          existing.category,
          existing.events,
          existing.ecosystemTours
        )
        if (!resendResult.success) {
          console.warn(`Duplicate registration attempt; re-sending confirmation failed for ${existing.email}`)
        }
      }
      return NextResponse.json(REGISTRATION_ACCEPTED)
    }

    // Check ecosystem tours capacity if requested
    if (data.ecosystemTours === true) {
      const ecoSnapshot = await adminDb
        .collection(COLLECTIONS.REGISTRATIONS)
        .where("ecosystemTours", "==", true)
        .where("status", "in", ["confirmed", "pending", "checked-in"])
        .get()
      if (ecoSnapshot.size >= ECOSYSTEM_TOURS_LIMIT) {
        // Silently disable ecosystem tours - registration continues without it
        data.ecosystemTours = false
      }
    }

    // Generate unique ticket ID
    const ticketId = `TD26-${crypto.randomBytes(3).toString("hex").toUpperCase()}`

    // Create registration document
    const registration: RegistrationDocument = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      category: data.category,
      company: data.company?.trim() || "",
      title: data.title?.trim() || "",
      events: selectedEvents,
      ecosystemTours: data.ecosystemTours === true,
      dietaryRestrictions: data.dietaryRestrictions?.trim() || "",
      ticketId,
      status: "confirmed",
      createdAt: new Date(),
      updatedAt: new Date(),
      source: "website",
    }

    // Save to Firestore
    const docRef = await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .add(registration)

    console.log(`New registration created: ${docRef.id} - ${ticketId}`)

    // Send confirmation email with events for dynamic content
    const emailResult = await sendRegistrationConfirmation(
      registration.email,
      registration.firstName,
      registration.lastName,
      ticketId,
      registration.category,
      registration.events,
      registration.ecosystemTours
    )

    if (!emailResult.success) {
      console.warn(`Registration saved but email failed for ${registration.email}`)
    }

    return NextResponse.json(REGISTRATION_ACCEPTED)
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 }
    )
  }
}

// GET endpoint: public capacity check only (used by the registration form).
// Per-registrant lookup by email or ticket ID was removed: it let anyone confirm
// whether an address was registered and read the registrant's name.
export async function GET(request: Request) {
  try {
    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Firebase is not configured. Please contact the administrator." },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)

    if (searchParams.get("capacity") !== "true") {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const counts = await getEventCounts()
    const ecoSnapshot = await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .where("ecosystemTours", "==", true)
      .where("status", "in", ["confirmed", "pending", "checked-in"])
      .get()
    const ecoCount = ecoSnapshot.size
    return NextResponse.json({
      capacity: {
        techday: { count: counts.techday, limit: REGISTRATION_LIMITS.techday },
        techfuel: { count: counts.techfuel, limit: REGISTRATION_LIMITS.techfuel },
        ecosystemTours: { count: ecoCount, limit: ECOSYSTEM_TOURS_LIMIT },
      },
    })
  } catch (error) {
    console.error("Capacity lookup error:", error)
    return NextResponse.json(
      { error: "Failed to look up capacity" },
      { status: 500 }
    )
  }
}
