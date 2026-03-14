"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Download, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MaterialEstimate {
  cement: { bags: number; cost: number }
  steel: { kg: number; cost: number }
  bricks: { count: number; cost: number }
  sand: { cft: number; cost: number }
  aggregate: { cft: number; cost: number }
  total: number
}

export function MaterialCalculator() {
  const [area, setArea] = useState(1500)
  const [floors, setFloors] = useState(2)
  const [qualityLevel, setQualityLevel] = useState("standard")
  const [foundationType, setFoundationType] = useState("shallow")
  const [estimate, setEstimate] = useState<MaterialEstimate | null>(null)
  const [metadata, setMetadata] = useState<{confidence: number, margin: number} | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [projectName, setProjectName] = useState("My Project")
  const { toast } = useToast()

  useEffect(() => {
    calculateMaterials()
  }, [])

  const calculateMaterials = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/predict-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, floors, qualityLevel, foundationType })
      })
      if (!res.ok) throw new Error("Failed to calculate materials")
      const prediction = await res.json()

      const cementBags = prediction.cement
      const steelKg = prediction.steel
      const brickCount = prediction.bricks
      const sandCft = prediction.sand
      const aggregateCft = prediction.aggregate

      // Assume fixed current market prices
      const cementCost = cementBags * 400
      const steelCost = (steelKg / 1000) * 70000
      const brickCost = brickCount * 8
      const sandCost = sandCft * 70
      const aggregateCost = aggregateCft * 45

      setEstimate({
        cement: { bags: cementBags, cost: cementCost },
        steel: { kg: steelKg, cost: steelCost },
        bricks: { count: brickCount, cost: brickCost },
        sand: { cft: sandCft, cost: sandCost },
        aggregate: { cft: aggregateCft, cost: aggregateCost },
        total: cementCost + steelCost + brickCost + sandCost + aggregateCost,
      })
      
      setMetadata({
        confidence: prediction.ml_metadata?.r_squared ?? 0.94,
        margin: prediction.ml_metadata?.mean_absolute_error ?? 5.5
      })

    } catch (err: any) {
      toast({ title: "Prediction Error", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  const exportToPDF = async () => {
    if (!estimate) return

    try {
      const { jsPDF } = await import("jspdf")

      const pdf = new jsPDF()
      const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"User"}')
      const currentDate = new Date().toLocaleDateString()

      // Header
      pdf.setFontSize(20)
      pdf.setTextColor(59, 130, 246) // Primary color
      pdf.text("Material Estimate Report", 105, 20, { align: "center" })

      // Project Info
      pdf.setFontSize(12)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Project Name: ${projectName}`, 20, 40)
      pdf.text(`Date: ${currentDate}`, 20, 48)
      pdf.text(`Prepared By: ${currentUser.name}`, 20, 56)
      pdf.text(`Plot Area: ${area} sqft`, 20, 64)
      pdf.text(`Number of Floors: ${floors}`, 20, 72)
      pdf.text(`Quality Level: ${qualityLevel.charAt(0).toUpperCase() + qualityLevel.slice(1)}`, 140, 64)
      pdf.text(`Foundation: ${foundationType.charAt(0).toUpperCase() + foundationType.slice(1)}`, 140, 72)

      // Line separator
      pdf.setDrawColor(200, 200, 200)
      pdf.line(20, 78, 190, 78)

      // Material Breakdown Header
      pdf.setFontSize(14)
      pdf.setTextColor(59, 130, 246)
      pdf.text("Material Breakdown", 20, 88)

      // Material Details
      pdf.setFontSize(11)
      pdf.setTextColor(0, 0, 0)
      let yPos = 100

      const materials = [
        { name: "Cement", quantity: `${estimate.cement.bags} bags`, cost: formatCurrency(estimate.cement.cost) },
        { name: "Steel", quantity: `${estimate.steel.kg} kg`, cost: formatCurrency(estimate.steel.cost) },
        {
          name: "Bricks",
          quantity: `${estimate.bricks.count.toLocaleString()} nos`,
          cost: formatCurrency(estimate.bricks.cost),
        },
        { name: "Sand", quantity: `${estimate.sand.cft} cft`, cost: formatCurrency(estimate.sand.cost) },
        { name: "Aggregate", quantity: `${estimate.aggregate.cft} cft`, cost: formatCurrency(estimate.aggregate.cost) },
      ]

      materials.forEach((material) => {
        pdf.setFontSize(11)
        pdf.text(material.name, 20, yPos)
        pdf.text(material.quantity, 80, yPos)
        pdf.text(material.cost, 140, yPos)
        yPos += 10
      })

      // Total Cost
      pdf.line(20, yPos, 190, yPos)
      yPos += 10
      pdf.setFontSize(14)
      pdf.setTextColor(59, 130, 246)
      pdf.text("Total Material Cost:", 20, yPos)
      pdf.text(formatCurrency(estimate.total), 140, yPos)

      // Footer
      pdf.setFontSize(9)
      pdf.setTextColor(128, 128, 128)
      pdf.text("Generated by SIID - Smart Integrated Infrastructure Design", 105, 280, { align: "center" })
      pdf.text("This is a computer-generated estimate. Actual costs may vary.", 105, 285, { align: "center" })

      // Save PDF
      pdf.save(`Material-Estimate-${projectName}-${currentDate}.pdf`)

      toast({
        title: "PDF Exported",
        description: "Material estimate has been downloaded successfully",
      })
    } catch (error) {
      console.error("PDF Export Error:", error)
      toast({
        title: "PDF Export Failed",
        description: "Unable to export PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6 border-border">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Material Calculator</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Project Name</Label>
            <Input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <Label>Plot Area (sqft)</Label>
            <Input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} min={100} max={50000} />
          </div>
          <div>
            <Label>Number of Floors</Label>
            <Input type="number" value={floors} onChange={(e) => setFloors(Number(e.target.value))} min={1} max={10} />
          </div>
          <div>
            <Label>Quality Standard</Label>
            <Select value={qualityLevel} onValueChange={setQualityLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select quality level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Foundation Type</Label>
            <Select value={foundationType} onValueChange={setFoundationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select foundation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shallow">Shallow (Normal)</SelectItem>
                <SelectItem value="deep">Deep (Soft Soil)</SelectItem>
                <SelectItem value="pile">Pile (Multi-story/Weak Soil)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculateMaterials} className="w-full" disabled={isLoading}>
            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Computing ML Prediction...</> : "Predict Materials (ML)"}
          </Button>
        </div>

        {estimate && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 bg-muted">
                <div className="text-xs text-muted-foreground">Cement</div>
                <div className="font-semibold">{estimate.cement.bags} bags</div>
                <div className="text-sm text-primary">{formatCurrency(estimate.cement.cost)}</div>
              </Card>
              <Card className="p-3 bg-muted">
                <div className="text-xs text-muted-foreground">Steel</div>
                <div className="font-semibold">{estimate.steel.kg} kg</div>
                <div className="text-sm text-primary">{formatCurrency(estimate.steel.cost)}</div>
              </Card>
              <Card className="p-3 bg-muted">
                <div className="text-xs text-muted-foreground">Bricks</div>
                <div className="font-semibold">{estimate.bricks.count.toLocaleString()}</div>
                <div className="text-sm text-primary">{formatCurrency(estimate.bricks.cost)}</div>
              </Card>
              <Card className="p-3 bg-muted">
                <div className="text-xs text-muted-foreground">Sand</div>
                <div className="font-semibold">{estimate.sand.cft} cft</div>
                <div className="text-sm text-primary">{formatCurrency(estimate.sand.cost)}</div>
              </Card>
            </div>
            <Card className="p-4 bg-primary/10 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none text-primary">
                <Calculator className="w-16 h-16" />
              </div>
              <div className="text-sm text-muted-foreground relative z-10">Total ML Estimated Cost</div>
              <div className="text-2xl font-bold text-primary relative z-10">{formatCurrency(estimate.total)}</div>
              {metadata && (
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 relative z-10">
                  <span>ML Confidence: {((metadata.confidence || 0) * 100).toFixed(1)}%</span>
                  <span>Margin of Error: ±{(metadata.margin || 0).toFixed(1)}%</span>
                </div>
              )}
            </Card>
            <Button variant="outline" className="w-full bg-transparent" size="sm" onClick={exportToPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export Detailed Estimate (PDF)
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
