import type { Metadata } from "next"
import Image from "next/image"
import { Editable } from "@/components/editable"
import { SponsorContactForm } from "@/components/forms/sponsor-contact-form"

export const metadata: Metadata = {
  title: "Become a Sponsor | Tech Bloc",
  description:
    "Partner with Tech Bloc to support San Antonio's tech community. Sponsorship opportunities for Tech Day and Tech Fuel 2026.",
  openGraph: {
    title: "Become a Sponsor | Tech Bloc",
    description:
      "Partner with Tech Bloc to support San Antonio's tech community. Sponsorship opportunities for Tech Day and Tech Fuel 2026.",
  },
}

export default function SponsorPage() {
  return (
    <main className="relative bg-white min-h-screen" role="main" aria-label="Become a Sponsor">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://storage.googleapis.com/groovy-ego-462522-v2.firebasestorage.app/techday/sponsor3.jpg"
            alt="Tech Bloc community event — kids in line receiving backpacks and computers"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 font-mono leading-tight tracking-tight">
              Become a <span className="text-red-500">Sponsor</span>
            </h1>
            <Editable
              id="sponsor.hero.description"
              as="p"
              className="text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed font-light mb-10 max-w-xl"
              page="sponsor"
              section="hero"
            >
              Partner with Tech Bloc to support San Antonio&apos;s thriving tech community and gain visibility among hundreds of local technologists.
            </Editable>

            <Editable
              id="sponsor.cta.text"
              as="p"
              className="text-white/60 text-lg font-medium mb-6 tracking-wide"
              page="sponsor"
              section="cta"
            >
              Interested in sponsoring?
            </Editable>

            <SponsorContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
