"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Compass,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileImage,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateProfessionalDocument } from "@/lib/document-template"
import { VASTU_DATASET } from "./vastu-knowledge-base"
import { predictVastuCompliance, predictOverallScore } from "./vastu-ml-engine"


interface VastuInput {
  constructionType: string
  floors: string
  builtUpArea: string
  plotLength: number
  plotWidth: number
  plotArea: number
  facing: string
  roadPosition: string
  openSpaces: string
  neighborHeight: string
  climaticZone: string
}

interface VastuRule {
  name: string
  direction: string
  status: "compliant" | "warning" | "non-compliant"
  priority: "must-follow" | "recommended" | "advisory"
  suggestion: string
  remedy?: string
}

interface VastuLayout {
  score: number
  category: string
  rooms: VastuRule[]
  features: {
    name: string
    status: "pass" | "warning" | "fail"
    description: string
  }[]
  doshas: {
    name: string
    severity: "high" | "medium" | "low"
    remedy: string
  }[]
  colorRecommendations: {
    room: string
    colors: string[]
  }[]
  layoutMap: string
}

export function VastuLayoutGenerator() {
  const [step, setStep] = useState(1)
  const [inputs, setInputs] = useState<VastuInput>({
    constructionType: "house",
    floors: "G",
    builtUpArea: "",
    plotLength: 40,
    plotWidth: 30,
    plotArea: 1200,
    facing: "north",
    roadPosition: "one-side",
    openSpaces: "moderate",
    neighborHeight: "ground",
    climaticZone: "moderate",
  })
  const [layout, setLayout] = useState<VastuLayout | null>(null)
  const { toast } = useToast()

  const updateDimensions = (field: "plotLength" | "plotWidth", value: number) => {
    const newInputs = { ...inputs, [field]: value }
    newInputs.plotArea = newInputs.plotLength * newInputs.plotWidth
    setInputs(newInputs)
  }

  const vastuRuleEngine = () => {
    const { constructionType, facing } = inputs

    // Core layout rules inspired by the Knowledge Base and calculated via ML engine
    const dataset = VASTU_DATASET[constructionType] || VASTU_DATASET.house
    const computedRules: VastuRule[] = []

    // Helper to map grid (r,c) to direction string for ML engine
    const getDirection = (r: number, c: number): string => {
      if (r === 0 && c === 0) return "Northwest"
      if (r === 0 && c === 1) return "North"
      if (r === 0 && c === 2) return "Northeast"
      if (r === 1 && c === 0) return "West"
      if (r === 1 && c === 1) return "North" // Brahmasthan acts as center-north
      if (r === 1 && c === 2) return "East"
      if (r === 2 && c === 0) return "Southwest"
      if (r === 2 && c === 1) return "South"
      if (r === 2 && c === 2) return "Southeast"
      return "North"
    }

    // Iterate through dataset to generate rules dynamically
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const item = dataset[r][c]
        const dir = getDirection(r, c)
        const mlResult = predictVastuCompliance(item.title, dir)

        computedRules.push({
          name: item.title,
          direction: dir,
          status: mlResult.status,
          priority: item.title.includes("Master") || item.title.includes("Kitchen") || item.title.includes("Entrance") ? "must-follow" : "recommended",
          suggestion: item.description,
          remedy: mlResult.status !== "compliant" ? `Consult Vastu expert for ${item.title} adjustment` : undefined
        })
      }
    }

    // Add facing-specific entrance rule
    computedRules.push({
      name: "Main Entrance",
      direction: facing.charAt(0).toUpperCase() + facing.slice(1),
      status: ["north", "east", "northeast"].includes(facing) ? "compliant" : "warning",
      priority: "must-follow",
      suggestion: `Entrance facing ${facing} brings unique energy characteristics to the ${constructionType}.`,
      remedy: !["north", "east", "northeast"].includes(facing) ? "Install a silver strip at the threshold or place Vastu pyramids." : undefined
    })

    return computedRules
  }

  const analyzeAdvancedFeatures = () => {
    const features = [
      {
        name: "Ventilation & Airflow",
        status: "pass" as const,
        description: "Windows positioned in North and East for optimal cross-ventilation",
      },
      {
        name: "Sunlight Penetration",
        status: "pass" as const,
        description: "Maximum natural light from East and North directions",
      },
      {
        name: "Window Positioning",
        status: "pass" as const,
        description: "Large windows in North and East, smaller in South and West",
      },
      {
        name: "Water Source (Borewell)",
        status: "pass" as const,
        description: "Borewell positioned in Northeast for water energy",
      },
      {
        name: "Overhead Water Tank",
        status: "pass" as const,
        description: "Tank placed in Southwest for structural stability",
      },
      {
        name: "Sump Placement",
        status: "pass" as const,
        description: "Underground sump in Northeast or North",
      },
      {
        name: "Septic Tank Location",
        status: "pass" as const,
        description: "Septic tank in Northwest, away from Northeast",
      },
      {
        name: "Setback Compliance",
        status: inputs.openSpaces !== "none" ? ("pass" as const) : ("warning" as const),
        description: "Adequate open space around building as per local regulations",
      },
      {
        name: "Compound Wall Height",
        status: "pass" as const,
        description: "South and West walls higher than North and East",
      },
      {
        name: "Parking Area",
        status: "pass" as const,
        description: "Parking in Northwest or Southeast corner",
      },
      {
        name: "Floor-wise Zoning",
        status: "pass" as const,
        description: `${inputs.floors} floor plan optimized for vertical energy flow`,
      },
      {
        name: "Multi-floor Energy Flow",
        status: "pass" as const,
        description: "Staircase and lift placement ensures smooth energy transition",
      },
      {
        name: "Energy Balance",
        status: "pass" as const,
        description: "Five elements (Panch Tatva) properly balanced",
      },
      {
        name: "Heat Flow Management",
        status: "pass" as const,
        description: "Heat-generating elements in Southeast, cooling in Northeast",
      },
      {
        name: "Sacred Geometry",
        status: "pass" as const,
        description: "Plot proportions follow Vastu Purusha Mandala principles",
      },
      {
        name: "Directional Significance",
        status: "pass" as const,
        description: "All eight directions utilized as per their ruling deities",
      },
      {
        name: "Prosperity Zones",
        status: "pass" as const,
        description: "North (Kubera) zone kept light and open for wealth",
      },
      {
        name: "Health & Wellness Areas",
        status: "pass" as const,
        description: "Bedroom placement ensures restorative sleep",
      },
      {
        name: "Slope & Drainage",
        status: "pass" as const,
        description: "Natural slope towards Northeast for positive energy flow",
      },
      {
        name: "Entrance Threshold",
        status: "pass" as const,
        description: "Main door threshold elevated for protection",
      },
      {
        name: "Center (Brahmasthan)",
        status: "pass" as const,
        description: "Central area kept open and light for energy circulation",
      },
      {
        name: "Furniture Placement",
        status: "pass" as const,
        description: "Heavy furniture in South and West for grounding",
      },
      {
        name: "Electrical Main Board",
        status: "pass" as const,
        description: "Main electrical panel in Southeast (fire zone)",
      },
      {
        name: "Basement Vastu",
        status: inputs.floors.includes("+") ? ("pass" as const) : ("pass" as const),
        description: "If basement exists, located in North or East portion",
      },
      {
        name: "Terrace/Roof Access",
        status: "pass" as const,
        description: "Roof access from South or West side",
      },
    ]

    return features
  }

  const detectDoshas = () => {
    const doshas = []

    if (!["north", "east", "northeast"].includes(inputs.facing)) {
      doshas.push({
        name: "Entrance Direction Dosha",
        severity: "medium" as const,
        remedy: "Place Vastu pyramids near entrance, use bright lighting, and install Ganesha symbol",
      })
    }

    if (inputs.neighborHeight === "high") {
      doshas.push({
        name: "Shadow Dosha",
        severity: "low" as const,
        remedy: "Use mirrors and reflective surfaces to bring light, paint walls in light colors",
      })
    }

    if (inputs.openSpaces === "none") {
      doshas.push({
        name: "Constricted Space Dosha",
        severity: "high" as const,
        remedy: "Keep interiors light and airy, use glass partitions, avoid clutter",
      })
    }

    if (inputs.roadPosition === "one-side") {
      doshas.push({
        name: "Single Road Access",
        severity: "low" as const,
        remedy: "Ensure the road side is North or East for better energy flow",
      })
    }

    // If no major doshas found
    if (doshas.length === 0) {
      doshas.push({
        name: "No Major Doshas Detected",
        severity: "low" as const,
        remedy: "Maintain cleanliness and regular space clearing rituals",
      })
    }

    return doshas
  }

  const getColorRecommendations = () => {
    return [
      { room: "Living Room", colors: ["White", "Light Yellow", "Light Green", "Cream"] },
      { room: "Master Bedroom", colors: ["Light Pink", "Light Blue", "Lavender", "Beige"] },
      { room: "Children's Room", colors: ["Light Green", "Sky Blue", "Peach", "Light Yellow"] },
      { room: "Kitchen", colors: ["Red", "Orange", "Pink", "Yellow"] },
      { room: "Pooja Room", colors: ["White", "Light Yellow", "Light Blue"] },
      { room: "Study Room", colors: ["Green", "Light Blue", "White", "Cream"] },
      { room: "Bathroom", colors: ["White", "Light Blue", "Light Pink"] },
      { room: "Dining Area", colors: ["Light Green", "Light Orange", "Yellow"] },
    ]
  }

  const generateLayout = () => {
    if (!inputs.plotLength || !inputs.plotWidth) {
      toast({
        title: "Incomplete Information",
        description: "Please complete all required fields",
        variant: "destructive",
      })
      return
    }

    const rooms = vastuRuleEngine()
    const features = analyzeAdvancedFeatures()
    const doshas = detectDoshas()
    const colorRecommendations = getColorRecommendations()

    // Use ML Engine to calculate overall score based on inferred confidence
    const mlResults = rooms.map(r => ({
      status: r.status,
      confidence: r.status === "compliant" ? 0.95 : r.status === "warning" ? 0.5 : 0.1
    }))
    
    const score = predictOverallScore(mlResults)
    const category = score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 60 ? "Average" : "Needs Correction"

    const layoutMap = `${inputs.constructionType.toUpperCase()} - ${inputs.plotLength}ft x ${inputs.plotWidth}ft (${inputs.plotArea} sq.ft) - ${inputs.facing.toUpperCase()} Facing`

    setLayout({
      score,
      category,
      rooms,
      features,
      doshas,
      colorRecommendations,
      layoutMap,
    })


    toast({
      title: "Layout Generated Successfully",
      description: `Vastu Compliance Score: ${score}% (${category})`,
    })
  }

  const downloadPDF = async () => {
    if (!layout) return

    try {
      const date = new Date().toLocaleDateString()

      // Build room content
      const roomContent = layout.rooms.map(room =>
        `${room.direction.toUpperCase()} - ${room.name} (${room.status.toUpperCase()}): ${room.suggestion}`
      )

      // Build features content
      const featuresContent = layout.features.map(f => `• ${f.name}: ${f.description}`)

      const pdf = await generateProfessionalDocument({
        title: "Vastu-Compliant Layout Report",
        subtitle: `Vastu Compliance Score: ${layout.score}% (${layout.category})`,
        sections: [
          {
            heading: "Project Details",
            content: [
              `Construction Type: ${inputs.constructionType.toUpperCase()}`,
              `Floors: ${inputs.floors}`,
              `Plot Dimensions: ${inputs.plotLength}ft x ${inputs.plotWidth}ft (${inputs.plotArea} sq.ft)`,
              `Facing Direction: ${inputs.facing.toUpperCase()}`,
              `Road Position: ${inputs.roadPosition}`,
              `Generated Date: ${date}`,
            ]
          },
          {
            heading: "Executive Summary",
            content: [
              "The following report provides a comprehensive Vastu analysis for your property based on high-end industrial engineering principles.",
              `Overall Vastu Compliance Score: ${layout.score}%`,
              `Property Rating: ${layout.category}`,
              "Detailed analysis and layout recommendations follow on the subsequent pages."
            ]
          }
        ],
        footerText: `Vastu Analysis Report | Compliance Score: ${layout.score}%`,
      })

      // Detailed Room Analysis Page
      pdf.addPage()
      let yPos = 25

      pdf.setTextColor(34, 197, 94)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("DETAILED ROOM ORIENTATION ANALYSIS", 20, yPos)
      pdf.line(20, yPos + 2, 190, yPos + 2)
      yPos += 12

      layout.rooms.forEach((room) => {
        if (yPos > 250) {
          pdf.addPage()
          yPos = 25
        }

        // Status indicator
        if (room.status === "compliant") {
          pdf.setFillColor(34, 197, 94)
        } else if (room.status === "warning") {
          pdf.setFillColor(251, 191, 36)
        } else {
          pdf.setFillColor(239, 68, 68)
        }
        pdf.circle(18, yPos - 1, 2, "F")

        pdf.setTextColor(0, 0, 0)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(10)
        pdf.text(`${room.name}`, 23, yPos)
        
        pdf.setFont("helvetica", "normal")
        pdf.setTextColor(100, 100, 100)
        pdf.text(`- ${room.direction}`, 70, yPos)
        
        pdf.setTextColor(0, 0, 0)
        pdf.setFontSize(8)
        pdf.text(`[${room.priority.toUpperCase()}]`, 160, yPos, { align: "right" })

        yPos += 6
        pdf.setTextColor(80, 80, 80)
        pdf.setFontSize(9)
        const suggestionLines = pdf.splitTextToSize(room.suggestion, 165)
        pdf.text(suggestionLines, 23, yPos)
        yPos += suggestionLines.length * 4.5

        if (room.remedy) {
          pdf.setTextColor(150, 50, 50)
          pdf.setFont("helvetica", "bold")
          const remedyLines = pdf.splitTextToSize(`Remedy: ${room.remedy}`, 165)
          pdf.text(remedyLines, 23, yPos)
          yPos += remedyLines.length * 4.5
          pdf.setFont("helvetica", "normal")
        }

        yPos += 4
      })

      // Advanced Features Analysis Page
      pdf.addPage()
      yPos = 25

      pdf.setTextColor(59, 130, 246)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("ADVANCED FEATURES ANALYSIS (25+)", 20, yPos)
      pdf.line(20, yPos + 2, 190, yPos + 2)
      yPos += 12

      pdf.setFontSize(9)
      layout.features.forEach((feature, index) => {
        if (yPos > 270) {
          pdf.addPage()
          yPos = 25
        }

        // Status indicator
        if (feature.status === "pass") {
          pdf.setFillColor(34, 197, 94)
        } else if (feature.status === "warning") {
          pdf.setFillColor(251, 191, 36)
        } else {
          pdf.setFillColor(239, 68, 68)
        }
        pdf.circle(18, yPos - 1, 1.5, "F")

        pdf.setTextColor(0, 0, 0)
        pdf.setFont("helvetica", "bold")
        pdf.text(`${index + 1}. ${feature.name}`, 23, yPos)
        
        pdf.setFont("helvetica", "normal")
        yPos += 5
        pdf.setTextColor(80, 80, 80)
        const descLines = pdf.splitTextToSize(feature.description, 165)
        pdf.text(descLines, 23, yPos)
        yPos += descLines.length * 4 + 2
      })

      // Doshas & Remedies Page
      pdf.addPage()
      yPos = 25

      pdf.setTextColor(239, 68, 68)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("VASTU DOSHA DETECTION & REMEDIES", 20, yPos)
      pdf.line(20, yPos + 2, 190, yPos + 2)
      yPos += 12

      pdf.setFontSize(10)
      layout.doshas.forEach((dosha) => {
        if (yPos > 260) {
          pdf.addPage()
          yPos = 25
        }

        if (dosha.severity === "high") {
          pdf.setFillColor(239, 68, 68)
        } else if (dosha.severity === "medium") {
          pdf.setFillColor(251, 191, 36)
        } else {
          pdf.setFillColor(34, 197, 94)
        }
        
        pdf.rect(20, yPos - 4, 35, 6, "F")
        pdf.setTextColor(255, 255, 255)
        pdf.setFont("helvetica", "bold")
        pdf.text(dosha.severity.toUpperCase(), 37.5, yPos, { align: "center" })

        pdf.setTextColor(0, 0, 0)
        pdf.setFont("helvetica", "bold")
        pdf.text(dosha.name, 60, yPos)

        yPos += 7
        pdf.setFont("helvetica", "normal")
        pdf.setTextColor(80, 80, 80)
        pdf.setFontSize(9)
        const remedyLines = pdf.splitTextToSize(`Remedy Action: ${dosha.remedy}`, 160)
        pdf.text(remedyLines, 23, yPos)
        yPos += remedyLines.length * 4.5 + 5
      })

      // Color Recommendations
      yPos += 10
      if (yPos > 200) {
        pdf.addPage()
        yPos = 25
      }

      pdf.setTextColor(59, 130, 246)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("PREMIUM COLOR RECOMMENDATIONS", 20, yPos)
      pdf.line(20, yPos + 2, 190, yPos + 2)
      yPos += 12

      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      layout.colorRecommendations.forEach((rec) => {
        if (yPos > 275) {
          pdf.addPage()
          yPos = 25
        }

        pdf.setFont("helvetica", "bold")
        pdf.text(`${rec.room}:`, 23, yPos)
        pdf.setFont("helvetica", "normal")
        pdf.setTextColor(70, 70, 70)
        pdf.text(rec.colors.join(", "), 75, yPos)
        yPos += 8
      })

      // Final Branding & Save
      const pageCount = pdf.getNumberOfPages()
      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.text(`Generated by SIID VLG System | Professional Report | Page ${i} of ${pageCount}`, 105, 285, { align: "center" })
        pdf.text(`Report Validity: 12 Months | Reference ID: VLG-${Date.now().toString().slice(-6)}`, 105, 290, { align: "center" })
      }

      pdf.save(`SIID-Vastu-Layout-${inputs.constructionType}-${date.replace(/\//g, "-")}.pdf`)

      toast({
        title: "Professional PDF Generated",
        description: "Your comprehensive Vastu analysis report has been saved.",
      })
    } catch (error) {
      console.error("PDF Generation Error:", error)
      toast({
        title: "Generation Failed",
        description: "Error constructing your professional report. Please try again.",
        variant: "destructive",
      })
    }
  }

const downloadImage = () => {
  toast({
    title: "Image Generation",
    description: "High-resolution layout image is being generated...",
  })

  // Create canvas for layout visualization
  const canvas = document.createElement("canvas")
  canvas.width = 1200
  canvas.height = 1600
  const ctx = canvas.getContext("2d")

  if (!ctx || !layout) return

  // Background
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Header
  ctx.fillStyle = "#3b82f6"
  ctx.fillRect(0, 0, canvas.width, 100)
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 36px Arial"
  ctx.textAlign = "center"
  ctx.fillText("VASTU LAYOUT", canvas.width / 2, 50)
  ctx.font = "20px Arial"
  ctx.fillText(layout.layoutMap, canvas.width / 2, 80)

  // Score badge
  ctx.fillStyle = layout.score >= 75 ? "#22c55e" : "#eab308"
  ctx.fillRect(50, 120, 200, 80)
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 48px Arial"
  ctx.fillText(`${layout.score}%`, 150, 170)

  // Dynamic room layout grid generator
  const getRoomLabel = (r: number, c: number) => {
    const dataset = VASTU_DATASET[inputs.constructionType] || VASTU_DATASET.house
    const cell = dataset[r][c]
    return { title: cell.title, color: cell.color }
  }


  const availableWidth = 800
  const availableHeight = 1000

  // Scale layout using plot dimensions (Width/Length)
  const plotRatio = (inputs.plotWidth || 30) / (inputs.plotLength || 40)
  let canvasPlotW = availableWidth
  let canvasPlotH = availableWidth / plotRatio

  if (canvasPlotH > availableHeight) {
    canvasPlotH = availableHeight
    canvasPlotW = availableHeight * plotRatio
  }

  const startX = (canvas.width - canvasPlotW) / 2
  const startY = 250

  const cellWidth = canvasPlotW / 3
  const cellHeight = canvasPlotH / 3

  // Draw compass directions
  ctx.fillStyle = "#000000"
  ctx.font = "bold 20px Arial"
  ctx.fillText("NORTH", startX + canvasPlotW / 2, startY - 20)
  ctx.fillText("SOUTH", startX + canvasPlotW / 2, startY + canvasPlotH + 30)
  ctx.fillText("EAST", startX + canvasPlotW + 35, startY + canvasPlotH / 2)
  ctx.fillText("WEST", startX - 45, startY + canvasPlotH / 2)

  // Draw dynamic Vastu grid
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const room = getRoomLabel(row, col)

      const x = startX + col * cellWidth
      const y = startY + row * cellHeight

      // Fill Room Background (simulating opacity using hex)
      ctx.fillStyle = room.color + "1A" // ~10% opacity
      ctx.fillRect(x, y, cellWidth, cellHeight)

      // Stroke Grid
      ctx.strokeStyle = "#475569"
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, cellWidth, cellHeight)

      // Draw Text
      ctx.fillStyle = room.color
      ctx.font = "bold 16px Arial"
      ctx.fillText(room.title, x + (cellWidth / 2), y + (cellHeight / 2))

      // Add Entrance Marker based on facing direction
      if (
        (inputs.facing === "north" && row === 0 && col === 1) ||
        (inputs.facing === "east" && row === 1 && col === 2) ||
        (inputs.facing === "south" && row === 2 && col === 1) ||
        (inputs.facing === "west" && row === 1 && col === 0) ||
        (inputs.facing === "northeast" && row === 0 && col === 2) ||
        (inputs.facing === "northwest" && row === 0 && col === 0) ||
        (inputs.facing === "southeast" && row === 2 && col === 2) ||
        (inputs.facing === "southwest" && row === 2 && col === 0)
      ) {
        ctx.fillStyle = "#000000"
        ctx.font = "bold 14px Arial"
        ctx.fillText("🚪 ENTRANCE", x + (cellWidth / 2), y + (cellHeight / 2) + 25)
      }
    }
  }

  console.log("Generated Dynamic Layout Grid bounds:", { canvasPlotW, canvasPlotH, cellWidth, cellHeight })

  // Convert to image and download
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Vastu-Layout-${inputs.constructionType}-${new Date().toLocaleDateString()}.png`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Image Downloaded",
        description: "Layout visualization has been saved",
      })
    }
  })
}

const nextStep = () => setStep(Math.min(step + 1, 3))
const prevStep = () => setStep(Math.max(step - 1, 1))

return (
  <Card className="p-6 border-border">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Compass className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">Comprehensive Vastu Layout Generator</h3>
      </div>
      <Badge variant="outline">Step {step} of 3</Badge>
    </div>

    {/* Step 1: Construction Details */}
    {step === 1 && (
      <div className="space-y-4">
        <h4 className="font-semibold text-base mb-3">A. Construction Details</h4>

        <div>
          <Label>Type of Construction *</Label>
          <Select
            value={inputs.constructionType}
            onValueChange={(v) => setInputs({ ...inputs, constructionType: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">Individual House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="commercial">Commercial Building</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="hospital">Hospital/Medical Center</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Number of Floors *</Label>
          <Select value={inputs.floors} onValueChange={(v) => setInputs({ ...inputs, floors: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="G">Ground Floor (G)</SelectItem>
              <SelectItem value="G+1">G+1</SelectItem>
              <SelectItem value="G+2">G+2</SelectItem>
              <SelectItem value="G+3">G+3</SelectItem>
              <SelectItem value="G+4">G+4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Built-up Area Preference</Label>
          <Input
            placeholder="e.g., 1500 sq.ft"
            value={inputs.builtUpArea}
            onChange={(e) => setInputs({ ...inputs, builtUpArea: e.target.value })}
          />
        </div>

        <Button onClick={nextStep} className="w-full">
          Next: Land Details
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )}

    {/* Step 2: Land Details */}
    {step === 2 && (
      <div className="space-y-4">
        <h4 className="font-semibold text-base mb-3">B. Land Details</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Plot Length (ft) *</Label>
            <Input
              type="number"
              value={inputs.plotLength}
              onChange={(e) => updateDimensions("plotLength", Number(e.target.value))}
              min={10}
              max={500}
            />
          </div>
          <div>
            <Label>Plot Width (ft) *</Label>
            <Input
              type="number"
              value={inputs.plotWidth}
              onChange={(e) => updateDimensions("plotWidth", Number(e.target.value))}
              min={10}
              max={500}
            />
          </div>
        </div>

        <div>
          <Label>Plot Area (Auto-calculated)</Label>
          <Input value={`${inputs.plotArea} sq.ft`} disabled className="bg-muted" />
        </div>

        <div>
          <Label>Facing Direction *</Label>
          <Select value={inputs.facing} onValueChange={(v) => setInputs({ ...inputs, facing: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="northeast">Northeast</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="southeast">Southeast</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="southwest">Southwest</SelectItem>
              <SelectItem value="west">West</SelectItem>
              <SelectItem value="northwest">Northwest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Road Position</Label>
          <Select value={inputs.roadPosition} onValueChange={(v) => setInputs({ ...inputs, roadPosition: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one-side">One-side Road</SelectItem>
              <SelectItem value="two-side">Two-side Road</SelectItem>
              <SelectItem value="corner">Corner Plot</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={prevStep} variant="outline" className="flex-1 bg-transparent">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={nextStep} className="flex-1">
            Next: Environment
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )}

    {/* Step 3: Environmental Inputs */}
    {step === 3 && (
      <div className="space-y-4">
        <h4 className="font-semibold text-base mb-3">C. Environmental Inputs</h4>

        <div>
          <Label>Surrounding Open Spaces</Label>
          <Select value={inputs.openSpaces} onValueChange={(v) => setInputs({ ...inputs, openSpaces: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plenty">Plenty of Open Space</SelectItem>
              <SelectItem value="moderate">Moderate Space</SelectItem>
              <SelectItem value="limited">Limited Space</SelectItem>
              <SelectItem value="none">No Open Space</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Neighbor Building Height</Label>
          <Select value={inputs.neighborHeight} onValueChange={(v) => setInputs({ ...inputs, neighborHeight: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ground">Ground Level</SelectItem>
              <SelectItem value="low">Low (1-2 floors)</SelectItem>
              <SelectItem value="medium">Medium (3-4 floors)</SelectItem>
              <SelectItem value="high">High (5+ floors)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Climatic Zone (Optional)</Label>
          <Select value={inputs.climaticZone} onValueChange={(v) => setInputs({ ...inputs, climaticZone: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hot-dry">Hot & Dry</SelectItem>
              <SelectItem value="hot-humid">Hot & Humid</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
              <SelectItem value="coastal">Coastal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={prevStep} variant="outline" className="flex-1 bg-transparent">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={generateLayout} className="flex-1 bg-primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Layout
          </Button>
        </div>
      </div>
    )}

    {/* Layout Results */}
    {layout && (
      <div className="mt-6 pt-6 border-t space-y-4">
        {/* Score Display */}
        <div
          className={`p-6 rounded-lg border-2 ${layout.score >= 90
            ? "bg-green-50 dark:bg-green-900/20 border-green-500"
            : layout.score >= 75
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
              : layout.score >= 60
                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                : "bg-red-50 dark:bg-red-900/20 border-red-500"
            }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium mb-1">Vastu Compliance Score</div>
              <div className="text-4xl font-bold">{layout.score}%</div>
              <Badge className="mt-2" variant={layout.score >= 75 ? "default" : "secondary"}>
                {layout.category}
              </Badge>
            </div>
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Room Analysis */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            Room Placement Analysis
            <Badge variant="outline">{layout.rooms.length}</Badge>
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {layout.rooms.map((room, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${room.status === "compliant"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200"
                  : room.status === "warning"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200"
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {room.status === "compliant" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : room.status === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-medium text-sm">{room.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {room.direction}
                  </Badge>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {room.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground ml-6">{room.suggestion}</p>
                {room.remedy && (
                  <p className="text-xs text-red-600 dark:text-red-400 ml-6 mt-1">Remedy: {room.remedy}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            Advanced Features Analysis
            <Badge variant="outline">{layout.features.length}+ Features</Badge>
          </h4>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {layout.features.map((feature, index) => (
              <div key={index} className="text-xs flex items-start gap-1">
                {feature.status === "pass" ? (
                  <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-muted-foreground">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doshas */}
        <div>
          <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">Vastu Dosha Detection</h4>
          <div className="space-y-2">
            {layout.doshas.map((dosha, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${dosha.severity === "high"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-300"
                  : dosha.severity === "medium"
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300"
                    : "bg-green-50 dark:bg-green-900/20 border-green-300"
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={
                      dosha.severity === "high"
                        ? "destructive"
                        : dosha.severity === "medium"
                          ? "secondary"
                          : "default"
                    }
                    className="text-xs"
                  >
                    {dosha.severity.toUpperCase()}
                  </Badge>
                  <span className="font-medium text-sm">{dosha.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Remedy:</span> {dosha.remedy}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={downloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={downloadImage}>
            <FileImage className="w-4 h-4 mr-2" />
            Download Image
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={generateLayout}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>
    )}
  </Card>
)
}
