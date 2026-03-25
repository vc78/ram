"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  FolderOpen, 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  Clock,
  LayoutGrid,
  List,
  MoreVertical,
  ArrowUpRight,
  Zap,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ProjectMonitoring() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/admin/projects')
        if (res.ok) {
          const data = await res.json()
          if (data.projects && data.projects.length > 0) {
            setProjects(data.projects.map((p: any) => ({
              id: p.id,
              name: p.name || "Untitled",
              user: p.user_name || "Unknown",
              location: p.location || "N/A",
              progress: p.progress || Math.floor(Math.random() * 100),
              complexity: "Medium",
              health: "Optimal",
              type: p.type || "Building",
              deadline: p.deadline || "2024-12-31"
            })))
          } else {
            setProjects([
              { id: 1, name: "Modern Villa G+2", user: "Suresh Kumar", location: "Hyderabad", progress: 65, complexity: "High", health: "Optimal", type: "Residential", deadline: "2024-08-15" },
              { id: 2, name: "SIID Office HQ", user: "Internal", location: "Bangalore", progress: 25, complexity: "Extreme", health: "Warning", type: "Commercial", deadline: "2025-01-10" },
              { id: 3, name: "Urban Apartment Node", user: "RealScape Ltd", location: "Mumbai", progress: 85, complexity: "Medium", health: "Optimal", type: "Apartment", deadline: "2024-05-22" },
            ])
          }
        }
      } catch (err) {
        console.error("Failed to load projects", err)
      }
    }
    loadProjects()
  }, [])

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-extrabold text-white tracking-tight">Project <span className="text-blue-500">Fleet</span></h1>
           <p className="text-slate-400 text-lg">Sub-orbital view of all active architectural deployments.</p>
        </div>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
           <Button 
             variant="ghost" 
             size="sm" 
             onClick={() => setViewMode("grid")}
             className={`rounded-lg h-10 w-10 p-0 ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-500"}`}
           >
             <LayoutGrid className="w-5 h-5" />
           </Button>
           <Button 
             variant="ghost" 
             size="sm" 
             onClick={() => setViewMode("list")}
             className={`rounded-lg h-10 w-10 p-0 ${viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-500"}`}
           >
             <List className="w-5 h-5" />
           </Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input 
              placeholder="Search by instance name, GPS, or operator..." 
              className="pl-12 bg-slate-900 border-slate-800 text-white h-14 rounded-2xl focus:ring-blue-500" 
            />
         </div>
         <Button variant="outline" className="h-14 border-slate-800 bg-slate-900/50 text-slate-300 rounded-2xl px-8">
            <Filter className="w-4 h-4 mr-2" /> All Filters
         </Button>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
        {projects.map((proj) => (
          <Card key={proj.id} className="bg-slate-900 border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all group">
             <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{proj.name}</h3>
                        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-blue-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                         <Building2 className="w-3 h-3" /> {proj.type}
                      </p>
                   </div>
                   <Badge className={proj.health === 'Optimal' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}>
                      {proj.health}
                   </Badge>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>Sync Progress</span>
                      <span>{proj.progress}%</span>
                   </div>
                   <Progress value={proj.progress} className="h-2 bg-slate-950" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">OPERATOR</p>
                      <p className="text-xs font-bold text-white uppercase">{proj.user}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">DEADLINE</p>
                      <p className="text-xs font-bold text-white uppercase">{proj.deadline}</p>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                   <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                      <MapPin className="w-3 h-3" /> {proj.location}
                   </div>
                   <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10"><CheckCircle2 className="w-5 h-5" /></Button>
                      <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800"><MoreVertical className="w-5 h-5" /></Button>
                   </div>
                </div>
             </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
