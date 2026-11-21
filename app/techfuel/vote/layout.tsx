import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Vote — Tech Fuel People's Choice Award",
  description:
    "Cast your vote for the Tech Fuel 2026 People's Choice Award. Choose your favorite startup finalist from ComeBack Mobility, Freyya, Openlane, Bytewhisper Security, and RentBamboo.",
  openGraph: {
    title: "Vote — Tech Fuel People's Choice Award",
    description:
      "Cast your vote for the Tech Fuel 2026 People's Choice Award. Choose your favorite startup finalist.",
    url: `${SITE_URL}/techfuel/vote`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vote — Tech Fuel People's Choice Award",
    description:
      "Cast your vote for the Tech Fuel 2026 People's Choice Award.",
  },
  alternates: {
    canonical: `${SITE_URL}/techfuel/vote`,
  },
}

export default function VoteLayout({ children }: { children: React.ReactNode }) {
  return children
}
