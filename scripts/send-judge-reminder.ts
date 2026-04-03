// Send judge reminder emails for semi-finals starting tomorrow
// Preview:  npx tsx scripts/send-judge-reminder.ts --preview
// Send all: npx tsx scripts/send-judge-reminder.ts --send-all

import { readFileSync } from "fs"
import { resolve } from "path"
import { Resend } from "resend"
import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Load .env.local
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

// Firebase Admin init
function parsePrivateKey(key: string): string {
  let parsed = key.trim()
  if ((parsed.startsWith('"') && parsed.endsWith('"')) || (parsed.startsWith("'") && parsed.endsWith("'"))) {
    parsed = parsed.slice(1, -1)
  }
  parsed = parsed.replace(/\\n/g, "\n")
  if (!parsed.includes("\n") && parsed.length > 100) {
    parsed = parsed
      .replace(/-----BEGIN PRIVATE KEY-----/g, "-----BEGIN PRIVATE KEY-----\n")
      .replace(/-----END PRIVATE KEY-----/g, "\n-----END PRIVATE KEY-----")
  }
  return parsed
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY!),
  }),
})
const db = getFirestore(app, "techday")

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

const DATE_LABELS: Record<string, string> = {
  "2026-04-02": "Thursday, April 2, 2026",
  "2026-04-03": "Friday, April 3, 2026",
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

function buildReminderEmail(judgeName: string, date: string, timeSlot: string) {
  const dateLabel = DATE_LABELS[date]
  const zoom = ZOOM_MEETINGS[date]

  return wrap(techFuelHeader(), `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hey ${judgeName},
    </h2>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      This is a friendly reminder that <strong>Tech Fuel 2026 Semi-Finals judging begins tomorrow</strong>. Thank you again for volunteering your time — we're excited to have you on the panel.
    </p>

    <!-- Session Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr><td style="background-color: #0a0a0a; border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">${DOWN_ARROW_SVG}</div>
        <p style="margin: 0 0 15px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
          Your Judging Session
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
              <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Date</p>
              <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${dateLabel}</p>
            </td>
            <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
              <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Time</p>
              <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500; font-family: 'JetBrains Mono', monospace;">${timeSlot}</p>
            </td>
          </tr>
          <tr>
            <td width="50%" style="vertical-align: top;">
              <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Judge</p>
              <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${judgeName}</p>
            </td>
            <td width="50%" style="vertical-align: top;">
              <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Format</p>
              <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">5 min pitch + 5 min Q&A</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- Zoom Details -->
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

    <!-- Frictionless Intelligence Section -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr><td style="background-color: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 25px;">
        <h3 style="margin: 0 0 15px; color: #92400e; font-size: 16px; font-weight: 600;">
          🤝 Judging Tool — Frictionless Intelligence
        </h3>
        <p style="margin: 0 0 15px; color: #525252; font-size: 14px; line-height: 1.6;">
          We've partnered with <strong>Frictionless Intelligence</strong>, a San Antonio-based startup, to enhance your judging experience during this session.
        </p>
        <p style="margin: 0 0 15px; color: #525252; font-size: 14px; line-height: 1.6;">
          You should have received a separate email from Frictionless Intelligence with an invitation to join the Tech Bloc dashboard. Please follow the instructions to create your account, then confirm you can access the platform here:
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 15px 0;">
          <tr><td align="center">
            <a href="https://frictionlessintelligence.com/capital/startups" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: #0a0a0a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 4px; letter-spacing: 0.5px;">
              Access the Dashboard
            </a>
          </td></tr>
        </table>
        <p style="margin: 15px 0 0; color: #525252; font-size: 14px; line-height: 1.6;">
          For a quick overview of the tool, check out this walkthrough video:
        </p>
        <p style="margin: 8px 0 0;">
          <a href="https://www.loom.com/share/357ea63f78b0401e8da3d7dfa48eb147" target="_blank" style="color: #2563eb; text-decoration: underline; font-size: 14px;">
            🎬 Watch the Walkthrough Video
          </a>
        </p>
      </td></tr>
    </table>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      If you have any questions, feel free to reply directly to this email. We look forward to seeing you tomorrow!
    </p>

    <p style="margin: 0 0 5px; color: #525252; font-size: 16px; line-height: 1.6;">Best,</p>

    <!-- Beto Signature -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0 0;">
      <tr><td><img src="${BETO_SIGNATURE_URL}" alt="Beto Altamirano signature" width="180" style="display: block; max-width: 180px; height: auto;" /></td></tr>
      <tr><td style="padding-top: 10px;">
        <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">Beto Altamirano</p>
        <p style="margin: 3px 0 0; color: #737373; font-size: 14px;">CEO, Tech Bloc</p>
      </td></tr>
    </table>
  `, "Save this email — it contains your Zoom details for judging day")
}

async function main() {
  const mode = process.argv[2]

  if (mode === "--preview") {
    // Send preview to jesse@434media.com with sample data
    console.log("Sending preview to jesse@434media.com...")
    const html = buildReminderEmail("Jesse", "2026-04-02", "9:00 AM - 10:30 AM")
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: "jesse@434media.com",
        replyTo: REPLY_TO,
        subject: "[PREVIEW] Tech Fuel Semi-Finals — Judging Reminder",
        html,
      })
      if (result.error) {
        console.error("ERROR:", result.error)
      } else {
        console.log("Preview sent!", result.data)
      }
    } catch (e) {
      console.error("FAILED:", e)
    }
    process.exit(0)
  }

  if (mode !== "--send-all") {
    console.log("Usage:")
    console.log("  npx tsx scripts/send-judge-reminder.ts --preview    # Send preview to jesse@434media.com")
    console.log("  npx tsx scripts/send-judge-reminder.ts --send-all   # Send to all judges from Firebase")
    process.exit(0)
  }

  // Fetch all judges from Firebase
  console.log("Fetching judges from Firebase...")
  const snapshot = await db.collection("judgeScheduling").get()

  if (snapshot.empty) {
    console.log("No judges found in judgeScheduling collection.")
    process.exit(0)
  }

  const judges: { id: string; judgeName: string; email: string; date: string; timeSlot: string }[] = []

  for (const doc of snapshot.docs) {
    const data = doc.data()
    if (data.email && data.email.trim()) {
      judges.push({
        id: doc.id,
        judgeName: data.judgeName,
        email: data.email.toLowerCase().trim(),
        date: data.date,
        timeSlot: data.timeSlot,
      })
    }
  }

  // Deduplicate by email — if a judge has multiple slots, use the first one found
  const seen = new Set<string>()
  const uniqueJudges: typeof judges = []
  for (const judge of judges) {
    if (!seen.has(judge.email)) {
      seen.add(judge.email)
      uniqueJudges.push(judge)
    }
  }

  console.log(`Found ${uniqueJudges.length} unique judges with email addresses.\n`)

  for (const judge of uniqueJudges) {
    console.log(`  ${judge.judgeName} <${judge.email}> — ${DATE_LABELS[judge.date]} at ${judge.timeSlot}`)
  }
  console.log("")

  let sent = 0
  let failed = 0

  for (let i = 0; i < uniqueJudges.length; i++) {
    const judge = uniqueJudges[i]
    const html = buildReminderEmail(judge.judgeName, judge.date, judge.timeSlot)

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: judge.email,
        replyTo: REPLY_TO,
        subject: "Tech Fuel Semi-Finals — Judging Reminder",
        html,
      })
      if (result.error) {
        console.error(`  FAILED: ${judge.judgeName} <${judge.email}>:`, result.error)
        failed++
      } else {
        console.log(`  Sent: ${judge.judgeName} <${judge.email}>`)
        sent++
      }
    } catch (e) {
      console.error(`  FAILED: ${judge.judgeName} <${judge.email}>:`, e)
      failed++
    }

    // Rate limit: batch of 4 then wait 1.5s (Resend 5/sec limit on this plan)
    if ((i + 1) % 4 === 0 && i < uniqueJudges.length - 1) {
      console.log("  (pausing for rate limit...)")
      await new Promise((r) => setTimeout(r, 1500))
    }
  }

  console.log(`\nDone! Sent: ${sent}, Failed: ${failed}, Total: ${uniqueJudges.length}`)
  process.exit(0)
}

main()
