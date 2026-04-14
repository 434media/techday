// Preview Speaker KBYG email — sends to jesse@434media.com
// Run with: npx tsx scripts/send-speaker-kbyg-preview.ts

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
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  )
    val = val.slice(1, -1)
  process.env[key] = val
}

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = "Beto Altamirano <ceo@send.satechbloc.com>"
const REPLY_TO = "ceo@satechbloc.com"
const PREVIEW_EMAIL = "jesse@434media.com"

const BETO_SIGNATURE_URL =
  "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/signature.PNG?alt=media"

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

// Tech Day calendar links (April 21, 2026 12:30-4:00 PM CDT = 17:30-21:00 UTC)
const GOOGLE_CAL_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Tech%20Day%202026&dates=20260421T173000Z/20260421T210000Z&details=San%20Antonio%27s%20premier%20tech%20conference.%20More%20info%3A%20https%3A%2F%2Fsanantoniotechday.com%2Ftechday&location=Boeing%20Center%20at%20Tech%20Port%2C%203331%20General%20Hudnell%20Dr%2C%20San%20Antonio%2C%20TX"
const OUTLOOK_CAL_URL =
  "https://outlook.live.com/calendar/0/action/compose?subject=Tech%20Day%202026&startdt=2026-04-21T17:30:00Z&enddt=2026-04-21T21:00:00Z&body=San%20Antonio%27s%20premier%20tech%20conference.%20More%20info%3A%20https%3A%2F%2Fsanantoniotechday.com%2Ftechday&location=Boeing%20Center%20at%20Tech%20Port%2C%203331%20General%20Hudnell%20Dr%2C%20San%20Antonio%2C%20TX"

function getEmailTemplate(content: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Tech Day 2026</title></head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa;">
    <tr><td align="center" style="padding: 40px 20px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: #0a0a0a; padding: 40px 40px 30px; text-align: center; position: relative;">
            <div style="position: absolute; top: 20px; right: 20px; opacity: 0.15;">${DOWN_ARROW_SVG}</div>
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">TECH DAY <span style="color: #c73030;">2026</span></h1>
            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">April 21, 2026 • 1:00–4:00 PM • Boeing Center at Tech Port</p>
            <p style="margin: 6px 0 0;"><a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none; font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;">sanantoniotechday.com</a></p>
          </td>
        </tr>
        <tr><td style="padding: 40px;">${content}</td></tr>
        <tr>
          <td style="background-color: #0a0a0a; padding: 30px 40px; text-align: center;">
            <p style="margin: 0 0 15px; color: rgba(255,255,255,0.7); font-size: 13px;">Keep this email handy — it has everything you need for event day</p>
            <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 12px;">© 2026 Tech Bloc & 434 MEDIA • San Antonio, TX</p>
            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.4); font-size: 11px;">
              <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none;">sanantoniotechday.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function getSpeakerContent(): string {
  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hello!
    </h2>

    <p style="margin: 0 0 25px; color: #525252; font-size: 16px; line-height: 1.6;">
      We're excited to welcome you as a speaker at <strong>San Antonio Tech Day</strong>. Tech Day is a full-day event featuring multiple tracks, sessions, and networking opportunities across the tech ecosystem. Your participation plays an important role in shaping the conversations and connections that drive our region's tech ecosystem forward.
    </p>

    <p style="margin: 0 0 25px; color: #525252; font-size: 16px; line-height: 1.6;">
      Here's everything you need to know before you arrive:
    </p>

    <!-- Event Schedule -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#9200; Event Schedule — Tuesday, April 21</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Doors Open:</strong> 12:30 PM</p></td></tr>
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Welcome Remarks:</strong> 12:55 PM</p></td></tr>
            <tr><td><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Full Day Programming:</strong> Begins at 1:15 PM</p></td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 25px; color: #525252; font-size: 15px; line-height: 1.6;">
      Explore the agenda, sessions, and more at <a href="https://sanantoniotechday.com/techday" style="color: #c73030; text-decoration: none; font-weight: 500;">sanantoniotechday.com</a>
    </p>

    <!-- Event Location -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128205; Event Location</h3>
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6;">
            <strong style="color: #ffffff;">Boeing Center at Tech Port</strong><br>3331 General Hudnell Dr<br>San Antonio, TX
          </p>
        </td>
      </tr>
    </table>

    <!-- Speaker Arrival -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#127908; Speaker Arrival &amp; Check-In</h3>
          <ul style="margin: 0; padding-left: 20px; color: #525252; font-size: 15px; line-height: 1.8;">
            <li>Please plan to arrive at least <strong>30 minutes prior</strong> to your session</li>
            <li>An event team member will be available to direct you to your session room and assist as needed</li>
          </ul>
        </td>
      </tr>
    </table>

    <!-- Parking -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128663; Parking &amp; Arrival</h3>
          <p style="margin: 0 0 12px; color: #525252; font-size: 15px; line-height: 1.6;">
            Parking is available onsite at the Boeing Center at Tech Port. We recommend:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #525252; font-size: 15px; line-height: 1.8;">
            <li>Arriving early to allow time for parking and check-in</li>
            <li>Following event signage and staff directions upon arrival</li>
          </ul>
        </td>
      </tr>
    </table>

    <!-- Attire -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128084; Attire</h3>
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6;">
            Business or business casual attire is recommended.
          </p>
        </td>
      </tr>
    </table>

    <!-- Add to Calendar -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128197; Add to Your Calendar</h3>
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-right: 10px;">
                <a href="${GOOGLE_CAL_URL}" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #0a0a0a; color: #ffffff; font-size: 13px; font-weight: 500; text-decoration: none; border-radius: 4px;">Google Calendar</a>
              </td>
              <td>
                <a href="${OUTLOOK_CAL_URL}" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #0a0a0a; color: #ffffff; font-size: 13px; font-weight: 500; text-decoration: none; border-radius: 4px;">Outlook</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We're honored to have you as part of this year's program and look forward to your session.
    </p>

    <p style="margin: 0 0 25px; color: #525252; font-size: 15px; line-height: 1.6;">
      If you have any questions in advance of your session, please don't hesitate to reach out to <a href="mailto:nichole@434media.com" style="color: #c73030; text-decoration: none; font-weight: 500;">nichole@434media.com</a>.
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
}

async function main() {
  console.log(`Sending speaker KBYG preview to ${PREVIEW_EMAIL}\n`)

  const content = getSpeakerContent()
  const html = getEmailTemplate(content)

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: PREVIEW_EMAIL,
      replyTo: REPLY_TO,
      subject: "[PREVIEW] Tech Day 2026 Speaker: Know Before You Go 📍",
      html,
    })

    if (result.error) {
      console.error("FAIL:", result.error)
    } else {
      console.log(`OK: ${result.data?.id}`)
    }
  } catch (err) {
    console.error("FAIL:", err)
  }

  console.log("\nDone! Check inbox.")
}

main()
