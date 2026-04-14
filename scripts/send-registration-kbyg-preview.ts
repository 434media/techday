// Preview KBYG (Know Before You Go) email — sends all 3 versions to jesse@434media.com
// Run with: npx tsx scripts/send-registration-kbyg-preview.ts

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

type EventType = "techfuel" | "techday" | "both"

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

// Calendar link URLs for Add to Calendar buttons
// Tech Fuel: April 20, 2026 2:00-6:00 PM CDT (19:00-23:00 UTC)
// Tech Day: April 21, 2026 12:30-4:00 PM CDT (17:30-21:00 UTC)
const CALENDAR_LINKS = {
  techfuel: {
    google: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Tech%20Fuel%202026&dates=20260420T190000Z/20260420T230000Z&details=San%20Antonio%27s%20premier%20startup%20pitch%20competition.%20More%20info%3A%20https%3A%2F%2Fsanantoniotechday.com%2Ftechfuel&location=UTSA%20San%20Pedro%20I%20(SP1)%2C%20506%20Dolorosa%20St%2C%20San%20Antonio%2C%20TX%2078204",
    outlook: "https://outlook.live.com/calendar/0/action/compose?subject=Tech%20Fuel%202026&startdt=2026-04-20T19:00:00Z&enddt=2026-04-20T23:00:00Z&body=San%20Antonio%27s%20premier%20startup%20pitch%20competition.%20More%20info%3A%20https%3A%2F%2Fsanantoniotechday.com%2Ftechfuel&location=UTSA%20San%20Pedro%20I%20(SP1)%2C%20506%20Dolorosa%20St%2C%20San%20Antonio%2C%20TX%2078204",
  },
  techday: {
    google: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Tech%20Day%202026&dates=20260421T173000Z/20260421T210000Z&details=San%20Antonio%27s%20premier%20tech%20conference.%20More%20info%3A%20https%3A%2F%2Fsanantoniotechday.com%2Ftechday&location=Boeing%20Center%20at%20Tech%20Port%2C%203331%20General%20Hudnell%20Dr%2C%20San%20Antonio%2C%20TX",
    outlook: "https://outlook.live.com/calendar/0/action/compose?subject=Tech%20Day%202026&startdt=2026-04-21T17:30:00Z&enddt=2026-04-21T21:00:00Z&body=San%20Antonio%27s%20premier%20tech%20conference.%20More%20info%3A%20https%3A%2F%2Fsanantoniotechday.com%2Ftechday&location=Boeing%20Center%20at%20Tech%20Port%2C%203331%20General%20Hudnell%20Dr%2C%20San%20Antonio%2C%20TX",
  },
}

function getCalendarButton(label: string, googleUrl: string, outlookUrl: string): string {
  return `
          <td style="padding-bottom: 12px;">
            <p style="margin: 0 0 8px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">${label}</p>
            <table role="presentation" cellspacing="0" cellpadding="0">
              <tr>
                <td style="padding-right: 10px;">
                  <a href="${googleUrl}" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #0a0a0a; color: #ffffff; font-size: 13px; font-weight: 500; text-decoration: none; border-radius: 4px;">Google Calendar</a>
                </td>
                <td>
                  <a href="${outlookUrl}" target="_blank" style="display: inline-block; padding: 8px 16px; background-color: #0a0a0a; color: #ffffff; font-size: 13px; font-weight: 500; text-decoration: none; border-radius: 4px;">Outlook</a>
                </td>
              </tr>
            </table>
          </td>`
}

function getCalendarSection(eventType: EventType): string {
  let buttons = ""
  if (eventType === "both") {
    buttons = `
        <tr>${getCalendarButton("Tech Fuel — April 20", CALENDAR_LINKS.techfuel.google, CALENDAR_LINKS.techfuel.outlook)}</tr>
        <tr>${getCalendarButton("Tech Day — April 21", CALENDAR_LINKS.techday.google, CALENDAR_LINKS.techday.outlook)}</tr>`
  } else if (eventType === "techfuel") {
    buttons = `
        <tr>${getCalendarButton("Tech Fuel — April 20", CALENDAR_LINKS.techfuel.google, CALENDAR_LINKS.techfuel.outlook)}</tr>`
  } else {
    buttons = `
        <tr>${getCalendarButton("Tech Day — April 21", CALENDAR_LINKS.techday.google, CALENDAR_LINKS.techday.outlook)}</tr>`
  }

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">&#128197; Add to Your Calendar</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${buttons}
          </table>
        </td>
      </tr>
    </table>`
}

function getKBYGContent(eventType: EventType, firstName: string): string {
  // --- Intro ---
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

  // --- Location ---
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

  // --- Schedule ---
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

  // --- What to Expect ---
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

  // --- Parking ---
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

  // --- What to Wear + Make the Most ---
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
    ${getCalendarSection(eventType)}
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

async function main() {
  const versions: { type: EventType; label: string }[] = [
    { type: "both", label: "Both Days" },
    { type: "techfuel", label: "Tech Fuel Only" },
    { type: "techday", label: "Tech Day Only" },
  ]

  console.log(`Sending 3 KBYG preview versions to ${PREVIEW_EMAIL}\n`)

  for (const version of versions) {
    const content = getKBYGContent(version.type, "Jesse")
    const html = getEmailTemplate(content, version.type)
    const subject = `[PREVIEW: ${version.label}] ${getSubject(version.type)}`

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: PREVIEW_EMAIL,
        replyTo: REPLY_TO,
        subject,
        html,
      })

      if (result.error) {
        console.error(`  FAIL (${version.label}):`, result.error)
      } else {
        console.log(`  OK: ${version.label} (${result.data?.id})`)
      }
    } catch (err) {
      console.error(`  FAIL (${version.label}):`, err)
    }

    // Small delay between sends
    await new Promise((r) => setTimeout(r, 1200))
  }

  console.log("\nDone! Check inbox for all 3 versions.")
}

main()
