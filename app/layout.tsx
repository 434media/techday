import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://sanantoniotechday.com"),
  title: {
    default: "San Antonio Tech Day 2025 | November 14th Tech Conference",
    template: "%s | San Antonio Tech Day 2025",
  },
  description:
    "Join San Antonio's premier technology conference on Friday, November 14th, 2025 at Boeing Center at Tech Port. Connect with tech leaders, attend workshops, and network with the local tech community.",
  keywords: [
    "San Antonio tech conference",
    "Tech Day 2025",
    "San Antonio technology event",
    "tech networking San Antonio",
    "Boeing Center Tech Port",
    "Texas tech conference",
    "software development conference",
    "tech community San Antonio",
    "November tech event",
    "SA tech meetup",
  ],
  authors: [{ name: "San Antonio Tech Bloc" }],
  creator: "San Antonio Tech Bloc",
  publisher: "San Antonio Tech Bloc",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sanantoniotechday.com",
    siteName: "San Antonio Tech Day",
    title: "San Antonio Tech Day 2025 | November 14th Tech Conference",
    description:
      "Join San Antonio's premier technology conference on Friday, November 14th, 2025 at Boeing Center at Tech Port. Connect with tech leaders, attend workshops, and network with the local tech community.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@SATechBloc",
    creator: "@SATechBloc",
    title: "San Antonio Tech Day 2025 | November 14th Tech Conference",
    description:
      "Join San Antonio's premier technology conference on Friday, November 14th, 2025 at Boeing Center at Tech Port.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://sanantoniotechday.com",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "San Antonio Tech Day 2025",
              description:
                "Join Tech Bloc at San Antonio Tech Day to define the next era of local innovation. This conference connects the city’s top talent, founders, and investors through focused panels and talks in three high-impact tracks: Emerging Industries, Founders & Investors, and the transformative power of AI",
              startDate: "2025-11-14T09:00:00-06:00",
              endDate: "2025-11-14T18:00:00-06:00",
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              location: {
                "@type": "Place",
                name: "Boeing Center at Tech Port",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "3331 General Hudnell Dr",
                  addressLocality: "San Antonio",
                  addressRegion: "TX",
                  postalCode: "78226",
                  addressCountry: "US",
                },
              },
              image: ["https://sanantoniotechday.com/opengraph-image.png"],
              organizer: {
                "@type": "Organization",
                name: "San Antonio Tech Bloc",
                url: "https://satechbloc.com",
              },
              offers: {
                "@type": "Offer",
                url: "https://sanantoniotechday.com",
                availability: "https://schema.org/InStock",
                validFrom: "2025-01-01T00:00:00-06:00",
              },
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Footer />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
