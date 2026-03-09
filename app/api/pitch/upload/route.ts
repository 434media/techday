import { NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { put } from "@vercel/blob"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    // Bot protection
    if (process.env.DISABLE_BOT_PROTECTION !== "true") {
      const verification = await checkBotId()
      if (verification.isBot) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Storage not configured" },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Only allow images
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, SVG" },
        { status: 400 }
      )
    }

    // Max 2MB for logos
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 2MB" },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `pitch-logos/${timestamp}-${sanitizedName}`

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error("[Pitch Logo Upload] Error:", error)
    return NextResponse.json(
      { error: "Failed to upload logo" },
      { status: 500 }
    )
  }
}
