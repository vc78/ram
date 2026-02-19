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
} from "lucide-react"

import OptimizedImage from "@/components/optimized-image"

interface Project {
  id: string
  name: string
  type: string
  description: string
  location: string
  budget: string
  designs: any
  variants?: any[]
}

export default function ProjectDesignsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)
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

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      setDownloading(filename)
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download image. Please try again.")
    } finally {
      setDownloading(null)
    }
  }

  const handleShareProject = async () => {
    const url = window.location.href
    const shareData = {
      title: `${project?.name} - Design Plans`,
      text: `Check out the design plans for ${project?.name} - a ${project?.type} project in ${project?.location}`,
      url: url,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast({
          title: "Project shared",
          description: "The project designs have been shared successfully.",
        })
      } else {
        try {
          await navigator.clipboard.writeText(url)
          toast({
            title: "Link copied",
            description: "Project link has been copied to your clipboard.",
          })
        } catch (clipboardError) {
          // Fallback for clipboard API
          const textarea = document.createElement("textarea")
          textarea.value = url
          textarea.style.position = "fixed"
          textarea.style.left = "-9999px"
          document.body.appendChild(textarea)
          textarea.select()
          try {
            document.execCommand("copy")
            toast({
              title: "Link copied",
              description: "Project link has been copied to your clipboard.",
            })
          } catch {
            toast({
              title: "Copy failed",
              description: "Could not copy link. Please try again.",
              variant: "destructive",
            })
          }
          document.body.removeChild(textarea)
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Failed to share",
          description: "Could not share the project. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

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

      toast({
        title: "Designs Approved",
        description: "Your approved design package PDF has been generated and downloaded.",
      })
    } catch (error) {
      console.error("Failed to generate approved designs PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate approved designs PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setApproving(false)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading designs...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!project) return null

  const { designs } = project

  // Support both legacy single-design shape and new multi-variant shape
  const hasVariants = Array.isArray(designs?.variants) && designs.variants.length > 0
  const safeIndex = Math.min(selectedVariant, hasVariants ? designs.variants.length - 1 : 0)
  const active = hasVariants ? designs.variants[safeIndex] : null
  const view = hasVariants ? active.categories : designs

  const ImageViewer = ({ src, onClose }: { src: string; onClose: () => void }) => (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <OptimizedImage
        src={src || "/images/modern-minimalist-design.jpg"}
        alt="Full size view"
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
      />
    </div>
  )

  const ImageCard = ({ src, alt, title, filename }: { src: string; alt: string; title: string; filename: string }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden border border-border shadow-lg group">
        <OptimizedImage
          src={src || "/images/modern-minimalist-design.jpg"}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <button
          onClick={() => setSelectedImage(src)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-transparent"
          onClick={() => downloadImage(src, filename)}
          disabled={downloading === filename}
        >
          {downloading === filename ? (
            <>
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSelectedImage(src)}>
          <Maximize2 className="w-4 h-4 mr-2" />
          View Full
        </Button>
      </div>
    </div>
  )

  const InteriorRoomGallery = ({
    views,
  }: { views: Array<{ room: string; angle: string; timeOfDay: string; image: string }> }) => {
    if (!Array.isArray(views) || views.length === 0) return null
    // group by room
    const groups = views.reduce((acc: Record<string, typeof views>, v) => {
      acc[v.room] = acc[v.room] || []
      acc[v.room].push(v)
      return acc
    }, {})
    return (
      <div className="space-y-6 mt-6">
        <h3 className="text-xl font-semibold">Room Galleries</h3>
        <div className="space-y-8">
          {Object.entries(groups).map(([room, items]) => (
            <div key={room}>
              <h4 className="text-lg font-semibold mb-3">{room}</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {items.map((it, idx) => (
                  <ImageCard
                    key={`${room}-${idx}`}
                    src={it.image || "/placeholder.svg"}
                    alt={`${room} • ${it.angle} • ${it.timeOfDay}`}
                    title={`${room} • ${it.angle} • ${it.timeOfDay}`}
                    filename={`${project.name.replace(/\s+/g, "-")}-${room.toLowerCase().replace(/\s+/g, "-")}-${it.angle}-${it.timeOfDay}.jpg`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const ExteriorAngleGallery = ({ views }: { views: Array<{ angle: string; timeOfDay: string; image: string }> }) => {
    if (!Array.isArray(views) || views.length === 0) return null
    return (
      <div className="space-y-6 mt-6">
        <h3 className="text-xl font-semibold">Exterior Angles & Times</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {views.map((it, idx) => (
            <ImageCard
              key={`ext-${idx}`}
              src={it.image || "/placeholder.svg"}
              alt={`Exterior • ${it.angle} • ${it.timeOfDay}`}
              title={`${it.angle} • ${it.timeOfDay}`}
              filename={`${project.name.replace(/\s+/g, "-")}-exterior-${it.angle}-${it.timeOfDay}.jpg`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* show mock mode banner when real AI is disabled */}
        <AiHealthBanner className="mb-6" />
        <header className="border-b border-border bg-background/95 backdrop-filter: blur(12px) supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-[-2px] duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-lg font-semibold">{project.name}</h1>
                <p className="text-sm text-muted-foreground capitalize">{project.type} Project</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasVariants && (
                <div className="flex w-full max-w-[260px]">
                  <Select value={String(safeIndex)} onValueChange={(v) => setSelectedVariant(Number(v))}>
                    <SelectTrigger className="w-[260px]">
                      <SelectValue placeholder="Select variant" defaultValue={String(safeIndex)} />
                    </SelectTrigger>
                    <SelectContent>
                      {designs.variants.map((v: any, idx: number) => (
                        <SelectItem key={v.id || idx} value={String(idx)}>
                          {`${v.provider?.toUpperCase?.() || "AI"} • ${v.model || "model"} • Variant ${v.variant || idx + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform bg-transparent"
                onClick={handleShareProject}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <ExportMenu project={project} variant="outline" size="sm" />
              <Button
                size="sm"
                className="bg-accent hover:bg-accent-dark text-white hover:scale-105 transition-transform"
                onClick={handleApproveDesigns}
                disabled={approving}
              >
                {approving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                {approving ? "Generating..." : "Approve Designs"}
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 border-border bg-gradient-to-br from-background to-muted/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <p className="text-sm text-muted-foreground mb-1">Location</p>
              <p className="font-semibold">{project.location}</p>
            </Card>
            <Card className="p-4 border-border bg-gradient-to-br from-background to-muted/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <p className="text-sm text-muted-foreground mb-1">Budget</p>
              <p className="font-semibold">{project.budget}</p>
            </Card>
            <Card className="p-4 border-border bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <p className="text-sm text-muted-foreground mb-1">Est. Cost</p>
              <p className="font-semibold text-primary">
                ${(hasVariants ? active.estimatedCost.total : designs.estimatedCost.total).toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 border-border bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <p className="text-sm text-muted-foreground mb-1">Timeline</p>
              <p className="font-semibold text-accent">
                {hasVariants ? active.timeline.total : designs.timeline.total}
              </p>
            </Card>
          </div>

          <Tabs defaultValue="architectural" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger
                value="architectural"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Building className="w-4 h-4 mr-2" />
                Architectural
              </TabsTrigger>
              <TabsTrigger
                value="structural"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Hammer className="w-4 h-4 mr-2" />
                Structural
              </TabsTrigger>
              <TabsTrigger value="plumbing" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Droplets className="w-4 h-4 mr-2" />
                Plumbing
              </TabsTrigger>
              <TabsTrigger
                value="electrical"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                Electrical
              </TabsTrigger>
              <TabsTrigger value="interior" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Palette className="w-4 h-4 mr-2" />
                Interior
              </TabsTrigger>
              <TabsTrigger value="exterior" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Home className="w-4 h-4 mr-2" />
                Exterior
              </TabsTrigger>
            </TabsList>

            {/* Architectural Design */}
            <TabsContent value="architectural" className="space-y-6 animate-fade-in">
              <Card className="p-6 border-border bg-background/50 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Building className="w-6 h-6 text-primary" />
                  Architectural Design
                </h2>

                <div className="space-y-8">
                  <ImageCard
                    src={view.architectural.floorPlanImage || "/images/modern-minimalist-design.jpg"}
                    title="Floor Plan Diagram"
                    filename={`${project.name.replace(/\s+/g, "-")}-architectural-floor-plan.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Floor Plan</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.architectural.floorPlan}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Layout</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.architectural.layout}</p>
                  </div>

                  <ImageCard
                    src={view.architectural.renderingImage || "/images/modern-minimalist-design.jpg"}
                    alt="3D Architectural Rendering"
                    title="3D Architectural Rendering"
                    filename={`${project.name.replace(/\s+/g, "-")}-architectural-rendering.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Room Dimensions</h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {view.architectural.dimensions.rooms.map((room: any, idx: number) => (
                        <Card
                          key={idx}
                          className="p-4 border-border bg-gradient-to-br from-muted/50 to-muted/30 hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          <p className="font-semibold">{room.name}</p>
                          <p className="text-sm text-muted-foreground">{room.dimensions}</p>
                          <p className="text-sm text-muted-foreground">{room.area} sq ft</p>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-muted-foreground">Total Area</p>
                      <p className="text-2xl font-bold text-primary">{view.architectural.dimensions.totalArea} sq ft</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {view.architectural.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Structural Design */}
            <TabsContent value="structural" className="space-y-6 animate-fade-in">
              <Card className="p-6 border-border bg-background/50 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Hammer className="w-6 h-6 text-primary" />
                  Structural Engineering
                </h2>

                <div className="space-y-8">
                  <ImageCard
                    src={view.structural.layoutImage || "/images/modern-minimalist-design.jpg"}
                    alt="Structural Layout"
                    title="Structural Layout Diagram"
                    filename={`${project.name.replace(/\s+/g, "-")}-structural-layout.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Foundation</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.structural.foundation}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Framework</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.structural.framework}</p>
                  </div>

                  <ImageCard
                    src={view.structural.detailImage || "/images/modern-minimalist-design.jpg"}
                    alt="Structural Details"
                    title="Structural Detail Diagram"
                    filename={`${project.name.replace(/\s+/g, "-")}-structural-details.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Materials</h3>
                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                      {view.structural.materials.map((material: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          <p className="text-sm">{material}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Load-Bearing Elements</h3>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {view.structural.loadBearing.map((element: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{element}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.structural.specifications}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Plumbing Design */}
            <TabsContent value="plumbing" className="space-y-6 animate-fade-in">
              <Card className="p-6 border-border bg-background/50 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Droplets className="w-6 h-6 text-primary" />
                  Plumbing Systems
                </h2>

                <div className="space-y-8">
                  <ImageCard
                    src={view.plumbing.layoutImage || "/images/modern-minimalist-design.jpg"}
                    alt="Plumbing Layout"
                    title="Plumbing Layout Diagram"
                    filename={`${project.name.replace(/\s+/g, "-")}-plumbing-layout.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Water Supply</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.plumbing.waterSupply}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Drainage System</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.plumbing.drainage}</p>
                  </div>

                  <ImageCard
                    src={view.plumbing.isometricImage || "/images/modern-minimalist-design.jpg"}
                    alt="Plumbing Isometric View"
                    title="Plumbing Isometric Diagram"
                    filename={`${project.name.replace(/\s+/g, "-")}-plumbing-isometric.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Fixtures</h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {view.plumbing.fixtures.map((fixture: any, idx: number) => (
                        <Card
                          key={idx}
                          className="p-4 border-border bg-gradient-to-br from-muted/50 to-muted/30 hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          <p className="font-semibold">{fixture.room}</p>
                          <p className="text-sm text-muted-foreground">{fixture.type}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {fixture.quantity}</p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Piping Layout</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.plumbing.pipingLayout}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.plumbing.specifications}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Electrical Design */}
            <TabsContent value="electrical" className="space-y-6 animate-fade-in">
              <Card className="p-6 border-border bg-background/50 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-primary" />
                  Electrical Systems
                </h2>

                <div className="space-y-8">
                  <ImageCard
                    src={view.electrical.layoutImage || "/images/modern-minimalist-design.jpg"}
                    alt="Electrical Layout"
                    title="Electrical Layout Diagram"
                    filename={`${project.name.replace(/\s+/g, "-")}-electrical-layout.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Main Panel</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.electrical.mainPanel}</p>
                  </div>

                  <ImageCard
                    src={view.electrical.singleLineImage || "/images/modern-minimalist-design.jpg"}
                    alt="Electrical Single-Line Diagram"
                    title="Single-Line Diagram"
                    filename={`${project.name.replace(/\s+/g, "-")}-electrical-single-line.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Circuits</h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {view.electrical.circuits.map((circuit: any, idx: number) => (
                        <Card
                          key={idx}
                          className="p-4 border-border bg-gradient-to-br from-muted/50 to-muted/30 hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          <p className="font-semibold">{circuit.area}</p>
                          <p className="text-sm text-muted-foreground">Load: {circuit.load}</p>
                          <p className="text-sm text-muted-foreground">Outlets: {circuit.outlets}</p>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Lighting Design</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.electrical.lighting}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.electrical.specifications}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Interior Design */}
            <TabsContent value="interior" className="space-y-6 animate-fade-in">
              <Card className="p-6 border-border bg-background/50 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Palette className="w-6 h-6 text-primary" />
                  Interior Design
                </h2>

                <div className="space-y-8">
                  <ImageCard
                    src={view.interior.renderingImage || "/images/modern-minimalist-design.jpg"}
                    alt="Interior Design Rendering"
                    title="Interior Design Rendering"
                    filename={`${project.name.replace(/\s+/g, "-")}-interior-rendering.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Design Style</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.interior.style}</p>
                  </div>

                  <ImageCard
                    src={view.interior.moodBoardImage || "/images/modern-minimalist-design.jpg"}
                    alt="Interior Design Mood Board"
                    title="Design Mood Board"
                    filename={`${project.name.replace(/\s+/g, "-")}-interior-moodboard.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Color Palette</h3>
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {view.interior.colorPalette.map((color: string, idx: number) => (
                        <div key={idx} className="flex flex-col items-center gap-2 group">
                          <div
                            className="w-20 h-20 rounded-xl border-2 border-border shadow-lg group-hover:scale-110 transition-transform duration-300"
                            style={{ backgroundColor: color }}
                          />
                          <p className="text-xs text-muted-foreground font-mono">{color}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Materials & Finishes</h3>
                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                      {view.interior.materials.map((material: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          <p className="text-sm">{material}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Furniture Layout</h3>
                    <div className="space-y-4 mt-4">
                      {view.interior.furniture.map((room: any, idx: number) => (
                        <Card
                          key={idx}
                          className="p-4 border-border bg-gradient-to-br from-muted/50 to-muted/30 hover:shadow-md transition-all duration-300"
                        >
                          <p className="font-semibold mb-2">{room.room}</p>
                          <ul className="grid md:grid-cols-2 gap-2">
                            {room.items.map((item: string, itemIdx: number) => (
                              <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Lighting</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.interior.lighting}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Special Features</h3>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {view.interior.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {Array.isArray(view.interior.roomViews) && view.interior.roomViews.length > 0 && (
                    <InteriorRoomGallery views={view.interior.roomViews as any} />
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Exterior Design */}
            <TabsContent value="exterior" className="space-y-6 animate-fade-in">
              <Card className="p-6 border-border bg-background/50 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Home className="w-6 h-6 text-primary" />
                  Exterior Design
                </h2>

                <div className="space-y-8">
                  <ImageCard
                    src={view.exterior.renderingImage || "/images/modern-minimalist-design.jpg"}
                    alt="Exterior Design Rendering"
                    title="Exterior Design Rendering"
                    filename={`${project.name.replace(/\s+/g, "-")}-exterior-rendering.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Facade Design</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.exterior.facade}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Roofing</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.exterior.roofing}</p>
                  </div>

                  <ImageCard
                    src={view.exterior.landscapingImage || "/images/modern-minimalist-design.jpg"}
                    alt="Landscaping Plan"
                    title="Landscaping Site Plan"
                    filename={`${project.name.replace(/\s+/g, "-")}-landscaping-plan.jpg`}
                  />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Landscaping</h3>
                    <p className="text-muted-foreground leading-relaxed">{view.exterior.landscaping}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Outdoor Features</h3>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {view.exterior.outdoor.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Exterior Materials</h3>
                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                      {view.exterior.materials.map((material: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          <p className="text-sm">{material}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {Array.isArray(view.exterior.angleViews) && view.exterior.angleViews.length > 0 && (
                    <ExteriorAngleGallery views={view.exterior.angleViews as any} />
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="p-6 border-border bg-gradient-to-br from-background to-primary/5 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Cost Estimation</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Construction</span>
                  <span className="font-semibold">
                    $
                    {(hasVariants
                      ? active.estimatedCost.construction
                      : designs.estimatedCost.construction
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Materials</span>
                  <span className="font-semibold">
                    ${(hasVariants ? active.estimatedCost.materials : designs.estimatedCost.materials).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Labor</span>
                  <span className="font-semibold">
                    ${(hasVariants ? active.estimatedCost.labor : designs.estimatedCost.labor).toLocaleString()}
                  </span>
                </div>
                <div className="pt-3 border-t-2 border-primary/20 flex justify-between p-3 bg-primary/10 rounded-lg">
                  <span className="font-bold">Total Estimated Cost</span>
                  <span className="font-bold text-primary text-xl">
                    ${(hasVariants ? active.estimatedCost.total : designs.estimatedCost.total).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border bg-gradient-to-br from-background to-accent/5 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Project Timeline</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Design Phase</span>
                  <span className="font-semibold">
                    {hasVariants ? active.timeline.design : designs.timeline.design}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Permits & Approvals</span>
                  <span className="font-semibold">
                    {hasVariants ? active.timeline.permits : designs.timeline.permits}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Construction</span>
                  <span className="font-semibold">
                    {hasVariants ? active.timeline.construction : designs.timeline.construction}
                  </span>
                </div>
                <div className="pt-3 border-t-2 border-accent/20 flex justify-between p-3 bg-accent/10 rounded-lg">
                  <span className="font-bold">Total Duration</span>
                  <span className="font-bold text-accent text-xl">
                    {hasVariants ? active.timeline.total : designs.timeline.total}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {selectedImage && (
          <ImageViewer src={selectedImage || "/images/modern-minimalist-design.jpg"} onClose={() => setSelectedImage(null)} />
        )}
      </div>
    </AuthGuard>
  )
}
