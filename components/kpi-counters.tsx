"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Kpi = { label: string; value: number; suffix?: string; prefix?: string }

// Custom hook to detect when component is visible
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
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return { ref, inView }
}

// Ease-out exponential function for professional number counting
const easeOutExpo = (t: number) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export default function KpiCounters({
  items = [
    { label: "Projects Completed", value: 500, suffix: "+" },
    { label: "Happy Clients", value: 1000, suffix: "+" },
    { label: "Verified Contractors", value: 200, suffix: "+" },
    { label: "Satisfaction Rate", value: 98, suffix: "%" },
  ],
}: { items?: Kpi[] }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const [progress, setProgress] = useState(0)

  // Number counting animation
  useEffect(() => {
    if (!inView) return

    let animationFrame: number
    const duration = 2000 // 2 seconds for a premium feel
    const startTime = performance.now()

    const animateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const timeFraction = Math.min(elapsedTime / duration, 1)
      
      // Apply easing function here
      const easedProgress = easeOutExpo(timeFraction)
      setProgress(easedProgress)

      if (timeFraction < 1) {
        animationFrame = requestAnimationFrame(animateCount)
      }
    }

    animationFrame = requestAnimationFrame(animateCount)
    return () => cancelAnimationFrame(animationFrame)
  }, [inView])

  return (
    <div className="relative py-12" ref={ref}>
      {/* Background glowing effects specifically contained to this section */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 pointer-events-none" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto relative z-10 px-4">
        {items.map((k, i) => {
          const currentVal = Math.floor(k.value * progress)
          
          return (
            <div
              key={i}
              className={cn(
                "relative group flex flex-col items-center text-center p-6 md:p-8 rounded-2xl",
                "bg-background/40 backdrop-blur-sm border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
                "transition-all duration-500 ease-out hover:-translate-y-3 hover:bg-background/80 hover:shadow-xl hover:border-primary/20",
                !inView ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Subtle hover gradient ring inside card */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400 mb-3 tabular-nums tracking-tight filter drop-shadow-sm">
                  {k.prefix}
                  {currentVal}
                  {k.suffix}
                </div>
                <div className="text-sm md:text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {k.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
