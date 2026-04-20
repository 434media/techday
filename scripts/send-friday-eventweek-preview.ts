// Preview Friday "Event Week" email — sends all 3 variants to jesse@434media.com
// Run with: npx tsx scripts/send-friday-eventweek-preview.ts

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
const PREVIEW_EMAILS = [
  "ceo@satechbloc.com",
  "jesse@434media.com",
  "marcos@434media.com",
]

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

type EventType = "techfuel" | "techday" | "both"

function getEmailHeader(eventType: EventType): string {
  switch (eventType) {
    case "techfuel": return 'TECH FUEL <span style="color: #c73030;">2026</span>'
    case "techday": return 'TECH DAY <span style="color: #c73030;">2026</span>'
    case "both": return 'TECH FUEL &bull; TECH DAY <span style="color: #c73030;">2026</span>'
  }
}

function getEmailDates(eventType: EventType): string {
  switch (eventType) {
    case "techfuel": return "April 20, 2026 • 2:00–6:00 PM • UTSA SP1"
    case "techday": return "April 21, 2026 • 1:00–4:00 PM • Boeing Center at Tech Port"
    case "both": return "April 20–21, 2026 • UTSA SP1 • Boeing Center at Tech Port"
  }
}

function getEmailTemplate(content: string, eventType: EventType) {
  const header = getEmailHeader(eventType)
  const dates = getEmailDates(eventType)
  const subtextLine = eventType === "both"
    ? `<p style="margin: 6px 0 0; color: rgba(255,255,255,0.5); font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;">Tech Fuel 2–6 PM &bull; Tech Day 1–4 PM (Doors 12:30 PM)</p>`
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

function getFridayContent(firstName: string, eventType: EventType) {
  let eventIntro = ""
  switch (eventType) {
    case "both": eventIntro = "Tech Fuel and Tech Day are"; break
    case "techfuel": eventIntro = "Tech Fuel is"; break
    case "techday": eventIntro = "Tech Day is"; break
  }

  let locationSection = ""
  if (eventType === "both") {
    locationSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128205; Your Venues</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="50%" style="vertical-align: top; padding-right: 15px;">
                <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">Monday &mdash; Tech Fuel</p>
                <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
                  <strong style="color: #ffffff;">UTSA San Pedro I</strong><br>Weston Conference Center<br>506 Dolorosa St<br>San Antonio, TX 78204
                </p>
              </td>
              <td width="50%" style="vertical-align: top; padding-left: 15px; border-left: 1px solid rgba(255,255,255,0.1);">
                <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">Tuesday &mdash; Tech Day</p>
                <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
                  <strong style="color: #ffffff;">Boeing Center at Tech Port</strong><br>3331 General Hudnell Dr<br>San Antonio, TX 78226
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`
  } else if (eventType === "techfuel") {
    locationSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128205; Event Location</h3>
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6;">
            <strong style="color: #ffffff;">UTSA San Pedro I</strong><br>Weston Conference Center<br>506 Dolorosa St<br>San Antonio, TX 78204
          </p>
        </td>
      </tr>
    </table>`
  } else {
    locationSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128205; Event Location</h3>
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6;">
            <strong style="color: #ffffff;">Boeing Center at Tech Port</strong><br>3331 General Hudnell Dr<br>San Antonio, TX 78226
          </p>
        </td>
      </tr>
    </table>`
  }

  let scheduleSection = ""
  if (eventType === "both") {
    scheduleSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#9200; At a Glance</h3>
          <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">Monday, April 20 &mdash; Tech Fuel</p>
          <p style="margin: 0 0 15px; color: #ffffff; font-size: 14px;">Doors 1:30 PM &bull; Pitch Competition 2:00&ndash;5:00 PM &bull; Happy Hour 5:00&ndash;6:00 PM</p>
          <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">Tuesday, April 21 &mdash; Tech Day</p>
          <p style="margin: 0; color: #ffffff; font-size: 14px;">Doors 12:30 PM &bull; Welcome 12:55 PM &bull; Programming 1:15 PM</p>
        </td>
      </tr>
    </table>`
  } else if (eventType === "techfuel") {
    scheduleSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#9200; Monday, April 20</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Doors Open:</strong> 1:30 PM</p></td></tr>
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Pitch Competition:</strong> 2:00&ndash;5:00 PM</p></td></tr>
            <tr><td><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Happy Hour:</strong> 5:00&ndash;6:00 PM</p></td></tr>
          </table>
        </td>
      </tr>
    </table>`
  } else {
    scheduleSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#9200; Tuesday, April 21</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Doors Open:</strong> 12:30 PM</p></td></tr>
            <tr><td style="padding-bottom: 6px;"><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Welcome Remarks:</strong> 12:55 PM</p></td></tr>
            <tr><td><p style="margin: 0; color: #ffffff; font-size: 14px;"><strong style="color: #c73030;">Full Day Programming:</strong> Begins at 1:15 PM</p></td></tr>
          </table>
        </td>
      </tr>
    </table>`
  }

  let finalistsSection = ""
  if (eventType === "techfuel" || eventType === "both") {
    finalistsSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#127942; Tech Fuel Finalists</h3>
          <p style="margin: 0 0 12px; color: #525252; font-size: 15px; line-height: 1.6;">
            Five startups will take the stage competing for the grand prize:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #525252; font-size: 15px; line-height: 2;">
            <li><strong>Bytewhisper Security, Inc.</strong></li>
            <li><strong>ComeBack Mobility</strong></li>
            <li><strong>Freyya, Inc.</strong></li>
            <li><strong>Openlane</strong></li>
            <li><strong>RentBamboo</strong></li>
          </ul>
        </td>
      </tr>
    </table>`
  }

  let tracksSection = ""
  if (eventType === "techday" || eventType === "both") {
    tracksSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128218; Tech Day &mdash; Three Tracks</h3>
          <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
            Choose your path across three tracks of programming:
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
    </table>`
  }

  let parkingNote = ""
  if (eventType === "both") {
    parkingNote = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128663; Parking</h3>
          <p style="margin: 0 0 5px; color: #0a0a0a; font-size: 14px; font-weight: 600;">Monday &mdash; UTSA SP1</p>
          <p style="margin: 0 0 12px; color: #525252; font-size: 14px; line-height: 1.6;">
            Fiesta will be active downtown. Arrive early, consider rideshare, or use nearby lots on Dolorosa or garages on Houston St.
          </p>
          <p style="margin: 0 0 5px; color: #0a0a0a; font-size: 14px; font-weight: 600;">Tuesday &mdash; Boeing Center at Tech Port</p>
          <p style="margin: 0; color: #525252; font-size: 14px; line-height: 1.6;">
            Free parking available onsite.
          </p>
        </td>
      </tr>
    </table>`
  } else if (eventType === "techfuel") {
    parkingNote = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128663; Parking</h3>
          <p style="margin: 0; color: #525252; font-size: 14px; line-height: 1.6;">
            Fiesta will be active downtown. Arrive early, consider rideshare, or use nearby lots on Dolorosa or garages on Houston St.
          </p>
        </td>
      </tr>
    </table>`
  } else {
    parkingNote = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128663; Parking</h3>
          <p style="margin: 0; color: #525252; font-size: 14px; line-height: 1.6;">
            Free parking available onsite at Boeing Center at Tech Port.
          </p>
        </td>
      </tr>
    </table>`
  }

  const GCAL_TECHFUEL = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Tech Fuel 2026')}&dates=20260420T183000Z/20260420T230000Z&location=${encodeURIComponent('UTSA San Pedro I, 506 Dolorosa St, San Antonio, TX 78204')}&details=${encodeURIComponent('Tech Fuel 2026 — Startup Pitch Competition. Doors open at 1:30 PM. sanantoniotechday.com')}`
  const GCAL_TECHDAY = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Tech Day 2026')}&dates=20260421T173000Z/20260421T210000Z&location=${encodeURIComponent('Boeing Center at Tech Port, 3331 General Hudnell Dr, San Antonio, TX 78226')}&details=${encodeURIComponent('Tech Day 2026 — Three tracks of programming. Doors open at 12:30 PM. sanantoniotechday.com')}`

  let calendarSection = ""
  if (eventType === "both") {
    calendarSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; text-align: center;">
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128197; Add to Your Calendar</h3>
          <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
            <tr>
              <td style="padding-right: 10px;">
                <a href="${GCAL_TECHFUEL}" target="_blank" style="display: inline-block; background-color: #c73030; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600;">Tech Fuel &mdash; Mon</a>
              </td>
              <td style="padding-left: 10px;">
                <a href="${GCAL_TECHDAY}" target="_blank" style="display: inline-block; background-color: #c73030; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600;">Tech Day &mdash; Tue</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`
  } else if (eventType === "techfuel") {
    calendarSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; text-align: center;">
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128197; Add to Your Calendar</h3>
          <a href="${GCAL_TECHFUEL}" target="_blank" style="display: inline-block; background-color: #c73030; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600;">Tech Fuel 2026 &mdash; Mon, April 20</a>
        </td>
      </tr>
    </table>`
  } else {
    calendarSection = `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; text-align: center;">
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">&#128197; Add to Your Calendar</h3>
          <a href="${GCAL_TECHDAY}" target="_blank" style="display: inline-block; background-color: #c73030; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600;">Tech Day 2026 &mdash; Tue, April 21</a>
        </td>
      </tr>
    </table>`
  }

  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hello${firstName ? ` ${firstName}` : ""},
    </h2>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      ${eventIntro} just days away. We wanted to make sure you have everything you need heading into the weekend.
    </p>

    <p style="margin: 0 0 25px; color: #525252; font-size: 16px; line-height: 1.6;">
      Here's a quick look at what's ahead:
    </p>

    ${locationSection}
    ${scheduleSection}
    ${finalistsSection}
    ${tracksSection}
    ${parkingNote}
    ${calendarSection}

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      If you have any questions, reach out to <a href="mailto:nichole@434media.com" style="color: #c73030; text-decoration: none; font-weight: 500;">nichole@434media.com</a>.
    </p>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We look forward to seeing you next week.
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

function getSubject(eventType: EventType): string {
  switch (eventType) {
    case "both": return "Event Week Is Here — Tech Fuel & Tech Day 2026"
    case "techfuel": return "Event Week Is Here — Tech Fuel 2026"
    case "techday": return "Event Week Is Here — Tech Day 2026"
  }
}

async function main() {
  const variants: { eventType: EventType; label: string }[] = [
    { eventType: "both", label: "Both Days" },
    { eventType: "techfuel", label: "Tech Fuel Only" },
    { eventType: "techday", label: "Tech Day Only" },
  ]

  console.log(`Sending 3 Friday preview variants to ${PREVIEW_EMAILS.join(", ")}...\n`)

  for (const v of variants) {
    const content = getFridayContent("Jesse", v.eventType)
    const html = getEmailTemplate(content, v.eventType)
    for (const email of PREVIEW_EMAILS) {
      try {
        const result = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          replyTo: REPLY_TO,
          subject: `[PREVIEW: ${v.label}] ${getSubject(v.eventType)}`,
          html,
        })
        if (result.error) {
          console.error(`  FAIL: ${email} (${v.label}) —`, result.error)
        } else {
          console.log(`  OK: ${email} (${v.label}) — ${result.data?.id}`)
        }
      } catch (err) {
        console.error(`  FAIL: ${email} (${v.label}) —`, err)
      }
      await new Promise((r) => setTimeout(r, 500))
    }
    await new Promise((r) => setTimeout(r, 1200))
  }
}

main()
