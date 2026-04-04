// List the 20 non-finalist semifinalists (25 semis minus 5 finalists)
// Run with: npx tsx scripts/list-nonfinalists.ts

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

const FINALIST_COMPANIES = [
  "Freyya, Inc.",
  "Openlane",
  "RentBamboo",
  "Bytewhisper Security, Inc.",
  "ComeBack Mobility",
]

async function main() {
  // Get all semifinalists from pitchScheduling
  const schedSnap = await db.collection("pitchScheduling").get()
  console.log(`Total pitchScheduling entries (semifinalists): ${schedSnap.size}\n`)

  // Get company names from scheduling to cross-reference with pitchSubmissions
  const semifinalistCompanies = new Set<string>()
  for (const doc of schedSnap.docs) {
    const name = doc.data().companyName || ""
    semifinalistCompanies.add(name.toLowerCase())
  }

  // Get all pitch submissions
  const pitchSnap = await db.collection("pitchSubmissions").get()

  const finalists: { companyName: string; founderName: string; email: string }[] = []
  const nonFinalists: { companyName: string; founderName: string; email: string }[] = []

  for (const doc of pitchSnap.docs) {
    const data = doc.data()
    const companyName = data.companyName || ""
    
    // Only include semifinalists (those in pitchScheduling)
    if (!semifinalistCompanies.has(companyName.toLowerCase())) continue

    const entry = {
      companyName,
      founderName: data.founderName || "",
      email: data.email || "",
    }

    if (FINALIST_COMPANIES.some((f) => f.toLowerCase() === companyName.toLowerCase())) {
      finalists.push(entry)
    } else {
      nonFinalists.push(entry)
    }
  }

  console.log(`=== FINALISTS (${finalists.length}) ===`)
  finalists.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.companyName} — ${f.founderName} — ${f.email}`)
  })

  console.log(`\n=== NON-FINALISTS (${nonFinalists.length}) ===`)
  nonFinalists.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f.companyName} — ${f.founderName} — ${f.email}`)
  })

  console.log(`\nTotal: ${finalists.length} finalists + ${nonFinalists.length} non-finalists = ${finalists.length + nonFinalists.length}`)
}

main()
