import type { Metadata } from "next"
import { PitchSchedulingForm } from "@/components/forms/semifinals-pitches-form"

export const metadata: Metadata = {
  title: "Pitch Scheduling | Tech Fuel Semi-Finals",
  description: "Select your preferred pitch time for the Tech Fuel 2026 semi-finals.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Pitch Scheduling | Tech Fuel Semi-Finals",
    description: "Select your preferred pitch time for the Tech Fuel 2026 semi-finals.",
  },
}

export default function PitchSchedulingPage() {
  return (
    <main className="relative bg-white min-h-screen" role="main" aria-label="Pitch Scheduling">
      {/* Hero */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-red-500 mb-4">
            Tech Fuel 2026 • Semi-Finals
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight uppercase">
            Now it&apos;s time to <span className="text-red-500">Schedule Your Pitch</span>
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed md:tracking-tighter">
            <strong className="">Congratulations!</strong> Select your pitch slot below and get ready to 
            make your case to the judges on April 2nd or 3rd. Each slot is first-come, first-served — once you select a time, it&apos;s locked in.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4 leading-tight">Choose Your Pitch Time</h2>
            <p className="text-neutral-600 leading-relaxed tracking-tight md:tracking-tighter">
              <strong>Only approved semi-finalists can select a time.</strong> Choose a date, expand a 
              block, and select your specific pitch slot. Each slot is available to one company only — once 
              selected, it&apos;s locked in. You&apos;ll receive a confirmation email with Zoom details.
            </p>
          </div>

          <PitchSchedulingForm />

          {/* Info Box */}
          <div className="mt-12 p-6 bg-neutral-50 border border-neutral-200">
            <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">What to Expect</h3>
            <ul className="space-y-3 text-sm text-neutral-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Join Early</strong> — Log into the Zoom meeting 2–3 minutes before your pitch time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Pitch (5 min)</strong> — Present your startup to the judging panel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Q&A (5 min)</strong> — Judges ask follow-up questions about your startup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>One Slot Per Company</strong> — Once you confirm your time, it cannot be changed</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
