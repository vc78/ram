"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Zap, Sun, Leaf, TrendingDown } from "lucide-react"

interface EnergyMetrics {
  monthlyConsumption: number
  monthlyBill: number
  carbonFootprint: number
  efficiencyScore: number
  recommendations: string[]
}

export function EnergyAnalyzer() {
  const [area, setArea] = useState(2000)
  const [acUnits, setAcUnits] = useState(3)
  const [solarPanels, setSolarPanels] = useState(0)
  const [ledPercentage, setLedPercentage] = useState(80)

  const calculateMetrics = (): EnergyMetrics => {
    // Base consumption: ~10 units per sqft per month for residential
    let baseConsumption = (area / 100) * 10

    // AC adds ~150 units per unit per month (assuming 8 hours/day)
    baseConsumption += acUnits * 150

    // LED savings: ~50% reduction in lighting costs
    const lightingConsumption = (area / 50) * 30 // Base lighting
    const ledSavings = lightingConsumption * (ledPercentage / 100) * 0.5
    baseConsumption -= ledSavings

    // Solar offset: ~30 units per panel per month
    const solarOffset = solarPanels * 30
    const netConsumption = Math.max(0, baseConsumption - solarOffset)

    // Bill at ₹7 per unit average
    const monthlyBill = netConsumption * 7

    // Carbon footprint: ~0.82 kg CO2 per kWh
    const carbonFootprint = netConsumption * 0.82

    // Efficiency score based on factors
    let score = 50
    score += ledPercentage * 0.2
    score += Math.min(solarPanels * 5, 25)
    score -= acUnits * 3

    const recommendations: string[] = []
    if (ledPercentage < 100) recommendations.push("Switch remaining lights to LED for 50% lighting savings")
    if (solarPanels === 0) recommendations.push("Consider solar panels - 5kW system can offset 150+ units/month")
    if (acUnits > 2) recommendations.push("Use 5-star rated ACs and set temperature to 24°C for optimal efficiency")
    if (recommendations.length === 0) recommendations.push("Great job! Your home is energy efficient")

    return {
      monthlyConsumption: Math.round(netConsumption),
      monthlyBill: Math.round(monthlyBill),
      carbonFootprint: Math.round(carbonFootprint),
      efficiencyScore: Math.min(100, Math.max(0, Math.round(score))),
      recommendations,
    }
  }

  const metrics = calculateMetrics()

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
        </div>

        <div className="space-y-4">
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
            <div className="text-sm font-medium mb-2">Recommendations:</div>
            <ul className="space-y-1">
              {metrics.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Leaf className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </Card>
  )
}
