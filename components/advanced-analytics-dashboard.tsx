"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Clock,
  Shield,
  Users,
  Layers,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Activity,
  BarChart3,
  Download,
  Filter,
  Info,
} from "lucide-react"
import { useState } from "react"
import { calculateAllMetrics, getAnalyticsCategories, getFeaturesByCategory } from "@/lib/advanced-analytics-engine"

// Sample project data
const sampleProjectData = {
  projectId: "proj-001",
  projectName: "Modern Villa Construction",
  startDate: new Date("2024-01-15"),
  endDate: new Date("2024-12-31"),
  budget: 5000000,
  actualSpend: 2750000,
  area: 3500,
  floors: 2,
  contractors: 35,
  team: 15,
  progress: 60,
  actualProgress: 55,
  plannedProgress: 60,
  totalDays: 350,
  weatherDelays: 8,
  weatherDaysLost: 12,
  dailyBurn: 9000,
  changeOrders: 8,
  changeOrderCost: 400000,
  changeOrderDays: 12,
  contingencyUsed: 250000,
  safetyIncidents: 2,
  nearMisses: 7,
}

const iconMap: Record<string, any> = {
  DollarSign,
  Clock,
  Shield,
  Users,
  Layers,
}

export function AdvancedAnalyticsDashboard() {
  const [activeCategory, setActiveCategory] = useState("Cost & Budget")
  const [showInfo, setShowInfo] = useState<string | null>(null)

  const categories = getAnalyticsCategories()
  const metrics = calculateAllMetrics(sampleProjectData)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-500 bg-red-500/10"
      case "high":
        return "text-orange-500 bg-orange-500/10"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10"
      case "low":
        return "text-green-500 bg-green-500/10"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  const renderMetricValue = (feature: any, value: any) => {
    if (typeof value === "number") {
      return value.toFixed(2)
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon]
          return (
            <Card
              key={cat.name}
              className={`p-4 border-border cursor-pointer transition-all ${
                activeCategory === cat.name ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-primary" />
                <Badge variant="secondary">{cat.count}</Badge>
              </div>
              <h3 className="text-sm font-medium">{cat.name}</h3>
            </Card>
          )
        })}
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((cat) => (
            <TabsTrigger key={cat.name} value={cat.name}>
              {cat.name.split(" & ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.name} value={cat.name} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{cat.name} Analytics</h2>
                <p className="text-sm text-muted-foreground">{cat.count} advanced metrics and insights</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {getFeaturesByCategory(cat.name).map((feature) => {
                const metricValue = metrics[feature.id]
                const isExpanded = showInfo === feature.id

                return (
                  <Card key={feature.id} className="p-5 border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{feature.name}</h3>
                          <Badge className={getStatusColor(feature.priority)} variant="secondary">
                            {feature.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setShowInfo(isExpanded ? null : feature.id)}
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Metric Display */}
                    <div className="space-y-3">
                      {/* Primary Value */}
                      {metricValue && (
                        <div className="rounded-lg bg-muted/50 p-3">
                          {/* Cost Variance */}
                          {feature.id === "cost-variance-analysis" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Variance</span>
                                <span
                                  className={`text-xl font-bold ${
                                    metricValue.variance > 0 ? "text-red-500" : "text-green-500"
                                  }`}
                                >
                                  ${Math.abs(metricValue.variance).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={metricValue.status === "overbudget" ? "destructive" : "default"}>
                                  {metricValue.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Projected: ${metricValue.projection.toLocaleString()}
                              </div>
                            </div>
                          )}

                          {/* Earned Value Management */}
                          {feature.id === "earned-value-management" && (
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <div className="text-muted-foreground">CPI</div>
                                  <div className="text-lg font-bold">{metricValue.cpi.toFixed(2)}</div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground">SPI</div>
                                  <div className="text-lg font-bold">{metricValue.spi.toFixed(2)}</div>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                EV: ${metricValue.earnedValue.toLocaleString()} | AC: $
                                {metricValue.actualCost.toLocaleString()}
                              </div>
                            </div>
                          )}

                          {/* Cost Per Sqft */}
                          {feature.id === "cost-per-sqft-tracking" && (
                            <div className="space-y-2">
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">${metricValue.costPerSqFt.toFixed(2)}</span>
                                <span className="text-sm text-muted-foreground">/ sq ft</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                {metricValue.variance > 0 ? (
                                  <TrendingUp className="w-4 h-4 text-red-500" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-green-500" />
                                )}
                                <span className={metricValue.variance > 0 ? "text-red-500" : "text-green-500"}>
                                  ${Math.abs(metricValue.variance).toFixed(2)} vs industry avg
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Material Cost Breakdown */}
                          {feature.id === "material-cost-breakdown" && (
                            <div className="space-y-2">
                              {Object.entries(metricValue).map(([key, value]: [string, any]) => (
                                <div key={key} className="flex items-center justify-between text-sm">
                                  <span className="capitalize">{key}</span>
                                  <span className="font-medium">
                                    ${value.cost.toLocaleString()} ({value.percent}%)
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Schedule Performance Index */}
                          {feature.id === "schedule-performance-index" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">SPI</span>
                                <span className="text-2xl font-bold">{metricValue.spi.toFixed(2)}</span>
                              </div>
                              <Badge variant={metricValue.status === "behind" ? "destructive" : "default"}>
                                {metricValue.status} schedule
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {Math.abs(metricValue.daysVariance).toFixed(0)} days variance
                              </div>
                            </div>
                          )}

                          {/* Quality Inspection Score */}
                          {feature.id === "quality-inspection-score" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Overall Score</span>
                                <span className="text-3xl font-bold text-green-500">{metricValue.overallScore}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-500" />
                                  {metricValue.passed} passed
                                </div>
                                <div>
                                  <AlertCircle className="w-4 h-4 inline mr-1 text-red-500" />
                                  {metricValue.failed} failed
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Safety Incident Tracking */}
                          {feature.id === "safety-incident-tracking" && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Days Without Incident</span>
                                <span className="text-3xl font-bold text-green-500">
                                  {metricValue.daysWithoutIncident}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Incidents: {metricValue.incidents}</div>
                                <div>Near Misses: {metricValue.nearMisses}</div>
                              </div>
                              <Badge variant="secondary">Safety Score: {metricValue.safetyScore}</Badge>
                            </div>
                          )}

                          {/* Generic display for other features */}
                          {![
                            "cost-variance-analysis",
                            "earned-value-management",
                            "cost-per-sqft-tracking",
                            "material-cost-breakdown",
                            "schedule-performance-index",
                            "quality-inspection-score",
                            "safety-incident-tracking",
                          ].includes(feature.id) && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Metric Data</span>
                              </div>
                              <pre className="text-xs overflow-auto max-h-32 text-muted-foreground">
                                {renderMetricValue(feature, metricValue)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Visualization Type Badge */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          <span className="capitalize">{feature.visualizationType}</span>
                        </div>
                        <span>ID: {feature.id}</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
