import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tech Day 2026 — Conference",
  description:
    "Tech Day 2026 at Boeing Center at Tech Port — April 21, 2026. Three tracks: Emerging Industries, Founders & Investors, and AI. Speakers, schedule, and sponsors.",
  openGraph: {
    title: "Tech Day 2026 — Conference",
    description:
      "April 21, 2026 at Boeing Center at Tech Port. Three tracks powering San Antonio's future: Emerging Industries, Founders & Investors, and AI.",
    url: "https://sanantoniotechday.com/techday",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Day 2026 — Conference",
    description:
      "April 21, 2026 at Boeing Center at Tech Port. Emerging Industries, Founders & Investors, and AI.",
  },
  alternates: {
    canonical: "https://sanantoniotechday.com/techday",
  },
}

export default function TechDayLayout({ children }: { children: React.ReactNode }) {
  return children
}
