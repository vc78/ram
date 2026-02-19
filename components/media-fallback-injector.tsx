"use client"

import { useEffect } from "react"

type MediaKind = "interior" | "exterior" | "structural" | "architectural" | "generic"

const FALLBACKS: Record<MediaKind, { img: string; videoPoster: string; video: string }> = {
  interior: {
    img: "/images/interior-design-3d-walkthrough.jpg",
    videoPoster: "/images/interior-design-3d-walkthrough.jpg",
    video: "https://cdn.pixabay.com/video/2023/05/02/160690-822906092_large.mp4",
  },
  exterior: {
    img: "/images/modern-villa-project.jpg",
    videoPoster: "/images/modern-villa-project.jpg",
    video: "https://cdn.pixabay.com/video/2022/11/07/138448-768947568_large.mp4",
  },
  structural: {
    img: "/images/structural-engineering-simulation-3d.jpg",
    videoPoster: "/images/structural-engineering-simulation-3d.jpg",
    video: "https://cdn.pixabay.com/video/2021/08/04/84353-583944595_large.mp4",
  },
  architectural: {
    img: "/images/architectural-floor-plan-blueprint.jpg",
    videoPoster: "/images/architectural-floor-plan-blueprint.jpg",
    video: "https://cdn.pixabay.com/video/2022/08/01/126095-735766893_large.mp4",
  },
  generic: {
    img: "/images/modern-minimalist-design.jpg",
    videoPoster: "/images/modern-minimalist-design.jpg",
    video: "https://cdn.pixabay.com/video/2022/11/07/138448-768947568_large.mp4",
  },
}
// </CHANGE>

function inferKindFromEl(el: HTMLImageElement | HTMLVideoElement): MediaKind {
  const cat = (el.getAttribute("data-category") || "").toLowerCase() || (el.getAttribute("alt") || "").toLowerCase()
  if (cat.includes("interior") || cat.includes("living") || cat.includes("bed") || cat.includes("kitchen"))
    return "interior"
  if (cat.includes("exterior") || cat.includes("facade") || cat.includes("façade")) return "exterior"
  if (cat.includes("structural") || cat.includes("structure") || cat.includes("rcc") || cat.includes("concrete"))
    return "structural"
  if (cat.includes("architectural") || cat.includes("plan") || cat.includes("layout")) return "architectural"
  return "generic"
}

function looksLikePlaceholder(src: string | null | undefined) {
  if (!src) return true
  const s = src.toLowerCase()
  return (
    s.includes("placeholder.svg") ||
    s.includes("/placeholder") ||
    s.includes("placeholder.") ||
    s === "#" ||
    s === "/" ||
    s.trim() === ""
  )
}

function applyImageFallback(img: HTMLImageElement) {
  if (img.dataset.fallbackApplied === "true") return
  const kind = inferKindFromEl(img)
  img.dataset.fallbackApplied = "true"

  // Set proper dimensions to maintain layout
  if (!img.style.minHeight) {
    img.style.minHeight = "200px"
  }
  if (!img.classList.contains("object-cover")) {
    img.classList.add("object-cover")
  }

  img.src = FALLBACKS[kind].img
  img.alt = img.alt || `${kind} design fallback image`
}
// </CHANGE>

function applyVideoFallback(video: HTMLVideoElement) {
  if (video.dataset.fallbackApplied === "true") return
  const kind = inferKindFromEl(video)
  video.dataset.fallbackApplied = "true"

  // Ensure video has proper dimensions
  if (!video.style.minHeight) {
    video.style.minHeight = "300px"
  }

  // Replace all <source> children to avoid stale srcset issues
  const sources = Array.from(video.querySelectorAll("source"))
  sources.forEach((s) => {
    s.src = FALLBACKS[kind].video
    s.type = "video/mp4"
  })
  if (sources.length === 0) {
    const src = document.createElement("source")
    src.src = FALLBACKS[kind].video
    src.type = "video/mp4"
    video.appendChild(src)
  }
  video.setAttribute("poster", FALLBACKS[kind].videoPoster)

  // Add proper video attributes for better UX
  video.setAttribute("preload", "metadata")
  video.setAttribute("playsinline", "true")

  try {
    video.load()
  } catch {
    // ignore
  }
}
// </CHANGE>

export default function MediaFallbackInjector() {
  useEffect(() => {
    try {
      const handleImgError = (e: Event) => {
        const target = e.target as HTMLImageElement
        // prevent loops
        target.onerror = null
        applyImageFallback(target)
      }
      const handleVideoError = (e: Event) => {
        const target = e.target as HTMLVideoElement
        target.onerror = null
        applyVideoFallback(target)
      }

      const sweep = () => {
        try {
          document.querySelectorAll("img").forEach((img) => {
            const el = img as HTMLImageElement
            if (looksLikePlaceholder(el.getAttribute("src"))) {
              applyImageFallback(el)
            } else if ((el as any).complete && el.naturalWidth === 0) {
              applyImageFallback(el)
            } else if (el.getAttribute("src")?.includes("/images/") && !el.complete) {
              // Pre-emptively handle images that might fail
              el.onerror = () => handleImgError({ target: el } as any)
            }
          })
          document.querySelectorAll("video").forEach((video) => {
            const el = video as HTMLVideoElement
            const srcAttr = el.getAttribute("src")
            const hasSource = !!srcAttr || el.querySelector("source")
            if (!hasSource || looksLikePlaceholder(srcAttr || "")) {
              applyVideoFallback(el)
            }
          })
        } catch (err) {
          console.warn("Error during media fallback sweep:", err)
        }
      }

      // Global listeners for future errors
      document.addEventListener(
        "error",
        (evt) => {
          try {
            const t = evt.target as Element
            if (t && t.tagName === "IMG") handleImgError(evt as unknown as Event)
            if (t && t.tagName === "VIDEO") handleVideoError(evt as unknown as Event)
          } catch (err) {
            console.warn("Error in media error handler:", err)
          }
        },
        true,
      )

      const mo = new MutationObserver((mutations) => {
        try {
          for (const m of mutations) {
            m.addedNodes.forEach((node) => {
              if (!(node instanceof HTMLElement)) return

              // Handle newly added images
              if (node.tagName === "IMG") {
                const img = node as HTMLImageElement
                if (looksLikePlaceholder(img.getAttribute("src"))) {
                  applyImageFallback(img)
                }
              }

              // Handle newly added videos
              if (node.tagName === "VIDEO") {
                const video = node as HTMLVideoElement
                const srcAttr = video.getAttribute("src")
                const hasSource = !!srcAttr || video.querySelector("source")
                if (!hasSource || looksLikePlaceholder(srcAttr || "")) {
                  applyVideoFallback(video)
                }
              }

              // Handle images within added nodes
              node.querySelectorAll?.("img").forEach((img) => {
                const el = img as HTMLImageElement
                if (looksLikePlaceholder(el.getAttribute("src"))) {
                  applyImageFallback(el)
                } else {
                  el.onerror = () => handleImgError({ target: el } as any)
                }
              })

              // Handle videos within added nodes
              node.querySelectorAll?.("video").forEach((video) => {
                const el = video as HTMLVideoElement
                const srcAttr = el.getAttribute("src")
                const hasSource = !!srcAttr || el.querySelector("source")
                if (!hasSource || looksLikePlaceholder(srcAttr || "")) {
                  applyVideoFallback(el)
                } else {
                  el.onerror = () => handleVideoError({ target: el } as any)
                }
              })
            })
          }
        } catch (err) {
          console.warn("Error in mutation observer:", err)
        }
      })

      mo.observe(document.documentElement, { childList: true, subtree: true })
      sweep()

      // Re-sweep after a short delay to catch lazy-loaded content
      setTimeout(sweep, 1000)
      setTimeout(sweep, 3000)

      return () => {
        mo.disconnect()
      }
    } catch (err) {
      console.warn("Error initializing media fallback injector:", err)
      return () => { } // Return empty cleanup function
    }
  }, [])

  return null
}
