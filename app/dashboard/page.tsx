"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getCurrentUser, logout, getUserDataKey } from "@/lib/auth"
import { BrandLogo } from "@/components/brand-logo"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/lib/i18n/translations"
import {
  Sparkles,
  Plus,
  Home,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  Clock,
  Briefcase,
  Calculator,
  Calendar,
  FileText,
  Grid3x3,
  LayoutGrid,
  Cable as Cube,
  Menu,
} from "lucide-react"

import { ErrorBoundary } from "@/components/error-boundary"

import {
  MaterialCalculator,
  EnhancedTimeline,
  VastuChecker,
  GeoVastuEngine,
  DocumentManager,
  ComparisonView,
  NotificationCenter,
  ProjectMilestones,
  QuickActions,
  WeatherWidget,
} from "@/components/advanced-features"

export default function DashboardPage() {
  const router = useRouter()
  const user = getCurrentUser()
  const { language } = useLanguage()
  const t: any = useTranslation(language)
  const [activeTab, setActiveTab] = useState("overview")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [taskOpen, setTaskOpen] = useState(false)
  const [memberOpen, setMemberOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newMember, setNewMember] = useState({ name: "", email: "" })
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const defaultProjects = [
    {
      id: "PROJ-2026-0514",
      name: "Residential Building — 3 BHK",
      status: "Planning",
      progress: 0,
      budget: "₹68,40,000",
      deadline: "18 Months",
      location: "Hyderabad, Telangana",
      vastuScore: "87%",
      image: "https://images.unsplash.com/photo-1541888086225-ee5dc24bd4ab?auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Office Renovation",
      status: "Planning",
      progress: 15,
      budget: "₹85,000",
      deadline: "July 2024",
      image: "/images/office-renovation-project.jpg",
    },
    {
      id: 3,
      name: "Garden Landscape",
      status: "Completed",
      progress: 100,
      budget: "₹25,000",
      deadline: "Jan 2024",
      image: "/images/garden-landscape-project.jpg",
    },
  ]

  const [activeProjectsList, setActiveProjectsList] = useState<any[]>(defaultProjects)
  const [activeCount, setActiveCount] = useState("3")

  useEffect(() => {
     try {
        const key = getUserDataKey("siid_projects");
        const stored = localStorage.getItem(key);
        if (stored) {
           const parsed = JSON.parse(stored);
           setActiveProjectsList([...parsed, ...defaultProjects]);
           setActiveCount((defaultProjects.length + parsed.length).toString());
        }
     } catch(e) {}
  }, [])

  const stats = [
    { label: "Active Projects", value: activeCount, icon: FolderOpen, color: "text-primary" },
    { label: "Completed", value: "12", icon: Home, color: "text-green-600" },
    { label: "In Review", value: "1", icon: Clock, color: "text-amber-600" },
    { label: "Contractors", value: "8", icon: Users, color: "text-blue-600" },
  ]

  return (
    <AuthGuard>
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50 lg:hidden">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <Menu className="w-5 h-5" />
                  </Button>
                  <span className="text-xl font-bold text-primary">SIID</span>
                </div>
                <LanguageSelector />
              </div>
            </div>
          </header>

          <aside className={cn(
            "fixed left-0 top-0 h-full w-64 border-r border-border bg-background lg:bg-muted/30 overflow-y-auto flex flex-col z-50 transition-all duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">SIID</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                   <Menu className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex">
                   <Menu className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-1 flex-1">
                <button
                  onClick={() => { setActiveTab("overview"); if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "overview"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Overview</span>
                </button>

                <button
                  onClick={() => { setActiveTab("projects"); if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "projects"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <FolderOpen className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Our projects</span>
                </button>

                <button
                  onClick={() => { setActiveTab("material"); if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "material"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <Calculator className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Material calculator</span>
                </button>

                <button
                  onClick={() => { setActiveTab("vastu"); if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "vastu"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <Grid3x3 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Vastu Analysis</span>
                </button>

                <Link href="/3d-generator">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                    <Cube className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">3D Generator</span>
                  </button>
                </Link>

                <Link href="/dashboard/schedule">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                    <Calendar className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Work schedule</span>
                  </button>
                </Link>

                <button
                  onClick={() => { setActiveTab("timeline"); if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "timeline"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Time line</span>
                </button>

                <button
                  onClick={() => { setActiveTab("documents"); if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === "documents"
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Documents</span>
                </button>

                <Link href="/dashboard/contractors">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                    <Users className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Contractors</span>
                  </button>
                </Link>

                <Link href="/dashboard/careers">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                    <Briefcase className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Careers</span>
                  </button>
                </Link>

                <Link href="/settings">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                </Link>
              </nav>
            </div>

            <div className="mt-auto p-6 border-t border-border">
              <div className="p-4 bg-background rounded-lg border border-border mb-3 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">{t.logout}</span>
              </Button>
            </div>
          </aside>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className={cn(
            "transition-all duration-300 p-4 md:p-8 relative",
            sidebarOpen ? "lg:ml-64" : "lg:ml-0"
          )}>
            {!sidebarOpen && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(true)}
                className="hidden lg:flex absolute top-4 left-4 z-50 bg-background/80 backdrop-blur shadow-sm border border-border"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{t.welcomeBack}, {user?.name}!</h1>
                  <p className="text-muted-foreground text-sm md:text-base">{"Here's what's happening with your projects"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    title={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
                    className="flex-shrink-0"
                  >
                    {viewMode === "grid" ? <LayoutGrid className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setTaskOpen(true)}>
                    <Plus className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Add Task</span>
                    <span className="sm:hidden">Task</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setMemberOpen(true)}>
                    <Users className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Add Member</span>
                    <span className="sm:hidden">Member</span>
                  </Button>
                  <Link href="/projects/create">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                      <Sparkles className="w-4 h-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">New AI Project</span>
                      <span className="sm:hidden">New</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {activeTab === "overview" && (
                <ErrorBoundary>
                  <>
                    {/* <div className="mb-8">
                      <QuickActions />
                    </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {stats.map((stat) => (
                        <Card key={stat.label} className="p-6 border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                              <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                            <div
                              className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}
                            >
                              <stat.icon className="w-6 h-6" />
                            </div>
                          </div>
                        </Card>
                      ))}

                      {/* Weather summary card */}
                      <WeatherWidget location={(user as any)?.location || "Hyderabad"} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <Card className="p-6 border-border hover:shadow-lg transition-shadow bg-gradient-to-br from-accent/10 to-accent/5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Cube className="w-6 h-6 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">3D Model Generator</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Create rule-based 3D building models with interactive walkthrough and camera flyover
                              features
                            </p>
                            <Link href="/3d-generator">
                              <Button className="w-full bg-accent hover:bg-accent-dark text-white">
                                Launch Generator
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 border-border hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Calculator className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">Advanced Tools</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Access material calculators, budget estimators, and project planning tools
                            </p>
                            <Button onClick={() => setActiveTab("tools")} variant="outline" className="w-full">
                              View Tools
                            </Button>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 border-border hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">Timeline Management</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Track project phases, milestones, and deadlines with advanced analytics
                            </p>
                            <Button onClick={() => setActiveTab("timeline")} variant="outline" className="w-full">
                              View Timeline
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                    {/* </CHANGE> */}

                    {/*
                    <div
                      className={
                        viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" : "space-y-4 mb-8"
                      }
                    >
                      {projects.map((project) => (
                        <Card
                          key={project.id}
                          className={`overflow-hidden border-border hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex flex-row" : ""
                            }`}
                        >
                          <img
                            src={project.image || "/placeholder.svg?height=200&width=400&query=construction project"}
                            alt={project.name}
                            className={viewMode === "grid" ? "w-full h-48 object-cover" : "w-48 h-full object-cover"}
                          />
                          <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                                <Badge
                                  variant={
                                    project.status === "Completed"
                                      ? "secondary"
                                      : project.status === "In Progress"
                                        ? "default"
                                        : "outline"
                                  }
                                >
                                  {project.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-3 mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Budget</span>
                                <span className="font-medium">{project.budget}</span>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Deadline</span>
                                <span className="font-medium">{project.deadline}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                                <Button variant="outline" className="w-full bg-transparent" size="sm">
                                  View Design
                                </Button>
                              </Link>
                              <Link href={`/dashboard/projects/${project.id}/manage`} className="flex-1">
                                <Button className="w-full bg-accent hover:bg-accent-dark text-white" size="sm">
                                  Manage
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    */}

                    <div className="grid lg:grid-cols-2 gap-6 mt-8">
                      <NotificationCenter />
                      <ProjectMilestones />
                    </div>
                  </>
                </ErrorBoundary>
              )}

              {activeTab === "projects" && (
                <ErrorBoundary>
                  <>
                    <div className="mb-8">
                      <ComparisonView />
                    </div>
                    <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                      {activeProjectsList.map((project) => (
                        <Card
                          key={project.id}
                          className={`overflow-hidden border-border hover:shadow-lg transition-shadow ${viewMode === "list" ? "flex flex-row" : ""
                            }`}
                        >
                          <img
                            src={project.image || "/placeholder.svg?height=200&width=400&query=construction project"}
                            alt={project.name}
                            className={viewMode === "grid" ? "w-full h-48 object-cover" : "w-48 h-full object-cover"}
                          />
                          <div className="p-6 flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                                <Badge
                                  variant={
                                    project.status === "Completed"
                                      ? "secondary"
                                      : project.status === "In Progress"
                                        ? "default"
                                        : "outline"
                                  }
                                >
                                  {project.status}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-3 mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Budget</span>
                                <span className="font-medium">{project.budget}</span>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Deadline</span>
                                <span className="font-medium">{project.deadline}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                                <Button variant="outline" className="w-full bg-transparent" size="sm">
                                  View Design
                                </Button>
                              </Link>
                              <Link href={`/dashboard/projects/${project.id}/manage`} className="flex-1">
                                <Button className="w-full bg-accent hover:bg-accent-dark text-white" size="sm">
                                  Manage
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                </ErrorBoundary>
              )}

              {activeTab === "material" && (
                <ErrorBoundary>
                  <MaterialCalculator />
                </ErrorBoundary>
              )}

              {activeTab === "vastu" && (
                <ErrorBoundary>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                       <div>
                          <h2 className="text-2xl font-bold tracking-tight">Vastu Analysis Intelligence</h2>
                          <p className="text-sm text-muted-foreground">Traditional principles meets modern geo-spatial engineering</p>
                       </div>
                       <div className="flex bg-muted p-1 rounded-xl">
                          <Button 
                            variant={!viewMode || viewMode === "grid" ? "default" : "ghost"} 
                            size="sm" 
                            onClick={() => setViewMode("grid")}
                            className="rounded-lg text-xs font-bold"
                          >
                            Traditional
                          </Button>
                          <Button 
                            variant={viewMode === "list" ? "default" : "ghost"} 
                            size="sm" 
                            onClick={() => setViewMode("list")}
                            className="rounded-lg text-xs font-bold"
                          >
                            Geo-Spatial
                          </Button>
                       </div>
                    </div>

                    <div className="mt-4 transition-all duration-500">
                      {(!viewMode || viewMode === "grid") && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                           <VastuChecker />
                        </motion.div>
                      )}
                      {viewMode === "list" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                           <GeoVastuEngine />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </ErrorBoundary>
              )}

              {activeTab === "timeline" && (
                <ErrorBoundary>
                  <EnhancedTimeline />
                </ErrorBoundary>
              )}

              {activeTab === "documents" && (
                <ErrorBoundary>
                  <DocumentManager />
                </ErrorBoundary>
              )}


            </div>
          </main>

          <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Task</DialogTitle>
              </DialogHeader>
              <Input placeholder="Task title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
              <DialogFooter>
                <Button
                  onClick={() => {
                    const key = getUserDataKey("globalTasks")
                    const tasks = JSON.parse(localStorage.getItem(key) || "[]")
                    tasks.unshift({ id: crypto.randomUUID(), title: newTaskTitle, at: Date.now() })
                    localStorage.setItem(key, JSON.stringify(tasks))
                    setTaskOpen(false)
                    setNewTaskTitle("")
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={memberOpen} onOpenChange={setMemberOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Member</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    const key = getUserDataKey("projectMembers")
                    const members = JSON.parse(localStorage.getItem(key) || "[]")
                    members.push({ id: crypto.randomUUID(), ...newMember })
                    localStorage.setItem(key, JSON.stringify(members))
                    setMemberOpen(false)
                    setNewMember({ name: "", email: "" })
                  }}
                >
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
    </AuthGuard>
  )
}
