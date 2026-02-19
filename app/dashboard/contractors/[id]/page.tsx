"use client"

import { useState } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ContactDialog } from "@/components/contact-dialog"
import {
  ArrowLeft,
  Star,
  MapPin,
  Briefcase,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Award,
  Users,
  TrendingUp,
  Share2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContractorProfilePage() {
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [consultationDialogOpen, setConsultationDialogOpen] = useState(false)
  const [reviewText, setReviewText] = useState("")
  const { toast } = useToast()

  // Mock contractor data
  const contractor = {
    id: 1,
    name: "BuildPro Construction",
    category: "Construction",
    rating: 4.9,
    reviews: 127,
    location: "New York, NY",
    verified: true,
    projects: 89,
    description:
      "BuildPro Construction is a leading construction company with over 15 years of experience in residential and commercial projects. We pride ourselves on delivering high-quality work on time and within budget.",
    hourlyRate: "₹85-120/hour",
    image: "/construction-company-logo.jpg",
    skills: ["Residential", "Commercial", "Renovation", "Project Management", "Green Building"],
    experience: "15+ years",
    teamSize: "25-50 employees",
    responseTime: "Within 2 hours",
    completionRate: "98%",
  }

  const reviews = [
    {
      id: 1,
      author: "John Smith",
      rating: 5,
      date: "2 weeks ago",
      project: "Modern Villa Construction",
      comment:
        "Excellent work! BuildPro completed our villa project ahead of schedule and the quality exceeded our expectations. Highly professional team.",
    },
    {
      id: 2,
      author: "Sarah Johnson",
      rating: 5,
      date: "1 month ago",
      project: "Office Renovation",
      comment:
        "Very impressed with their attention to detail and communication throughout the project. Would definitely hire again.",
    },
    {
      id: 3,
      author: "Michael Chen",
      rating: 4,
      date: "2 months ago",
      project: "Residential Addition",
      comment: "Great experience overall. Minor delays due to weather but they kept us informed every step of the way.",
    },
  ]

  const portfolio = [
    {
      id: 1,
      title: "Luxury Villa",
      image: "/modern-luxury-villa.jpg",
      category: "Residential",
    },
    {
      id: 2,
      title: "Corporate Office",
      image: "/modern-office-building.jpg",
      category: "Commercial",
    },
    {
      id: 3,
      title: "Home Renovation",
      image: "/renovated-home-interior.jpg",
      category: "Renovation",
    },
  ]

  const handleSendMessage = () => {
    console.log("[v0] Sending message:", messageDialogOpen)
    // TODO: Implement message sending
    setMessageDialogOpen(false)
  }

  const handleShareProfile = async () => {
    const url = window.location.href
    const shareData = {
      title: contractor.name,
      text: `Check out ${contractor.name} on SIID - ${contractor.category} contractor with ${contractor.rating} rating`,
      url: url,
    }

    try {
      // Try to use native share API if available
      if (navigator.share) {
        await navigator.share(shareData)
        toast({
          title: "Profile shared",
          description: "The contractor profile has been shared successfully.",
        })
      } else {
        // Fallback to copying URL to clipboard
        try {
          await navigator.clipboard.writeText(url)
          toast({
            title: "Link copied",
            description: "Profile link has been copied to your clipboard.",
          })
        } catch (clipboardError) {
          // Fallback for clipboard API
          const textarea = document.createElement("textarea")
          textarea.value = url
          textarea.style.position = "fixed"
          textarea.style.left = "-9999px"
          document.body.appendChild(textarea)
          textarea.select()
          try {
            document.execCommand("copy")
            toast({
              title: "Link copied",
              description: "Profile link has been copied to your clipboard.",
            })
          } catch {
            toast({
              title: "Copy failed",
              description: "Could not copy link. Please try again.",
              variant: "destructive",
            })
          }
          document.body.removeChild(textarea)
        }
      }
    } catch (error) {
      // User cancelled share or clipboard failed
      if (error instanceof Error && error.name !== "AbortError") {
        toast({
          title: "Failed to share",
          description: "Could not share the profile. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSubmitReview = () => {
    const txt = reviewText || ""
    const store = JSON.parse(localStorage.getItem("contractorReviews") || "[]")
    store.unshift({ id: crypto.randomUUID(), contractorId: contractor.id, text: txt, at: Date.now() })
    localStorage.setItem("contractorReviews", JSON.stringify(store))
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    })
    setReviewText("")
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/dashboard/contractors"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Contractors
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Header */}
              <Card className="p-6 border-border">
                <div className="flex gap-6 mb-6">
                  <img
                    src={contractor.image || "/images/default-contractor-logo.jpg"}
                    alt={contractor.name}
                    className="w-32 h-32 rounded-lg object-cover border border-border"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement
                      if (img.src.endsWith("/images/default-contractor-logo.jpg")) return
                      img.onerror = null
                      img.src = "/images/default-contractor-logo.jpg"
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h1 className="text-3xl font-bold">{contractor.name}</h1>
                          {contractor.verified && (
                            <CheckCircle2 className="w-6 h-6 text-primary" title="Verified Contractor" />
                          )}
                        </div>
                        <Badge variant="secondary" className="mb-3">
                          {contractor.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-lg">{contractor.rating}</span>
                        <span className="text-muted-foreground">({contractor.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        <span>{contractor.projects} projects completed</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{contractor.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">{contractor.description}</p>

                <div className="flex flex-wrap gap-2">
                  {contractor.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Experience</span>
                  </div>
                  <p className="text-xl font-bold">{contractor.experience}</p>
                </Card>

                <Card className="p-4 border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Team Size</span>
                  </div>
                  <p className="text-xl font-bold">{contractor.teamSize}</p>
                </Card>

                <Card className="p-4 border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Response</span>
                  </div>
                  <p className="text-xl font-bold">{contractor.responseTime}</p>
                </Card>

                <Card className="p-4 border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Completion</span>
                  </div>
                  <p className="text-xl font-bold">{contractor.completionRate}</p>
                </Card>
              </div>

              {/* Portfolio */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {portfolio.map((project) => (
                    <Card key={project.id} className="overflow-hidden border-border hover:shadow-lg transition-shadow">
                      <img
                        src={project.image || "/images/modern-minimalist-design.jpg"}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement
                          if (img.src.endsWith("/images/modern-minimalist-design.jpg")) return
                          img.onerror = null
                          img.src = "/images/modern-minimalist-design.jpg"
                        }}
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Client Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-6 border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold mb-1">{review.author}</p>
                          <p className="text-sm text-muted-foreground">{review.project}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-2">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.at).toLocaleDateString()}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="p-6 border-border sticky top-24">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Hourly Rate</span>
                    <span className="text-2xl font-bold">{contractor.hourlyRate}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Send a Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your project and requirements..."
                      value={messageDialogOpen}
                      onChange={(e) => setMessageDialogOpen(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button
                    className="w-full bg-accent hover:bg-accent-dark text-white"
                    onClick={() => setMessageDialogOpen(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setConsultationDialogOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Consultation
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent" onClick={handleShareProfile}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4" />
                    <span>Verified & Insured</span>
                  </div>
                </div>

                {/* Write a Review */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold mb-2">Write a Review</h4>
                  <Textarea
                    rows={3}
                    placeholder="Share your experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <Button className="w-full mt-2" onClick={handleSubmitReview}>
                    Submit Review
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <ContactDialog
          open={messageDialogOpen}
          onOpenChange={setMessageDialogOpen}
          type="message"
          contractorId={contractor.id}
          contractorName={contractor.name}
        />

        <ContactDialog
          open={consultationDialogOpen}
          onOpenChange={setConsultationDialogOpen}
          type="consultation"
          contractorId={contractor.id}
          contractorName={contractor.name}
        />
      </div>
    </AuthGuard>
  )
}
