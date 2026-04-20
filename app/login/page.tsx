"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { BrandLogo } from "@/components/brand-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Construction } from "lucide-react"
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

  // Authentication Logic (Preserved)
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
      document.cookie = `userRole=${res.user.role || 'user'}; path=/; max-age=86400`

      if (remember) localStorage.setItem("rememberedEmail", email)
      else localStorage.removeItem("rememberedEmail")

      recordAttempt(true)
      if (res.user.role === 'admin') {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      recordAttempt(false)
      setError(err?.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Premium Background (Option A) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px] -z-10 animate-pulse" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='currentColor'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E")` 
        }} 
      />

      <div className="w-full max-w-md px-4 z-10">
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
                Welcome Back to SIID
              </h1>
              <p className="text-muted-foreground text-sm mt-2 text-center">
                Smart Construction Starts Here
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

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border/60 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all rounded-xl h-12"
                  aria-invalid={!!fieldErrors.email}
                  required
                />
                {fieldErrors.email && (
                  <p className="text-xs text-destructive mt-1 ml-1 font-medium">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" title="Password" className="text-sm font-semibold">Password</Label>
                  <Link href="/forgot-password" title="Forgot Password" className="text-xs text-primary hover:underline font-medium">
                    Forgot secret key?
                  </Link>
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 border-border/60 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all rounded-xl h-12 pr-12"
                    aria-invalid={!!fieldErrors.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-destructive mt-1 ml-1 font-medium">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                  <Checkbox 
                    checked={remember} 
                    onCheckedChange={(v) => setRemember(Boolean(v))} 
                    className="rounded-md border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-muted-foreground font-medium">Remember me</span>
                </label>
                {!canAttempt && (
                  <div className="flex items-center gap-1.5 text-xs text-destructive font-bold animate-pulse">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Locked
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold text-base transition-all duration-300 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading || !canAttempt}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : "Sign In to Platform"}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">New to SIID?</span>{" "}
              <Link href="/signup" className="text-primary hover:underline font-bold decoration-2 underline-offset-4">
                Create an Account
              </Link>
            </div>
          </Card>
        </motion.div>
        
        <p className="text-center mt-8 text-xs text-muted-foreground/50 font-medium">
          Secure Construction Intelligence Portal • v2.4.0
        </p>
      </div>
    </div>
  )
}
