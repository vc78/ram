"use client"

import { useEffect, useRef } from "react"

type VantaKind = "waves" | "fog" | "net"

export default function VantaBackground({
  effect = "waves",
  color = 0x1e3a8a, // deep blue (matches brand primary)
  backgroundAlpha = 0.0,
  minHeight = 360,
  className = "",
}: {
  effect?: VantaKind
  color?: number
  backgroundAlpha?: number
  minHeight?: number
  className?: string
}) {
  const elRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<any>(null)

  useEffect(() => {
    let disposed = false

    async function mount() {
      if (!elRef.current) return
      try {
        const THREE = await import("three")

        let VANTA: any
        if (effect === "fog") {
          VANTA = (await import("vanta/dist/vanta.fog.min.js")).default
        } else if (effect === "net") {
          VANTA = (await import("vanta/dist/vanta.net.min.js")).default
        } else {
          VANTA = (await import("vanta/dist/vanta.waves.min.js")).default
        }

        if (!disposed) {
          instanceRef.current = VANTA({
            el: elRef.current,
            THREE: THREE,
            color,
            backgroundAlpha,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight,
          })
        }
      } catch (e) {
        // Silently fail and use CSS gradient fallback
        console.log("[v0] Vanta failed to initialize:", e)
      }
    }

    mount()
    return () => {
      disposed = true
      try {
        instanceRef.current?.destroy?.()
        instanceRef.current = null
      } catch {}
    }
  }, [effect, color, backgroundAlpha, minHeight])

  return (
    <div
      ref={elRef}
      className={["pointer-events-none", className].join(" ")}
      aria-hidden="true"
      style={{
        background: "linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--accent) / 0.05) 100%)",
      }}
    />
  )
}
