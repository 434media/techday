// Send KBYG (Know Before You Go) email to ALL active registrants
// Determines event type per registrant and sends the correct version
// Run with: npx tsx scripts/send-registration-kbyg-emails.ts

import { readFileSync } from "fs"
import { resolve } from "path"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
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

function parsePrivateKey(key: string): string {
  let parsed = key.trim()
  if (
    (parsed.startsWith('"') && parsed.endsWith('"')) ||
    (parsed.startsWith("'") && parsed.endsWith("'"))
  )
    parsed = parsed.slice(1, -1)
  parsed = parsed.replace(/\\n/g, "\n")
  if (!parsed.includes("\n") && parsed.length > 100) {
    parsed = parsed
      .replace(/-----BEGIN PRIVATE KEY-----/g, "-----BEGIN PRIVATE KEY-----\n")
      .replace(/-----END PRIVATE KEY-----/g, "\n-----END PRIVATE KEY-----")
  }
  return parsed
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY!),
      }),
    })

const db = getFirestore(app, "techday")
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

type EventType = "techfuel" | "techday" | "both"

function getEventType(events: string[]): EventType {
  const hasTechFuel = events.includes("techfuel")
  const hasTechDay = events.includes("techday")
  const has2Day = events.includes("2day")
  if (has2Day || (hasTechFuel && hasTechDay)) return "both"
  if (hasTechFuel) return "techfuel"
  return "techday"
}

function getEmailHeader(eventType: EventType): string {
  switch (eventType) {
    case "techfuel":
      return 'TECH FUEL <span style="color: #c73030;">2026</span>'
    case "techday":
      return 'TECH DAY <span style="color: #c73030;">2026</span>'
    case "both":
      return 'TECH FUEL • TECH DAY <span style="color: #c73030;">2026</span>'
  }
}

function getEmailDates(eventType: EventType): string {
  switch (eventType) {
    case "techfuel":
      return "April 20, 2026 • 2:00–6:00 PM • UTSA SP1"
    case "techday":
      return "April 21, 2026 • 1:00–4:00 PM • Boeing Center at Tech Port"
    case "both":
      return "April 20-21, 2026 • UTSA SP1 • Boeing Center at Tech Port"
  }
}

function getEmailTemplate(content: string, eventType: EventType) {
  const header = getEmailHeader(eventType)
  const dates = getEmailDates(eventType)
  const subtextLine =
    eventType === "both"
      ? `<p style="margin: 6px 0 0; color: rgba(255,255,255,0.5); font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;">Tech Fuel 2–6 PM • Tech Day 1–4 PM (Doors Open 12:30 PM)</p>`
      : `<p style="margin: 6px 0 0;"><a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none; font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;">sanantoniotechday.com</a></p>`

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Tech Day 2026</title></head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa;">
    <tr><td align="center" style="padding: 40px 20px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: #0a0a0a; padding: 40px 40px 30px; text-align: center; position: relative;">
            <div style="position: absolute; top: 20px; right: 20px; opacity: 0.15;">${DOWN_ARROW_SVG}</div>
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">${header}</h1>
            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">${dates}</p>
            ${subtextLine}
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

function getKBYGContent(eventType: EventType, firstName: string): string {
  let intro = ""
  switch (eventType) {
    case "both":
      intro = `We're excited to welcome you to Tech Bloc's <strong>Tech Fuel</strong> and <strong>Tech Day 2026</strong> — two days bringing together founders, investors, operators, and leaders from across San Antonio's innovation ecosystem. Here's everything you need to know before you arrive:`
      break
    case "techfuel":
      intro = `We're excited to welcome you to Tech Bloc's <strong>Tech Fuel 2026</strong> — San Antonio's premier startup pitch competition bringing together founders, investors, operators, and leaders from across the innovation ecosystem. Here's everything you need to know before you arrive:`
      break
    case "techday":
      intro = `We're excited to welcome you to Tech Bloc's <strong>Tech Day 2026</strong> — bringing together founders, investors, operators, and leaders from across San Antonio's innovation ecosystem. Here's everything you need to know before you arrive:`
      break
  }

  let locationSection = ""
  if (eventType === "both") {
    locationSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128205; Event Locations</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="50%" style="vertical-align: top; padding-right: 15px;">
                <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">Tech Fuel</p>
                <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
                  <strong style="color: #ffffff;">UTSA San Pedro I (SP1)</strong><br>506 Dolorosa St<br>San Antonio, TX 78204
                </p>
              </td>
              <td width="50%" style="vertical-align: top; padding-left: 15px; border-left: 1px solid rgba(255,255,255,0.1);">
                <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">Tech Day</p>
                <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
                  <strong style="color: #ffffff;">Boeing Center at Tech Port</strong><br>3331 General Hudnell Dr<br>San Antonio, TX
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`
  } else if (eventType === "techfuel") {
    locationSection = `
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
    </table>`
  } else {
    locationSection = `
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
    </table>`
  }

  let scheduleSection = ""
  if (eventType === "both") {
    scheduleSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 20px; color: #ffffff; font-size: 18px; font-weight: 600;">&#9200; Event Overview</h3>
          <p style="margin: 0 0 10px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">Tech Fuel — Monday, April 20</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Attendee Arrival Recommended:</strong> 1:30 PM</p></td></tr>
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Pitch Competition:</strong> 2:00 PM – 5:00 PM</p></td></tr>
            <tr><td><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Happy Hour Reception:</strong> 5:00 PM – 6:00 PM</p></td></tr>
          </table>
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
            <p style="margin: 0 0 10px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">Tech Day — Tuesday, April 21</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Doors Open:</strong> 12:30 PM</p></td></tr>
              <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Welcome Remarks:</strong> 12:55 PM</p></td></tr>
              <tr><td><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Full Day Programming:</strong> Begins at 1:15 PM</p></td></tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 25px; color: #525252; font-size: 15px; line-height: 1.6;">
      Explore the agenda, sessions, speakers, and more at <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none; font-weight: 500;">sanantoniotechday.com</a>
    </p>`
  } else if (eventType === "techfuel") {
    scheduleSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#9200; Event Schedule — Monday, April 20</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Attendee Arrival Recommended:</strong> 1:30 PM</p></td></tr>
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Pitch Competition:</strong> 2:00 PM – 5:00 PM</p></td></tr>
            <tr><td><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Happy Hour Reception:</strong> 5:00 PM – 6:00 PM</p></td></tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 25px; color: #525252; font-size: 15px; line-height: 1.6;">
      Explore the agenda, speakers, and more at <a href="https://sanantoniotechday.com/techfuel" style="color: #c73030; text-decoration: none; font-weight: 500;">sanantoniotechday.com</a>
    </p>`
  } else {
    scheduleSection = `
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
      Explore the agenda, sessions, speakers, and more at <a href="https://sanantoniotechday.com/techday" style="color: #c73030; text-decoration: none; font-weight: 500;">sanantoniotechday.com</a>
    </p>`
  }

  let expectItems = ""
  switch (eventType) {
    case "both":
      expectItems = `
            <li>Startup pitch competition featuring this year's Tech Fuel finalists</li>
            <li>Programming across Venture Capital, Startups, and Emerging Industries</li>
            <li>Insights from founders, operators, and industry leaders</li>
            <li>Access to San Antonio's growing innovation ecosystem</li>
            <li>Opportunities to connect with investors, builders, and community leaders</li>`
      break
    case "techfuel":
      expectItems = `
            <li>Startup pitch competition featuring this year's Tech Fuel finalists</li>
            <li>Insights from founders, operators, and industry leaders</li>
            <li>Access to San Antonio's growing innovation ecosystem</li>
            <li>Opportunities to connect with investors, builders, and community leaders</li>
            <li>Happy hour reception following the competition</li>`
      break
    case "techday":
      expectItems = `
            <li>Programming across Venture Capital, Startups, and Emerging Industries</li>
            <li>Insights from founders, operators, and industry leaders</li>
            <li>Access to San Antonio's growing innovation ecosystem</li>
            <li>Opportunities to connect with investors, builders, and community leaders</li>`
      break
  }

  const expectSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128640; What to Expect</h3>
          <p style="margin: 0 0 12px; color: #525252; font-size: 15px; line-height: 1.6;">
            ${eventType === "both" ? "Across both days, you'll experience:" : "You'll experience:"}
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #525252; font-size: 15px; line-height: 1.8;">${expectItems}
          </ul>
        </td>
      </tr>
    </table>`

  let parkingSection = ""
  if (eventType === "both") {
    parkingSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128663; Parking &amp; Arrival</h3>
          <p style="margin: 0 0 5px; color: #0a0a0a; font-size: 14px; font-weight: 600;">April 20 — UTSA SP1 (Tech Fuel)</p>
          <p style="margin: 0 0 12px; color: #525252; font-size: 15px; line-height: 1.6;">
            Downtown San Antonio will be experiencing increased traffic and limited parking due to Fiesta. We recommend:
          </p>
          <ul style="margin: 0 0 15px; padding-left: 20px; color: #525252; font-size: 15px; line-height: 1.8;">
            <li>Arriving early</li>
            <li>Using rideshare (Uber or Lyft)</li>
            <li>Carpooling when possible</li>
          </ul>
          <p style="margin: 0 0 20px; color: #525252; font-size: 14px; line-height: 1.6;">
            Nearby parking options include surface lots on Dolorosa and garages on Houston Street. Availability is not guaranteed.
          </p>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
            <p style="margin: 0 0 5px; color: #0a0a0a; font-size: 14px; font-weight: 600;">April 21 — Boeing Center at Tech Port (Tech Day)</p>
            <p style="margin: 0; color: #525252; font-size: 15px; line-height: 1.6;">
              Free parking available onsite.
            </p>
          </div>
        </td>
      </tr>
    </table>`
  } else if (eventType === "techfuel") {
    parkingSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128663; Parking &amp; Arrival</h3>
          <p style="margin: 0 0 12px; color: #525252; font-size: 15px; line-height: 1.6;">
            Downtown San Antonio will be experiencing increased traffic and limited parking due to Fiesta. We recommend:
          </p>
          <ul style="margin: 0 0 15px; padding-left: 20px; color: #525252; font-size: 15px; line-height: 1.8;">
            <li>Arriving early</li>
            <li>Using rideshare (Uber or Lyft)</li>
            <li>Carpooling when possible</li>
          </ul>
          <p style="margin: 0; color: #525252; font-size: 14px; line-height: 1.6;">
            Nearby parking options include surface lots on Dolorosa and garages on Houston Street. Availability is not guaranteed.
          </p>
        </td>
      </tr>
    </table>`
  } else {
    parkingSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128663; Parking &amp; Arrival</h3>
          <p style="margin: 0; color: #525252; font-size: 15px; line-height: 1.6;">
            Free parking is available onsite at Boeing Center at Tech Port.
          </p>
        </td>
      </tr>
    </table>`
  }

  const closingSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128084; What to Wear</h3>
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6;">
            Business casual attire is recommended. Expect a mix of programming, networking, and movement throughout the venue${eventType === "both" ? "s" : ""}.
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#129309; Make the Most of Your Experience</h3>
          <ul style="margin: 0; padding-left: 20px; color: #525252; font-size: 15px; line-height: 1.8;">
            <li>Plan ahead and review the agenda</li>
            <li>Be ready to connect — this is a highly engaged audience</li>
            <li>Take advantage of networking moments before, during, and after sessions</li>
          </ul>
        </td>
      </tr>
    </table>`

  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hello, ${firstName}!
    </h2>

    <p style="margin: 0 0 25px; color: #525252; font-size: 16px; line-height: 1.6;">
      ${intro}
    </p>

    ${locationSection}
    ${scheduleSection}
    ${expectSection}
    ${parkingSection}
    ${closingSection}

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We look forward to seeing you!
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

function getSubject(eventType: EventType): string {
  switch (eventType) {
    case "both":
      return "Tech Fuel & Tech Day 2026: Know Before You Go 📍"
    case "techfuel":
      return "Tech Fuel 2026: Know Before You Go 📍"
    case "techday":
      return "Tech Day 2026: Know Before You Go 📍"
  }
}

// Schedule for 8:00 AM CDT (UTC-5) = 13:00 UTC on April 14, 2026
// San Antonio observes CDT (Central Daylight Time) in April
const SCHEDULED_AT = "2026-04-14T13:00:00.000Z"

// Rate-limited batch sending: 8 per batch, 1.5s between batches
const BATCH_SIZE = 8
const BATCH_DELAY_MS = 1500
const INDIVIDUAL_DELAY_MS = 200

async function main() {
  console.log(`Scheduling all KBYG emails for delivery at 8:00 AM CDT (${SCHEDULED_AT})\n`)
  console.log("Fetching all active registrations...\n")

  const snapshot = await db
    .collection("registrations")
    .where("status", "in", ["confirmed", "pending", "checked-in"])
    .get()

  const registrants = snapshot.docs.map((doc) => {
    const d = doc.data()
    return {
      email: d.email as string,
      firstName: d.firstName as string,
      events: (d.events as string[]) || ["techday"],
    }
  })

  console.log(`Found ${registrants.length} active registrants`)

  // Count by type
  const counts = { both: 0, techfuel: 0, techday: 0 }
  for (const r of registrants) {
    counts[getEventType(r.events)]++
  }
  console.log(`  Both Days: ${counts.both}`)
  console.log(`  Tech Fuel Only: ${counts.techfuel}`)
  console.log(`  Tech Day Only: ${counts.techday}`)
  console.log()

  let sent = 0
  let failed = 0
  const failures: { email: string; error: unknown }[] = []

  for (let i = 0; i < registrants.length; i += BATCH_SIZE) {
    const batch = registrants.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(registrants.length / BATCH_SIZE)
    console.log(
      `--- Batch ${batchNum}/${totalBatches} (${batch.length} emails) ---`
    )

    for (const reg of batch) {
      const eventType = getEventType(reg.events)
      const content = getKBYGContent(eventType, reg.firstName)
      const html = getEmailTemplate(content, eventType)
      const subject = getSubject(eventType)

      try {
        const result = await resend.emails.send({
          from: FROM_EMAIL,
          to: reg.email,
          replyTo: REPLY_TO,
          subject,
          html,
          scheduledAt: SCHEDULED_AT,
        })

        if (result.error) {
          console.error(`  FAIL: ${reg.email} —`, result.error)
          failed++
          failures.push({ email: reg.email, error: result.error })
        } else {
          console.log(
            `  SCHEDULED: ${reg.email} (${eventType}) — ${result.data?.id}`
          )
          sent++
        }
      } catch (err) {
        console.error(`  FAIL: ${reg.email} —`, err)
        failed++
        failures.push({ email: reg.email, error: err })
      }

      // Small delay between individual sends
      await new Promise((r) => setTimeout(r, INDIVIDUAL_DELAY_MS))
    }

    // Longer delay between batches to respect rate limits
    if (i + BATCH_SIZE < registrants.length) {
      console.log(`  (waiting ${BATCH_DELAY_MS}ms before next batch...)\n`)
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS))
    }
  }

  console.log(`\n========== SUMMARY ==========`)
  console.log(`Total: ${registrants.length}`)
  console.log(`Scheduled: ${sent} (delivery at 8:00 AM CDT)`)
  console.log(`Failed: ${failed}`)
  if (failures.length > 0) {
    console.log(`\nFailed emails:`)
    for (const f of failures) {
      console.log(`  - ${f.email}: ${JSON.stringify(f.error)}`)
    }
  }
}

main()
