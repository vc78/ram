"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Compass, CheckCircle2, XCircle, AlertTriangle, Brain, Sparkles } from "lucide-react"

import { VastuLayoutGenerator } from "./vastu-layout-generator"
import { runVastuRules, computeVastuScore, VastuDirection } from "@/lib/vastu-rules"

const VASTU_ELEMENTS = [
  { element: "Main Entrance", key: "main_door" },
  { element: "Kitchen", key: "kitchen" },
  { element: "Master Bedroom", key: "master_bedroom" },
  { element: "Pooja Room", key: "pooja" },
  { element: "Bathroom/Toilet", key: "toilet" },
  { element: "Living Room", key: "living" },
  { element: "Dining Area", key: "dining" },
  { element: "Staircase", key: "staircase" },
]

const DIRECTIONS_MAP: Record<string, VastuDirection> = {
  "North": "N",
  "Northeast": "NE",
  "East": "E",
  "Southeast": "SE",
  "South": "S",
  "Southwest": "SW",
  "West": "W",
  "Northwest": "NW"
}

const DIRECTIONS = Object.keys(DIRECTIONS_MAP)

export function VastuChecker() {
  const [showGenerator, setShowGenerator] = useState(false)
  const [useMLMode, setUseMLMode] = useState(true)
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

  const evaluation = useMemo(() => {
    const layout: Record<string, string> = {}
    VASTU_ELEMENTS.forEach(el => {
      layout[el.key] = DIRECTIONS_MAP[selectedDirections[el.element]]
    })
    
    const results = runVastuRules(layout)
    return computeVastuScore(results)
  }, [selectedDirections])

  const getStatusIcon = (severity: string) => {
    switch (severity) {
      case "ok":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "minor":
      case "moderate":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case "critical":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
    }
  }

  const getStatusClass = (severity: string) => {
    switch (severity) {
      case "ok":
        return "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30"
      case "minor":
      case "moderate":
        return "border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30"
      case "critical":
        return "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30"
      default:
        return "border-border"
    }
  }

  return (
    <>
      <Card className="p-4 sm:p-6 md:p-8 border-border/50 shadow-2xl rounded-2xl sm:rounded-[2rem] bg-background/50 backdrop-blur-xl relative overflow-hidden">
        {useMLMode && (
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl sm:rounded-2xl flex-shrink-0">
              {useMLMode ? (
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-pulse" />
              ) : (
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight truncate">
                {useMLMode ? "Smart Vastu Predictor" : "Vastu Checker"}
              </h3>
              <p className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase mt-0.5">
                Spatial Integrity Calibration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
             <Badge variant="outline" className="px-2 sm:px-3 py-1 font-bold text-[10px] sm:text-xs whitespace-nowrap">GRADE: {evaluation.grade}</Badge>
             <Badge
               className={`px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-bold border-transparent shadow-lg flex-1 sm:flex-none text-center ${evaluation.overall_score >= 75 ? 'bg-green-500 text-white' : evaluation.overall_score >= 55 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}`}
             >
               SCORE: {evaluation.overall_score}%
             </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-muted/30 border border-border flex items-center gap-4">
            <Switch id="ml-mode-checker" checked={useMLMode} onCheckedChange={setUseMLMode} />
            <Label htmlFor="ml-mode-checker" className="cursor-pointer">
              <span className="block text-xs sm:text-sm font-bold uppercase">ML Calibrated Mode</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">Using GradientBoosted analysis</span>
            </Label>
          </div>
          <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-around">
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-red-500">{evaluation.critical_defects}</div>
              <div className="text-[7px] sm:text-[8px] font-bold uppercase text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-amber-500">{evaluation.moderate_defects}</div>
              <div className="text-[7px] sm:text-[8px] font-bold uppercase text-muted-foreground">Moderate</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-blue-500">{evaluation.minor_defects}</div>
              <div className="text-[7px] sm:text-[8px] font-bold uppercase text-muted-foreground">Minor</div>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {VASTU_ELEMENTS.map((el) => {
            const currentDir = selectedDirections[el.element]
            const ruleRes = evaluation.defects.find(d => d.rule.includes(el.key)) || { severity: "ok", defect: "Perfectly Aligned", recommendation: "" }
            
            return (
              <div
                key={el.key}
                className={`p-5 rounded-3xl border transition-all duration-300 ${getStatusClass(ruleRes.severity)} shadow-sm hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(ruleRes.severity)}
                    <span className="font-bold text-sm uppercase">{el.element}</span>
                  </div>
                  <select
                    value={currentDir}
                    onChange={(e) =>
                      setSelectedDirections((prev) => ({
                        ...prev,
                        [el.element]: e.target.value,
                      }))
                    }
                    className="text-xs font-semibold border rounded-xl px-3 py-1.5 bg-background shadow-sm focus:ring-2 ring-primary/20 outline-none"
                  >
                    {DIRECTIONS.map((dir) => (
                      <option key={dir} value={dir}>
                        {dir}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-foreground leading-relaxed">
                    {ruleRes.severity === "ok" ? "No defects detected for this placement." : ruleRes.defect}
                  </p>
                  {ruleRes.recommendation && (
                    <div className="p-3 rounded-2xl bg-white/50 dark:bg-black/20 border border-border/50 flex items-start gap-2">
                       <Sparkles className="w-3 h-3 text-primary mt-0.5" />
                       <p className="text-[10px] font-medium italic text-muted-foreground">Remedy: {ruleRes.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <Button
          className="w-full mt-8 h-14 rounded-3xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all gap-2"
          onClick={() => setShowGenerator(true)}
        >
          <Sparkles className="w-5 h-5" />
          {useMLMode ? "GENERATE SMART OPTIMIZED LAYOUT" : "GENERATE COMPLIANT LAYOUT"}
        </Button>
      </Card>

      {showGenerator && (
        <div className="mt-8">
          <VastuLayoutGenerator />
        </div>
      )}
    </>
  )
}
