"use client"

import type React from "react"
import VantaBackground from "@/components/vanta-background"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { apiPost } from "@/lib/backend"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRemember(true)
    }
  }, [])

  const [canAttempt, setCanAttempt] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("loginAttempts")
      if (!raw) {
        setCanAttempt(true)
        return
      }
      const data = JSON.parse(raw) as { count: number; firstAt: number }
      const windowMs = 10 * 60 * 1000
      if (Date.now() - data.firstAt > windowMs) {
        localStorage.removeItem("loginAttempts")
        setCanAttempt(true)
        return
      }
      setCanAttempt(data.count < 5)
    } catch {
      localStorage.removeItem("loginAttempts")
      setCanAttempt(true)
    }
  }, [])

  function recordAttempt(success: boolean) {
    if (success) {
      localStorage.removeItem("loginAttempts")
      return
    }
    const raw = localStorage.getItem("loginAttempts")
    if (!raw) {
      localStorage.setItem("loginAttempts", JSON.stringify({ count: 1, firstAt: Date.now() }))
    } else {
      try {
        const data = JSON.parse(raw) as { count: number; firstAt: number }
        localStorage.setItem("loginAttempts", JSON.stringify({ count: data.count + 1, firstAt: data.firstAt }))
      } catch {
        localStorage.setItem("loginAttempts", JSON.stringify({ count: 1, firstAt: Date.now() }))
      }
    }
  }

  function validate() {
    const fe: { email?: string; password?: string } = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) fe.email = "Invalid email address"
    if (password.length < 1) {
      fe.password = "Password is required"
    }
    setFieldErrors(fe)
    return Object.keys(fe).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFieldErrors({})

    if (!canAttempt) {
      setError("Too many attempts. Please wait a few minutes and try again.")
      setLoading(false)
      return
    }

    if (!validate()) {
      recordAttempt(false)
      setLoading(false)
      return
    }

    try {
      const res = await apiPost<{ access_token: string; token_type: string; user: any }>("/auth/login", {
        email,
        password,
      })

      // Store authenticated session
      localStorage.setItem("user", JSON.stringify(res.user))
      localStorage.setItem("token", res.access_token)

      if (remember) localStorage.setItem("rememberedEmail", email)
      else localStorage.removeItem("rememberedEmail")

      recordAttempt(true)
      router.push("/dashboard")
    } catch (err: any) {
      recordAttempt(false)
      setError(err?.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.12),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.12),transparent_60%)]" />
      </div>
      <VantaBackground
        effect="waves"
        className="absolute inset-0 -z-20 opacity-60"
        color={0x22c55e}
        backgroundColor={0x0b1220}
        highlightColor={0x38bdf8}
        intensity={0.9}
      />

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <Card className="p-8 border-border/40 bg-background/70 backdrop-blur-md shadow-xl ring-1 ring-white/5">
            <div className="flex items-center justify-center mb-8">
              <img
                src="/images/siid-flash-logo.png"
                alt="SIID FLASH Logo"
                className="h-16 w-auto object-contain"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  if (!img.dataset.fallbackShown) {
                    img.dataset.fallbackShown = "true"
                    img.style.display = "none"
                    const fallback = document.createElement("div")
                    fallback.className = "flex flex-col items-center gap-2"
                    fallback.innerHTML = `
                      <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                          <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
                        </svg>
                      </div>
                      <h2 class="text-2xl font-bold">SIID FLASH</h2>
                    `
                    img.parentElement?.appendChild(fallback)
                  }
                }}
              />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to continue building your dreams</p>
            </div>

            {error && <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-6 text-sm">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  required
                />
                {fieldErrors.email && (
                  <p id="email-error" className="text-xs text-destructive">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" className="text-xs text-destructive">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                  Remember my email
                </label>
                {!canAttempt && <span className="text-xs text-destructive">Temporarily locked</span>}
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent-dark text-white transition-all duration-300 shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_10px_40px_rgba(56,189,248,0.35)]"
                disabled={loading || !canAttempt}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
