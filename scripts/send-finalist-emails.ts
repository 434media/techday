// Send finalist notification to the 5 finalists
// Run with: npx tsx scripts/send-finalist-emails.ts

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

function getFinalistContent(founderName: string, companyName: string) {
  const firstName = founderName.split(" ")[0]
  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hi ${firstName},
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Congratulations — <strong>${companyName}</strong> has advanced to the <strong>TechFuel 2026 FINALS!</strong>
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Out of more than 75 applicants, we selected 25 semifinalists, and from that group, you've earned a spot as one of the top 5 startups. That's a significant accomplishment and a reflection of the strength of what you're building. You should be proud of the work that got you here.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We were impressed by your pitch and are excited to have you present in person on April 20th. You've earned it.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      &#128274; <strong>Please keep this confidential until Tuesday, April 7th.</strong>
    </p>
    
    <p style="margin: 0 0 30px; color: #525252; font-size: 16px; line-height: 1.6;">
      We'll be announcing all finalists across our social channels that day. Once live, we encourage you to share widely.
    </p>
    
    <h3 style="margin: 0 0 25px; color: #0a0a0a; font-size: 20px; font-weight: 700; border-bottom: 2px solid #c73030; padding-bottom: 10px;">
      What's Next
    </h3>
    
    <!-- Pitch Bootcamp Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <p style="margin: 0 0 8px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            Tech Bloc &bull; Geekdom
          </p>
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">
            Pitch Bootcamp (April 10–12)
          </h3>
          
          <p style="margin: 0 0 20px; color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.6;">
            Please make arrangements to block this in your schedule. In partnership with Geekdom, all finalists will participate in a focused weekend to sharpen your pitch and prepare for the stage:
          </p>
          
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 12px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Friday (Evening)</p>
                <p style="margin: 0; color: #ffffff; font-size: 14px;">Welcome dinner with finalists and key community stakeholders</p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 12px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Saturday (Workshop Day @ Geekdom)</p>
                <p style="margin: 0; color: #ffffff; font-size: 14px;">Pitch practice, live feedback, storytelling and stage presence sessions, and 1:1 coaching with mentors</p>
              </td>
            </tr>
            <tr>
              <td>
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Sunday (Brunch)</p>
                <p style="margin: 0; color: #ffffff; font-size: 14px;">"Fuel Up" closing brunch with finalists, mentors, and ecosystem leaders, including quick pitches from each team</p>
              </td>
            </tr>
          </table>
          
          <p style="margin: 15px 0 0; color: rgba(255,255,255,0.5); font-size: 13px; font-style: italic;">
            More details to follow shortly.
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Final Pitch Deck -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 16px; font-weight: 600;">
            Final Pitch Deck
          </h3>
          <p style="margin: 0 0 8px; color: #525252; font-size: 15px; line-height: 1.6;">
            Please submit your final pitch deck by <strong>April 16 at 11:00 PM</strong>. All decks will be compiled into a master presentation.
          </p>
          <p style="margin: 0; color: #525252; font-size: 15px; line-height: 1.6;">
            Send your deck to <a href="mailto:ceo@satechbloc.com" style="color: #c73030; text-decoration: none; font-weight: 500;">ceo@satechbloc.com</a>
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Day-of Details -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 16px; font-weight: 600;">
            Day-of Details
          </h3>
          <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
            Plan to arrive at the <strong>UTSA San Pedro I Weston Conference Center</strong> by <strong>1:00 PM on April 20</strong> for walkthrough and AV check.
          </p>
          <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
            Fiesta San Antonio will be in full swing, so please allow additional time for travel and parking to ensure an on-time arrival. Recommended parking options include the <strong>SP1 lot on Dolorosa</strong> or the <strong>City of San Antonio garage on Houston</strong>. Availability is not guaranteed, so please plan accordingly.
          </p>
          <p style="margin: 0; color: #525252; font-size: 15px; line-height: 1.6;">
            A "Know Before You Go" will be sent at least 48 hours in advance. Please check your spam folder or follow up directly with <a href="mailto:nichole@434media.com" style="color: #c73030; text-decoration: none; font-weight: 500;">nichole@434media.com</a>.
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Audience Vote -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 16px; font-weight: 600;">
            Audience Vote
          </h3>
          <p style="margin: 0 0 8px; color: #525252; font-size: 15px; line-height: 1.6;">
            3rd and 4th place may be determined by live audience vote. We encourage you to invite your network:
          </p>
          <p style="margin: 0;">
            <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none; font-weight: 500; font-size: 15px;">sanantoniotechday.com</a>
          </p>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We'll be in close touch with more details soon. In the meantime, don't hesitate to reach out with any questions.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Congratulations again — see you at the finals.
    </p>
    
    <p style="margin: 0 0 5px; color: #525252; font-size: 16px; line-height: 1.6;">
      Keep building,
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

  console.log(`Sending finalist emails to ${finalists.length} companies:\n`)
  finalists.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.companyName} — ${f.founderName} — ${f.email}`)
  })
  console.log("")

  let sent = 0
  let failed = 0

  // Send one at a time with delay (only 5 emails)
  for (const finalist of finalists) {
    const content = getFinalistContent(finalist.founderName, finalist.companyName)
    const html = getEmailTemplate(content)
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: finalist.email,
        replyTo: REPLY_TO,
        subject: "TechFuel 2026: Semifinal Results",
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
