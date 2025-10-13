import { Navbar } from "@/components/navbar"
import { AnniversaryHero } from "../../components/anniversary-hero"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "10th Anniversary Celebration",
  description:
    "Celebrate 10 years of San Antonio Tech Bloc - a decade of building and supporting the San Antonio technology community. Watch our anniversary video and join us for Tech Day 2025.",
  openGraph: {
    title: "San Antonio Tech Bloc 10th Anniversary",
    description:
      "Celebrate 10 years of San Antonio Tech Bloc - a decade of building and supporting the San Antonio technology community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "San Antonio Tech Bloc 10th Anniversary",
    description:
      "Celebrate 10 years of San Antonio Tech Bloc - a decade of building and supporting the San Antonio technology community.",
  },
}

export default function AnniversaryPage() {
  return (
    <>
      <Navbar />
      <main className="h-screen overflow-hidden -mt-16 md:mt-0 pt-8 pb-8 md:pt-20 md:pb-16">
        <AnniversaryHero />
      </main>
    </>
  )
}
