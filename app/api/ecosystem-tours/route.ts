import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, ECOSYSTEM_TOURS_LIMIT } from "@/lib/firebase/collections"
import { sendEcosystemToursOptInConfirmation } from "@/lib/email/resend"
import { maskEmail } from "@/lib/mask-email"
import { isValidEmail } from "@/lib/validate-email"

// Uniform success bodies: identical whatever the lookup found.
const OPT_IN_ACCEPTED = {
  success: true,
  message: "If that name and email match a Tech Fuel registration, ecosystem tours are added and a confirmation is on its way to your inbox.",
} as const

const WAITLIST_ACCEPTED = {
  success: true,
  waitlisted: true,
  message: "You're on the ecosystem tours waitlist. We'll notify you if spots open up.",
} as const

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

    if (!isValidEmail(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const email = data.email.toLowerCase().trim()
    const firstName = data.firstName.trim()
    const lastName = data.lastName.trim()

    // Handle waitlist signup. Same response whether or not the email is
    // already on the waitlist, so the endpoint can't be used to test addresses.
    if (data.waitlist === true) {
      const existingWaitlist = await adminDb
        .collection(COLLECTIONS.ECOSYSTEM_TOURS_WAITLIST)
        .where("email", "==", email)
        .limit(1)
        .get()

      if (existingWaitlist.empty) {
        await adminDb.collection(COLLECTIONS.ECOSYSTEM_TOURS_WAITLIST).add({
          firstName,
          lastName,
          email,
          createdAt: new Date(),
        })
        console.log("Ecosystem tours waitlist signup for %s", maskEmail(email))
      }

      return NextResponse.json(WAITLIST_ACCEPTED)
    }

    // Capacity is public (see GET), so checking it first reveals nothing about
    // any registrant and keeps the error order the same for every email.
    const currentCount = await getEcosystemToursCount()
    if (currentCount >= ECOSYSTEM_TOURS_LIMIT) {
      return NextResponse.json(
        { error: "Ecosystem tours have reached capacity. Please join the waitlist to be notified if spots open up.", isFull: true },
        { status: 409 }
      )
    }

    // Opt-in. Every outcome (no registration, name mismatch, already opted in,
    // newly opted in) returns the same body: the response must not reveal
    // whether an email is registered, and never carries the ticket ID.
    // Only a matching registration is updated, and only its address on file
    // gets the confirmation email.
    const snapshot = await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .where("email", "==", email)
      .limit(1)
      .get()

    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      const registration = doc.data()
      const nameMatches =
        registration.firstName?.toLowerCase() === firstName.toLowerCase() &&
        registration.lastName?.toLowerCase() === lastName.toLowerCase()
      const active = registration.status !== "cancelled"

      if (nameMatches && active) {
        if (registration.ecosystemTours !== true) {
          await adminDb
            .collection(COLLECTIONS.REGISTRATIONS)
            .doc(doc.id)
            .update({
              ecosystemTours: true,
              updatedAt: new Date(),
            })
          console.log("Ecosystem tours opt-in updated for %s (doc: %s)", maskEmail(email), doc.id)
        }
        const emailResult = await sendEcosystemToursOptInConfirmation(
          registration.email,
          registration.firstName,
          registration.events || ["techfuel"]
        )
        if (!emailResult.success) {
          console.warn("Ecosystem tours opt-in saved but confirmation email failed for %s", maskEmail(email))
        }
      } else {
        console.log("Ecosystem tours opt-in not applied for %s (name mismatch or cancelled)", maskEmail(email))
      }
    } else {
      console.log("Ecosystem tours opt-in: no registration for %s", maskEmail(email))
    }

    return NextResponse.json(OPT_IN_ACCEPTED)
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
