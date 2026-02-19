"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const THEME_PREFIX = "theme-"

function resolveTheme(pathname: string | null) {
  if (!pathname) return "theme-default"
  if (pathname === "/" || pathname === "/home") return "theme-home"
  if (pathname.startsWith("/dashboard/projects/")) return "theme-project"
  if (pathname.startsWith("/dashboard/contractors")) return "theme-contractors"
  if (pathname.startsWith("/dashboard")) return "theme-dashboard"
  return "theme-default"
}

export default function PageTheme() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const next = resolveTheme(pathname)

    // remove prior theme-* classes, then add current
    Array.from(root.classList)
      .filter((c) => c.startsWith(THEME_PREFIX) && c !== next)
      .forEach((c) => root.classList.remove(c))
    if (!root.classList.contains(next)) root.classList.add(next)
  }, [pathname, mounted])

  return null
}
