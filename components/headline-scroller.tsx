"use client"

import React from "react"
import { Component, LayoutDashboard, BrainCircuit, Activity, LineChart, Target, Coins, Cog } from "lucide-react"

const features = [
  { text: "AI-Based Material Prediction", icon: BrainCircuit },
  { text: "Smart Vastu Analysis", icon: Component },
  { text: "Automated MEP Layouts", icon: Cog },
  { text: "Real-Time Project Tracking", icon: Activity },
  { text: "Centralized Dashboard", icon: LayoutDashboard },
  { text: "Contractor Alignment", icon: Target },
  { text: "Cost Optimization", icon: Coins },
  { text: "Intelligent Planning", icon: LineChart }
]

export function HeadlineScroller() {
  return (
    <section className="relative overflow-hidden py-4 md:py-5 bg-background border-y border-border/50 flex select-none">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
      
      {/* Soft gradient fades on edges for premium feel */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Marquee Container */}
      <div className="animate-marquee flex-nowrap items-center w-fit">
        {/* We duplicate the same content sequence enough times so that half its width safely fills the screen, guaranteeing a flawless endless loop when it resets at -50% */}
        <div className="flex items-center">
          {[1, 2, 3, 4].map((groupIndex) => (
            <div key={groupIndex} className="flex flex-nowrap items-center">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <React.Fragment key={`${groupIndex}-${i}`}>
                    <div className="flex items-center gap-3 px-8 group cursor-default">
                      <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:scale-110 group-hover:text-accent transition-all duration-300">
                        <Icon strokeWidth={2.5} size={20} />
                      </div>
                      <span className="text-sm md:text-base font-semibold text-primary/80 tracking-widest uppercase whitespace-nowrap group-hover:text-primary transition-colors duration-300">
                        {feature.text}
                      </span>
                    </div>
                    {/* Tiny visual separator */}
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/30 pointer-events-none" />
                  </React.Fragment>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
