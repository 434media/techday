"use client"

import { RegistrationForm } from "@/components/forms/registration-form"
import { EasterEggArrow } from "@/components/easter-eggs"
import { EventTicket, TicketBadge } from "@/components/ticket-badge"
import { motion } from "motion/react"

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Network with 500+ Attendees",
    description: "Connect with founders, investors, and tech professionals from across San Antonio.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    title: "Learn from Industry Leaders",
    description: "30+ speakers sharing insights on AI, cybersecurity, startups, and more.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Watch Tech Fuel Live",
    description: "Experience the finals of SA's premier startup pitch competition.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
        />
      </svg>
    ),
    title: "Food & Refreshments",
    description: "Complimentary lunch, coffee, and networking reception included.",
  },
]

export default function RegisterPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-12 px-4 bg-white diagonal-stripe overflow-hidden">
        {/* Easter Egg Arrow - Top Right */}
        <EasterEggArrow type="video" position="top-6 right-4 md:right-8 lg:right-12 z-20" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <p className="font-mono text-sm text-primary mb-4 tracking-wider font-semibold">FREE REGISTRATION</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Secure Your <span className="text-primary">Spot</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Join San Antonio&apos;s biggest tech event of the year. Limited capacity—register now to guarantee your
                entry.
              </p>
            </motion.div>
            
            {/* Right - Ticket Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <EventTicket variant="vertical" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="flex items-start gap-4 p-4"
              >
                <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-muted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 sm:p-10 rounded-lg border border-border shadow-sm"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Registration Form</h2>
              <p className="text-muted-foreground">November 14, 2026 • San Antonio, TX</p>
            </div>
            <RegistrationForm />
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 bg-white">
        {/* Easter Egg Arrow - Top Right */}
        <EasterEggArrow type="anniversary" position="top-6 right-4 md:right-8 lg:right-12 z-20" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "Is Tech Day really free?",
                a: "Yes! Thanks to our generous sponsors, Tech Day 2026 is completely free to attend. Registration is required to manage capacity.",
              },
              {
                q: "Where is the event located?",
                a: "Tech Day will be held at the Henry B. González Convention Center in downtown San Antonio. Full address and parking details will be sent in your confirmation email.",
              },
              {
                q: "Can I attend both tracks?",
                a: "Absolutely. The Emerging Industries and Founders & Investors tracks run in parallel, and you're free to move between sessions. The schedule is designed to minimize conflicts for popular sessions.",
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
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-muted border border-border rounded-lg"
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
