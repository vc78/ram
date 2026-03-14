"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, CheckCircle2, MessageSquare, Phone, Activity, Bot, TrendingUp, TrendingDown, RefreshCcw } from "lucide-react"

interface Contractor {
  id: string
  name: string
  specialty: string
  rating: number
  reviews: number
  completedProjects: number
  location: string
  responseTime: string
  verified: boolean
  hourlyRate: string
  avatar?: string
  mlMetrics: {
    reliabilityScore: number // 0-100
    riskLevel: "Low" | "Medium" | "High"
    predictedDelay: string
    onBudgetProbability: number
  }
}

const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: "1",
    name: "Rajesh Kumar Construction",
    specialty: "Civil Contractor",
    rating: 4.8,
    reviews: 156,
    completedProjects: 89,
    location: "Hyderabad",
    responseTime: "< 2 hours",
    verified: true,
    hourlyRate: "₹800/day",
    mlMetrics: {
      reliabilityScore: 94,
      riskLevel: "Low",
      predictedDelay: "< 2 days",
      onBudgetProbability: 88,
    }
  },
  {
    id: "2",
    name: "Modern Interiors by Priya",
    specialty: "Interior Designer",
    rating: 4.9,
    reviews: 203,
    completedProjects: 124,
    location: "Bangalore",
    responseTime: "< 1 hour",
    verified: true,
    hourlyRate: "₹1,200/day",
    mlMetrics: {
      reliabilityScore: 98,
      riskLevel: "Low",
      predictedDelay: "None",
      onBudgetProbability: 95,
    }
  },
  {
    id: "3",
    name: "Spark Electrical Services",
    specialty: "Electrical Contractor",
    rating: 4.6,
    reviews: 89,
    completedProjects: 67,
    location: "Chennai",
    responseTime: "< 4 hours",
    verified: true,
    hourlyRate: "₹600/day",
    mlMetrics: {
      reliabilityScore: 76,
      riskLevel: "Medium",
      predictedDelay: "+ 5 days",
      onBudgetProbability: 62,
    }
  },
]

export function ContractorRating() {
  const [contractors, setContractors] = useState<Contractor[]>(MOCK_CONTRACTORS)
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "projects" | "mlScore">("mlScore")
  const [isAiLoading, setIsAiLoading] = useState(true)

  useEffect(() => {
    async function loadPredictions() {
      try {
        const res = await fetch("/api/predict-contractor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contractors: MOCK_CONTRACTORS })
        })
        const data = await res.json()
        if (data.success && data.predictions) {
          // Merge predictions
          const updated = [...MOCK_CONTRACTORS].map(c => {
            const prediction = data.predictions.find((p: any) => p.id === c.id)
            if (prediction) {
              return { ...c, mlMetrics: prediction.mlMetrics }
            }
            return c
          })
          setContractors(updated)
        }
      } catch (e) {
        console.error("Failed to load ML predictions", e)
      } finally {
        setIsAiLoading(false)
      }
    }
    loadPredictions()
  }, [])

  const sortedContractors = [...contractors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "reviews":
        return b.reviews - a.reviews
      case "projects":
        return b.completedProjects - a.completedProjects
      case "mlScore":
        return (b.mlMetrics?.reliabilityScore || 0) - (a.mlMetrics?.reliabilityScore || 0)
      default:
        return 0
    }
  })

  return (
    <Card className="p-6 border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Top Rated Contractors</h3>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border rounded-md px-3 py-1.5 bg-background"
        >
          <option value="mlScore">AI Recommended</option>
          <option value="rating">Highest Rated</option>
          <option value="reviews">Most Reviews</option>
          <option value="projects">Most Projects</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedContractors.map((contractor) => (
          <div key={contractor.id} className="p-4 rounded-lg border bg-background hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={contractor.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {contractor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{contractor.name}</h4>
                  {contractor.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {contractor.specialty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{contractor.rating}</span>
                    <span className="text-sm text-muted-foreground">({contractor.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {contractor.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {contractor.responseTime}
                  </div>
                  <div>{contractor.completedProjects} projects</div>
                </div>

                {/* ML Predictive Analytics Section */}
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-purple-600">
                    <Bot className="w-3.5 h-3.5" />
                    AI PROJECTION ENGINE
                    <span className="text-[10px] text-muted-foreground/50 ml-auto font-mono">Logistic Regression (Sigmoid)</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {isAiLoading ? (
                      <>
                        <Skeleton className="h-14 w-full rounded-md" />
                        <Skeleton className="h-14 w-full rounded-md" />
                        <Skeleton className="h-14 w-full rounded-md" />
                        <Skeleton className="h-14 w-full rounded-md" />
                      </>
                    ) : (
                      <>
                        <div className="bg-muted p-2 rounded-md">
                          <div className="text-muted-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Reliability Score</div>
                          <div className="font-medium flex items-center gap-1">
                            <Activity className="w-3 h-3 text-blue-500" />
                            {contractor.mlMetrics?.reliabilityScore || 0}/100
                          </div>
                        </div>
                        <div className="bg-muted p-2 rounded-md">
                          <div className="text-muted-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Risk Level</div>
                          <div className={`font-medium flex items-center gap-1 ${
                            contractor.mlMetrics?.riskLevel === 'High' ? 'text-red-600' :
                            contractor.mlMetrics?.riskLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {contractor.mlMetrics?.riskLevel || "Unknown"}
                          </div>
                        </div>
                        <div className="bg-muted p-2 rounded-md">
                          <div className="text-muted-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">On-Budget Prob.</div>
                          <div className="font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            {contractor.mlMetrics?.onBudgetProbability || 0}%
                          </div>
                        </div>
                        <div className="bg-muted p-2 rounded-md">
                          <div className="text-muted-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">Pred. Delay</div>
                          <div className="font-medium flex items-center gap-1 text-slate-700">
                            <RefreshCcw className="w-3 h-3 text-orange-500" />
                            {contractor.mlMetrics?.predictedDelay || "Unknown"}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>

              <div className="text-right flex flex-col items-end gap-2 ml-4 self-center md:self-start">
                <div className="font-semibold text-primary mb-2">{contractor.hourlyRate}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4 bg-transparent">
        View All Contractors
      </Button>
    </Card>
  )
}
