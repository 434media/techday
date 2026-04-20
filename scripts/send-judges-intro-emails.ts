// Send "Meet Your Judges" email to the 5 finalists
// Run with: npx tsx scripts/send-judges-intro-emails.ts

import { readFileSync } from "fs"
import { resolve } from "path"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
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

function getJudgesIntroContent() {
  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Dear Tech Fuel Finalists,
    </h2>
    
    <p style="margin: 0 0 24px; color: #525252; font-size: 16px; line-height: 1.6;">
      As we get closer to competition day, we wanted to introduce the judges who will be evaluating this year's Tech Fuel Finals.
    </p>
    
    <!-- Judge: Ben Jones -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 16px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 24px;">
          <h3 style="margin: 0 0 8px; color: #ffffff; font-size: 18px; font-weight: 600;">
            Ben Jones
          </h3>
          <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            Entrepreneur and operator with experience building and scaling companies, bringing a practical founder's lens to growth, execution, and market opportunity.
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Judge: Ileana Gonzalez -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 16px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 24px;">
          <h3 style="margin: 0 0 8px; color: #ffffff; font-size: 18px; font-weight: 600;">
            Ileana Gonzalez
          </h3>
          <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            Former Tech Bloc CEO and innovation leader at H-E-B with experience inside one of Texas' most respected companies, offering perspective on innovation, operations, and enterprise execution at scale.
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Judge: Paul Lynch -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 16px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 24px;">
          <h3 style="margin: 0 0 8px; color: #ffffff; font-size: 18px; font-weight: 600;">
            Paul Lynch
          </h3>
          <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            Finance and software executive with deep experience helping companies improve planning, performance, and strategic decision-making.
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Judge: Ryan Saavedra -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 16px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 24px;">
          <h3 style="margin: 0 0 8px; color: #ffffff; font-size: 18px; font-weight: 600;">
            Ryan Saavedra
          </h3>
          <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            Founder and medtech entrepreneur focused on innovation in healthcare and human performance, with firsthand experience bringing new technologies to market. (Former Tech Fuel Finalist!)
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Judge: Cristal Glangchai -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 24px;">
          <h3 style="margin: 0 0 8px; color: #ffffff; font-size: 18px; font-weight: 600;">
            Cristal Glangchai
          </h3>
          <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            Founder of VentureLab and nationally recognized leader in youth entrepreneurship, dedicated to building the next generation of innovators and founders.
          </p>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We're proud to have such a strong panel supporting this year's competition, and we look forward to seeing you all take the stage.
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

  console.log(`Sending "Meet Your Judges" email to ${finalists.length} finalists:\n`)
  finalists.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.companyName} — ${f.founderName} — ${f.email}`)
  })
  console.log("")

  let sent = 0
  let failed = 0

  const content = getJudgesIntroContent()
  const html = getEmailTemplate(content)

  for (const finalist of finalists) {
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: finalist.email,
        replyTo: REPLY_TO,
        subject: "Tech Fuel Finals – Meet Your Judges",
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
    await new Promise((r) => setTimeout(r, 1200))
  }

  console.log(`\nDone: ${sent} sent, ${failed} failed`)
}

main()
