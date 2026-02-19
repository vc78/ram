"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, ChevronLeft, ChevronRight, Check } from "lucide-react"

interface DesignVariant {
  id: string
  name: string
  provider: string
  image: string
  features: string[]
  estimatedCost: string
  style: string
}

const MOCK_VARIANTS: DesignVariant[] = [
  {
    id: "1",
    name: "Modern Minimalist",
    provider: "OpenAI",
    image: "/images/modern-minimalist-design.jpg",
    features: ["Open floor plan", "Large windows", "Flat roof", "Clean lines"],
    estimatedCost: "₹48 Lakhs",
    style: "Contemporary",
  },
  {
    id: "2",
    name: "Traditional Elegance",
    provider: "Anthropic",
    image: "/images/traditional-elegance-design.jpg",
    features: ["Sloped roof", "Vastu compliant", "Central courtyard", "Classic columns"],
    estimatedCost: "₹52 Lakhs",
    style: "Traditional",
  },
  {
    id: "3",
    name: "Eco-Friendly Design",
    provider: "xAI",
    image: "/images/eco-friendly-design.jpg",
    features: ["Solar ready", "Rainwater harvesting", "Natural ventilation", "Green roof"],
    estimatedCost: "₹55 Lakhs",
    style: "Sustainable",
  },
]

export function ComparisonView() {
  const [variants] = useState<DesignVariant[]>(MOCK_VARIANTS)
  const [selected, setSelected] = useState<string[]>([])
  const [viewIndex, setViewIndex] = useState(0)

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const visibleVariants = variants.slice(viewIndex, viewIndex + 2)

  return (
    <Card className="p-6 border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Design Comparison</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewIndex(Math.max(0, viewIndex - 1))}
            disabled={viewIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {viewIndex + 1}-{Math.min(viewIndex + 2, variants.length)} of {variants.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewIndex(Math.min(variants.length - 2, viewIndex + 1))}
            disabled={viewIndex >= variants.length - 2}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {visibleVariants.map((variant) => (
          <div
            key={variant.id}
            className={`relative rounded-lg border-2 overflow-hidden transition-all ${
              selected.includes(variant.id) ? "border-primary ring-2 ring-primary/20" : "border-border"
            }`}
          >
            <img src={variant.image || "/placeholder.svg"} alt={variant.name} className="w-full h-48 object-cover" />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary">{variant.provider}</Badge>
            </div>
            <div className="absolute top-3 right-3">
              <Button
                size="sm"
                variant={selected.includes(variant.id) ? "default" : "outline"}
                onClick={() => toggleSelect(variant.id)}
                className="h-8 w-8 p-0"
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{variant.name}</h4>
                <Badge variant="outline">{variant.style}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                {variant.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm text-muted-foreground">Est. Cost</span>
                <span className="font-bold text-primary">{variant.estimatedCost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm">{selected.length} design(s) selected</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelected([])}>
                Clear
              </Button>
              <Button size="sm">Create Hybrid Design</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
