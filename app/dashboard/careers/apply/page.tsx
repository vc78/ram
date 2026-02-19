"use client"

import type React from "react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload, Briefcase, Loader2, FileText, CheckCircle } from "lucide-react"
import { apiPost } from "@/lib/backend"
import { parseResume, calculateTotalExperience, formatSkills } from "@/lib/resume-parser"

export default function ApplyJobPage() {
  const router = useRouter()
  const qs = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [resumeName, setResumeName] = useState("")
  const [parseSuccess, setParseSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    role: qs.get("role") || "",
    project: qs.get("project") || "",
    skills: "",
    portfolio: "",
    coverLetter: "",
    resume: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const data = await apiPost<{ matchScore?: number }>("/careers/applications", formData)
      alert(`Application submitted! Match Score: ${data?.matchScore ?? "—"}%`)
      router.push("/dashboard/careers")
    } catch (e) {
      alert("Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setResumeName(file.name)
    setIsParsing(true)
    setParseSuccess(false)

    try {
      // Parse the resume
      const parsed = await parseResume(file)

      // Auto-fill form fields with extracted data
      setFormData((prev) => ({
        ...prev,
        fullName: parsed.name || prev.fullName,
        email: parsed.email || prev.email,
        phone: parsed.phone || prev.phone,
        experience: calculateTotalExperience(parsed.experience) || prev.experience,
        skills: formatSkills(parsed.skills) || prev.skills,
        resume: file.name,
      }))

      setParseSuccess(true)

      // Show success message
      setTimeout(() => setParseSuccess(false), 5000)
    } catch (error) {
      console.error("Resume parsing error:", error)
      // Still allow manual entry if parsing fails
      setFormData((prev) => ({ ...prev, resume: file.name }))
    } finally {
      setIsParsing(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/dashboard/careers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Apply for Position</h1>
            <p className="text-muted-foreground">Upload your resume to auto-fill the form, or enter details manually</p>
          </div>

          <Card className="p-8 border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume/CV * (PDF or DOC/DOCX)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors relative">
                  <input
                    id="resume"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={isParsing || isSubmitting}
                  />
                  {isParsing ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground">Parsing resume...</p>
                      <p className="text-xs text-muted-foreground mt-1">Extracting your information</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        {resumeName ? (
                          <span className="flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" />
                            {resumeName}
                          </span>
                        ) : (
                          "Click to upload or drag and drop"
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX (max 5MB) - We'll auto-fill your details
                      </p>
                    </>
                  )}
                </div>
                {parseSuccess && (
                  <Alert className="bg-green-50 border-green-200 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Resume parsed successfully! Your details have been auto-filled below. Please review and edit as
                      needed.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    name="experience"
                    placeholder="e.g., 5 years"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Desired Role *</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="e.g., Senior Structural Engineer"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input
                  id="project"
                  name="project"
                  placeholder="e.g., Project X"
                  value={formData.project}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills & Certifications *</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  placeholder="List your key skills, certifications, and licenses (comma-separated)"
                  value={formData.skills}
                  onChange={handleChange}
                  rows={3}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/LinkedIn URL</Label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  placeholder="https://linkedin.com/in/johndoe"
                  value={formData.portfolio}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter *</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  placeholder="Tell us why you're a great fit for this role..."
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows={6}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" className="bg-accent hover:bg-accent-dark text-white" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const wa = encodeURIComponent(
                      `Resume submission:\nName: ${formData.fullName}\nRole: ${formData.role}\nProject: ${formData.project}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nResume: ${resumeName || formData.resume || "(not attached)"}`,
                    )
                    window.open(`https://wa.me/9032306961?text=${wa}`, "_blank")
                  }}
                  disabled={isSubmitting}
                >
                  Send Your Resume (WhatsApp)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/careers")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
