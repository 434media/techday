import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type PitchSubmissionDocument } from "@/lib/firebase/collections"

export async function POST(request: Request) {
  try {
    // Check for bot activity
    const verification = await checkBotId()
    if (verification.isBot) {
      return NextResponse.json(
        { error: "Bot detected. Access denied." },
        { status: 403 }
      )
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
    const requiredFields = [
      "companyName",
      "founderName",
      "email",
      "stage",
      "industry",
      "pitch",
      "problem",
      "solution",
    ]

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

    // Validate pitch length (should be a good elevator pitch)
    if (data.pitch.length < 50) {
      return NextResponse.json(
        { error: "Pitch description is too short. Please provide at least 50 characters." },
        { status: 400 }
      )
    }

    // Check for existing submission from same company/email
    const existingSubmission = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .where("email", "==", data.email.toLowerCase())
      .get()

    if (!existingSubmission.empty) {
      return NextResponse.json(
        { error: "You have already submitted a pitch application" },
        { status: 409 }
      )
    }

    // Create pitch submission document
    const pitchSubmission: PitchSubmissionDocument = {
      companyName: data.companyName.trim(),
      founderName: data.founderName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone?.trim() || "",
      website: data.website?.trim() || "",
      stage: data.stage,
      industry: data.industry,
      pitch: data.pitch.trim(),
      problem: data.problem.trim(),
      solution: data.solution.trim(),
      traction: data.traction?.trim() || "",
      teamSize: data.teamSize?.trim() || "",
      fundingRaised: data.fundingRaised?.trim() || "",
      fundingGoal: data.fundingGoal?.trim() || "",
      deckUrl: data.deckUrl?.trim() || "",
      status: "pending",
      submittedAt: new Date(),
    }

    // Save to Firestore
    const docRef = await adminDb
      .collection(COLLECTIONS.PITCH_SUBMISSIONS)
      .add(pitchSubmission)

    console.log(`New pitch submission created: ${docRef.id} - ${data.companyName}`)

    return NextResponse.json({
      success: true,
      submissionId: docRef.id,
      message: "Pitch application submitted successfully",
    })
  } catch (error) {
    console.error("Pitch submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit pitch application" },
      { status: 500 }
    )
  }
}

// GET endpoint for admin to retrieve pitch submissions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = adminDb.collection(COLLECTIONS.PITCH_SUBMISSIONS)

    if (status) {
      query = query.where("status", "==", status) as typeof query
    }

    // Order by submission date, newest first
    query = query.orderBy("submittedAt", "desc") as typeof query

    const snapshot = await query.get()

    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate?.()?.toISOString() || null,
      reviewedAt: doc.data().reviewedAt?.toDate?.()?.toISOString() || null,
    }))

    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions,
    })
  } catch (error) {
    console.error("Pitch submissions fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pitch submissions" },
      { status: 500 }
    )
  }
}
