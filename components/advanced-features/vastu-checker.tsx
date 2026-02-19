"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Compass, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

interface VastuRule {
  id: string
  element: string
  idealDirection: string
  currentDirection: string
  status: "compliant" | "warning" | "non-compliant"
  suggestion: string
}

const VASTU_ELEMENTS = [
  { element: "Main Entrance", ideal: "North/East" },
  { element: "Kitchen", ideal: "Southeast" },
  { element: "Master Bedroom", ideal: "Southwest" },
  { element: "Pooja Room", ideal: "Northeast" },
  { element: "Bathroom/Toilet", ideal: "Northwest" },
  { element: "Living Room", ideal: "North/East" },
  { element: "Dining Area", ideal: "West" },
  { element: "Staircase", ideal: "South/Southwest" },
]

const DIRECTIONS = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"]

export function VastuChecker() {
  const [selectedDirections, setSelectedDirections] = useState<Record<string, string>>({
    "Main Entrance": "North",
    Kitchen: "Southeast",
    "Master Bedroom": "Southwest",
    "Pooja Room": "Northeast",
    "Bathroom/Toilet": "Northwest",
    "Living Room": "North",
    "Dining Area": "West",
    Staircase: "South",
  })

  const checkCompliance = (element: string, current: string, ideal: string): VastuRule["status"] => {
    const idealDirs = ideal.split("/")
    if (idealDirs.includes(current)) return "compliant"
    // Check adjacent directions for partial compliance
    const currentIndex = DIRECTIONS.indexOf(current)
    for (const dir of idealDirs) {
      const idealIndex = DIRECTIONS.indexOf(dir)
      if (Math.abs(currentIndex - idealIndex) === 1 || Math.abs(currentIndex - idealIndex) === 7) {
        return "warning"
      }
    }
    return "non-compliant"
  }

  const getSuggestion = (element: string, status: VastuRule["status"], ideal: string): string => {
    if (status === "compliant") return "Perfectly aligned with Vastu principles"
    if (status === "warning") return `Acceptable, but ${ideal} would be ideal for ${element.toLowerCase()}`
    return `Consider relocating ${element.toLowerCase()} to ${ideal} for better energy flow`
  }

  const rules: VastuRule[] = VASTU_ELEMENTS.map(({ element, ideal }) => {
    const current = selectedDirections[element]
    const status = checkCompliance(element, current, ideal)
    return {
      id: element,
      element,
      idealDirection: ideal,
      currentDirection: current,
      status,
      suggestion: getSuggestion(element, status, ideal),
    }
  })

  const overallScore = Math.round(
    (rules.filter((r) => r.status === "compliant").length * 100 +
      rules.filter((r) => r.status === "warning").length * 50) /
      rules.length,
  )

  const getStatusIcon = (status: VastuRule["status"]) => {
    switch (status) {
      case "compliant":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case "non-compliant":
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  return (
    <Card className="p-6 border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Vastu Compliance Checker</h3>
        </div>
        <Badge variant={overallScore >= 70 ? "default" : overallScore >= 50 ? "secondary" : "destructive"}>
          Score: {overallScore}%
        </Badge>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 rounded-lg border ${
              rule.status === "compliant"
                ? "border-green-200 bg-green-50"
                : rule.status === "warning"
                  ? "border-amber-200 bg-amber-50"
                  : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(rule.status)}
                <span className="font-medium">{rule.element}</span>
              </div>
              <select
                value={rule.currentDirection}
                onChange={(e) =>
                  setSelectedDirections((prev) => ({
                    ...prev,
                    [rule.element]: e.target.value,
                  }))
                }
                className="text-sm border rounded px-2 py-1 bg-background"
              >
                {DIRECTIONS.map((dir) => (
                  <option key={dir} value={dir}>
                    {dir}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ideal: {rule.idealDirection}</span>
              <span className="text-muted-foreground">Current: {rule.currentDirection}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{rule.suggestion}</p>
          </div>
        ))}
      </div>

      <Button className="w-full mt-6">Generate Vastu-Compliant Layout</Button>
    </Card>
  )
}
