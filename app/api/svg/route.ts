import { NextResponse } from "next/server"

const SVG_URL = "https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg"

export async function GET() {
  try {
    const response = await fetch(SVG_URL, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch SVG" },
        { status: response.status }
      )
    }
    
    const svgText = await response.text()
    
    return new NextResponse(svgText, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    })
  } catch (error) {
    console.error("SVG proxy error:", error)
    return NextResponse.json(
      { error: "Failed to fetch SVG" },
      { status: 500 }
    )
  }
}
