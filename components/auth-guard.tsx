"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { apiGet } from "@/lib/backend"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // First check local user & token presence
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }

    // Verify token with backend to catch server-side expiry/invalid tokens
    (async () => {
      try {
        await apiGet("/auth/me")
        setIsLoading(false)
      } catch (err: any) {
        // If verification fails (401 etc), clear session and redirect to login
        logout()
        router.push("/login")
      }
    })()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
