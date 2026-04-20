// Preview Ecosystem Tours Insider Preview email — sends to jesse@434media.com only
// Run with: npx tsx scripts/send-ecotour-insider-preview.ts

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
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  process.env[key] = val
}

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = "Beto Altamirano <ceo@send.satechbloc.com>"
const REPLY_TO = "ceo@satechbloc.com"
const PREVIEW_EMAILS = ["jesse@434media.com", "marcos@434media.com", "ceo@satechbloc.com"]

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

function getEcoTourInsiderContent() {
  return `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hello,
    </h2>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We're looking forward to welcoming you to the Ecosystem Tours ahead of Tech Fuel.
    </p>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      This is more than transportation between venues. It's an insider look at two of the organizations helping shape San Antonio's future in cybersecurity, advanced manufacturing, bioscience, and innovation.
    </p>

    <p style="margin: 0 0 25px; color: #525252; font-size: 16px; line-height: 1.6;">
      Here's a preview of where you're going and who will be guiding the experience.
    </p>

    <!-- Port San Antonio -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 28px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">
            Port San Antonio + Boeing Center at Tech Port
          </h3>
          <p style="margin: 0 0 15px; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            Your tour will be led by <strong style="color: #ffffff;">Will Garrett</strong>, one of the key figures behind the growth of San Antonio's cybersecurity ecosystem.
          </p>
          <p style="margin: 0 0 15px; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            At Port San Antonio, Will works across employers, educators, startups, and the public sector to help expand one of the fastest-growing cyber hubs in the country. The Port is now home to aerospace, defense, advanced manufacturing, robotics, and emerging mobility initiatives—all built on the grounds of the former Kelly Air Force Base.
          </p>
          <p style="margin: 0 0 15px; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            What was once military infrastructure is now a modern innovation district driving jobs, investment, and national relevance.
          </p>
          <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.6;">
            Explore more before you arrive:<br>
            <a href="https://artsandculture.google.com/story/kwWxjQvyEwSViA" style="color: #c73030; text-decoration: none; font-weight: 500;">artsandculture.google.com</a>
          </p>
        </td>
      </tr>
    </table>

    <!-- VelocityTX -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 28px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 18px; font-weight: 600;">
            VelocityTX
          </h3>
          <p style="margin: 0 0 15px; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            Your second stop will be VelocityTX, guided by <strong style="color: #ffffff;">Jeremy Nelson</strong>, who is helping to build one of San Antonio's most important platforms for bioscience and life science commercialization.
          </p>
          <p style="margin: 0 0 15px; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            VelocityTX connects startups, researchers, military medicine, and industry leaders to accelerate innovation in healthcare and human performance. It represents the intersection of science, entrepreneurship, and real-world application.
          </p>
          <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 15px; line-height: 1.6;">
            This is where ideas move from research to market—and where San Antonio's $44B bioscience and military health ecosystem continues to gain momentum.
          </p>
        </td>
      </tr>
    </table>

    <!-- 434 Media Preview -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 25px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <p style="margin: 0 0 8px; color: #525252; font-size: 15px; line-height: 1.6;">
            Preview the story produced by our media sponsor, 434 Media:
          </p>
          <p style="margin: 0;">
            <a href="https://drive.google.com/file/d/1TzBQD-tTXJ6YgFjXk84UgOiBgdSSUEyl/view" style="color: #c73030; text-decoration: none; font-weight: 500; font-size: 15px;">Watch the preview</a>
          </p>
        </td>
      </tr>
    </table>

    <!-- Why This Matters -->
    <h3 style="margin: 0 0 15px; color: #0a0a0a; font-size: 20px; font-weight: 700; border-bottom: 2px solid #c73030; padding-bottom: 10px;">
      Why This Matters
    </h3>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      San Antonio's innovation story is not built in one building or one industry. It is being shaped across multiple sectors, by leaders willing to build infrastructure, create opportunity, and connect ecosystems.
    </p>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      These tours are your chance to see that story up close.
    </p>

    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We look forward to having you with us.
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
  const content = getEcoTourInsiderContent()
  const html = getEmailTemplate(content)

  console.log(`Sending preview to ${PREVIEW_EMAILS.join(", ")}...`)
  for (const email of PREVIEW_EMAILS) {
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        replyTo: REPLY_TO,
        subject: "Tech Day Ecosystem Tours Insider Preview – Port San Antonio + VelocityTX",
        html,
      })
      if (result.error) {
        console.error(`  FAIL: ${email} —`, result.error)
      } else {
        console.log(`  OK: ${email} (${result.data?.id})`)
      }
    } catch (err) {
      console.error(`  FAIL: ${email} —`, err)
    }
    await new Promise((r) => setTimeout(r, 1200))
  }
}

main()
