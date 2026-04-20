"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Video, 
  Navigation, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Map as MapIcon, 
  Activity, 
  Maximize2, 
  Camera, 
  ShieldAlert,
  Zap,
  Box,
  BrainCircuit,
  Orbit,
  ArrowRight,
  Eye,
  Wind
} from "lucide-react"

// Types for our Industry-Disrupting Vision AI
interface VisionFeed {
  id: string
  source: "Drone-α" | "Spot-Robot-1" | "Fixed-Cam-04" | "Fixed-Cam-07"
  status: "active" | "offline" | "scanning" | "charging" | "autopilot"
  lastScan: string
  alerts: number
  progress: number
  location: string
  imageUrl: string
  battery?: number
  lidarStatus?: "ready" | "active" | "error"
  thermalMode?: boolean
  workerCount?: number
  windSpeed?: string
}

const MOCK_FEEDS: VisionFeed[] = [
  {
    id: "1",
    source: "Drone-α",
    status: "autopilot",
    lastScan: "2 mins ago",
    alerts: 1,
    progress: 88.5,
    location: "Sector 4 - Roof Deck",
    imageUrl: "https://enter.pollinations.ai/prompt/aerial%20drone%20view%20of%20construction%20site%20roof%20deck%20with%20AI%20overlay%20bounding%20boxes%20thermal%20heatmap%20shading%20technical%20data?width=800&height=450&model=flux-realism",
    battery: 42,
    lidarStatus: "active",
    windSpeed: "12 km/h"
  },
  {
    id: "2",
    source: "Spot-Robot-1",
    status: "active",
    lastScan: "Just now",
    alerts: 0,
    progress: 42.0,
    location: "Internal Floor 2 - Corridor B",
    imageUrl: "https://enter.pollinations.ai/prompt/boston%20dynamics%20spot%20robot%20walking%20through%20construction%20site%20corridor%20with%20LiDAR%20point%20cloud%20overlay%20and%20depth%20mapping?width=800&height=450&model=flux-realism",
    battery: 65,
    lidarStatus: "ready",
    workerCount: 4
  },
  {
    id: "3",
    source: "Fixed-Cam-04",
    status: "active",
    lastScan: "Continuous",
    alerts: 2,
    progress: 75.2,
    location: "Main Entry - North Elevation",
    imageUrl: "https://enter.pollinations.ai/prompt/construction%20site%20security%20camera%20feed%20detecting%20workers%20PPE%20helmets%20and%20vests%20with%20green%20and%20red%20boxes%20behavioral%20analysis?width=800&height=450&model=flux-realism",
    workerCount: 12
  }
]

export function SiteMonitoring() {
  const [activeFeed, setActiveFeed] = useState<VisionFeed>(MOCK_FEEDS[0])
  const [isAiProcessing, setIsAiProcessing] = useState(true)
  const [visionMode, setVisionMode] = useState<"standard" | "thermal" | "lidar" | "night">("standard")

  useEffect(() => {
    const timer = setTimeout(() => setIsAiProcessing(false), 2000)
    return () => clearTimeout(timer)
  }, [activeFeed, visionMode])

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      
      {/* Left Column: Live Vision Feed */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="relative aspect-video rounded-[3rem] overflow-hidden border-0 shadow-2xl bg-black group">
          {/* Main Feed Image */}
          <img 
            src={activeFeed.imageUrl} 
            alt="Site Monitoring Feed" 
            className={`w-full h-full object-cover transition-all duration-1000 ${isAiProcessing ? 'blur-sm grayscale' : 'blur-0 grayscale-0'} ${visionMode === 'thermal' ? 'hue-rotate-180 invert' : ''}`}
          />
          
          {/* AI Overlay Interface */}
          {!isAiProcessing && (
            <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
              <div className="w-full h-full border-[1.5px] border-primary/40 rounded-[2.5rem] relative">
                {/* HUD Elements */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                   <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse border-2 border-white" />
                   <div className="space-y-1">
                      <Badge className="bg-black/60 backdrop-blur-md border-white/20 text-white font-mono uppercase tracking-[0.2em] text-[10px] px-3 py-1">
                         LIVE FEED // {activeFeed.source}
                      </Badge>
                      <div className="flex items-center gap-2 text-[10px] font-black text-white/60 px-2">
                         <MapIcon className="w-3 h-3" /> {activeFeed.location}
                      </div>
                   </div>
                </div>

                <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
                   <div className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/30">
                      <BrainCircuit className="w-4 h-4" /> AI-VISION ACTIVE // MODE: {visionMode.toUpperCase()}
                   </div>
                   {activeFeed.battery !== undefined && (
                      <div className="px-3 py-1 bg-black/40 backdrop-blur-md text-white rounded-lg text-[9px] font-mono flex items-center gap-2">
                         <div className="w-8 h-4 bg-white/20 rounded-sm relative overflow-hidden">
                            <div className={`h-full ${activeFeed.battery < 20 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${activeFeed.battery}%` }} />
                         </div>
                         {activeFeed.battery}% PWR // {activeFeed.status === 'autopilot' ? 'AUTO-PILOT' : 'MANUAL'}
                      </div>
                   )}
                   {activeFeed.windSpeed && (
                      <div className="px-3 py-1 bg-black/40 backdrop-blur-md text-sky-400 rounded-lg text-[9px] font-mono">
                         WIND: {activeFeed.windSpeed} // STABLE
                      </div>
                   )}
                </div>

                {/* Simulated Bounding Boxes (Visual decoration) */}
                <div className="absolute top-1/4 left-1/3 w-40 h-56 border-2 border-green-500/60 rounded-xl">
                   <div className="absolute -top-7 left-0 bg-green-500 text-white text-[9px] px-2 py-0.5 rounded-t-lg font-black italic tracking-tighter">MASON_7 // PPE_VERIFIED</div>
                   <div className="absolute inset-0 bg-green-500/5 backdrop-blur-[1px]" />
                </div>
                
                <div className="absolute bottom-1/4 right-1/4 w-48 h-32 border-2 border-red-500/60 rounded-xl animate-pulse">
                   <div className="absolute -top-7 left-0 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-t-lg font-black flex items-center gap-1 italic">
                      <ShieldAlert className="w-4 h-4" /> CRITICAL // EXCLUSION_ZONE
                   </div>
                   <div className="absolute inset-x-0 -bottom-8 flex justify-between px-2 text-[8px] font-mono text-red-500 font-black">
                      <span>OBJ: CRANE_G4</span>
                      <span>DIST: 2.1m</span>
                   </div>
                </div>

                {/* LiDAR / Point Cloud Elements */}
                {visionMode === 'lidar' && (
                  <div className="absolute inset-0 opacity-40">
                     {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute bg-sky-400 w-1 h-1 rounded-full animate-ping" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
                     ))}
                  </div>
                )}

                {/* Progress HUD - 5+ Progress metrics */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6">
                   <div className="flex-1 max-w-sm p-5 bg-black/50 backdrop-blur-xl rounded-[2rem] border border-white/10 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <div className="text-[9px] uppercase font-black text-white/50 tracking-widest">Structural</div>
                            <Progress value={92} className="h-1 bg-white/10" />
                         </div>
                         <div className="space-y-1">
                            <div className="text-[9px] uppercase font-black text-white/50 tracking-widest">Acoustic</div>
                            <Progress value={45} className="h-1 bg-white/10" />
                         </div>
                         <div className="space-y-1">
                            <div className="text-[9px] uppercase font-black text-white/50 tracking-widest">Safety Score</div>
                            <Progress value={98} className="h-1 bg-white/10" />
                         </div>
                         <div className="space-y-1">
                            <div className="text-[9px] uppercase font-black text-white/50 tracking-widest">Density</div>
                            <Progress value={62} className="h-1 bg-white/10" />
                         </div>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                         <span className="text-[10px] font-black text-primary italic uppercase tracking-widest leading-none">AI Health Index</span>
                         <span className="text-xl font-black text-white tracking-tighter italic">98.4%</span>
                      </div>
                   </div>
                   
                   <div className="flex gap-4">
                      <div className="p-5 bg-black/50 backdrop-blur-xl rounded-[2rem] border border-white/10 text-center min-w-[120px]">
                         <div className="text-[9px] uppercase font-black text-muted-foreground mb-1 tracking-tighter italic">Site Crowd</div>
                         <div className="text-3xl font-black text-white">{activeFeed.workerCount || 0}</div>
                         <div className="text-[8px] font-bold text-green-400 mt-1 uppercase">Allocated</div>
                      </div>
                      <div className="p-5 bg-black/50 backdrop-blur-xl rounded-[2rem] border border-white/10 text-right min-w-[140px]">
                         <div className="text-[9px] uppercase font-black text-muted-foreground mb-1 tracking-tighter italic">Sector Progress</div>
                         <div className="text-4xl font-black text-white tracking-tighter italic">{activeFeed.progress.toFixed(1)}%</div>
                         <div className="text-[8px] font-bold text-primary mt-1 uppercase">Ready for Payout</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Vision Mode Selector (Mobile/Tablet Friendly) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
             {[
               { id: "standard", icon: <Video />, label: "Standard" },
               { id: "thermal", icon: <Zap />, label: "Thermal" },
               { id: "lidar", icon: <Orbit />, label: "LiDAR" },
               { id: "night", icon: <Eye />, label: "Night" }
             ].map((mode) => (
               <Button 
                key={mode.id}
                variant="ghost" 
                size="icon" 
                onClick={() => setVisionMode(mode.id as any)}
                className={`w-14 h-14 rounded-2xl transition-all shadow-2xl backdrop-blur-md border border-white/10 ${visionMode === mode.id ? 'bg-primary text-white scale-110' : 'bg-black/60 text-white hover:bg-white/10'}`}
                title={mode.label}
               >
                  {mode.icon}
               </Button>
             ))}
          </div>
        </Card>

        {/* Real-time Analytical Cards (10+ Metrics total across UI) */}
        <div className="grid md:grid-cols-4 gap-6">
           <Card className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg"><Activity className="w-6 h-6" /></div>
              <div className="space-y-1">
                 <h4 className="font-black text-sm uppercase tracking-tighter italic">Behavioral AI</h4>
                 <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-80">Fatigue tracking active. 0 anomalies detected.</p>
              </div>
           </Card>
           
           <Card className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg"><ShieldAlert className="w-6 h-6" /></div>
              <div className="space-y-1">
                 <h4 className="font-black text-sm uppercase tracking-tighter italic">Risk Prediction</h4>
                 <p className="text-[9px] font-bold text-amber-600/80 uppercase">Potential fall hazard @ Sector 2 Stairwell.</p>
              </div>
           </Card>

           <Card className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-lg"><Orbit className="w-6 h-6" /></div>
              <div className="space-y-1">
                 <h4 className="font-black text-sm uppercase tracking-tighter italic">BIM Matching</h4>
                 <p className="text-[9px] font-bold text-indigo-600/80 uppercase">Physical vs Digital Sync: 99.2% Variance: ±4mm</p>
              </div>
           </Card>

           <Card className="p-6 rounded-[2rem] bg-sky-500/5 border border-sky-500/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-500 shadow-lg"><Wind className="w-6 h-6" /></div>
              <div className="space-y-1">
                 <h4 className="font-black text-sm uppercase tracking-tighter italic">Eco-Aerosol</h4>
                 <p className="text-[9px] font-bold text-sky-600/80 uppercase">Dust Levels: 12μg/m³ (Optimal/Safe)</p>
              </div>
           </Card>
        </div>
      </div>

      {/* Right Column: Fleet Management */}
      <div className="space-y-6">
         <Card className="p-8 rounded-[2rem] bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black italic tracking-tighter">SIID FLEET</h3>
               <Badge className="bg-primary/10 text-primary border-primary/20">{MOCK_FEEDS.length} Units Active</Badge>
            </div>

            <div className="space-y-4">
               {MOCK_FEEDS.map((feed) => (
                 <button 
                  key={feed.id} 
                  onClick={() => setActiveFeed(feed)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${
                    activeFeed.id === feed.id 
                    ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]' 
                    : 'border-transparent bg-slate-50 dark:bg-slate-950 hover:border-slate-200 dark:hover:border-slate-800'
                  }`}
                 >
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                     activeFeed.id === feed.id ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                   }`}>
                      {feed.source.includes('Drone') ? <Navigation className="w-6 h-6" /> : feed.source.includes('Spot') ? <Cpu className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                   </div>
                   <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                         <span className="font-black text-sm">{feed.source}</span>
                         <span className={`w-2 h-2 rounded-full ${feed.status === 'scanning' ? 'bg-amber-400 animate-ping' : 'bg-green-500'}`} />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-80">{feed.location}</p>
                   </div>
                 </button>
               ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
               <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">3D Reconstruction</span>
                     <Badge className="bg-indigo-600 text-white text-[8px] animate-pulse">82%</Badge>
                  </div>
                  <p className="text-[10px] font-bold leading-relaxed">Processing NeRF data for Sector 4 North. Final 3D point cloud generation scheduled in 14 mins.</p>
               </div>

               <Button className="w-full h-14 bg-primary text-white rounded-xl font-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <Maximize2 className="w-5 h-5" /> EXPAND FLEET OPS <ArrowRight className="w-4 h-4 ml-1" />
               </Button>
            </div>
         </Card>

         <Card className="p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-black text-white space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50" />
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white/10 rounded-lg"><Activity className="w-4 h-4" /></div>
               <h4 className="text-sm font-black italic tracking-widest uppercase">Predictive Safety AI</h4>
            </div>
            <p className="text-[10px] text-white/70 leading-relaxed font-medium">Analyzing behavioral patterns for "Zone 4 Scaffolding". Probability of minor structural anomaly detected at 14.5% due to improper loading.</p>
            <Button variant="outline" className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold h-10 text-xs">RESOLVE ALERT</Button>
         </Card>
      </div>
    </div>
  )
}
