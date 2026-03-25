import React from "react"
import { cn } from "@/lib/utils"

interface BrandLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  width?: number | string
  height?: number | string
}

export function BrandLogo({ className, width = "100%", height = "100%", ...props }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="primaryGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="flashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- LOGO ICON --- */}
        <g transform="translate(10, 10)">
          {/* Hexagon Isometric Base */}
          <path
            d="M 40 0 L 80 23 L 80 69 L 40 92 L 0 69 L 0 23 Z"
            fill="url(#primaryGrad)"
            opacity="0.95"
          />
          {/* 3D Inner structure */}
          <path d="M 0 23 L 40 46 L 80 23 L 40 0 Z" fill="#60a5fa" opacity="0.5" />
          <path d="M 40 92 L 40 46 L 80 23" stroke="#bfdbfe" strokeWidth="2" fill="none" opacity="0.5" />

          {/* S Interlocking Line */}
          <path
            d="M 25 20 L 40 10 L 55 20 L 55 40 L 40 50 L 25 60 L 25 80 L 40 90 L 55 80"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            strokeLinejoin="round"
          />

          {/* Flash bolt striking through the center */}
          <path
            d="M 52 15 L 28 55 L 45 55 L 35 95 L 60 45 L 45 45 Z"
            fill="url(#flashGrad)"
            stroke="white"
            strokeWidth="2"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        </g>

        {/* --- TYPOGRAPHY --- */}
        <text
          x="105"
          y="56"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="44"
          fontWeight="900"
          fill="currentColor"
          letterSpacing="-1.5"
          className="text-foreground dark:fill-white fill-slate-900"
        >
          SIID
        </text>
        <text
          x="195"
          y="56"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="44"
          fontWeight="900"
          fill="#3b82f6"
          letterSpacing="-1.5"
        >
          FLASH
        </text>

        {/* --- SUBTITLE (Optional structural motif) --- */}
        <text
          x="108"
          y="78"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="11"
          fontWeight="700"
          fill="#64748b"
          letterSpacing="4.5"
        >
          INTELLIGENCE PLATFORM
        </text>
      </svg>
    </div>
  )
}
