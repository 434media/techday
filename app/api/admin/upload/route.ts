import { NextResponse } from "next/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { verifyAdminSession, sessionHasPermission } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

// Client-side upload: handles the token handshake for direct browser-to-blob uploads.
// This bypasses the 4.5MB serverless body limit — files up to 500MB are supported.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Authenticate and authorize
        const session = await verifyAdminSession()
        if (!session) {
          throw new Error("Unauthorized")
        }

        const hasSpeakersPermission = await sessionHasPermission("speakers", session)
        const hasSponsorsPermission = await sessionHasPermission("sponsors", session)
        const hasSchedulePermission = await sessionHasPermission("schedule", session)
        const hasPitchesPermission = await sessionHasPermission("pitches", session)

        if (!hasSpeakersPermission && !hasSponsorsPermission && !hasSchedulePermission && !hasPitchesPermission) {
          throw new Error("Permission denied")
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
            "application/pdf",
          ],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("[Upload] Completed:", blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    console.error("[Upload] Error:", message)
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : message === "Permission denied" ? 403 : 500 }
    )
  }
}
