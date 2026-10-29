// Zoom details for the Tech Fuel semi-finals, read from server-side env vars.
//
// The join URLs carry an embedded passcode, so they must never be committed or
// shipped in a client bundle. Import this module from server code only (route
// handlers, lib/email, scripts). The env var names deliberately have no
// NEXT_PUBLIC_ prefix, so even an accidental client import reads undefined.
//
// Env vars, one set per semi-finals date (YYYYMMDD):
//   ZOOM_SEMIFINALS_20260402_URL, ZOOM_SEMIFINALS_20260402_MEETING_ID, ZOOM_SEMIFINALS_20260402_PASSCODE
//   ZOOM_SEMIFINALS_20260403_URL, ZOOM_SEMIFINALS_20260403_MEETING_ID, ZOOM_SEMIFINALS_20260403_PASSCODE
//
// When a date's URL is unset, getZoomMeeting returns null and callers fall back
// to "details will be emailed separately" instead of rendering a link.

export interface ZoomMeeting {
  url: string
  meetingId: string
  passcode: string
}

export const SEMIFINAL_DATES = ["2026-04-02", "2026-04-03"] as const

export const ZOOM_DETAILS_FALLBACK = "Zoom details will be emailed to you separately."

function envKey(date: string): string {
  return `ZOOM_SEMIFINALS_${date.replace(/-/g, "")}`
}

export function getZoomMeeting(date: string): ZoomMeeting | null {
  if (!(SEMIFINAL_DATES as readonly string[]).includes(date)) return null
  const prefix = envKey(date)
  const url = process.env[`${prefix}_URL`]?.trim()
  if (!url || !/^https:\/\//i.test(url)) return null
  return {
    url,
    meetingId: process.env[`${prefix}_MEETING_ID`]?.trim() || "",
    passcode: process.env[`${prefix}_PASSCODE`]?.trim() || "",
  }
}

export function getAllZoomMeetings(): Record<string, ZoomMeeting> {
  const out: Record<string, ZoomMeeting> = {}
  for (const date of SEMIFINAL_DATES) {
    const meeting = getZoomMeeting(date)
    if (meeting) out[date] = meeting
  }
  return out
}
