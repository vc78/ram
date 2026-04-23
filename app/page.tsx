"use client"

import { useState, useEffect } from "react"
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
  Cog,
  BarChart3,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import VantaBackground from "@/components/vanta-background"
import ConstructionAssistant from "@/components/construction-assistant"

import MediaFallbackInjector from "@/components/media-fallback-injector"

import KpiCounters from "@/components/kpi-counters"
import VideoCarousel from "@/components/video-carousel"
import { HeadlineScroller } from "@/components/headline-scroller"
import { CompanyLogoScroller } from "@/components/company-logo-scroller"
import ProgressAnalytics from "@/components/progress-analytics"

import BudgetEstimator from "@/components/budget-estimator"
import InsightsSearch from "@/components/insights-search"
import TestimonialsCarousel from "@/components/testimonials-carousel"
import LiveTicker from "@/components/live-ticker"
import Navbar from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { useWelcomeVoice } from "@/hooks/use-welcome-voice"


export default function LandingPage() {
  useWelcomeVoice()

  const [selectedVideo, setSelectedVideo] = useState<{
    title: string
    description: string
    videoSrc: string
    poster: string
  } | null>(null)

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const heroVideos = [
    "/images/ext1.mp4",
    "/uploads/p1.mp4",
    "/uploads/p2.mp4",
  ]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)

    // Initial check
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) return // Only run carousel on desktop

    // Rotate videos every 6 seconds
    const intervalId = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % heroVideos.length)
    }, 6000)

    return () => clearInterval(intervalId)
  }, [isMobile])

  /*
    const videos = [
      {
        title: "Platform Overview",
        description: "Complete walkthrough of SIID features and capabilities",
        thumbnail: "/modern-architectural-design-software-dashboard-int.jpg",
        videoSrc: "/images/stu.mp4",
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
    */
  const videosUI = [
    {
      id: 1,
      title: "Platform Overview",
      description: "Complete walkthrough of SIID features and capabilities",
      thumbnail: "/modern-architectural-design-software-dashboard-int.jpg",
      duration: "3:45",
      poster: "/modern-architectural-design-software-dashboard-int.jpg",
      videoSrc: "/images/stu.mp4",
    },
    {
      id: 2,
      title: "AI Design Generation",
      description: "Watch AI create architectural plans in seconds",
      thumbnail: "/ai-generating-architectural-floor-plans.jpg",
      duration: "2:30",
      poster: "/ai-generating-architectural-floor-plans.jpg",
      videoSrc: "/images/stu.mp4",
    },
    {
      id: 3,
      title: "Contractor Connection",
      description: "How to find and connect with verified professionals",
      thumbnail: "/contractor-marketplace-professionals.jpg",
      duration: "4:12",
      poster: "/contractor-marketplace-professionals.jpg",
      videoSrc: "/images/iron.mp4",
    },
    {
      id: 4,
      title: "Project Management",
      description: "Track progress, manage tasks, and collaborate",
      thumbnail: "/project-management-dashboard-timeline.jpg",
      duration: "5:20",
      poster: "/project-management-dashboard-timeline.jpg",
      videoSrc: "/images/ext1.mp4",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <MediaFallbackInjector />

      {/* Extracted modular Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center overflow-hidden py-32">
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!isMobile ? (
            <video
              key={heroVideos[currentVideoIndex]}
              src={heroVideos[currentVideoIndex]}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
          ) : (
            <img
              src="/images/interior-design-3d-walkthrough.jpg"
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
          )}
          {/* Dark Overlay (IMPORTANT) */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Vanta background sits behind content - Made optional to prevent blocking video */}
        {false && (
          <VantaBackground
            effect="waves"
            color={0x1e3a8a} // deep blue matching brand
            backgroundAlpha={0.1} // Reduced visibility
            minHeight={420}
            className="absolute inset-0 pointer-events-none"
          />
        )}
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md text-sm font-medium mb-6 drop-shadow-md">
                <Sparkles className="w-4 h-4 text-accent" />
                Intelligent Construction Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-balance text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                Turn Your's Dream Home Into Reality
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium mb-8 text-pretty leading-relaxed max-w-prose drop-shadow-md">
                SIID  brings parametric design, real-time cost analysis, and AI-powered MEP systems to architects, contractors, and engineers. From concept to construction—accelerate your workflow with intelligent automation.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/projects/create">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 transition-transform shadow-lg"
                  >
                    <Sparkles className="mr-2 w-5 h-5" />
                    New AI Project
                  </Button>
                </Link>
                <Link href="/3d-generator">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent-dark text-white hover:scale-105 transition-transform shadow-lg"
                  >
                    Start Free Design
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="bg-white/5 border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-sm drop-shadow-sm">
                    See AI In Action
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="glass-effect elevation-lg p-6 md:p-8 border border-border/70 bg-background/70 animate-scale-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg p-4 outline-primary bg-background/60">
                  <div className="text-2xl font-bold text-primary mb-1">3x</div>
                  <div className="text-xs text-muted-foreground">Faster Design Cycles</div>
                </div>
                <div className="rounded-lg p-4 outline-accent bg-background/60">
                  <div className="text-2xl font-bold text-accent mb-1">40%</div>
                  <div className="text-xs text-muted-foreground">Cost Reduction</div>
                </div>
                <div className="rounded-lg p-4 outline-primary bg-background/60">
                  <div className="text-2xl font-bold text-primary mb-1">500+</div>
                  <div className="text-xs text-muted-foreground">Active Design Teams</div>
                </div>
                <div className="rounded-lg p-4 outline-accent bg-background/60">
                  <div className="text-2xl font-bold text-accent mb-1">99%</div>
                  <div className="text-xs text-muted-foreground">Accurate Work</div>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild className="w-full">
                  <Link href="/training">
                    Learn Construction AI
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

      {/* ================================================================================== */}
      {/* =================== PROJECT VIDEO HIGHLIGHTS SECTION ======================= */}
      {/* ================================================================================== */}
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-16 overflow-hidden border-t border-border/50">
        {/* Dynamic Professional Background Colors & Ambient Glowing Effects */}
        <div className="absolute inset-0 bg-background/95 z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 z-0" />

        {/* Large abstract ambient orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen dark:mix-blend-color-dodge z-0 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen dark:mix-blend-color-dodge z-0" />
        <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4">

          {/* Main Video Carousel */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Featured Highlights</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Immersive Project Views
              </h3>
            </div>
            <VideoCarousel />
          </div>

        </div>
      </section>

      {/* Corporate Trusted By Logos */}
      <CompanyLogoScroller />

      {/* Infinite Scrolling Professional Ticker Tape */}
      <HeadlineScroller />

      {/* Platform Capabilities Section - Professional Features Showcase */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        {/* Subtle background gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Platform Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Design Intelligence</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience next-generation design capabilities powered by artificial intelligence and automation
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* MEP Systems */}
            <Card className="p-6 border-border/60 hover-lift relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Cog className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart MEP Systems</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Automated mechanical, electrical, and plumbing layout generation with intelligent routing and compliance checks
                </p>
              </div>
            </Card>

            {/* Real-time Cost Analysis */}
            <Card className="p-6 border-border/60 hover-lift relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-Time Cost Estimation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dynamic material pricing with market-driven updates, contractor quotes, and budget optimization recommendations
                </p>
              </div>
            </Card>

            {/* 3D Visualization */}
            <Card className="p-6 border-border/60 hover-lift relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Immersive 3D Engine</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Interactive walkthroughs with real-time rendering, material previews, and spatial analysis for accurate visualization
                </p>
              </div>
            </Card>
          </div>

          {/* Secondary Features Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4 border-border/60 hover-lift group cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm mb-1">Vastu Analysis</h4>
                  <p className="text-xs text-muted-foreground">AI-powered principles compliance</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-border/60 hover-lift group cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm mb-1">Team Collaboration</h4>
                  <p className="text-xs text-muted-foreground">Real-time multi-user editing</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-border/60 hover-lift group cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm mb-1">Auto Scheduling</h4>
                  <p className="text-xs text-muted-foreground">Intelligent project timelines</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-border/60 hover-lift group cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm mb-1">Analytics Dashboard</h4>
                  <p className="text-xs text-muted-foreground">Comprehensive project insights</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">Ready to experience the future of design?</p>
            <Link href="/3d-generator">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Explore Platform
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* add progress analytics section before the Features or Vision section for more dynamics */}
      < section className="py-16 bg-muted" >
        <div className="container mx-auto px-4">
          <ProgressAnalytics />
        </div>
      </section >
      {/* ... existing code ... */}

      < section className="py-20 bg-muted" >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <BudgetEstimator />

            <InsightsSearch />
          </div>
        </div>
      </section >

      {/* Features Section */}
      <section id="features" className="py-20 bg-background" >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-8">
            <LiveTicker />
          </div>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Construction Teams Use SIID</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Engineered for architects, contractors, and structural professionals. Reduce rework. Accelerate approvals. Scale your practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 border-border hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Cog className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Parametric Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                Smart models that auto-adjust to code changes, site conditions, and design iterations—no rework needed
              </p>
            </Card>

            <Card className="p-6 border-border hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Financial Transparency</h3>
              <p className="text-muted-foreground leading-relaxed">
                Live material pricing, contractor quotes, and budget forecasting—integrated into every design decision
              </p>
            </Card>

            <Card className="p-6 border-border hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Compliance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Auto-check against building codes, seismic standards, and local regulations—approval-ready designs
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Design to Execution in Minutes</h2>
            <p className="text-lg text-muted-foreground">Streamlined workflow for construction professionals</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Parametric Input</h3>
              <p className="text-muted-foreground leading-relaxed">
                Define site parameters, building codes, and design intent. AI automatically generates compliant designs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Live cost estimation, MEP routing, structural validation, and code compliance checks run instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Approve & Execute</h3>
              <p className="text-muted-foreground leading-relaxed">
                Export construction documents, connect with contractors, and track project execution in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Construction Professionals</h2>
            <p className="text-lg text-muted-foreground">
              Architects, contractors, and engineers share their experiences with SIID FLASH
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">Transform Your Design Workflow Today</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto animate-slide-up">
            Join 500+ architecture and construction teams accelerating designs, reducing costs, and ensuring compliance with AI-powered intelligence.
          </p>
          <Link href="/3d-generator">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent-dark text-white hover:scale-105 transition-transform animate-scale-in"
            >
              Start Free Design
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="relative border-t border-border py-16 overflow-hidden">
        {/* Background Video Layer for Footer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            src="/uploads/p1.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover grayscale opacity-25 transition-opacity duration-1000"
          />
          {/* Deep Overlay for footer readability */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
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
      <ConstructionAssistant />
    </div >
  )
}
