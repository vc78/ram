"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Activity, Clock, CheckCircle2 } from "lucide-react"
import { useMemo, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar as ReBar,
} from "recharts"
import { Button } from "@/components/ui/button"

interface ProgressAnalyticsProps {
  projectData?: {
    progress: number
    tasks: Array<{
      id: number
      title: string
      status: string
      phase: string
      dueDate: string
      priority: string
    }>
    milestones: Array<{
      id: number
      name: string
      progress: number
      status: string
      date: string
    }>
  }
}

export function ProgressAnalytics({ projectData }: ProgressAnalyticsProps) {
  // Weekly progress data
  const weeklyProgress = [
    { week: "Week 1", planned: 10, actual: 8, efficiency: 80 },
    { week: "Week 2", planned: 20, actual: 18, efficiency: 90 },
    { week: "Week 3", planned: 30, actual: 28, efficiency: 93 },
    { week: "Week 4", planned: 40, actual: 35, efficiency: 88 },
    { week: "Week 5", planned: 50, actual: 45, efficiency: 90 },
    { week: "Week 6", planned: 60, actual: 55, efficiency: 92 },
  ]

  const phaseData = [
    { name: "Planning", value: 25 },
    { name: "Construction", value: 50 },
    { name: "Finishing", value: 12.5 },
    { name: "Pending", value: 12.5 },
  ]

  const priorityData = [
    { priority: "High", completed: 8, pending: 2, total: 10 },
    { priority: "Medium", completed: 12, pending: 4, total: 16 },
    { priority: "Low", completed: 5, pending: 3, total: 8 },
  ]

  const resourceData = [
    { category: "Budget", value: 83 },
    { category: "Timeline", value: 75 },
    { category: "Team", value: 90 },
    { category: "Materials", value: 70 },
    { category: "Quality", value: 95 },
  ]

  const activityData = [
    { day: "Mon", tasks: 5, hours: 8 },
    { day: "Tue", tasks: 7, hours: 10 },
    { day: "Wed", tasks: 6, hours: 9 },
    { day: "Thu", tasks: 8, hours: 11 },
    { day: "Fri", tasks: 4, hours: 7 },
    { day: "Sat", tasks: 2, hours: 4 },
    { day: "Sun", tasks: 1, hours: 2 },
  ]

  const currentProgress = projectData?.progress || 55
  const progressTrend = 5.2

  const [donut, setDonut] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const PHASE_COLORS = useMemo(
    () => [
      "hsl(var(--primary))",
      "hsl(var(--accent))",
      "hsl(var(--secondary))",
      "hsl(var(--muted-foreground))",
      // additional harmonized accents to diversify if phases grow
      "hsl(var(--foreground))",
      "hsl(var(--muted))",
    ],
    [],
  )

  // Helpers for simple bar visuals without third-party charts
  const Bar = ({ value, color = "var(--primary)", label }: { value: number; color?: string; label?: string }) => (
    <div className="w-full">
      {label ? <div className="mb-1 text-xs text-muted-foreground">{label}</div> : null}
      <div className="h-2 w-full rounded bg-muted">
        <div className="h-2 rounded" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
      </div>
    </div>
  )

  const getBarColor = (pct: number) => {
    if (pct < 50) return "#ef4444" // red-500
    if (pct < 80) return "#f59e0b" // amber-500
    return "#10b981" // emerald-500
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mb-2">{currentProgress}%</p>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500">+{progressTrend}%</span>
            <span className="text-muted-foreground">vs last week</span>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold mb-2">25/34</p>
          <Progress value={73.5} className="h-2" />
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg. Efficiency</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mb-2">89%</p>
          <p className="text-xs text-muted-foreground">Above target (85%)</p>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Days Remaining</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mb-2">45</p>
          <p className="text-xs text-muted-foreground">Est. completion May 20</p>
        </Card>
      </div>

      {/* Progress Trend Analysis */}
      <Card className="p-6 border-border">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Progress Trend Analysis</h3>
            <p className="text-sm text-muted-foreground">Cumulative planned vs actual progress over time</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs">Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-xs">Actual</span>
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyProgress}>
              <defs>
                <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="week" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="planned"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorPlanned)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="hsl(var(--accent))"
                fillOpacity={1}
                fill="url(#colorActual)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Phase Distribution (bars) */}
        <Card className="p-6 border-border">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Phase Distribution</h3>
              <p className="text-sm text-muted-foreground">Work breakdown by project phase</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={donut ? "default" : "outline"}
                onClick={() => setDonut(true)}
                aria-pressed={donut}
              >
                Donut
              </Button>
              <Button
                size="sm"
                variant={!donut ? "default" : "outline"}
                onClick={() => setDonut(false)}
                aria-pressed={!donut}
              >
                Pie
              </Button>
            </div>
          </div>

          <div className="relative h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={phaseData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={donut ? 90 : 110}
                  innerRadius={donut ? 50 : 0}
                  paddingAngle={2}
                  isAnimationActive
                  onMouseEnter={(_, idx) => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {phaseData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={PHASE_COLORS[index % PHASE_COLORS.length]}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, _name: any, info: any) => {
                    const numValue = Number(value) || 0
                    const total = phaseData.reduce((acc, d) => acc + d.value, 0)
                    const pct = total ? ((numValue / total) * 100).toFixed(1) : "0.0"
                    return [`${numValue}% (${pct}%)`, info?.payload?.name]
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string, _entry, index) => {
                    const v = phaseData[index]?.value ?? 0
                    const total = phaseData.reduce((acc, d) => acc + d.value, 0)
                    const pct = total ? Math.round((v / total) * 100) : 0
                    return `${value} • ${pct}%`
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {donut ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentProgress}%</div>
                  <div className="text-xs text-muted-foreground">Overall</div>
                </div>
              </div>
            ) : null}
          </div>
        </Card>

        {/* Task completion by priority (stacked indicators) */}
        <Card className="p-6 border-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Task Completion by Priority</h3>
            <p className="text-sm text-muted-foreground">Completed vs Pending</p>
          </div>
          <div className="space-y-4">
            {priorityData.map((row) => {
              const completedPct = (row.completed / row.total) * 100
              const color = getBarColor(completedPct)
              return (
                <div key={row.priority}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{row.priority}</span>
                    <span className="text-muted-foreground">{Math.round(completedPct)}%</span>
                  </div>
                  <div className="h-2 w-full rounded bg-muted overflow-hidden">
                    <div
                      className="h-2 transition-[width] duration-700 ease-out"
                      style={{ width: `${completedPct}%`, background: color }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {row.completed} completed • {row.pending} pending
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Resource utilization */}
        <Card className="p-6 border-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Resource Utilization</h3>
            <p className="text-sm text-muted-foreground">Current allocation vs targets</p>
          </div>
          <div className="space-y-3">
            {resourceData.map((r) => {
              const color = getBarColor(r.value)
              return (
                <div key={r.category} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-muted-foreground">{r.category}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded bg-muted overflow-hidden">
                      <div
                        className="h-2 transition-[width] duration-700 ease-out"
                        style={{ width: `${r.value}%`, background: color }}
                      />
                    </div>
                  </div>
                  <div className="w-10 text-right text-xs">{r.value}%</div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Daily activity summary table */}
        <Card className="p-6 border-border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Daily Activity</h3>
            <p className="text-sm text-muted-foreground">Workload and logged hours distribution</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <ReBar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Tasks" />
                <ReBar dataKey="hours" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Construction Route Map</h3>
          <p className="text-sm text-muted-foreground">From initial survey to final handover—key stages at a glance</p>
        </div>
        <ol className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Stage 1 */}
          <li className="rounded-lg border border-border p-3">
            <img
              src="/images/construction-site-survey-equipment.jpg"
              alt="Site survey and requirements"
              className="mb-3 h-36 w-full rounded object-cover"
            />
            <h4 className="font-medium mb-1">1. Site Survey & Requirements</h4>
            <p className="text-sm text-muted-foreground">
              On-site measurements, constraints, and stakeholder requirements captured.
            </p>
          </li>
          {/* Stage 2 */}
          <li className="rounded-lg border border-border p-3">
            <img
              src="/images/architectural-floor-plan-blueprint.jpg"
              alt="Concept, floor plans, and 3D views"
              className="mb-3 h-36 w-full rounded object-cover"
            />
            <h4 className="font-medium mb-1">2. Concepts & Floor Plans</h4>
            <p className="text-sm text-muted-foreground">
              Iterative plan layouts with early 3D visualization for clarity.
            </p>
          </li>
          {/* Stage 3 */}
          <li className="rounded-lg border border-border p-3">
            <img
              src="/images/building-permit-approval-documents.jpg"
              alt="Approvals and BOQ documents"
              className="mb-3 h-36 w-full rounded object-cover"
            />
            <h4 className="font-medium mb-1">3. Approvals & BOQ</h4>
            <p className="text-sm text-muted-foreground">
              Regulatory approvals and bill of quantities finalized for execution.
            </p>
          </li>
          {/* Stage 4 */}
          <li className="rounded-lg border border-border p-3">
            <img
              src="/images/building-foundation-concrete-construction.jpg"
              alt="Foundation and structural work"
              className="mb-3 h-36 w-full rounded object-cover"
            />
            <h4 className="font-medium mb-1">4. Foundation & Structure</h4>
            <p className="text-sm text-muted-foreground">
              Earthwork, foundation, framing, and load-bearing structure completion.
            </p>
          </li>
          {/* Stage 5 */}
          <li className="rounded-lg border border-border p-3">
            <img
              src="/images/electrical-plumbing-hvac-installation.jpg"
              alt="Electrical, plumbing, HVAC routing"
              className="mb-3 h-36 w-full rounded object-cover"
            />
            <h4 className="font-medium mb-1">5. Services Routing</h4>
            <p className="text-sm text-muted-foreground">
              Electrical, plumbing, and HVAC lines installed and pressure-tested.
            </p>
          </li>
          {/* Stage 6 */}
          <li className="rounded-lg border border-border p-3">
            <img
              src="/images/interior-finishing-painting-flooring.jpg"
              alt="Interior finishes, painting, and flooring"
              className="mb-3 h-36 w-full rounded object-cover"
            />
            <h4 className="font-medium mb-1">6. Interior Finishes</h4>
            <p className="text-sm text-muted-foreground">
              Joinery, painting, tiling, fixtures, and final fit-outs completed.
            </p>
          </li>
          {/* Stage 7 */}
          <li className="rounded-lg border border-border p-3 md:col-span-2 xl:col-span-1">
            <img
              src="/images/building-quality-inspection-handover.jpg"
              alt="Handover and quality assurance"
              className="mb-3 h-36 w-full rounded object-cover"
            />
            <h4 className="font-medium mb-1">7. QA & Handover</h4>
            <p className="text-sm text-muted-foreground">
              Quality checks, documentation, and client walkthrough for handover.
            </p>
          </li>
        </ol>
      </Card>
    </div>
  )
}

export default ProgressAnalytics
