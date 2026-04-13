import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "San Antonio Tech Bloc 10th Anniversary Celebration"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #f97316, #ef4444, #ec4899)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "#f97316",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            A Decade of Building Community
          </div>
          <div
            style={{
              fontSize: "144px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            10
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#ef4444",
              lineHeight: 1,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Years
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 300,
              marginTop: "16px",
              maxWidth: "600px",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Celebrating 10 years of San Antonio Tech Bloc — building and supporting the tech community
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          sanantoniotechday.com/anniversary
        </div>
      </div>
    ),
    { ...size }
  )
}
