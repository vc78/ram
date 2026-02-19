"use client"

import * as React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"

const videos = [
  {
    src: "https://cdn.pixabay.com/video/2023/05/02/160690-822906092_large.mp4",
    title: "AI-Driven Floor Plans",
    poster: "/images/ai-floor-plan-generation-architectural.jpg",
  },
  {
    src: "https://cdn.pixabay.com/video/2022/11/07/138448-768947568_large.mp4",
    title: "Structural Simulation",
    poster: "/images/structural-engineering-simulation-3d.jpg",
  },
  {
    src: "https://cdn.pixabay.com/video/2022/08/01/126095-735766893_large.mp4",
    title: "Interior Walkthrough",
    poster: "/images/interior-design-3d-walkthrough.jpg",
  },
]

export default function VideoCarousel() {
  const [active, setActive] = React.useState(0)
  const autoRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    autoRef.current = window.setInterval(() => {
      setActive((prev) => (prev + 1) % videos.length)
    }, 6000)
    return () => {
      if (autoRef.current) window.clearInterval(autoRef.current)
    }
  }, [])

  const videoRefs = React.useRef<Array<HTMLVideoElement | null>>([])
  const [playing, setPlaying] = React.useState<number | null>(null)

  const handlePlay = (idx: number) => {
    setPlaying(idx)
    // Attempt to play the video once it's rendered and attached to the ref
    requestAnimationFrame(() => {
      const vid = videoRefs.current[idx]
      if (!vid) return
      vid.play().catch((err) => {
        console.warn("Video play failed", err)
        setPlaying(null)
      })
    })
  }

  // If the carousel changes slides automatically, stop any playing video that's not on the active slide
  React.useEffect(() => {
    if (playing !== null && playing !== active) {
      const vid = videoRefs.current[playing]
      try {
        vid?.pause()
      } catch {
        /* ignore */
      }
      setPlaying(null)
    }
  }, [active, playing])

  return (
    <section className="w-full py-10 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-pretty">Project Video Highlights</h2>
        <Carousel className="w-full">
          <CarouselContent className="items-stretch">
            {videos.map((v, i) => (
              <CarouselItem key={v.src} className="md:basis-1/2 lg:basis-1/3">
                <Card className={`p-2 h-full border-border/50 ${i === active ? "ring-2 ring-primary" : ""}`}>
                  <div className="relative w-full overflow-hidden rounded-lg bg-muted aspect-video">
                    <img src={v.poster || "/placeholder.svg"} alt={v.title} className="w-full h-full object-cover" />

                    {/* Lazy-load the video only when the user clicks Play to avoid automatic 404 requests */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {playing === i ? (
                        <video
                          ref={(el) => (videoRefs.current[i] = el)}
                          src={v.src}
                          className="w-full h-full object-cover absolute inset-0"
                          controls
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          poster={v.poster}
                        />
                      ) : (
                        <button
                          onClick={() => handlePlay(i)}
                          className="inline-flex items-center justify-center bg-black/40 hover:bg-black/50 text-white rounded-full w-16 h-16"
                          aria-label={`Play ${v.title}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="px-2 py-3">
                    <p className="text-sm text-muted-foreground">{v.title}</p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious aria-label="Previous video" />
          <CarouselNext aria-label="Next video" />
        </Carousel>
      </div>
    </section>
  )
}
