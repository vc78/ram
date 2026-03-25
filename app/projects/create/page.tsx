"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Building2, 
  MapPin, 
  Layout,
  Construction,
  Zap,
  CheckCircle2
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { apiPost } from "@/lib/backend"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function CreateProject() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    floors: "1",
    location: "",
    plotArea: "",
    type: "Residential"
  })

  const handleCreate = async () => {
    setLoading(true)
    try {
      const res = await apiPost<{ id: number }>("/projects/create", {
        name: formData.name,
        floors: parseInt(formData.floors),
        location: formData.location,
        plot_area: parseFloat(formData.plotArea),
        type: formData.type
      })
      toast.success("Project initialised successfully")
      router.push(`/dashboard`)
    } catch (err: any) {
      toast.error(err?.message || "Generation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        
        <header className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-white -ml-4">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <h1 className="text-5xl font-bold text-white flex items-center gap-4">
             <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20">
               <Sparkles className="w-8 h-8 text-white" />
             </div>
             Project <span className="text-emerald-500">Initialization</span>
          </h1>
          <p className="text-slate-400 text-lg">Deploy a new architectural instance with AI-driven site analysis.</p>
        </header>

        <div className="relative">
           <div className="flex justify-between mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-2">
              <span className={step >= 1 ? "text-emerald-500" : ""}>01 Metadata</span>
              <span className={step >= 2 ? "text-emerald-500" : ""}>02 Topology</span>
              <span className={step >= 3 ? "text-emerald-500" : ""}>03 Finalize</span>
           </div>
           <Progress value={(step / 3) * 100} className="h-1 bg-slate-900" />
        </div>

        <Card className="bg-slate-900 border-slate-800 p-8 rounded-3xl overflow-hidden relative shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] -z-10" />
           
           <AnimatePresence mode="wait">
             {step === 1 && (
               <motion.div 
                 key="step1" 
                 initial={{ opacity: 0, x: 20 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <div className="grid gap-6">
                     <div className="space-y-4">
                        <Label className="text-xs uppercase font-bold tracking-widest text-slate-500">Project Name</Label>
                        <Input 
                          className="bg-slate-950 border-slate-800 h-14 rounded-2xl text-lg focus:border-emerald-500" 
                          placeholder="Cyber Villa v1.0"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                     </div>
                     <div className="space-y-4">
                        <Label className="text-xs uppercase font-bold tracking-widest text-slate-500">Project Class</Label>
                        <div className="grid grid-cols-2 gap-4">
                           {["Residential", "Commercial"].map(t => (
                             <Button 
                               key={t}
                               variant={formData.type === t ? "default" : "outline"}
                               className={formData.type === t ? "bg-emerald-600 text-white h-14 rounded-2xl shadow-lg shadow-emerald-500/10" : "h-14 rounded-2xl border-slate-800 text-slate-400"}
                               onClick={() => setFormData({...formData, type: t})}
                             >
                               {t}
                             </Button>
                           ))}
                        </div>
                     </div>
                  </div>
                  <Button onClick={() => setStep(2)} className="w-full h-14 bg-white text-slate-950 hover:bg-slate-200 rounded-2xl font-bold uppercase tracking-widest">
                     Next Module <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
               </motion.div>
             )}

             {step === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid gap-6">
                    <div className="space-y-4">
                        <Label className="text-xs uppercase font-bold tracking-widest text-slate-500">GPS Coordinates / Location</Label>
                        <Input className="bg-slate-950 border-slate-800 h-14 rounded-2xl text-lg focus:border-emerald-500" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-4">
                           <Label className="text-xs uppercase font-bold tracking-widest text-slate-500">Floors (G+N)</Label>
                           <Input type="number" className="bg-slate-950 border-slate-800 h-14 rounded-2xl text-lg focus:border-emerald-500" value={formData.floors} onChange={e => setFormData({...formData, floors: e.target.value})} />
                       </div>
                       <div className="space-y-4">
                           <Label className="text-xs uppercase font-bold tracking-widest text-slate-500">Plot Area (sqft)</Label>
                           <Input type="number" className="bg-slate-950 border-slate-800 h-14 rounded-2xl text-lg focus:border-emerald-500" value={formData.plotArea} onChange={e => setFormData({...formData, plotArea: e.target.value})} />
                       </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                     <Button variant="ghost" onClick={() => setStep(1)} className="h-14 px-8 text-slate-500 uppercase font-bold tracking-widest">Back</Button>
                     <Button onClick={() => setStep(3)} className="flex-1 h-14 bg-white text-slate-950 hover:bg-slate-200 rounded-2xl font-bold uppercase tracking-widest">Review Constraints</Button>
                  </div>
                </motion.div>
             )}

             {step === 3 && (
                <motion.div 
                  key="step3" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-bold text-white">Instance Ready</h3>
                     <p className="text-slate-400">Project parameters have been verified for AI synthesis.</p>
                  </div>
                  <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-left grid grid-cols-2 gap-4">
                     <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Name: <span className="text-white">{formData.name}</span></div>
                     <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Scale: <span className="text-white">G+{formData.floors}</span></div>
                     <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Area: <span className="text-white">{formData.plotArea} sqft</span></div>
                     <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Class: <span className="text-white">{formData.type}</span></div>
                  </div>
                  <div className="flex gap-4">
                     <Button variant="ghost" onClick={() => setStep(2)} className="h-14 px-8 text-slate-500 uppercase font-bold tracking-widest">Back</Button>
                     <Button onClick={handleCreate} disabled={loading} className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                        {loading ? "Synthesizing..." : "Initialize Project"}
                     </Button>
                  </div>
                </motion.div>
             )}
           </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}
