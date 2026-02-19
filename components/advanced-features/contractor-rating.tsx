"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, CheckCircle2, MessageSquare, Phone } from "lucide-react"

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
  },
]

export function ContractorRating() {
  const [contractors] = useState<Contractor[]>(MOCK_CONTRACTORS)
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "projects">("rating")

  const sortedContractors = [...contractors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "reviews":
        return b.reviews - a.reviews
      case "projects":
        return b.completedProjects - a.completedProjects
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
              </div>

              <div className="text-right">
                <div className="font-semibold text-primary mb-2">{contractor.hourlyRate}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm">Hire</Button>
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
