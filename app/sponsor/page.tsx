import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Become a Sponsor | Tech Bloc",
  description:
    "Partner with Tech Bloc to support San Antonio's tech community. Sponsorship opportunities for Tech Day and Tech Fuel 2025.",
  openGraph: {
    title: "Become a Sponsor | Tech Bloc",
    description:
      "Partner with Tech Bloc to support San Antonio's tech community. Sponsorship opportunities for Tech Day and Tech Fuel 2025.",
  },
}

export default function SponsorPage() {
  return (
    <main className="relative bg-white min-h-screen" role="main" aria-label="Become a Sponsor">
      <div className="pt-24 md:pt-32 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 font-mono">
              Become a <span className="text-red-600">Sponsor</span>
            </h1>
            <p className="text-lg md:text-xl text-black/60 max-w-3xl mx-auto">
              Partner with Tech Bloc to support San Antonio&apos;s thriving tech community and gain visibility among hundreds of local technologists.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-black text-white rounded-2xl">
              <h3 className="text-2xl font-bold mb-2">Gold</h3>
              <p className="text-white/70 mb-4">Premium visibility and engagement</p>
              <ul className="space-y-2 text-white/80">
                <li>• Logo on all materials</li>
                <li>• Speaking opportunity</li>
                <li>• VIP booth location</li>
                <li>• Social media features</li>
              </ul>
            </div>
            <div className="p-8 border-2 border-black rounded-2xl">
              <h3 className="text-2xl font-bold text-black mb-2">Silver</h3>
              <p className="text-black/60 mb-4">Great exposure for your brand</p>
              <ul className="space-y-2 text-black/70">
                <li>• Logo on event materials</li>
                <li>• Booth at event</li>
                <li>• Social media mention</li>
              </ul>
            </div>
            <div className="p-8 bg-black/5 rounded-2xl">
              <h3 className="text-2xl font-bold text-black mb-2">Bronze</h3>
              <p className="text-black/60 mb-4">Support the community</p>
              <ul className="space-y-2 text-black/70">
                <li>• Logo on website</li>
                <li>• Event tickets</li>
                <li>• Thank you mention</li>
              </ul>
            </div>
          </div>

          <div className="text-center py-16 border-t border-black/10">
            <p className="text-black/60 text-lg mb-6">Interested in sponsoring?</p>
            <a
              href="mailto:sponsors@techbloc.org"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Contact Us
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
