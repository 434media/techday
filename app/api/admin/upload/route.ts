import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { verifyAdminSession } from "@/lib/admin/session"
import { hasPermission } from "@/lib/admin/config"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  console.log("[Upload] Starting upload request...")
  
  const session = await verifyAdminSession()
  console.log("[Upload] Session result:", session ? `Found: ${session.email}` : "No session found")
  
  if (!session) {
    console.log("[Upload] Returning 401 - No valid session")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check for any content permission (speakers, sponsors, or schedule)
  const hasSpeakersPermission = hasPermission(session.email, "speakers")
  const hasSponsorsPermission = hasPermission(session.email, "sponsors")
  const hasSchedulePermission = hasPermission(session.email, "schedule")
  
  if (!hasSpeakersPermission && !hasSponsorsPermission && !hasSchedulePermission) {
    return NextResponse.json({ error: "Permission denied" }, { status: 403 })
  }

  // Check for Vercel Blob token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[Upload] BLOB_READ_WRITE_TOKEN not configured")
    return NextResponse.json({ 
      error: "Storage not configured. Please add BLOB_READ_WRITE_TOKEN to environment variables." 
    }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string || "uploads"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG" 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size: 5MB" 
      }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${folder}/${timestamp}-${sanitizedName}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    console.log("[Upload] Successfully uploaded:", blob.url)

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      filename: blob.pathname,
    })
  } catch (error) {
    console.error("[Upload] Error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
