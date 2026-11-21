import { NextResponse } from "next/server"

// Public intake switches for Tech Day / Tech Fuel 2026 (held April 20–21, 2026).
// Every form below is closed now that the event is over: its POST route returns
// 410 Gone with a friendly message. Set true to reopen for the next event.
export const REGISTRATION_OPEN = false
export const PITCH_INTAKE_OPEN = false
export const SEMIFINALS_SIGNUPS_OPEN = false
export const ECOSYSTEM_TOURS_OPEN = false

// The forms show `error` to the user, so it must read as a complete sentence.
export function intakeClosed(message: string) {
  return NextResponse.json({ error: message, closed: true }, { status: 410 })
}
