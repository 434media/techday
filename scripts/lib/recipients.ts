// Recipient lists for the one-off email scripts.
//
// Personal email addresses are never committed (this repo is public). Each
// script reads its list from a JSON file kept OUTSIDE the repo, whose path is
// given by an env var in .env.local, or from a comma-separated env var.
// Read these inside main(), after the script has loaded .env.local.

import { readFileSync } from "fs"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readJsonFile(envVar: string): unknown {
  const path = process.env[envVar]?.trim()
  if (!path) {
    throw new Error(`${envVar} is not set. Point it at a JSON file outside the repo (see scripts/lib/recipients.ts).`)
  }
  try {
    return JSON.parse(readFileSync(path, "utf-8"))
  } catch (err) {
    throw new Error(`${envVar}: could not read JSON from ${path}: ${err instanceof Error ? err.message : String(err)}`)
  }
}

// JSON file holding an array of email strings: ["a@example.com", ...]
export function loadEmailListFile(envVar: string): string[] {
  const data = readJsonFile(envVar)
  if (!Array.isArray(data) || !data.every((e) => typeof e === "string" && EMAIL_RE.test(e.trim()))) {
    throw new Error(`${envVar}: expected a JSON array of email addresses`)
  }
  return data.map((e: string) => e.trim())
}

// JSON file holding an array of people: [{ "name": "Jane Doe", "email": "jane@example.com" }, ...]
export function loadPeopleFile(envVar: string): { name: string; email: string }[] {
  const data = readJsonFile(envVar)
  const ok =
    Array.isArray(data) &&
    data.every(
      (p) =>
        p && typeof p === "object" &&
        typeof (p as { name?: unknown }).name === "string" &&
        typeof (p as { email?: unknown }).email === "string" &&
        EMAIL_RE.test((p as { email: string }).email.trim())
    )
  if (!ok) {
    throw new Error(`${envVar}: expected a JSON array of { "name": string, "email": string }`)
  }
  return (data as { name: string; email: string }[]).map((p) => ({ name: p.name.trim(), email: p.email.trim() }))
}

// Optional comma-separated list of emails in an env var. Unset = [].
export function loadEmailListEnv(envVar: string): string[] {
  return (process.env[envVar] || "")
    .split(",")
    .map((e: string) => e.trim())
    .filter((e: string) => e.length > 0)
}
