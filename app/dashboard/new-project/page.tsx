"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Home,
  Building2,
  Sparkles,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Zap,
  Plane,
  Landmark,
  Factory,
  Trees,
  Hospital,
  School,
  Bus,
  Hotel,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AiHealthBanner } from "@/components/ai-health-banner"

type ProjectStage = "moderate" | "intermediate" | "premium"
type ProjectSize = "small" | "medium" | "large"
type MaterialQuality = "economical" | "standard" | "premium"

interface BudgetEstimation {
  stage: ProjectStage
  budgetRange: { min: number; max: number }
  breakdown: {
    materials: number
    labor: number
    technology: number
    design: number
    contingency: number
  }
  reasoning: string[]
}

type ProjectCategory =
  | "residential"
  | "commercial"
  | "institutional"
  | "industrial"
  | "airport"
  | "dam"
  | "playground"
  | "education"
  | "hospitality"
  | "transport"
  | "civic"

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // Added step state for multi-step form
  const [projectType, setProjectType] = useState<ProjectCategory | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [budgetEstimation, setBudgetEstimation] = useState<BudgetEstimation | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    budget: "",
  })

  const [requirements, setRequirements] = useState({
    size: "medium" as ProjectSize,
    features: [] as string[],
    materials: "standard" as MaterialQuality,
    smartOptions: [] as string[],
  })

  const [generationOptions, setGenerationOptions] = useState({
    providers: {
      openai: false,
      anthropic: false,
      xai: false,
    },
    variantsPerProvider: 4 as number,
  })

  const calculateBudget = (): BudgetEstimation => {
    let stage: ProjectStage = "moderate"
    const reasoning: string[] = []

    // Calculate actual square footage based on size
    const sqFtRanges = {
      small: { min: 800, max: 1500, avg: 1150 },
      medium: { min: 1500, max: 3000, avg: 2250 },
      large: { min: 3000, max: 5000, avg: 4000 },
    }
    const sqFt = sqFtRanges[requirements.size].avg

    // Location-based multiplier (detect from location input)
    const location = formData.location.toLowerCase()
    let locationMultiplier = 1.0
    const metroCities = ["mumbai", "delhi", "bangalore", "bengaluru", "hyderabad", "chennai", "pune", "kolkata"]
    const tier1Cities = ["ahmedabad", "surat", "jaipur", "lucknow", "kanpur", "nagpur", "indore", "bhopal"]

    if (metroCities.some((city) => location.includes(city))) {
      locationMultiplier = 1.3
      reasoning.push("Metro city location - higher construction costs")
    } else if (tier1Cities.some((city) => location.includes(city))) {
      locationMultiplier = 1.1
      reasoning.push("Tier-1 city location - moderate construction costs")
    } else {
      locationMultiplier = 0.9
      reasoning.push("Tier-2/3 city location - economical construction costs")
    }

    // Base construction cost per sq ft by category (indicative ranges)
    const ratesPerSqFt: Record<ProjectCategory, number> = {
      residential: 1800,
      commercial: 2200,
      institutional: 2400,
      industrial: 2600,
      airport: 3200,
      dam: 2800, // per built-up area equivalent for civil works (simplified)
      playground: 1400,
      education: 2300,
      hospitality: 2600,
      transport: 2400,
      civic: 2100,
    }

    // Material quality multiplier
    const materialMultiplier: Record<MaterialQuality, number> = {
      economical: 0.8,
      standard: 1.0,
      premium: 1.4,
    }

    const projectTypeKey = projectType || "residential"
    const baseRate = (ratesPerSqFt[projectTypeKey] || 2000) * materialMultiplier[requirements.materials]
    let totalCost = (sqFt * baseRate * locationMultiplier) / 100000

    reasoning.push(`${sqFt} sq ft at ₹${Math.round(baseRate)}/sq ft`)
    reasoning.push(
      `${requirements.materials.charAt(0).toUpperCase() + requirements.materials.slice(1)} quality for ${projectTypeKey}`,
    )

    // Add feature-specific costs (in lakhs)
    const featureCosts: Record<string, number> = {
      "Basic Utilities": 0,
      "Modern Kitchen": projectType === "residential" ? 5 : 8,
      "Luxury Bathrooms": 3,
      "Home Theater": 5,
      "Swimming Pool": 12,
      "Gym/Fitness Center": 4,
      "Landscaped Garden": sqFt * 0.015, // ₹150 per sq ft
    }

    let featuresCost = 0
    requirements.features.forEach((feature) => {
      const cost = featureCosts[feature] || 0
      featuresCost += cost
      if (cost > 0) {
        reasoning.push(`${feature}: +₹${cost.toFixed(1)} lakhs`)
      }
    })
    totalCost += featuresCost

    // Add smart home technology costs (in lakhs)
    const smartCosts: Record<string, number> = {
      "Smart Lighting": 0.8,
      "Climate Control": 1.5,
      "Security System": 2,
      "Voice Assistant Integration": 1.2,
      "Energy Management": 1.8,
      "Automated Blinds": 1,
    }

    let smartCost = 0
    requirements.smartOptions.forEach((option) => {
      const cost = smartCosts[option] || 0
      smartCost += cost
    })

    if (smartCost > 0) {
      totalCost += smartCost
      reasoning.push(`Smart home features: +₹${smartCost.toFixed(1)} lakhs`)
    }

    // Determine stage based on total cost and features
    const featureScore = requirements.features.length
    const smartScore = requirements.smartOptions.length

    if (totalCost < 20 && requirements.materials === "economical" && featureScore <= 2) {
      stage = "moderate"
      reasoning.push("Budget-friendly design with essential features")
    } else if (totalCost >= 40 || requirements.materials === "premium" || smartScore >= 3 || featureScore >= 5) {
      stage = "premium"
      reasoning.push("Luxury project with high-end specifications")
    } else {
      stage = "intermediate"
      reasoning.push("Well-balanced modern design")
    }

    // Add professional fees and contingency
    const designFees = totalCost * 0.08 // 8% for architectural/design
    const contingency = totalCost * 0.12 // 12% contingency
    const totalWithFees = totalCost + designFees + contingency

    // Calculate breakdown
    const materials = Math.round(totalCost * 0.4) // 40% materials
    const labor = Math.round(totalCost * 0.3) // 30% labor
    const technology = Math.round(smartCost + totalCost * 0.05) // Smart tech + 5%
    const design = Math.round(designFees) // Design fees
    const contingencyAmount = Math.round(contingency) // Contingency

    // Create budget range (±10%)
    const min = Math.round(totalWithFees * 0.9)
    const max = Math.round(totalWithFees * 1.1)

    return {
      stage,
      budgetRange: { min, max },
      breakdown: {
        materials,
        labor,
        technology,
        design,
        contingency: contingencyAmount,
      },
      reasoning,
    }
  }

  const handleRequirementsSubmit = () => {
    const estimation = calculateBudget()
    setBudgetEstimation(estimation)
    setFormData((prev) => ({
      ...prev,
      budget: `₹${estimation.budgetRange.min}-${estimation.budgetRange.max} Lakhs`,
    }))
    setStep(4)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const projectId = Date.now().toString()
      const projectData = {
        id: projectId,
        ...formData,
        type: projectType,
        requirements,
        budgetEstimation,
        createdAt: new Date().toISOString(),
      }

      const providers: string[] = []
      if (generationOptions.providers.openai) providers.push("openai/gpt-5-mini")
      if (generationOptions.providers.anthropic) providers.push("anthropic/claude-sonnet-4.5")
      if (generationOptions.providers.xai) providers.push("xai/grok-4-fast")

      const response = await fetch("/api/generate-designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectData,
          options: {
            providers,
            variantsPerProvider: generationOptions.variantsPerProvider,
          },
        }),
      })

      if (!response.ok) throw new Error("Failed to generate designs")

      const { designs } = await response.json()

      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      projects.push({
        ...projectData,
        designs,
        status: "planning",
        progress: 0,
      })
      localStorage.setItem("projects", JSON.stringify(projects))

      router.push(`/dashboard/projects/${projectId}/designs`)
    } catch (error) {
      console.error("[v0] Error creating project:", error)
      alert("Failed to generate designs. Please try again.")
      setIsGenerating(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const toggleFeature = (feature: string) => {
    setRequirements((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const toggleSmartOption = (option: string) => {
    setRequirements((prev) => ({
      ...prev,
      smartOptions: prev.smartOptions.includes(option)
        ? prev.smartOptions.filter((o) => o !== option)
        : [...prev.smartOptions, option],
    }))
  }

  const availableFeatures = [
    "Basic Utilities",
    "Modern Kitchen",
    "Luxury Bathrooms",
    "Home Theater",
    "Swimming Pool",
    "Gym/Fitness Center",
    "Landscaped Garden",
  ]

  const smartOptions = [
    "Smart Lighting",
    "Climate Control",
    "Security System",
    "Voice Assistant Integration",
    "Energy Management",
    "Automated Blinds",
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          {/* AI health banner (visible when real AI is disabled) */}
          <AiHealthBanner className="mb-4" />

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
            <p className="text-muted-foreground">Let's bring your vision to life</p>

            {projectType && (
              <div className="flex items-center gap-2 mt-4">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Step 1: Project Type Selection (expanded) */}
          {step === 1 && !projectType && (
            <div>
              <h2 className="text-xl font-semibold mb-6">What type of project are you planning?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Residential */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("residential")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Home className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Residential</h3>
                  <p className="text-muted-foreground text-sm">Homes, villas, apartments, and housing</p>
                </Card>

                {/* Commercial */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("commercial")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Commercial</h3>
                  <p className="text-muted-foreground text-sm">Offices, retail, complexes</p>
                </Card>

                {/* Institutional */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("institutional")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Landmark className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Institutional</h3>
                  <p className="text-muted-foreground text-sm">Government, museums, cultural</p>
                </Card>

                {/* Industrial */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("industrial")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Factory className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Industrial</h3>
                  <p className="text-muted-foreground text-sm">Plants, warehouses, utilities</p>
                </Card>

                {/* Airport */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("airport")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Plane className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Airport</h3>
                  <p className="text-muted-foreground text-sm">Terminals, ancillary buildings</p>
                </Card>

                {/* Dam / Hydro */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("dam")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Landmark className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Dam / Hydro</h3>
                  <p className="text-muted-foreground text-sm">Dams, spillways, control rooms</p>
                </Card>

                {/* Playground / Sports */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("playground")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Trees className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Playground / Sports</h3>
                  <p className="text-muted-foreground text-sm">Parks, fields, courts, arenas</p>
                </Card>

                {/* Education */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("education")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <School className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Education</h3>
                  <p className="text-muted-foreground text-sm">Schools, colleges, labs</p>
                </Card>

                {/* Hospitality */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("hospitality")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Hotel className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Hospitality</h3>
                  <p className="text-muted-foreground text-sm">Hotels, resorts, convention centers</p>
                </Card>

                {/* Healthcare */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("institutional") // or a dedicated 'healthcare' if desired
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Hospital className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Healthcare</h3>
                  <p className="text-muted-foreground text-sm">Hospitals, clinics, diagnostics</p>
                </Card>

                {/* Transport */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("transport")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Bus className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Transport</h3>
                  <p className="text-muted-foreground text-sm">Stations, depots, interchanges</p>
                </Card>

                {/* Civic */}
                <Card
                  className="p-8 border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    setProjectType("civic")
                    setStep(2)
                  }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Landmark className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Civic</h3>
                  <p className="text-muted-foreground text-sm">Courts, halls, admin blocks</p>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && projectType && (
            <Card className="p-8 border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  {projectType === "residential" ? (
                    <Home className="w-6 h-6 text-primary" />
                  ) : projectType === "commercial" ? (
                    <Building2 className="w-6 h-6 text-primary" />
                  ) : projectType === "institutional" ? (
                    <Landmark className="w-6 h-6 text-primary" />
                  ) : projectType === "industrial" ? (
                    <Factory className="w-6 h-6 text-primary" />
                  ) : projectType === "airport" ? (
                    <Plane className="w-6 h-6 text-primary" />
                  ) : projectType === "dam" ? (
                    <Landmark className="w-6 h-6 text-primary" />
                  ) : projectType === "playground" ? (
                    <Trees className="w-6 h-6 text-primary" />
                  ) : projectType === "education" ? (
                    <School className="w-6 h-6 text-primary" />
                  ) : projectType === "hospitality" ? (
                    <Hotel className="w-6 h-6 text-primary" />
                  ) : projectType === "transport" ? (
                    <Bus className="w-6 h-6 text-primary" />
                  ) : projectType === "civic" ? (
                    <Landmark className="w-6 h-6 text-primary" />
                  ) : (
                    <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary">?</span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold capitalize">{projectType} Project</h2>
                  <button
                    onClick={() => {
                      setProjectType(null)
                      setStep(1)
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Change type
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Modern Villa Design"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your vision and requirements..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button
                    onClick={() => {
                      if (formData.name && formData.description && formData.location) {
                        setStep(3)
                      }
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Continue to Requirements
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Requirements & Features */}
          {step === 3 && (
            <Card className="p-8 border-border">
              <h2 className="text-xl font-semibold mb-6">Project Requirements</h2>

              <div className="space-y-8">
                {/* Project Size */}
                <div className="space-y-3">
                  <Label>Project Size</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {(["small", "medium", "large"] as ProjectSize[]).map((size) => (
                      <Card
                        key={size}
                        className={`p-4 cursor-pointer transition-all ${
                          requirements.size === size
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setRequirements((prev) => ({ ...prev, size }))}
                      >
                        <div className="text-center">
                          <div className="font-semibold capitalize mb-1">{size}</div>
                          <div className="text-xs text-muted-foreground">
                            {size === "small" && "< 1500 sq ft"}
                            {size === "medium" && "1500-3000 sq ft"}
                            {size === "large" && "> 3000 sq ft"}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <Label>Features & Amenities</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableFeatures.map((feature) => (
                      <Card
                        key={feature}
                        className={`p-4 cursor-pointer transition-all ${
                          requirements.features.includes(feature)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => toggleFeature(feature)}
                      >
                        <div className="flex items-center gap-2">
                          {requirements.features.includes(feature) && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          <span className="text-sm">{feature}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Smart Options */}
                <div className="space-y-3">
                  <Label>Smart Home Features</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {smartOptions.map((option) => (
                      <Card
                        key={option}
                        className={`p-4 cursor-pointer transition-all ${
                          requirements.smartOptions.includes(option)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => toggleSmartOption(option)}
                      >
                        <div className="flex items-center gap-2">
                          {requirements.smartOptions.includes(option) && <Zap className="w-4 h-4 text-primary" />}
                          <span className="text-sm">{option}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Material Quality */}
                <div className="space-y-3">
                  <Label>Material Quality</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {(["economical", "standard", "premium"] as MaterialQuality[]).map((quality) => (
                      <Card
                        key={quality}
                        className={`p-4 cursor-pointer transition-all ${
                          requirements.materials === quality
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setRequirements((prev) => ({ ...prev, materials: quality }))}
                      >
                        <div className="text-center">
                          <div className="font-semibold capitalize mb-1">{quality}</div>
                          <div className="text-xs text-muted-foreground">
                            {quality === "economical" && "Budget-friendly"}
                            {quality === "standard" && "Mid-range quality"}
                            {quality === "premium" && "High-end materials"}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button onClick={handleRequirementsSubmit} className="bg-accent hover:bg-accent/90">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Calculate Budget
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Budget Estimation Results */}
          {step === 4 && budgetEstimation && (
            <div className="space-y-6">
              <Card className="p-8 border-border bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Budget Estimation</h2>
                    <p className="text-muted-foreground">Based on current market rates and your requirements</p>
                  </div>
                  <Badge
                    className={`text-lg px-4 py-2 ${
                      budgetEstimation.stage === "moderate"
                        ? "bg-green-500"
                        : budgetEstimation.stage === "intermediate"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                    }`}
                  >
                    {budgetEstimation.stage.toUpperCase()}
                  </Badge>
                </div>

                <div className="bg-background rounded-lg p-6 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Estimated Budget Range</div>
                    <div className="text-4xl font-bold text-primary">
                      ₹{budgetEstimation.budgetRange.min} - ₹{budgetEstimation.budgetRange.max} Lakhs
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold">Cost Breakdown</h3>
                  {Object.entries(budgetEstimation.breakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-semibold">₹{value} Lakhs</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Why this category?</h3>
                  <ul className="space-y-2">
                    {budgetEstimation.reasoning.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              <Card className="p-6 border-border">
                <h3 className="font-semibold mb-4">AI Generation Options</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="font-medium">Providers</div>
                    <p className="text-xs text-muted-foreground">
                      Leave all off to use fast mock generation. Enabling providers uses the AI Gateway and may require
                      billing.
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        id="prov-openai"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={generationOptions.providers.openai}
                        onChange={(e) =>
                          setGenerationOptions((prev) => ({
                            ...prev,
                            providers: { ...prev.providers, openai: e.target.checked },
                          }))
                        }
                      />
                      <label htmlFor="prov-openai" className="text-sm">
                        OpenAI
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        id="prov-anthropic"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={generationOptions.providers.anthropic}
                        onChange={(e) =>
                          setGenerationOptions((prev) => ({
                            ...prev,
                            providers: { ...prev.providers, anthropic: e.target.checked },
                          }))
                        }
                      />
                      <label htmlFor="prov-anthropic" className="text-sm">
                        Anthropic
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        id="prov-xai"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={generationOptions.providers.xai}
                        onChange={(e) =>
                          setGenerationOptions((prev) => ({
                            ...prev,
                            providers: { ...prev.providers, xai: e.target.checked },
                          }))
                        }
                      />
                      <label htmlFor="prov-xai" className="text-sm">
                        xAI (Grok)
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="font-medium">Variants Per Provider</div>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={generationOptions.variantsPerProvider}
                      onChange={(e) =>
                        setGenerationOptions((prev) => ({
                          ...prev,
                          variantsPerProvider: Math.min(4, Math.max(1, Number(e.target.value) || 1)),
                        }))
                      }
                      className="w-24 h-9 rounded-md border border-border px-2 bg-background"
                    />
                    <p className="text-xs text-muted-foreground">Generate multiple alternative designs per provider.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="font-medium">Notes</div>
                    <p className="text-sm text-muted-foreground">
                      Designs will include architectural, structural, interior, exterior, plus MEP. Variants combine
                      your inputs with provider-specific styles for diverse results.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border">
                <h3 className="font-semibold mb-4">Ready to proceed?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Click below to generate AI-powered architectural, structural, interior, exterior and MEP designs based
                  on your requirements.
                </p>
                <div className="flex items-center gap-4">
                  <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating AI Designs...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate AI Designs
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setStep(3)} disabled={isGenerating}>
                    Adjust Requirements
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
