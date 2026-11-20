import type { Metadata } from "next"
import { Hero } from "@/components/sections/hero"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  )
}
