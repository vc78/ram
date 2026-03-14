"use client"

import { useState, useEffect } from "react"

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
  const [imgSrc, setImgSrc] = useState(src || fallback)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // if parent changes the src prop we must reset internal state
  useEffect(() => {
    setImgSrc(src || fallback)
    setIsLoading(true)
    setHasError(false)
  }, [src, fallback])

  const handleError = () => {
    if (imgSrc !== fallback) {
      // primary image failed, switch to fallback and restart loading
      setImgSrc(fallback)
      setHasError(true)
      setIsLoading(true)
      onError?.()
    } else {
      // fallback also failed; stop spinner so user sees the broken image icon
      setIsLoading(false)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}
      <img
        src={imgSrc || fallback || "/images/modern-minimalist-design.jpg"}
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
