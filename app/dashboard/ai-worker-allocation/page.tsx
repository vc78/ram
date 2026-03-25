"use client"

import { useState } from "react"
import { WorkerForm } from "@/components/worker/worker-form"
import { TaskForm } from "@/components/task/task-form"
import { AssignmentPanel } from "@/components/assignment/assignment-panel"
import { BrainCircuit, Users, ShieldCheck } from "lucide-react"

export default function AIWorkerAllocationPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="space-y-2 mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-indigo-500" />
          AI Worker Allocation System
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Task Line Token Evaluator Active
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Workforce Registration</h2>
            </div>
            <WorkerForm onWorkerAdded={triggerRefresh} />
         </div>
         
         <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-semibold">Task Generation</h2>
            </div>
            <TaskForm onTaskAdded={triggerRefresh} />
         </div>
      </div>

      <div className="pt-8 w-full">
         <div className="flex items-center gap-2 mb-4">
           <BrainCircuit className="w-5 h-5 text-emerald-500" />
           <h2 className="text-2xl font-bold">ML Allocation Engine</h2>
         </div>
         <AssignmentPanel refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}
