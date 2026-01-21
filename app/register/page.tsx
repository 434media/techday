"use client"

import { RegistrationForm } from "@/components/forms/registration-form"
import { InteractiveLanyard } from "@/components/interactive-lanyard"
import { motion } from "motion/react"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <main className="min-h-dvh">
      <section className="relative px-4 overflow-hidden py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Interactive Lanyard - First on mobile */}
            <div className="flex justify-center lg:justify-end pt-24 order-first lg:order-last">
              <InteractiveLanyard />
            </div>
            
            {/* Text content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left order-last lg:order-first"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-[1.1] tracking-tight">
                Secure Your <span className="text-primary">Spot</span> at Tech Day &amp; Tech Fuel
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Join us in San Antonio on April 9–10, 2026 for two days of innovation, networking, and inspiration. Register now to attend <span className="text-primary">Tech Day</span> and witness the thrilling <span className="text-primary">Tech Fuel</span> startup pitch competition finals.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start text-sm">
                <div className="inline-flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                  <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Stable Hall &amp; Tech Port</span>
                </div>
                <div className="inline-flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                  <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">April 9–10, 2026</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="form" className="bg-foreground relative overflow-hidden">
        {/* Pixel Arrow Background - matching hero style */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.05]"
          style={{
            backgroundImage: "url('https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg')",
          }}
        />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-white/20 shadow-2xl"
          >
            {/* Form Header with Logo */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-border">
              <div>
                <p className="font-mono text-xs text-primary tracking-widest font-semibold uppercase mb-1">Free Event</p>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Registration Form</h2>
                <p className="text-sm text-muted-foreground mt-1 font-medium">April 9–10, 2026 • San Antonio, TX</p>
              </div>
              <Image
                src="https://ampd-asset.s3.us-east-2.amazonaws.com/techday/10Years_Red.svg"
                alt="Tech Day 10 Years"
                width={56}
                height={56}
                className="shrink-0"
              />
            </div>
            <RegistrationForm />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 lg:py-24 bg-white">
        {/* Pixel Arrow Background - matching hero style */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03]"
          style={{
            backgroundImage: "url('https://ampd-asset.s3.us-east-2.amazonaws.com/techday/arrowdown.svg')",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="font-mono text-xs text-primary tracking-widest font-semibold uppercase mb-2">Got Questions?</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Is Tech Day really free?",
                a: "Yes! Thanks to our generous sponsors, Tech Day 2026 is completely free to attend. Registration is required to manage capacity.",
              },
              {
                q: "When and where are the events?",
                a: "Tech Day is on April 9, 2026 at Tech Port in San Antonio. Tech Fuel, our startup pitch competition finals, is on April 10, 2026 at Stable Hall. Full address and parking details will be sent in your confirmation email.",
              },
              {
                q: "Can I attend both Tech Day and Tech Fuel?",
                a: "Absolutely! Your registration covers both days. Tech Day features our conference tracks on April 9th, and Tech Fuel showcases the startup pitch competition finals on April 10th.",
              },
              {
                q: "Can I attend both tracks at Tech Day?",
                a: "Yes! The Emerging Industries and Founders & Investors tracks run in parallel, and you're free to move between sessions. The schedule is designed to minimize conflicts for popular sessions.",
              },
              {
                q: "What should I bring?",
                a: "Just bring yourself and your business cards! Your digital e-ticket will be sent to your email—you can show it on your phone at check-in.",
              },
              {
                q: "How can my company sponsor Tech Day?",
                a: "We have sponsorship packages available at multiple levels. Contact sponsors@techday.sa or visit our sponsorship page for more information.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-5 bg-muted/50 border border-border rounded-xl hover:border-primary/30 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2 text-base">{faq.q}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
