"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ShieldCheck, 
  Leaf, 
  Sun, 
  TrendingUp, 
  AlertTriangle, 
  Compass, 
  Droplets,
  Zap,
  CheckCircle2,
  Scale,
  Activity
} from "lucide-react"

interface InsightProps {
  location?: string
  area?: number
  floors?: number
  type?: string
  strategy?: "roi" | "eco" | "speed"
}

export function ProjectInsights({ location, area = 0, floors = 0, type, strategy = "roi" }: InsightProps) {
  // Mock logic for "Local Zoning" based on area
  const fsiLimit = type === "Commercial" ? 2.5 : 1.75
  const currentFsi = (area * floors) / (area || 1) // Simplified FSI check
  const isViolatingSetback = area < 1000 && floors > 2

  // Mock Solar Yield
  const solarYield = area * 0.15 * (strategy === "eco" ? 1.2 : 1) // sqft to potential kWh
  const paybackYears = strategy === "eco" ? 4.5 : 6

  // Mock Carbon Footprint
  const carbonImpact = floors * 12.5 * (strategy === "eco" ? 0.7 : 1)

  return (
    <div className="space-y-6 pt-6 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
         <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 italic">AI Strategy Insights v4.0</h4>
         <Badge variant="outline" className="text-[9px] border-emerald-500/20 bg-emerald-500/5 text-emerald-500">
            STRATEGY: {strategy.toUpperCase()}
         </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Local Zoning & Permit Insight */}
        <Card className="p-4 bg-slate-950 border-slate-800 space-y-3">
           <div className="flex items-center justify-between">
              <Scale className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-mono text-slate-500">ZONING // PERMIT</span>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between text-xs">
                 <span className="text-slate-400">Permit Probability</span>
                 <span className="text-emerald-500 font-bold">92%</span>
              </div>
              <Progress value={92} className="h-1 bg-slate-900" />
              <p className="text-[9px] text-slate-500 italic">“Based on {location}, FSI limit is {fsiLimit}. Your requested build is within 10% of allowance.”</p>
           </div>
        </Card>

        {/* Solar & Eco ROI */}
        <Card className="p-4 bg-slate-950 border-slate-800 space-y-3">
           <div className="flex items-center justify-between">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono text-slate-500">SOLAR // ECO</span>
           </div>
           <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white uppercase tracking-tighter">
                 <span>Solar Yield Potential</span>
                 <span>~{Math.round(solarYield)} kWh/yr</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                 <span>Carbon Credit Potential</span>
                 <span className="text-emerald-500">+12.4 Credits/yr</span>
              </div>
              <p className="text-[9px] text-amber-500/60 font-bold">Payback Period: {paybackYears} Years</p>
           </div>
        </Card>

        {/* Foundation & Soil Intelligence */}
        <Card className="p-4 bg-slate-950 border-slate-800 space-y-3">
           <div className="flex items-center justify-between">
              <Activity className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] font-mono text-slate-500">GEOTECH // STRUCT</span>
           </div>
           <div className="space-y-1">
              <div className="text-[10px] uppercase font-black text-slate-400">Foundation Recomm: <span className="text-white">Raft Foundation</span></div>
              <p className="text-[9px] text-slate-500 leading-relaxed italic">Soil type detected as 'Silty-Clay'. AI recommends Grade M30 concrete for sub-structure.</p>
           </div>
        </Card>

        {/* Supply Chain Volatility */}
        <Card className="p-4 bg-slate-950 border-slate-800 space-y-3">
           <div className="flex items-center justify-between">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-mono text-slate-500">MARKET // SUPPLY</span>
           </div>
           <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
                 <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Steel Price Spike Alert</span>
              </div>
              <p className="text-[9px] text-slate-500 mb-1">Market trend indicates 14% increase in TMT bars next month. ROI impact: -2.1%.</p>
              <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 cursor-pointer hover:underline">
                 <CheckCircle2 className="w-3 h-3" /> Auto-Lock Vendor Pricing
              </div>
           </div>
        </Card>

        {/* Vastu Alignment AI */}
        <Card className="p-4 bg-slate-950 border-slate-800 space-y-3 col-span-2">
           <div className="flex items-center justify-between">
              <Compass className="w-4 h-4 text-rose-500 animate-spin-slow" />
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">VASTU-ALIGN™ HUD</h5>
              <span className="text-[10px] font-black text-emerald-500">SCORE: 88%</span>
           </div>
           <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                 <div className="flex justify-between text-[8px] uppercase font-bold text-slate-500">
                    <span>Main Door (East)</span>
                    <span className="text-emerald-500">PERFECT</span>
                 </div>
                 <Progress value={100} className="h-1 bg-slate-900" />
                 <div className="flex justify-between text-[8px] uppercase font-bold text-slate-500">
                    <span>Kitchen (SE)</span>
                    <span className="text-emerald-500">OPTIMAL</span>
                 </div>
                 <Progress value={90} className="h-1 bg-slate-900" />
              </div>
              <div className="w-px bg-slate-800" />
              <div className="flex-1">
                 <p className="text-[9px] text-slate-400 leading-relaxed font-medium italic">“AI recommends shifting the Master Bedroom towards the SW quadrant for maximum stability index.”</p>
              </div>
           </div>
        </Card>
      </div>
    </div>
  )
}
