// List all semifinal judges from judgeScheduling
// Run with: npx tsx scripts/list-semifinal-judges.ts

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
  const snap = await db.collection("judgeScheduling").get()

  const all: Record<string, unknown>[] = []
  snap.docs.forEach((d) => all.push({ id: d.id, ...d.data() }))

  const judges = all.map((d) => ({
    judgeName: (d.judgeName as string) || "",
    email: ((d.email as string) || "").trim(),
    company: (d.company as string) || "",
    title: (d.title as string) || "",
    date: (d.date as string) || "",
    timeSlot: (d.timeSlot as string) || "",
  }))

  // Dedupe by email (one judge can have multiple slots)
  const seen = new Set<string>()
  const unique: typeof judges = []
  for (const j of judges) {
    const key = j.email.toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    unique.push(j)
  }

  unique.sort((a, b) => a.judgeName.localeCompare(b.judgeName))

  console.log(`\n=== SEMIFINAL JUDGES (${unique.length} unique) ===\n`)
  unique.forEach((j, i) => {
    const meta = [j.title, j.company].filter(Boolean).join(" @ ")
    console.log(`  ${i + 1}. ${j.judgeName} — ${j.email}${meta ? ` — ${meta}` : ""}`)
  })

  console.log(`\nTotal scheduling rows: ${snap.size}`)
  console.log(`Unique judges: ${unique.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
