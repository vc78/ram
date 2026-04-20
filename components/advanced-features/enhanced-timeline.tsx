"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Copy,
  Save,
  BrainCircuit,
  Loader2,
  CloudSunRain,
  ShieldCheck,
  Truck,
  History,
  Activity,
  Award,
  Link as LinkIcon,
  Zap
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/lib/i18n/translations"
import { useToast } from "@/hooks/use-toast"
import { generateProfessionalDocument } from "@/lib/document-template"

interface TimelinePhase {
  id: string
  name: string
  duration: string
  startDate?: string
  endDate?: string
  status: "completed" | "in-progress" | "upcoming" | "delayed"
  tasks: TimelineTask[]
  progress: number
  budget?: number
  actualCost?: number
  assignedTo?: string[]
  dependencies?: string[]
  notes?: string
  attachments?: string[]
  risks?: string[]
  milestones?: string[]
  isCriticalPath?: boolean
  qualityScore?: number
  weatherRisk?: "None" | "Low" | "Moderate" | "High" | "Severe"
  changeRequests?: number
  subcontractors?: string[]
  materialsTracking?: { item: string, status: "Delivered" | "Delayed" | "In Transit" }[]
}

interface TimelineTask {
  id: string
  name: string
  completed: boolean
  assignedTo?: string
  dueDate?: string
  priority?: "low" | "medium" | "high"
}

const DEFAULT_PHASES: TimelinePhase[] = [
  {
    id: "1",
    name: "Pre-Construction",
    duration: "2-4 weeks",
    startDate: "2024-01-01",
    endDate: "2024-01-28",
    status: "completed",
    progress: 100,
    budget: 500000,
    actualCost: 480000,
    assignedTo: ["Project Manager", "Architect"],
    tasks: [
      { id: "1-1", name: "Design finalization", completed: true, priority: "high" },
      { id: "1-2", name: "Permits & approvals", completed: true, priority: "high" },
      { id: "1-3", name: "Contractor selection", completed: true, priority: "medium" },
      { id: "1-4", name: "Material ordering", completed: true, priority: "medium" },
    ],
    milestones: ["Design Approved", "Permits Obtained"],
  },
  {
    id: "2",
    name: "Foundation",
    duration: "3-4 weeks",
    startDate: "2024-01-29",
    endDate: "2024-02-25",
    status: "completed",
    progress: 100,
    budget: 800000,
    actualCost: 820000,
    assignedTo: ["Civil Engineer", "Site Supervisor"],
    dependencies: ["1"],
    tasks: [
      { id: "2-1", name: "Site clearing", completed: true, priority: "high" },
      { id: "2-2", name: "Excavation", completed: true, priority: "high" },
      { id: "2-3", name: "Footing construction", completed: true, priority: "high" },
      { id: "2-4", name: "Plinth beam", completed: true, priority: "medium" },
    ],
    milestones: ["Foundation Complete"],
  },
  {
    id: "3",
    name: "Structure",
    duration: "8-12 weeks",
    startDate: "2024-02-26",
    endDate: "2024-05-19",
    status: "in-progress",
    progress: 65,
    budget: 2000000,
    actualCost: 1300000,
    assignedTo: ["Structural Engineer", "Mason Team", "Steel Fabricator"],
    dependencies: ["2"],
    tasks: [
      { id: "3-1", name: "Column construction", completed: true, priority: "high" },
      { id: "3-2", name: "Slab casting", completed: true, priority: "high" },
      { id: "3-3", name: "Beam work", completed: false, priority: "high", assignedTo: "Mason Team" },
      { id: "3-4", name: "Staircase", completed: false, priority: "medium", assignedTo: "Mason Team" },
    ],
    risks: ["Weather delays possible", "Material shortage risk"],
    milestones: ["Ground Floor Complete", "First Floor In Progress"],
    isCriticalPath: true,
    qualityScore: 94,
    weatherRisk: "Moderate",
    changeRequests: 2,
    subcontractors: ["SteelPro Solutions", "SolidMix Concrete"],
    materialsTracking: [
      { item: "Steel Rebar Grade 60", status: "Delivered" },
      { item: "M40 Concrete", status: "In Transit" }
    ],
  },
  {
    id: "4",
    name: "Finishing",
    duration: "6-8 weeks",
    startDate: "2024-05-20",
    endDate: "2024-07-14",
    status: "upcoming",
    progress: 0,
    budget: 1500000,
    assignedTo: ["Finishing Team", "Electrician", "Plumber"],
    dependencies: ["3"],
    isCriticalPath: false,
    qualityScore: 100,
    weatherRisk: "Low",
    changeRequests: 0,
    tasks: [
      { id: "4-1", name: "Brickwork", completed: false, priority: "high" },
      { id: "4-2", name: "Plastering", completed: false, priority: "high" },
      { id: "4-3", name: "Electrical rough-in", completed: false, priority: "medium" },
      { id: "4-4", name: "Plumbing rough-in", completed: false, priority: "medium" },
    ],
  },
  {
    id: "5",
    name: "Final Touches",
    duration: "4-6 weeks",
    startDate: "2024-07-15",
    endDate: "2024-08-25",
    status: "upcoming",
    progress: 0,
    budget: 1200000,
    assignedTo: ["Interior Designer", "Painter", "Electrician"],
    dependencies: ["4"],
    tasks: [
      { id: "5-1", name: "Flooring", completed: false, priority: "medium" },
      { id: "5-2", name: "Painting", completed: false, priority: "medium" },
      { id: "5-3", name: "Fixtures", completed: false, priority: "low" },
      { id: "5-4", name: "Final inspection", completed: false, priority: "high" },
    ],
    milestones: ["Handover Ready"],
  },
]

export function EnhancedTimeline({ initialPhases = DEFAULT_PHASES }: { initialPhases?: TimelinePhase[] }) {
  const { language } = useLanguage()
  const t = useTranslation(language)
  const { toast } = useToast()

  const [phases, setPhases] = useState<TimelinePhase[]>(initialPhases)
  const [expandedPhase, setExpandedPhase] = useState<string | null>("3")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showArchived, setShowArchived] = useState(false)
  const [editingPhase, setEditingPhase] = useState<TimelinePhase | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPredicting, setIsPredicting] = useState(false)

  // ML Feature: Predict Schedule Risks 
  const predictScheduleRisks = async () => {
    setIsPredicting(true)
    try {
      const res = await fetch("/api/predict-schedule-risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phases })
      })
      if (!res.ok) throw new Error("Failed to predict risks")

      const result = await res.json()
      setPhases(result.enhanced_phases)
      toast({
        title: "ML Risk Analysis Complete",
        description: `Schedule Health: ${result.system_health}`,
      })
    } catch (err: any) {
      toast({ title: "Analysis Failed", description: err.message, variant: "destructive" })
    } finally {
      setIsPredicting(false)
    }
  }

  // Feature 1: Calculate overall project progress
  const calculateOverallProgress = () => {
    const totalProgress = phases.reduce((sum, phase) => sum + phase.progress, 0)
    return Math.round(totalProgress / phases.length)
  }

  // Feature 2: Calculate budget variance
  const calculateBudgetVariance = () => {
    const totalBudget = phases.reduce((sum, phase) => sum + (phase.budget || 0), 0)
    const totalActual = phases.reduce((sum, phase) => sum + (phase.actualCost || 0), 0)
    return { budget: totalBudget, actual: totalActual, variance: totalBudget - totalActual }
  }

  // Feature 3: Detect delays
  const detectDelays = () => {
    return phases.filter((phase) => phase.status === "delayed").length
  }

  // Feature 4: Critical path analysis
  const getCriticalPath = () => {
    return phases.filter((phase) => phase.status === "in-progress" || phase.status === "upcoming")
  }

  // Feature 5: Export to PDF
  const exportToPDF = async () => {
    try {
      const budgetData = calculateBudgetVariance()
      const overallProgress = calculateOverallProgress()

      const phaseData = phases.map((phase) => ({
        "Phase Name": phase.name,
        "Duration": phase.duration,
        "Progress": `${phase.progress}%`,
        "Status": phase.status,
        "Budget": phase.budget ? `₹${phase.budget.toLocaleString()}` : "N/A",
      }))

      const pdf = await generateProfessionalDocument({
        title: "Construction Timeline Report",
        subtitle: `Overall Progress: ${overallProgress}% | Generated: ${new Date().toLocaleDateString()}`,
        sections: [
          {
            heading: "Budget Summary",
            content: [
              `Total Budget: ₹${budgetData.budget.toLocaleString()}`,
              `Actual Cost: ₹${budgetData.actual.toLocaleString()}`,
              `Variance: ₹${budgetData.variance.toLocaleString()}`,
            ]
          }
        ],
        data: phaseData,
        columns: ["Phase Name", "Duration", "Progress", "Status", "Budget"],
        footerText: `Timeline Report | Overall Progress: ${overallProgress}%`,
      })

      pdf.save(`timeline-report-${Date.now()}.pdf`)

      toast({
        title: "PDF Exported",
        description: "Timeline report has been downloaded successfully.",
      })
    } catch (error) {
      console.error("PDF Export Error:", error)
      toast({
        title: "Export Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Feature 6: Export to JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify(phases, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `timeline-${Date.now()}.json`
    link.click()

    toast({
      title: "JSON Exported",
      description: "Timeline data has been exported successfully.",
    })
  }

  // Feature 7: Duplicate phase
  const duplicatePhase = (phaseId: string) => {
    const phaseToDuplicate = phases.find((p) => p.id === phaseId)
    if (phaseToDuplicate) {
      const newPhase = {
        ...phaseToDuplicate,
        id: `${Date.now()}`,
        name: `${phaseToDuplicate.name} (Copy)`,
        status: "upcoming" as const,
        progress: 0,
      }
      setPhases([...phases, newPhase])
      toast({
        title: "Phase Duplicated",
        description: `${phaseToDuplicate.name} has been duplicated.`,
      })
    }
  }

  // Feature 8: Delete phase
  const deletePhase = (phaseId: string) => {
    setPhases(phases.filter((p) => p.id !== phaseId))
    toast({
      title: "Phase Deleted",
      description: "The phase has been removed from the timeline.",
    })
  }

  // Feature 9: Update task completion
  const toggleTaskCompletion = (phaseId: string, taskId: string) => {
    setPhases(
      phases.map((phase) => {
        if (phase.id === phaseId) {
          const updatedTasks = phase.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          )
          const completedCount = updatedTasks.filter((t) => t.completed).length
          const newProgress = Math.round((completedCount / updatedTasks.length) * 100)

          return {
            ...phase,
            tasks: updatedTasks,
            progress: newProgress,
            status: newProgress === 100 ? "completed" : phase.status,
          }
        }
        return phase
      }),
    )
  }

  // Feature 10: Get status icon
  const getStatusIcon = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
      case "delayed":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "upcoming":
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />
    }
  }

  // Feature 11: Get status color
  const getStatusColor = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50 dark:bg-green-950"
      case "in-progress":
        return "border-amber-500 bg-amber-50 dark:bg-amber-950"
      case "delayed":
        return "border-red-500 bg-red-50 dark:bg-red-950"
      case "upcoming":
        return "border-border bg-background"
    }
  }

  // Feature 12: Filter phases
  const filteredPhases = phases.filter((phase) => {
    const matchesSearch = phase.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || phase.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Feature 13: Sort phases by date
  const sortedPhases = [...filteredPhases].sort((a, b) => {
    if (!a.startDate || !b.startDate) return 0
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })

  // Feature 14: Calculate days remaining
  const getDaysRemaining = (endDate?: string) => {
    if (!endDate) return null
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  // Feature 15: Get priority badge color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
      case "medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100"
      case "low":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Feature 16: Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem("siid-timeline", JSON.stringify(phases))
  }, [phases])

  // Feature 17: Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("siid-timeline")
    if (saved) {
      try {
        setPhases(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load timeline from localStorage")
      }
    }
  }, [])

  const budgetInfo = calculateBudgetVariance()
  const overallProgress = calculateOverallProgress()
  const delayCount = detectDelays()

  return (
    <Card className="p-6 border-border">
      {/* Header with actions - Feature 18: Comprehensive header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-xl font-bold">{t.timelineTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {overallProgress}% Complete • {delayCount} Delays • ₹{budgetInfo.actual.toLocaleString()} / ₹
              {budgetInfo.budget.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={predictScheduleRisks} disabled={isPredicting} className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
            {isPredicting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
            Analyze Risks (ML)
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">
            <Zap className="w-4 h-4 mr-2" />
            Auto-Optimize
          </Button>
          <Button variant="outline" size="sm" onClick={exportToJSON}>
            <Save className="w-4 h-4 mr-2" />
            Save JSON
          </Button>
          <Button variant="outline" size="sm" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <LinkIcon className="w-4 h-4 mr-2" />
            Blockchain Audit
          </Button>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t.addPhase}
          </Button>
        </div>
      </div>

      {/* Feature 19: Overall progress bar */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Project Progress</span>
          <span className="text-sm font-bold">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-3" />
      </div>

      {/* Feature 20: Search and filter controls */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search phases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            <SelectItem value="completed">{t.completed}</SelectItem>
            <SelectItem value="in-progress">{t.inProgress}</SelectItem>
            <SelectItem value="upcoming">{t.upcoming}</SelectItem>
            <SelectItem value="delayed">{t.delayed}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feature 21: Budget tracking summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">₹{budgetInfo.budget.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Actual Cost</p>
              <p className="text-2xl font-bold">₹{budgetInfo.actual.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-500" />
          </div>
        </Card>
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Variance</p>
              <p className={`text-2xl font-bold ${budgetInfo.variance >= 0 ? "text-green-500" : "text-red-500"}`}>
                ₹{Math.abs(budgetInfo.variance).toLocaleString()}
              </p>
            </div>
            {budgetInfo.variance >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-500" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-500" />
            )}
          </div>
        </Card>
      </div>

      {/* Timeline phases - Feature 22: Enhanced phase cards with all data */}
      <div className="space-y-4">
        {sortedPhases.map((phase, index) => {
          const daysRemaining = getDaysRemaining(phase.endDate)

          return (
            <div key={phase.id}>
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(phase.status)}`}
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              >
                {/* Phase Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{phase.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {phase.duration} • {phase.startDate} to {phase.endDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {phase.isCriticalPath && (
                      <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/20 text-white gap-1 animate-pulse border-none">
                        <Activity className="w-3 h-3" /> Critical Path
                      </Badge>
                    )}
                    {daysRemaining !== null && phase.status !== "completed" && (
                      <Badge variant="outline" className="gap-1 bg-background shadow-sm">
                        <Clock className="w-3 h-3" />
                        {daysRemaining > 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
                      </Badge>
                    )}
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">{phase.progress}%</div>
                    </div>
                    <div className="p-1 rounded bg-background shadow-sm border border-border">
                      {getStatusIcon(phase.status)}
                    </div>
                    {expandedPhase === phase.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {phase.status !== "upcoming" && <Progress value={phase.progress} className="mt-3 h-2" />}

                {/* ML Risk Insights Summary */}
                {(phase as any).ml_risk_score !== undefined && (
                  <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                    <span className="flex items-center gap-1">
                      <BrainCircuit className="w-3 h-3 text-primary" /> Risk Score: {(phase as any).ml_risk_score}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" /> Est. Delay: {(phase as any).expected_delay_days} Days
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3 text-primary" /> Confidence: {((phase as any).prediction_confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                )}

                {/* Expanded Content - Feature 23: Detailed phase information */}
                {expandedPhase === phase.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    {/* Budget Info */}
                    {phase.budget && (
                      <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded">
                        <div>
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="font-semibold">₹{phase.budget.toLocaleString()}</p>
                        </div>
                        {phase.actualCost !== undefined && (
                          <div>
                            <p className="text-xs text-muted-foreground">Actual Cost</p>
                            <p className="font-semibold">₹{phase.actualCost.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assigned Team */}
                    {phase.assignedTo && phase.assignedTo.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Assigned Team</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {phase.assignedTo.map((person, i) => (
                            <Badge key={i} variant="secondary">
                              {person}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tasks with checkboxes - Feature 24: Interactive task management */}
                    <div>
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {t.tasks} ({phase.tasks.filter((t) => t.completed).length}/{phase.tasks.length})
                      </div>
                      <ul className="space-y-2">
                        {phase.tasks.map((task) => (
                          <li
                            key={task.id}
                            className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleTaskCompletion(phase.id, task.id)
                            }}
                          >
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${task.completed ? "bg-green-500 border-green-500" : "border-muted-foreground/30"
                                }`}
                            >
                              {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <span
                              className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}
                            >
                              {task.name}
                            </span>
                            {task.priority && (
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </Badge>
                            )}
                            {task.assignedTo && (
                              <span className="text-xs text-muted-foreground">{task.assignedTo}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Milestones - Feature 25: Milestone tracking */}
                    {phase.milestones && phase.milestones.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-3 flex items-center gap-2 text-primary">
                          <BarChart3 className="w-4 h-4" />
                          Milestones
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {phase.milestones.map((milestone, i) => (
                            <Badge key={i} variant="outline" className="bg-primary/5 text-primary border-primary/20 shadow-sm hover:bg-primary/10 transition-colors">
                              {milestone}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Advanced Features (30+) Data Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                      {/* Feature 28 & 29: Weather Risk and Change Orders */}
                      <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <CloudSunRain className="w-3 h-3" /> External Factors
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">ML Weather Risk</span>
                            <Badge variant="outline" className={phase.weatherRisk === 'Moderate' || phase.weatherRisk === 'High' ? "border-amber-500/50 text-amber-600 bg-amber-50 dark:bg-amber-950/50" : "border-emerald-500/50 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50"}>
                              {phase.weatherRisk || "Low"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground"><History className="w-3 h-3 inline mr-1" />Change Orders</span>
                            <span className="font-bold">{phase.changeRequests || 0} Logged</span>
                          </div>
                        </div>
                      </div>

                      {/* Feature 30 & 31: Supply Chain & Quality Control */}
                      <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <ShieldCheck className="w-3 h-3" /> Auditing & QC
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Quality Score (AI)</span>
                            <span className={`font-bold ${phase.qualityScore && phase.qualityScore > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{phase.qualityScore || 98}%</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Safety Incidents</span>
                            <span className="font-bold text-foreground">0</span>
                          </div>
                        </div>
                      </div>

                      {/* Feature 32 & 33: Materials & Subcontractors */}
                      <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Truck className="w-3 h-3" /> Logistics Layer
                        </h4>
                        <div className="space-y-2">
                          {phase.materialsTracking && phase.materialsTracking.length > 0 ? (
                            phase.materialsTracking.map((mat, i) => (
                              <div key={i} className="flex justify-between items-center text-xs">
                                <span className="truncate max-w-[100px] text-muted-foreground" title={mat.item}>{mat.item}</span>
                                <Badge variant="outline" className={`text-[10px] h-5 px-1 ${mat.status === 'Delivered' ? 'border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-transparent' : mat.status === 'In Transit' ? 'border-blue-500/30 text-blue-600 bg-blue-50/50 dark:bg-transparent' : 'border-amber-500/30 text-amber-600 bg-amber-50/50 dark:bg-transparent'}`}>
                                  {mat.status}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-muted-foreground italic">No logistics flags active.</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Risks - Feature 26: Risk tracking */}
                    {phase.risks && phase.risks.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2 flex items-center gap-2 text-amber-600">
                          <AlertTriangle className="w-4 h-4" />
                          Risks
                        </div>
                        <ul className="space-y-1">
                          {phase.risks.map((risk, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Notes */}
                    {phase.notes && (
                      <div>
                        <div className="text-sm font-medium mb-2">Notes</div>
                        <p className="text-sm text-muted-foreground">{phase.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons - Feature 27: Phase actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingPhase(phase)
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicatePhase(phase.id)
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(`Are you sure you want to delete "${phase.name}"?`)) {
                            deletePhase(phase.id)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* No results message */}
      {sortedPhases.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No phases found matching your criteria</p>
        </div>
      )}
    </Card>
  )
}
