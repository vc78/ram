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

type Tier = "Economy" | "Standard" | "Premium" | "Luxury"
type BrickType = "Standard Red" | "AAC Block" | "Fly Ash"

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

const tierDetails: Record<Tier, { rate: number; description: string; features: string[] }> = {
  Economy: {
    rate: 1750,
    description: "Budget-friendly construction",
    features: ["Standard cement/steel", "Local tiles", "Essential electricals"],
  },
  Standard: {
    rate: 2400,
    description: "High quality standard",
    features: ["Branded materials", "Vitrified tiles", "Modular switches"],
  },
  Premium: {
    rate: 3200,
    description: "Elite quality materials",
    features: ["Premium brands", "Italian marble/Granite", "Smart fixtures"],
  },
  Luxury: {
    rate: 4500,
    description: "Ultra-luxury bespoke design",
    features: ["Designer finishes", "Imported materials", "Full automation"],
  },
}

const brickMultipliers: Record<BrickType, number> = {
  "Standard Red": 1.0,
  "AAC Block": 0.94, // AAC is often slightly cheaper due to less mortar/labor
  "Fly Ash": 0.98,
}

export default function BudgetEstimator() {
  const [area, setArea] = useState(1500)
  const [tier, setTier] = useState<Tier>("Standard")
  const [brickType, setBrickType] = useState<BrickType>("Standard Red")
  const [numRooms, setNumRooms] = useState(3)

  const baseRate = tierDetails[tier].rate
  const brickM = brickMultipliers[brickType]
  
  // Room impact: extra internal walls
  const baselineRooms = Math.ceil(area / 350)
  const roomFactor = 1 + (Math.max(0, numRooms - baselineRooms) * 0.02)

  const finalRate = baseRate * brickM * roomFactor
  const total = area * finalRate
  const materials = Math.round(total * 0.65)
  const labor = Math.round(total * 0.25)
  const misc = Math.round(total * 0.1)

  const breakdown = [
    { label: "Materials", value: materials, percentage: 65, icon: Package, color: "bg-blue-500" },
    { label: "Labor", value: labor, percentage: 25, icon: Users, color: "bg-green-500" },
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

          {/* Section 2: Building Parameters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span>Building Parameters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Type of Bricks</span>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(brickMultipliers) as BrickType[]).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBrickType(b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        brickType === b ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border hover:border-primary/50"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Rooms: {numRooms}</span>
                <Slider
                  value={[numRooms]}
                  onValueChange={(v) => setNumRooms(v[0])}
                  min={1}
                  max={12}
                  step={1}
                  className="py-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(tierDetails) as Tier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                    t === tier
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 bg-background"
                  }`}
                >
                  {t === tier && <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />}
                  <div className="font-semibold text-[10px] mb-0.5">{t}</div>
                  <div className="text-[10px] text-muted-foreground">{formatINR(tierDetails[t].rate)}/sqft</div>
                </button>
              ))}
            </div>

            {/* Tier Features */}
            <div className="p-3 rounded-lg bg-muted/30 border border-dashed">
              <div className="text-[10px] font-medium mb-2 uppercase tracking-wider text-muted-foreground">{tier} tier features:</div>
              <div className="flex flex-wrap gap-2">
                {tierDetails[tier].features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-[10px] font-normal py-0">
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
                    <span className="text-[10px] text-muted-foreground">{item.label}</span>
                  </div>
                  <div className="font-semibold text-xs">{formatINR(item.value)}</div>
                  <div className="text-[10px] text-muted-foreground">{item.percentage}%</div>
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
                <span>Market Rate 2024-25</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{formatINR(total)}</div>
            <div className="text-[10px] text-muted-foreground">
              Based on {formatINR(Math.round(finalRate))}/sqft × {area.toLocaleString()} sqft
              {roomFactor > 1 && ` (includes ${Math.round((roomFactor - 1) * 100)}% partition wall impact)`}
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
