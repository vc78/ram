"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSent(true)
    toast({
      title: "Reset Link Sent!",
      description: "Check your email for password reset instructions.",
    })

    setLoading(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Premium Background (Synced with Login/Signup) */}
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
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Login
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
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Forgot Password?
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                {sent ? "Check your inbox for reset instructions" : "Enter your email to receive a recovery link"}
              </p>
            </div>

            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold ml-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-background/50 border-border/60 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all rounded-xl h-12"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold text-base transition-all duration-300 rounded-xl shadow-lg"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <p className="text-sm text-muted-foreground bg-primary/5 p-4 rounded-xl border border-primary/10">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button onClick={() => setSent(false)} className="text-primary hover:underline font-bold">
                    try again
                  </button>
                </p>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-border/60 hover:bg-background/80 transition-all">
                    Return to Login
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>
        
        <p className="text-center mt-8 text-xs text-muted-foreground/50 font-medium uppercase tracking-widest">
          Secure Identity Verification • SIID Cloud
        </p>
      </div>
    </div>
  )
}
