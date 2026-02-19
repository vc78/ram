"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flag, Calendar, IndianRupee, CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface Milestone {
  id: string
  name: string
  dueDate: string
  payment: number
  status: "completed" | "in-progress" | "upcoming" | "overdue"
  progress: number
  deliverables: string[]
}

const MOCK_MILESTONES: Milestone[] = [
  {
    id: "1",
    name: "Foundation Complete",
    dueDate: "Jan 15, 2024",
    payment: 500000,
    status: "completed",
    progress: 100,
    deliverables: ["Excavation", "Footing", "Plinth beam", "Foundation photos"],
  },
  {
    id: "2",
    name: "Ground Floor Structure",
    dueDate: "Feb 28, 2024",
    payment: 800000,
    status: "in-progress",
    progress: 65,
    deliverables: ["Columns", "Beams", "Slab casting", "Quality report"],
  },
  {
    id: "3",
    name: "First Floor Structure",
    dueDate: "Apr 15, 2024",
    payment: 700000,
    status: "upcoming",
    progress: 0,
    deliverables: ["First floor columns", "Slab", "Staircase continuation"],
  },
  {
    id: "4",
    name: "Roofing & Waterproofing",
    dueDate: "May 30, 2024",
    payment: 400000,
    status: "upcoming",
    progress: 0,
    deliverables: ["Roof slab", "Waterproofing", "Parapet wall"],
  },
]

export function ProjectMilestones() {
  const [milestones] = useState<Milestone[]>(MOCK_MILESTONES)
  const [expandedId, setExpandedId] = useState<string | null>("2")

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  const totalBudget = milestones.reduce((acc, m) => acc + m.payment, 0)
  const paidAmount = milestones.filter((m) => m.status === "completed").reduce((acc, m) => acc + m.payment, 0)

  const getStatusIcon = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-amber-500" />
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Flag className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-amber-100 text-amber-700">In Progress</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="secondary">Upcoming</Badge>
    }
  }

  return (
    <Card className="p-6 border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Project Milestones</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Total Budget</div>
          <div className="font-bold text-primary">{formatCurrency(totalBudget)}</div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-muted">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Payment Progress</span>
          <span className="text-sm font-medium">
            {formatCurrency(paidAmount)} / {formatCurrency(totalBudget)}
          </span>
        </div>
        <Progress value={(paidAmount / totalBudget) * 100} className="h-2" />
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={milestone.id}>
            <div
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                milestone.status === "completed"
                  ? "border-green-200 bg-green-50"
                  : milestone.status === "in-progress"
                    ? "border-amber-200 bg-amber-50"
                    : milestone.status === "overdue"
                      ? "border-red-200 bg-red-50"
                      : "border-border bg-background"
              }`}
              onClick={() => setExpandedId(expandedId === milestone.id ? null : milestone.id)}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      milestone.status === "completed"
                        ? "bg-green-500"
                        : milestone.status === "in-progress"
                          ? "bg-amber-500"
                          : "bg-muted"
                    }`}
                  >
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  {index < milestones.length - 1 && (
                    <div
                      className={`absolute top-10 left-1/2 w-0.5 h-8 -translate-x-1/2 ${
                        milestone.status === "completed" ? "bg-green-300" : "bg-border"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{milestone.name}</span>
                    {getStatusBadge(milestone.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {milestone.dueDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {formatCurrency(milestone.payment)}
                    </div>
                  </div>
                </div>
              </div>

              {milestone.status !== "upcoming" && (
                <div className="mt-3 ml-14">
                  <Progress value={milestone.progress} className="h-1.5" />
                  <span className="text-xs text-muted-foreground">{milestone.progress}% complete</span>
                </div>
              )}

              {expandedId === milestone.id && (
                <div className="mt-4 ml-14 pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Deliverables:</div>
                  <ul className="space-y-1">
                    {milestone.deliverables.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            milestone.status === "completed"
                              ? "bg-green-500"
                              : milestone.status === "in-progress" &&
                                  i < milestone.deliverables.length * (milestone.progress / 100)
                                ? "bg-amber-500"
                                : "bg-muted-foreground/30"
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {milestone.status === "in-progress" && (
                    <Button size="sm" className="mt-3">
                      Mark Complete
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
