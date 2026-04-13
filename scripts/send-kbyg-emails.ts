// Send KBYG (Know Before You Go) email to the 5 TechFuel finalists
// Run with: npx tsx scripts/send-kbyg-emails.ts

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

const FINALIST_COMPANIES = [
  "Freyya, Inc.",
  "Openlane",
  "RentBamboo",
  "Bytewhisper Security, Inc.",
  "ComeBack Mobility",
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

function getKBYGContent() {
  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hello!
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We're excited to welcome you to TechFuel, San Antonio's premier startup pitch competition and one of the most anticipated nights in the local tech community. As a pitch participant, here's everything you need to know before you arrive:
    </p>
    
    <!-- Event Location -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">
            &#128205; Event Location
          </h3>
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 15px; line-height: 1.6;">
            <strong style="color: #ffffff;">UTSA San Pedro I</strong><br>
            506 Dolorosa St.<br>
            San Antonio, TX 78204
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Event Schedule -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 25px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">
            &#9200; Event Schedule
          </h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 8px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">Tech Rehearsal:</strong> 1:00 PM
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 8px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">Doors Open to Attendees:</strong> 1:30 PM
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 8px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">Networking:</strong> 1:30 – 2:00 PM
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 8px;">
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">Pitch Competition:</strong> 2:00 – 5:00 PM
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p style="margin: 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #c73030;">After Party &amp; Celebration:</strong> 5:00 – 6:00 PM
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 25px; color: #525252; font-size: 15px; line-height: 1.6;">
      We recommend arriving early to get settled, check in, and prepare ahead of the program start.
    </p>
    
    <!-- Parking & Arrival -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
            &#128663; Parking &amp; Arrival
          </h3>
          <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
            Downtown San Antonio will be experiencing increased traffic and limited parking due to Fiesta San Antonio events taking place the same day.
          </p>
          <p style="margin: 0 0 12px; color: #525252; font-size: 15px; line-height: 1.6;">
            As a presenter, please plan accordingly:
          </p>
          <ul style="margin: 0 0 15px; padding-left: 20px; color: #525252; font-size: 15px; line-height: 1.8;">
            <li>Arrive early to allow extra time for parking, check-in, and pre-pitch prep</li>
            <li>Consider rideshare services (Uber/Lyft) to avoid delays</li>
          </ul>
          <p style="margin: 0 0 10px; color: #525252; font-size: 15px; line-height: 1.6;">
            Parking is available in nearby lots; however, availability may be impacted by Fiesta activity. <a href="https://www.sanantonio.gov/CCDO/Parking" style="color: #c73030; text-decoration: none; font-weight: 500;">Visit this link</a> to see city parking options.
          </p>
          <p style="margin: 0; color: #0a0a0a; font-size: 14px; line-height: 1.6; font-weight: 600; background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 4px; padding: 10px 12px;">
            NOTE: Tech Bloc will reimburse your parking with validation.
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Presenter Reminders & FAQ -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
            &#127908; Presenter Reminders &amp; FAQ
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #525252; font-size: 15px; line-height: 2;">
            <li>Plan to be onsite and checked in no later than <strong>12:45 PM</strong> for tech rehearsal</li>
            <li>Please make sure your presentation is emailed to <a href="mailto:ceo@satechbloc.com" style="color: #c73030; text-decoration: none; font-weight: 500;">ceo@satechbloc.com</a> with cc to <a href="mailto:marcos@434media.com" style="color: #c73030; text-decoration: none; font-weight: 500;">marcos@434media.com</a> NLT <strong>Thursday, 4/16 at 5pm</strong></li>
            <li>Your presentation will be pre-loaded onto the venue's laptop</li>
            <li>You will be provided a clicker and handheld mic at the venue</li>
            <li>There will be multiple screens in the venue that will serve as confidence monitors but there will be no direct confidence monitor on the stage</li>
            <li>For audience voting, a QR code will be provided during the competition for attendees to cast their vote. Each attendee is limited to one vote, tied to the email address used for event registration</li>
          </ul>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
      Any further questions, please contact <a href="mailto:nichole@434media.com" style="color: #c73030; text-decoration: none; font-weight: 500;">nichole@434media.com</a> directly.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We can't wait to see you and wish you the best of luck on stage!
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
  // Get finalists from pitchSubmissions
  const pitchSnap = await db.collection("pitchSubmissions").get()
  const finalists: { companyName: string; founderName: string; email: string }[] = []

  for (const doc of pitchSnap.docs) {
    const data = doc.data()
    const companyName = data.companyName || ""
    if (FINALIST_COMPANIES.some((f) => f.toLowerCase() === companyName.toLowerCase())) {
      finalists.push({
        companyName,
        founderName: data.founderName || "",
        email: data.email || "",
      })
    }
  }

  console.log(`Sending KBYG emails to ${finalists.length} finalists:\n`)
  finalists.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.companyName} — ${f.founderName} — ${f.email}`)
  })
  console.log("")

  let sent = 0
  let failed = 0

  for (const finalist of finalists) {
    const content = getKBYGContent()
    const html = getEmailTemplate(content)
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: finalist.email,
        replyTo: REPLY_TO,
        subject: "TechFuel 2026: Know Before You Go 📍",
        html,
      })
      if (result.error) {
        console.error(`  FAIL: ${finalist.email} —`, result.error)
        failed++
      } else {
        console.log(`  OK: ${finalist.email} (${result.data?.id})`)
        sent++
      }
    } catch (err) {
      console.error(`  FAIL: ${finalist.email} —`, err)
      failed++
    }
    // Small delay between sends
    await new Promise((r) => setTimeout(r, 1200))
  }

  console.log(`\nDone! Sent: ${sent}, Failed: ${failed}`)
}

main()
