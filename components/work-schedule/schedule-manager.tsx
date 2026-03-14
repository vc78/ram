"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Camera, Search, Filter } from "lucide-react"
import { SitePhotoUpload } from "./site-photo-upload"
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Users,
  LinkIcon,
  Download,
  RotateCcw,
  MessageSquare,
  AlertTriangle,
} from "lucide-react"

interface WorkTask {
  id: string
  title: string
  description: string
  assignedTo: string[]
  startDate: string
  endDate: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
  progress: number
  dependencies: string[]
  resources: string[]
  tags: string[]
  comments: Comment[]
  attachments: Attachment[]
  photos?: string[] // Photo IDs
  estimatedHours: number
  actualHours: number
  createdAt: string
  updatedAt: string
}

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
}

interface Attachment {
  id: string
  name: string
  url: string
  uploadedAt: string
}

const MOCK_TASKS: WorkTask[] = [
  {
    id: "1",
    title: "Foundation Excavation",
    description: "Complete excavation for building foundation",
    assignedTo: ["John Doe", "Mike Smith"],
    startDate: "2024-02-01",
    endDate: "2024-02-10",
    priority: "high",
    status: "in-progress",
    progress: 65,
    dependencies: [],
    resources: ["Excavator", "Dump Truck"],
    tags: ["foundation", "site-work"],
    comments: [],
    attachments: [],
    estimatedHours: 80,
    actualHours: 52,
    createdAt: "2024-01-25",
    updatedAt: "2024-02-05",
  },
  {
    id: "2",
    title: "Steel Framework Installation",
    description: "Install structural steel framework",
    assignedTo: ["Robert Wilson"],
    startDate: "2024-02-11",
    endDate: "2024-02-25",
    priority: "high",
    status: "pending",
    progress: 0,
    dependencies: ["1"],
    resources: ["Crane", "Welding Equipment"],
    tags: ["structural", "steel"],
    comments: [],
    attachments: [],
    estimatedHours: 120,
    actualHours: 0,
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25",
  },
]

export function ScheduleManager() {
  const [tasks, setTasks] = useState<WorkTask[]>(MOCK_TASKS)
  const [filteredTasks, setFilteredTasks] = useState<WorkTask[]>(MOCK_TASKS)
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily")
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<WorkTask | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [commentDialog, setCommentDialog] = useState<{ open: boolean; taskId: string | null }>({
    open: false,
    taskId: null,
  })
  const [newComment, setNewComment] = useState("")
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<WorkTask>>({
    title: "",
    description: "",
    assignedTo: [],
    startDate: "",
    endDate: "",
    priority: "medium",
    status: "pending",
    progress: 0,
    dependencies: [],
    resources: [],
    tags: [],
    estimatedHours: 0,
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/db/workScheduleTasks")
        if (res.ok) {
          const dbTasks: WorkTask[] = await res.json()
          localStorage.setItem("workScheduleTasks", JSON.stringify(dbTasks))
          setTasks(dbTasks)
          setFilteredTasks(dbTasks)
          return
        }
      } catch (err) {
        console.error("Failed to load tasks from DB", err)
      }
      const savedTasks = localStorage.getItem("workScheduleTasks")
      if (savedTasks) {
        try {
          const parsed = JSON.parse(savedTasks)
          setTasks(parsed)
          setFilteredTasks(parsed)
        } catch (e) {
          setTasks(MOCK_TASKS)
          setFilteredTasks(MOCK_TASKS)
        }
      }
    }
    load()
  }, [])

  useEffect(() => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus)
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((t) => t.priority === filterPriority)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, filterStatus, filterPriority])

  const saveTasks = async (newTasks: WorkTask[]) => {
    const userTasks = newTasks.filter((t) => !MOCK_TASKS.find((m) => m.id === t.id))
    localStorage.setItem("workScheduleTasks", JSON.stringify(userTasks))
    setTasks(newTasks)
    try {
      await fetch("/api/db/workScheduleTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userTasks),
      })
    } catch (err) {
      console.error("Failed to save tasks to DB", err)
    }
  }

  const handleCreateTask = () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"User"}')

    const newTask: WorkTask = {
      id: crypto.randomUUID(),
      title: formData.title || "",
      description: formData.description || "",
      assignedTo: formData.assignedTo || [],
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
      priority: formData.priority || "medium",
      status: formData.status || "pending",
      progress: formData.progress || 0,
      dependencies: formData.dependencies || [],
      resources: formData.resources || [],
      tags: formData.tags || [],
      comments: [],
      attachments: [],
      estimatedHours: formData.estimatedHours || 0,
      actualHours: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveTasks([...tasks, newTask])
    setDialogOpen(false)
    resetForm()

    toast({
      title: "Task Created",
      description: `${newTask.title} has been added to the schedule`,
    })

    // Send notification
    sendNotification("new", newTask)
  }

  const handleUpdateTask = () => {
    if (!editingTask) return

    const updatedTasks = tasks.map((t) =>
      t.id === editingTask.id
        ? {
          ...t,
          ...formData,
          updatedAt: new Date().toISOString(),
        }
        : t,
    )

    saveTasks(updatedTasks)
    setDialogOpen(false)
    setEditingTask(null)
    resetForm()

    toast({
      title: "Task Updated",
      description: "Task has been updated successfully",
    })
  }

  const handleDeleteTask = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const updatedTasks = tasks.filter((t) => t.id !== id)
      saveTasks(updatedTasks)

      toast({
        title: "Task Deleted",
        description: "Task has been removed from schedule",
      })
    }
  }

  const handleAddComment = () => {
    if (!commentDialog.taskId || !newComment.trim()) return

    const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"User"}')

    const comment: Comment = {
      id: crypto.randomUUID(),
      author: currentUser.name || "User",
      text: newComment,
      timestamp: new Date().toISOString(),
    }

    const updatedTasks = tasks.map((t) =>
      t.id === commentDialog.taskId
        ? {
          ...t,
          comments: [...(t.comments || []), comment],
          updatedAt: new Date().toISOString(),
        }
        : t,
    )

    saveTasks(updatedTasks)
    setNewComment("")
    setCommentDialog({ open: false, taskId: null })

    toast({
      title: "Comment Added",
      description: "Your comment has been posted",
    })
  }

  const detectConflicts = (task: WorkTask) => {
    return tasks.some((t) => {
      if (t.id === task.id) return false
      const hasOverlap =
        (new Date(task.startDate) <= new Date(t.endDate) && new Date(task.endDate) >= new Date(t.startDate)) ||
        (new Date(t.startDate) <= new Date(task.endDate) && new Date(t.endDate) >= new Date(t.startDate))

      const sharedResources = task.assignedTo.some((a) => t.assignedTo.includes(a))

      return hasOverlap && sharedResources
    })
  }

  const autoReschedule = (task: WorkTask) => {
    const delay = 7 // days
    const newStart = new Date(task.startDate)
    newStart.setDate(newStart.getDate() + delay)
    const newEnd = new Date(task.endDate)
    newEnd.setDate(newEnd.getDate() + delay)

    const updatedTasks = tasks.map((t) =>
      t.id === task.id
        ? {
          ...t,
          startDate: newStart.toISOString().split("T")[0],
          endDate: newEnd.toISOString().split("T")[0],
          updatedAt: new Date().toISOString(),
        }
        : t,
    )

    saveTasks(updatedTasks)

    toast({
      title: "Task Rescheduled",
      description: `${task.title} has been delayed by ${delay} days`,
    })
  }

  const exportToCSV = () => {
    const data = tasks.map((t) => ({
      Title: t.title,
      Status: t.status,
      Priority: t.priority,
      Assigned: t.assignedTo.join(", "),
      Start: t.startDate,
      End: t.endDate,
      Progress: `${t.progress}%`,
    }))

    const csv = [Object.keys(data[0] || {}).join(","), ...data.map((row) => Object.values(row).join(","))].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `work-schedule-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Schedule Exported",
      description: "Schedule exported as CSV",
    })
  }

  const sendNotification = (type: string, task: WorkTask) => {
    const notifications = JSON.parse(localStorage.getItem("scheduleNotifications") || "[]")
    notifications.unshift({
      id: crypto.randomUUID(),
      type,
      task: task.title,
      timestamp: new Date().toISOString(),
    })
    const trimmed = notifications.slice(0, 50)
    localStorage.setItem("scheduleNotifications", JSON.stringify(trimmed))
    fetch("/api/db/scheduleNotifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trimmed),
    }).catch((e) => console.error("DB notifications failed", e))
  }

  const openEditDialog = (task: WorkTask) => {
    setEditingTask(task)
    setFormData(task)
    setDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      assignedTo: [],
      startDate: "",
      endDate: "",
      priority: "medium",
      status: "pending",
      progress: 0,
      dependencies: [],
      resources: [],
      tags: [],
      estimatedHours: 0,
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      case "medium":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100"
      case "low":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      case "in-progress":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "pending":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const isOverdue = (task: WorkTask) => {
    return new Date(task.endDate) < new Date() && task.status !== "completed"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Work Schedule</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage tasks, timelines, and site progress</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Photo Gallery toggle button */}
          <Button
            variant={showPhotoGallery ? "default" : "outline"}
            onClick={() => setShowPhotoGallery(!showPhotoGallery)}
          >
            <Camera className="w-4 h-4 mr-2" />
            {showPhotoGallery ? "Hide Photos" : "Photo Gallery"}
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="p-4 border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
          {(searchTerm || filterStatus !== "all" || filterPriority !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setFilterStatus("all")
                setFilterPriority("all")
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Photo Gallery View */}
      {showPhotoGallery && (
        <SitePhotoUpload
          onPhotoUploaded={(photo) => {
            toast({
              title: "Photo Added",
              description: "Site photo uploaded successfully",
            })
          }}
        />
      )}

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <div className="grid gap-4">
            {filteredTasks.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first task to get started"}
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteTask}
                  onComment={(id) => setCommentDialog({ open: true, taskId: id })}
                  onReschedule={autoReschedule}
                  hasConflict={detectConflicts(task)}
                  isOverdue={isOverdue(task)}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <div className="grid gap-4">
            {filteredTasks.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first task to get started"}
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteTask}
                  onComment={(id) => setCommentDialog({ open: true, taskId: id })}
                  onReschedule={autoReschedule}
                  hasConflict={detectConflicts(task)}
                  isOverdue={isOverdue(task)}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.length === 0 ? (
              <Card className="col-span-full p-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first task to get started"}
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  compact
                  onEdit={openEditDialog}
                  onDelete={handleDeleteTask}
                  onComment={(id) => setCommentDialog({ open: true, taskId: id })}
                  onReschedule={autoReschedule}
                  hasConflict={detectConflicts(task)}
                  isOverdue={isOverdue(task)}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => setFormData({ ...formData, priority: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Assigned To (comma-separated)</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo?.join(", ")}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value.split(",").map((s) => s.trim()) })
                }
                placeholder="John Doe, Jane Smith"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingTask ? handleUpdateTask : handleCreateTask}>
              {editingTask ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={commentDialog.open} onOpenChange={(open) => setCommentDialog({ open, taskId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCommentDialog({ open: false, taskId: null })}>
              Cancel
            </Button>
            <Button onClick={handleAddComment}>Post Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TaskCard({
  task,
  compact = false,
  onEdit,
  onDelete,
  onComment,
  onReschedule,
  hasConflict,
  isOverdue,
  getPriorityColor,
  getStatusColor,
}: {
  task: WorkTask
  compact?: boolean
  onEdit: (task: WorkTask) => void
  onDelete: (id: string) => void
  onComment: (id: string) => void
  onReschedule: (task: WorkTask) => void
  hasConflict: boolean
  isOverdue: boolean
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
}) {
  return (
    <Card
      className={`p-4 border-border ${hasConflict ? "border-orange-500 border-2" : ""} ${isOverdue ? "border-red-500 border-2" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            {hasConflict && (
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Conflict
              </Badge>
            )}
            {isOverdue && (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                <AlertCircle className="w-3 h-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
          {!compact && <p className="text-sm text-muted-foreground mb-3">{task.description}</p>}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
      </div>

      {!compact && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div>
              <span className="text-muted-foreground">Start:</span>
              <span className="ml-2 font-medium">{task.startDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">End:</span>
              <span className="ml-2 font-medium">{task.endDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Estimated:</span>
              <span className="ml-2 font-medium">{task.estimatedHours}h</span>
            </div>
            <div>
              <span className="text-muted-foreground">Actual:</span>
              <span className="ml-2 font-medium">{task.actualHours}h</span>
            </div>
          </div>

          {task.assignedTo.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span>Assigned to:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {task.assignedTo.map((person, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {person}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{task.progress}%</span>
        </div>
        <Progress value={task.progress} className="h-2" />
      </div>

      {!compact && (
        <div className="flex gap-2 pt-3 border-t">
          <Button variant="outline" size="sm" onClick={() => onComment(task.id)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Comment
          </Button>
          {task.dependencies.length > 0 && (
            <Button variant="outline" size="sm">
              <LinkIcon className="w-4 h-4 mr-2" />
              {task.dependencies.length} Deps
            </Button>
          )}
          {isOverdue && (
            <Button variant="outline" size="sm" onClick={() => onReschedule(task)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reschedule
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
