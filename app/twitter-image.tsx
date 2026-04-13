import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Tech Day 2026 | Invented Here - San Antonio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
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
            background: "linear-gradient(90deg, #ef4444, #f97316, #ef4444)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              color: "#ef4444",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            San Antonio&apos;s Premier Tech Conference
          </div>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            TECH DAY 2026
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.6)",
              fontWeight: 300,
              marginTop: "8px",
            }}
          >
            Invented Here — November 2026
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "32px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span>Innovation</span>
          <span style={{ color: "#ef4444" }}>•</span>
          <span>Founders</span>
          <span style={{ color: "#ef4444" }}>•</span>
          <span>AI</span>
          <span style={{ color: "#ef4444" }}>•</span>
          <span>Community</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
