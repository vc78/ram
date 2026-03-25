"use client"

import React, { useState } from "react"
import { Building2 } from "lucide-react"

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
    <div className="flex items-center justify-center px-8 md:px-12 opacity-40">
      <Building2 className="w-8 h-8 text-muted-foreground" />
    </div>
  )
}

function LogoItem({ logo }: { logo: { name: string, src: string } }) {
  const [error, setError] = useState(false)

  if (error) {
    return <FallbackLogo />
  }

  return (
    <div className="px-8 md:px-12 flex items-center justify-center">
      <img
        src={logo.src}
        alt="" // no visible name
        className="h-10 md:h-12 w-auto object-contain transition-all duration-300 hover:scale-110 active:scale-125"
        onError={() => setError(true)}
      />
    </div>
  )
}

export function CompanyLogoScroller() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <section className="relative overflow-hidden py-8 md:py-10 bg-background border-t border-border/40 flex select-none min-h-[100px]">
        <div className="flex items-center justify-center w-full opacity-0">Loading Logos...</div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden py-8 md:py-10 bg-background border-t border-border/40 flex select-none">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes logoScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-logo-scroll {
          display: inline-flex;
          animation: logoScroll 40s linear infinite;
        }
        .animate-logo-scroll:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Soft gradient fades on edges to smoothly blend logos in and out */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Marquee Container */}
      <div className="animate-logo-scroll flex-nowrap items-center w-fit">
        {/* Duplicate the array enough times to ensure loop never breaks */}
        <div className="flex items-center">
          {[1, 2, 3].map((groupIndex) => (
            <div key={groupIndex} className="flex flex-nowrap items-center">
              {logos.map((logo, i) => (
                <LogoItem key={`${groupIndex}-${i}`} logo={logo} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

