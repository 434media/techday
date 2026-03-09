import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"

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
