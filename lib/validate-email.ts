// One email check for every form route.
//
// The previous per-route pattern /^[^\s@]+@[^\s@]+\.[^\s@]+$/ backtracks
// polynomially on long inputs (CodeQL js/polynomial-redos): `[^\s@]+` and the
// following `\.` both match a dot, so a long run of dots is tried many ways
// before failing. Here the domain labels exclude the dot, so a dot is matched
// only by the literal, and the 254-character cap bounds the work regardless.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && EMAIL_PATTERN.test(value)
}
