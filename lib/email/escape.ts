// HTML escaping for values interpolated into email templates.
// Every user-supplied string that lands in HTML goes through escapeHtml;
// every URL that lands in an href/src goes through safeHref.

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return ""
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch])
}

// Escape a URL for an attribute, allowing only http(s). Anything else
// (javascript:, data:, relative paths, garbage) becomes "#".
export function safeHref(value: unknown): string {
  const raw = value === null || value === undefined ? "" : String(value).trim()
  try {
    const parsed = new URL(raw)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "#"
  } catch {
    return "#"
  }
  return escapeHtml(raw)
}
