import type { Metadata } from "next"
import { JudgeSchedulingForm } from "@/components/forms/semifinals-judges-form"

export const metadata: Metadata = {
  title: "Judge Scheduling | Tech Fuel Semi-Finals",
  description: "Select your preferred date and time for the Tech Fuel 2026 semi-finals judging session.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Judge Scheduling | Tech Fuel Semi-Finals",
    description: "Select your preferred date and time for the Tech Fuel 2026 semi-finals judging session.",
  },
}

export default function JudgeSchedulingPage() {
  return (
    <main className="relative bg-white min-h-screen" role="main" aria-label="Judge Scheduling">
      {/* Hero */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-red-500 mb-4">
            Tech Fuel 2026 • Semi-Finals
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight uppercase">
            Time to Schedule your <span className="text-red-500">Judging Session</span>
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed md:tracking-tighter">
            Select your preferred date and time to judge the Tech Fuel semi-finals. 
            Each session includes a brief prep, startup pitches, and deliberation.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-black mb-4 leading-tight">Choose Your Session</h2>
            <p className="text-neutral-600 leading-relaxed tracking-tight md:tracking-tighter">
              <strong>Each judging window has 5 spots.</strong> Select a date and time that works best for your schedule. 
              You&apos;ll receive a confirmation email with the Zoom meeting link and a calendar invite.
            </p>
          </div>

          <JudgeSchedulingForm />

          {/* Info Box */}
          <div className="mt-12 p-6 bg-neutral-50 border border-neutral-200">
            <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Session Format</h3>
            <ul className="space-y-3 text-sm text-neutral-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Judge Prep</strong> — Brief orientation and scoring criteria review (5 min)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Startup Pitches</strong> — Each startup presents for ~10 minutes with Q&A</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Deliberation</strong> — Judges discuss and submit scores (15 min)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
