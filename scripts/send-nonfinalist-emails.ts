// Send non-finalist notification to the 20 semifinalists who did not make finals
// Run with: npx tsx scripts/send-nonfinalist-emails.ts

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

// Duplicate to skip (PropyLaw submitted twice)
const SKIP_EMAIL = "aldo.tig011@gmail.com"

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

function getNonFinalistContent(founderName: string, companyName: string) {
  const firstName = founderName.split(" ")[0]
  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">Hi ${firstName},</h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you for being part of TechFuel 2026. Out of more than 75 applicants, you advanced to the top 25 semifinalists. That is a meaningful accomplishment, and <strong>${companyName}</strong> made a strong impression on our judges.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      After careful deliberation, we've selected our finalists for the April 20th event. While <strong>${companyName}</strong> will not be moving forward this round, we hope the experience was valuable and energizing. We have no doubt you are building something meaningful, and this is just one step in a much longer journey.
    </p>
    
    <p style="margin: 0 0 30px; color: #525252; font-size: 16px; line-height: 1.6;">
      The San Antonio tech community is stronger because of founders like you who show up, pitch, and put their work out there. That takes courage, and we respect it.
    </p>
    
    <h3 style="margin: 0 0 25px; color: #0a0a0a; font-size: 20px; font-weight: 700; border-bottom: 2px solid #c73030; padding-bottom: 10px;">
      A few things to keep in mind
    </h3>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="padding: 0 0 16px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align: top; padding-right: 12px; color: #c73030; font-size: 18px; font-weight: 700;">•</td>
              <td style="color: #525252; font-size: 15px; line-height: 1.6;">
                We would love to stay connected. Tech Fuel is more than a competition, and we hope this is just the beginning of your relationship with the community.
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 0 16px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align: top; padding-right: 12px; color: #c73030; font-size: 18px; font-weight: 700;">•</td>
              <td style="color: #525252; font-size: 15px; line-height: 1.6;">
                We will be sharing feedback from our judges soon, and we are happy to pass along notes that may be helpful as you continue to grow.
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align: top; padding-right: 12px; color: #c73030; font-size: 18px; font-weight: 700;">•</td>
              <td style="color: #525252; font-size: 15px; line-height: 1.6;">
                We encourage you to stay engaged with Tech Bloc's programming. I competed in Tech Fuel in 2019 and did not make it to the finals, but staying connected to the community created opportunities and growth that extended far beyond the competition. I encourage you to do the same.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you again for trusting us with your story.
    </p>
    
    <p style="margin: 0 0 5px; color: #525252; font-size: 16px; line-height: 1.6;">Keep building,</p>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0 0;">
      <tr><td><img src="${BETO_SIGNATURE_URL}" alt="Beto Altamirano signature" width="180" style="display: block; max-width: 180px; height: auto;" /></td></tr>
      <tr><td style="padding-top: 10px;">
        <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">Beto Altamirano</p>
        <p style="margin: 3px 0 0; color: #737373; font-size: 14px;">CEO, Tech Bloc</p>
      </td></tr>
    </table>
  `
}

async function main() {
  // Get all semifinalists from pitchScheduling
  const schedSnap = await db.collection("pitchScheduling").get()
  const semifinalistCompanies = new Set<string>()
  for (const doc of schedSnap.docs) {
    semifinalistCompanies.add((doc.data().companyName || "").toLowerCase())
  }

  // Get pitch submissions for non-finalists
  const pitchSnap = await db.collection("pitchSubmissions").get()
  const nonFinalists: { companyName: string; founderName: string; email: string }[] = []

  for (const doc of pitchSnap.docs) {
    const data = doc.data()
    const companyName = data.companyName || ""
    const email = data.email || ""

    // Must be a semifinalist
    if (!semifinalistCompanies.has(companyName.toLowerCase())) continue
    // Must NOT be a finalist
    if (FINALIST_COMPANIES.some((f) => f.toLowerCase() === companyName.toLowerCase())) continue
    // Skip duplicate PropyLaw entry
    if (email.toLowerCase() === SKIP_EMAIL) continue

    nonFinalists.push({
      companyName,
      founderName: data.founderName || "",
      email,
    })
  }

  console.log(`Sending non-finalist emails to ${nonFinalists.length} companies:\n`)
  nonFinalists.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.companyName} — ${f.founderName} — ${f.email}`)
  })
  console.log("")

  let sent = 0
  let failed = 0

  // Send in batches of 4 with 1.5s delay (rate limit: 5/sec)
  for (let i = 0; i < nonFinalists.length; i += 4) {
    const batch = nonFinalists.slice(i, i + 4)

    const results = await Promise.all(
      batch.map(async (nf) => {
        const content = getNonFinalistContent(nf.founderName, nf.companyName)
        const html = getEmailTemplate(content)
        try {
          const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: nf.email,
            replyTo: REPLY_TO,
            subject: "TechFuel 2026: Semifinal Results",
            html,
          })
          if (result.error) {
            console.error(`  FAIL: ${nf.email} —`, result.error)
            return false
          }
          console.log(`  OK: ${nf.email} (${result.data?.id})`)
          return true
        } catch (err) {
          console.error(`  FAIL: ${nf.email} —`, err)
          return false
        }
      })
    )

    sent += results.filter(Boolean).length
    failed += results.filter((r) => !r).length

    // Rate limit delay between batches
    if (i + 4 < nonFinalists.length) {
      await new Promise((r) => setTimeout(r, 1500))
    }
  }

  console.log(`\nDone! Sent: ${sent}, Failed: ${failed}`)
}

main()
