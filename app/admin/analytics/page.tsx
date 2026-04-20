"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  BarChart3,
  Zap,
  Target,
  Cpu,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  History,
  Download,
  Users,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts"

const COLORS = ["#60a5fa", "#34d399", "#facc15", "#a78bfa", "#f97316"]

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`

        let res = await fetch('/api/backend-proxy/admin/analytics', { credentials: 'include', headers })
        if (!res.ok) res = await fetch('/api/admin/analytics', { credentials: 'include', headers })
        if (res.ok) {
          const data = await res.json()
          setAnalytics(data)
        }
      } catch (err) {
        console.error("Failed to load admin analytics", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="min-h-[60vh] flex items-center justify-center text-red-400">Unable to load analytics data.</div>
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Core <span className="text-blue-500">Analytics</span></h1>
          <p className="text-slate-400 text-lg">Detailed telemetry of neural synthesis and project throughput.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-800 bg-slate-900 shadow-xl text-slate-300">
            <History className="w-4 h-4 mr-2" /> 24h Log
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 shadow-lg shadow-blue-500/20">
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4"><Cpu className="w-5 h-5 text-blue-400" /><p className="text-xs text-slate-400 uppercase tracking-widest">AI Predictions</p></div>
          <h3 className="text-3xl font-bold text-white">{analytics.ai_predictions || 0}</h3>
          <p className="text-xs text-slate-500">Total model predictions</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4"><Users className="w-5 h-5 text-green-400" /><p className="text-xs text-slate-400 uppercase tracking-widest">New Users (24h)</p></div>
          <h3 className="text-3xl font-bold text-white">{analytics.new_users_24h || 0}</h3>
          <p className="text-xs text-slate-500">New registrations in last day</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4"><History className="w-5 h-5 text-cyan-400" /><p className="text-xs text-slate-400 uppercase tracking-widest">Login Success (24h)</p></div>
          <h3 className="text-3xl font-bold text-white">{analytics.login_success_24h || 0}</h3>
          <p className="text-xs text-slate-500">Successful login events</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4"><AlertCircle className="w-5 h-5 text-red-400" /><p className="text-xs text-slate-400 uppercase tracking-widest">Failed Logins (24h)</p></div>
          <h3 className="text-3xl font-bold text-white">{analytics.login_fail_24h || 0}</h3>
          <p className="text-xs text-slate-500">Invalid credential attempts</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4"><Database className="w-5 h-5 text-purple-400" /><p className="text-xs text-slate-400 uppercase tracking-widest">Material Estimator</p></div>
          <h3 className="text-3xl font-bold text-white">{analytics.ai_feature_usage?.["Material Estimator"] || 0}</h3>
          <p className="text-xs text-slate-500">Call count</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4"><Target className="w-5 h-5 text-yellow-400" /><p className="text-xs text-slate-400 uppercase tracking-widest">Vastu Analyzer</p></div>
          <h3 className="text-3xl font-bold text-white">{analytics.ai_feature_usage?.["Vastu Analyzer"] || 0}</h3>
          <p className="text-xs text-slate-500">Call count</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4"><Zap className="w-5 h-5 text-emerald-400" /><p className="text-xs text-slate-400 uppercase tracking-widest">Layout Generator</p></div>
          <h3 className="text-3xl font-bold text-white">{analytics.ai_feature_usage?.["Layout Generator"] || 0}</h3>
          <p className="text-xs text-slate-500">Call count</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <CardHeader><CardTitle className="text-white">Projects Created (12 months)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.projects_per_month || []} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                <Legend />
                <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <CardHeader><CardTitle className="text-white">Project Type Distribution</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.project_types || []} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={90} label>
                  {(analytics.project_types || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <CardHeader><CardTitle className="text-white">User Growth</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.user_growth || []} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={3} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <CardHeader><CardTitle className="text-white">AI Usage Trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.ai_usage_trend || []} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                <Area type="monotone" dataKey="value" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

