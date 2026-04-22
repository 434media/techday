// Send Tech Day networking happy hour email to Tech Day registrants
// Filters to registrants with techday or 2day events
// Run with: npx tsx scripts/send-techday-happy-hour-emails.ts

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
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
  process.env[key] = val
}

function parsePrivateKey(key: string): string {
  let parsed = key.trim()
  if ((parsed.startsWith('"') && parsed.endsWith('"')) || (parsed.startsWith("'") && parsed.endsWith("'"))) parsed = parsed.slice(1, -1)
  parsed = parsed.replace(/\\n/g, "\n")
  if (!parsed.includes("\n") && parsed.length > 100) {
    parsed = parsed.replace(/-----BEGIN PRIVATE KEY-----/g, "-----BEGIN PRIVATE KEY-----\n").replace(/-----END PRIVATE KEY-----/g, "\n-----END PRIVATE KEY-----")
  }
  return parsed
}

const app = getApps().length ? getApps()[0] : initializeApp({
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
            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">April 21, 2026 - 1:00-4:00 PM - Boeing Center at Tech Port</p>
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

function getHappyHourContent(firstName: string) {
  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Thank You for Joining Us Today${firstName ? `, ${firstName}` : ""}.
    </h2>

    <p style="margin: 0 0 18px; color: #525252; font-size: 16px; line-height: 1.6;">
      We appreciate you being part of Tech Day.
    </p>

    <p style="margin: 0 0 18px; color: #525252; font-size: 16px; line-height: 1.6;">
      Join us for our networking happy hour starting at <strong style="color: #0a0a0a;">5:00 PM</strong> as a thank you.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
          <h3 style="margin: 0 0 10px; color: #0a0a0a; font-size: 18px; font-weight: 600;">Networking Happy Hour</h3>
          <p style="margin: 0; color: #525252; font-size: 15px; line-height: 1.6;">
            Meet us in the <strong style="color: #0a0a0a;">Tech Port Food Court</strong> for drink tickets and great conversation.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you again, and we hope to see you there.
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

const BATCH_SIZE = 8
const BATCH_DELAY_MS = 1500
const INDIVIDUAL_DELAY_MS = 200

async function main() {
  console.log("Sending Tech Day networking happy hour emails now.\n")
  console.log("Fetching Tech Day registrants...\n")

  const snapshot = await db
    .collection("registrations")
    .where("status", "in", ["confirmed", "pending", "checked-in"])
    .get()

  const registrants = snapshot.docs
    .map((doc) => {
      const d = doc.data()
      return {
        email: d.email as string,
        firstName: d.firstName as string,
        events: (d.events as string[]) || ["techday"],
      }
    })
    .filter((r) => {
      return r.events.includes("techday") || r.events.includes("2day")
    })

  console.log(`Found ${registrants.length} Tech Day registrants\n`)

  let sent = 0
  let failed = 0
  const failures: { email: string; error: unknown }[] = []

  for (let i = 0; i < registrants.length; i += BATCH_SIZE) {
    const batch = registrants.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(registrants.length / BATCH_SIZE)
    console.log(`--- Batch ${batchNum}/${totalBatches} (${batch.length} emails) ---`)

    for (const reg of batch) {
      const content = getHappyHourContent(reg.firstName)
      const html = getEmailTemplate(content)

      try {
        const result = await resend.emails.send({
          from: FROM_EMAIL,
          to: reg.email,
          replyTo: REPLY_TO,
          subject: "Thank You for Joining Us Today - Networking Happy Hour at 5:00 PM",
          html,
        })

        if (result.error) {
          console.error(`  FAIL: ${reg.email} -`, result.error)
          failed++
          failures.push({ email: reg.email, error: result.error })
        } else {
          console.log(`  SENT: ${reg.email} - ${result.data?.id}`)
          sent++
        }
      } catch (err) {
        console.error(`  FAIL: ${reg.email} -`, err)
        failed++
        failures.push({ email: reg.email, error: err })
      }

      await new Promise((r) => setTimeout(r, INDIVIDUAL_DELAY_MS))
    }

    if (i + BATCH_SIZE < registrants.length) {
      console.log(`  (waiting ${BATCH_DELAY_MS}ms before next batch...)\n`)
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS))
    }
  }

  console.log("\n========== SUMMARY ==========")
  console.log(`Total: ${registrants.length}`)
  console.log(`Sent: ${sent}`)
  console.log(`Failed: ${failed}`)

  if (failures.length > 0) {
    console.log("\nFailed emails:")
    for (const f of failures) {
      console.log(`  - ${f.email}: ${JSON.stringify(f.error)}`)
    }
  }
}

main()
