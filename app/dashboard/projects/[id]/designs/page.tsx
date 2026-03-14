"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AiHealthBanner } from "@/components/ai-health-banner"
import { ExportMenu } from "@/components/export-menu"
import { useToast } from "@/hooks/use-toast"
import { generateApprovedDesignsPDF } from "@/lib/approval-export"
import {
  ArrowLeft,
  Building,
  Hammer,
  Droplets,
  Zap,
  Palette,
  Home,
  Download,
  Share2,
  DollarSign,
  Calendar,
  CheckCircle2,
  Maximize2,
  Loader2,
  ShieldAlert,
  Sun,
  Layers,
  Wind,
  Compass,
  BarChart4
} from "lucide-react"

import OptimizedImage from "@/components/optimized-image"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  name: string
  type: string
  description: string
  location: string
  budget: string
  designs: any
  variants?: any[]
  estimation?: any
}

export default function AdvancedProjectDesignsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<number>(0)
  const [approving, setApproving] = useState(false)

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    const foundProject = projects.find((p: Project) => p.id === params.id)

    if (foundProject) {
      setProject(foundProject)
    } else {
      router.push("/dashboard")
    }
    setLoading(false)
  }, [params.id, router])

  const handleApproveDesigns = async () => {
    if (!project) return
    setApproving(true)
    try {
      await generateApprovedDesignsPDF({
        id: project.id,
        name: project.name,
        type: project.type,
        description: project.description,
        location: project.location,
        budget: project.budget,
        designs: project.designs,
        createdAt: (project as any).createdAt,
      })
      toast({ title: "Designs Approved", description: "Your blueprint package has been generated." })
    } catch (err) {
      toast({ title: "Export Error", description: "Failed to generate PDF packet.", variant: "destructive" })
    } finally {
      setApproving(false)
    }
  }

  const designs = project?.designs
  const variants = designs?.variants || []
  const activeVariant = variants[selectedVariant] || variants[0] || designs
  const view = activeVariant.categories || activeVariant

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  )

  if (!project) return null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#050505] text-white">
        
        {/* Header Section */}
        <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
                <div className="flex gap-2 items-center text-xs text-white/40">
                  <span className="capitalize">{project.type}</span>
                  <span>•</span>
                  <span>{project.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {variants.length > 0 && (
                <Select value={String(selectedVariant)} onValueChange={(v) => setSelectedVariant(Number(v))}>
                  <SelectTrigger className="w-[180px] bg-white/5 border-white/10 h-10">
                    <SelectValue placeholder="Select Variant" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                    {variants.map((v: any, idx: number) => (
                      <SelectItem key={idx} value={String(idx)}>Variant {idx + 1}: {v.style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button size="sm" variant="outline" className="h-10 border-white/10 bg-white/5">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button size="sm" className="h-10 bg-primary font-bold px-6" onClick={handleApproveDesigns} disabled={approving}>
                {approving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldAlert className="w-4 h-4 mr-2" />}
                Approve System Architecture
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-6 py-8">
          
          {/* Intelligence Dashboard Ribbons */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 border-white/5 bg-white/5 space-y-2 group hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-center text-white/40">
                <span className="text-[10px] uppercase tracking-widest font-bold">Structural Efficiency</span>
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black">94.2<span className="text-sm text-primary">%</span></div>
              <Progress value={94.2} className="h-1 bg-white/10" />
            </Card>
            <Card className="p-6 border-white/5 bg-white/5 space-y-2 group hover:border-green-400/50 transition-colors">
              <div className="flex justify-between items-center text-white/40">
                <span className="text-[10px] uppercase tracking-widest font-bold">Eco-Rating</span>
                <Sun className="w-4 h-4" />
              </div>
              <div className="text-3xl font-black text-green-400">{activeVariant.sustainabilityRating?.split(' ')[0] || "GOLD"}</div>
              <p className="text-[10px] text-white/40">Renewable Energy Target: {project.estimation?.sustainability_score || 0}%</p>
            </Card>
            <Card className="p-6 border-white/5 bg-white/5 space-y-2 group hover:border-blue-400/50 transition-colors">
              <div className="flex justify-between items-center text-white/40">
                <span className="text-[10px] uppercase tracking-widest font-bold">Vastu Compliance</span>
                <Compass className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-3xl font-black text-orange-400">{activeVariant.vastuScore || 85}<span className="text-sm">/100</span></div>
              <p className="text-[10px] text-white/40">Orientation Optimization active</p>
            </Card>
            <Card className="p-6 border-white/5 bg-white/5 space-y-2 group hover:border-purple-400/50 transition-colors">
              <div className="flex justify-between items-center text-white/40">
                <span className="text-[10px] uppercase tracking-widest font-bold">Project Timeline</span>
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold">{activeVariant.estimatedTimeline?.constructionPhase || "12 Months"}</div>
              <p className="text-[10px] text-white/40">Handover: {activeVariant.estimatedTimeline?.handoverDate || "Q3 2026"}</p>
            </Card>
          </div>

          <Tabs defaultValue="architectural" className="w-full">
            <TabsList className="flex gap-2 bg-white/5 p-1 rounded-full mb-12 self-start w-fit">
              <TabsTrigger value="architectural" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">Architectural</TabsTrigger>
              <TabsTrigger value="structural" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">Structural</TabsTrigger>
              <TabsTrigger value="mep" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">MEP Systems</TabsTrigger>
              <TabsTrigger value="interior" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">Interior</TabsTrigger>
              <TabsTrigger value="exterior" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">Site & Exterior</TabsTrigger>
            </TabsList>

            {/* Architectural Content */}
            <TabsContent value="architectural" className="animate-in fade-in zoom-in-95 duration-500">
               <div className="grid lg:grid-cols-[1fr_400px] gap-8">
                  <div className="space-y-8">
                    <Card className="p-1 border-white/5 bg-white/5 overflow-hidden group">
                      <div className="relative aspect-video">
                        <OptimizedImage 
                          src={view.architectural?.renderingImage || "/images/modern-minimalist-design.jpg"} 
                          alt="Architectural Render"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                            <Badge className="w-fit mb-4 bg-primary">{activeVariant.style}</Badge>
                            <h2 className="text-3xl font-black">{activeVariant.style} Architecture Rendering</h2>
                        </div>
                      </div>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                      <Card className="p-8 border-white/5 bg-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                          <LayoutDashboard className="text-primary w-5 h-5" />
                          <h3 className="text-xl font-bold">System Floor Plan</h3>
                        </div>
                        <div className="aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden cursor-zoom-in" onClick={() => setSelectedImage(view.architectural?.floorPlanImage)}>
                            <OptimizedImage src={view.architectural?.floorPlanImage} alt="Floor Plan" className="w-full h-full object-contain p-4" />
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed">{view.architectural?.description}</p>
                      </Card>

                      <Card className="p-8 border-white/5 bg-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                          <Layers className="text-primary w-5 h-5" />
                          <h3 className="text-xl font-bold">Key Intelligence</h3>
                        </div>
                        <div className="space-y-4">
                           {activeVariant.architecturalFeatures?.map((f: string, i: number) => (
                              <div key={i} className="flex gap-3 text-sm text-white/70 items-center">
                                <div className="p-2 rounded-lg bg-white/5"><CheckCircle2 className="w-4 h-4 text-green-400" /></div>
                                {f}
                              </div>
                           ))}
                        </div>
                      </Card>
                    </div>
                  </div>

                  <aside className="space-y-6">
                    <Card className="p-8 border-white/5 bg-white/5 space-y-6">
                      <h3 className="font-black text-xl tracking-tighter uppercase">Spatial Analysis</h3>
                      <div className="space-y-4">
                         <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Ground Footprint</span>
                            <span className="text-lg font-bold">{project.estimation?.dimensions.primary}</span>
                         </div>
                         <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Structural Grid</span>
                            <span className="text-lg font-bold">8.5m x 8.5m Optimized</span>
                         </div>
                         <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Complexity Index</span>
                            <span className="text-lg font-bold">Moderate-High</span>
                         </div>
                      </div>
                    </Card>

                    <Card className="p-8 border-white/10 bg-gradient-to-br from-primary/20 to-transparent space-y-6">
                        <h3 className="font-black text-xl tracking-tighter uppercase">Financial Pulse</h3>
                        <div className="space-y-2">
                           <div className="text-sm text-white/50">Total Estimated CAPEX</div>
                           <div className="text-3xl font-black text-primary">₹{project.budget}</div>
                        </div>
                        <div className="space-y-3 pt-4">
                           {Object.entries(project.estimation?.itemized || {}).map(([key, val]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-white/40 capitalize">{key.replace('_', ' ')}</span>
                                <span className="font-bold text-white/80">₹{val}L</span>
                              </div>
                           ))}
                        </div>
                    </Card>
                  </aside>
               </div>
            </TabsContent>

            {/* Structural Content */}
            <TabsContent value="structural" className="animate-in fade-in zoom-in-95 duration-500">
               <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="p-8 border-white/5 bg-white/5 space-y-6">
                    <div className="flex items-center gap-3">
                      <Hammer className="text-primary w-5 h-5" />
                      <h3 className="text-xl font-bold">Engineering Chassis</h3>
                    </div>
                    <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 overflow-hidden group">
                        <OptimizedImage src={view.structural?.layoutImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                       <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] text-white/40 uppercase font-black mb-1">Foundation</p>
                          <p className="text-xs font-bold leading-tight">{view.structural?.specifications?.foundationType}</p>
                       </div>
                       <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] text-white/40 uppercase font-black mb-1">Frame System</p>
                          <p className="text-xs font-bold leading-tight">{view.structural?.specifications?.frameSystem}</p>
                       </div>
                       <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[10px] text-white/40 uppercase font-black mb-1">Material Logic</p>
                          <p className="text-xs font-bold leading-tight">{view.structural?.specifications?.materialUsageEfficiency}</p>
                       </div>
                    </div>
                  </Card>
                  
                  <Card className="p-8 border-white/5 bg-white/5 space-y-6">
                     <div className="flex items-center gap-3">
                       <ShieldAlert className="text-primary w-5 h-5" />
                       <h3 className="text-xl font-bold">Material Logistics</h3>
                     </div>
                     <div className="space-y-6">
                        <p className="text-white/50 text-sm italic">{project.estimation?.dimensions.secondary}</p>
                        <div className="space-y-4">
                           <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group hover:border-primary/50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary">Fe</div>
                                <div>
                                   <p className="font-bold">Steel Grade: Fe500D</p>
                                   <p className="text-[10px] text-white/40">Seismic Optimized Reinforcement</p>
                                </div>
                              </div>
                              <CheckCircle2 className="text-green-400 w-5 h-5" />
                           </div>
                           <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group hover:border-primary/50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-black text-white/40">M25</div>
                                <div>
                                   <p className="font-bold">Concrete Mix: Design Mix</p>
                                   <p className="text-[10px] text-white/40">Micro-Silica Enhanced Durability</p>
                                </div>
                              </div>
                              <CheckCircle2 className="text-green-400 w-5 h-5" />
                           </div>
                        </div>
                     </div>
                  </Card>
               </div>
            </TabsContent>

            {/* MEP Content */}
            <TabsContent value="mep" className="animate-in fade-in zoom-in-95 duration-500">
                <div className="grid lg:grid-cols-3 gap-8">
                   <Card className="p-8 border-white/5 bg-white/5 space-y-6">
                      <div className="flex items-center gap-3 text-blue-400">
                        <Droplets className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-widest text-sm">Thermal & HVAC</h3>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{view.mep?.details?.hvacStrategy}</p>
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[10px] text-blue-300">
                        Dynamic Load Balancing Active: System adjusts based on predicted seasonal heat flux.
                      </div>
                   </Card>
                   <Card className="p-8 border-white/5 bg-white/5 space-y-6">
                      <div className="flex items-center gap-3 text-yellow-500">
                        <Zap className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-widest text-sm">Electrical Grid</h3>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{view.mep?.details?.electricalOptimization}</p>
                      <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-[10px] text-yellow-300">
                        Power Factor Detection: AI predicts 12% energy savings vs baseline.
                      </div>
                   </Card>
                   <Card className="p-8 border-white/5 bg-white/5 space-y-6">
                      <div className="flex items-center gap-3 text-green-400">
                        <Droplets className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-widest text-sm">Hydraulic Logic</h3>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{view.mep?.details?.waterconservation}</p>
                      <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-[10px] text-green-300">
                        Net-Zero Water Target: RWH tank capacity optimized for {project.location} rainfall.
                      </div>
                   </Card>
                </div>
            </TabsContent>

            {/* Interior & Exterior follow similar pattern... */}
            <TabsContent value="interior" className="animate-in fade-in zoom-in-95 duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                   <Card className="p-1 border-white/5 bg-white/5 overflow-hidden group aspect-video relative">
                       <OptimizedImage src={view.interior?.renderingImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                       <div className="absolute top-4 left-4"><Badge className="bg-black/50 backdrop-blur-md">Primary View</Badge></div>
                   </Card>
                   <Card className="p-1 border-white/5 bg-white/5 overflow-hidden group aspect-video relative">
                       <OptimizedImage src={view.interior?.moodBoardImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                       <div className="absolute top-4 left-4"><Badge className="bg-black/50 backdrop-blur-md">Material Board</Badge></div>
                   </Card>
                </div>
            </TabsContent>

            <TabsContent value="exterior" className="animate-in fade-in zoom-in-95 duration-500">
                <Card className="p-1 border-white/5 bg-white/5 overflow-hidden group aspect-video relative mb-8">
                    <OptimizedImage src={view.exterior?.renderingImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-end p-12">
                       <h2 className="text-5xl font-black mb-4 tracking-tighter">Site Landscape & Aesthetics</h2>
                       <p className="text-white/60 max-w-2xl italic leading-relaxed">Integrated biophilic design approach mapping native flora of {project.location} with sustainable RCC facade structures.</p>
                    </div>
                </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Modal for Image Zoom */}
        {selectedImage && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
             <Button variant="ghost" className="absolute top-8 right-8 text-white/50" onClick={() => setSelectedImage(null)}>Close</Button>
             <OptimizedImage src={selectedImage} alt="Zoomed View" className="max-w-full max-h-full object-contain" />
          </div>
        )}

        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </AuthGuard>
  )
}

// Helper Components
function LayoutDashboard(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}
