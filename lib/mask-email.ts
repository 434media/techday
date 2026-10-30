// Logs name a person without writing their full address to the server logs.
// "jane.doe@example.com" -> "j***@example.com". Pass the result as an argument
// after a fixed message ("... for %s"), never inside the message itself: Node
// reads %s, %d and %o in the first argument as format specifiers (CodeQL
// js/tainted-format-string).
export function maskEmail(email: unknown): string {
  if (typeof email !== "string") return "[unknown]"
  const at = email.lastIndexOf("@")
  if (at < 1) return "[invalid]"
  return `${email[0]}***${email.slice(at)}`
}
