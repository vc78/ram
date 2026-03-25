"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Brain, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function AdvancedInputs() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    materials: "Cement/Steel Standard",
    amenities: "",
    features: "Basic",
    construction_grade: "Standard"
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const resp = await fetch(`/api/projects/${projectId}/inputs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const resData = await resp.json()
      if (resData.success) {
        toast.success("Advanced parameters saved!")
        // FLOW: Advanced Inputs -> Material ML Calculation
        router.push(`/material-calculator/${projectId}`)
      } else {
        toast.error("Failed to save advanced inputs")
      }
    } catch (err) {
      toast.error("Network connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-20 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex justify-center items-center gap-3">
          <Brain className="w-8 h-8 text-purple-500" /> Module 2: Advanced Inputs
        </h1>
        <p className="text-muted-foreground">Provide hyper-specific structural and amenity data before hitting the ML pipeline.</p>
      </div>

      <Card className="p-8 backdrop-blur-xl bg-background/50 border-border/50 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-3">
            <Label className="text-sm font-bold">Construction Quality Grade</Label>
            <Select onValueChange={(val) => setFormData(prev => ({ ...prev, construction_grade: val }))} defaultValue={formData.construction_grade}>
              <SelectTrigger className="h-12 border-border/50 bg-background/50">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard (Economical Base)</SelectItem>
                <SelectItem value="Premium">Premium (High-End Finishing)</SelectItem>
                <SelectItem value="Luxury">Luxury (Ultra High-End)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold">Material Preference Strategy</Label>
            <Input 
              value={formData.materials} 
              onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
              placeholder="e.g. Eco-Friendly, Fly-Ash Bricks, PPC Cement" 
              className="h-12 border-border/50 bg-background/50"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold">Extra Amenities Requested</Label>
            <Input 
              value={formData.amenities} 
              onChange={(e) => setFormData(prev => ({ ...prev, amenities: e.target.value }))}
              placeholder="e.g. Swimming Pool, Solar Roof, Basement"
              className="h-12 border-border/50 bg-background/50" 
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.98]">
              {loading ? "Optimizing Dimensions..." : "Send to ML Regression Engine"} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </form>
      </Card>
      
      <div className="mt-8 p-4 rounded-xl border border-primary/20 bg-primary/5">
        <p className="text-sm text-center text-primary font-medium tracking-wide">
          Next Step Architecture: Inputs → Material ML → Cost Engine
        </p>
      </div>
    </div>
  )
}
