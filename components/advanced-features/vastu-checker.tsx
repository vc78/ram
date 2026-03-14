"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Compass, CheckCircle2, XCircle, AlertTriangle, Brain } from "lucide-react"

import { VastuLayoutGenerator } from "./vastu-layout-generator"
import { predictVastuCompliance, predictOverallScore, type VastuModelResult } from "./vastu-ml-engine"

interface VastuRule {
  id: string
  element: string
  idealDirection: string
  currentDirection: string
  status: "compliant" | "warning" | "non-compliant"
  suggestion: string
  confidence?: number
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
  const [showGenerator, setShowGenerator] = useState(false)
  const [useMLMode, setUseMLMode] = useState(false)
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

    let status: VastuRule["status"]
    let confidence: number | undefined

    if (useMLMode) {
      const mlPrediction: VastuModelResult = predictVastuCompliance(element, current)
      status = mlPrediction.status
      confidence = mlPrediction.confidence
    } else {
      status = checkCompliance(element, current, ideal)
    }

    return {
      id: element,
      element,
      idealDirection: ideal,
      currentDirection: current,
      status,
      confidence,
      suggestion: getSuggestion(element, status, ideal),
    }
  })

  let overallScore = 0

  if (useMLMode) {
    const results = rules.map(r => ({ status: r.status, confidence: r.confidence || 0 }))
    overallScore = predictOverallScore(results)
  } else {
    overallScore = Math.round(
      (rules.filter((r) => r.status === "compliant").length * 100 +
        rules.filter((r) => r.status === "warning").length * 50) /
      rules.length,
    )
  }

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
    <>
      <Card className="p-6 border-border relative overflow-hidden">
        {useMLMode && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {useMLMode ? (
              <Brain className="w-5 h-5 text-purple-500 animate-pulse" />
            ) : (
              <Compass className="w-5 h-5 text-primary" />
            )}
            <h3 className="text-lg font-semibold">
              {useMLMode ? "AI Vastu Compliance Predictor" : "Vastu Compliance Checker"}
            </h3>
          </div>
          <Badge
            variant={overallScore >= 70 ? "default" : overallScore >= 50 ? "secondary" : "destructive"}
            className={useMLMode ? "bg-purple-600 hover:bg-purple-700 text-white border-transparent" : ""}
          >
            {useMLMode ? `AI Confidence: ${overallScore}%` : `Score: ${overallScore}%`}
          </Badge>
        </div>

        <div className="flex items-center space-x-2 mb-6 p-3 bg-muted/50 rounded-lg border border-border">
          <Switch id="ml-mode" checked={useMLMode} onCheckedChange={setUseMLMode} />
          <Label htmlFor="ml-mode" className="flex flex-col cursor-pointer">
            <span className="font-medium">{useMLMode ? "AI/ML Prediction Mode Active" : "Classic Rule-Based Mode"}</span>
            <span className="text-xs text-muted-foreground">
              {useMLMode
                ? "Using Neural Network simulation weights to predict compliance."
                : "Using traditional strict Vastu calculation algorithms."}
            </span>
          </Label>
        </div>

        <div className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${rule.status === "compliant"
                ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30"
                : rule.status === "warning"
                  ? "border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30"
                  : "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30"
                } ${useMLMode ? "shadow-sm hover:shadow-md" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(rule.status)}
                  <span className="font-medium">{rule.element}</span>
                  {useMLMode && rule.confidence !== undefined && (
                    <Badge variant="outline" className="text-[10px] ml-2 font-mono bg-background/50">
                      Weight: {(rule.confidence * 100).toFixed(0)}%
                    </Badge>
                  )}
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

        <Button
          className={`w-full mt-6 ${useMLMode ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 text-white" : ""}`}
          onClick={() => setShowGenerator(true)}
        >
          {useMLMode ? "Generate AI-Optimized Layout" : "Generate Vastu-Compliant Layout"}
        </Button>
      </Card>

      {showGenerator && (
        <div className="lg:col-span-2 mt-2">
          <VastuLayoutGenerator />
        </div>
      )}
    </>
  )
}
