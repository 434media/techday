// Small allowlist HTML sanitizer for CMS rich text. Runs without a DOM, so the
// same function is used on the server (before a text block is stored) and in
// the browser (before it is rendered with dangerouslySetInnerHTML).
//
// Allowed: p, br, strong, b, em, i, u, a, ul, ol, li, span, h1-h4.
// Allowed attributes: class on any of them; href (https:, mailto: or a
// same-site path), target and rel on <a>. Everything else is dropped; the text
// inside a dropped tag is kept, except for script-like elements, whose content
// is removed entirely.

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "span",
  "h1", "h2", "h3", "h4",
])

const VOID_TAGS = new Set(["br"])

// Elements whose contents are never shown as text.
const DROP_WITH_CONTENT =
  /<(script|style|iframe|object|embed|template|noscript|textarea|title|svg|math|xmp|noembed|noframes|plaintext|select|option)\b[\s\S]*?(?:<\/\1\s*>|$)/gi

// A complete tag, honouring quoted attribute values that may contain ">".
const TAG =
  /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/g

const ATTR = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

function escapeText(text: string): string {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function isSafeHref(href: string): boolean {
  const value = href.trim()
  if (/^https:\/\//i.test(value) || /^mailto:/i.test(value)) return true
  // Same-site path, but not a protocol-relative "//host" URL.
  return value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")
}

function sanitizeAttributes(tag: string, raw: string): string {
  const out: string[] = []
  let hasBlankTarget = false
  let match: RegExpExecArray | null
  ATTR.lastIndex = 0
  while ((match = ATTR.exec(raw)) !== null) {
    const name = match[1].toLowerCase()
    const value = match[2] ?? match[3] ?? match[4] ?? ""
    if (name === "class") {
      out.push(`class="${escapeAttr(value)}"`)
    } else if (tag === "a" && name === "href" && isSafeHref(value)) {
      out.push(`href="${escapeAttr(value.trim())}"`)
    } else if (tag === "a" && name === "target" && (value === "_blank" || value === "_self")) {
      out.push(`target="${value}"`)
      if (value === "_blank") hasBlankTarget = true
    }
  }
  // rel is always set by us rather than copied from input.
  if (hasBlankTarget) out.push(`rel="noopener noreferrer"`)
  return out.length ? " " + out.join(" ") : ""
}

export function sanitizeHtml(input: string): string {
  if (typeof input !== "string" || !input) return ""

  const html = input
    .replace(/<!--[\s\S]*?(?:-->|$)/g, "")
    .replace(/<!\[CDATA\[[\s\S]*?(?:\]\]>|$)/g, "")
    .replace(/<[!?][^>]*>?/g, "")
    .replace(DROP_WITH_CONTENT, "")

  let result = ""
  let lastIndex = 0
  let match: RegExpExecArray | null
  TAG.lastIndex = 0
  while ((match = TAG.exec(html)) !== null) {
    result += escapeText(html.slice(lastIndex, match.index))
    lastIndex = TAG.lastIndex

    const isClosing = match[1] === "/"
    const tag = match[2].toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) continue

    if (isClosing) {
      if (!VOID_TAGS.has(tag)) result += `</${tag}>`
    } else {
      result += `<${tag}${sanitizeAttributes(tag, match[3] || "")}>`
    }
  }
  result += escapeText(html.slice(lastIndex))
  return result
}
