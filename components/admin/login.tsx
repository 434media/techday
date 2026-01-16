"use client"

import { useState } from "react"
import { useAdminAuth } from "./auth-provider"

export function AdminLogin() {
  const { getQuestion, verify } = useAdminAuth()
  const [email, setEmail] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [pin, setPin] = useState("")
  const [step, setStep] = useState<"email" | "verify">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await getQuestion(email)
    
    if (result.success && result.isValid && result.question) {
      setQuestion(result.question)
      setStep("verify")
    } else {
      setError("Email not found or not authorized")
    }
    
    setIsLoading(false)
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await verify(email, answer, pin)
    
    if (!result.success) {
      setError(result.error || "Invalid credentials")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-2">
            Tech Day Admin
          </h1>
          <p className="text-sm text-neutral-500 font-normal leading-relaxed">
            {step === "email" 
              ? "Enter your email to continue" 
              : "Answer your security question and enter your PIN"}
          </p>
        </div>

        {/* Form */}
        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white border border-neutral-200 text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors text-base font-normal"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-normal">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Checking..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-6">
            {/* Security Question */}
            <div>
              <label 
                className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2"
              >
                Security Question
              </label>
              <p className="text-base text-black font-medium mb-4 p-3 bg-neutral-50 border border-neutral-200">
                {question}
              </p>
              <input
                type="text"
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                autoFocus
                placeholder="Your answer"
                className="w-full px-4 py-3 bg-white border border-neutral-200 text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors text-base font-normal"
              />
            </div>

            {/* PIN */}
            <div>
              <label 
                htmlFor="pin" 
                className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2"
              >
                PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                placeholder="••••"
                maxLength={6}
                inputMode="numeric"
                className="w-full px-4 py-3 bg-white border border-neutral-200 text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors text-xl font-mono tracking-widest text-center"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-normal">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !answer || !pin}
              className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Verifying..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email")
                setQuestion("")
                setAnswer("")
                setPin("")
                setError("")
              }}
              className="w-full py-3 text-sm font-medium text-neutral-500 hover:text-black transition-colors"
            >
              Use a different email
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="mt-12 text-center text-xs text-neutral-400 leading-relaxed">
          Only approved administrators can access this area.
          <br />
          Contact your team lead for access.
        </p>
      </div>
    </div>
  )
}
