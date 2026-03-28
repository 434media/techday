// One-time script to send preview semi-finalist email to jesse@434media.com
// Run with: npx tsx scripts/send-preview-email.ts

import { readFileSync } from "fs"
import { resolve } from "path"
import { Resend } from "resend"

// Load .env.local manually
const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8")
for (const line of envFile.split("\n")) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue
  const eqIdx = trimmed.indexOf("=")
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx).trim()
  let val = trimmed.slice(eqIdx + 1).trim()
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  process.env[key] = val
}

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = "Beto Altamirano <ceo@send.satechbloc.com>"
const REPLY_TO = "ceo@satechbloc.com"

const DOWN_ARROW_SVG = `<svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.15;">
  <rect x="45" y="5" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="15" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="25" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="35" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="45" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="55" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="65" width="10" height="10" fill="#c73030"/>
  <rect x="35" y="65" width="10" height="10" fill="#c73030"/>
  <rect x="25" y="55" width="10" height="10" fill="#c73030"/>
  <rect x="55" y="65" width="10" height="10" fill="#c73030"/>
  <rect x="65" y="55" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="75" width="10" height="10" fill="#c73030"/>
</svg>`

const BETO_SIGNATURE_URL = "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/signature.PNG?alt=media"

const ZOOM_MEETINGS: Record<string, { url: string; meetingId: string; passcode: string }> = {
  "2026-04-02": {
    url: "https://us06web.zoom.us/j/84733840136?pwd=WfCT50nnaUvgGV9PwWe3zgAeM1nt5Y.1",
    meetingId: "847 3384 0136",
    passcode: "Techbloc",
  },
  "2026-04-03": {
    url: "https://us06web.zoom.us/j/81595831528?pwd=HnDxWd4sU0RoKezdGsZEaGS7Ajqmif.1",
    meetingId: "815 9583 1528",
    passcode: "Techbloc",
  },
}

// Preview data
const previewEmail = "jesse@434media.com"
const founderName = "Elton John"
const companyName = "Rocketman"
const date = "2026-04-02"
const pitchSlot = "9:05 AM - 9:15 AM"
const judgeBlock = "9:00 AM - 10:30 AM"
const zoom = ZOOM_MEETINGS[date]
const dateLabel = "Thursday, April 2, 2026"

const content = `
  <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
    Hey ${founderName},
  </h2>
  
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    <strong>${companyName}</strong> has been selected as a <strong>2026 TechFuel Semi-Finalist!</strong>
  </p>
  
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    We reviewed a strong pool of applicants, and your company stood out. We're looking forward to learning more about what you're building.
  </p>
  
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    As part of the next round, you'll pitch live via Zoom to a panel of five judges. The format will be a <strong>5-minute pitch</strong> followed by a <strong>5-minute Q&A</strong>.
  </p>
  
  <!-- Session Card -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
    <tr>
      <td style="background-color: #0a0a0a; border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
          ${DOWN_ARROW_SVG}
        </div>
        
        <p style="margin: 0 0 15px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
          Your Semi-Finals Interview
        </p>
        
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
              <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Date</p>
              <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${dateLabel}</p>
            </td>
            <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
              <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Pitch Time</p>
              <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500; font-family: 'JetBrains Mono', monospace;">${pitchSlot}</p>
            </td>
          </tr>
          <tr>
            <td width="50%" style="vertical-align: top;">
              <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Company</p>
              <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${companyName}</p>
            </td>
            <td width="50%" style="vertical-align: top;">
              <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Format</p>
              <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">5 min pitch + 5 min Q&A</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  
  <!-- Zoom Details -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
    <tr>
      <td style="background-color: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 25px;">
        <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 16px; font-weight: 600;">
          📹 Zoom Meeting Details
        </h3>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-bottom: 10px;">
              <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Join Link</p>
              <p style="margin: 0;">
                <a href="${zoom.url}" style="color: #2563eb; text-decoration: underline; font-size: 14px; word-break: break-all;">
                  Click here to join Zoom meeting
                </a>
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-right: 30px;">
                    <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Meeting ID</p>
                    <p style="margin: 0; color: #0a0a0a; font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500;">${zoom.meetingId}</p>
                  </td>
                  <td>
                    <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Passcode</p>
                    <p style="margin: 0; color: #0a0a0a; font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500;">${zoom.passcode}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    If you have any questions, feel free to reply directly to this email.
  </p>
  
  <p style="margin: 0 0 10px; color: #525252; font-size: 16px; line-height: 1.6;">
    We look forward to your pitch.
  </p>
  
  <p style="margin: 0 0 5px; color: #525252; font-size: 16px; line-height: 1.6;">
    Best,
  </p>
  
  <!-- Beto Signature -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0 0;">
    <tr>
      <td>
        <img src="${BETO_SIGNATURE_URL}" alt="Beto Altamirano signature" width="180" style="display: block; max-width: 180px; height: auto;" />
      </td>
    </tr>
    <tr>
      <td style="padding-top: 10px;">
        <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">Beto Altamirano</p>
        <p style="margin: 3px 0 0; color: #737373; font-size: 14px;">CEO, Tech Bloc</p>
      </td>
    </tr>
  </table>
`

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tech Day 2026</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #0a0a0a; padding: 40px 40px 30px; text-align: center; position: relative;">
              <div style="position: absolute; top: 20px; right: 20px; opacity: 0.15;">
                ${DOWN_ARROW_SVG}
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                TECH FUEL <span style="color: #c73030;">2026</span>
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
                April 20, 2026 • 2:00–6:00 PM • UTSA SP1
              </p>
              <p style="margin: 6px 0 0;">
                <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none; font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;">sanantoniotechday.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a0a0a; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 15px; color: rgba(255,255,255,0.7); font-size: 13px;">Save this email — it contains your Zoom details and pitch time</p>
              <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 12px;">
                © 2026 Tech Bloc & 434 MEDIA • San Antonio, TX
              </p>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.4); font-size: 11px;">
                <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none;">sanantoniotechday.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

async function main() {
  console.log(`Sending preview email to ${previewEmail}...`)
  console.log(`From: ${FROM_EMAIL}`)
  console.log(`Reply-To: ${REPLY_TO}`)
  
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: previewEmail,
      replyTo: REPLY_TO,
      subject: "TechFuel 2026 Application Update",
      html,
    })

    if (result.error) {
      console.error("Resend API error:", result.error)
      process.exit(1)
    }

    console.log("Preview email sent successfully!", result)
  } catch (error) {
    console.error("Failed to send:", error)
    process.exit(1)
  }
}

main()
