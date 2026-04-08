import { NextResponse } from "next/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"

const VOTE_COLLECTION = "votes"

export async function POST(request: Request) {
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if this email has already voted
    const existingVote = await adminDb
      .collection(VOTE_COLLECTION)
      .where("email", "==", normalizedEmail)
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

    const docRef = await adminDb.collection(VOTE_COLLECTION).add(voteDoc)

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
