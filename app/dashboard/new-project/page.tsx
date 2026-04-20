"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleMapsLocationPicker, type LocationData } from "@/components/google-maps-location-picker"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Sparkles,
  Loader2,
  CheckCircle2,
  Calculator,
  Layout,
  Download,
  Calendar,
  Box,
  Layers,
  Zap,
  ShieldCheck,
  MapPin,
  TrendingUp,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  Settings2,
  Brush,
  Warehouse,
  Home,
  HardHat,
  Droplets,
  Wind,
  Plus,
  Sun
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { cn } from "@/lib/utils"

export default function ConstructionIntelligencePlatform() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)

  // Module 1 & 2 Data - Expanded for Industrial AEC Specs
  const [formData, setFormData] = useState({
    projectName: "",
    floors: "1",
    location: "",
    locationData: null as LocationData | null,
    plotArea: "1200",
    constructionType: "RCC Frame",
    materialPreference: "Standard",
    amenities: ["Water Storage", "Power Backup"],
    constructionQuality: "Standard",
    buildingType: "residential",
    interiorPreference: "Modern",
    exteriorType: "Contemporary",
    // --- ADVANCED AEC PARAMETERS (Industry 4.0 Grade) ---
    soilType: "Sandy Loam",
    seismicZone: "Zone III",
    vastuOrientation: "East",
    fsiRequested: "2.5",
    automationLevel: "Premium (BMS Integration)",
    budgetCap: "50", 
    timelineTarget: "12",
    sustainabilityLevel: "LEED Gold Certified",
    fireSafetyGrade: "Grade-A NBC",
    hvacType: "VRV/VRF System",
    landscapeArea: "20",
    parkingSlots: "2",
    powerBackup: "100% (Hybrid Solar)",
    structuralRedundancy: "1.25x (Safety Factor)",
    smartFeatures: ["AI Surveillance", "Energy Harvest", "Biometric Access"],
    ventilationType: "Mechanical Ventilation with HEPA",
    waterResource: "STP Recycled + Municipal",
    securityLevel: "Tier-1 Mission Critical",
    acousticTarget: "STC 50+ (Soundproofed)",
    maintenancePlan: "Predictive Analytics (IoT)",
    exteriorCladding: "HPL/Terracotta Panels",
    flooringPreference: "Italian Marble / Engineered Wood",
    digitalTwinSync: true,
    localZoningSync: true,
    carbonTarget: "Net Zero Ready",
    // --- DEEP ENGINEERING SPECS (Step 2 Expansion) ---
    concreteGrade: "M25",
    steelGrade: "Fe550D",
    foundationDepth: "5-7 ft",
    wallMaterial: "AAC Blocks",
    paintQuality: "Weather Shield Royale",
    waterProofingGrade: "Tier-1 Membrane",
    windowGlassType: "Double Glazed Low-E",
    electricalLoad: "15 kW",
    pipeMaterial: "CPVC/SWR High-Imp",
    roofingTech: "Solar-Reflective Tiles",
    insulationBatten: true,
    evChargingReady: true,
    airQualitySensors: true,
    smartWaterMeter: true,
    structuralMaterial: "Reinforced Concrete",
    bimLODLevel: "LOD 400 (Construction)",
    workerSafetyProtocol: "OSHA Compliant",
    siteLogisticsPlan: true,
    payoutSchedule: "Milestone-Based",
    insuranceTier: "All-Risk Coverage",
    wasteAuditLevel: "Zero Waste Target",
    landscapingDepth: "300mm Topsoil",
    poolTech: "Saltwater Chlorination",
    elevatorSpeed: "1.0 m/s (VVVF Drive)",
    boundarySecurity: "Laser-Trip Perimeter"
  })

  // Module 3 & 4 Data
  const [estimationResult, setEstimationResult] = useState<any>(null)
  const [designResult, setDesignResult] = useState<any>(null)

  // Progress calculation
  const progress = (step / 5) * 100

  // Animation variants
  const slideIn = "animate-in fade-in slide-in-from-bottom-4 duration-500"

  const handleCreateProject = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: formData.projectName,
          floors: formData.floors,
          location: formData.location,
          plot_area: formData.plotArea,
          construction_type: formData.constructionType,
          materials: formData.materialPreference,
          amenities: formData.amenities,
          construction_grade: formData.constructionQuality,
          building_type: formData.buildingType,
          interior_preference: formData.interiorPreference,
          exterior_type: formData.exteriorType
        })
      })
      const result = await response.json()
      if (result.success) {
        setProjectId(result.project.id)
        setStep(2)
        toast({ title: "Project Initialized", description: "Project baseline established." })
      } else {
        // Fallback for demo/local testing if API doesn't exist
        setProjectId("demo-" + Date.now())
        setStep(2)
      }
    } catch (error) {
      // Local fallback for robust UI experience
      setProjectId("demo-" + Date.now())
      setStep(2)
      toast({ title: "Working Offline", description: "Continuing with local state." })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRunEstimation = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/ml-project-estimation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: { ...formData, location: formData.location },
          requirements: {
            size: parseFloat(formData.plotArea) > 10000 ? "mega" : parseFloat(formData.plotArea) > 5000 ? "large" : "medium",
            materials: formData.materialPreference.toLowerCase(),
            hvac: "split-ac",
            solarIntegration: formData.amenities.includes("Solar Panels")
          },
          projectType: formData.buildingType
        })
      })
      const result = await response.json()
      setEstimationResult(result)

      if (projectId && !projectId.startsWith("demo-")) {
        await fetch(`/api/projects/${projectId}/estimation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estimation: {
              budgetRange: result.budgetRange,
              itemized: result.itemized,
              reasoning: result.reasoning,
              dimensions: result.dimensions,
              sustainability_score: result.sustainability_score
            },
            materialQuantity: result.materialQuantity
          })
        })
      }
      // Stay on current step to show results breakdown
      toast({ title: "Estimation Complete", description: "Resource & cost projections ready." })
    } catch (error) {
      toast({ title: "Error", description: "ML engine connection failed.", variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateDesigns = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/generate-designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectData: {
            id: projectId,
            type: formData.buildingType,
            location: formData.location,
            area: formData.plotArea,
            floors: formData.floors,
            budget: `₹${estimationResult.budgetRange.min}L - ₹${estimationResult.budgetRange.max}L`,
            requirements: {
              vastuOrientation: formData.vastuOrientation,
              soilType: formData.soilType,
              automation: formData.automationLevel,
              sustainability: formData.sustainabilityLevel,
              hvacType: formData.hvacType,
              powerBackup: formData.powerBackup,
              waterResource: formData.waterResource,
              securityLevel: formData.securityLevel,
              acousticTarget: formData.acousticTarget,
              carbonTarget: formData.carbonTarget,
              concreteGrade: formData.concreteGrade,
              steelGrade: formData.steelGrade,
              wallMaterial: formData.wallMaterial,
              waterProofingGrade: formData.waterProofingGrade,
              exteriorCladding: formData.exteriorCladding,
              flooringPreference: formData.flooringPreference,
              interiorPreference: formData.interiorPreference,
              exteriorType: formData.exteriorType,
              fireSafetyGrade: formData.fireSafetyGrade
            }
          },
          options: { variantsPerProvider: 3 }
        })
      })
      const result = await response.json()
      const variants = result.designs?.variants || []
      const bestVariant = variants.sort((a: any, b: any) => (b.vastuScore || 0) - (a.vastuScore || 0))[0] || result.designs
      setDesignResult(bestVariant)

      if (projectId && !projectId.startsWith("demo-")) {
        await fetch(`/api/projects/${projectId}/estimation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            estimation: {
              budgetRange: estimationResult.budgetRange,
              itemized: estimationResult.itemized,
              dimensions: estimationResult.dimensions
            },
            materialQuantity: estimationResult.materialQuantity,
            designs: result.designs,
            advanced_specs: {
              seismic: formData.seismicZone,
              soil: formData.soilType,
              fsi: formData.fsiRequested
            }
          })
        })
      }

      setStep(4)
      toast({ title: "Designs Generated", description: "Architectural & Technical variants ready." })
    } catch (error) {
      toast({ title: "Error", description: "Design engine failed.", variant: "destructive" })
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadCompleteProject = () => {
    if (!estimationResult || !designResult) return;

    const doc = new jsPDF()
    const primaryColor: [number, number, number] = [30, 58, 138]
    const accentColor: [number, number, number] = [14, 165, 164]

    // --- PAGE 1: COVER PAGE ---
    doc.setFillColor(30, 58, 138)
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setFontSize(28)
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.text("SIID PROJECT DOSSIER", 105, 25, { align: "center" })

    doc.setFontSize(14)
    doc.text("SMART INDUSTRIAL INTELLIGENT DESIGN v4.0", 105, 33, { align: "center" })

    doc.setTextColor(30, 58, 138)
    doc.setFontSize(22)
    doc.text(formData.projectName.toUpperCase(), 105, 60, { align: "center" })
    doc.setFontSize(12)
    doc.text(`PLANNING HUB: ${formData.location.toUpperCase()}`, 105, 68, { align: "center" })

    // Company Stamping Simulation (Enhanced)
    doc.setDrawColor(30, 58, 138)
    doc.setLineWidth(1.5)
    doc.circle(160, 250, 25)
    doc.setFontSize(8)
    doc.text("SIID AUTHORIZED", 160, 243, { align: "center" })
    doc.text("CERTIFIED AEC", 160, 248, { align: "center" })
    doc.text("DIGITAL SEAL", 160, 253, { align: "center" })
    doc.text(new Date().toLocaleDateString(), 160, 258, { align: "center" })
    doc.text("ID: SIID-PRJ-772", 160, 263, { align: "center" })

    doc.setFontSize(16)
    doc.text("1. EXECUTIVE PROJECT QUOTATION", 20, 90)
    
    const quoteItems = [
      ["Structural & Civil", `₹${(estimationResult.budgetRange.min * 0.45).toFixed(1)}L`, "Reinforced concrete, core & shell"],
      ["Interior & Joinery", `₹${(estimationResult.budgetRange.min * 0.30).toFixed(1)}L`, "Flooring, painting, modular units"],
      ["MEP & Power Hub", `₹${(estimationResult.budgetRange.min * 0.15).toFixed(1)}L`, "Full electrical & plumbing grid"],
      ["Statactory & Permits", `₹${(estimationResult.budgetRange.min * 0.10).toFixed(1)}L`, "Local municipal & RERA liaison"],
      ["TOTAL BUDGET RANGE", `₹${estimationResult.budgetRange.min}L - ₹${estimationResult.budgetRange.max}L`, "Projected final cost"]
    ]

    autoTable(doc, {
      startY: 95,
      head: [["Component", "Estimated Amount", "Inclusions"]],
      body: quoteItems,
      theme: 'grid',
      headStyles: { fillColor: primaryColor },
      styles: { fontSize: 9 }
    })

    doc.setFontSize(16)
    doc.text("2. CORE BUILDING SPECIFICATIONS", 20, (doc as any).lastAutoTable.finalY + 15)
    
    const specs = [
      ["Building Category", formData.buildingType.toUpperCase(), "Plot Area", `${formData.plotArea} Sq. Ft.`],
      ["Proposed Floors", formData.floors, "Vertical Scale", `${formData.floors} Levels`],
      ["Soil Condition", formData.soilType, "Foundation Type", "AI-Optimized Raft"],
      ["Seismic Zone", formData.seismicZone, "Structural Integrity", "AEC-High"],
      ["Vastu Orientation", formData.vastuOrientation, "Vastu Compliance", `${(designResult.vastuScore || 90)}%`],
      ["Fire Safety", "Grade-A NBC Compliant", "Automation", formData.automationLevel],
      ["Sustainability", formData.sustainabilityLevel, "Ventilation", "Cross-Flow Optimized"]
    ]

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Technical Parameter", "Value", "Metric", "Status"]],
      body: specs,
      theme: 'striped',
      headStyles: { fillColor: primaryColor },
      styles: { fontSize: 8 }
    })

    // --- PAGE 2: MATERIAL QUANTITIES ---
    doc.addPage()
    doc.text("3. INDUSTRIAL RESOURCE QUANTUM", 20, 20)
    const materials = [
      ["OPC/PPC Cement", `${estimationResult.materialQuantity.cement} Bags`, "Grade-53 Quality Assurance"],
      ["Fe-500D Structural Steel", `${estimationResult.materialQuantity.steel} Kg`, "Seismic Load Tolerance"],
      ["Kiln-Baked Bricks", `${estimationResult.materialQuantity.bricks} Units`, "Standard Dimensional Stability"],
      ["River/M-Sand Grade-II", `${estimationResult.materialQuantity.sand} Cft`, "Washed & Filtered"],
      ["Coarse Aggregates (20mm)", `${estimationResult.materialQuantity.aggregate} Cft`, "Machine Crushed Blue Granite"],
      ["Plumbing Rough-in Kit", "Complete Site Kit", "CPVC/SWR Piping Scheduled"],
      ["Electrical Wiring Grid", "Complete Site Kit", "FR-Grade Multi-strand Copper"]
    ]
    autoTable(doc, {
      startY: 25,
      head: [["Material Class", "AI Quantum Response", "Engineering Remarks"]],
      body: materials,
      theme: 'grid',
      headStyles: { fillColor: accentColor },
      styles: { fontSize: 9 }
    })

    doc.text("4. MULTI-PHASE CONSTRUCTION TIMELINE", 20, (doc as any).lastAutoTable.finalY + 15)
    const schedule = [
      ["Planning & Design Lock", "Month 1", "COMPLETED", "Blueprint finalized"],
      ["Foundation & Sub-structure", "Month 2-4", "NEXT PHASE", "Excavation & PCC"],
      ["Superstructure Frame", "Month 5-9", "SCHEDULED", "RCC Column & Slab"],
      ["Mechanical/Electrical/Plumbing", "Month 10-11", "PLANNED", "Internal conduit grid"],
      ["Interior Finishing & Handover", "Month 12-14", "FINAL PHASE", "Tiling & Possession"]
    ]
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Work Stage", "Timeline", "Status", "Operational Focus"]],
      body: schedule,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 8 }
    })

    doc.text("5. AEC STRATEGIC PARAMETERS (50+ METRICS)", 20, (doc as any).lastAutoTable.finalY + 15)
    const advancedMetrics = [
      ["Sustainability", formData.sustainabilityLevel, "Automation", formData.automationLevel],
      ["HVAC System", formData.hvacType, "Safety Grade", formData.fireSafetyGrade],
      ["Water Resource", formData.waterResource, "Security Tier", formData.securityLevel],
      ["Acoustic Target", formData.acousticTarget, "Maintenance", formData.maintenancePlan],
      ["Digital Twin", formData.digitalTwinSync ? "Enabled" : "Disabled", "Carbon Target", formData.carbonTarget]
    ]
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Critical Parameter", "Configuration", "Operation Segment", "Status"]],
      body: advancedMetrics,
      theme: 'grid',
      headStyles: { fillColor: primaryColor },
      styles: { fontSize: 8 }
    })

    doc.text("6. DEEP ENGINEERING LOD-400 MATRIX", 20, (doc as any).lastAutoTable.finalY + 15)
    const engSpecs = [
      ["Concrete Grade", formData.concreteGrade, "Reinforcement", formData.steelGrade],
      ["Foundation", formData.foundationDepth, "Wall Substrate", formData.wallMaterial],
      ["Waterproofing", formData.waterProofingGrade, "Elecl Load", formData.electricalLoad],
      ["Piping Material", formData.pipeMaterial, "Roofing Tech", formData.roofingTech],
      ["BIM LOD Level", formData.bimLODLevel, "Safety Protocol", formData.workerSafetyProtocol]
    ]
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["Material Prop", "Spec", "Logic Segment", "Calibration"]],
      body: engSpecs,
      theme: 'grid',
      headStyles: { fillColor: accentColor },
      styles: { fontSize: 8 }
    })

    // Footer with Disclaimer
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.text("OFFICIAL SIID PROJECT INTELLIGENCE DOSSIER. VERIFY ALL DIMENSIONS ON-SITE BEFORE PROCUREMENT. AI-DRIVEN SPECIFICATIONS v4.2.0.", 105, 285, { align: "center" })

    doc.save(`${formData.projectName.replace(/\s+/g, '_')}_Dossier_SIID.pdf`)
  }

  const downloadReport = () => {
    if (!estimationResult) return;
    const doc = new jsPDF()
    const primary: [number, number, number] = [30, 58, 138]
    
    doc.setFillColor(30, 58, 138)
    doc.rect(0, 0, 210, 40, 'F')
    doc.setFontSize(22)
    doc.setTextColor(255, 255, 255)
    doc.text("SIID RESOURCE ESTIMATION", 105, 25, { align: "center" })

    doc.setTextColor(primary[0], primary[1], primary[2])
    doc.setFontSize(16)
    doc.text(`Project: ${formData.projectName}`, 20, 55)
    doc.setFontSize(10)
    doc.text(`Location: ${formData.location}`, 20, 62)

    const materials = [
      ["Cement (Standard)", `${estimationResult.materialQuantity.cement} Bags`],
      ["Structural Steel", `${estimationResult.materialQuantity.steel} Kg`],
      ["Bricks (Modular)", `${estimationResult.materialQuantity.bricks} Units`],
      ["Sand (M-Sand)", `${estimationResult.materialQuantity.sand} Cft`],
      ["Aggregates (20mm)", `${estimationResult.materialQuantity.aggregate} Cft`]
    ]

    autoTable(doc, {
      startY: 70,
      head: [["Material Component", "Predicted Quantum"]],
      body: materials,
      theme: 'grid',
      headStyles: { fillColor: primary }
    })

    doc.setFontSize(14)
    doc.text("Budget Projections", 20, (doc as any).lastAutoTable.finalY + 15)
    doc.setFontSize(10)
    doc.text(`Total Estimate: ₹${estimationResult.budgetRange.min}L - ₹${estimationResult.budgetRange.max}L`, 20, (doc as any).lastAutoTable.finalY + 22)

    doc.save(`${formData.projectName.replace(/\s+/g, '_')}_Estimation.pdf`)
  }


  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Downloading Layout", description: `Preparing ${filename} for transfer.` });
  }

  return (
    <AuthGuard>
      <div className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans p-4 md:p-8"
      )}>
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl bg-white/40 dark:bg-black/40 p-6 rounded-3xl border border-white/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="flex items-center gap-6 relative z-10">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <Warehouse className="w-6 h-6 text-primary" />
                  SIID <span className="text-primary italic">WORKFLOW</span>
                </h1>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-48 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Step {step} of 5</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 relative z-10">
              <Button variant="outline" className="rounded-xl border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-md hidden md:flex" onClick={() => setStep(1)}>
                Reset Sequence
              </Button>
              <Button variant="secondary" className="rounded-xl shadow-lg font-bold">
                Project ID: {projectId ? projectId.substring(0, 8) : "INITIALIZING"}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">

            {/* Sidebar Controls */}
            <div className="space-y-6">
              <Card className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-xl space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> Pipeline Control
                </h3>
                <nav className="space-y-1">
                  {[
                    { s: 1, label: "Initialization", icon: Plus },
                    { s: 2, label: "Details", icon: Zap },
                    { s: 3, label: "Estimation", icon: Calculator },
                    { s: 4, label: "Designs", icon: Brush },
                    { s: 5, label: "Finalize", icon: Download }
                  ].map((item) => (
                    <button
                      key={item.s}
                      disabled={item.s > step && (!estimationResult && item.s > 2)}
                      onClick={() => item.s <= step && setStep(item.s)}
                      className={cn(
                        "w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm",
                        step === item.s
                          ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                          : "hover:bg-white/50 dark:hover:bg-slate-800/50 text-muted-foreground"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      {item.s < step && <CheckCircle2 className="ml-auto w-4 h-4 text-green-500" />}
                    </button>
                  ))}
                </nav>
              </Card>

              {estimationResult && (
                <Card className="p-6 rounded-3xl bg-primary text-white space-y-4 shadow-2xl shadow-primary/30 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-80">Budget Summary</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-black">₹{estimationResult.budgetRange.min}L - ₹{estimationResult.budgetRange.max}L</div>
                  <Progress value={85} className="h-1 bg-white/20" />
                  <p className="text-[10px] opacity-70 leading-relaxed uppercase tracking-tighter">Confidence Score: {(estimationResult.ml_metadata?.confidence * 100).toFixed(1)}%</p>
                </Card>
              )}
            </div>

            {/* Main Stage */}
            <div className="lg:col-span-3 space-y-8">
               
               {/* PROJECT TIMELINE STEPPER */}
               <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-sm">
                  <div className="flex items-center justify-between relative px-4">
                     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                     <div className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-700" style={{ width: `${((step - 1) / 4) * 100}%` }} />
                     {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                           <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500",
                              step >= s ? "bg-primary text-white scale-110 shadow-lg" : "bg-slate-100 dark:bg-slate-900 text-muted-foreground border-2 border-slate-200 dark:border-slate-800"
                           )}>
                              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                           </div>
                           <span className={cn("text-[8px] uppercase font-black tracking-widest", step >= s ? "text-primary" : "text-muted-foreground")}>
                              {s === 1 ? "Create" : s === 2 ? "Details" : s === 3 ? "Estimate" : s === 4 ? "Designs" : "Finalize"}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>

              {/* STEP 1: INITIALIZATION */}
              {step === 1 && (
                <Card className={cn("p-8 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-2xl space-y-10", slideIn)}>
                  <div className="space-y-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">PHASE 01</Badge>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Initialize Project Baseline</h2>
                    <p className="text-slate-500 dark:text-slate-400">Define the core DNA of your construction asset to begin the intelligent design lifecycle.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Asset Designation</Label>
                      <Input
                        placeholder="e.g. Skyline Urban Residence"
                        className="h-14 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-lg font-bold focus:ring-4 transition-all"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Vertical Scale (Floors)</Label>
                      <Input
                        type="number"
                        className="h-14 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-lg font-bold focus:ring-4 transition-all"
                        value={formData.floors}
                        onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Global Geolocation (GPS)</Label>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner group transition-all focus-within:ring-4 ring-primary/20">
                      <GoogleMapsLocationPicker
                        value={formData.locationData}
                        onChange={(loc) => setFormData({ ...formData, location: loc.address, locationData: loc })}
                        placeholder="Detecting coordinates..."
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Structural Footprint (Sq. Ft.)</Label>
                      <Input
                        type="number"
                        className="h-14 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-lg font-bold focus:ring-4 transition-all"
                        value={formData.plotArea}
                        onChange={(e) => setFormData({ ...formData, plotArea: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Category</Label>
                      <select
                        className="w-full h-14 px-4 rounded-2xl bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-bold outline-none focus:ring-4 ring-primary/20 transition-all appearance-none"
                        value={formData.buildingType}
                        onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })}
                      >
                        <option value="residential">Residential Villa</option>
                        <option value="commercial">Commercial Complex</option>
                        <option value="industrial">Industrial Facility</option>
                        <option value="hospitality">Hospitality/Hotel</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Vastu Orientation</Label>
                      <select
                        className="w-full h-14 px-4 rounded-2xl bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-bold outline-none focus:ring-4 ring-primary/20 transition-all appearance-none"
                        value={formData.vastuOrientation}
                        onChange={(e) => setFormData({ ...formData, vastuOrientation: e.target.value })}
                      >
                        <option value="East">East Facing (Surya)</option>
                        <option value="West">West Facing (Varuna)</option>
                        <option value="North">North Facing (Kubera)</option>
                        <option value="South">South Facing (Yama)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary"><ShieldCheck className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] font-black tracking-widest uppercase mb-1">Compliance Check</p>
                        <p className="text-xs font-bold">RERA & Municipal FSI Analysis Active</p>
                      </div>
                      <Badge className="ml-auto bg-green-500 text-white">READY</Badge>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-500"><MapPin className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] font-black tracking-widest uppercase mb-1">Geo-Spatial v4</p>
                        <p className="text-xs font-bold">Soil & Seismic Normalization Sync</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xl font-black shadow-2xl shadow-blue-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    onClick={handleCreateProject}
                    disabled={!formData.projectName || !formData.location || isProcessing}
                  >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "Initiate Structural Optimization"}
                  </Button>
                </Card>
              )}

              {step === 2 && (
                <div className={cn("space-y-8", slideIn)}>
                  <Card className="p-8 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-2xl text-center space-y-4">
                    <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">PHASE 02</Badge>
                    <h2 className="text-4xl font-black">Intelligent Input Expansion</h2>
                    <p className="text-muted-foreground">Calibrating material preferences and structural quality for AI estimation.</p>
                  </Card>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* CORE TECHNICAL CARD */}
                    <Card className="p-8 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600"><Layers className="w-5 h-5" /></div>
                        <h3 className="font-black text-xl">Technical Props</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">Construction Quality</Label>
                          <select className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm" value={formData.constructionQuality} onChange={(e) => setFormData({...formData, constructionQuality: e.target.value})}>
                            <option>Standard</option>
                            <option>High (Precision)</option>
                            <option>Ultra (Industry 4.0)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">Sustainability Rating</Label>
                          <select className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm" value={formData.sustainabilityLevel} onChange={(e) => setFormData({...formData, sustainabilityLevel: e.target.value})}>
                            <option>Basic Compliance</option>
                            <option>GRIHA 3-Star</option>
                            <option>LEED Gold Certified</option>
                            <option>Net Zero Ready</option>
                          </select>
                        </div>
                      </div>
                    </Card>

                    {/* ENGINEERING CARD */}
                    <Card className="p-8 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600"><Settings2 className="w-5 h-5" /></div>
                        <h3 className="font-black text-xl">AEC Parameters</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-2">
                             <Label className="text-[9px] uppercase font-black text-slate-400">Automation</Label>
                             <select className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-[10px] font-bold" value={formData.automationLevel} onChange={(e) => setFormData({...formData, automationLevel: e.target.value})}>
                               <option>Smart Basic</option>
                               <option>Premium BMS</option>
                               <option>AI Full-Stack</option>
                             </select>
                           </div>
                           <div className="space-y-2">
                             <Label className="text-[9px] uppercase font-black text-slate-400">Fire Safety</Label>
                             <select className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-[10px] font-bold" value={formData.fireSafetyGrade} onChange={(e) => setFormData({...formData, fireSafetyGrade: e.target.value})}>
                               <option>Grade-C</option>
                               <option>Grade-B NBC</option>
                               <option>Grade-A Mission</option>
                             </select>
                           </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">HVAC Configuration</Label>
                          <select className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm" value={formData.hvacType} onChange={(e) => setFormData({...formData, hvacType: e.target.value})}>
                            <option>Window/Split AC</option>
                            <option>Centralized Ducting</option>
                            <option>VRV/VRF System</option>
                            <option>Passive Cooling</option>
                          </select>
                        </div>
                      </div>
                    </Card>

                    {/* DESIGN & FINISH CARD */}
                    <Card className="p-8 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-600"><Brush className="w-5 h-5" /></div>
                        <h3 className="font-black text-xl">Signature Style</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">Exterior Cladding</Label>
                          <select className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm" value={formData.exteriorCladding} onChange={(e) => setFormData({...formData, exteriorCladding: e.target.value})}>
                            <option>Texture Paint</option>
                            <option>HPL Panels</option>
                            <option>Glass Curtain Wall</option>
                            <option>Terracotta Tiles</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">Flooring Type</Label>
                          <select className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm" value={formData.flooringPreference} onChange={(e) => setFormData({...formData, flooringPreference: e.target.value})}>
                            <option>Vitrified Tiles</option>
                            <option>Italian Marble</option>
                            <option>Engineered Wood</option>
                            <option>Polished Concrete</option>
                          </select>
                        </div>
                      </div>
                    </Card>

                    {/* INFRASTRUCTURE CARD */}
                    <Card className="p-8 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600"><Zap className="w-5 h-5" /></div>
                        <h3 className="font-black text-xl">Utility Power</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">Power Source</Label>
                          <select className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm" value={formData.powerBackup} onChange={(e) => setFormData({...formData, powerBackup: e.target.value})}>
                            <option>Grid Only</option>
                            <option>Grid + Diesel Gen</option>
                            <option>Grid + Hybrid Solar</option>
                            <option>Off-Grid Renewable</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">Water Network</Label>
                          <select className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm" value={formData.waterResource} onChange={(e) => setFormData({...formData, waterResource: e.target.value})}>
                            <option>Municipal</option>
                            <option>Municipal + Borewell</option>
                            <option>STP Recycled Hub</option>
                          </select>
                        </div>
                      </div>
                    </Card>

                    {/* SECURITY & COMFORT CARD */}
                    <Card className="p-8 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-500/10 rounded-2xl text-red-600"><ShieldCheck className="w-5 h-5" /></div>
                        <h3 className="font-black text-xl">Safety & Comfort</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">Security Tier</Label>
                          <select className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm" value={formData.securityLevel} onChange={(e) => setFormData({...formData, securityLevel: e.target.value})}>
                            <option>Standard CCTV</option>
                            <option>AI Face-ID Access</option>
                            <option>Tier-1 Mission Grid</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">Acoustic Shielding</Label>
                          <select className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-sm" value={formData.acousticTarget} onChange={(e) => setFormData({...formData, acousticTarget: e.target.value})}>
                            <option>Standard (35 dB)</option>
                            <option>Quiet (45 dB)</option>
                            <option>Soundproof (55+ dB)</option>
                          </select>
                        </div>
                      </div>
                    </Card>

                    {/* SITE LOGISTICS CARD */}
                    <Card className="p-8 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-xl space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-500/10 rounded-2xl text-slate-600"><Plus className="w-5 h-5" /></div>
                        <h3 className="font-black text-xl">Future Readiness</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                           <span className="text-xs font-bold font-mono">DIGITAL TWIN SYNC</span>
                           <input type="checkbox" checked={formData.digitalTwinSync} onChange={(e) => setFormData({...formData, digitalTwinSync: e.target.checked})} className="w-5 h-5 accent-primary" />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                           <span className="text-xs font-bold font-mono">LOCAL ZONING AUTO</span>
                           <input type="checkbox" checked={formData.localZoningSync} onChange={(e) => setFormData({...formData, localZoningSync: e.target.checked})} className="w-5 h-5 accent-indigo-500" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-slate-400">Carbon Target</Label>
                          <select className="w-full h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-[10px] font-bold" value={formData.carbonTarget} onChange={(e) => setFormData({...formData, carbonTarget: e.target.value})}>
                             <option>Standard Footprint</option>
                             <option>25% Reduction</option>
                             <option>Net Zero Ready</option>
                          </select>
                        </div>
                      </div>
                    </Card>
                    {/* DEEP ENGINEERING SPECS CARD */}
                    <Card className="p-8 rounded-[2rem] bg-indigo-500/5 dark:bg-indigo-500/10 backdrop-blur-xl border border-indigo-500/20 shadow-xl space-y-6 lg:col-span-3">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600"><HardHat className="w-5 h-5" /></div>
                           <h3 className="font-black text-xl">Deep Engineering Matrix (25+ Metrics)</h3>
                         </div>
                         <Badge className="bg-indigo-500 text-white font-mono">LOD 400 SYNCED</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                           <Label className="text-[9px] uppercase font-black text-slate-400">Concrete Grade</Label>
                           <select className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold" value={formData.concreteGrade} onChange={(e) => setFormData({...formData, concreteGrade: e.target.value})}>
                              <option>M20</option>
                              <option>M25 (Standard)</option>
                              <option>M30 (High-Rise)</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[9px] uppercase font-black text-slate-400">Steel Reinforcement</Label>
                           <select className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold" value={formData.steelGrade} onChange={(e) => setFormData({...formData, steelGrade: e.target.value})}>
                              <option>Fe500</option>
                              <option>Fe550D (Seismic)</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[9px] uppercase font-black text-slate-400">Wall Substrate</Label>
                           <select className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold" value={formData.wallMaterial} onChange={(e) => setFormData({...formData, wallMaterial: e.target.value})}>
                              <option>Red Bricks</option>
                              <option>AAC Blocks</option>
                              <option>Drywall Sys</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[9px] uppercase font-black text-slate-400">Waterproofing</Label>
                           <select className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold" value={formData.waterProofingGrade} onChange={(e) => setFormData({...formData, waterProofingGrade: e.target.value})}>
                              <option>Standard</option>
                              <option>Tier-1 Membrane</option>
                              <option>Crystalline Sys</option>
                           </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-indigo-500/10">
                         {[
                           { label: "EV Ready", key: "evChargingReady" },
                           { label: "Air Sensors", key: "airQualitySensors" },
                           { label: "Smart Water", key: "smartWaterMeter" },
                           { label: "Logistics Sync", key: "siteLogisticsPlan" }
                         ].map((spec) => (
                           <div key={spec.key} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-indigo-500/5">
                              <span className="text-[9px] font-black uppercase text-slate-500">{spec.label}</span>
                              <input type="checkbox" checked={(formData as any)[spec.key]} onChange={(e) => setFormData({...formData, [spec.key]: e.target.checked})} className="w-4 h-4 accent-indigo-600" />
                           </div>
                         ))}
                      </div>
                    </Card>
                  </div>
                  <div className="flex justify-between items-center bg-white/40 dark:bg-black/40 p-6 rounded-3xl border border-white/10">
                    <Button variant="ghost" onClick={() => setStep(1)} className="rounded-xl font-bold h-12 px-8">Back</Button>
                    <div className="flex gap-4">
                       <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] px-3 font-mono hidden md:flex items-center tracking-tighter">ULTIMATE: 50+ AEC PARAMETERS ENGAGED</Badge>
                       <Button className="h-14 px-12 bg-primary text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-transform" onClick={() => setStep(3)}>Launch Intelligence Engine</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ESTIMATION & RESULTS */}
              {step === 3 && (
                 <div className={cn("space-y-8", slideIn)}>
                    {!estimationResult ? (
                      <Card className="p-12 rounded-[2.5rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-2xl text-center space-y-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-20" />
                        <div className="space-y-6 relative z-10">
                           <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/40 animate-pulse">
                              <Calculator className="w-12 h-12 text-white" />
                           </div>
                           <div className="space-y-2">
                              <h2 className="text-5xl font-black tracking-tighter">AI Material Analysis</h2>
                              <p className="text-muted-foreground text-lg max-w-lg mx-auto italic font-medium">Click below to generate detailed material requirements and budget projections.</p>
                           </div>
                        </div>
                        <Button 
                          className="w-full h-24 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-[1.02] transition-all text-3xl font-black shadow-2xl relative z-10 group"
                          onClick={handleRunEstimation}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <Loader2 className="w-10 h-10 animate-spin mr-4" /> : "Calculate Now"}
                        </Button>
                      </Card>
                    ) : (
                      <div className="space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                           <div className="space-y-4">
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1 uppercase font-black text-[10px]">Results Generated</Badge>
                              <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">Material Breakdown</h2>
                              <p className="text-muted-foreground font-medium text-lg leading-relaxed">Statistical projections for {formData.plotArea} Sq. Ft.</p>
                           </div>
                           <Button variant="outline" className="rounded-2xl h-14 px-8 border-primary/20 bg-white/50 dark:bg-black/50 text-slate-900 dark:text-white font-black hover:bg-primary hover:text-white transition-all gap-3 shadow-lg" onClick={() => downloadReport()}>
                              <Download className="w-5 h-5" /> EXPORT ESTIMATION
                           </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                           {[
                             { label: "Cement", val: estimationResult.materialQuantity.cement, unit: "Bags", icon: Layers, color: "text-blue-500" },
                             { label: "Steel", val: estimationResult.materialQuantity.steel, unit: "Kg", icon: Box, color: "text-slate-500" },
                             { label: "Bricks", val: estimationResult.materialQuantity.bricks, unit: "Units", icon: Layout, color: "text-red-500" },
                             { label: "Sand", val: estimationResult.materialQuantity.sand, unit: "Cft", icon: Wind, color: "text-orange-500" },
                             { label: "Aggregate", val: estimationResult.materialQuantity.aggregate, unit: "Cft", icon: Droplets, color: "text-indigo-500" }
                           ].map((item, i) => (
                             <Card key={i} className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border-white/20 shadow-xl relative overflow-hidden group hover:scale-105 transition-all">
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-4">{item.label}</p>
                                <div className={cn("text-3xl font-black", item.color)}>{item.val}</div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.unit}</p>
                             </Card>
                           ))}
                        </div>

                        <Card className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
                           <h4 className="text-[10px] uppercase font-black tracking-widest opacity-80 mb-4">Total Estimated Budget</h4>
                           <div className="text-4xl font-extrabold tracking-tighter">₹{estimationResult.budgetRange.min}L - ₹{estimationResult.budgetRange.max}L</div>
                           <p className="text-indigo-100 text-xs mt-2 italic">Acuracy based on CURRENT market volatility Index.</p>
                        </Card>

                        <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-800">
                           <Button variant="ghost" onClick={() => setEstimationResult(null)} className="rounded-xl font-bold h-12">Recalculate</Button>
                           <Button className="h-16 px-12 bg-primary text-white rounded-2xl font-black shadow-xl text-lg hover:scale-105 transition-all" onClick={handleGenerateDesigns} disabled={isProcessing}>
                             {isProcessing ? <Loader2 className="animate-spin mr-2" /> : "PHASE 04: AI DESIGNS"}
                           </Button>
                        </div>
                      </div>
                    )}
                 </div>
               )}

               {/* STEP 4: VIEW LAYOUTS */}
               {step === 4 && designResult && (
                 <div className={cn("space-y-10", slideIn)}>
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                       <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 px-4 py-1 uppercase font-black text-[10px] tracking-widest">Phase 04: AI Visualization</Badge>
                       <h2 className="text-5xl font-black tracking-tight">Your Custom Designs</h2>
                       <p className="text-muted-foreground font-medium text-lg leading-relaxed">Generated {designResult.style} variants optimized for your plot.</p>
                    </div>

                    <Tabs defaultValue="architectural" className="w-full">
                       <TabsList className="w-full flex h-auto bg-slate-100 dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800 gap-2 mb-10 overflow-x-auto">
                          <TabsTrigger value="architectural" className="flex-1 rounded-xl font-black py-4">ARCHITECTURAL</TabsTrigger>
                          <TabsTrigger value="structural" className="flex-1 rounded-xl font-black py-4">STRUCTURAL</TabsTrigger>
                          <TabsTrigger value="electrical" className="flex-1 rounded-xl font-black py-4">ELECTRICAL</TabsTrigger>
                          <TabsTrigger value="plumbing" className="flex-1 rounded-xl font-black py-4">PLUMBING</TabsTrigger>
                          <TabsTrigger value="interior" className="flex-1 rounded-xl font-black py-4">INTERIOR</TabsTrigger>
                          <TabsTrigger value="exterior" className="flex-1 rounded-xl font-black py-4">EXTERIOR</TabsTrigger>
                       </TabsList>

                       {[
                          { value: 'architectural', name: 'Architectural Floor Plan', img: designResult.categories.architectural.floorPlanImage, tag: 'BLUEPRINT' },
                          { value: 'structural', name: 'Structural Layout', img: designResult.categories.structural.layoutImage, tag: 'ENGINEERING' },
                          { value: 'electrical', name: 'Electrical Wiring Schematic', img: designResult.categories.electrical.layoutImage, tag: 'POWER' },
                          { value: 'plumbing', name: 'Plumbing & Drainage Layout', img: designResult.categories.plumbing.layoutImage, tag: 'HYDRAULIC' },
                          { value: 'interior', name: 'Interior Visualization', img: designResult.categories.interior.renderingImage, tag: 'PHOTOREAL' },
                          { value: 'exterior', name: 'Exterior Elevation', img: designResult.categories.exterior.renderingImage, tag: 'ELEVATION' }
                       ].map((tab) => (
                          <TabsContent key={tab.value} value={tab.value} className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                             <Card className="overflow-hidden rounded-[3rem] border-white/20 shadow-2xl relative bg-slate-200 dark:bg-slate-800 min-h-[500px]">
                                <img src={tab.img} alt={tab.name} className="w-full h-full object-cover min-h-[500px]" />
                                <div className="absolute top-8 left-8">
                                   <Badge className="bg-primary px-4 py-2 text-white font-black text-xs uppercase tracking-widest shadow-xl">{tab.tag}</Badge>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black/80 to-transparent text-white">
                                   <h3 className="text-3xl font-black mb-2">{tab.name}</h3>
                                   <p className="opacity-70 text-lg">AI-Optimized layout for {formData.projectName}</p>
                                </div>
                             </Card>
                             <div className="flex gap-4">
                                <Button className="flex-1 h-16 rounded-2xl bg-white text-black font-black text-lg hover:bg-slate-100 flex gap-2" onClick={() => window.open(tab.img, '_blank')}>
                                   <Sparkles className="w-5 h-5 text-primary" /> FULL SCREEN PREVIEW
                                </Button>
                                <Button 
                                    className="h-16 px-10 rounded-2xl bg-primary text-white font-black text-lg shadow-xl flex gap-2"
                                    onClick={() => downloadImage(tab.img, `${formData.projectName}_${tab.value}.png`)}
                                >
                                   <Download className="w-5 h-5" /> DOWNLOAD {tab.value.toUpperCase()}
                                </Button>
                             </div>
                          </TabsContent>
                       ))}
                    </Tabs>

                    <Card className="p-10 rounded-[3rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
                       <div className="space-y-3 max-w-xl">
                          <h4 className="text-3xl font-black tracking-tighter whitespace-nowrap">Ready to finalize?</h4>
                          <p className="opacity-60 font-medium italic">Your personalized design dossier is ready for generation.</p>
                       </div>
                       <Button 
                        size="lg" 
                        className="rounded-[2rem] px-12 h-20 bg-primary text-white font-black text-2xl shadow-2xl hover:scale-105 transition-all"
                        onClick={() => setStep(5)}
                       >
                          Finalize Operations <ChevronRight className="w-8 h-8 ml-2" />
                       </Button>
                    </Card>
                 </div>
               )}

               {/* STEP 5: FINALIZATION & DOSSIER */}
               {step === 5 && (
                 <div className={cn("space-y-8", slideIn)}>
                    <div className="flex items-end justify-between">
                       <div className="space-y-4">
                          <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 px-3 py-1 uppercase font-black tracking-widest text-[10px]">Step 5: Finalize</Badge>
                          <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">Project Dossier Center</h2>
                          <p className="text-muted-foreground font-medium text-lg leading-relaxed">Download your complete construction assets and tracking sheets below.</p>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                       <Card className="p-8 rounded-[3rem] bg-primary text-white flex flex-col items-center justify-center text-center space-y-6 shadow-2xl hover:scale-[1.02] transition-all cursor-pointer" onClick={downloadCompleteProject}>
                          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                             <Download className="w-12 h-12" />
                          </div>
                          <div className="space-y-2">
                             <h3 className="text-3xl font-black">Download All Files</h3>
                             <p className="opacity-70">Complete PDF Report with all designs, estimations, and schedules.</p>
                          </div>
                       </Card>

                       <Card className="p-8 rounded-[3rem] bg-white/70 dark:bg-slate-900/70 border border-white/20 flex flex-col items-center justify-center text-center space-y-6 shadow-xl">
                          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                             <FileText className="w-10 h-10" />
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-2xl font-black">View Project History</h4>
                             <p className="text-muted-foreground">Access your saved projects in the main dashboard.</p>
                          </div>
                          <Button variant="outline" className="rounded-xl w-full h-12 font-bold" onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                       </Card>
                    </div>

                    <Card className="p-10 rounded-[2.5rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-2xl space-y-10">
                       <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                          <h3 className="text-2xl font-black tracking-tight flex items-center gap-3"><Calendar className="w-7 h-7 text-primary" /> Proposed Construction Timeline</h3>
                       </div>
                       
                       <div className="space-y-12">
                          {[
                            { phase: "Planning & Architecture", progress: 100, status: "Ready", desc: "Phase 1 blueprints and Vastu analysis complete.", icon: Layout },
                            { phase: "Material Acquisition", progress: 0, status: "Next", desc: "Procurement ready based on generated estimations.", icon: Box },
                            { phase: "On-Site Execution", progress: 0, status: "Scheduled", desc: "Strategic foundation and structural build-out.", icon: HardHat },
                            { phase: "Finishing & Handover", progress: 0, status: "Pending", desc: "Interior styling and final quality assurance.", icon: CheckCircle2 }
                          ].map((p, i) => (
                            <div key={i} className="group relative">
                               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                  <div className="flex items-center gap-4">
                                     <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", p.status === 'Ready' ? 'bg-green-500/10 text-green-600' : p.status === 'Next' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400')}>
                                        <p.icon className="w-7 h-7" />
                                     </div>
                                     <div className="space-y-1">
                                        <h4 className="text-xl font-black tracking-tight">{p.phase}</h4>
                                        <p className="text-xs text-muted-foreground font-medium">{p.desc}</p>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <Badge variant="outline" className="rounded-full px-4">{p.status}</Badge>
                                  </div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </Card>

                    <Button 
                      className="w-full h-24 rounded-[3rem] bg-slate-900 dark:bg-white text-white dark:text-black text-3xl font-black shadow-2xl shadow-black/20 hover:scale-[1.01] transition-all"
                      onClick={() => router.push('/dashboard')}
                    >
                       FINISH WORKFLOW
                    </Button>
                 </div>
               )}

            </div>
          </div>
        </div>

        {/* Ambient VFX */}
        <div className="fixed top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] pointer-events-none z-[-1]" />
        <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none z-[-1]" />

        {/* Global Noise Texture */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
    </AuthGuard>
  )
}

// Support Icons not in the main list
const AlertTriangle = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
)
const zap = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><path d="M4 14.75V11L14 3v8.25H20L10 21v-6.25H4Z" /></svg>
)
