"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flag, Calendar, IndianRupee, CheckCircle2, Clock, AlertCircle, ShieldCheck, Zap, Eye, Link as LinkIcon, Database } from "lucide-react"

interface Milestone {
  id: string
  name: string
  dueDate: string
  payment: number
  status: "completed" | "in-progress" | "upcoming" | "overdue"
  progress: number
  deliverables: string[]
  blockchainHash?: string
  aiVerified?: boolean
  smartContractId?: string
}

const MOCK_MILESTONES: Milestone[] = [
  {
    id: "1",
    name: "Foundation Complete",
    dueDate: "Jan 15, 2024",
    payment: 500000,
    status: "completed",
    progress: 100,
    deliverables: ["Excavation", "Footing", "Plinth beam", "Foundation photos"],
    blockchainHash: "0x742d...f62e",
    aiVerified: true,
    smartContractId: "SC-SIID-2024-001"
  },
  {
    id: "2",
    name: "Ground Floor Structure",
    dueDate: "Feb 28, 2024",
    payment: 800000,
    status: "in-progress",
    progress: 65,
    deliverables: ["Columns", "Beams", "Slab casting", "Quality report"],
    aiVerified: true,
    smartContractId: "SC-SIID-2024-002"
  },
  {
    id: "3",
    name: "First Floor Structure",
    dueDate: "Apr 15, 2024",
    payment: 700000,
    status: "upcoming",
    progress: 0,
    deliverables: ["First floor columns", "Slab", "Staircase continuation"],
    smartContractId: "SC-SIID-2024-003"
  },
  {
    id: "4",
    name: "Roofing & Waterproofing",
    dueDate: "May 30, 2024",
    payment: 400000,
    status: "upcoming",
    progress: 0,
    deliverables: ["Roof slab", "Waterproofing", "Parapet wall"],
    smartContractId: "SC-SIID-2024-004"
  },
]

export function ProjectMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>(MOCK_MILESTONES)
  const [expandedId, setExpandedId] = useState<string | null>("2")
  const [processingId, setProcessingId] = useState<string | null>(null)

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  const totalBudget = milestones.reduce((acc, m) => acc + m.payment, 0)
  const paidAmount = milestones.filter((m) => m.status === "completed").reduce((acc, m) => acc + m.payment, 0)

  const handleSmartPayout = (id: string) => {
    setProcessingId(id)
    setTimeout(() => {
      setMilestones(prev => prev.map(m => 
        m.id === id ? { ...m, status: "completed", progress: 100, blockchainHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}` } : m
      ))
      setProcessingId(null)
    }, 2000)
  }

  const getStatusBadge = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">PAYOUT RELEASED</Badge>
      case "in-progress":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">IN REVIEW</Badge>
      case "overdue":
        return <Badge variant="destructive">DELAYED</Badge>
      default:
        return <Badge variant="secondary">SCHEDULED</Badge>
    }
  }

  return (
    <Card className="p-8 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Financial Ledger</h3>
          </div>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            <Zap className="w-3 h-3 text-amber-500" /> Smart-Contract Escrow Active
          </p>
        </div>
        
        <div className="flex items-center gap-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
           <div className="text-right">
             <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Total Committed</div>
             <div className="text-xl font-black text-primary">{formatCurrency(totalBudget)}</div>
           </div>
           <div className="w-px h-8 bg-slate-300 dark:bg-slate-700" />
           <div className="text-right">
             <div className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Disbursed</div>
             <div className="text-xl font-black text-green-600">{formatCurrency(paidAmount)}</div>
           </div>
        </div>
      </div>

      <div className="mb-10 p-6 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold flex items-center gap-2">
            <Database className="w-4 h-4" /> Capital Absorption Progress
          </span>
          <span className="text-sm font-black text-primary">
            {Math.round((paidAmount / totalBudget) * 100)}%
          </span>
        </div>
        <Progress value={(paidAmount / totalBudget) * 100} className="h-2.5 bg-primary/10" />
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="group">
            <div
              className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                milestone.status === "completed"
                  ? "border-green-500/20 bg-green-500/5 hover:bg-green-500/10"
                  : milestone.status === "in-progress"
                    ? "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
                    : "border-slate-100 dark:border-slate-800 bg-transparent hover:border-slate-200 dark:hover:border-slate-700"
              }`}
              onClick={() => setExpandedId(expandedId === milestone.id ? null : milestone.id)}
            >
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                      milestone.status === "completed"
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                        : milestone.status === "in-progress"
                          ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {milestone.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-lg tracking-tight flex items-center gap-2">
                       {milestone.name}
                       {milestone.aiVerified && (
                         <div className="w-5 h-5 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500" title="AI Vision Verified">
                            <Eye className="w-3 h-3" />
                         </div>
                       )}
                    </h4>
                    {getStatusBadge(milestone.status)}
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {milestone.dueDate}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-primary">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {formatCurrency(milestone.payment)}
                    </div>
                    {milestone.blockchainHash && (
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md">
                        <LinkIcon className="w-2.5 h-2.5" />
                        {milestone.blockchainHash}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {milestone.status === "in-progress" && (
                <div className="mt-6 pl-16">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Live Progress (AI-Vision Output)</span>
                    <span className="text-xs font-black text-amber-600">{milestone.progress}%</span>
                  </div>
                  <Progress value={milestone.progress} className="h-1.5 bg-amber-500/10" />
                </div>
              )}

              {expandedId === milestone.id && (
                <div className="mt-8 pl-16 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Proof of Accomplishment</div>
                      <ul className="space-y-2">
                        {milestone.deliverables.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <div className={`w-1.5 h-1.5 rounded-full ${milestone.status === "completed" ? "bg-green-500" : "bg-slate-300"}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contract Details</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Contract ID</span>
                          <span className="font-mono font-bold">{milestone.smartContractId}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Verification</span>
                          <span className="text-blue-500 font-bold flex items-center gap-1"><Eye className="w-3 h-3" /> SIID INDUSTRI-EYE™</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {milestone.status === "in-progress" && (
                    <Button 
                      className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-black shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSmartPayout(milestone.id)
                      }}
                      disabled={processingId === milestone.id}
                    >
                      {processingId === milestone.id ? (
                        <>
                          <Clock className="w-5 h-5 animate-spin" />
                          VERIFYING ON-CHAIN...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 text-amber-400" />
                          TRIGGER SMART-CONTRACT PAYOUT
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
