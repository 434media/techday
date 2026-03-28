import { NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/admin/session"
import { sendPitchSemifinalsNotification } from "@/lib/email/resend"

export const dynamic = "force-dynamic"

// Admin: send a preview semi-finalist notification email
export async function POST(request: Request) {
  const session = await verifyAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const previewEmail = data.previewEmail || "jesse@434media.com"

    // Send preview with sample data
    const result = await sendPitchSemifinalsNotification(
      previewEmail,
      data.founderName || "Jesse",
      data.companyName || "Sample Startup Co",
      data.date || "2026-04-02",
      data.pitchSlot || "9:05 AM - 9:15 AM",
      data.judgeBlock || "9:00 AM - 10:30 AM"
    )

    if (!result.success) {
      return NextResponse.json({ error: "Failed to send preview email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, sentTo: previewEmail })
  } catch (error) {
    console.error("Preview email error:", error)
    return NextResponse.json({ error: "Failed to send preview email" }, { status: 500 })
  }
}
