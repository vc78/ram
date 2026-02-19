"use client"

import { useEffect, useRef, useState } from "react"

type Kpi = { label: string; value: number }

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, inView }
}

export default function KpiCounters({
  items = [
    { label: "Projects Completed", value: 500 },
    { label: "Happy Clients", value: 1000 },
    { label: "Verified Contractors", value: 200 },
    { label: "Satisfaction Rate (%)", value: 98 },
  ],
}: { items?: Kpi[] }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!inView) return
    const frame = 0
    const duration = 1200 // ms
    const start = performance.now()
    const tick = (t: number) => {
      const elapsed = t - start
      const pct = Math.min(1, elapsed / duration)
      setProgress(pct)
      if (pct < 1) requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
      {items.map((k, i) => {
        const current = Math.floor(k.value * progress)
        return (
          <div key={i} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2 tabular-nums">
              {current}
              {k.label.includes("%") ? "" : "+"}
            </div>
            <div className="text-sm text-muted-foreground">{k.label}</div>
          </div>
        )
      })}
    </div>
  )
}
