"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) {
    let message = "Unknown error"
    try {
      const data = await res.json()
      message = data?.error || JSON.stringify(data)
    } catch {
      message = `${res.status} ${res.statusText}`
    }
    throw new Error(message)
  }
  return res.json()
}

export function BackendStatus() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const mutate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetcher("/api/backend-proxy/healthz")
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    mutate()
    const interval = setInterval(mutate, 15000)
    return () => clearInterval(interval)
  }, [])

  const online = data?.ok === true && !error

  return (
    <div className="flex items-center gap-2">
      {online ? (
        <Badge variant="default" className="rounded-full">
          Backend: Online
        </Badge>
      ) : isLoading ? (
        <Badge variant="secondary" className="rounded-full">
          Checking backend…
        </Badge>
      ) : (
        <Badge variant="destructive" className="rounded-full">
          Backend: Offline
        </Badge>
      )}

      <Button size="sm" variant="outline" onClick={() => mutate()}>
        Check now
      </Button>

      {!online && error ? <span className="text-xs opacity-70">{error.message?.slice(0, 120)}</span> : null}
    </div>
  )
}
