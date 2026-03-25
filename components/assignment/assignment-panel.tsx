"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BrainCircuit, Loader2, CheckCircle, Clock, AlertTriangle, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AssignmentPanel({ refreshTrigger }: { refreshTrigger: number }) {
  const [tasks, setTasks] = useState<any[]>([])
  const [workers, setWorkers] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedWorkers, setSelectedWorkers] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  const fetchData = async () => {
    setLoadingTasks(true)
    try {
      const [tRes, wRes, aRes] = await Promise.all([
        fetch("/api/tasks/list"),
        fetch("/api/workers/list"),
        fetch("/api/assignments/list")
      ])
      
      if (tRes.ok) {
        const tData = await tRes.json()
        setTasks(tData.tasks.reverse()) // newest first
      }
      if (wRes.ok) {
         const wData = await wRes.json()
         setWorkers(wData.workers)
      }
      if (aRes.ok) {
         const aData = await aRes.json()
         setAssignments(aData.assignments)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTasks(false)
    }
  }

  const handleAutoAssign = async (taskId: string) => {
    setActionLoading(taskId)
    try {
      const res = await fetch("/api/assignments/auto-assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast({ 
        title: "AI Assignment Successful", 
        description: `Assigned ${data.worker.name} (Score: ${data.assignment.score.toFixed(1)})`
      })
      await fetchData() // Refresh all lists
    } catch (err: any) {
      toast({ title: "Auto-Assign Failed", description: err.message, variant: "destructive" })
    } finally {
      setActionLoading(null)
    }
  }

  const handleManualAssign = async (taskId: string) => {
    const workerId = selectedWorkers[taskId]
    if (!workerId) {
       toast({ title: "Error", description: "Select a worker first", variant: "destructive" })
       return
    }

    setActionLoading(taskId)
    try {
      const res = await fetch("/api/assignments/manual-assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, worker_id: workerId })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast({ 
        title: "Manual Assignment Successful", 
        description: `Force assigned ${data.worker.name}`
      })
      await fetchData()
    } catch (err: any) {
      toast({ title: "Assignment Failed", description: err.message, variant: "destructive" })
    } finally {
      setActionLoading(null)
    }
  }

  const getTaskAssignment = (taskId: string) => {
     return assignments.find(a => a.task_id === taskId)
  }

  const getWorkerName = (workerId: string) => {
     return workers.find(w => w.id === workerId)?.name || "Unknown Worker"
  }

  if (loadingTasks) {
    return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-emerald-500" />
          ML Allocation Terminal
        </CardTitle>
      </CardHeader>
      <CardContent>
         {tasks.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground border border-dashed rounded-lg">
               No pending tasks found. Create a task above to begin ML tracking.
            </div>
         ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                 const assignment = getTaskAssignment(task.id)
                 const isAssigned = task.status === "assigned" || assignment

                 return (
                   <div key={task.id} className="p-4 border border-border/50 rounded-lg bg-muted/10">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                       <div>
                         <h4 className="font-bold text-foreground text-lg">{task.task_name}</h4>
                         <div className="flex items-center gap-2 mt-1">
                           <Badge variant="outline" className="text-muted-foreground/80">{task.required_skill}</Badge>
                           <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'} className="uppercase text-[10px] tracking-wider">
                             {task.priority}
                           </Badge>
                           {isAssigned ? (
                             <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Assigned</Badge>
                           ) : (
                             <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
                           )}
                         </div>
                       </div>
                       
                       {!isAssigned ? (
                         <div className="flex flex-col sm:flex-row gap-2">
                           <Button 
                             onClick={() => handleAutoAssign(task.id)} 
                             disabled={actionLoading === task.id}
                             className="bg-emerald-600 hover:bg-emerald-700 text-white"
                             size="sm"
                           >
                             {actionLoading === task.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                             Auto Assign (AI)
                           </Button>
                           <div className="flex items-center gap-2">
                             <Select onValueChange={(val) => setSelectedWorkers({...selectedWorkers, [task.id]: val})}>
                               <SelectTrigger className="w-[140px] h-9">
                                 <SelectValue placeholder="Select worker" />
                               </SelectTrigger>
                               <SelectContent>
                                 {workers.filter(w => w.availability).map(w => (
                                   <SelectItem key={w.id} value={w.id}>{w.name} ({w.skill})</SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                             <Button 
                               onClick={() => handleManualAssign(task.id)}
                               disabled={actionLoading === task.id || !selectedWorkers[task.id]}
                               variant="outline"
                               size="sm"
                             >
                               Assign Manually
                             </Button>
                           </div>
                         </div>
                       ) : (
                         <div className="flex items-center gap-4 bg-muted/30 p-2 px-4 rounded-md border border-border">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                               <UserCheck className="w-4 h-4 text-primary" />
                             </div>
                             <div>
                               <p className="text-sm font-bold">{getWorkerName(assignment?.worker_id)}</p>
                               <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Operator Linked</p>
                             </div>
                           </div>
                           <div className="text-right">
                             <p className="text-sm font-bold text-emerald-500">{assignment?.score?.toFixed(1) || "N/A"}</p>
                             <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Match Score</p>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 )
              })}
            </div>
         )}
      </CardContent>
    </Card>
  )
}
