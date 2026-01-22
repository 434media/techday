import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type NewsletterDocument } from "@/lib/firebase/collections"

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

    // Validate email
    if (!data.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const email = data.email.toLowerCase().trim()

    // Check if email is already subscribed
    const existingSubscriber = await adminDb
      .collection(COLLECTIONS.NEWSLETTER)
      .where("email", "==", email)
      .get()

    if (!existingSubscriber.empty) {
      const existingDoc = existingSubscriber.docs[0]
      const existingData = existingDoc.data()

      // If they were unsubscribed, resubscribe them
      if (existingData.status === "unsubscribed") {
        await adminDb.collection(COLLECTIONS.NEWSLETTER).doc(existingDoc.id).update({
          status: "active",
          subscribedAt: new Date(),
        })

        return NextResponse.json({
          success: true,
          message: "Welcome back! You have been resubscribed.",
        })
      }

      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      )
    }

    // Create newsletter subscription document
    const subscription: NewsletterDocument = {
      email,
      status: "active",
      subscribedAt: new Date(),
      source: data.source || "popup",
    }

    // Save to Firestore
    const docRef = await adminDb
      .collection(COLLECTIONS.NEWSLETTER)
      .add(subscription)

    console.log(`New newsletter subscription: ${docRef.id} - ${email}`)

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to the newsletter!",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "An error occurred while subscribing to the newsletter" },
      { status: 500 }
    )
  }
}
