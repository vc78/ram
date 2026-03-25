"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileText } from "lucide-react"

export function TaskForm({ onTaskAdded }: { onTaskAdded: () => void }) {
  const [taskName, setTaskName] = useState("")
  const [requiredSkill, setRequiredSkill] = useState("")
  const [priority, setPriority] = useState("medium")
  const [deadline, setDeadline] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskName || !requiredSkill) {
      toast({ title: "Validation Error", description: "Task name and required skill are required", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_name: taskName,
          required_skill: requiredSkill,
          priority,
          deadline: deadline || new Date().toISOString()
        })
      })

      if (!res.ok) throw new Error("Failed to create task")

      toast({ title: "Success", description: "Task successfully created" })
      setTaskName("")
      setRequiredSkill("")
      setPriority("medium")
      setDeadline("")
      onTaskAdded()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          Create Task Token
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Task Name</Label>
              <Input
                placeholder="e.g. Wiring First Floor"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Required Skill</Label>
              <Select value={requiredSkill} onValueChange={setRequiredSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mason">Mason</SelectItem>
                  <SelectItem value="Electrician">Electrician</SelectItem>
                  <SelectItem value="Plumber">Plumber</SelectItem>
                  <SelectItem value="Carpenter">Carpenter</SelectItem>
                  <SelectItem value="Painter">Painter</SelectItem>
                  <SelectItem value="Foreman">Foreman</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading} variant="secondary">
             {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
             Create Task
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
