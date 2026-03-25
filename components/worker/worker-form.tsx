"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UserPlus } from "lucide-react"

export function WorkerForm({ onWorkerAdded }: { onWorkerAdded: () => void }) {
  const [name, setName] = useState("")
  const [skill, setSkill] = useState("")
  const [experience, setExperience] = useState("")
  const [performanceScore, setPerformanceScore] = useState("80")
  const [dailyCost, setDailyCost] = useState("500")
  const [availability, setAvailability] = useState(true)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !skill) {
      toast({ title: "Validation Error", description: "Name and skill are required", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/workers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          skill,
          experience: Number(experience),
          performance_score: Number(performanceScore),
          daily_cost: Number(dailyCost),
          availability
        })
      })

      if (!res.ok) throw new Error("Failed to add worker")

      toast({ title: "Success", description: "Worker successfully added" })
      setName("")
      setSkill("")
      setExperience("")
      setPerformanceScore("80")
      setDailyCost("500")
      setAvailability(true)
      onWorkerAdded()
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
          <UserPlus className="w-5 h-5 text-blue-500" />
          Add Worker Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Worker Name</Label>
              <Input
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Core Skill</Label>
              <Select value={skill} onValueChange={setSkill}>
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
              <Label>Experience (Years)</Label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Performance Score (0-100)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={performanceScore}
                onChange={(e) => setPerformanceScore(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Daily Cost (₹)</Label>
              <Input
                type="number"
                min="0"
                value={dailyCost}
                onChange={(e) => setDailyCost(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex flex-col justify-center">
              <Label className="mb-2">Availability</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={availability}
                  onCheckedChange={setAvailability}
                />
                <span className="text-sm text-muted-foreground">{availability ? 'Available for work' : 'Currently Assigned'}</span>
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
             {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
             Register Worker
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
