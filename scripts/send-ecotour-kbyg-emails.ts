// Send Ecosystem Tours KBYG email to all registrants with ecosystemTours === true
// Run with: npx tsx scripts/send-ecotour-kbyg-emails.ts

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
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Tech Fuel 2026</title></head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa;">
    <tr><td align="center" style="padding: 40px 20px;">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color: #0a0a0a; padding: 40px 40px 30px; text-align: center; position: relative;">
            <div style="position: absolute; top: 20px; right: 20px; opacity: 0.15;">${DOWN_ARROW_SVG}</div>
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
              TECH FUEL <span style="color: #c73030;">2026</span>
            </h1>
            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
              April 20, 2026 • 2:00–6:00 PM • UTSA SP1
            </p>
            <p style="margin: 6px 0 0;"><a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none; font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;">sanantoniotechday.com</a></p>
          </td>
        </tr>
        <tr><td style="padding: 40px;">${content}</td></tr>
        <tr>
          <td style="background-color: #0a0a0a; padding: 30px 40px; text-align: center;">
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

function getEcoTourKBYGContent() {
  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hello!
    </h2>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We're excited to have you join us for the <strong>Ecosystem Tours + Tech Fuel Pitch Competition</strong>, a unique opportunity to explore San Antonio's innovation ecosystem before the main event.
    </p>

    <p style="margin: 0 0 25px; color: #525252; font-size: 16px; line-height: 1.6;">
      Here's everything you need to know before you arrive:
    </p>

    <!-- Event Location -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">
            &#128205; Event Location (Starting Point)
          </h3>
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6;">
            <strong style="color: #ffffff;">UTSA San Pedro I (SP1)</strong><br>
            506 Dolorosa St.<br>
            San Antonio, TX 78204
          </p>
        </td>
      </tr>
    </table>

    <!-- Tour + Event Timing -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">
            &#9200; Tour + Event Timing
          </h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 8px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">Tour Attendee Check-In:</strong> 11:00 AM
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 15px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">Tour Departure:</strong> 11:15 AM (promptly)
                </p>
              </td>
            </tr>
          </table>
          <p style="margin: 0 0 10px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Tour Schedule</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 6px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">11:15 AM</strong> – Depart SP1 → Port San Antonio
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 6px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">11:30 AM – 12:15 PM</strong> – Tour of Port San Antonio + Boeing Center at Tech Port
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 6px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">12:15 PM</strong> – Depart → VelocityTX
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 6px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">12:30 PM – 1:15 PM</strong> – Tour of VelocityTX
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 6px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">1:15 PM</strong> – Depart back to SP1
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">1:30 PM</strong> – Return to SP1
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Shuttle Information -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
            &#128653; Shuttle Information
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #525252; font-size: 15px; line-height: 1.8;">
            <li>All tours are shuttle-based — no need to drive between locations</li>
            <li>Boarding will take place at UTSA SP1</li>
            <li>Shuttle will depart on time, so please be ready to load promptly</li>
          </ul>
        </td>
      </tr>
    </table>

    <!-- Parking & Arrival -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
            &#128663; Parking &amp; Arrival
          </h3>
          <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
            Downtown San Antonio will be experiencing increased traffic and limited parking due to Fiesta San Antonio taking place the same day. <a href="https://www.sanantonio.gov/CCDO/Parking" style="color: #c73030; text-decoration: none; font-weight: 500;">Visit this link</a> to see city parking options.
          </p>
          <p style="margin: 0 0 12px; color: #525252; font-size: 15px; line-height: 1.6;">
            We strongly recommend:
          </p>
          <ul style="margin: 0; padding-left: 20px; color: #525252; font-size: 15px; line-height: 1.8;">
            <li>Arriving early to allow time for parking and check-in</li>
            <li>Considering rideshare services (Uber/Lyft)</li>
            <li>Carpooling when possible</li>
          </ul>
        </td>
      </tr>
    </table>

    <!-- What to Expect -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">
            &#128095; What to Expect
          </h3>
          <ul style="margin: 0 0 15px; padding-left: 20px; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.8;">
            <li>Walking tours through active innovation campuses</li>
            <li>Behind-the-scenes access to key tech and biotech hubs</li>
            <li>Opportunities to ask questions and connect with leaders in the ecosystem</li>
          </ul>
          <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 14px; font-style: italic;">
            Wear comfortable shoes and dress business casual.
          </p>
        </td>
      </tr>
    </table>

    <!-- After the Tour -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
            &#127908; After the Tour
          </h3>
          <p style="margin: 0 0 10px; color: #525252; font-size: 15px; line-height: 1.6;">
            Following your return to SP1, you'll roll right into TechFuel:
          </p>
          <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">
            2:00 – 6:00 PM: Startup Pitch Competition
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We're looking forward to exploring with you and kicking off an exciting day at TechFuel!
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
  // Get all registrations with ecosystemTours === true and active status
  const regSnap = await db.collection("registrations").get()
  const ecoTourRegistrants: { firstName: string; lastName: string; email: string }[] = []

  for (const doc of regSnap.docs) {
    const data = doc.data()
    if (
      data.ecosystemTours === true &&
      data.status !== "cancelled" &&
      data.email
    ) {
      ecoTourRegistrants.push({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email,
      })
    }
  }

  console.log(`Found ${ecoTourRegistrants.length} ecosystem tour registrants:\n`)
  ecoTourRegistrants.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.firstName} ${r.lastName} — ${r.email}`)
  })
  console.log("")

  let sent = 0
  let failed = 0
  const BATCH_SIZE = 8
  const BATCH_DELAY = 1500

  for (let i = 0; i < ecoTourRegistrants.length; i++) {
    const registrant = ecoTourRegistrants[i]
    const content = getEcoTourKBYGContent()
    const html = getEmailTemplate(content)

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: registrant.email,
        replyTo: REPLY_TO,
        subject: "Ecosystem Tours + TechFuel 2026: Know Before You Go 📍",
        html,
      })
      if (result.error) {
        console.error(`  FAIL: ${registrant.email} —`, result.error)
        failed++
      } else {
        console.log(`  OK: ${registrant.email} (${result.data?.id})`)
        sent++
      }
    } catch (err) {
      console.error(`  FAIL: ${registrant.email} —`, err)
      failed++
    }

    // Rate limit: pause after every batch
    if ((i + 1) % BATCH_SIZE === 0 && i + 1 < ecoTourRegistrants.length) {
      console.log(`  --- batch pause (${i + 1} sent so far) ---`)
      await new Promise((r) => setTimeout(r, BATCH_DELAY))
    } else {
      await new Promise((r) => setTimeout(r, 200))
    }
  }

  console.log(`\nDone! Sent: ${sent}, Failed: ${failed}`)
}

main()
