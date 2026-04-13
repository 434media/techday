import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Tech Day 2026 — April 21 at Boeing Center at Tech Port, San Antonio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)",
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
            background: "#ef4444",
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
              color: "#ef4444",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            April 21, 2026 • Boeing Center at Tech Port
          </div>
          <div
            style={{
              fontSize: "108px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            TECH DAY
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#ef4444",
              lineHeight: 1,
            }}
          >
            2026
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 300,
              marginTop: "16px",
              maxWidth: "700px",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Emerging Industries • Founders &amp; Investors • AI — Three tracks powering San Antonio&apos;s future
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
          sanantoniotechday.com
        </div>
      </div>
    ),
    { ...size }
  )
}
