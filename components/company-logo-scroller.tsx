"use client"

import React, { useState, useEffect } from "react"
import { Building2 } from "lucide-react"
import Image from "next/image"

const logos = [
  { name: "Aditya Birla", src: "/images/Aditya.jpeg" },
  { name: "KCP Cement", src: "/images/Kcp.jpeg" },
  { name: "Ultratech", src: "/images/Ut.jpeg" },
  { name: "ACC Cement", src: "/images/ACC.jpeg" },
  { name: "Ambuja Cement", src: "/images/Ambuja.jpeg" },
  { name: "Dalmia Bharat", src: "/images/Dalmia.jpeg" },
  { name: "Shree Cement", src: "/images/Shree.jpeg" },
  { name: "JSW Steel", src: "/images/Jsw.jpeg" }
]

function FallbackLogo() {
  return (
    <div className="flex items-center justify-center px-4 md:px-8 py-2">
      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-muted rounded-lg">
        <Building2 className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground/50" />
      </div>
    </div>
  )
}

function LogoItem({ logo }: { logo: { name: string; src: string } }) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (error) {
    return <FallbackLogo />
  }

  return (
    <div className="logo-item px-4 md:px-8 py-2 flex items-center justify-center min-w-fit flex-shrink-0">
      <div className="relative h-16 md:h-20 w-auto">
        <img
          src={logo.src}
          alt={logo.name}
          title={logo.name}
          className={`h-full w-auto object-contain transition-all duration-300 hover:scale-110 active:scale-125 cursor-pointer filter brightness-100 hover:brightness-110 ${loaded ? "opacity-100" : "opacity-0"
            }`}
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      </div>
    </div>
  )
}

export function CompanyLogoScroller() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="logo-scroller-section relative overflow-hidden py-12 md:py-16 border-t border-b border-border/50 select-none w-full">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[120px] md:min-h-[150px]">
          <div className="text-center text-muted-foreground">
            <div className="inline-block">Loading partner logos...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="logo-scroller-section relative overflow-hidden py-12 md:py-16 border-t border-b border-border/50 select-none w-full">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes logoScroll {
          0% { 
            transform: translateX(0); 
          }
          100% { 
            transform: translateX(calc(-${logos.length * 140}px)); 
          }
        }
        
        .logo-scroll-track {
          display: flex;
          animation: logoScroll 50s linear infinite;
          will-change: transform;
        }
        
        .logo-scroll-track:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 768px) {
          @keyframes logoScroll {
            0% { 
              transform: translateX(0); 
            }
            100% { 
              transform: translateX(calc(-${logos.length * 100}px)); 
            }
          }
          
          .logo-scroll-track {
            animation: logoScroll 45s linear infinite;
          }
        }
      `}} />

      {/* Gradient fade overlays for premium effect */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-muted/30 via-muted/30 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-muted/30 via-muted/30 to-transparent z-20 pointer-events-none" />

      {/* Marquee scrolling container */}
      <div className="container mx-auto px-4">
        <div className="overflow-hidden w-full">
          <div className="logo-scroll-track flex gap-2 md:gap-4">
            {/* Render logos multiple times to create seamless loop */}
            {[...Array(4)].map((_, groupIdx) => (
              <div key={groupIdx} className="flex gap-2 md:gap-4 flex-shrink-0">
                {logos.map((logo, logoIdx) => (
                  <LogoItem key={`${groupIdx}-${logoIdx}`} logo={logo} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branded section label */}
      <div className="container mx-auto px-4 mt-6 text-center">
        <p className="text-xs md:text-sm text-muted-foreground font-medium tracking-widest uppercase">
          Trusted by leading cement and steel companies
        </p>
      </div>
    </section>
  )
}

