"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Box, 
  ArrowLeft, 
  Settings, 
  Maximize, 
  Layers, 
  Eye, 
  Video,
  Sun,
  Camera,
  Download,
  Share2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"

export default function RenderInterfacePage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState("3d")

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        {/* Header */}
        <header className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl px-8 flex items-center justify-between z-50">
          <div className="flex items-center gap-6">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="text-slate-400 hover:text-white"
            >
                <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="h-10 w-px bg-slate-800 mx-2" />
            <div>
               <h1 className="text-xl font-bold text-white tracking-tight uppercase">Rendering Engine <span className="text-blue-500 font-mono text-sm ml-2">v2.1</span></h1>
               <div className="flex items-center gap-2 mt-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Compute Active</span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
               <button 
                 onClick={() => setViewMode("3d")}
                 className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === "3d" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-slate-300"}`}
               >
                 3D Mode
               </button>
               <button 
                 onClick={() => setViewMode("blueprints")}
                 className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === "blueprints" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-slate-300"}`}
               >
                 Specs
               </button>
            </div>
            <Button className="bg-white text-slate-950 hover:bg-slate-200">
               <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
           {/* Sidebar Tools */}
           <aside className="w-20 border-r border-slate-800 bg-slate-900/30 flex flex-col items-center py-8 gap-8">
              <ToolIcon icon={Layers} active />
              <ToolIcon icon={Sun} />
              <ToolIcon icon={Camera} />
              <ToolIcon icon={Video} />
              <div className="mt-auto">
                 <ToolIcon icon={Settings} />
              </div>
           </aside>

           {/* Viewport */}
           <main className="flex-1 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 shadow-inner">
              <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10 pointer-events-none" />
              
              {/* Overlay Indicators */}
              <div className="absolute top-8 left-8 space-y-4">
                 <Badge variant="outline" className="bg-slate-950/80 backdrop-blur border-slate-800 text-slate-400 py-2 px-4 flex gap-3">
                    <span className="text-blue-500 font-bold">FPS:</span> 60.2
                    <span className="text-blue-500 font-bold ml-2">LATENCY:</span> 12ms
                 </Badge>
              </div>

              <div className="absolute bottom-8 right-8 flex gap-3">
                 <Button variant="outline" className="bg-slate-950/80 border-slate-800 hover:bg-slate-900">
                    <Maximize className="w-4 h-4" />
                 </Button>
                 <Button variant="outline" className="bg-slate-950/80 border-slate-800 hover:bg-slate-900">
                    <Share2 className="w-4 h-4" />
                 </Button>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                 <Box className="w-48 h-48 text-blue-500/20 animate-spin-slow" />
                 <p className="absolute mt-64 text-sm font-bold text-slate-500 uppercase tracking-[0.3em]">Synthesizing Topology...</p>
              </div>
           </main>

           {/* Right Panel */}
           <aside className="w-80 border-l border-slate-800 bg-slate-900/30 p-8 space-y-8">
              <section className="space-y-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Properties</h3>
                 <div className="space-y-3">
                    <PropItem label="Polygon Count" val="2.4M" />
                    <PropItem label="Textures" val="8K HDR" />
                    <PropItem label="Light Source" val="Dynamic" />
                 </div>
              </section>

              <section className="space-y-4">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Materials</h3>
                 <div className="grid grid-cols-4 gap-2">
                    {[1,2,3,4,5,6].map(i => (
                       <div key={i} className="aspect-square bg-slate-800 rounded-lg hover:border-blue-500 border border-transparent transition-all cursor-pointer shadow-inner" />
                    ))}
                 </div>
              </section>
           </aside>
        </div>
      </div>
    </AuthGuard>
  )
}

function ToolIcon({ icon: Icon, active = false }: any) {
    return (
        <button className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
            <Icon className="w-5 h-5" />
        </button>
    )
}

function PropItem({ label, val }: any) {
    return (
        <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 transition-all hover:border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
            <span className="text-xs font-mono text-slate-200">{val}</span>
        </div>
    )
}
