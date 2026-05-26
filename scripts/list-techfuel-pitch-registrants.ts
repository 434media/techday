// List every Tech Fuel pitch company that submitted AND registered for Tech Fuel 2026
// Run with: npx tsx scripts/list-techfuel-pitch-registrants.ts

import { readFileSync } from "fs"
import { resolve } from "path"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

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

async function main() {
  const pitchSnap = await db.collection("pitchSubmissions").get()
  const regSnap = await db.collection("registrations").get()

  // Build map of registered Tech Fuel attendee emails
  const techFuelRegEmails = new Map<string, { events: string[]; status: string }>()
  for (const doc of regSnap.docs) {
    const d = doc.data()
    const email = (d.email as string | undefined)?.toLowerCase().trim()
    if (!email) continue
    const events: string[] = (d.events as string[]) || ["techday"]
    if (events.includes("techfuel") || events.includes("2day")) {
      techFuelRegEmails.set(email, { events, status: (d.status as string) || "" })
    }
  }

  const matches: {
    companyName: string
    founderName: string
    email: string
    events: string[]
    status: string
  }[] = []
  const submittedNotRegistered: { companyName: string; founderName: string; email: string }[] = []

  for (const doc of pitchSnap.docs) {
    const data = doc.data()
    const email = ((data.email as string | undefined) || "").toLowerCase().trim()
    const entry = {
      companyName: (data.companyName as string) || "",
      founderName: (data.founderName as string) || "",
      email: (data.email as string) || "",
    }
    if (!email) continue
    const reg = techFuelRegEmails.get(email)
    if (reg) {
      matches.push({ ...entry, events: reg.events, status: reg.status })
    } else {
      submittedNotRegistered.push(entry)
    }
  }

  matches.sort((a, b) => a.companyName.localeCompare(b.companyName))

  console.log(`\n=== TECH FUEL PITCH COMPANIES THAT SUBMITTED + REGISTERED (${matches.length}) ===\n`)
  matches.forEach((m, i) => {
    console.log(
      `  ${i + 1}. ${m.companyName} — ${m.founderName} — ${m.email}  [events: ${m.events.join(",")} | status: ${m.status}]`,
    )
  })

  console.log(`\n=== SUBMITTED PITCH BUT NOT REGISTERED FOR TECH FUEL (${submittedNotRegistered.length}) ===\n`)
  submittedNotRegistered.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.companyName} — ${m.founderName} — ${m.email}`)
  })

  console.log(`\nTotal pitch submissions: ${pitchSnap.size}`)
  console.log(`Total Tech Fuel registrants: ${techFuelRegEmails.size}`)
  console.log(`Overlap (submitted + registered): ${matches.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
