"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AiHealthBanner({ className }: { className?: string }) {
  const [data, setData] = useState<{ realAIEnabled: boolean } | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch("/api/ai-health")
      .then((r) => r.json())
      .then(setData)
      .catch(setError)
  }, [])

  // If not loaded yet, or error, don't block UI.
  if (!data || error) return null
  if (data.realAIEnabled) return null

  return (
    <Alert className={cn("mb-4", className)}>
      <AlertTitle>Mock mode is active</AlertTitle>
      <AlertDescription>
        Real AI is disabled. Generations will use mock data and still produce 4 diversified layouts. To enable real
        providers, set ENABLE_REAL_AI to true in your project environment.
      </AlertDescription>
    </Alert>
  )
}
