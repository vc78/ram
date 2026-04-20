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
  Trash2,
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
  const [searchTerm, setSearchTerm] = useState("")
  const [projectStats, setProjectStats] = useState({
    total: 0,
    residential: 0,
    commercial: 0,
    draft: 0,
    completed: 0,
    average_cost: 0,
    locations: {} as Record<string, number>
  })

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateProjectStats = (list: any[]) => {
    const total = list.length
    const residential = list.filter((p) => p.type?.toLowerCase().includes("residential")).length
    const commercial = list.filter((p) => p.type?.toLowerCase().includes("commercial")).length
    const draft = list.filter((p) => p.status?.toLowerCase() === "draft").length
    const completed = list.filter((p) => p.status?.toLowerCase() === "completed").length
    const costValues = list.map((p) => Number(p.estimation?.budgetRange?.max || p.estimated_cost || 0)).filter((v) => !Number.isNaN(v))
    const average_cost = costValues.length ? +(costValues.reduce((sum, v) => sum + v, 0) / costValues.length).toFixed(2) : 0
    const locations = list.reduce((acc: Record<string, number>, p) => {
      const loc = (p.location || "Unknown").toString()
      acc[loc] = (acc[loc] || 0) + 1
      return acc
    }, {})
    return { total, residential, commercial, draft, completed, average_cost, locations }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${projectId}`, { method: 'DELETE' })
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId))
      }
    } catch (err) {
      console.error("Failed to delete project", err)
    }
  }

  useEffect(() => {
    async function loadProjects() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`

        let res = await fetch('/api/backend-proxy/admin/projects', { credentials: 'include', headers })
        if (!res.ok) res = await fetch('/api/admin/projects', { credentials: 'include', headers })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            const mapped = data.map((p: any) => ({
              id: p.id,
              name: p.project_name || p.name || "Untitled",
              user: p.user_name || "Unknown",
              location: p.location || "N/A",
              progress: p.progress || p.percentage || Math.floor(Math.random() * 100),
              complexity: "Medium",
              health: "Optimal",
              type: (p.building_type || p.type || "Building").toString(),
              status: p.status || "active",
              estimated_cost: Number(p.estimation?.budgetRange?.max || 0),
              deadline: p.deadline || "2024-12-31"
            }))
            setProjects(mapped)
            setProjectStats(calculateProjectStats(mapped))
          } else {
            const fallbackProjects = [
              { id: 1, name: "Modern Villa G+2", user: "Suresh Kumar", location: "Hyderabad", progress: 65, complexity: "High", health: "Optimal", type: "Residential", deadline: "2024-08-15", status: "completed", estimated_cost: 52 },
              { id: 2, name: "SIID Office HQ", user: "Internal", location: "Bangalore", progress: 25, complexity: "Extreme", health: "Warning", type: "Commercial", deadline: "2025-01-10", status: "active", estimated_cost: 120 },
              { id: 3, name: "Urban Apartment Node", user: "RealScape Ltd", location: "Mumbai", progress: 85, complexity: "Medium", health: "Optimal", type: "Residential", deadline: "2024-05-22", status: "draft", estimated_cost: 80 },
            ]
            setProjects(fallbackProjects)
            setProjectStats(calculateProjectStats(fallbackProjects))
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Total Projects</p>
          <p className="text-3xl font-bold text-white">{projectStats.total}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Residential</p>
          <p className="text-3xl font-bold text-white">{projectStats.residential}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Commercial</p>
          <p className="text-3xl font-bold text-white">{projectStats.commercial}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Completed</p>
          <p className="text-3xl font-bold text-white">{projectStats.completed}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, user, or location..."
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
                  <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10" title="View details"><CheckCircle2 className="w-5 h-5" /></Button>
                  <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-500/10" onClick={() => deleteProject(proj.id)} title="Delete project"><Trash2 className="w-5 h-5" /></Button>
                  <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800" title="More actions"><MoreVertical className="w-5 h-5" /></Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
