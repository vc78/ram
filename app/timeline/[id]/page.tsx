"use client"

import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, UserCheck, Activity, BarChart3, AlertCircle } from "lucide-react"

export default function ProjectTimelineTracking() {
  const params = useParams()
  const projectId = params.id as string

  // Mock Modules data tracking
  const phases = [
    { title: "Foundation & Excavation", progress: 100, status: "completed", team: "Alpha Diggers" },
    { title: "Structural Framing (Steel/Concrete)", progress: 65, status: "active", team: "Core Eng." },
    { title: "Plumbing & Electrical Nodes", progress: 0, status: "pending", team: "SysTech" },
    { title: "Exterior Facade", progress: 0, status: "pending", team: "DesignOps" },
    { title: "Interior Finishing", progress: 0, status: "pending", team: "TBD" },
  ]

  return (
    <div className="container max-w-4xl mx-auto py-20 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex justify-center items-center gap-3">
          <Calendar className="w-8 h-8 text-amber-500" /> Module 8: Project Timeline
        </h1>
        <p className="text-muted-foreground">Monitor lifecycle execution metrics, delays, and task assignments dynamically.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
         <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-emerald-500/20">
            <Activity className="w-5 h-5 text-emerald-500 mb-2" />
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Total Completion</p>
            <p className="text-3xl font-black mt-1">33%</p>
         </Card>
         
         <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
            <AlertCircle className="w-5 h-5 text-amber-500 mb-2" />
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Delay Risk Factor</p>
            <p className="text-3xl font-black mt-1">Low (4%)</p>
         </Card>

         <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border-blue-500/20">
            <BarChart3 className="w-5 h-5 text-blue-500 mb-2" />
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Budget Variance</p>
            <p className="text-3xl font-black mt-1">+1.2%</p>
         </Card>
      </div>

      <Card className="p-8 bg-background/50 border-border/50 shadow-xl space-y-8">
         <h2 className="text-xl font-bold border-b border-border/50 pb-4">Lifecycle Phases</h2>
         
         {phases.map((phase, i) => (
            <div key={i} className="space-y-3">
               <div className="flex justify-between items-center text-sm font-bold">
                 <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${phase.status === 'completed' ? 'bg-emerald-500' : phase.status === 'active' ? 'bg-amber-500 animate-pulse' : 'bg-muted-foreground'}`}></span>
                    {phase.title}
                 </div>
                 <span className="font-mono">{phase.progress}%</span>
               </div>
               
               <Progress value={phase.progress} className={`h-2 ${phase.status === 'completed' ? '[&>div]:bg-emerald-500' : phase.status === 'active' ? '[&>div]:bg-amber-500' : ''}`} />
               
               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <UserCheck className="w-3 h-3" />
                  Assigned Team/Contractor: {phase.team}
               </div>
            </div>
         ))}
      </Card>
    </div>
  )
}
