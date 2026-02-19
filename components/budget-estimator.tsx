"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  IndianRupee,
  Ruler,
  Layers,
  Package,
  Users,
  Wrench,
  PiggyBank,
  TrendingUp,
  Info,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Tier = "Moderate" | "Intermediate" | "Premium"

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

const tierDetails: Record<Tier, { rate: number; description: string; features: string[] }> = {
  Moderate: {
    rate: 1500,
    description: "Basic quality materials",
    features: ["Standard finishes", "Basic fixtures", "Essential amenities"],
  },
  Intermediate: {
    rate: 2200,
    description: "Good quality materials",
    features: ["Quality finishes", "Branded fixtures", "Modern amenities"],
  },
  Premium: {
    rate: 3000,
    description: "Premium materials",
    features: ["Luxury finishes", "Premium fixtures", "Smart home ready"],
  },
}

export default function BudgetEstimator() {
  const [area, setArea] = useState(1500)
  const [tier, setTier] = useState<Tier>("Intermediate")

  const rate = tierDetails[tier].rate
  const total = area * rate
  const materials = Math.round(total * 0.6)
  const labor = Math.round(total * 0.3)
  const misc = Math.round(total * 0.1)

  const breakdown = [
    { label: "Materials", value: materials, percentage: 60, icon: Package, color: "bg-blue-500" },
    { label: "Labor", value: labor, percentage: 30, icon: Users, color: "bg-green-500" },
    { label: "Miscellaneous", value: misc, percentage: 10, icon: Wrench, color: "bg-amber-500" },
  ]

  return (
    <TooltipProvider>
      <Card className="border-border bg-background overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Smart Budget Estimator</CardTitle>
              <CardDescription>Calculate construction costs in Indian Rupees</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Section 1: Area Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Ruler className="h-4 w-4" />
              <span>Built-up Area</span>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Slide to adjust area</span>
                <Badge variant="secondary" className="text-base font-semibold px-3 py-1">
                  {area.toLocaleString()} sqft
                </Badge>
              </div>
              <Slider
                value={[area]}
                onValueChange={(v) => setArea(v[0])}
                min={300}
                max={6000}
                step={50}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>300 sqft</span>
                <span>6,000 sqft</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Quality Tier Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>Quality Tier</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px]">
                  <p className="text-xs">
                    Select construction quality level. Higher tiers include better materials and finishes.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(tierDetails) as Tier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    t === tier
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 bg-background"
                  }`}
                >
                  {t === tier && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />}
                  <div className="font-semibold text-sm mb-1">{t}</div>
                  <div className="text-xs text-muted-foreground">{formatINR(tierDetails[t].rate)}/sqft</div>
                </button>
              ))}
            </div>

            {/* Tier Features */}
            <div className="p-3 rounded-lg bg-muted/30 border border-dashed">
              <div className="text-xs font-medium mb-2">{tier} tier includes:</div>
              <div className="flex flex-wrap gap-2">
                {tierDetails[tier].features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs font-normal">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 3: Cost Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <PiggyBank className="h-4 w-4" />
              <span>Cost Breakdown</span>
            </div>

            {/* Visual percentage bar */}
            <div className="h-3 rounded-full overflow-hidden flex">
              {breakdown.map((item) => (
                <div
                  key={item.label}
                  className={`${item.color} transition-all`}
                  style={{ width: `${item.percentage}%` }}
                />
              ))}
            </div>

            {/* Cost items */}
            <div className="grid grid-cols-3 gap-3">
              {breakdown.map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-muted/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                  <div className="font-semibold text-sm">{formatINR(item.value)}</div>
                  <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Section 4: Total Estimate */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                <span className="font-medium">Total Estimate</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>Market Rate</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{formatINR(total)}</div>
            <div className="text-xs text-muted-foreground">
              Based on {formatINR(rate)}/sqft × {area.toLocaleString()} sqft
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full h-11" size="lg">
            <PiggyBank className="h-4 w-4 mr-2" />
            Save Estimate
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
