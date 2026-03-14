"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GoogleMapsLocationPicker, type LocationData } from "@/components/google-maps-location-picker"
import {
  ArrowLeft,
  Home,
  Building2,
  Sparkles,
  Loader2,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Zap,
  Plane,
  Landmark,
  Factory,
  Trees,
  Hospital,
  School,
  Bus,
  Hotel,
  ShieldCheck,
  Wind,
  Sun,
  Droplets,
  HardHat,
  Scale,
  Leaf,
  Layers,
  LayoutDashboard
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

// --- Types & Interfaces ---
type ProjectCategory = "residential" | "commercial" | "institutional" | "industrial" | "airport" | "dam" | "playground" | "education" | "hospitality" | "transport" | "civic"
type ProjectSize = "small" | "medium" | "large" | "mega"
type MaterialQuality = "economical" | "standard" | "premium" | "ultra_luxury"

interface BudgetEstimation {
  stage: "moderate" | "intermediate" | "premium"
  budgetRange: { min: number; max: number }
  breakdown: {
    civil_work: number
    finishing: number
    mep_systems: number
    consultancy_fees: number
    contingency: number
    govt_taxes_permits: number
    materials: number
    labor: number
  }
  reasoning: string[]
  dimensions: { primary: string; secondary: string; tertiary: string }
  sustainability_score: number
}

// --- Constants ---
const PROJECT_TYPES: { id: ProjectCategory; name: string; icon: any; desc: string }[] = [
  { id: "residential", name: "Residential", icon: Home, desc: "Villas, Apartments, Housing Societies" },
  { id: "commercial", name: "Commercial", icon: Building2, desc: "Offices, Retail, Business Complexes" },
  { id: "institutional", name: "Institutional", icon: Landmark, desc: "Museums, Govt. Buildings, Libraries" },
  { id: "industrial", name: "Industrial", icon: Factory, desc: "Manufacturing Plants, Warehouses" },
  { id: "airport", name: "Airport", icon: Plane, desc: "Terminals, Runways, Ancillary Blocks" },
  { id: "hospitality", name: "Hospitality", icon: Hotel, desc: "Hotels, Resorts, Banquets" },
  { id: "education", name: "Education", icon: School, desc: "Schools, Universities, Research Hubs" },
  { id: "transport", name: "Transport", icon: Bus, desc: "Metro Stations, Bus Depots, Interchanges" },
]

export default function AdvancedNewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [projectType, setProjectType] = useState<ProjectCategory | null>(null)
  
  // Form States
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    locationData: null as LocationData | null,
  })

  const [requirements, setRequirements] = useState({
    size: "medium" as ProjectSize,
    materials: "standard" as MaterialQuality,
    hvac: "split-ac",
    solar: false,
    smart: [] as string[],
    vastu: true,
    sustainability: "leed-gold",
  })

  const [isEstimating, setIsEstimating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [estimation, setEstimation] = useState<BudgetEstimation | null>(null)

  // --- Handlers ---
  const handleNext = () => setStep((s) => s + 1)
  const handleBack = () => setStep((s) => s - 1)

  const handleEstimate = async () => {
    setIsEstimating(true)
    try {
      const resp = await fetch("/api/ml-project-estimation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, requirements, projectType }),
      })
      if (!resp.ok) throw new Error("Estimation failed")
      const data = await resp.json()
      setEstimation(data)
      setStep(4)
    } catch (err: any) {
      toast({ title: "ML Estimation Error", description: err.message, variant: "destructive" })
    } finally {
      setIsEstimating(false)
    }
  }

  const handleGenerateDesigns = async () => {
    setIsGenerating(true)
    try {
      const projectId = Date.now().toString()
      const resp = await fetch("/api/generate-designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          projectData: { 
            id: projectId, 
            ...formData, 
            type: projectType, 
            requirements, 
            budgetEstimation: estimation 
          } 
        }),
      })
      if (!resp.ok) throw new Error("Design generation failed")
      const { designs } = await resp.json()
      
      // Save to local persistence
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      projects.push({
        id: projectId,
        ...formData,
        type: projectType,
        requirements,
        estimation,
        designs,
        status: "planning",
        progress: 10,
        createdAt: new Date().toISOString()
      })
      localStorage.setItem("projects", JSON.stringify(projects))
      
      router.push(`/dashboard/projects/${projectId}/designs`)
    } catch (err: any) {
      toast({ title: "AI Generation Error", description: err.message, variant: "destructive" })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-primary/30">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Navigation */}
          <div className="flex justify-between items-center mb-12">
            <Link href="/dashboard" className="group flex items-center gap-2 text-muted-foreground hover:text-white transition-all">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={`h-1 w-8 rounded-full transition-all duration-500 ${s <= step ? "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white/10"}`} />
              ))}
            </div>
          </div>

          {/* Main Stage */}
          <div className="grid lg:grid-cols-[1fr_350px] gap-12">
            
            <main className="space-y-8">
              {/* Step 1: Project Typer Selection */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">Step 01: Core Intent</Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">What are we building today?</h1>
                    <p className="text-muted-foreground text-lg">Select your primary project category to initialize the industry-specific ML engine.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {PROJECT_TYPES.map((type) => (
                      <Card 
                        key={type.id}
                        onClick={() => { setProjectType(type.id); handleNext(); }}
                        className={`p-6 border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden ${projectType === type.id ? 'border-primary/50 bg-white/10' : ''}`}
                      >
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <type.icon size={100} />
                        </div>
                        <div className="relative z-10 space-y-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${projectType === type.id ? 'bg-primary text-white' : 'bg-white/5 text-primary'}`}>
                            <type.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{type.name}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">{type.desc}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Spatial & Geo Intelligence */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">Step 02: Space & Location</Badge>
                    <h1 className="text-4xl font-black tracking-tight">Spatial Parameters</h1>
                    <p className="text-muted-foreground">Define the physical and geographic constraints for precise cost modeling.</p>
                  </div>

                  <Card className="p-8 border-white/5 bg-white/5 backdrop-blur-xl">
                    <div className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-white/70 text-sm font-semibold uppercase tracking-wider">Project Identity</Label>
                          <Input 
                            placeholder="e.g. Skyline Residency" 
                            className="h-14 bg-white/5 border-white/10 focus:border-primary text-lg" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-white/70 text-sm font-semibold uppercase tracking-wider">Footprint Scale</Label>
                          <div className="flex gap-2">
                            {(["small", "medium", "large", "mega"] as ProjectSize[]).map((sz) => (
                              <Button
                                key={sz}
                                variant={requirements.size === sz ? "default" : "outline"}
                                className={`flex-1 h-14 border-white/10 ${requirements.size === sz ? 'bg-primary' : 'bg-white/5'}`}
                                onClick={() => setRequirements({...requirements, size: sz})}
                              >
                                {sz.toUpperCase()}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-white/70 text-sm font-semibold uppercase tracking-wider">Global Positioning (GIS)</Label>
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                          <GoogleMapsLocationPicker 
                            value={formData.locationData}
                            onChange={(loc) => setFormData({...formData, location: loc.address, locationData: loc})}
                            placeholder="Search district, city or specific plot coordinates..."
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-white/70 text-sm font-semibold uppercase tracking-wider">Detailed Objective</Label>
                        <Textarea 
                          placeholder="Describe site constraints, specific architectural desires, or unique functional requirements..." 
                          className="bg-white/5 border-white/10 focus:border-primary min-h-[120px] text-lg"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                    </div>
                  </Card>

                  <div className="flex justify-between items-center">
                    <Button variant="ghost" className="h-14 px-8 text-white/50" onClick={handleBack}>Previous Step</Button>
                    <Button 
                      className="h-14 px-12 bg-primary hover:bg-primary/90 shadow-[0_4px_20px_rgba(59,130,246,0.3)] font-bold text-lg" 
                      onClick={handleNext}
                      disabled={!formData.name || !formData.locationData}
                    >
                      Continue to Engineering
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Infrastructure & MEP Logic */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">Step 03: MEP & Compliance</Badge>
                    <h1 className="text-4xl font-black tracking-tight">Engineering Intelligence</h1>
                    <p className="text-muted-foreground">Select advanced infrastructure systems to calibrate technical designs.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Quality Tab */}
                    <Card className="p-6 border-white/5 bg-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <Layers className="text-primary w-5 h-5" />
                        <h3 className="font-bold">Material Specification Tier</h3>
                      </div>
                      <div className="space-y-4">
                        {(["economical", "standard", "premium", "ultra_luxury"] as MaterialQuality[]).map((m) => (
                          <div 
                            key={m} 
                            onClick={() => setRequirements({...requirements, materials: m})}
                            className={`p-4 rounded-xl border border-white/10 cursor-pointer flex justify-between items-center transition-all ${requirements.materials === m ? 'bg-primary/10 border-primary' : 'hover:bg-white/5'}`}
                          >
                            <span className="capitalize font-medium">{m.replace('_', ' ')}</span>
                            {requirements.materials === m && <CheckCircle2 className="w-5 h-5 text-primary" />}
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* HVAC & Sustainability */}
                    <Card className="p-6 border-white/5 bg-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <Wind className="text-primary w-5 h-5" />
                        <h3 className="font-bold">MEP & Green Tech</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-xs uppercase text-white/50 tracking-widest">Climate Control (HVAC)</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {["split-ac", "central-ac", "vrf", "natural"].map((h) => (
                              <Button 
                                key={h} 
                                variant={requirements.hvac === h ? "default" : "outline"}
                                size="sm"
                                className="h-10 border-white/10 capitalize"
                                onClick={() => setRequirements({...requirements, hvac: h})}
                              >
                                {h}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <Sun className="text-orange-400 w-5 h-5" />
                            <div>
                              <p className="font-bold text-sm">Solar Photovoltaic</p>
                              <p className="text-[10px] text-muted-foreground">Renewable Energy Integration</p>
                            </div>
                          </div>
                          <Switch checked={requirements.solar} onCheckedChange={(v) => setRequirements({...requirements, solar: v})} />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <Scale className="text-green-400 w-5 h-5" />
                            <div>
                              <p className="font-bold text-sm">Vastu Compliance</p>
                              <p className="text-[10px] text-muted-foreground">Architectural Orientation logic</p>
                            </div>
                          </div>
                          <Switch checked={requirements.vastu} onCheckedChange={(v) => setRequirements({...requirements, vastu: v})} />
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button variant="ghost" className="h-14 px-8 text-white/50" onClick={handleBack}>Go Back</Button>
                    <Button 
                      className="h-14 px-12 bg-primary hover:bg-primary/90 shadow-[0_4px_20px_rgba(59,130,246,0.3)] font-bold text-lg" 
                      onClick={handleEstimate}
                      disabled={isEstimating}
                    >
                      {isEstimating ? <><Loader2 className="w-5 h-5 animate-spin mr-3" /> Running ML Projection...</> : "Run Financial & Structural Preview"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: ML Budget & Dimensions Output */}
              {step === 4 && estimation && (
                <div className="space-y-8 animate-in zoom-in-95 duration-700">
                  <div className="space-y-2 text-center">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-1">AI Projection Complete</Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Strategic Estimation</h1>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6 border-white/5 bg-white/5 text-center space-y-2">
                        <Label className="text-xs uppercase text-muted-foreground tracking-widest">Total CAPEX Prediction</Label>
                        <div className="text-4xl font-black text-primary">₹{estimation.budgetRange.min}-{estimation.budgetRange.max}</div>
                        <p className="text-[10px] text-white/40 italic">Lakhs (Projected Base)</p>
                    </Card>
                    <Card className="p-6 border-white/5 bg-white/5 text-center space-y-2">
                        <Label className="text-xs uppercase text-muted-foreground tracking-widest">Structural Footprint</Label>
                        <div className="text-xl font-bold">{estimation.dimensions.primary}</div>
                        <p className="text-[10px] text-white/40 uppercase">Optimized Grid</p>
                    </Card>
                    <Card className="p-6 border-white/5 bg-white/5 text-center space-y-2">
                        <Label className="text-xs uppercase text-muted-foreground tracking-widest">Sustainability Target</Label>
                        <div className="text-3xl font-black text-green-400">{estimation.sustainability_score}%</div>
                        <p className="text-[10px] text-white/40 uppercase">Eco-Efficiency Index</p>
                    </Card>
                  </div>

                  <Card className="p-8 border-white/5 bg-white/5 divide-y divide-white/10">
                    <div className="pb-6 grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h4 className="font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Core Reasoning</h4>
                          <ul className="space-y-3">
                            {estimation.reasoning.map((r, i) => (
                              <li key={i} className="flex gap-3 text-sm text-white/70">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                {r}
                              </li>
                            ))}
                          </ul>
                       </div>
                       <div className="space-y-4">
                          <h4 className="font-bold flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Resource Allocation</h4>
                          <div className="space-y-4">
                            {Object.entries(estimation.breakdown).slice(0, 4).map(([key, val]) => (
                              <div key={key} className="space-y-1.5">
                                <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                                  <span>{key.replace('_', ' ')}</span>
                                  <span>₹{val}L</span>
                                </div>
                                <Progress value={(val / (estimation.budgetRange.max || 1)) * 100} className="h-1 bg-white/5" />
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>
                  </Card>

                  <div className="flex justify-between items-center">
                    <Button variant="ghost" className="h-14 px-8 text-white/50" onClick={handleBack}>Adjust Details</Button>
                    <Button 
                      className="h-14 px-12 bg-white text-black hover:bg-white/90 shadow-[0_4px_30px_rgba(255,255,255,0.2)] font-black text-lg" 
                      onClick={handleGenerateDesigns}
                      disabled={isGenerating}
                    >
                      {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin mr-3" /> Synthesizing Architectural Variants...</> : "Generate AI-Ready Design Assets"}
                    </Button>
                  </div>
                </div>
              )}
            </main>

            {/* Sidebar Context */}
            <aside className="hidden lg:block">
              <div className="sticky top-8 space-y-6">
                <Card className="p-1 border-white/5 bg-white/5 backdrop-blur-2xl overflow-hidden">
                  <div className="bg-primary/10 p-6 space-y-4">
                    <BrainCircuit className="text-primary w-10 h-10" />
                    <h3 className="font-bold text-lg leading-tight">Advanced SIID AEC Workflow v4.2</h3>
                    <p className="text-xs text-white/50 leading-relaxed">Leveraging distributed ML models for real-time cost regression and structural topology optimization.</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Active Engine Specs</Label>
                      <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-xs">
                          <ShieldCheck className="text-green-500 w-4 h-4" />
                          <span>NBC 2016 Safety Compliance</span>
                        </li>
                        <li className="flex items-center gap-3 text-xs">
                          <TrendingUp className="text-primary w-4 h-4" />
                          <span>Inflation-Agnostic Pricing</span>
                        </li>
                        <li className="flex items-center gap-3 text-xs">
                          <Droplets className="text-blue-400 w-4 h-4" />
                          <span>Universal MEP Standard Mapping</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* Live Stats Mockup */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-white/5">
                   <h4 className="text-sm font-bold mb-4">Engineering Meta</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-white/40">ML Confidence</span>
                        <span className="text-xs font-mono text-primary">94.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-white/40">Market Data Freshness</span>
                        <span className="text-xs font-mono text-green-400">14m ago</span>
                      </div>
                   </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Dynamic Background Noise */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </AuthGuard>
  )
}
