// Display roster for the Tech Fuel semi-finals judge scheduling form.
// Client-safe: names and ids only. Judges' email addresses are never shipped to
// the browser or committed; the server maps id -> email from the
// SEMIFINALS_JUDGE_EMAILS env var (see lib/semifinal-judge-emails.ts).

export interface SemifinalJudge {
  id: string
  name: string
}

export const SEMIFINAL_JUDGES: SemifinalJudge[] = [
  { id: "alfonso-garcia", name: "Alfonso Garcia" },
  { id: "alfred-breuer", name: "Alfred Breuer" },
  { id: "andrea-casillas", name: "Andrea Casillas" },
  { id: "areli-fontecha", name: "Areli Fontecha" },
  { id: "beto-gomez", name: "Beto Gomez" },
  { id: "carmen-aramanda", name: "Carmen Aramanda" },
  { id: "chris-burney", name: "Chris Burney" },
  { id: "chris-packham", name: "Chris Packham" },
  { id: "cliff-zintgraff", name: "Cliff Zintgraff" },
  { id: "elizabeth-eichhorn", name: "Elizabeth Eichhorn" },
  { id: "enrique-pavlioglou", name: "Enrique Pavlioglou" },
  { id: "heidi-leach", name: "Heidi Leach" },
  { id: "joe-broschak", name: "Joe Broschak" },
  { id: "lawrence-coffee", name: "Lawrence Coffee" },
  { id: "lina-rugova", name: "Lina Rugova" },
  { id: "marcos-resendez", name: "Marcos Resendez" },
  { id: "mayra-delgado", name: "Mayra Delgado" },
  { id: "melissa-chalfant", name: "Melissa Chalfant" },
  { id: "melissa-unsell-smith", name: "Melissa Unsell-Smith" },
  { id: "rhia-pape", name: "Rhia Pape" },
  { id: "robert-miggins", name: "Robert Miggins" },
  { id: "shirley-frobish", name: "Shirley Frobish" },
  { id: "travis-runty", name: "Travis Runty" },
  { id: "victor-reyna", name: "Victor Reyna" },
  { id: "walt-ugalde", name: "Walt Ugalde" },
]

export function findSemifinalJudge(id: unknown): SemifinalJudge | undefined {
  if (typeof id !== "string") return undefined
  return SEMIFINAL_JUDGES.find((j) => j.id === id)
}
