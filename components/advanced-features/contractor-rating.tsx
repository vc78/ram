"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Activity, 
  Bot, 
  TrendingUp, 
  BrainCircuit,
  ShieldCheck,
  Zap,
  Leaf,
  BarChart4,
  Cpu,
  Fingerprint
} from "lucide-react"

interface NeuralMetrics {
  confidenceScore: number
  efficiencyIndex: number
  qualityConsistency: number
  wasteMinimization: number
  safetyCompliance: number
  predictedDelayRisk: number
  roiAlignment: number
}

interface Contractor {
  id: string
  name: string
  specialty: string
  rating: number
  completedProjects: number
  location: string
  responseTime: string
  verified: boolean
  hourlyRate: string
  avatar?: string
  neuralMetrics: NeuralMetrics
  tags: string[]
}

const CONTRACTOR_DATASET: Contractor[] = [
  {
    id: "cnt-001",
    name: "Arjun Structural Solutions",
    specialty: "Civil & RCC",
    rating: 4.92,
    completedProjects: 142,
    location: "Hyderabad // West Zone",
    responseTime: "14 mins",
    verified: true,
    hourlyRate: "₹950/day",
    tags: ["High Precision", "Zero Waste", "Fast-Track"],
    neuralMetrics: {
      confidenceScore: 98.4,
      efficiencyIndex: 96,
      qualityConsistency: 99,
      wasteMinimization: 94,
      safetyCompliance: 98,
      predictedDelayRisk: 2,
      roiAlignment: 88
    }
  },
  {
    id: "cnt-002",
    name: "GreenBuild MEP Systems",
    specialty: "Electrical & Plumbing",
    rating: 4.85,
    completedProjects: 89,
    location: "Bangalore // North",
    responseTime: "22 mins",
    verified: true,
    hourlyRate: "₹1,100/day",
    tags: ["Eco-Certified", "Smart-Grid", "BIM-Ready"],
    neuralMetrics: {
      confidenceScore: 94.1,
      efficiencyIndex: 92,
      qualityConsistency: 95,
      wasteMinimization: 98,
      safetyCompliance: 96,
      predictedDelayRisk: 5,
      roiAlignment: 94
    }
  },
  {
    id: "cnt-003",
    name: "Rapid-Finish Interiors",
    specialty: "Finishing & Decor",
    rating: 4.68,
    completedProjects: 215,
    location: "Chennai // OMR",
    responseTime: "45 mins",
    verified: true,
    hourlyRate: "₹750/day",
    tags: ["Ultra-Fast", "Labor-Heavy", "Budget"],
    neuralMetrics: {
      confidenceScore: 82.5,
      efficiencyIndex: 88,
      qualityConsistency: 82,
      wasteMinimization: 75,
      safetyCompliance: 90,
      predictedDelayRisk: 12,
      roiAlignment: 96
    }
  }
]

export function ContractorRating() {
  const [contractors, setContractors] = useState<Contractor[]>(CONTRACTOR_DATASET)
  const [activeStrategy, setActiveStrategy] = useState<"roi" | "eco" | "speed">("roi")
  const [isNeuralSyncing, setIsNeuralSyncing] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsNeuralSyncing(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Dynamic ranking based on strategy weights
  const rankedContractors = [...contractors].sort((a, b) => {
    if (activeStrategy === "roi") return b.neuralMetrics.roiAlignment - a.neuralMetrics.roiAlignment
    if (activeStrategy === "eco") return b.neuralMetrics.wasteMinimization - a.neuralMetrics.wasteMinimization
    return b.neuralMetrics.efficiencyIndex - a.neuralMetrics.efficiencyIndex
  })

  return (
    <Card className="p-8 bg-slate-900 border-slate-800 rounded-[3rem] relative overflow-hidden group shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-all duration-1000" />
      
      {/* Neural Network HUD Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                 <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">INDUSTRI-NET™</h3>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Contractor Neural Network v9.4</p>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
           {[
             { id: "roi", label: "ROI", icon: TrendingUp },
             { id: "eco", label: "ECO", icon: Leaf },
             { id: "speed", label: "SPEED", icon: Zap }
           ].map((s) => (
             <button
               key={s.id}
               onClick={() => setActiveStrategy(s.id as any)}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black transition-all ${
                 activeStrategy === s.id 
                 ? "bg-primary text-white shadow-lg shadow-primary/20" 
                 : "text-slate-500 hover:text-white"
               }`}
             >
               <s.icon className="w-3.5 h-3.5" /> {s.label}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-6">
        {isNeuralSyncing ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
               <Skeleton className="h-24 w-full rounded-2xl bg-slate-800/50" />
            </div>
          ))
        ) : (
          rankedContractors.map((contractor, idx) => (
            <div key={contractor.id} className="relative group/item">
              {/* Rank Badge */}
              {idx === 0 && (
                <div className="absolute -top-3 -left-3 z-10 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black shadow-xl ring-4 ring-slate-900 italic">
                   #1
                </div>
              )}

              <div className="p-6 rounded-[2.5rem] border border-slate-800 bg-slate-950/50 hover:bg-slate-950 transition-all duration-500 hover:border-primary/30 group/inner">
                <div className="grid lg:grid-cols-4 gap-8 items-center">
                  
                  {/* Visual Identity */}
                  <div className="flex items-center gap-5 lg:col-span-1">
                    <div className="relative">
                      <Avatar className="w-20 h-20 rounded-3xl border-2 border-slate-800 ring-4 ring-slate-900 group-hover/inner:border-primary/50 transition-all duration-500">
                        <AvatarImage src={contractor.avatar} />
                        <AvatarFallback className="bg-slate-800 text-slate-400 font-black text-xl italic">{contractor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                         <Fingerprint className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-white italic truncate group-hover/inner:text-primary transition-colors">{contractor.name}</h4>
                        {contractor.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{contractor.specialty}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-black text-white">{contractor.rating}</span>
                        <span className="text-[9px] font-bold text-slate-600 uppercase">({contractor.completedProjects} Jobs)</span>
                      </div>
                    </div>
                  </div>

                  {/* Neural Engine Center (Proper Dataset Viz) */}
                  <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Cpu className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence Score</span>
                           </div>
                           <span className="text-sm font-black text-primary italic">{contractor.neuralMetrics.confidenceScore}%</span>
                        </div>
                        <Progress value={contractor.neuralMetrics.confidenceScore} className="h-1.5 bg-slate-800" />
                        
                        <div className="flex flex-wrap gap-2">
                           {contractor.tags.map(tag => (
                             <Badge key={tag} className="text-[8px] bg-slate-800/50 hover:bg-primary/20 text-slate-400 hover:text-primary font-black uppercase tracking-widest border-none px-2.5 py-0.5 rounded-lg transition-all">
                               {tag}
                             </Badge>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-800/30 rounded-2xl border border-white/5 space-y-1">
                           <div className="text-[8px] font-black text-slate-500 uppercase">Quality Consistency</div>
                           <div className="flex items-center gap-2">
                              <BarChart4 className="w-3 h-3 text-emerald-500" />
                              <span className="text-xs font-black text-white">{contractor.neuralMetrics.qualityConsistency}%</span>
                           </div>
                        </div>
                        <div className="p-3 bg-slate-800/30 rounded-2xl border border-white/5 space-y-1">
                           <div className="text-[8px] font-black text-slate-500 uppercase">Waste Control</div>
                           <div className="flex items-center gap-2">
                              <Leaf className="w-3 h-3 text-emerald-500" />
                              <span className="text-xs font-black text-white">{contractor.neuralMetrics.wasteMinimization}%</span>
                           </div>
                        </div>
                        <div className="p-3 bg-slate-800/30 rounded-2xl border border-white/5 space-y-1">
                           <div className="text-[8px] font-black text-slate-500 uppercase">Delay Probability</div>
                           <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-rose-500" />
                              <span className="text-xs font-black text-rose-500">{contractor.neuralMetrics.predictedDelayRisk}%</span>
                           </div>
                        </div>
                        <div className="p-3 bg-slate-800/30 rounded-2xl border border-white/5 space-y-1">
                           <div className="text-[8px] font-black text-slate-500 uppercase">Safety Compliance</div>
                           <div className="flex items-center gap-2">
                              <ShieldCheck className="w-3 h-3 text-blue-500" />
                              <span className="text-xs font-black text-white">{contractor.neuralMetrics.safetyCompliance}%</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Actions & Logistics */}
                  <div className="lg:col-span-1 flex flex-col items-center lg:items-end gap-5">
                    <div className="text-right">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Standard Rate</span>
                       <div className="text-2xl font-black text-white italic tracking-tighter">{contractor.hourlyRate}</div>
                       <div className="text-[9px] font-bold text-slate-600 uppercase flex items-center gap-1 justify-end mt-1">
                          <MapPin className="w-3 h-3" /> {contractor.location}
                       </div>
                    </div>
                    <div className="flex gap-2 w-full lg:w-auto">
                       <Button variant="outline" className="flex-1 lg:w-14 h-14 rounded-2xl border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700">
                          <MessageSquare className="w-5 h-5" />
                       </Button>
                       <Button className="flex-[2] lg:px-8 h-14 rounded-2xl bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                          Deploy Vendor
                       </Button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Strategic Match Footnote */}
      {!isNeuralSyncing && (
        <div className="mt-10 p-5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-bottom-2 duration-500">
           <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0 animate-pulse">
              <Bot className="w-7 h-7" />
           </div>
           <p className="text-[11px] font-bold text-slate-300 leading-relaxed max-w-2xl text-center md:text-left">
              <span className="text-primary font-black uppercase tracking-widest">AI MATCH REPORT:</span> Based on your <span className="text-primary italic">"{activeStrategy.toUpperCase()}"</span> project selection, we have identified <span className="text-white italic">{rankedContractors[0].name}</span> as the optimal neural match with a 99.8% structural alignment probability.
           </p>
           <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline ml-auto">View Calibration Data</button>
        </div>
      )}
    </Card>
  )
}
