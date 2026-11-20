import { NextResponse } from "next/server"
import { PITCH_INTAKE_OPEN, intakeClosed } from "@/lib/intake"
import { checkBotId } from "botid/server"
import { put } from "@vercel/blob"

export const dynamic = "force-dynamic"

function detectImageType(b: Uint8Array): { mime: string; ext: string } | null {
  const starts = (sig: number[], offset = 0) => sig.every((v, i) => b[offset + i] === v)
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { mime: "image/png", ext: "png" }
  if (starts([0xff, 0xd8, 0xff])) return { mime: "image/jpeg", ext: "jpg" }
  if (starts([0x47, 0x49, 0x46, 0x38])) return { mime: "image/gif", ext: "gif" } // GIF8
  if (starts([0x52, 0x49, 0x46, 0x46]) && starts([0x57, 0x45, 0x42, 0x50], 8)) return { mime: "image/webp", ext: "webp" } // RIFF....WEBP
  return null
}

export async function POST(request: Request) {
  try {
    if (!PITCH_INTAKE_OPEN) {
      return intakeClosed("Tech Fuel 2026 pitch applications are closed, so logo uploads are no longer accepted.")
    }

    // Bot protection
    if (process.env.DISABLE_BOT_PROTECTION !== "true") {
      const verification = await checkBotId()
      if (verification.isBot) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    // Keyless when BLOB_STORE_ID is set: @vercel/blob then authenticates with the
    // deployment's Vercel OIDC token. BLOB_READ_WRITE_TOKEN is the fallback.
    if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Storage not configured" },
        { status: 503 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Max 2MB for logos
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 2MB" },
        { status: 400 }
      )
    }

    // Only raster images, identified by their magic bytes (file.type is
    // client-supplied). SVG is not accepted: it can carry script.
    const bytes = new Uint8Array(await file.arrayBuffer())
    const detected = detectImageType(bytes)
    if (!detected) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      )
    }

    const baseName = file.name.replace(/\.[^.]*$/, "").replace(/[^a-zA-Z0-9-]/g, "_").slice(0, 60) || "logo"
    const filename = `pitch-logos/${baseName}.${detected.ext}`

    const blob = await put(filename, Buffer.from(bytes), {
      access: "public",
      addRandomSuffix: true,
      contentType: detected.mime,
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
