import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { adminDb, isFirebaseConfigured } from "@/lib/firebase/admin"
import { COLLECTIONS, type SponsorContactDocument } from "@/lib/firebase/collections"
import { sendSponsorInquiryConfirmation } from "@/lib/email/resend"
import { isValidEmail } from "@/lib/validate-email"
import { maskEmail } from "@/lib/mask-email"

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

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: "Firebase is not configured. Please contact the administrator." },
        { status: 503 }
      )
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "company", "workEmail", "message"]
    for (const field of requiredFields) {
      if (!data[field]?.trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    if (!isValidEmail(data.workEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const contact: SponsorContactDocument = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      company: data.company.trim(),
      workEmail: data.workEmail.toLowerCase().trim(),
      phone: data.phone?.trim() || "",
      message: data.message.trim(),
      status: "new",
      submittedAt: new Date(),
    }

    const docRef = await adminDb
      .collection(COLLECTIONS.SPONSOR_CONTACTS)
      .add(contact)

    console.log(`New sponsor inquiry: ${docRef.id} — ${contact.company}`)

    // Send confirmation email
    const emailResult = await sendSponsorInquiryConfirmation(
      contact.workEmail,
      contact.firstName,
      contact.lastName,
      contact.company
    )

    if (!emailResult.success) {
      console.warn("Sponsor inquiry saved but email failed for %s", maskEmail(contact.workEmail))
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
    })
  } catch (error) {
    console.error("Sponsor contact error:", error)
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    )
  }
}
