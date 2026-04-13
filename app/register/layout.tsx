import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register for Tech Day & Tech Fuel 2026",
  description:
    "Secure your spot at Tech Day & Tech Fuel 2026 — April 20–21 in San Antonio. Two days of innovation, networking, startup pitch finals, and ecosystem tours.",
  openGraph: {
    title: "Register for Tech Day & Tech Fuel 2026",
    description:
      "Secure your spot — April 20–21 in San Antonio. Two days of innovation, networking, and startup pitch finals.",
    url: "https://sanantoniotechday.com/register",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register for Tech Day & Tech Fuel 2026",
    description:
      "Secure your spot — April 20–21 in San Antonio. Two days of innovation, networking, and startup pitch finals.",
  },
  alternates: {
    canonical: "https://sanantoniotechday.com/register",
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
