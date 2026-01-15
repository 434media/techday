import { AnniversaryCarousel } from "@/components/anniversary-carousel"
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
    <main className="relative bg-white" role="main" aria-label="Tech Bloc 10 Year Anniversary">
      <AnniversaryCarousel />
    </main>
  )
}
