// List every Tech Fuel pitch company that submitted a pitch
// Run with: npx tsx scripts/list-pitch-submissions.ts

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

  const submissions: { companyName: string; founderName: string; email: string }[] = []
  for (const doc of pitchSnap.docs) {
    const d = doc.data()
    submissions.push({
      companyName: (d.companyName as string) || "",
      founderName: (d.founderName as string) || "",
      email: (d.email as string) || "",
    })
  }

  submissions.sort((a, b) => a.companyName.localeCompare(b.companyName))

  console.log(`\n=== TECH FUEL PITCH SUBMISSIONS (${submissions.length}) ===\n`)
  submissions.forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.founderName} — ${s.companyName} — ${s.email}`)
  })
  console.log(`\nTotal: ${submissions.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
