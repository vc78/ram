"use client"

import { useState } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fallback?: string
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  height,
  fallback = "/images/modern-minimalist-design.jpg",
  onError,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback)
      setHasError(true)
      onError?.()
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"
          }`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
      {hasError && (
        <div className="absolute bottom-2 right-2 bg-destructive/10 text-destructive text-xs px-2 py-1 rounded">
          Using fallback
        </div>
      )}
    </div>
  )
}
