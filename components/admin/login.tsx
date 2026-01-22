"use client"

import { useState } from "react"
import { useAdminAuth } from "./auth-provider"

export function AdminLogin() {
  const { signInWithGoogle, signInWithEmail } = useAdminAuth()
  const [authMethod, setAuthMethod] = useState<"choose" | "email">("choose")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")

    const result = await signInWithGoogle()
    
    if (!result.success) {
      setError(result.error || "Sign-in failed")
    }
    
    setIsLoading(false)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await signInWithEmail(email, password)
    
    if (!result.success) {
      setError(result.error || "Invalid credentials")
    }
    
    setIsLoading(false)
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
            Sign in to access the admin dashboard
          </p>
        </div>

        {authMethod === "choose" ? (
          <div className="space-y-4">
            {/* Google Sign-in Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white border border-neutral-200 text-black text-sm font-medium hover:bg-neutral-50 disabled:bg-neutral-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? "Signing in..." : "Sign in with 434media Google"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-neutral-400">or</span>
              </div>
            </div>

            {/* Email/Password Option */}
            <button
              onClick={() => setAuthMethod("email")}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              Sign in with Email
            </button>

            {error && (
              <p className="text-sm text-red-600 font-normal text-center mt-4">{error}</p>
            )}
          </div>
        ) : (
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

            <div>
              <label 
                htmlFor="password" 
                className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-neutral-200 text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors text-base font-normal"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-normal">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod("choose")
                setEmail("")
                setPassword("")
                setError("")
              }}
              className="w-full py-3 text-sm font-medium text-neutral-500 hover:text-black transition-colors"
            >
              Back to sign-in options
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
