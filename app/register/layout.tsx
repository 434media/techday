import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Register for Tech Day & Tech Fuel 2026",
  description:
    "Secure your spot at Tech Day & Tech Fuel 2026 — April 20–21 in San Antonio. Two days of innovation, networking, startup pitch finals, and ecosystem tours.",
  openGraph: {
    title: "Register for Tech Day & Tech Fuel 2026",
    description:
      "Secure your spot — April 20–21 in San Antonio. Two days of innovation, networking, and startup pitch finals.",
    url: `${SITE_URL}/register`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Register for Tech Day & Tech Fuel 2026",
    description:
      "Secure your spot — April 20–21 in San Antonio. Two days of innovation, networking, and startup pitch finals.",
  },
  alternates: {
    canonical: `${SITE_URL}/register`,
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
