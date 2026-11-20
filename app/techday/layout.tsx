import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Tech Day 2026 — Conference",
  description:
    "Tech Day 2026 at Boeing Center at Tech Port — April 21, 2026. Three tracks: Emerging Industries, Founders & Investors, and AI. Speakers, schedule, and sponsors.",
  openGraph: {
    title: "Tech Day 2026 — Conference",
    description:
      "April 21, 2026 at Boeing Center at Tech Port. Three tracks powering San Antonio's future: Emerging Industries, Founders & Investors, and AI.",
    url: `${SITE_URL}/techday`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Day 2026 — Conference",
    description:
      "April 21, 2026 at Boeing Center at Tech Port. Emerging Industries, Founders & Investors, and AI.",
  },
  alternates: {
    canonical: `${SITE_URL}/techday`,
  },
}

export default function TechDayLayout({ children }: { children: React.ReactNode }) {
  return children
}
