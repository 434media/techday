import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Tech Fuel 2026 — $100K Startup Pitch Competition",
  description:
    "Tech Fuel is San Antonio's flagship $100K startup pitch competition. 8 years, $700K+ invested, 349+ applicants. Meet the 2026 finalists and vote for the People's Choice Award.",
  openGraph: {
    title: "Tech Fuel 2026 — $100K Startup Pitch Competition",
    description:
      "San Antonio's flagship $100K startup pitch competition. 8 years, $700K+ invested, 349+ applicants. Meet the 2026 finalists.",
    url: `${SITE_URL}/techfuel`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Fuel 2026 — $100K Startup Pitch Competition",
    description:
      "San Antonio's flagship $100K startup pitch competition. Meet the 2026 finalists.",
  },
  alternates: {
    canonical: `${SITE_URL}/techfuel`,
  },
}

export default function TechFuelLayout({ children }: { children: React.ReactNode }) {
  return children
}
