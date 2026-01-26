import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type RegistrationDocument } from "@/lib/firebase/collections"
import { sendRegistrationConfirmation } from "@/lib/email/resend"
import crypto from "crypto"

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
      events: data.events || ["techday"],
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

// GET endpoint to check registration status (optional - for ticket lookup)
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
