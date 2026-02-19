"use client"

import { useState } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ContactDialog } from "@/components/contact-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Search, Star, MapPin, Briefcase, CheckCircle2, MessageSquare, Filter } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"

export default function ContractorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [selectedContractor, setSelectedContractor] = useState<{ id: number; name: string } | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewFor, setReviewFor] = useState<{ id: number; name: string } | null>(null)
  const [reviewText, setReviewText] = useState("")
  const { toast } = useToast()

  const categories = ["All", "Architecture", "Construction", "Interior Design", "Electrical", "Plumbing", "Landscaping"]

  const contractors = [
    {
      id: 1,
      name: "BuildPro Construction",
      category: "Construction",
      rating: 4.9,
      reviews: 127,
      location: "New York, NY",
      verified: true,
      projects: 89,
      description: "Specialized in residential and commercial construction with 15+ years of experience",
      hourlyRate: "₹7,000-10,000",
      image: "/images/contractor-buildpro-logo.jpg",
      skills: ["Residential", "Commercial", "Renovation"],
    },
    {
      id: 2,
      name: "Modern Architects Co.",
      category: "Architecture",
      rating: 4.8,
      reviews: 94,
      location: "Los Angeles, CA",
      verified: true,
      projects: 156,
      description: "Award-winning architectural firm focusing on sustainable and modern designs",
      hourlyRate: "₹8,000-12,000",
      image: "/images/contractor-modern-architects-logo.jpg",
      skills: ["Modern Design", "Sustainable", "Commercial"],
    },
    {
      id: 3,
      name: "Elite Interiors",
      category: "Interior Design",
      rating: 5.0,
      reviews: 203,
      location: "Miami, FL",
      verified: true,
      projects: 234,
      description: "Premium interior design services for luxury homes and commercial spaces",
      hourlyRate: "₹6,000-9,000",
      image: "/images/contractor-elite-interiors-logo.jpg",
      skills: ["Luxury", "Residential", "Color Consultation"],
    },
    {
      id: 4,
      name: "PowerLine Electrical",
      category: "Electrical",
      rating: 4.7,
      reviews: 156,
      location: "Chicago, IL",
      verified: true,
      projects: 312,
      description: "Licensed electricians providing residential and commercial electrical services",
      hourlyRate: "₹5,000-7,500",
      image: "/images/contractor-powerline-logo.jpg",
      skills: ["Wiring", "Smart Home", "Commercial"],
    },
    {
      id: 5,
      name: "GreenScape Landscaping",
      category: "Landscaping",
      rating: 4.9,
      reviews: 178,
      location: "Austin, TX",
      verified: true,
      projects: 267,
      description: "Eco-friendly landscaping and outdoor design specialists",
      hourlyRate: "₹4,000-6,500",
      image: "/images/contractor-greenscape-logo.jpg",
      skills: ["Garden Design", "Irrigation", "Hardscaping"],
    },
    {
      id: 6,
      name: "FlowMaster Plumbing",
      category: "Plumbing",
      rating: 4.6,
      reviews: 89,
      location: "Seattle, WA",
      verified: true,
      projects: 198,
      description: "Professional plumbing services for residential and commercial properties",
      hourlyRate: "₹5,500-8,000",
      image: "/images/contractor-flowmaster-logo.jpg",
      skills: ["Installation", "Repair", "Emergency Service"],
    },
  ]

  const filteredContractors = contractors.filter((contractor) => {
    const matchesSearch =
      contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || selectedCategory === "All" || contractor.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactClick = (contractor: { id: number; name: string }) => {
    setSelectedContractor(contractor)
    setContactDialogOpen(true)
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
              <div className="ml-auto">
                <LanguageSelector />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Find Contractors</h1>
                <p className="text-muted-foreground">Connect with verified professionals for your project</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search contractors by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category === "All" ? null : category)}
                  className={
                    selectedCategory === category || (category === "All" && !selectedCategory)
                      ? "bg-primary text-white"
                      : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredContractors.length}</span> contractors
            </p>
          </div>

          {/* Contractors Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredContractors.map((contractor) => (
              <Card key={contractor.id} className="p-6 border-border hover:shadow-lg transition-shadow">
                <div className="flex gap-4 mb-4">
                  <img
                    src={contractor.image || "/images/default-contractor-logo.jpg"}
                    alt={contractor.name}
                    className="w-20 h-20 rounded-lg object-cover border border-border"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement
                      if (img.src.endsWith("/images/default-contractor-logo.jpg")) return
                      img.onerror = null
                      img.src = "/images/default-contractor-logo.jpg"
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{contractor.name}</h3>
                          {contractor.verified && (
                            <CheckCircle2 className="w-5 h-5 text-primary" title="Verified Contractor" />
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {contractor.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-foreground">{contractor.rating}</span>
                        <span>({contractor.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{contractor.projects} projects</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{contractor.description}</p>

                <div className="flex items-center gap-2 mb-4 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{contractor.location}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium">{contractor.hourlyRate}/hr</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {contractor.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/contractors/${contractor.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Profile
                    </Button>
                  </Link>
                  <Button
                    className="flex-1 bg-accent hover:bg-accent-dark text-white"
                    onClick={() => handleContactClick({ id: contractor.id, name: contractor.name })}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  {/* Write Review */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReviewFor({ id: contractor.id, name: contractor.name })
                      setReviewOpen(true)
                    }}
                  >
                    Write Review
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredContractors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No contractors found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Contact Dialog */}
        {selectedContractor && (
          <ContactDialog
            open={contactDialogOpen}
            onOpenChange={setContactDialogOpen}
            type="message"
            contractorId={selectedContractor.id}
            contractorName={selectedContractor.name}
          />
        )}

        {/* Write Review Dialog */}
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write a review {reviewFor ? `for ${reviewFor.name}` : ""}</DialogTitle>
            </DialogHeader>
            <Textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
            />
            <DialogFooter>
              <Button
                onClick={() => {
                  const store = JSON.parse(localStorage.getItem("contractorReviews") || "[]")
                  store.unshift({
                    id: crypto.randomUUID(),
                    contractorId: reviewFor?.id,
                    text: reviewText,
                    at: Date.now(),
                  })
                  localStorage.setItem("contractorReviews", JSON.stringify(store))
                  toast({ title: "Review submitted" })
                  setReviewOpen(false)
                  setReviewText("")
                }}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}
