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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

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

const iconMap:Record<string, any> = {
  DollarSign,
  Clock,
  Shield,
  Users,
  Layers,
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

function MetricVisualization({ feature, value }: { feature: any; value: any }) {
  if (!value) return null

  // Material Cost Breakdown - Pie Chart
  if (feature.id === "material-cost-breakdown") {
    const data = Object.entries(value).map(([key, val]: [string, any]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: val.cost,
      percent: val.percent,
    }))

    return (
      <div className="h-[200px] min-h-[200px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => `$${(Number(value) || 0).toLocaleString()}`}
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Cost Variance and EVM - Bar Chart
  if (feature.id === "earned-value-management") {
    const data = [
      { name: "Planned Value", value: value.plannedValue },
      { name: "Earned Value", value: value.earnedValue },
      { name: "Actual Cost", value: value.actualCost },
    ]

    return (
      <div className="h-[200px] min-h-[200px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${((Number(val) || 0) / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: any) => `$${(Number(value) || 0).toLocaleString()}`}
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 2 ? "#ef4444" : index === 1 ? "#22c55e" : "#3b82f6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Phase Duration - Comparative Bar Chart
  if (feature.id === "phase-duration-analysis") {
    const data = Object.entries(value).map(([key, val]: [string, any]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      planned: val.planned,
      actual: val.actual || 0,
    }))

    return (
      <div className="h-[200px] min-h-[200px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={80} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
            />
            <Bar dataKey="planned" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Planned Days" />
            <Bar dataKey="actual" fill="#fbbf24" radius={[0, 4, 4, 0]} name="Actual Days" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Budget Burn Rate - Area Chart
  if (feature.id === "budget-burn-rate") {
    const data = [
      { day: "Day 1", burn: value.dailyBurn * 0.8 },
      { day: "Day 5", burn: value.dailyBurn * 0.9 },
      { day: "Day 10", burn: value.dailyBurn * 1.1 },
      { day: "Day 15", burn: value.dailyBurn * 1.0 },
      { day: "Day 20", burn: value.dailyBurn * 1.2 },
      { day: "Today", burn: value.dailyBurn },
    ]

    return (
      <div className="h-[200px] min-h-[200px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
            <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val.toFixed(0)}`} />
            <Tooltip
              formatter={(value: any) => `$${(Number(value) || 0).toLocaleString()}`}
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
            />
            <Area type="monotone" dataKey="burn" stroke="#ef4444" fillOpacity={1} fill="url(#colorBurn)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Cash Flow - Line Chart
  if (feature.id === "cash-flow-projection") {
    const data = [
      { period: "Next 30d", flow: value.next30Days },
      { period: "Next 60d", flow: value.next60Days },
      { period: "Next 90d", flow: value.next90Days },
    ]

    return (
      <div className="h-[200px] min-h-[200px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
            <XAxis dataKey="period" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: any) => `$${(Number(value) || 0).toLocaleString()}`}
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
            />
            <Line type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Contractor Performance - Radar Chart
  if (feature.id === "contractor-performance") {
    const data = value.contractors.map((c: any) => ({
      subject: c.name,
      quality: c.quality,
      timeliness: c.timeliness,
      communication: c.communication,
      fullMark: 100,
    }))

    // Use the first contractor for a multi-dimensional view
    const radarData = [
      { subject: "Quality", A: data[0].quality, fullMark: 100 },
      { subject: "Timeliness", A: data[0].timeliness, fullMark: 100 },
      { subject: "Communication", A: data[0].communication, fullMark: 100 },
    ]

    return (
      <div className="h-[200px] min-h-[200px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name={value.contractors[0].name}
              dataKey="A"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.5}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
            />
          </RadarChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-center text-muted-foreground mt-2">Showing: {value.contractors[0].name}</p>
      </div>
    )
  }

  // Generic Charting for other "chart" types
  if (feature.visualizationType === "chart" || feature.visualizationType === "gauge") {
    // If it's a simple percent/rate value, show a simple gauge/bar
    if (typeof value === "number" || (typeof value === "object" && value.completionRate)) {
      const rate = typeof value === "number" ? value : value.completionRate || value.probability || value.overallScore
      const data = [{ name: "Progress", value: rate }, { name: "Remaining", value: 100 - rate }]

      return (
        <div className="h-[120px] min-h-[120px] w-full mt-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                <Cell fill="#22c55e" />
                <Cell fill="#374151" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute mt-8 text-2xl font-bold">{rate.toFixed(0)}%</div>
        </div>
      )
    }
  }

  return null
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

                          {/* Visualization Renderer */}
                          <MetricVisualization feature={feature} value={metricValue} />

                          {/* Generic display for other features if no visualization is rendered */}
                          {![
                            "cost-variance-analysis",
                            "earned-value-management",
                            "cost-per-sqft-tracking",
                            "material-cost-breakdown",
                            "schedule-performance-index",
                            "quality-inspection-score",
                            "safety-incident-tracking",
                            "phase-duration-analysis",
                          ].includes(feature.id) &&
                            feature.visualizationType !== "chart" &&
                            feature.visualizationType !== "gauge" && (
                              <div className="space-y-1 mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Activity className="w-4 h-4 text-primary" />
                                  <span className="text-sm font-medium">Metric Data</span>
                                </div>
                                <pre className="text-xs overflow-auto max-h-32 text-muted-foreground p-2 bg-background/50 rounded border border-border">
                                  {renderMetricValue(feature, metricValue)}
                                </pre>
                              </div>
                            )}
                        </div>
                      )}

                      {/* Visualization Type Badge */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-border/50">
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
