"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import OptimizedImage from "./optimized-image"
import VideoPlayer from "./video-player"

interface MediaItem {
  type: "image" | "video"
  src: string
  poster?: string
  alt: string
  title?: string
}

interface MediaCarouselProps {
  items: MediaItem[]
  className?: string
}

export default function MediaCarousel({ items, className = "" }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  if (items.length === 0) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">No media available</p>
      </div>
    )
  }

  const currentItem = items[currentIndex]

  return (
    <div className={`relative group ${className}`}>
      {/* Media Content */}
      <div className="w-full h-full rounded-lg overflow-hidden">
        {currentItem.type === "image" ? (
          <OptimizedImage src={currentItem.src} alt={currentItem.alt} className="w-full h-full" />
        ) : (
          <VideoPlayer
            src={currentItem.src}
            poster={currentItem.poster || "/images/modern-minimalist-design.jpg"}
            title={currentItem.title || currentItem.alt}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <Button
            size="icon"
            variant="secondary"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white/90 hover:bg-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white/90 hover:bg-white"
            onClick={goToNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
