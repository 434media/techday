import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Become a Sponsor — Tech Bloc, San Antonio"
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
            background: "linear-gradient(90deg, #ef4444, #dc2626)",
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
            Support San Antonio&apos;s Tech Community
          </div>
          <div
            style={{
              fontSize: "88px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            BECOME A
          </div>
          <div
            style={{
              fontSize: "88px",
              fontWeight: 800,
              color: "#ef4444",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            SPONSOR
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 300,
              marginTop: "16px",
              maxWidth: "650px",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Partner with Tech Bloc for Tech Day &amp; Tech Fuel 2026 — gain visibility among hundreds of local technologists
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
          sanantoniotechday.com/sponsor
        </div>
      </div>
    ),
    { ...size }
  )
}
