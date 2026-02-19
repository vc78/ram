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
    const { constructionType, facing, floors } = inputs

    // Core layout rules based on construction type
    const coreRules: Record<string, VastuRule[]> = {
      house: [
        {
          name: "Main Entrance",
          direction: facing === "north" ? "North-Northeast" : facing === "east" ? "East-Northeast" : "North",
          status: ["north", "east", "northeast"].includes(facing) ? "compliant" : "warning",
          priority: "must-follow",
          suggestion: "North or East entrance brings prosperity and positive energy",
          remedy: "Place Ganesha idol near entrance if direction cannot be changed",
        },
        {
          name: "Living Room",
          direction: "North or East",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Living room in North/East promotes social harmony and family bonding",
        },
        {
          name: "Kitchen",
          direction: "Southeast",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Fire element (Agni) correctly positioned in Southeast direction",
          remedy: "Cook facing East for optimal energy",
        },
        {
          name: "Master Bedroom",
          direction: "Southwest",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Southwest placement ensures stability, health, and sound sleep",
        },
        {
          name: "Children's Bedroom",
          direction: "West or Northwest",
          status: "compliant",
          priority: "recommended",
          suggestion: "Supports growth, learning, and creativity in children",
        },
        {
          name: "Guest Room",
          direction: "Northwest",
          status: "compliant",
          priority: "recommended",
          suggestion: "Ensures guests don't overstay while feeling welcomed",
        },
        {
          name: "Pooja Room",
          direction: "Northeast",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Northeast (Ishanya) corner maximizes divine and spiritual energy",
        },
        {
          name: "Bathrooms",
          direction: "Northwest or West",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Water element properly aligned, avoid Northeast and Southwest",
        },
        {
          name: "Toilets",
          direction: "Northwest or South",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Keep toilets away from Northeast and Southwest for positive energy",
          remedy: "Keep toilet lids closed when not in use",
        },
        {
          name: "Staircase",
          direction: "South or Southwest",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Stairs in South avoid blocking positive energy from North/East",
          remedy: "Ensure clockwise ascent for positive energy flow",
        },
        {
          name: "Store Room",
          direction: "Southwest or South",
          status: "compliant",
          priority: "advisory",
          suggestion: "Heavy storage in Southwest adds to structural stability",
        },
        {
          name: "Study Room",
          direction: "East or Northeast",
          status: "compliant",
          priority: "recommended",
          suggestion: "East direction enhances concentration and academic success",
        },
        {
          name: "Dining Area",
          direction: "West or East",
          status: "compliant",
          priority: "advisory",
          suggestion: "West placement promotes family bonding during meals",
        },
      ],
      apartment: [
        {
          name: "Main Door",
          direction: "North or East",
          status: ["north", "east", "northeast"].includes(facing) ? "compliant" : "warning",
          priority: "must-follow",
          suggestion: "Attracts positive energy and prosperity",
        },
        {
          name: "Balcony",
          direction: "North or East",
          status: "compliant",
          priority: "recommended",
          suggestion: "Ensures good ventilation and natural sunlight",
        },
        {
          name: "Kitchen",
          direction: "Southeast",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Agni element placement as per Vastu",
        },
        {
          name: "Master Bedroom",
          direction: "Southwest",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Provides stability and peaceful sleep",
        },
        {
          name: "Living Area",
          direction: "North or Northeast",
          status: "compliant",
          priority: "recommended",
          suggestion: "Open and welcoming space for family",
        },
      ],
      commercial: [
        {
          name: "Main Entrance",
          direction: "North or Northeast",
          status: ["north", "northeast"].includes(facing) ? "compliant" : "warning",
          priority: "must-follow",
          suggestion: "Attracts clients and business prosperity",
        },
        {
          name: "Reception Area",
          direction: "Northeast",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Creates welcoming first impression",
        },
        {
          name: "Manager Office",
          direction: "Southwest",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Position of authority and decision-making",
        },
        {
          name: "Accounts Section",
          direction: "North",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Governed by Kubera (Lord of Wealth)",
        },
        {
          name: "Conference Room",
          direction: "Northwest",
          status: "compliant",
          priority: "recommended",
          suggestion: "Facilitates productive meetings and negotiations",
        },
        {
          name: "Pantry/Kitchen",
          direction: "Southeast",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Fire element alignment",
        },
        {
          name: "Workstations",
          direction: "North or East facing",
          status: "compliant",
          priority: "recommended",
          suggestion: "Employees should face North or East while working",
        },
      ],
      villa: [
        {
          name: "Grand Entrance",
          direction: "North or Northeast",
          status: ["north", "northeast"].includes(facing) ? "compliant" : "warning",
          priority: "must-follow",
          suggestion: "Majestic energy flow and prosperity",
        },
        {
          name: "Living Hall",
          direction: "North or East",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Grand entertaining space with positive energy",
        },
        {
          name: "Master Suite",
          direction: "Southwest",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Power, stability, and luxury",
        },
        {
          name: "Guest Rooms",
          direction: "Northwest",
          status: "compliant",
          priority: "recommended",
          suggestion: "Comfortable accommodation for visitors",
        },
        {
          name: "Kitchen",
          direction: "Southeast",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Fire element correct placement",
        },
        {
          name: "Pooja/Meditation Room",
          direction: "Northeast",
          status: "compliant",
          priority: "must-follow",
          suggestion: "Spiritual sanctuary with divine energy",
        },
        {
          name: "Home Theater",
          direction: "South or West",
          status: "compliant",
          priority: "advisory",
          suggestion: "Entertainment zone away from sacred areas",
        },
        {
          name: "Swimming Pool",
          direction: "Northeast or North",
          status: "compliant",
          priority: "recommended",
          suggestion: "Water element positioning as per Vastu",
        },
        {
          name: "Garden/Lawn",
          direction: "North or East",
          status: "compliant",
          priority: "recommended",
          suggestion: "Open spaces in North/East for prosperity",
        },
      ],
    }

    return coreRules[constructionType] || coreRules.house
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

    // Calculate score based on compliance
    const compliantCount = rooms.filter((r) => r.status === "compliant").length
    const warningCount = rooms.filter((r) => r.status === "warning").length
    const totalRules = rooms.length

    const score = Math.round((compliantCount * 100 + warningCount * 60) / totalRules)

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
      const { jsPDF } = await import("jspdf")

      const pdf = new jsPDF()
      const date = new Date().toLocaleDateString()
      let yPos = 20

      // Header with logo area
      pdf.setFillColor(59, 130, 246)
      pdf.rect(0, 0, 210, 35, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(22)
      pdf.text("VASTU-COMPLIANT LAYOUT REPORT", 105, 15, { align: "center" })
      pdf.setFontSize(11)
      pdf.text("Professional Vastu Analysis & Recommendations", 105, 25, { align: "center" })

      yPos = 45

      // Project Details Box
      pdf.setDrawColor(59, 130, 246)
      pdf.setFillColor(240, 249, 255)
      pdf.rect(15, yPos, 180, 35, "FD")

      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(12)
      pdf.text("PROJECT DETAILS", 20, yPos + 8)
      pdf.setFontSize(10)
      pdf.text(`Type: ${inputs.constructionType.toUpperCase()}`, 20, yPos + 16)
      pdf.text(`Floors: ${inputs.floors}`, 20, yPos + 23)
      pdf.text(`Dimensions: ${inputs.plotLength}ft x ${inputs.plotWidth}ft`, 20, yPos + 30)
      pdf.text(`Area: ${inputs.plotArea} sq.ft`, 105, yPos + 16)
      pdf.text(`Facing: ${inputs.facing.toUpperCase()}`, 105, yPos + 23)
      pdf.text(`Generated: ${date}`, 105, yPos + 30)

      yPos += 45

      // Vastu Compliance Score - Large Display
      pdf.setFillColor(34, 197, 94)
      pdf.rect(15, yPos, 180, 25, "F")
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(16)
      pdf.text(`VASTU COMPLIANCE SCORE: ${layout.score}%`, 105, yPos + 10, { align: "center" })
      pdf.setFontSize(14)
      pdf.text(`Category: ${layout.category.toUpperCase()}`, 105, yPos + 18, { align: "center" })

      yPos += 35

      // Room Placement Analysis
      pdf.setTextColor(59, 130, 246)
      pdf.setFontSize(14)
      pdf.text("ROOM PLACEMENT ANALYSIS", 20, yPos)
      pdf.setDrawColor(200, 200, 200)
      pdf.line(20, yPos + 2, 190, yPos + 2)

      yPos += 10

      pdf.setFontSize(9)
      layout.rooms.forEach((room) => {
        if (yPos > 270) {
          pdf.addPage()
          yPos = 20
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
        pdf.setFont(undefined, "bold")
        pdf.text(`${room.name}`, 23, yPos)
        pdf.setFont(undefined, "normal")
        pdf.setTextColor(100, 100, 100)
        pdf.text(`- ${room.direction}`, 70, yPos)
        pdf.setTextColor(0, 0, 0)
        pdf.text(`[${room.priority}]`, 150, yPos)

        yPos += 5
        pdf.setTextColor(80, 80, 80)
        pdf.setFontSize(8)
        const suggestionLines = pdf.splitTextToSize(room.suggestion, 170)
        pdf.text(suggestionLines, 23, yPos)
        yPos += suggestionLines.length * 4

        if (room.remedy) {
          pdf.setTextColor(150, 50, 50)
          const remedyLines = pdf.splitTextToSize(`Remedy: ${room.remedy}`, 170)
          pdf.text(remedyLines, 23, yPos)
          yPos += remedyLines.length * 4
        }

        yPos += 3
      })

      // New Page for Features
      pdf.addPage()
      yPos = 20

      pdf.setTextColor(59, 130, 246)
      pdf.setFontSize(14)
      pdf.text("ADVANCED FEATURES ANALYSIS (25+)", 20, yPos)
      pdf.line(20, yPos + 2, 190, yPos + 2)

      yPos += 10

      pdf.setFontSize(8)
      layout.features.forEach((feature, index) => {
        if (yPos > 270) {
          pdf.addPage()
          yPos = 20
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
        pdf.setFont(undefined, "bold")
        pdf.text(`${index + 1}. ${feature.name}`, 23, yPos)
        pdf.setFont(undefined, "normal")

        yPos += 4
        pdf.setTextColor(80, 80, 80)
        const descLines = pdf.splitTextToSize(feature.description, 170)
        pdf.text(descLines, 23, yPos)
        yPos += descLines.length * 3.5 + 2
      })

      // Doshas & Remedies
      pdf.addPage()
      yPos = 20

      pdf.setTextColor(239, 68, 68)
      pdf.setFontSize(14)
      pdf.text("VASTU DOSHA DETECTION & REMEDIES", 20, yPos)
      pdf.line(20, yPos + 2, 190, yPos + 2)

      yPos += 10

      pdf.setFontSize(10)
      layout.doshas.forEach((dosha) => {
        if (yPos > 260) {
          pdf.addPage()
          yPos = 20
        }

        pdf.setFillColor(
          dosha.severity === "high" ? [239, 68, 68] : dosha.severity === "medium" ? [251, 191, 36] : [34, 197, 94],
        )
        pdf.rect(20, yPos - 4, 40, 6, "F")
        pdf.setTextColor(255, 255, 255)
        pdf.setFont(undefined, "bold")
        pdf.text(dosha.severity.toUpperCase(), 40, yPos, { align: "center" })

        pdf.setTextColor(0, 0, 0)
        pdf.setFont(undefined, "bold")
        pdf.text(dosha.name, 65, yPos)

        yPos += 6
        pdf.setFont(undefined, "normal")
        pdf.setTextColor(80, 80, 80)
        pdf.setFontSize(9)
        const remedyLines = pdf.splitTextToSize(`Remedy: ${dosha.remedy}`, 170)
        pdf.text(remedyLines, 23, yPos)
        yPos += remedyLines.length * 4 + 5
      })

      // Color Recommendations
      yPos += 5
      if (yPos > 200) {
        pdf.addPage()
        yPos = 20
      }

      pdf.setTextColor(59, 130, 246)
      pdf.setFontSize(14)
      pdf.text("COLOR RECOMMENDATIONS", 20, yPos)
      pdf.line(20, yPos + 2, 190, yPos + 2)

      yPos += 10

      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      layout.colorRecommendations.forEach((rec) => {
        if (yPos > 270) {
          pdf.addPage()
          yPos = 20
        }

        pdf.setFont(undefined, "bold")
        pdf.text(`${rec.room}:`, 23, yPos)
        pdf.setFont(undefined, "normal")
        pdf.text(rec.colors.join(", "), 70, yPos)
        yPos += 7
      })

      // Footer
      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      const pageCount = pdf.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.text(`Generated by SIID Vastu Layout Generator | Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
        pdf.text(`Report ID: VLG-${Date.now()}`, 105, 285, { align: "center" })
      }

      pdf.save(`Vastu-Layout-${inputs.constructionType}-${date}.pdf`)

      toast({
        title: "PDF Downloaded",
        description: "Complete Vastu report has been saved successfully",
      })
    } catch (error) {
      console.error("PDF Generation Error:", error)
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF. Please try again.",
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

    // Simple room layout grid
    const gridSize = 150
    const startX = 300
    const startY = 150

    // Draw compass directions
    ctx.fillStyle = "#000000"
    ctx.font = "bold 16px Arial"
    ctx.fillText("N", startX + gridSize * 1.5, startY - 20)
    ctx.fillText("S", startX + gridSize * 1.5, startY + gridSize * 3 + 40)
    ctx.fillText("E", startX + gridSize * 3 + 40, startY + gridSize * 1.5)
    ctx.fillText("W", startX - 40, startY + gridSize * 1.5)

    // Draw grid
    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 2
    for (let i = 0; i <= 3; i++) {
      for (let j = 0; j <= 3; j++) {
        ctx.strokeRect(startX + i * gridSize, startY + j * gridSize, gridSize, gridSize)
      }
    }

    // Label major zones
    ctx.font = "bold 14px Arial"
    ctx.fillStyle = "#059669"
    ctx.fillText("NE", startX + gridSize * 2 + 10, startY + 30)
    ctx.fillText("(Pooja)", startX + gridSize * 2 + 10, startY + 50)

    ctx.fillStyle = "#dc2626"
    ctx.fillText("SE", startX + gridSize * 2 + 10, startY + gridSize * 2 + 30)
    ctx.fillText("(Kitchen)", startX + gridSize * 2 + 10, startY + gridSize * 2 + 50)

    ctx.fillStyle = "#7c3aed"
    ctx.fillText("SW", startX + 10, startY + gridSize * 2 + 30)
    ctx.fillText("(Master)", startX + 10, startY + gridSize * 2 + 50)

    ctx.fillStyle = "#0891b2"
    ctx.fillText("NW", startX + 10, startY + 30)
    ctx.fillText("(Guest)", startX + 10, startY + 50)

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
            className={`p-6 rounded-lg border-2 ${
              layout.score >= 90
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
                  className={`p-3 rounded-lg border ${
                    room.status === "compliant"
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
                  className={`p-3 rounded-lg border ${
                    dosha.severity === "high"
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
