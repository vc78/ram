"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Compass, MapPin, Layers, Settings, AlertTriangle, CheckCircle2, LayoutGrid, Zap, LocateFixed, Sparkles } from "lucide-react"

type RoomType = "Kitchen" | "Bedroom" | "Pooja" | "Toilet" | "Living" | "Dining" | "Main Entrance" | "Master Bedroom" | "Empty";

export function GeoVastuEngine() {
  const [plot, setPlot] = useState({ width: 30, length: 40 })
  const [location, setLocation] = useState({ lat: 17.3850, long: 78.4867 }) // Default Hyderabad
  
  // 3x3 Grid state (row, col)
  const [grid, setGrid] = useState<RoomType[][]>([
    ["Toilet", "Bedroom", "Pooja"],
    ["Empty", "Living", "Empty"],
    ["Master Bedroom", "Main Entrance", "Kitchen"]
  ])

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runEngine = useCallback(async () => {
    // setLoading(true) // Omit for seamless typing/dragging feel
    try {
      // Map grid to coordinates
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
          layout_rooms
        })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Vastu Engine execution failed", error)
    } finally {
      setLoading(false)
    }
  }, [plot, location, grid])

  // Real-time evaluation triggers automatically
  useEffect(() => {
    const timer = setTimeout(() => {
      runEngine()
    }, 300) // 300ms debounce
    return () => clearTimeout(timer)
  }, [runEngine])

  const handleRoomChange = (r: number, c: number, newRoom: RoomType) => {
    const newGrid = [...grid];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (newGrid[i][j] === newRoom && newRoom !== "Empty" && newRoom !== "Bedroom") {
          newGrid[i][j] = "Empty";
        }
      }
    }
    newGrid[r][c] = newRoom;
    setGrid(newGrid);
  }

  const fetchExactLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        let errorMsg = "Unable to fetch your exact location.";
        if (error.code === 1) errorMsg = "Location access denied by user. Please allow location permissions in your browser.";
        else if (error.code === 2) errorMsg = "Location information is unavailable on this device.";
        else if (error.code === 3) errorMsg = "Location request timed out.";
        alert(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  const autoGenerateIdealLayout = () => {
    // Top Row: NW (Toilet), N (Main Entrance), NE (Pooja)
    // Middle Row: W (Dining), Center (Empty), E (Living)
    // Bottom Row: SW (Master Bedroom), S (Bedroom), SE (Kitchen)
    setGrid([
      ["Toilet", "Main Entrance", "Pooja"],
      ["Dining", "Empty", "Living"],
      ["Master Bedroom", "Bedroom", "Kitchen"]
    ]);
  }

  const roomOptions: RoomType[] = ["Empty", "Kitchen", "Pooja", "Toilet", "Living", "Dining", "Main Entrance", "Master Bedroom", "Bedroom"];

  return (
    <Card className="p-8 border border-border shadow-2xl rounded-[2rem] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-600 shadow-inner">
             <Compass className="w-8 h-8 animate-[spin_4s_linear_infinite]" />
          </div>
          <div>
             <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Geo-Vastu Visualizer</h3>
             <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Live Spatial & Magnetic Evaluation</p>
          </div>
        </div>
        <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-1 text-xs">SYNCHRONIZED</Badge>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PARAMS */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-4 p-6 rounded-3xl bg-white/50 dark:bg-black/20 backdrop-blur border border-slate-200 dark:border-slate-800 shadow-sm relative">
             <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-500"/><span className="font-black text-sm uppercase">Coordinates</span></div>
               <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/50" onClick={fetchExactLocation} title="Fetch Exact Location">
                 <LocateFixed className="w-3 h-3" />
               </Button>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                   <Label className="text-xs font-bold text-slate-500">Latitude</Label>
                   <Input type="number" step="0.0001" value={location.lat || ""} onChange={e => setLocation({...location, lat: e.target.value === "" ? 0 : parseFloat(e.target.value)})} className="h-10 rounded-xl bg-white dark:bg-slate-900" />
                </div>
                <div className="space-y-2">
                   <Label className="text-xs font-bold text-slate-500">Longitude</Label>
                   <Input type="number" step="0.0001" value={location.long || ""} onChange={e => setLocation({...location, long: e.target.value === "" ? 0 : parseFloat(e.target.value)})} className="h-10 rounded-xl bg-white dark:bg-slate-900" />
                </div>
             </div>
          </div>

          <div className="space-y-4 p-6 rounded-3xl bg-white/50 dark:bg-black/20 backdrop-blur border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex items-center gap-2 mb-2"><Layers className="w-5 h-5 text-emerald-500"/><span className="font-black text-sm uppercase">Dimensions</span></div>
             <div className="space-y-4">
                <div className="space-y-2">
                   <Label className="text-xs font-bold text-slate-500">Width (ft)</Label>
                   <Input type="number" value={plot.width || ""} onChange={e => setPlot({...plot, width: e.target.value === "" ? 0 : parseInt(e.target.value)})} className="h-10 rounded-xl bg-white dark:bg-slate-900" />
                </div>
                <div className="space-y-2">
                   <Label className="text-xs font-bold text-slate-500">Length (ft)</Label>
                   <Input type="number" value={plot.length || ""} onChange={e => setPlot({...plot, length: e.target.value === "" ? 0 : parseInt(e.target.value)})} className="h-10 rounded-xl bg-white dark:bg-slate-900" />
                </div>
             </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: VISUAL GRID */}
        <div className="lg:col-span-5 flex flex-col items-center">
           <div className="w-full max-w-sm aspect-square bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-xl border border-slate-200 dark:border-slate-800 relative">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest z-10">TRUE NORTH ({result?.true_north_offset || "0°"})</div>
             <div className="absolute top-1/2 -left-8 -translate-y-1/2 -rotate-90 text-[10px] font-black tracking-widest text-slate-400">WEST</div>
             <div className="absolute top-1/2 -right-8 translate-y-1/2 rotate-90 text-[10px] font-black tracking-widest text-slate-400">EAST</div>
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest text-slate-400">SOUTH</div>
             
             <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full relative">
               {grid.map((row, r) => (
                 row.map((cell, c) => (
                   <div key={`${r}-${c}`} className={`rounded-xl border-2 flex items-center justify-center relative group transition-all duration-300 ${cell === "Empty" ? "border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800" : "border-indigo-500 bg-indigo-500/10 shadow-sm"}`}>
                      <select 
                        value={cell} 
                        onChange={(e) => handleRoomChange(r, c, e.target.value as RoomType)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      >
                        {roomOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <span className={`text-[10px] font-black text-center px-1 pointer-events-none ${cell === "Empty" ? "text-slate-400" : "text-indigo-700 dark:text-indigo-400"}`}>
                        {cell === "Empty" ? "+" : cell}
                      </span>
                   </div>
                 ))
               ))}
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
                  <Compass className="w-full h-full" />
             </div>
           </div>
         </div>
           <Button 
             className="w-full mt-6 h-12 rounded-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20 transition-all gap-2" 
             onClick={autoGenerateIdealLayout}
           >
             <Sparkles className="w-5 h-5" />
             AUTO-GENERATE IDEAL LAYOUT
           </Button>
           <p className="text-xs text-muted-foreground mt-4 text-center font-bold">Click any quadrant to assign rooms manually or use AI Auto-Generation.</p>
        </div>

        {/* RIGHT COLUMN: OUTPUT VISUALIZATION */}
        <div className="lg:col-span-4 space-y-6">
           {result ? (
             <div className="space-y-6">
                
                {/* Score Card */}
                <Card className="p-8 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden flex items-center justify-between min-h-[140px]">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                   <div>
                     <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Compliance Score</h4>
                     <div className="flex items-end gap-2">
                       <span className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{result.score}</span>
                       <span className="text-xl font-bold text-slate-500 mb-1">/100</span>
                     </div>
                   </div>
                   <Badge className={`px-3 py-2 text-xs font-black uppercase tracking-widest ${result.score >= 90 ? 'bg-emerald-500 text-white' : result.score >= 70 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}>
                     {result.status}
                   </Badge>
                </Card>

                {/* Violations & Suggestions */}
                <Card className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-xl border border-white/20">
                   <h3 className="font-black text-sm mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-indigo-500"/> AI Recommendations</h3>
                   
                   <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {result.violations && result.violations.length > 0 && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                           <h4 className="text-[10px] font-black text-red-500 flex items-center gap-1 mb-2 tracking-widest"><AlertTriangle className="w-3 h-3"/> CRITICAL DOSHA</h4>
                           {result.violations.map((v: any, i: number) => (
                             <div key={i} className="text-xs font-bold text-slate-700 dark:text-slate-300">
                               • {v.room} in {v.current_zone}
                             </div>
                           ))}
                        </div>
                      )}

                      <div className="space-y-2">
                         {result.suggestions.map((s: string, i: number) => (
                           <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                             <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                             <p className="text-xs font-medium leading-relaxed">{s}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </Card>
             </div>
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
               <Zap className="w-8 h-8 text-slate-300 mb-4 animate-pulse" />
               <p className="font-bold text-slate-400 text-sm">Processing real-time spatial data...</p>
             </div>
           )}
        </div>

      </div>
    </Card>
  )
}
