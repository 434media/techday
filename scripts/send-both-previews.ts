// Send both preview emails to marcos, beto, cc jesse
// Run with: npx tsx scripts/send-both-previews.ts

import { readFileSync } from "fs"
import { resolve } from "path"
import { Resend } from "resend"

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
const TO = ["marcos@434media.com", "altamirano@irystechnologies.com"]
const CC = ["jesse@434media.com"]

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

function techFuelHeader() {
  return `
    <td style="background-color: #0a0a0a; padding: 40px 40px 30px; text-align: center; position: relative;">
      <div style="position: absolute; top: 20px; right: 20px; opacity: 0.15;">${DOWN_ARROW_SVG}</div>
      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
        TECH FUEL <span style="color: #c73030;">2026</span>
      </h1>
      <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
        April 20, 2026 • 2:00–6:00 PM • UTSA SP1
      </p>
      <p style="margin: 6px 0 0;">
        <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none; font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;">sanantoniotechday.com</a>
      </p>
    </td>`
}

function footer(footerText = "") {
  return `
    <td style="background-color: #0a0a0a; padding: 30px 40px; text-align: center;">
      ${footerText ? `<p style="margin: 0 0 15px; color: rgba(255,255,255,0.7); font-size: 13px;">${footerText}</p>` : ""}
      <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 12px;">© 2026 Tech Bloc & 434 MEDIA • San Antonio, TX</p>
      <p style="margin: 10px 0 0; color: rgba(255,255,255,0.4); font-size: 11px;">
        <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none;">sanantoniotechday.com</a>
      </p>
    </td>`
}

function wrap(headerHtml: string, content: string, footerText = "") {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Tech Fuel 2026</title></head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa;">
    <tr><td align="center" style="padding: 40px 20px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <tr>${headerHtml}</tr>
        <tr><td style="padding: 40px;">${content}</td></tr>
        <tr>${footer(footerText)}</tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

// --- Semi-finalist email ---
const sfName = "Elton John"
const sfCompany = "Rocketman"
const sfDate = "2026-04-02"
const sfSlot = "9:05 AM - 9:15 AM"
const zoom = ZOOM_MEETINGS[sfDate]

const semifinalistHtml = wrap(techFuelHeader(), `
  <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">Hey ${sfName},</h2>
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    <strong>${sfCompany}</strong> has been selected as a <strong>2026 TechFuel Semi-Finalist!</strong>
  </p>
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    We reviewed a strong pool of applicants, and your company stood out. We're looking forward to learning more about what you're building.
  </p>
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    As part of the next round, you'll pitch live via Zoom to a panel of five judges. The format will be a <strong>5-minute pitch</strong> followed by a <strong>5-minute Q&A</strong>.
  </p>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
    <tr><td style="background-color: #0a0a0a; border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
      <p style="margin: 0 0 15px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">Your Semi-Finals Interview</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
            <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Date</p>
            <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">Thursday, April 2, 2026</p>
          </td>
          <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
            <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Pitch Time</p>
            <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500; font-family: 'JetBrains Mono', monospace;">${sfSlot}</p>
          </td>
        </tr>
        <tr>
          <td width="50%" style="vertical-align: top;">
            <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Company</p>
            <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${sfCompany}</p>
          </td>
          <td width="50%" style="vertical-align: top;">
            <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Format</p>
            <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">5 min pitch + 5 min Q&A</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
    <tr><td style="background-color: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 25px;">
      <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 16px; font-weight: 600;">📹 Zoom Meeting Details</h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr><td style="padding-bottom: 10px;">
          <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Join Link</p>
          <p style="margin: 0;"><a href="${zoom.url}" style="color: #2563eb; text-decoration: underline; font-size: 14px; word-break: break-all;">Click here to join Zoom meeting</a></p>
        </td></tr>
        <tr><td>
          <table role="presentation" cellspacing="0" cellpadding="0"><tr>
            <td style="padding-right: 30px;">
              <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Meeting ID</p>
              <p style="margin: 0; color: #0a0a0a; font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500;">${zoom.meetingId}</p>
            </td>
            <td>
              <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Passcode</p>
              <p style="margin: 0; color: #0a0a0a; font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500;">${zoom.passcode}</p>
            </td>
          </tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">If you have any questions, feel free to reply directly to this email.</p>
  <p style="margin: 0 0 10px; color: #525252; font-size: 16px; line-height: 1.6;">We look forward to your pitch.</p>
  <p style="margin: 0 0 5px; color: #525252; font-size: 16px; line-height: 1.6;">Best,</p>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0 0;">
    <tr><td><img src="${BETO_SIGNATURE_URL}" alt="Beto Altamirano signature" width="180" style="display: block; max-width: 180px; height: auto;" /></td></tr>
    <tr><td style="padding-top: 10px;">
      <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">Beto Altamirano</p>
      <p style="margin: 3px 0 0; color: #737373; font-size: 14px;">CEO, Tech Bloc</p>
    </td></tr>
  </table>
`, "Save this email — it contains your Zoom details and pitch time")

// --- Non-select email ---
const nsName = "Elton John"
const nsCompany = "Rocketman"

const nonSelectHtml = wrap(techFuelHeader(), `
  <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">Hey ${nsName},</h2>
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    Thank you for taking the time to apply and engage with us for Tech Fuel 2026. We truly appreciate the effort that goes into building and sharing what you're working on.
  </p>
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    After a highly competitive review process, <strong>${nsCompany}</strong> was not selected to advance to the next stage this year. This was not an easy decision. We received a strong pool of applications and, with limited spots, had to make difficult choices across a range of factors.
  </p>
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    This outcome does not diminish the quality of what you're building or the potential ahead. Many of the founders in our ecosystem have applied more than once, and we've seen firsthand the progress teams make between cycles. We encourage you to keep building, validating your assumptions, and gaining traction—and to consider applying again next year.
  </p>
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    In the meantime, we'd love to stay connected. We hope you'll join us at the Tech Fuel Finals on April 20 at the UTSA School of Data Science. It will be a strong gathering of investors, founders, and community leaders. We're also hosting Tech Day on April 21, which is designed to bring the broader innovation ecosystem together.
  </p>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
    <tr><td align="center">
      <a href="https://sanantoniotechday.com/register" style="display: inline-block; background-color: #c73030; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 6px; letter-spacing: 0.5px;">Get Your Tickets</a>
    </td></tr>
  </table>
  <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
    Thank you again for considering Tech Fuel and for the work you're doing. We're rooting for your continued progress and hope to stay in touch.
  </p>
  <p style="margin: 0 0 5px; color: #525252; font-size: 16px; line-height: 1.6;">Best,</p>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0 0;">
    <tr><td><img src="${BETO_SIGNATURE_URL}" alt="Beto Altamirano signature" width="180" style="display: block; max-width: 180px; height: auto;" /></td></tr>
    <tr><td style="padding-top: 10px;">
      <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">Beto Altamirano</p>
      <p style="margin: 3px 0 0; color: #737373; font-size: 14px;">CEO, Tech Bloc</p>
    </td></tr>
  </table>
`, "")

async function main() {
  console.log(`To: ${TO.join(", ")}`)
  console.log(`CC: ${CC.join(", ")}`)
  console.log(`From: ${FROM_EMAIL}`)
  console.log("")

  // 1. Semi-finalist preview
  console.log("1. Sending semi-finalist preview...")
  try {
    const r1 = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO,
      cc: CC,
      replyTo: REPLY_TO,
      subject: "[PREVIEW] TechFuel 2026 — Semi-Finalist Notification",
      html: semifinalistHtml,
    })
    if (r1.error) {
      console.error("   ERROR:", r1.error)
    } else {
      console.log("   Sent!", r1.data)
    }
  } catch (e) {
    console.error("   FAILED:", e)
  }

  // Small delay to avoid rate limit
  await new Promise(r => setTimeout(r, 1500))

  // 2. Non-select preview
  console.log("2. Sending non-select preview...")
  try {
    const r2 = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO,
      cc: CC,
      replyTo: REPLY_TO,
      subject: "[PREVIEW] TechFuel 2026 — Non-Select Notification",
      html: nonSelectHtml,
    })
    if (r2.error) {
      console.error("   ERROR:", r2.error)
    } else {
      console.log("   Sent!", r2.data)
    }
  } catch (e) {
    console.error("   FAILED:", e)
  }

  console.log("\nDone!")
}

main()
