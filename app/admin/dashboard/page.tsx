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
  Globe,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    total_users: 0,
    total_projects: 0,
    active_projects: 0,
    completed_projects: 0,
    total_revenue: 0,
    daily_active_users: 0,
    ai_designs: 0,
    reports_generated: 0,
    new_users_24h: 0,
    login_success_24h: 0,
    login_fail_24h: 0,
    online_users: 0,
    in_progress_projects: 0,
    avg_project_duration_days: 0,
  })

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user_name: "System Loading", action: "Fetching live signals...", timestamp: new Date().toISOString(), icon: Activity }
  ])

  useEffect(() => {
    async function loadStats() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`

        let statsRes = await fetch('/api/backend-proxy/admin/stats', { credentials: 'include', headers })
        if (!statsRes.ok) statsRes = await fetch('/api/admin/stats', { credentials: 'include', headers })
        if (statsRes.ok) {
          const data = await statsRes.json()
          setStatsData(data)
        }

        let logsRes = await fetch('/api/backend-proxy/admin/logs', { credentials: 'include', headers })
        if (!logsRes.ok) logsRes = await fetch('/api/admin/logs', { credentials: 'include', headers })
        if (logsRes.ok) {
          const logsData = await logsRes.json()
          const logs = logsData.logs || logsData.recent_logs || []
          if (logs.length > 0) {
            setRecentActivities(logs.slice(0, 5).map((l: any, i: number) => ({
              id: l.id || i,
              user_name: l.user_name || l.username || "System",
              action: l.action || `Activity`,
              timestamp: new Date(l.timestamp || l.created_at || Date.now()).toLocaleString(),
              icon: /design|layout|ai/i.test(l.action || "") ? Zap : /login|user/i.test(l.action || "") ? UserPlus : Activity
            })))
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
    { label: "New Users (24h)", value: statsData.new_users_24h, change: "+8%", icon: UserPlus, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Users (24h)", value: statsData.daily_active_users, change: "+11%", icon: Users, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Online Users", value: statsData.online_users, change: "+6%", icon: Globe, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10" },
    { label: "Project In Progress", value: statsData.in_progress_projects, change: "+7%", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Completed Projects", value: statsData.completed_projects, change: "+10%", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Revenue", value: `₹${statsData.total_revenue.toLocaleString()}`, change: "+7%", icon: FileText, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Avg Project Duration", value: `${statsData.avg_project_duration_days}d`, change: "-2%", icon: Clock, color: "text-lime-500", bg: "bg-lime-500/10" },
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

      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Advanced SIID Operational Analytics</h2>
            <p className="text-slate-400 text-sm">20+ industry-grade KPIs, logs, risk indicators and AI usage insights.</p>
          </div>
          <Button variant="outline" className="text-slate-300 border-slate-700 hover:border-slate-500">Refresh All</Button>
        </div>
        <AdvancedAnalyticsDashboard />
      </section>
    </div>
  )
}
