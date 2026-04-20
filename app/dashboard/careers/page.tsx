"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { apiGet } from "@/lib/backend"
import { useToast } from "@/hooks/use-toast"
import { generateApprovalLetter } from "@/lib/career-pdf-generator"
import {
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  TrendingUp,
  MapPin,
  ArrowLeft,
} from "lucide-react"

export default function RecruitmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const [jobsData, setJobsData] = useState<any>(null)
  const [appsData, setAppsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [jobs, apps] = await Promise.all([apiGet("/careers/jobs"), apiGet("/careers/applications")])
        setJobsData(jobs)
        setAppsData(apps)
      } catch (error) {
        console.error("Failed to fetch career data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const roles = ["All", "Architect", "Engineer", "Electrician", "Plumber", "Interior Designer", "Project Manager"]

  const jobPostings = Array.isArray(jobsData)
    ? jobsData
    : [
        // fallback minimal seed if backend not ready
        {
          id: 1,
          title: "Senior Structural Engineer",
          project: "Modern Villa",
          location: "Mumbai, MH",
          type: "Full-time",
          salary: "₹85,000 - ₹120,000 / month",
          applicants: 12,
          status: "active",
          matchScore: 95,
          postedDate: "2024-01-15",
          requirements: ["10+ years experience", "PE License", "Steel & Concrete expertise"],
        },
      ]

  const applications = Array.isArray(appsData)
    ? appsData
    : [
        // fallback minimal seed if backend not ready
        {
          id: 1,
          candidateName: "Michael Chen",
          role: "Senior Structural Engineer",
          project: "Modern Villa",
          experience: "12 years",
          matchScore: 95,
          status: "pending",
          appliedDate: "2024-01-16",
          email: "venkatbodduluri78@gmail.com",
          phone: "+91 90323 06961",
          resume: "resume.pdf",
          skills: ["Structural Analysis"],
        },
      ]

  const stats = [
    { label: "Active Jobs", value: "4", icon: Briefcase, color: "text-primary" },
    { label: "Total Applicants", value: "40", icon: Users, color: "text-blue-600" },
    { label: "Pending Review", value: "2", icon: Clock, color: "text-amber-600" },
    { label: "Hired", value: "1", icon: CheckCircle, color: "text-green-600" },
  ]

  const filteredJobs = jobPostings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.project.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !selectedRole || selectedRole === "All" || job.title.includes(selectedRole)
    return matchesSearch && matchesRole
  })

  function downloadLetter(app: any, action: "approved" | "rejected") {
    generateApprovalLetter(app, action).catch((error) => {
      console.error("Failed to generate PDF:", error)
      alert("Failed to generate PDF letter. Please try again.")
    })
  }

  const generateApprovedDesignsPDF = () => {
    // Placeholder for dynamic PDF generation logic
    // This function will be updated in the future
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
                <h1 className="text-2xl font-bold mb-1">Careers Center</h1>
                <p className="text-muted-foreground">Manage job postings and candidate applications</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={generateApprovedDesignsPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Approved Designs
                </Button>
                <Link href="/dashboard/careers/apply">
                  <Button className="bg-accent hover:bg-accent-dark text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Apply for Job
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="jobs" className="w-full">
            <TabsList>
              <TabsTrigger value="jobs">Job Postings</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="mt-6">
              {/* Search and Filters */}
              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs by title or project..."
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

                {/* Role Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {roles.map((role) => (
                    <Button
                      key={role}
                      variant={selectedRole === role || (role === "All" && !selectedRole) ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRole(role === "All" ? null : role)}
                      className={
                        selectedRole === role || (role === "All" && !selectedRole) ? "bg-primary text-white" : ""
                      }
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Job Listings */}
              <div className="grid md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="p-6 border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">Project: {job.project}</p>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {job.matchScore}% Match
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Posted {job.postedDate}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Requirements:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{job.applicants} applicants</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent"
                          onClick={() =>
                            router.push(
                              `/dashboard/careers/apply?role=${encodeURIComponent(job.title)}&project=${encodeURIComponent(job.project)}`,
                            )
                          }
                        >
                          Apply
                        </Button>
                        <Link href={`/dashboard/careers/jobs/${job.id}`}>
                          <Button size="sm" className="bg-accent hover:bg-accent-dark text-white">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <div className="space-y-4">
                {applications.map((app) => (
                  <Card key={app.id} className="p-6 border-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {app.candidateName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{app.candidateName}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {app.role} • {app.project}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{app.experience} experience</span>
                            <span>•</span>
                            <span>Applied {app.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`flex items-center gap-1 ${
                            app.matchScore >= 90
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                              : app.matchScore >= 80
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100"
                          }`}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {app.matchScore}% Match
                        </Badge>
                        <Badge
                          variant={
                            app.status === "approved"
                              ? "default"
                              : app.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {app.status === "approved" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : app.status === "rejected" ? (
                            <XCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {app.skills.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{app.email}</span>
                      <span>•</span>
                      <span>{app.phone}</span>
                    </div>

                    {app.status === "pending" && (
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Button
                          size="sm"
                          className="flex-1 bg-primary hover:bg-primary/90 text-white"
                          onClick={() => {
                            downloadLetter(app, "approved")
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => downloadLetter(app, "rejected")}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
              {/* Bottom Send Resume CTA */}
              <div className="mt-8 text-center">
                <Button
                  onClick={() => router.push("/dashboard/careers/apply")}
                  size="lg"
                  className="bg-accent text-white"
                >
                  Send Your Resume
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
