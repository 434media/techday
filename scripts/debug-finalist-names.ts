// Quick debug: find exact company names for Freyya and Bytewhisper in pitchSubmissions
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
  // Search pitchSubmissions for anything matching freyya or bytewhisper
  const snap = await db.collection("pitchSubmissions").get()
  console.log(`Total pitchSubmissions: ${snap.size}`)
  for (const doc of snap.docs) {
    const name = doc.data().companyName || ""
    const lower = name.toLowerCase()
    if (lower.includes("freyya") || lower.includes("byte") || lower.includes("whisper")) {
      console.log(`  MATCH: "${name}" | founder: ${doc.data().founderName} | email: ${doc.data().email}`)
    }
  }

  // Also check pitchScheduling
  const schedSnap = await db.collection("pitchScheduling").get()
  console.log(`\nTotal pitchScheduling: ${schedSnap.size}`)
  for (const doc of schedSnap.docs) {
    const name = doc.data().companyName || ""
    const lower = name.toLowerCase()
    if (lower.includes("freyya") || lower.includes("byte") || lower.includes("whisper")) {
      console.log(`  MATCH: "${name}" | founder: ${doc.data().founderName}`)
    }
  }

  // Also list ALL company names so we can see all 5 finalists
  console.log("\nAll pitchSubmissions company names:")
  for (const doc of snap.docs) {
    console.log(`  - "${doc.data().companyName}"`)
  }
}

main().catch(console.error)
