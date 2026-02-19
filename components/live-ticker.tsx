"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Zap } from "lucide-react"

const defaultItems = [
  "New contractor joined from Hyderabad",
  "3-bedroom villa design finalized in Pune",
  "Structural plan approved in Chennai",
  "Electrical layout revision completed in Delhi",
  "Client budget approved for Bangalore project",
]

export default function LiveTicker({ items = defaultItems, speedMs = 3500 }: { items?: string[]; speedMs?: number }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), speedMs)
    return () => clearInterval(t)
  }, [items.length, speedMs])

  return (
    <Card className="p-4 bg-background flex items-center gap-3 overflow-hidden">
      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
        <Zap className="w-4 h-4 text-primary" />
      </div>
      <div className="relative h-6 overflow-hidden flex-1">
        <div className="absolute inset-0 animate-slide-up" key={i} style={{ animationDuration: "350ms" }}>
          <div className="text-sm">{items[i]}</div>
        </div>
      </div>
    </Card>
  )
}
