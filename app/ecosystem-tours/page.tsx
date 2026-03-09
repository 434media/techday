import type { Metadata } from "next"
import { EcosystemToursForm } from "@/components/forms/ecosystem-tours-form"

export const metadata: Metadata = {
  title: "Ecosystem Tours | Tech Fuel 2026",
  description:
    "Sign up for ecosystem tours during Tech Fuel 2026. Visit Port San Antonio and VelocityTX — two of San Antonio's most important innovation hubs.",
}

export default function EcosystemToursPage() {
  return (
    <main className="relative bg-black min-h-screen">
      <section className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left — Text Content */}
            <div className="pt-4">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-red-500 mb-4">
                Tech Fuel 2026 • April 20
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1] uppercase">
                Ecosystem <span className="text-red-500">Tours</span>
              </h1>
              <p className="text-white/50 text-sm font-medium mb-6 leading-relaxed tracking-wide">
                Included with your Tech Fuel registration &bull; Running throughout the day
              </p>

              <div className="space-y-6 text-base leading-[1.9] text-white/70 font-[350]">
                <p>
                  This year, we&apos;re taking you behind the scenes. Our ecosystem tours place attendees
                  directly inside the facilities shaping San Antonio and South Texas&apos; most strategic
                  industry clusters.
                </p>
                <p>
                  We&apos;ll start at{" "}
                  <strong className="text-white font-semibold">Port San Antonio</strong>—a 1,900-acre
                  industrial campus and one of the nation&apos;s leading hubs for cyber, aerospace, and
                  advanced manufacturing—then head to{" "}
                  <strong className="text-white font-semibold">VelocityTX</strong>, an internationally
                  recognized bioscience innovation campus built to accelerate translational research
                  and commercialization.
                </p>
                <p>
                  Together, these sites reflect a coordinated regional strategy spanning cyber, aerospace,
                  advanced manufacturing, and bioscience—positioning San Antonio as one of the few U.S.
                  markets capable of supporting dual-use technology development across both defense and
                  civilian applications.
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:sticky lg:top-32">
              <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
                <h3 className="text-lg font-bold text-foreground mb-1 tracking-tight">
                  Add Ecosystem Tours
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  For existing Tech Fuel registrants
                </p>
                <EcosystemToursForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
