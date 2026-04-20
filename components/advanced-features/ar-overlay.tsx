"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Eye,
  EyeOff,
  Zap,
  Droplets,
  Wind,
  ShieldCheck,
  Maximize2,
  Box,
  Layers,
  Search,
  ScanLine,
  Target,
  Smartphone,
  GlassWater,
  Activity,
  AlertTriangle,
  LocateFixed,
  Radio,
  Users,
  Map as MapIcon,
  ArrowRight
} from "lucide-react"

// AR Spatial & MEP Data Structure for Headsets (Vision Pro / HoloLens)
export interface ARSpatialData {
  projectId: string
  timestamp: string
  spatialAnchor: { x: number; y: number; z: number; rotation: number }
  layers: {
    id: string
    name: string
    type: "hvac" | "electrical" | "plumbing" | "structural"
    visibility: boolean
    opacity: number
    elements: {
      id: string
      label: string
      category: string
      geometry: "pipe" | "wire" | "duct" | "conduit"
      path: { x: number; y: number; z: number }[]
      material: string
      status: "nominal" | "clash" | "unverified"
      data: Record<string, string | number>
    }[]
  }[]
}

const MOCK_AR_DATA: ARSpatialData = {
  projectId: "PRJ-992-SIID",
  timestamp: new Date().toISOString(),
  spatialAnchor: { x: 12.5, y: 1.2, z: -8.4, rotation: 180 },
  layers: [
    {
      id: "LYR-01",
      name: "Electrical Grid",
      type: "electrical",
      visibility: true,
      opacity: 0.85,
      elements: [
        { id: "EL-001", label: "Main Power Line", category: "High Voltage", geometry: "conduit", path: [], material: "Copper/PVC", status: "nominal", data: { voltage: "440V", load: "62%" } },
        { id: "EL-002", label: "Data Conduit", category: "Low Voltage", geometry: "wire", path: [], material: "Cat-6", status: "clash", data: { speed: "10Gbps" } }
      ]
    },
    {
      id: "LYR-02",
      name: "Plumbing Network",
      type: "plumbing",
      visibility: true,
      opacity: 0.7,
      elements: [
        { id: "PL-001", label: "Greywater Return", category: "Recycled", geometry: "pipe", path: [], material: "uPVC", status: "nominal", data: { flow: "12L/min", pressure: "45psi" } }
      ]
    }
  ]
}

export function AROverlay() {
  const [activeLayers, setActiveLayers] = useState<string[]>(["electrical", "plumbing", "hvac"])
  const [isXrayActive, setIsXrayActive] = useState(true)
  const [isSyncing, setIsSyncing] = useState(true)
  const [driftOffset, setDriftOffset] = useState({ x: 0.02, y: -0.01 })
  const [xrayDepth, setXrayDepth] = useState(50) // 0 to 100 depth
  const [xrMode, setXrMode] = useState<"vision" | "ghost" | "mesh">("vision")
  const [isRemoteAssistActive, setIsRemoteAssistActive] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsSyncing(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  // Simulate AR spatial jitter/drift for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setDriftOffset({ x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005 })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer])
  }

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      
      {/* Left Column: AR Viewport */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="relative aspect-video rounded-[3.5rem] overflow-hidden border-0 shadow-2xl bg-black group ring-1 ring-white/10">
           {/* Simulated Camera Feed (The real-world view) */}
            <img 
            src={`https://enter.pollinations.ai/prompt/first%20person%20view%20of%20a%20construction%20site%20unfinished%20concrete%20wall%20with%20glowing%20AR%20holographic%20pipes%20and%20wires%20overlay%20showing%20through%20walls%20x-ray%20vision%20high-tech%20HUD%20${xrMode}?width=1280&height=720&model=flux-realism`} 
            alt="AR Site-Walk Viewport" 
            className={`w-full h-full object-cover transition-all duration-1000 ${isSyncing ? 'blur-xl' : 'blur-0'} ${xrMode === 'ghost' ? 'opacity-40 grayscale scale-110' : 'opacity-100'}`}
          />

          {/* AR HUD Overlay */}
          {!isSyncing && (
            <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Badge className="bg-red-500 text-white border-none px-4 py-1.5 font-mono uppercase tracking-[0.3em] text-[10px] rounded-full animate-pulse shadow-lg shadow-red-500/20">
                           <ScanLine className="w-4 h-4 mr-2 inline" /> AR-SYNC-LOCKED // v4.0
                        </Badge>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                           <GlassWater className="w-7 h-7" />
                        </div>
                        <h2 className="text-5xl font-black text-white italic tracking-tighter">INDUSTRI-XR™</h2>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     {isRemoteAssistActive && (
                       <Badge className="bg-blue-600 text-white px-4 py-2 rounded-xl animate-bounce flex items-center gap-2 font-black uppercase tracking-widest text-[9px]">
                          <Users className="w-4 h-4" /> Remote Architect Connected
                       </Badge>
                     )}
                     <div className="p-5 bg-black/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 text-right space-y-1 shadow-2xl">
                        <div className="text-[10px] uppercase font-black text-white/40 tracking-widest">Spatial Sync Stability</div>
                        <div className="text-2xl font-black text-primary flex items-center gap-3 justify-end italic tracking-tighter">
                           <Target className="w-6 h-6 animate-pulse" /> 99.85%
                        </div>
                        <p className="text-[9px] font-mono text-white/30 tracking-tight uppercase">JITTER_LOCK: ACTIVE | LATENCY: 4ms</p>
                     </div>
                  </div>
               </div>

               {/* Central Crosshair / Interaction Point */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  <div className="w-24 h-24 border-2 border-primary/20 rounded-full flex items-center justify-center group/xhair hover:scale-110 transition-all cursor-crosshair">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),1)]" />
                     {/* Gaze detection details */}
                     <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 p-4 bg-black/80 backdrop-blur-2xl rounded-2xl border border-primary/30 text-center scale-0 group-hover/xhair:scale-100 transition-all">
                        <div className="text-[9px] font-black text-white/40 uppercase mb-1 tracking-[0.2em]">Components in Focus</div>
                        <div className="text-xs font-black text-white uppercase italic">PWR-CONDUIT-SEC-7B</div>
                        <div className="mt-2 text-[9px] font-bold text-primary italic uppercase">Drilling Safe: 140mm Radius</div>
                     </div>
                  </div>
               </div>

               {/* Advanced Bottom Controls (10+ interactive elements) */}
               <div className="flex items-end justify-between gap-10 pointer-events-auto">
                  <div className="flex flex-col gap-6">
                     <Card className="p-6 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] space-y-4 w-[280px]">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">X-Ray Depth</span>
                           <span className="text-xs font-black text-primary">{xrayDepth}%</span>
                        </div>
                        <Progress value={xrayDepth} className="h-1.5 bg-white/10" onClick={(e) => setXrayDepth(Math.floor((e.nativeEvent as any).offsetX / 2))} />
                        <div className="grid grid-cols-2 gap-3">
                           <Button 
                             onClick={() => setIsXrayActive(!isXrayActive)}
                             className={`h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isXrayActive ? 'bg-primary text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                           >
                              {isXrayActive ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />} VISION
                           </Button>
                           <Button 
                             onClick={() => setIsRemoteAssistActive(!isRemoteAssistActive)}
                             className={`h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isRemoteAssistActive ? 'bg-blue-600 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                           >
                             <Users className="w-4 h-4 mr-2" /> ASSIST
                           </Button>
                        </div>
                     </Card>
                  </div>

                  <div className="flex flex-col items-end gap-6">
                     <div className="p-6 bg-black/60 backdrop-blur-3xl rounded-[3rem] border border-primary/20 flex items-center gap-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 animate-pulse pointer-events-none" />
                        {[
                          { id: "ghost", icon: <Layers />, label: "GHOST" },
                          { id: "mesh", icon: <Box />, label: "MESH" },
                          { id: "vision", icon: <ScanLine />, label: "BIM_XR" }
                        ].map((m) => (
                           <button 
                             key={m.id}
                             onClick={() => setXrMode(m.id as any)}
                             className={`flex flex-col items-center gap-2 transition-all ${xrMode === m.id ? 'text-primary scale-110 drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]' : 'text-white/20'}`}
                           >
                              {m.icon}
                              <span className="text-[9px] font-black italic uppercase tracking-tighter">{m.label}</span>
                           </button>
                        ))}
                        <div className="h-10 w-px bg-white/10 mx-2" />
                        <div className="flex items-center gap-6">
                           <button className={`p-1.5 transition-all ${activeLayers.includes('electrical') ? 'text-amber-400' : 'text-white/20'}`} onClick={() => toggleLayer('electrical')}><Zap className="w-5 h-5 shadow-2xl" /></button>
                           <button className={`p-1.5 transition-all ${activeLayers.includes('plumbing') ? 'text-blue-400' : 'text-white/20'}`} onClick={() => toggleLayer('plumbing')}><Droplets className="w-5 h-5 shadow-2xl" /></button>
                           <button className={`p-1.5 transition-all ${activeLayers.includes('hvac') ? 'text-green-400' : 'text-white/20'}`} onClick={() => toggleLayer('hvac')}><Wind className="w-5 h-5 shadow-2xl" /></button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Vision Pro Simulation HUD elements (Floating Task Pins) */}
          {!isSyncing && (
             <>
               <div className="absolute top-1/3 left-1/3 p-4 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl flex items-center gap-3 hover:scale-110 transition-all cursor-pointer pointer-events-auto group/pin animate-bounce-slow">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white"><MapIcon className="w-4 h-4" /></div>
                  <div className="text-right">
                     <div className="text-[8px] font-black text-white/50 uppercase tracking-widest">TASK_PIN</div>
                     <div className="text-[10px] font-black text-white uppercase italic group-hover/pin:text-primary transition-colors">Verify Sealing</div>
                  </div>
               </div>
               
               {/* 3D Flow Arrows Simulation */}
               {activeLayers.includes('plumbing') && (
                  <div className="absolute bottom-1/2 left-1/4 flex flex-col gap-4 opacity-50">
                     {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-slide-right flex items-center gap-2 text-blue-400" style={{ animationDelay: `${i * 0.5}s` }}>
                           <ArrowRight className="w-4 h-4" />
                        </div>
                     ))}
                  </div>
               )}
             </>
          )}

          {/* Syncing Overlay */}
          {isSyncing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
                <Radio className="w-24 h-24 text-primary animate-pulse" />
                <div className="text-center space-y-3">
                   <p className="text-white font-black tracking-[0.5em] text-lg italic animate-pulse">LOCKING SPATIAL MESH v4</p>
                   <div className="h-1 w-64 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-progress-fill" />
                   </div>
                </div>
            </div>
          )}
        </Card>

        {/* Feature Grid: Spatial Intelligence (10+ real-time features) */}
        <div className="grid md:grid-cols-4 gap-6">
           <Card className="p-7 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 space-y-4 shadow-xl group hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg group-hover:scale-110 transition-all"><AlertTriangle className="w-6 h-6" /></div>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase">Drilling Shield: 2 conduits identified in path. AI-Lock engaged.</p>
           </Card>

           <Card className="p-7 rounded-[2.5rem] bg-primary/5 border border-primary/20 space-y-4 shadow-xl group hover:border-primary/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-all"><Target className="w-6 h-6" /></div>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase">Auto-Calibration: IMU Data synced with Fixed-Cam-04. Offset: 0.02mm.</p>
           </Card>

           <Card className="p-7 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 space-y-4 shadow-xl group hover:border-indigo-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-lg group-hover:scale-110 transition-all"><Search className="w-6 h-6" /></div>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase">Gaze Tracking: 4ms eye-to-rendering latency. Apple Vision Pro Native.</p>
           </Card>

           <Card className="p-7 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 space-y-4 shadow-xl group hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg group-hover:scale-110 transition-all"><Smartphone className="w-6 h-6" /></div>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase">Remote Assist: 4K HDR live stream to offsite HQ active.</p>
           </Card>
        </div>
      </div>

      {/* Right Column: AEC Spatial Data Schema Viewer */}
      <div className="space-y-6">
         <Card className="p-8 rounded-[2.5rem] bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 flex flex-col h-full">
            <div className="space-y-1">
               <h3 className="text-xl font-black italic tracking-tighter uppercase shrink-0">Spatial Schema</h3>
               <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-80 shrink-0">BIM-to-XR Mapping Protocol v4</p>
            </div>

            <div className="p-4 rounded-2xl bg-black dark:bg-black/90 text-primary font-mono text-[10px] overflow-auto flex-1 custom-scrollbar">
               <pre className="whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(MOCK_AR_DATA, null, 2)}
               </pre>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800 shrink-0">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Mesh Complexity</span>
                  <span className="text-xs font-black text-green-600">Adaptive (LOD-3)</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Headset Sync</span>
                  <Badge className="bg-primary/10 text-primary uppercase text-[8px]">VisionOS Ready</Badge>
               </div>
               <Button className="w-full h-14 bg-primary text-white rounded-xl font-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <Layers className="w-5 h-5" /> EXPORT SPATIAL MESH
               </Button>
            </div>
         </Card>

         <Card className="p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-black text-white space-y-4 shadow-2xl relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50" />
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white/10 rounded-lg"><Activity className="w-4 h-4" /></div>
               <h4 className="text-xs font-black italic tracking-widest uppercase">Live MEP Hash</h4>
            </div>
            <p className="text-[10px] text-white/70 leading-relaxed font-medium">BIM hash: 0x82f...a12c. Any onsite changes to MEP will auto-invalidate this spatial anchor. Syncing with Master Model...</p>
         </Card>
      </div>
    </div>
  )
}
