"use client"

import type React from "react"
import VantaBackground from "@/components/vanta-background"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { apiPost } from "@/lib/backend"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email address"
    }

    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    } else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      errors.password = "Password must contain letters and numbers"
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFieldErrors({})

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      // Create user on backend
      const created = await apiPost<{
        id: number
        name: string
        email: string
        role: string
        created_at: string
      }>("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      // Auto-login after signup to obtain token
      const loginRes = await apiPost<{ access_token: string; token_type: string; user: any }>("/auth/login", {
        email: formData.email,
        password: formData.password,
      })

      localStorage.setItem("user", JSON.stringify(loginRes.user))
      localStorage.setItem("token", loginRes.access_token)
      document.cookie = `userRole=${loginRes.user.role || 'user'}; path=/; max-age=86400`

      if (loginRes.user.role === 'admin') {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev }
        delete updated[e.target.name]
        return updated
      })
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
              <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
              <p className="text-muted-foreground">Start building your dreams today</p>
            </div>

            {error && <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-6 text-sm">{error}</div>}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  required
                />
                {fieldErrors.name && (
                  <p id="name-error" className="text-xs text-destructive">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  required
                />
                {fieldErrors.password ? (
                  <p id="password-error" className="text-xs text-destructive">
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with letters and numbers
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? "confirm-error" : undefined}
                  required
                />
                {fieldErrors.confirmPassword && (
                  <p id="confirm-error" className="text-xs text-destructive">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent-dark text-white transition-all duration-300 shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_10px_40px_rgba(34,197,94,0.35)]"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
