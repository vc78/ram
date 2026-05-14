"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Compass, MapPin, Layers, Settings, AlertTriangle, CheckCircle2, LayoutGrid, Zap, LocateFixed, Sparkles, Activity, ShieldCheck, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

type RoomType = "Kitchen" | "Bedroom" | "Pooja" | "Toilet" | "Living" | "Dining" | "Main Entrance" | "Master Bedroom" | "Bathroom" | "Study" | "Store" | "Staircase" | "Empty";

export function GeoVastuEngine() {
  const [plot, setPlot] = useState({ width: 30, length: 40 })
  const [location, setLocation] = useState({ lat: 17.3850, long: 78.4867 })
  const [sleepHead, setSleepHead] = useState("S")
  const [brahmasthan, setBrahmasthan] = useState("open")
  
  const [grid, setGrid] = useState<RoomType[][]>([
    ["Toilet", "Bedroom", "Pooja"],
    ["Dining", "Empty", "Living"],
    ["Master Bedroom", "Staircase", "Kitchen"]
  ])

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runEngine = useCallback(async () => {
    try {
      const layout_rooms: any[] = [];
      const cellWidth = plot.width / 3;
      const cellLength = plot.length / 3;

      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (grid[r][c] !== "Empty") {
            layout_rooms.push({
              type: grid[r][c],
              x: c * cellWidth,
              y: r * cellLength,
              width: cellWidth,
              length: cellLength
            });
          }
        }
      }

      const response = await fetch('/api/vastu-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plot_size: plot,
          location: location,
          layout_rooms,
          sleep_head: sleepHead,
          brahmasthan: brahmasthan
        })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Vastu Engine execution failed", error)
    } finally {
      setLoading(false)
    }
  }, [plot, location, grid, sleepHead, brahmasthan])

  useEffect(() => {
    const timer = setTimeout(() => {
      runEngine()
    }, 400)
    return () => clearTimeout(timer)
  }, [runEngine])

  const handleRoomChange = (r: number, c: number, newRoom: RoomType) => {
    const newGrid = [...grid];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (newGrid[i][j] === newRoom && !["Empty", "Bedroom", "Bathroom", "Toilet", "Study"].includes(newRoom)) {
          newGrid[i][j] = "Empty";
        }
      }
    }
    newGrid[r][c] = newRoom;
    setGrid(newGrid);
  }

  const fetchExactLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, long: pos.coords.longitude });
      setLoading(false);
    }, () => setLoading(false));
  }

  const autoGenerateIdealLayout = () => {
    setGrid([
      ["Toilet", "Empty", "Pooja"],
      ["Dining", "Empty", "Living"],
      ["Master Bedroom", "Staircase", "Kitchen"]
    ]);
    setSleepHead("S");
    setBrahmasthan("open");
  }

  const roomOptions: RoomType[] = ["Empty", "Kitchen", "Pooja", "Toilet", "Living", "Dining", "Main Entrance", "Master Bedroom", "Bedroom", "Bathroom", "Study", "Store", "Staircase"];

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "moderate": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "minor": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-green-500 bg-green-500/10 border-green-500/20";
    }
  }

  return (
    <Card className="p-6 md:p-10 border border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem] bg-background/50 backdrop-blur-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="p-5 bg-primary/10 rounded-3xl text-primary shadow-xl border border-primary/20">
             <Compass className="w-10 h-10 animate-[spin_8s_linear_infinite]" />
          </div>
            <div>
              <h3 className="text-xl font-bold">Geo-Vastu Analysis Engine</h3>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mt-0.5">
                Spatial Integrity Calibration v2.1
              </p>
            </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-xs font-semibold border border-green-500/20 flex items-center gap-2">
            <Activity className="w-4 h-4" /> LIVE SATELLITE FEED
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 relative z-10">
        
        {/* CONFIGURATION COLUMN */}
        <div className="lg:col-span-3 space-y-6">
          <section className="p-6 rounded-3xl bg-muted/30 border border-border shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <MapPin className="w-5 h-5 text-indigo-500"/>
               <span className="font-bold text-xs uppercase tracking-widest">Site Coordinates</span>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase text-muted-foreground">Latitude</Label>
                   <Input type="number" step="0.0001" value={location.lat} onChange={e => setLocation({...location, lat: parseFloat(e.target.value)})} className="h-11 rounded-2xl bg-background" />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase text-muted-foreground">Longitude</Label>
                   <Input type="number" step="0.0001" value={location.long} onChange={e => setLocation({...location, long: parseFloat(e.target.value)})} className="h-11 rounded-2xl bg-background" />
                </div>
                <Button variant="secondary" className="w-full h-11 rounded-2xl text-xs font-semibold gap-2" onClick={fetchExactLocation}>
                  <LocateFixed className="w-4 h-4" /> Auto-Detect GPS
                </Button>
             </div>
          </section>

          <section className="p-6 rounded-3xl bg-muted/30 border border-border shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <Settings className="w-5 h-5 text-primary"/>
               <span className="font-bold text-xs uppercase tracking-widest">Advanced Factors</span>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase text-muted-foreground">Sleep Head Orientation</Label>
                   <Select value={sleepHead} onValueChange={setSleepHead}>
                     <SelectTrigger className="h-11 rounded-2xl bg-background">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="S">South (Ideal)</SelectItem>
                       <SelectItem value="E">East (Recommended)</SelectItem>
                       <SelectItem value="W">West (Neutral)</SelectItem>
                       <SelectItem value="N">North (Avoid)</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase text-muted-foreground">Brahmasthan Status</Label>
                   <Select value={brahmasthan} onValueChange={setBrahmasthan}>
                     <SelectTrigger className="h-11 rounded-2xl bg-background">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="open">Open (Positive)</SelectItem>
                       <SelectItem value="blocked">Blocked (Negative)</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
             </div>
          </section>
        </div>

        {/* VISUALIZER COLUMN */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
           <div className="aspect-square bg-muted/20 rounded-3xl sm:rounded-[3.5rem] p-4 sm:p-6 shadow-inner border border-border/50 relative flex items-center justify-center">
             <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-semibold tracking-wider z-20">TRUE NORTH ({result?.true_north_offset || "0°"})</div>
             <div className="absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 text-[8px] sm:text-[9px] font-semibold tracking-widest text-muted-foreground/30">WEST</div>
             <div className="absolute top-1/2 right-2 -translate-y-1/2 rotate-90 text-[8px] sm:text-[9px] font-semibold tracking-widest text-muted-foreground/30">EAST</div>
             <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-semibold tracking-widest text-muted-foreground/30">SOUTH</div>
             
             <div className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 w-full h-full relative">
               {grid.map((row, r) => (
                 row.map((cell, c) => (
                   <div key={`${r}-${c}`} className={`rounded-xl sm:rounded-3xl border-2 transition-all duration-500 relative overflow-hidden group flex items-center justify-center ${cell === "Empty" ? "border-dashed border-border hover:bg-primary/5" : "border-primary bg-primary/5 shadow-lg shadow-primary/10"}`}>
                      <select 
                        value={cell} 
                        onChange={(e) => handleRoomChange(r, c, e.target.value as RoomType)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      >
                        {roomOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <div className="flex flex-col items-center gap-1 p-1 sm:p-2 pointer-events-none transition-transform group-hover:scale-110">
                        <span className={`text-[7px] sm:text-[9px] font-semibold uppercase text-center leading-tight ${cell === "Empty" ? "text-muted-foreground/50" : "text-primary"}`}>
                          {cell === "Empty" ? "+" : cell}
                        </span>
                      </div>
                   </div>
                 ))
               ))}
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
                  <Compass className="w-[80%] h-[80%]" />
               </div>
             </div>
           </div>
           
           <div className="flex gap-2 sm:gap-4">
              <Button 
               className="flex-1 h-12 sm:h-14 rounded-2xl sm:rounded-3xl font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-xl transition-all gap-2 text-xs sm:text-sm" 
               onClick={autoGenerateIdealLayout}
             >
               <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
               <span className="hidden sm:inline">GENERATE OPTIMAL</span>
               <span className="sm:hidden">GENERATE</span>
             </Button>
             <Button variant="outline" className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl sm:rounded-3xl border-border shrink-0" onClick={runEngine}>
               <Activity className="w-5 h-5" />
             </Button>
           </div>
        </div>

        {/* ANALYTICS COLUMN */}
        <div className="lg:col-span-4 space-y-6">
           <AnimatePresence mode="wait">
             {result ? (
               <motion.div 
                 key="result"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
               >
                 {/* Analysis Summary Header */}
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <Card className="p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] bg-slate-900 dark:bg-slate-800 text-white flex flex-col items-center justify-center shadow-2xl border-none">
                         <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Grade</span>
                         <span className="text-4xl sm:text-7xl font-black text-primary leading-none">{result.grade}</span>
                      </Card>
                      <Card className="p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] bg-primary text-white flex flex-col items-center justify-center shadow-2xl border-none">
                         <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Score</span>
                         <span className="text-2xl sm:text-4xl font-black">{result.score}%</span>
                      </Card>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                         <div className="text-base sm:text-xl font-bold text-red-500">{result.critical}</div>
                         <div className="text-[7px] sm:text-[8px] font-black uppercase text-red-500/70">Crit</div>
                      </div>
                      <div className="flex-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                         <div className="text-base sm:text-xl font-bold text-amber-500">{result.moderate}</div>
                         <div className="text-[7px] sm:text-[8px] font-black uppercase text-amber-500/70">Mod</div>
                      </div>
                      <div className="flex-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                         <div className="text-base sm:text-xl font-bold text-blue-500">{result.minor}</div>
                         <div className="text-[7px] sm:text-[8px] font-black uppercase text-blue-500/70">Minor</div>
                      </div>
                    </div>
                 </div>

                 {/* Remedy Feed */}
                 <Card className="p-8 rounded-[2.5rem] bg-muted/20 border border-border shadow-xl h-[450px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                       <h4 className="text-sm font-bold uppercase flex items-center gap-2">
                         <ShieldCheck className="w-5 h-5 text-emerald-500" /> Vastu Remedies
                       </h4>
                       <Info className="w-4 h-4 text-muted-foreground opacity-50 cursor-pointer" />
                    </div>
                    
                    <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                       {result.defects.map((d: any, i: number) => (
                         <div key={i} className="p-5 rounded-3xl bg-background border border-border shadow-sm group hover:border-primary/50 transition-all">
                            <div className="flex items-center justify-between mb-2">
                               <Badge className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${getSeverityColor(d.severity)}`}>
                                 {d.severity}
                               </Badge>
                               <span className="text-[8px] font-bold text-muted-foreground opacity-50 uppercase">#{i+1}</span>
                            </div>
                            <p className="text-xs font-bold text-foreground mb-3 leading-relaxed">{d.defect}</p>
                            {d.recommendation && (
                              <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-2">
                                 <Sparkles className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                                 <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 italic leading-relaxed">
                                   Remedy: {d.recommendation}
                                 </p>
                              </div>
                            )}
                         </div>
                       ))}
                       {result.defects.length === 0 && (
                         <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-50">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                            <p className="text-sm font-bold uppercase tracking-widest">Perfect Layout</p>
                            <p className="text-[10px] mt-2 font-semibold">No structural or directional defects detected.</p>
                         </div>
                       )}
                    </div>
                 </Card>
               </motion.div>
             ) : (
               <div key="loading" className="h-full min-h-[600px] flex flex-col items-center justify-center p-12 border-4 border-dashed border-muted rounded-[3rem]">
                 <Label htmlFor="ml-mode" className="cursor-pointer">
                  <span className="block text-sm font-bold uppercase">ML Calibrated Engine</span>
                  <span className="text-[10px] text-muted-foreground font-semibold italic">Powered by GradientBoosted-Vastu-Core-v2.1</span>
                </Label>
               </div>
             )}
           </AnimatePresence>
        </div>

      </div>
    </Card>
  )
}
