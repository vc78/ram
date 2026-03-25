"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target, 
  Cpu, 
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  History,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminAnalytics() {
  const metrics = [
    { label: "Neural Load", val: "84.2%", delta: "+5.1%", up: true, icon: Cpu, color: "text-blue-500" },
    { label: "Data Pipeline", val: "1.2 TB/s", delta: "-2.4%", up: false, icon: Database, color: "text-purple-500" },
    { label: "Inference Speed", val: "12ms", delta: "+15%", up: true, icon: Zap, color: "text-amber-500" },
    { label: "Success Rate", val: "99.98%", delta: "+0.02%", up: true, icon: Target, color: "text-emerald-500" },
  ]

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
             <Download className="w-4 h-4 mr-2" /> Data Dump
           </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <Card key={m.label} className="bg-slate-900 border-slate-800 p-8 hover:border-slate-700 transition-all group">
             <div className={`w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center mb-6 ${m.color} group-hover:scale-110 transition-transform`}>
                <m.icon className="w-6 h-6" />
             </div>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{m.label}</p>
             <h3 className="text-3xl font-bold text-white tracking-tight mb-4">{m.val}</h3>
             <div className={`flex items-center gap-1 text-xs font-bold ${m.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {m.delta}
                <span className="text-slate-500 font-normal ml-1 uppercase">vs avg</span>
             </div>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900 border-slate-800 p-8 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] -z-10" />
         <div className="flex items-center justify-between mb-12">
            <div>
               <h4 className="text-xl font-bold text-white">Synthesis Efficiency</h4>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time throughput matrix</p>
            </div>
            <Activity className="w-6 h-6 text-blue-500" />
         </div>
         <div className="h-64 flex items-end gap-2">
            {[40, 65, 45, 90, 65, 55, 80, 45, 70, 85, 40, 60, 95, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-600/20 border-t border-blue-500/50 rounded-t-lg transition-all hover:bg-blue-600/40 relative group" style={{ height: `${h}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                 </div>
              </div>
            ))}
         </div>
      </Card>
    </div>
  )
}
