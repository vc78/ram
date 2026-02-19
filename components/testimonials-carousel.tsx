"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

type Testimonial = { quote: string; name: string; title: string; initials: string }

export default function TestimonialsCarousel({
  items = [
    {
      quote: "SIID turned our dream home into reality with zero hassle.",
      name: "Rajesh Sharma",
      title: "Homeowner, Mumbai",
      initials: "RS",
    },
    {
      quote: "Accurate budgets and transparent execution. Loved it.",
      name: "Priya Kapoor",
      title: "Developer, Bengaluru",
      initials: "PK",
    },
    {
      quote: "Seamless coordination with verified contractors.",
      name: "Amit Mehta",
      title: "Business Owner, Delhi",
      initials: "AM",
    },
  ],
  intervalMs = 4000,
}: { items?: Testimonial[]; intervalMs?: number }) {
  const [i, setI] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), intervalMs)
    return () => clearInterval(t)
  }, [items.length, intervalMs])

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const loop = (t: number) => {
      const pct = Math.min(1, (t - start) / intervalMs)
      setProgress(pct)
      if (pct < 1) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [i, intervalMs])

  const current = useMemo(() => items[i], [i, items])

  return (
    <Card className="p-6 bg-background">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, idx) => (
          <Star key={idx} className="w-5 h-5 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-muted-foreground mb-6 leading-relaxed">{`"${current.quote}"`}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold">{current.initials}</span>
          </div>
          <div>
            <div className="font-semibold">{current.name}</div>
            <div className="text-sm text-muted-foreground">{current.title}</div>
          </div>
        </div>
        <div className="w-24 h-1 bg-muted rounded overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </Card>
  )
}
