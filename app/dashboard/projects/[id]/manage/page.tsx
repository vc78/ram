"use client"

import { useState } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  MoreVertical,
  Plus,
  Users,
  AlertCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react"

export default function ProjectManagementPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Site Survey and Measurements",
      status: "completed",
      assignee: "John Architect",
      dueDate: "2024-01-15",
      priority: "high",
      phase: "Planning",
    },
    {
      id: 2,
      title: "Initial Design Concepts",
      status: "completed",
      assignee: "Sarah Designer",
      dueDate: "2024-01-22",
      priority: "high",
      phase: "Planning",
    },
    {
      id: 3,
      title: "Permit Applications",
      status: "in-progress",
      assignee: "Mike Admin",
      dueDate: "2024-02-05",
      priority: "high",
      phase: "Planning",
    },
    {
      id: 4,
      title: "Foundation Work",
      status: "pending",
      assignee: "BuildPro Construction",
      dueDate: "2024-02-20",
      priority: "high",
      phase: "Construction",
    },
    {
      id: 5,
      title: "Framing and Structure",
      status: "pending",
      assignee: "BuildPro Construction",
      dueDate: "2024-03-15",
      priority: "medium",
      phase: "Construction",
    },
    {
      id: 6,
      title: "Electrical Installation",
      status: "pending",
      assignee: "PowerLine Electrical",
      dueDate: "2024-04-01",
      priority: "medium",
      phase: "Construction",
    },
    {
      id: 7,
      title: "Plumbing Installation",
      status: "pending",
      assignee: "FlowMaster Plumbing",
      dueDate: "2024-04-10",
      priority: "medium",
      phase: "Construction",
    },
    {
      id: 8,
      title: "Interior Finishing",
      status: "pending",
      assignee: "Elite Interiors",
      dueDate: "2024-05-01",
      priority: "low",
      phase: "Finishing",
    },
  ])

  const milestones = [
    { id: 1, name: "Planning Complete", date: "2024-02-05", status: "in-progress", progress: 75 },
    { id: 2, name: "Foundation Complete", date: "2024-02-20", status: "pending", progress: 0 },
    { id: 3, name: "Structure Complete", date: "2024-03-15", status: "pending", progress: 0 },
    { id: 4, name: "Systems Installed", date: "2024-04-15", status: "pending", progress: 0 },
    { id: 5, name: "Final Inspection", date: "2024-05-20", status: "pending", progress: 0 },
  ]

  const team = [
    { id: 1, name: "John Architect", role: "Lead Architect", avatar: "/placeholder.svg?key=team1" },
    { id: 2, name: "Sarah Designer", role: "Interior Designer", avatar: "/placeholder.svg?key=team2" },
    { id: 3, name: "BuildPro Construction", role: "General Contractor", avatar: "/placeholder.svg?key=team3" },
    { id: 4, name: "PowerLine Electrical", role: "Electrician", avatar: "/placeholder.svg?key=team4" },
  ]

  const documents = [
    { id: 1, name: "Building Permit", type: "PDF", date: "2024-01-10", size: "2.4 MB" },
    { id: 2, name: "Site Plans", type: "PDF", date: "2024-01-15", size: "5.1 MB" },
    { id: 3, name: "Material Specifications", type: "PDF", date: "2024-01-20", size: "1.8 MB" },
    { id: 4, name: "Contract Agreement", type: "PDF", date: "2024-01-05", size: "890 KB" },
  ]

  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const totalTasks = tasks.length
  const projectProgress = Math.round((completedTasks / totalTasks) * 100)

  const toggleTaskStatus = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task,
      ),
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Modern Villa Project</h1>
                <p className="text-muted-foreground">Project Management & Timeline</p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/dashboard/projects/1/analytics">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Messages
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent-dark text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Project Overview Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold mb-2">{projectProgress}%</p>
              <Progress value={projectProgress} className="h-2" />
            </Card>

            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Budget</span>
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">₹125K</p>
              <p className="text-xs text-muted-foreground">of ₹150K total</p>
            </Card>

            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Timeline</span>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">4 months</p>
              <p className="text-xs text-muted-foreground">Est. completion May 2024</p>
            </Card>

            <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Team</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{team.length}</p>
              <p className="text-xs text-muted-foreground">Active members</p>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="tasks" className="w-full">
                <TabsList>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="space-y-4 mt-6">
                  {/* Planning Phase */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Planning Phase</h3>
                      <Badge variant="secondary">3 tasks</Badge>
                    </div>
                    <div className="space-y-2">
                      {tasks
                        .filter((task) => task.phase === "Planning")
                        .map((task) => (
                          <Card
                            key={task.id}
                            className={`p-4 border-border ${task.status === "completed" ? "opacity-60" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={task.status === "completed"}
                                onCheckedChange={() => toggleTaskStatus(task.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4
                                      className={`font-medium mb-1 ${task.status === "completed" ? "line-through" : ""}`}
                                    >
                                      {task.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{task.assignee}</p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>{task.dueDate}</span>
                                  </div>
                                  <Badge
                                    variant={
                                      task.status === "completed"
                                        ? "secondary"
                                        : task.status === "in-progress"
                                          ? "default"
                                          : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {task.status === "completed"
                                      ? "Completed"
                                      : task.status === "in-progress"
                                        ? "In Progress"
                                        : "Pending"}
                                  </Badge>
                                  {task.priority === "high" && (
                                    <Badge variant="destructive" className="text-xs">
                                      High Priority
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Construction Phase */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Construction Phase</h3>
                      <Badge variant="secondary">4 tasks</Badge>
                    </div>
                    <div className="space-y-2">
                      {tasks
                        .filter((task) => task.phase === "Construction")
                        .map((task) => (
                          <Card
                            key={task.id}
                            className={`p-4 border-border ${task.status === "completed" ? "opacity-60" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={task.status === "completed"}
                                onCheckedChange={() => toggleTaskStatus(task.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4
                                      className={`font-medium mb-1 ${task.status === "completed" ? "line-through" : ""}`}
                                    >
                                      {task.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{task.assignee}</p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>{task.dueDate}</span>
                                  </div>
                                  <Badge
                                    variant={
                                      task.status === "completed"
                                        ? "secondary"
                                        : task.status === "in-progress"
                                          ? "default"
                                          : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {task.status === "completed"
                                      ? "Completed"
                                      : task.status === "in-progress"
                                        ? "In Progress"
                                        : "Pending"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Finishing Phase */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Finishing Phase</h3>
                      <Badge variant="secondary">1 task</Badge>
                    </div>
                    <div className="space-y-2">
                      {tasks
                        .filter((task) => task.phase === "Finishing")
                        .map((task) => (
                          <Card
                            key={task.id}
                            className={`p-4 border-border ${task.status === "completed" ? "opacity-60" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={task.status === "completed"}
                                onCheckedChange={() => toggleTaskStatus(task.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4
                                      className={`font-medium mb-1 ${task.status === "completed" ? "line-through" : ""}`}
                                    >
                                      {task.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{task.assignee}</p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>{task.dueDate}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    Pending
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4 mt-6">
                  <div className="space-y-6">
                    {milestones.map((milestone, index) => (
                      <div key={milestone.id} className="relative">
                        {index !== milestones.length - 1 && (
                          <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border" />
                        )}
                        <Card className="p-4 border-border">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${milestone.status === "completed"
                                  ? "bg-primary text-white"
                                  : milestone.status === "in-progress"
                                    ? "bg-accent text-white"
                                    : "bg-muted text-muted-foreground"
                                }`}
                            >
                              {milestone.status === "completed" ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : milestone.status === "in-progress" ? (
                                <Clock className="w-5 h-5" />
                              ) : (
                                <span className="text-sm font-medium">{index + 1}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold mb-1">{milestone.name}</h4>
                                  <p className="text-sm text-muted-foreground">Target: {milestone.date}</p>
                                </div>
                                <Badge
                                  variant={
                                    milestone.status === "completed"
                                      ? "secondary"
                                      : milestone.status === "in-progress"
                                        ? "default"
                                        : "outline"
                                  }
                                >
                                  {milestone.status === "completed"
                                    ? "Completed"
                                    : milestone.status === "in-progress"
                                      ? "In Progress"
                                      : "Upcoming"}
                                </Badge>
                              </div>
                              {milestone.status === "in-progress" && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-muted-foreground">Progress</span>
                                    <span className="text-sm font-medium">{milestone.progress}%</span>
                                  </div>
                                  <Progress value={milestone.progress} className="h-2" />
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <Card key={doc.id} className="p-4 border-border hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">{doc.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {doc.type} • {doc.size} • {doc.date}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Team Members */}
              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold mb-4">Team Members</h3>
                <div className="space-y-3">
                  {team.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <img
                        src={member.avatar || "/images/modern-minimalist-design.jpg"}
                        alt={member.name}
                        className="w-10 h-10 rounded-full border border-border"
                        onError={(e) => {
                          // Replace broken image with fallback, avoid infinite loop
                          const img = e.currentTarget as HTMLImageElement
                          if (img.src.endsWith("/images/modern-minimalist-design.jpg")) return
                          img.onerror = null
                          img.src = "/images/modern-minimalist-design.jpg"
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </Card>

              {/* Upcoming Deadlines */}
              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {tasks
                    .filter((task) => task.status !== "completed")
                    .slice(0, 3)
                    .map((task) => (
                      <div key={task.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-1">{task.title}</p>
                          <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              {/* Alerts */}
              <Card className="p-6 border-border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-amber-900 dark:text-amber-100">
                      Permit Approval Pending
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                      Building permit application is under review. Expected approval by Feb 5.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
