"use client"

import OptimizedImage from "./optimized-image"

interface ThumbnailItem {
  id: string
  src: string
  alt: string
  title: string
  onClick?: () => void
}

interface ThumbnailGridProps {
  items: ThumbnailItem[]
  columns?: 2 | 3 | 4
  className?: string
}

export default function ThumbnailGrid({ items, columns = 3, className = "" }: ThumbnailGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="group cursor-pointer" onClick={item.onClick}>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <OptimizedImage
              src={item.src}
              alt={item.alt}
              className="w-full h-full transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-medium text-sm">{item.title}</h3>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
