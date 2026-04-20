import React from "react"
import { cn } from "@/lib/utils"

interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  width?: number | string
  height?: number | string
}

export function BrandLogo({ className, width = "120", height = "40", ...props }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2 flex-shrink-0", className)} {...props}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 500 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-full max-w-xs"
      >
        <defs>
          <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB84C" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* --- LOGO ICON (Buildings & Stars) --- */}
        <g transform="translate(10, 10)">
          {/* Buildings Left */}
          <rect x="50" y="30" width="40" height="90" fill="url(#logoGold)" rx="2" />
          <rect x="100" y="10" width="40" height="110" fill="url(#logoGold)" rx="2" />
          
          {/* Building Lines Left */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`l1-${i}`} x1="55" y1={40 + i * 10} x2="85" y2={40 + i * 10} stroke="white" strokeWidth="1.5" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`l2-${i}`} x1="105" y1={20 + i * 10} x2="135" y2={20 + i * 10} stroke="white" strokeWidth="1.5" />
          ))}

          {/* Stars Column */}
          <g transform="translate(160, 10)">
            {Array.from({ length: 5 }).map((_, i) => (
              <path
                key={`star-${i}`}
                d="M15 0L18.5 10.5H29L20.5 17L24 28L15 21.5L6 28L9.5 17L1 10.5H11.5L15 0Z"
                fill="url(#logoGold)"
                transform={`translate(0, ${i * 24})`}
              />
            ))}
          </g>

          {/* Buildings Right */}
          <rect x="210" y="10" width="40" height="110" fill="url(#logoGold)" rx="2" />
          <rect x="260" y="30" width="40" height="90" fill="url(#logoGold)" rx="2" />

          {/* Building Lines Right */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`r1-${i}`} x1="215" y1={20 + i * 10} x2="245" y2={20 + i * 10} stroke="white" strokeWidth="1.5" />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`r2-${i}`} x1="265" y1={40 + i * 10} x2="295" y2={40 + i * 10} stroke="white" strokeWidth="1.5" />
          ))}

          {/* Decorative Divider */}
          <line x1="0" y1="130" x2="350" y2="130" stroke="url(#logoGold)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="175" cy="130" r="4" fill="url(#logoGold)" />
        </g>

        {/* --- TYPOGRAPHY --- */}
        <text
          x="175"
          y="180"
          fontFamily="Impact, Anton, system-ui, sans-serif"
          fontSize="72"
          fontWeight="900"
          fill="#FFB84C"
          textAnchor="middle"
          letterSpacing="8"
        >
          SIID
        </text>
      </svg>
    </div>
  )
}
