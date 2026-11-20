import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import crypto from "crypto"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { isValidEmail } from "@/lib/validate-email"

const VOTE_COLLECTION = "votes"

// The Tech Fuel 2026 People's Choice vote ran live at the finals on April 20,
// 2026 and the winner has been announced. Set true to reopen for the next event
// (and update VOTE_FINALISTS).
const VOTING_OPEN = false

// Must match the finalist names offered on app/techfuel/vote/page.tsx.
const VOTE_FINALISTS = [
  "ComeBack Mobility",
  "Freyya",
  "Openlane",
  "Bytewhisper Security",
  "RentBamboo",
]

export async function POST(request: Request) {
  if (!VOTING_OPEN) {
    return NextResponse.json(
      { success: false, error: "Voting is closed", message: "Voting is closed. Thanks for your interest!" },
      { status: 410 }
    )
  }

  if (process.env.DISABLE_BOT_PROTECTION !== "true") {
    const verification = await checkBotId()
    if (verification.isBot) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 })
    }
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { success: false, message: "Service temporarily unavailable" },
      { status: 503 }
    )
  }

  try {
    const data = await request.json()
    const { email, finalist } = data

    // Validate required fields
    if (!email || !finalist) {
      return NextResponse.json(
        { success: false, message: "Email and finalist selection are required." },
        { status: 400 }
      )
    }

    if (typeof finalist !== "string" || !VOTE_FINALISTS.includes(finalist)) {
      return NextResponse.json(
        { success: false, message: "Please select one of the finalists." },
        { status: 400 }
      )
    }

    // Validate email format
    if (typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Legacy votes (auto IDs) are checked by query; new votes use a doc ID
    // derived from the email so create() below rejects a second vote atomically.
    const existingVote = await adminDb
      .collection(VOTE_COLLECTION)
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get()

    if (!existingVote.empty) {
      return NextResponse.json(
        { success: false, message: "This email has already been used to vote." },
        { status: 409 }
      )
    }

    // Look up registration to link vote
    const registrationSnapshot = await adminDb
      .collection(COLLECTIONS.REGISTRATIONS)
      .where("email", "==", normalizedEmail)
      .get()

    const isRegistered = !registrationSnapshot.empty
    const registrationId = isRegistered ? registrationSnapshot.docs[0].id : null

    // Save the vote
    const voteDoc = {
      email: normalizedEmail,
      finalist,
      isRegistered,
      registrationId,
      createdAt: new Date(),
    }

    const voteId = crypto.createHash("sha256").update(normalizedEmail).digest("hex")
    const docRef = adminDb.collection(VOTE_COLLECTION).doc(voteId)
    try {
      await docRef.create(voteDoc)
    } catch (err) {
      // gRPC ALREADY_EXISTS (6): this email voted in a concurrent request.
      if ((err as { code?: number }).code === 6) {
        return NextResponse.json(
          { success: false, message: "This email has already been used to vote." },
          { status: 409 }
        )
      }
      throw err
    }

    return NextResponse.json({
      success: true,
      voteId: docRef.id,
      isRegistered,
      message: isRegistered
        ? "Vote recorded! Thank you for voting."
        : "Vote recorded! Register for Tech Fuel to attend the finals live.",
    })
  } catch (error) {
    console.error("Vote submission error:", error)
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
