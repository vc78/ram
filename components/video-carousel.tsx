"use client"

import * as React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"

const videos = [
  {
    src: "/images/stu.mp4",
    title: "AI-Driven Floor Plans",
    poster: "/images/ai-floor-plan-generation-architectural.jpg",
  },
  {
    src: "/images/iron.mp4",
    title: "Structural Simulation",
    poster: "/images/structural-engineering-simulation-3d.jpg",
  },
  {
    src: "/images/int1.mp4",
    title: "Interior Walkthrough",
    poster: "/images/interior-design-3d-walkthrough.jpg",
  },
  {
    src: "/images/ext1.mp4",
    title: "Exterior Walkthrough",
    poster: "/images/modern-villa-project.jpg",
  },
]

export default function VideoCarousel() {
  const videoRefs = React.useRef<Array<HTMLVideoElement | null>>([])
  const [playing, setPlaying] = React.useState<number | null>(null)

  const handlePlay = (idx: number) => {
    // Pause other playing videos
    if (playing !== null && playing !== idx) {
      videoRefs.current[playing]?.pause()
    }

    setPlaying(idx)
    requestAnimationFrame(() => {
      const vid = videoRefs.current[idx]
      if (!vid) return
      vid.play().catch((err) => {
        console.warn("Video play failed", err)
        setPlaying(null)
      })
    })
  }

  return (
    <section className="w-full pt-6 pb-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-3xl font-bold tracking-tight">Project Video Highlights</h2>
          <div className="hidden md:flex gap-2">
            {/* Custom nav containers if needed, but we use Carousel's own */}
          </div>
        </div>

        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-2 md:-ml-4 items-stretch">
            {videos.map((v, i) => (
              <CarouselItem key={v.src} className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                <Card className="p-0 overflow-hidden h-full border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-colors group">
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <img 
                      src={v.poster || "/placeholder.svg"} 
                      alt={v.title} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${playing === i ? 'opacity-0' : 'opacity-100'}`} 
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      {playing === i ? (
                        <video
                          ref={(el) => { videoRefs.current[i] = el }}
                          src={v.src}
                          className="w-full h-full object-cover absolute inset-0 bg-black"
                          controls
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          poster={v.poster}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <button
                            onClick={() => handlePlay(i)}
                            className="inline-flex items-center justify-center bg-primary/90 hover:bg-primary text-white rounded-full w-14 h-14 md:w-16 md:h-16 shadow-xl transform transition-all group-hover:scale-110 active:scale-95"
                            aria-label={`Play ${v.title}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4 border-t border-border/10">
                    <h4 className="font-bold text-sm md:text-base mb-1 line-clamp-1">{v.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">Experience Smart Engineering</p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Mobile-friendly navigation buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <CarouselPrevious className="static translate-y-0 h-10 w-10 border-border/50 bg-background/50 hover:bg-primary hover:text-white transition-all" />
            <div className="flex gap-1">
              {videos.map((_, idx) => (
                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
              ))}
            </div>
            <CarouselNext className="static translate-y-0 h-10 w-10 border-border/50 bg-background/50 hover:bg-primary hover:text-white transition-all" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}
