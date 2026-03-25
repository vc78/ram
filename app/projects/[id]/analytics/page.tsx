"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowLeft,
  ChevronRight,
  Milestone,
  History
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { AuthGuard } from "@/components/auth-guard"

export default function AnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<"timeline" | "risks" | "budget">("timeline")

  const phases = [
    { title: "Site Preparation", status: "Completed", progress: 100, team: "Excavation A", date: "Mar 01 - Mar 10" },
    { title: "Foundation & Footing", status: "In Progress", progress: 45, team: "Concrete B", date: "Mar 12 - Mar 25" },
    { title: "Column Setup", status: "Upcoming", progress: 0, team: "Steel C", date: "Mar 28 - Apr 15" }
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-12">
            <div className="space-y-4">
               <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={() => router.back()}
                   className="text-slate-400 hover:text-white -ml-4"
               >
                   <ArrowLeft className="w-6 h-6" />
               </Button>
               <h1 className="text-4xl font-bold text-white flex items-center gap-4">
                 <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                   <TrendingUp className="w-8 h-8 text-white" />
                 </div>
                 Timeline Forecast <span className="text-blue-500">v2.4</span>
               </h1>
               <p className="text-slate-400 max-w-2xl text-lg">Predictive schedule analysis and risk mitigation matrix powered by historical construction data.</p>
            </div>
            
            <div className="flex gap-4">
               <Button variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300">
                 <History className="w-4 h-4 mr-2" /> History
               </Button>
               <Button 
                 onClick={() => router.push(`/material-calculator/${params.id}`)}
                 className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 px-8"
               >
                 Final Audit <ChevronRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <KpiCard label="Overall Progress" val="24%" icon={TrendingUp} color="text-blue-500" />
             <KpiCard label="Delay Risk" val="LOW" color="text-emerald-500" icon={AlertTriangle} />
             <KpiCard label="Projected End" val="Oct 2026" color="text-amber-500" icon={Calendar} />
             <KpiCard label="Burn Rate" val="0.85x" color="text-purple-500" icon={DollarSign} />
          </div>

          <div className="grid lg:grid-cols-[1fr_350px] gap-8 pt-6">
             <div className="space-y-8">
                <nav className="flex gap-4 p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit">
                   {["timeline", "risks", "budget"].map((tab) => (
                     <button 
                       key={tab}
                       onClick={() => setActiveTab(tab as any)} 
                       className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                     >
                       {tab}
                     </button>
                   ))}
                </nav>

                <div className="space-y-4">
                   {phases.map((phase, i) => (
                     <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:border-slate-700 hover:bg-slate-900/80 transition-all group">
                        <div className="space-y-4 flex-1">
                           <div className="flex items-center gap-4">
                              <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{phase.title}</h4>
                              <Badge className={phase.status === "Completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"}>
                                 {phase.status}
                              </Badge>
                           </div>
                           <div className="flex flex-wrap gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                              <span className="flex items-center gap-2"><Users className="w-3 h-3" /> TEAM: {phase.team}</span>
                              <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> WINDOW: {phase.date}</span>
                           </div>
                        </div>
                        
                        <div className="w-full md:w-64 space-y-3">
                           <div className="flex justify-between items-end mb-1">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Confidence</span>
                              <span className="text-sm font-mono text-white tracking-widest">{phase.progress}%</span>
                           </div>
                           <Progress value={phase.progress} className="h-2 bg-slate-950" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <aside className="space-y-8">
                <Card className="bg-slate-900 border-slate-800 p-8 space-y-6">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-4">AI Insight Engine</h4>
                   <div className="space-y-4">
                      <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
                         <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Delay Probabilty</p>
                         <p className="text-3xl font-bold text-white tracking-tight">0.02<span className="text-sm text-blue-500 ml-1">%</span></p>
                      </div>
                      <p className="text-sm text-slate-400 italic leading-relaxed">
                        "We recommend shifting G-Floor wall masonry by 2 days to avoid overlap with heavy monsoon forecast on Mar 24th."
                      </p>
                      <Button variant="outline" className="w-full border-blue-600/30 text-blue-400 hover:bg-blue-600/10">Approve Shift</Button>
                   </div>
                </Card>

                <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-slate-800 p-8 space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                         <Milestone className="w-5 h-5 text-blue-400" />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Next Milestone</h4>
                   </div>
                   <p className="text-sm font-medium text-slate-300">Foundation Completion Audit scheduled for April 12th.</p>
                </Card>
             </aside>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

function KpiCard({ label, val, color, icon: Icon }: any) {
    return (
        <Card className="bg-slate-900 border-slate-800 p-8 group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
               <div className={`p-4 rounded-2xl bg-slate-950 ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
               </div>
            </div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{val}</h3>
        </Card>
    )
}
