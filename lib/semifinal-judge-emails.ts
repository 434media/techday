// Server-only: maps a semi-finals judge id (lib/semifinal-judges.ts) to the
// judge's email address. Do not import from a client component.
//
// The mapping lives in the SEMIFINALS_JUDGE_EMAILS env var as a JSON object,
// e.g. {"jane-doe":"jane@example.com"}, so personal addresses are neither in the
// public repo nor in the browser bundle. A missing or malformed value yields no
// email: the slot is still saved, and no confirmation email is sent.

let cached: { raw: string | undefined; map: Record<string, string> } | null = null

function loadJudgeEmails(): Record<string, string> {
  const raw = process.env.SEMIFINALS_JUDGE_EMAILS
  if (cached && cached.raw === raw) return cached.map
  let map: Record<string, string> = {}
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw)
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        map = Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string"
          )
        )
      }
    } catch {
      console.error("SEMIFINALS_JUDGE_EMAILS is not valid JSON; judge emails unavailable")
    }
  }
  cached = { raw, map }
  return map
}

export function getSemifinalJudgeEmail(judgeId: string): string {
  return (loadJudgeEmails()[judgeId] || "").toLowerCase().trim()
}
