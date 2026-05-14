"use client"

import type React from "react"
import { useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus, ShieldCheck } from "lucide-react"
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-12 md:py-20">
      {/* Premium Background (Synced with Login) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='currentColor'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E")` 
        }} 
      />

      <div className="w-full max-w-lg px-4 z-10">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="backdrop-blur-xl bg-background/60 border border-border/50 shadow-2xl rounded-3xl p-6 md:p-10 ring-1 ring-white/10 dark:ring-white/5 relative overflow-hidden">
            {/* Glossy overlay effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
            
            <div className="flex flex-col items-center mb-8">
              <BrandLogo className="h-16 w-auto mb-4" />
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground text-center">
                Create Your Account
              </h1>
              <p className="text-muted-foreground text-sm mt-2 text-center">
                Join the smart construction revolution with SIID
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl mb-6 text-sm flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-background/50 border-border/60 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all rounded-xl h-11"
                    aria-invalid={!!fieldErrors.name}
                    required
                  />
                  {fieldErrors.name && (
                    <p className="text-[10px] text-destructive ml-1 font-medium">{fieldErrors.name}</p>
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
                    className="bg-background/50 border-border/60 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all rounded-xl h-11"
                    aria-invalid={!!fieldErrors.email}
                    required
                  />
                  {fieldErrors.email && (
                    <p className="text-[10px] text-destructive ml-1 font-medium">{fieldErrors.email}</p>
                  )}
                </div>
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
                  className="bg-background/50 border-border/60 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all rounded-xl h-11"
                  aria-invalid={!!fieldErrors.password}
                  required
                />
                {!fieldErrors.password ? (
                  <p className="text-[10px] text-muted-foreground ml-1">
                    At least 8 chars with letters & numbers
                  </p>
                ) : (
                  <p className="text-[10px] text-destructive ml-1 font-medium">{fieldErrors.password}</p>
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
                  className="bg-background/50 border-border/60 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all rounded-xl h-11"
                  aria-invalid={!!fieldErrors.confirmPassword}
                  required
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-[10px] text-destructive ml-1 font-medium">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold text-base transition-all duration-300 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Create My Account
                    </div>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">Already have an account?</span>{" "}
              <Link href="/login" className="text-primary hover:underline font-bold decoration-2 underline-offset-4">
                Sign In
              </Link>
            </div>
          </Card>
        </motion.div>
        
        <p className="text-center mt-8 text-xs text-muted-foreground/50 font-medium">
          Protected by Enterprise-Grade Security • SIID Cloud
        </p>
      </div>
    </div>
  )
}
