import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type RegistrationDocument } from "@/lib/firebase/collections"
import { sendRegistrationConfirmation } from "@/lib/email/resend"
import crypto from "crypto"

// Registration limits per event
const REGISTRATION_LIMITS: Record<string, number> = {
  techfuel: 200,
  techday: 300,
}

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

    // Check for existing registration with same email
    const existingRegistration = await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .where("email", "==", data.email.toLowerCase())
      .get()

    if (!existingRegistration.empty) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 }
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
          { error: `${eventLabel} has reached capacity (${limit} registrations). Please select a different event.` },
          { status: 409 }
        )
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
      registration.events
    )

    if (!emailResult.success) {
      console.warn(`Registration saved but email failed for ${registration.email}`)
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 }
    )
  }
}

// GET endpoint to check registration status or capacity
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

    // Capacity check endpoint
    if (searchParams.get("capacity") === "true") {
      const counts = await getEventCounts()
      return NextResponse.json({
        capacity: {
          techday: { count: counts.techday, limit: REGISTRATION_LIMITS.techday },
          techfuel: { count: counts.techfuel, limit: REGISTRATION_LIMITS.techfuel },
        },
      })
    }

    const ticketId = searchParams.get("ticketId")
    const email = searchParams.get("email")

    if (!ticketId && !email) {
      return NextResponse.json(
        { error: "Please provide ticketId or email" },
        { status: 400 }
      )
    }

    let query = adminDb.collection(COLLECTIONS.REGISTRATIONS)

    if (ticketId) {
      query = query.where("ticketId", "==", ticketId) as typeof query
    } else if (email) {
      query = query.where("email", "==", email.toLowerCase()) as typeof query
    }

    const snapshot = await query.get()

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      )
    }

    const doc = snapshot.docs[0]
    const data = doc.data()

    return NextResponse.json({
      ticketId: data.ticketId,
      firstName: data.firstName,
      lastName: data.lastName,
      category: data.category,
      events: data.events,
      status: data.status,
    })
  } catch (error) {
    console.error("Registration lookup error:", error)
    return NextResponse.json(
      { error: "Failed to lookup registration" },
      { status: 500 }
    )
  }
}
