"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Thermometer,
  Zap,
  Droplets,
  Ruler,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Waves,
  Hammer,
  Wind,
  MousePointer2,
  Compass,
  ArrowDownToLine,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

// IoT Sensor Status Types
interface IoTSensor {
  id: string
  label: string
  type: "temperature" | "stress" | "moisture" | "vibration" | "deflection" | "settlement" | "energy"
  value: number
  unit: string
  status: "normal" | "warning" | "critical" | "optimal"
  floor: number
  lastPing: string
  trend?: "up" | "down" | "stable"
}

const MOCK_SENSORS: IoTSensor[] = [
  { id: "S101", label: "Core Hydration", type: "temperature", value: 38.5, unit: "°C", status: "optimal", floor: 2, lastPing: "12s ago", trend: "stable" },
  { id: "S102", label: "Beam Deflection", type: "deflection", value: 4.2, unit: "mm", status: "normal", floor: 1, lastPing: "25s ago", trend: "up" },
  { id: "S103", label: "Slab Moisture", type: "moisture", value: 18.2, unit: "%", status: "warning", floor: 3, lastPing: "5s ago", trend: "down" },
  { id: "S104", label: "Seismic FFT", type: "vibration", value: 0.12, unit: "mm/s", status: "normal", floor: 0, lastPing: "1s ago", trend: "stable" },
  { id: "S105", label: "Strut Strain", type: "stress", value: 890, unit: "kN", status: "critical", floor: 2, lastPing: "3s ago", trend: "up" },
  { id: "S106", label: "Foundation Sink", type: "settlement", value: 0.05, unit: "mm", status: "optimal", floor: 0, lastPing: "1h ago", trend: "stable" },
  { id: "S107", label: "Power Harmonics", type: "energy", value: 2.1, unit: "THD", status: "normal", floor: 1, lastPing: "10s ago", trend: "stable" },
]

export function DigitalTwin() {
  const [sensors, setSensors] = useState<IoTSensor[]>(MOCK_SENSORS)
  const [activeFloor, setActiveFloor] = useState(2)
  const [isSyncing, setIsSyncing] = useState(true)
  const [twinMode, setTwinMode] = useState<"structural" | "thermal" | "energy">("structural")

  // Simulation: High-fidelity sensor fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(s => ({
        ...s,
        value: s.type === "temperature" ? s.value + (Math.random() - 0.5) * 0.15 : 
               s.type === "deflection" ? s.value + (Math.random() - 0.5) * 0.05 :
               s.type === "stress" ? s.value + (Math.random() - 0.5) * 8 : 
               s.value + (Math.random() - 0.5) * 0.2
      })))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsSyncing(false), 2000)
    return () => clearTimeout(timer)
  }, [twinMode])

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      
      {/* Left Column: Digital Twin 3D Schematic */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="relative h-[650px] rounded-[3.5rem] overflow-hidden border-0 bg-slate-950 shadow-2xl group border-t border-white/10">
           {/* Abstract Building HUD - Layers */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="relative w-[340px] h-[550px] border-[1px] border-primary/30 rounded-2xl transform transition-all duration-1000" style={{ transform: "perspective(1200px) rotateX(20deg) rotateY(-10deg)" }}>
                  {/* Building Floors Visualization */}
                  {[0, 1, 2, 3, 4].map((f) => (
                    <div 
                      key={f}
                      className={`absolute left-0 right-0 h-28 border-t border-primary/10 transition-all duration-700 flex items-center justify-center ${activeFloor === f ? 'bg-primary/20 border-primary shadow-[0_0_50px_rgba(var(--primary),0.2)]' : ''}`}
                      style={{ bottom: `${f * 100}px` }}
                    >
                      <div className="absolute -left-16 top-2 text-[9px] font-black tracking-widest text-primary/40 uppercase">LVL_0{f} // {f === 0 ? 'SUB' : 'STRUCT'}</div>
                      
                      {/* Interactive Sensor Nodes on Schematic */}
                      <div className="relative w-full h-full">
                        {sensors.filter(s => s.floor === f).map((s, idx) => (
                          <div 
                            key={s.id}
                            className={`absolute w-4 h-4 rounded-full border-2 border-white/20 transition-all duration-500 cursor-pointer pointer-events-auto hover:scale-150 ${s.status === 'critical' ? 'bg-red-500 animate-pulse' : s.status === 'warning' ? 'bg-amber-500' : 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]'}`}
                            style={{ left: `${20 + (idx * 30)}%`, top: `${30 + (idx % 2 * 30)}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Energy Flow Visualization (Simulated) */}
                  {twinMode === 'energy' && (
                    <div className="absolute inset-x-12 inset-y-0 border-x border-sky-400/20 flex flex-col justify-around">
                       {[...Array(10)].map((_, i) => (
                         <div key={i} className="h-px bg-sky-400/40 w-full animate-pulse" />
                       ))}
                    </div>
                  )}
              </div>
           </div>

           {/* HUD UI Elements */}
           <div className="absolute inset-0 p-10 space-y-8 pointer-events-none">
              <div className="flex justify-between items-start">
                 <div className="space-y-3">
                    <div className="flex items-center gap-3">
                       <Badge className="bg-primary text-white border-none px-4 py-1.5 font-mono uppercase tracking-[0.3em] text-[10px] rounded-full shadow-lg shadow-primary/20">
                          HYPER-SYNC ACTIVE
                       </Badge>
                       <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono tracking-widest">
                          <Activity className="w-3 h-3 text-red-500" /> 1.2ms LATENCY
                       </div>
                    </div>
                    <h2 className="text-5xl font-black text-white italic tracking-tighter leading-none">AEC-TWIN™ <span className="text-primary not-italic font-light text-2xl ml-2 tracking-normal opacity-60">PRO_V2</span></h2>
                 </div>
                 
                 <div className="flex gap-4 pointer-events-auto">
                    {[
                      { id: "structural", label: "STRUCTURAL", icon: <Layers /> },
                      { id: "thermal", label: "THERMAL_MAP", icon: <Thermometer /> },
                      { id: "energy", label: "ENERGY_MESH", icon: <Zap /> }
                    ].map((mode) => (
                      <button 
                        key={mode.id}
                        onClick={() => setTwinMode(mode.id as any)}
                        className={`px-5 py-3 rounded-2xl border transition-all flex items-center gap-3 text-[10px] font-black tracking-widest ${twinMode === mode.id ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                         {mode.icon} {mode.label}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Advanced Controls HUD */}
              <div className="flex flex-col gap-4 pointer-events-auto w-48">
                 <div className="space-y-1">
                    <div className="text-[10px] font-black text-white/30 tracking-widest uppercase">Floor Navigation</div>
                    <div className="grid grid-cols-2 gap-2">
                       <Button variant="outline" onClick={() => setActiveFloor(prev => (prev < 4 ? prev + 1 : 4))} className="rounded-xl h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs font-black">LVL UP</Button>
                       <Button variant="outline" onClick={() => setActiveFloor(prev => (prev > 0 ? prev - 1 : 0))} className="rounded-xl h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs font-black">LVL DWN</Button>
                    </div>
                 </div>
              </div>

              {/* Float-HUD: Live Telemetry AR-Cards (High feature density) */}
              <div className="relative h-full">
                 {sensors.map((s, i) => (
                    <div 
                      key={s.id} 
                      className={`absolute pointer-events-auto transition-all duration-1000 ${s.floor === activeFloor ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-90 rotate-y-90'}`}
                      style={{ left: `${5 + (i * 18)}%`, top: `${25 + (i % 2 * 25)}%` }}
                    >
                       <Card className={`p-5 backdrop-blur-[32px] border-[1px] shadow-2xl min-w-[200px] hover:scale-105 transition-all cursor-pointer group rounded-[2rem] overflow-hidden ${s.status === 'critical' ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                          
                          <div className="flex items-center justify-between mb-4 relative">
                             <div className={`w-10 h-10 rounded-[1rem] flex items-center justify-center transition-all ${s.status === 'critical' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] text-white' : 'bg-primary/20 text-primary'}`}>
                                {s.type === 'temperature' ? <Thermometer className="w-5 h-5" /> : 
                                 s.type === 'stress' ? <Zap className="w-5 h-5" /> : 
                                 s.type === 'deflection' ? <Ruler className="w-5 h-5" /> :
                                 s.type === 'settlement' ? <ArrowDownToLine className="w-5 h-5" /> :
                                 <Activity className="w-5 h-5" />}
                             </div>
                             <div className="text-right">
                                <div className="text-[9px] font-mono text-white/40 leading-none">NODE_ID</div>
                                <div className="text-[11px] font-black text-white tracking-widest">{s.id}</div>
                             </div>
                          </div>

                          <div className="space-y-4 relative">
                             <div>
                                <div className="text-[10px] font-black text-white/60 mb-1 uppercase tracking-tight italic">Current {s.label}</div>
                                <div className="flex items-baseline gap-2">
                                   <div className="text-4xl font-black text-white tracking-tighter">{s.value.toFixed(2)}</div>
                                   <div className="text-xs font-black text-primary uppercase">{s.unit}</div>
                                </div>
                             </div>

                             <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                <div>
                                   <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Status</div>
                                   <div className={`text-[10px] font-black uppercase ${s.status === 'critical' ? 'text-red-500' : 'text-green-500'}`}>{s.status}</div>
                                </div>
                                <div className="text-right">
                                   <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Trend</div>
                                   <div className="text-[10px] font-black text-white flex items-center justify-end gap-1 uppercase">
                                      {s.trend === 'up' ? <TrendingUp className="w-3 h-3 text-red-500" /> : <TrendingDown className="w-3 h-3 text-green-500" />} {s.trend}
                                   </div>
                                </div>
                             </div>
                          </div>

                          {/* Mini Sparkline Chart Placeholder (Visual Decor) */}
                          <div className="mt-4 h-8 w-full flex items-end gap-0.5 opacity-40">
                             {[...Array(15)].map((_, i) => (
                               <div key={i} className={`flex-1 rounded-full ${s.status === 'critical' ? 'bg-red-500' : 'bg-primary'}`} style={{ height: `${Math.random() * 100}%` }} />
                             ))}
                          </div>
                       </Card>
                    </div>
                 ))}
              </div>
           </div>

           {/* Perspective Depth Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
        </Card>

        {/* Feature Grid: Detailed Site Analysis (10+ real-time features) */}
        <div className="grid md:grid-cols-4 gap-6">
           {[ 
             { icon: <Thermometer />, label: "Exothermic Pour Control", desc: "Concrete core @ 42.5°C. Hydration peak detected." },
             { icon: <Ruler />, label: "Deflection Mesh", desc: "Live beam sag: 1.2mm. within L/360 tolerance." },
             { icon: <ArrowDownToLine />, label: "Settlement Array", desc: "Sub-grade shift: 0.002mm/24h. Foundation locked." },
             { icon: <Waves />, label: "Spectral Vibration", desc: "HVAC Resonance @ 42Hz. AI-dampening active." }
           ].map((feat, i) => (
             <Card key={i} className="p-7 rounded-[2.5rem] bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 shadow-xl group hover:border-primary/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">{feat.icon}</div>
                <h4 className="font-black text-sm uppercase tracking-tighter italic mb-1">{feat.label}</h4>
                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase">{feat.desc}</p>
             </Card>
           ))}
        </div>
      </div>

      {/* Right Column: Alerts & AI Recommendations */}
      <div className="space-y-6">
         <Card className="p-8 rounded-[2.5rem] bg-white/50 dark:bg-black/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            <h3 className="text-xl font-black flex items-center gap-3">
               <Activity className="w-6 h-6 text-red-500" /> System Anomalies
            </h3>

            <div className="space-y-4">
               {sensors.filter(s => s.status !== 'normal' && s.status !== 'optimal').map(s => (
                 <div key={s.id} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                       <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-[8px]">{s.status.toUpperCase()}</Badge>
                       <span className="text-[10px] font-mono text-muted-foreground">{s.lastPing}</span>
                    </div>
                    <div className="font-black text-xs">{s.label} Deviation</div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">Threshold exceeded on LVL 0{s.floor}. AI recommends inspecting load-points immediately.</p>
                 </div>
               ))}
               {sensors.filter(s => s.status !== 'normal' && s.status !== 'optimal').length === 0 && (
                 <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                    <p className="text-xs font-bold text-green-600">All systems within AEC Tolerance</p>
                 </div>
               )}
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Concrete Curing Progress</span>
                     <span className="text-xs font-black text-primary">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
                     <Hammer className="w-5 h-5 text-indigo-500 mt-1 shrink-0" />
                     <p className="text-[10px] text-indigo-600/80 leading-relaxed font-bold italic">“AI projection: Final strength reaching 25MPa in 14h. Safe to remove formwork for Pillar-G4 at 08:00 tomorrow.”</p>
                  </div>
               </div>

               <Button className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <Ruler className="w-5 h-5" /> EXPORT AEC-TWIN DATA
               </Button>
            </div>
         </Card>

         <Card className="p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-black text-white space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50" />
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white/10 rounded-lg"><Cpu className="w-4 h-4" /></div>
               <h4 className="text-xs font-black italic tracking-widest uppercase">IoT Mesh v2.4</h4>
            </div>
            <p className="text-[10px] text-white/70 leading-relaxed font-medium">Auto-calibration of Strain Gauges in Sector 4 completed. Connectivity: 100%. Latency: 4ms. Zero-Packet loss verified.</p>
         </Card>
      </div>
    </div>
  )
}
