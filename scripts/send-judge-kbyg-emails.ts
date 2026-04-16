// Send Tech Fuel Judge KBYG email to all 5 final judges
// Run with: npx tsx scripts/send-judge-kbyg-emails.ts

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

const GOOGLE_CAL_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Tech%20Fuel%202026&dates=20260420T190000Z/20260420T230000Z&details=San%20Antonio%27s%20premier%20startup%20pitch%20competition.%20More%20info%3A%20https%3A%2F%2Fsanantoniotechday.com%2Ftechfuel&location=UTSA%20San%20Pedro%20I%20(SP1)%2C%20506%20Dolorosa%20St%2C%20San%20Antonio%2C%20TX%2078204"
const OUTLOOK_CAL_URL =
  "https://outlook.live.com/calendar/0/action/compose?subject=Tech%20Fuel%202026&startdt=2026-04-20T19:00:00Z&enddt=2026-04-20T23:00:00Z&body=San%20Antonio%27s%20premier%20startup%20pitch%20competition.%20More%20info%3A%20https%3A%2F%2Fsanantoniotechday.com%2Ftechfuel&location=UTSA%20San%20Pedro%20I%20(SP1)%2C%20506%20Dolorosa%20St%2C%20San%20Antonio%2C%20TX%2078204"

const JUDGES = [
  { name: "Ben Jones", email: "bljones1888@gmail.com" },
  { name: "Ileana Gonzalez", email: "gonzalez.ileana@heb.com" },
  { name: "Paul Lynch", email: "Paul.lynch@centage.com" },
  { name: "Ryan Saavedra", email: "Ryan@altbionics.com" },
  { name: "Cristal Glangchai", email: "cristal@venturelab.org" },
]

function getEmailTemplate(content: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Tech Fuel 2026</title></head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa;">
    <tr><td align="center" style="padding: 40px 20px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: #0a0a0a; padding: 40px 40px 30px; text-align: center; position: relative;">
            <div style="position: absolute; top: 20px; right: 20px; opacity: 0.15;">${DOWN_ARROW_SVG}</div>
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">TECH FUEL <span style="color: #c73030;">2026</span></h1>
            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">April 20, 2026 • 2:00–6:00 PM • UTSA SP1</p>
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

function getJudgeContent(firstName: string): string {
  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Dear ${firstName},
    </h2>

    <p style="margin: 0 0 25px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you for your time and commitment to this year's Tech Fuel Finals. We appreciate you lending your expertise to support the founders and the broader San Antonio innovation ecosystem.
    </p>

    <p style="margin: 0 0 25px; color: #525252; font-size: 16px; line-height: 1.6;">
      Here are the key details for the day:
    </p>

    <!-- Event Location -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128205; Event Location</h3>
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6;">
            <strong style="color: #ffffff;">UTSA San Pedro I (SP1)</strong><br>506 Dolorosa St<br>San Antonio, TX 78204
          </p>
        </td>
      </tr>
    </table>

    <!-- Event Overview -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#9200; Event Overview — Monday, April 20</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Arrival Recommended:</strong> 1:15 PM</p></td></tr>
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Pitch Competition:</strong> 2:00 PM – 5:00 PM</p></td></tr>
            <tr><td><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Happy Hour Reception:</strong> 5:00 PM – 6:00 PM</p></td></tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Judging Format & Criteria -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#129504; Judging Format &amp; Criteria</h3>
          <p style="margin: 0 0 12px; color: #525252; font-size: 15px; line-height: 1.6;">
            Each company will have <strong>5 minutes to pitch</strong>, followed by <strong>7 minutes of judges Q&amp;A</strong>.
          </p>
          <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
            You will have approximately <strong>3 minutes to deliberate</strong> between pitches, as well as a <strong>10-minute deliberation period</strong> at the end to select the grand prize winner, with your scores determining the final ranking of the remaining companies.
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #525252; font-size: 15px; line-height: 1.8;">
            <li>Team Expertise and Leadership</li>
            <li>Technology and Innovation</li>
            <li>Market Potential and Competitive Differentiation</li>
            <li>Traction and Business Viability</li>
            <li>Local Impact on Bexar County</li>
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
            Downtown San Antonio will be experiencing increased traffic and limited parking due to Fiesta.
          </p>
          <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
            We recommend arriving early and allowing extra time for parking. Nearby options include surface lots on Dolorosa and garages on Houston Street. Availability is not guaranteed.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="background-color: #0a0a0a; border-radius: 6px; padding: 15px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.6;">
                  <strong style="color: #c73030;">NOTE:</strong> Tech Bloc will reimburse reasonable parking expenses — please bring your validation day of.
                </p>
              </td>
            </tr>
          </table>
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

    <p style="margin: 0 0 25px; color: #525252; font-size: 16px; line-height: 1.6;">
      We appreciate your continued support and look forward to having you in the room.
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
  console.log(`Sending judge KBYG to ${JUDGES.length} judges\n`)

  const subject = "Tech Fuel 2026 Judge: Know Before You Go 📍"

  let sent = 0
  let failed = 0
  const failures: { email: string; error: unknown }[] = []

  for (const judge of JUDGES) {
    const content = getJudgeContent(judge.name.split(" ")[0])
    const html = getEmailTemplate(content)

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: judge.email,
        replyTo: REPLY_TO,
        subject,
        html,
      })

      if (result.error) {
        console.error(`  FAIL: ${judge.name} <${judge.email}> —`, result.error)
        failed++
        failures.push({ email: judge.email, error: result.error })
      } else {
        console.log(`  OK: ${judge.name} <${judge.email}> — ${result.data?.id}`)
        sent++
      }
    } catch (err) {
      console.error(`  FAIL: ${judge.name} <${judge.email}> —`, err)
      failed++
      failures.push({ email: judge.email, error: err })
    }

    await new Promise((r) => setTimeout(r, 500))
  }

  console.log(`\n========== SUMMARY ==========`)
  console.log(`Total: ${JUDGES.length}`)
  console.log(`Sent: ${sent}`)
  console.log(`Failed: ${failed}`)
  if (failures.length > 0) {
    console.log(`\nFailed emails:`)
    for (const f of failures) {
      console.log(`  - ${f.email}: ${JSON.stringify(f.error)}`)
    }
  }
}

main()
