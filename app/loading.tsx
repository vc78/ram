"use client"

import { Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background select-none pointer-events-none animate-in fade-in duration-500">
      <div className="relative flex flex-col items-center">
        {/* Animated Glow in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
        
        {/* Logo Icon with Pulse/Spin */}
        <div className="relative z-10 w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 animate-bounce transition-transform duration-1000">
          <Sparkles className="w-10 h-10 text-primary animate-pulse" />
        </div>
        
        {/* Animated Brand Name */}
        <h2 className="mt-8 text-2xl font-bold tracking-widest text-foreground animate-pulse">
          SIID <span className="text-primary">FLASH</span>
        </h2>
        
        {/* Glowing Progress Bar Wrapper */}
        <div className="mt-6 w-48 h-1 bg-muted rounded-full overflow-hidden relative border border-border/50">
          <div className="absolute top-0 left-0 h-full bg-primary w-24 rounded-full animate-[loading-bar_1.5s_infinite_ease-in-out]" />
        </div>
        
        <p className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] animate-fade-in">
          Initializing Construction Intelligence
        </p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  )
}
