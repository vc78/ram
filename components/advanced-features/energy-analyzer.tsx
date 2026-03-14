"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Sun, Leaf, TrendingDown, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnergyMetrics {
  monthlyConsumption: number
  monthlyBill: number
  carbonFootprint: number
  efficiencyScore: number
  ai_insights: string[]
  ml_metadata?: {
    model: string
    training_accuracy: string
  }
}

export function EnergyAnalyzer() {
  const [area, setArea] = useState(2000)
  const [acUnits, setAcUnits] = useState(3)
  const [solarPanels, setSolarPanels] = useState(0)
  const [ledPercentage, setLedPercentage] = useState(80)

  const [climateZone, setClimateZone] = useState("moderate")
  const [insulationQuality, setInsulationQuality] = useState("standard")
  const [metrics, setMetrics] = useState<EnergyMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    calculateMetrics()
  }, []) // Initial load

  const calculateMetrics = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/predict-energy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area, acUnits, solarPanels, ledPercentage, climateZone, insulationQuality })
      })
      if (!res.ok) throw new Error("Failed to predict energy consumption")
      const result = await res.json()
      setMetrics(result)
    } catch (err: any) {
      toast({ title: "Energy ML Prediction Error", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  return (
    <Card className="p-6 border-border">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Energy Efficiency Analyzer</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm">Home Area (sqft)</label>
              <span className="text-sm font-medium">{area} sqft</span>
            </div>
            <Slider value={[area]} onValueChange={(v) => setArea(v[0])} min={500} max={10000} step={100} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm">AC Units</label>
              <span className="text-sm font-medium">{acUnits}</span>
            </div>
            <Slider value={[acUnits]} onValueChange={(v) => setAcUnits(v[0])} min={0} max={10} step={1} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm">Solar Panels</label>
              <span className="text-sm font-medium">{solarPanels} panels</span>
            </div>
            <Slider value={[solarPanels]} onValueChange={(v) => setSolarPanels(v[0])} min={0} max={20} step={1} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm">LED Lighting</label>
              <span className="text-sm font-medium">{ledPercentage}%</span>
            </div>
            <Slider value={[ledPercentage]} onValueChange={(v) => setLedPercentage(v[0])} min={0} max={100} step={5} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-2 block">Climate Zone</label>
              <Select value={climateZone} onValueChange={setClimateZone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Hot (Cooling heavy)</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="cold">Cold (Heating heavy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Insulation Quality</label>
              <Select value={insulationQuality} onValueChange={setInsulationQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor (Older Build)</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium (Air-tight)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={calculateMetrics} className="w-full" disabled={isLoading}>
            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Simulating Usage...</> : "Predict Energy (ML)"}
          </Button>
        </div>

        <div className="space-y-4">
          {metrics && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 bg-muted">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-muted-foreground">Monthly Usage</span>
                  </div>
                  <div className="text-xl font-bold">{metrics.monthlyConsumption} kWh</div>
                </Card>
                <Card className="p-4 bg-muted">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Monthly Bill</span>
                  </div>
                  <div className="text-xl font-bold">{formatCurrency(metrics.monthlyBill)}</div>
                </Card>
                <Card className="p-4 bg-muted">
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-muted-foreground">CO2 Footprint</span>
                  </div>
                  <div className="text-xl font-bold">{metrics.carbonFootprint} kg</div>
                </Card>
                <Card className="p-4 bg-primary/10 border-primary">
                  <div className="flex items-center gap-2 mb-1">
                    <Sun className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Efficiency Score</span>
                  </div>
                  <div className="text-xl font-bold text-primary">{metrics.efficiencyScore}/100</div>
                </Card>
              </div>

              <Card className="p-4 bg-background border">
                <div className="text-sm font-medium mb-2">AI Output Recommendations:</div>
                <ul className="space-y-1">
                  {(metrics.ai_insights || []).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Leaf className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card>

              {metrics.ml_metadata && (
                <div className="text-[10px] text-muted-foreground/60 flex justify-between px-1">
                  <span>Model: {metrics.ml_metadata.model}</span>
                  <span>Acc: {metrics.ml_metadata.training_accuracy}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
