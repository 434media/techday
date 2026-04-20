// Preview Tuesday Tech Day day-of email — sends to jesse@434media.com
// Run with: npx tsx scripts/send-tuesday-techday-preview.ts

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
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
  process.env[key] = val
}

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = "Beto Altamirano <ceo@send.satechbloc.com>"
const REPLY_TO = "ceo@satechbloc.com"
const PREVIEW_EMAIL = "jesse@434media.com"

const BETO_SIGNATURE_URL = "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/signature.PNG?alt=media"

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
            <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 12px;">&copy; 2026 Tech Bloc &amp; 434 MEDIA &bull; San Antonio, TX</p>
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

function getTuesdayContent(firstName: string) {
  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Today Is the Day${firstName ? `, ${firstName}` : ""}.
    </h2>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Tech Day is here. Three tracks. World-class speakers. An afternoon built for the people shaping San Antonio's tech future.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128205; Venue</h3>
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6;">
            <strong style="color: #ffffff;">Boeing Center at Tech Port</strong><br>3331 General Hudnell Dr<br>San Antonio, TX 78226
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#9200; Today's Schedule</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr><td style="padding-bottom: 8px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">12:30 PM</strong> &mdash; Doors Open</p></td></tr>
            <tr><td style="padding-bottom: 8px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">12:55 PM</strong> &mdash; Welcome Remarks</p></td></tr>
            <tr><td style="padding-bottom: 8px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">1:15 PM</strong> &mdash; Programming Begins</p></td></tr>
            <tr><td><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">4:00 PM</strong> &mdash; Event Concludes</p></td></tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128218; Three Tracks</h3>
          <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
            Choose your path:
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 15px;">
                <p style="margin: 0 0 4px; color: #0a0a0a; font-size: 15px; font-weight: 600;">Emerging Industries</p>
                <p style="margin: 0; color: #525252; font-size: 14px; line-height: 1.5;">Cyber &amp; Tech &bull; Bio &amp; Life Science &bull; Aerospace &amp; Advanced Manufacturing</p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 15px;">
                <p style="margin: 0 0 4px; color: #0a0a0a; font-size: 15px; font-weight: 600;">Founders &amp; Investors</p>
                <p style="margin: 0; color: #525252; font-size: 14px; line-height: 1.5;">Leveraging Hyperscaler Funding &bull; Building in Public &bull; Investor Office Hours</p>
              </td>
            </tr>
            <tr>
              <td>
                <p style="margin: 0 0 4px; color: #0a0a0a; font-size: 15px; font-weight: 600;">AI</p>
                <p style="margin: 0; color: #525252; font-size: 14px; line-height: 1.5;">Building with LLMs &amp; Agents &bull; AI Ethics &amp; Governance &bull; Enterprise AI Adoption</p>
              </td>
            </tr>
          </table>
          <p style="margin: 15px 0 0; color: #525252; font-size: 14px;">
            Full schedule at <a href="https://sanantoniotechday.com/techday#schedule" style="color: #c73030; text-decoration: none; font-weight: 500;">sanantoniotechday.com</a>
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128663; Parking</h3>
          <p style="margin: 0; color: #525252; font-size: 14px; line-height: 1.6;">
            Free parking available onsite at Boeing Center at Tech Port.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      See you there.
    </p>

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
  console.log(`Sending Tuesday Tech Day day-of preview to ${PREVIEW_EMAIL}...\n`)

  const content = getTuesdayContent("Jesse")
  const html = getEmailTemplate(content)

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: PREVIEW_EMAIL,
      replyTo: REPLY_TO,
      subject: "[PREVIEW] Today Is the Day — Tech Day 2026",
      html,
    })
    if (result.error) {
      console.error("FAIL:", result.error)
    } else {
      console.log("OK:", result.data?.id)
    }
  } catch (err) {
    console.error("FAIL:", err)
  }
}

main()
