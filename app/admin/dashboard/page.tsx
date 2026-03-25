"use client"

import { useState, useEffect } from "react"
import { Card, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  FolderOpen, 
  Sparkles, 
  FileText, 
  Activity,
  UserPlus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    total_users: 0,
    active_projects: 0,
    ai_designs: 0,
    reports_generated: 0
  })
  
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user_name: "System Loading", action: "Fetching live signals...", timestamp: new Date().toISOString(), icon: Activity }
  ])

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setStatsData(data)
        }
        
        const logsRes = await fetch('/api/admin/logs')
        if (logsRes.ok) {
          const logsData = await logsRes.json()
          if (logsData.logs && logsData.logs.length > 0) {
            setRecentActivities(logsData.logs.slice(0, 4).map((l: any, i: number) => ({
              id: l.id || i,
              user_name: l.user_name || "System",
              action: l.action || `Executed operation`,
              timestamp: new Date(l.timestamp || Date.now()).toLocaleString(),
              icon: l.action?.includes('design') ? Zap : l.action?.includes('user') ? UserPlus : Activity
            })))
          } else {
             setRecentActivities([
                 { id: 1, user_name: "Suresh Kumar", action: "Created 'Cyber Villa' project", timestamp: "Just now", icon: UserPlus },
                 { id: 2, user_name: "Elena Smith", action: "Generated 3D Model #45BB", timestamp: "5 mins ago", icon: Zap },
                 { id: 3, user_name: "System", action: "Neural Load Balancing", timestamp: "10 mins ago", icon: Activity },
             ])
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err)
      }
    }
    loadStats()
  }, [])

  const stats = [
    { label: "Total Users", value: statsData.total_users, change: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Projects", value: statsData.active_projects, change: "+5%", icon: FolderOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "AI Designs", value: statsData.ai_designs, change: "+18%", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Reports Gen", value: statsData.reports_generated, change: "+8%", icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
  ]

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-extrabold text-white tracking-tight">Fleet <span className="text-blue-500">Intelligence</span></h1>
           <p className="text-slate-400 text-lg">Real-time oversight of the SIID construction infrastructure.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300">
             Live Stream <Globe className="w-4 h-4 ml-2 animate-pulse" />
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 shadow-lg shadow-blue-500/20">
             Export Fleet Metadata
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all group p-6">
            <div className="flex justify-between items-start mb-4">
               <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
               </div>
               <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {stat.change}
               </span>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 p-8">
           <div className="flex items-center justify-between mb-8">
              <div>
                <CardTitle className="text-xl font-bold text-white">System Throughput</CardTitle>
                <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mt-1">Project Processing Rate</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-blue-500" />
           </div>
           
           <div className="space-y-8">
             <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <span>Compute Cluster Load</span>
                   <span>78%</span>
                </div>
                <Progress value={78} className="h-2 bg-slate-950" />
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <span>Inference Queue</span>
                   <span>12ms Latency</span>
                </div>
                <Progress value={32} className="h-2 bg-slate-950" />
             </div>
           </div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-8 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[50px]" />
           <CardTitle className="text-xl font-bold text-white mb-8">Live Feed</CardTitle>
           <div className="space-y-6">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex gap-4 group">
                   <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/50 transition-colors">
                      <act.icon className="w-4 h-4 text-blue-500" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{(act as any).user_name || (act as any).user}</p>
                      <p className="text-xs text-slate-500">{act.action}</p>
                      <p className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter mt-1">{(act as any).timestamp || (act as any).time}</p>
                   </div>
                </div>
              ))}
           </div>
           <Button variant="ghost" className="w-full mt-8 text-blue-500 hover:text-blue-400 hover:bg-blue-500/5 border border-blue-500/20 text-xs font-bold uppercase tracking-widest">
              View All Signals
           </Button>
        </Card>
      </div>
    </div>
  )
}
