"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Home,
  Building2,
  Users,
  Zap,
  CheckCircle2,
  Sparkles,
  X,
  Star,
  Award,
  Shield,
  TrendingUp,
  ChevronDown,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import VantaBackground from "@/components/vanta-background"
import HomeAssistant from "@/components/home-assistant"
import MediaFallbackInjector from "@/components/media-fallback-injector"

import KpiCounters from "@/components/kpi-counters"
import VideoCarousel from "@/components/video-carousel"
import ProgressAnalytics from "@/components/progress-analytics"

import BudgetEstimator from "@/components/budget-estimator"
import InsightsSearch from "@/components/insights-search"
import TestimonialsCarousel from "@/components/testimonials-carousel"
import LiveTicker from "@/components/live-ticker"
import { LanguageSelector } from "@/components/language-selector"

export default function LandingPage() {
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string
    description: string
    videoSrc: string
    poster: string
  } | null>(null)

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const videos = [
    {
      title: "Platform Overview",
      description: "Complete walkthrough of SIID features and capabilities",
      thumbnail: "/modern-architectural-design-software-dashboard-int.jpg",
      videoSrc: "https://cdn.pixabay.com/video/2022/11/07/138448-768947568_large.mp4",
      poster: "/modern-architectural-design-software-dashboard-int.jpg",
    },
    {
      title: "AI Design Generation",
      description: "Watch AI create architectural plans in seconds",
      thumbnail: "/ai-generating-architectural-floor-plans-and-3d-bui.jpg",
      videoSrc: "https://cdn.pixabay.com/video/2023/05/02/160690-822906092_large.mp4",
      poster: "/ai-generating-architectural-floor-plans-and-3d-bui.jpg",
    },
    {
      title: "Contractor Connection",
      description: "Connect with verified contractors seamlessly",
      thumbnail: "/contractor-marketplace-with-verified-construction-.jpg",
      videoSrc: "https://cdn.pixabay.com/video/2022/08/01/126095-735766893_large.mp4",
      poster: "/contractor-marketplace-with-verified-construction-.jpg",
    },
    {
      title: "Project Management",
      description: "Track your project from design to completion",
      thumbnail: "/project-management-dashboard-with-timeline-and-tas.jpg",
      videoSrc: "https://cdn.pixabay.com/video/2021/08/04/84353-583944595_large.mp4",
      poster: "/project-management-dashboard-with-timeline-and-tas.jpg",
    },
  ]
  const videosUI = [
    {
      id: 1,
      title: "Platform Overview",
      description: "Complete walkthrough of SIID features and capabilities",
      thumbnail: "/modern-architectural-design-software-dashboard-int.jpg",
      duration: "3:45",
      poster: "/modern-architectural-design-software-dashboard-int.jpg",
      videoUrl: "#",
    },
    {
      id: 2,
      title: "AI Design Generation",
      description: "Watch AI create architectural plans in seconds",
      thumbnail: "/ai-generating-architectural-floor-plans.jpg",
      duration: "2:30",
      poster: "/ai-generating-architectural-floor-plans.jpg",
      videoUrl: "#",
    },
    {
      id: 3,
      title: "Contractor Connection",
      description: "How to find and connect with verified professionals",
      thumbnail: "/contractor-marketplace-professionals.jpg",
      duration: "4:12",
      poster: "/contractor-marketplace-professionals.jpg",
      videoUrl: "#",
    },
    {
      id: 4,
      title: "Project Management",
      description: "Track progress, manage tasks, and collaborate",
      thumbnail: "/project-management-dashboard-timeline.jpg",
      duration: "5:20",
      poster: "/project-management-dashboard-timeline.jpg",
      videoUrl: "#",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <MediaFallbackInjector />
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/siid-flash-logo.png"
              alt="SIID FLASH Logo"
              className="h-14 w-auto object-contain"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement
                if (!img.dataset.fallbackShown) {
                  img.dataset.fallbackShown = "true"
                  img.style.display = "none"
                  const fallback = document.createElement("span")
                  fallback.className = "text-2xl font-bold"
                  fallback.textContent = "SIID FLASH"
                  img.parentElement?.appendChild(fallback)
                }
              }}
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#vision" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Vision
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/3d-generator"
              className="text-sm text-accent hover:text-accent-dark transition-colors font-semibold"
            >
              3D Generator
            </Link>
            {/* </CHANGE> */}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-accent hover:bg-accent-dark text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 py-4 px-4 space-y-3">
            <Link
              href="#features"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#vision"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vision
            </Link>
            <Link
              href="#how-it-works"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/3d-generator"
              className="block text-sm text-accent hover:text-accent-dark transition-colors font-semibold py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              3D Generator
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Vanta background sits behind content */}
        <VantaBackground
          effect="waves"
          color={0x1e3a8a} // deep blue matching brand
          backgroundAlpha={0.0}
          minHeight={420}
          className="absolute inset-0"
        />
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Your Dream, Our Design
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Turn Your Dreams Into Reality</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed max-w-prose">
                We believe every dream deserves a shape, and every idea deserves a plan. Transform imagination into
                reality—fast, simple, and personalized.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent-dark text-white hover:scale-105 transition-transform"
                  >
                    Start Your Project
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="bg-transparent hover:scale-105 transition-transform">
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="glass-effect elevation-lg p-6 md:p-8 border border-border/70 bg-background/70 animate-scale-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg p-4 outline-primary bg-background/60">
                  <div className="text-2xl font-bold text-primary mb-1">500+</div>
                  <div className="text-xs text-muted-foreground">Projects Completed</div>
                </div>
                <div className="rounded-lg p-4 outline-accent bg-background/60">
                  <div className="text-2xl font-bold text-accent mb-1">200+</div>
                  <div className="text-xs text-muted-foreground">Verified Contractors</div>
                </div>
                <div className="rounded-lg p-4 outline-primary bg-background/60">
                  <div className="text-2xl font-bold text-primary mb-1">98%</div>
                  <div className="text-xs text-muted-foreground">Satisfaction Rate</div>
                </div>
                <div className="rounded-lg p-4 outline-accent bg-background/60">
                  <div className="text-2xl font-bold text-accent mb-1">AI</div>
                  <div className="text-xs text-muted-foreground">Design Generation</div>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild className="w-full">
                  <Link href="#features">
                    Explore Features
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ================================================================================== */}
      {/* ======================= UNMATCHED PLOT FLEXIBILITY ======================== */}
      {/* ================================================================================== */}

      <section className="py-16 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <KpiCounters />
        </div>
      </section>

      {/* Video Carousel Section */}
      {/* insert a featured video carousel after KPI counters */}
      <section className="py-16 bg-background border-y border-border">
        <div className="container mx-auto px-4">
          <VideoCarousel />
        </div>
      </section>
      {/* ... existing code ... */}

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See SIID in Action</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch how our platform transforms ideas into reality
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {videosUI.map((video, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden group hover-lift cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative">
                    <img
                      src={video.thumbnail || "/images/modern-minimalist-design.jpg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement
                        if (img.src.includes("/images/modern-minimalist-design.jpg")) return
                        img.onerror = null
                        img.src = "/images/modern-minimalist-design.jpg"
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium">Watch Demo</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Section */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-background rounded-lg max-w-5xl w-full overflow-hidden animate-scale-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
              <div>
                <h3 className="text-2xl font-bold">{selectedVideo.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedVideo.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedVideo(null)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="aspect-video bg-black">
              <video
                src={selectedVideo.videoSrc}
                poster={selectedVideo.poster}
                controls
                autoPlay
                className="w-full h-full"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 bg-muted/50 text-center text-sm text-muted-foreground">
              Click outside or press ESC to close
            </div>
          </div>
        </div>
      )}

      {/* Previous Projects Examples Section */}
      {/* Our Previous Projects - Construction Route Map */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Previous Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore comprehensive designs from architectural plans to final execution
            </p>
          </div>

          <div className="space-y-16">
            {/* Modern Luxury Villa */}
            <div>
              <h3 className="text-2xl font-bold mb-2">Modern Luxury Villa</h3>
              <p className="text-muted-foreground mb-8">Complete residential design with visual layout integration</p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/images/architectural-floor-plan-blueprint.jpg"
                      alt="Architectural Plan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Architectural Plan</h4>
                    <p className="text-sm text-muted-foreground">Detailed floor layout with dimensions</p>
                  </div>
                </Card>

                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/images/interior-design-3d-walkthrough.jpg"
                      alt="Virtual Layout"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Virtual Layout</h4>
                    <p className="text-sm text-muted-foreground">Interactive 3D model visualization</p>
                  </div>
                </Card>

                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/images/structural-engineering-simulation-3d.jpg"
                      alt="Structural Diagram"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Structural Diagram</h4>
                    <p className="text-sm text-muted-foreground">Load-bearing elements and foundation details</p>
                  </div>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/images/building-foundation-concrete-construction.jpg"
                      alt="Plumbing Layout"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Plumbing Layout</h4>
                    <p className="text-sm text-muted-foreground">Water supply and drainage system</p>
                  </div>
                </Card>

                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/images/interior-design-3d-walkthrough.jpg"
                      alt="Interior Design"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Interior Design</h4>
                    <p className="text-sm text-muted-foreground">Modern luxury interior styling</p>
                  </div>
                </Card>

                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/images/modern-villa-project.jpg"
                      alt="Exterior Design"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Exterior Design</h4>
                    <p className="text-sm text-muted-foreground">Contemporary facade with landscaping</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Corporate Office Complex */}
            <div>
              <h3 className="text-2xl font-bold mb-2">Corporate Office Complex</h3>
              <p className="text-muted-foreground mb-8">Multi-floor commercial building with modern amenities</p>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/images/architectural-floor-plan-blueprint.jpg"
                      alt="Architectural Plan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Architectural Plan</h4>
                    <p className="text-sm text-muted-foreground">Open workspace layout design</p>
                  </div>
                </Card>

                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/images/structural-engineering-simulation-3d.jpg"
                      alt="Structural Design"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Structural Design</h4>
                    <p className="text-sm text-muted-foreground">Steel frame and concrete structure</p>
                  </div>
                </Card>

                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/images/electrical-plumbing-hvac-installation.jpg"
                      alt="Electrical System"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Electrical System</h4>
                    <p className="text-sm text-muted-foreground">Three-phase power distribution</p>
                  </div>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/images/building-foundation-concrete-construction.jpg"
                      alt="Plumbing System"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Plumbing System</h4>
                    <p className="text-sm text-muted-foreground">Fire sprinklers and water supply</p>
                  </div>
                </Card>

                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/placeholder.svg?height=300&width=500"
                      alt="Interior Design"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Interior Design</h4>
                    <p className="text-sm text-muted-foreground">Modern office workspace design</p>
                  </div>
                </Card>

                <Card className="overflow-hidden hover-lift">
                  <div className="aspect-video relative bg-muted">
                    <img
                      src="/placeholder.svg?height=300&width=500"
                      alt="Exterior Design"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">Exterior Design</h4>
                    <p className="text-sm text-muted-foreground">High-end office building aesthetics</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* add progress analytics section before the Features or Vision section for more dynamics */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <ProgressAnalytics />
        </div>
      </section>
      {/* ... existing code ... */}

      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <BudgetEstimator />

            <InsightsSearch />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-8">
            <LiveTicker />
          </div>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SIID?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From concept to completion, we provide everything you need to bring your vision to life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 border-border hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Design Tools</h3>
              <p className="text-muted-foreground leading-relaxed">
                Intuitive design interface that transforms your ideas into detailed plans with AI-powered suggestions
              </p>
            </Card>

            <Card className="p-6 border-border hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Direct Connections</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect directly with verified contractors and suppliers—no middlemen, no delays, just results
              </p>
            </Card>

            <Card className="p-6 border-border hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Flow</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track every step from design to execution with real-time updates and transparent communication
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-muted-foreground">Certified and recognized for excellence</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 flex flex-col items-center justify-center text-center hover-lift">
              <Award className="w-12 h-12 text-primary mb-3" />
              <h4 className="font-semibold mb-1">ISO Certified</h4>
              <p className="text-xs text-muted-foreground">Quality Management</p>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center text-center hover-lift">
              <Shield className="w-12 h-12 text-primary mb-3" />
              <h4 className="font-semibold mb-1">Verified Partners</h4>
              <p className="text-xs text-muted-foreground">Trusted Contractors</p>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center text-center hover-lift">
              <TrendingUp className="w-12 h-12 text-primary mb-3" />
              <h4 className="font-semibold mb-1">Industry Leader</h4>
              <p className="text-xs text-muted-foreground">Design Innovation</p>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center text-center hover-lift">
              <Star className="w-12 h-12 text-primary mb-3" />
              <h4 className="font-semibold mb-1">5-Star Rated</h4>
              <p className="text-xs text-muted-foreground">Customer Reviews</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Future of Design</h2>
              <p className="text-lg text-muted-foreground">Building not just homes, but smarter societies</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 border-border bg-background">
                <Building2 className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Beyond Individual Homes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Extending to apartments, offices, and entire smart cities—designing whole communities with
                  intelligence and ease
                </p>
              </Card>

              <Card className="p-6 border-border bg-background">
                <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Transparent Collaboration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Direct integration with local contractors and suppliers for efficient, transparent project execution
                </p>
              </Card>

              <Card className="p-6 border-border bg-background md:col-span-2">
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Complete Information Flow</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Everything at your fingertips—from initial design to final execution. Making construction faster,
                  clearer, and more reliable than ever before
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to turn your dream into reality</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Design Your Space</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use our intuitive tools to create your dream design with AI assistance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Collaborate</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get matched with verified contractors and suppliers for your project
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Build Your Future</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track progress and watch your dream become reality
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground">
              Real stories from real people who built their dreams with SIID
            </p>
          </div>

          <TestimonialsCarousel />
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about SIID</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How does SIID's AI design generation work?",
                answer:
                  "Our AI analyzes your project requirements including size, budget, style preferences, and location to generate comprehensive architectural, structural, electrical, plumbing, interior, and exterior designs. The AI uses market data and best practices to create optimized designs tailored to your needs.",
              },
              {
                question: "What is included in the budget estimation?",
                answer:
                  "Our budget estimation includes material costs, labor charges, contractor fees, permits, and contingency funds. We categorize projects into Moderate, Intermediate, or Premium stages based on your requirements and provide detailed breakdowns for each component.",
              },
              {
                question: "How do I connect with contractors?",
                answer:
                  "Once your design is ready, you can browse our marketplace of verified contractors. Each contractor profile includes ratings, reviews, portfolio, and pricing. You can directly message contractors, schedule consultations, and hire them through the platform.",
              },
              {
                question: "Can I modify the AI-generated designs?",
                answer:
                  "All AI-generated designs are fully customizable. You can adjust dimensions, change materials, modify layouts, and tweak any aspect of the design using our intuitive editor. The AI suggestions serve as a starting point that you can refine to match your exact vision.",
              },
              {
                question: "Is my project data secure?",
                answer:
                  "Yes, we take security seriously. All project data is encrypted and stored securely. We never share your information with third parties without your consent. Contractors only see the information you choose to share with them.",
              },
              {
                question: "What types of projects does SIID support?",
                answer:
                  "SIID supports residential projects (homes, villas, apartments), commercial projects (offices, retail spaces), and we're expanding to smart cities and large-scale developments. Whether you're building a single room or an entire complex, SIID can help.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="overflow-hidden cursor-pointer hover-lift"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""
                        }`}
                    />
                  </div>
                  {openFaq === index && (
                    <p className="text-muted-foreground mt-4 leading-relaxed animate-slide-up">{faq.answer}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">Ready to Start Building?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto animate-slide-up">
            Alone, a dream is just a wish. But together, with our design, it becomes a future you can live in.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent-dark text-white hover:scale-105 transition-transform animate-scale-in"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">SIID</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your Dream, Our Design. Transforming imagination into reality with AI-powered design tools and seamless
                contractor connections.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-background rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.382-2.126C21.319 1.347 20.651.935 19.86.63c-.766-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.071 1.646.071 4.85s-.015 3.585-.072 4.85c-.061 1.17-.256 1.805-.421 2.227-.569.217-.96.477-1.382.896-.419.42-.824.679-1.38.9-.42.164-1.065.36-2.235.413-1.274.057-1.65-.06-4.859.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#vision" className="hover:text-foreground transition-colors">
                    Vision
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/3d-generator" className="hover:text-foreground transition-colors">
                    3D Model Generator
                  </Link>
                </li>
                {/* </CHANGE> */}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © 2025 SIID. All rights reserved. Built with passion in India.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/sitemap" className="hover:text-foreground transition-colors">
                Sitemap
              </Link>
              <span>•</span>
              <Link href="/accessibility" className="hover:text-foreground transition-colors">
                Accessibility
              </Link>
              <span>•</span>
              <Link href="/cookies" className="hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <HomeAssistant />
    </div>
  )
}
