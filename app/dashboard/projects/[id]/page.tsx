"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import JSZip from "jszip"
import saveAs from "file-saver"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Home,
  Maximize2,
  Layers,
  Palette,
  Download,
  Share2,
  Save,
  Grid3x3,
  Ruler,
  Lightbulb,
  Building,
  Hammer,
  Droplets,
  Zap,
  Eye,
} from "lucide-react"

import OptimizedImage from "@/components/optimized-image"

export default function ProjectDesignPage() {
  const params = useParams()
  const [view3D, setView3D] = useState(false)
  const [project, setProject] = useState<any>(null)
  const [dimensions, setDimensions] = useState({
    length: 50,
    width: 40,
    height: 12,
  })

  const [rooms, setRooms] = useState(
    [
      { id: 1, name: "Living Room", size: "20x15 ft", color: "#3b82f6" },
      { id: 2, name: "Kitchen", size: "15x12 ft", color: "#10b981" },
      { id: 3, name: "Bedroom", size: "18x14 ft", color: "#f59e0b" },
      { id: 4, name: "Bathroom", size: "10x8 ft", color: "#8b5cf6" },
    ].map((r, i) => ({
      ...r,
      x: 20 + i * 15, // left in %
      y: 20 + (i % 2) * 25, // top in %
      w: 20, // width in %
      h: 18, // height in %
    })),
  )

  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)

  const [tasks, setTasks] = useState<Array<{ id: string; title: string; done: boolean }>>([])
  const [newTask, setNewTask] = useState("")
  const [messages, setMessages] = useState<Array<{ id: string; text: string; at: number }>>([])
  const [newMessage, setNewMessage] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [dragId, setDragId] = useState<number | null>(null)
  const dragOffset = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 })

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    const foundProject = projects.find((p: any) => p.id === params.id)
    if (foundProject) {
      setProject(foundProject)
      setTasks(foundProject.tasks || [])
      setMessages(foundProject.messages || [])
      if (Array.isArray(foundProject.rooms) && foundProject.rooms.length > 0) {
        setRooms(foundProject.rooms)
      }
      if (foundProject.dimensions) setDimensions(foundProject.dimensions)
    }
  }, [params.id])

  const handleSave = useCallback(() => {
    try {
      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      const idx = projects.findIndex((p: any) => p.id === params.id)
      const next = {
        ...(idx >= 0 ? projects[idx] : { id: params.id }),
        designs: project?.designs || null,
        rooms,
        dimensions,
        tasks,
        messages,
        updatedAt: Date.now(),
      }
      if (idx >= 0) projects[idx] = next
      else projects.push(next)
      localStorage.setItem("projects", JSON.stringify(projects))
      alert("Saved project.")
    } catch (e) {
      console.error("[v0] Save error:", e)
      alert("Failed to save.")
    }
  }, [params.id, project, rooms, dimensions, tasks, messages])

  const handleShare = useCallback(async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: "Project", url })
      } else {
        try {
          await navigator.clipboard.writeText(url)
          alert("Link copied to clipboard.")
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
            alert("Link copied to clipboard.")
          } catch {
            alert("Unable to copy link. Please try again.")
          }
          document.body.removeChild(textarea)
        }
      }
    } catch (e) {
      console.error("[v0] Share error:", e)
      alert("Unable to share.")
    }
  }, [])

  const handleExportAll = useCallback(async () => {
    setIsExporting(true)
    setExportProgress(0)
    try {
      const zip = new JSZip()
      const summary = {
        id: params.id,
        title: "Project Export",
        generatedAt: new Date().toISOString(),
        dimensions,
        rooms,
        tasks,
        messages,
      }
      zip.file("details.json", JSON.stringify(summary, null, 2))

      // simple markdown summary
      const md = `# Project Export

- ID: ${params.id}
- Generated: ${new Date().toLocaleString()}

## Dimensions
- Length: ${dimensions.length} ft
- Width: ${dimensions.width} ft
- Height: ${dimensions.height} ft

## Rooms
${rooms.map((r) => `- ${r.name} (${r.size})`).join("\n")}

## Tasks
${tasks.length ? tasks.map((t) => `- [${t.done ? "x" : " "}] ${t.title}`).join("\n") : "- (none)"}

## Messages
${messages.length ? messages.map((m) => `- ${new Date(m.at).toLocaleString()}: ${m.text}`).join("\n") : "- (none)"}
`
      zip.file("README.md", md)

      // collect images (fallback-friendly)
      const imageCandidates: string[] = []
      const d = project?.designs
      if (d?.architectural?.floorPlanImage) imageCandidates.push(d.architectural.floorPlanImage)
      if (d?.structural?.layoutImage) imageCandidates.push(d.structural.layoutImage)
      if (d?.plumbing?.layoutImage) imageCandidates.push(d.plumbing.layoutImage)
      if (d?.electrical?.layoutImage) imageCandidates.push(d.electrical.layoutImage)
      if (d?.interior?.renderingImage) imageCandidates.push(d.interior.renderingImage)
      if (d?.exterior?.renderingImage) imageCandidates.push(d.exterior.renderingImage)

      const unique = Array.from(new Set(imageCandidates))
      let done = 0
      const total = unique.length || 1

      for (const url of unique) {
        try {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const blob = await res.blob()
          const arrBuf = await blob.arrayBuffer()
          const name = url.split("/").pop() || `image-${done + 1}.jpg`
          zip.file(`images/${name}`, arrBuf)
        } catch {
          // ignore bad image fetch, continue
        } finally {
          done++
          setExportProgress(Math.round((done / total) * 100))
        }
      }

      const content = await zip.generateAsync({ type: "blob" }, (mdata) => {
        if (mdata.percent) setExportProgress(Math.round(mdata.percent))
      })
      saveAs(content, `project-${params.id}.zip`)
    } catch (e) {
      console.error("[v0] Export error:", e)
      alert("Export failed.")
    } finally {
      setIsExporting(false)
      setExportProgress(100)
      setTimeout(() => setExportProgress(0), 1200)
    }
  }, [params.id, dimensions, rooms, tasks, messages, project])

  const addRoom = useCallback(() => {
    const id = Math.max(0, ...rooms.map((r) => r.id)) + 1
    const color = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"][id % 6]
    const next = {
      id,
      name: `Room ${id}`,
      size: "12x10 ft",
      color,
      x: 40,
      y: 40,
      w: 16,
      h: 14,
    }
    setRooms((r) => [...r, next])
    setSelectedRoom(id)
  }, [rooms])

  const updateSelectedRoom = useCallback(
    (patch: Partial<(typeof rooms)[number]>) => {
      if (selectedRoom == null) return
      setRooms((curr) => curr.map((r) => (r.id === selectedRoom ? { ...r, ...patch } : r)))
    },
    [selectedRoom],
  )

  const onMouseDownRoom = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    const target = e.currentTarget as HTMLDivElement
    const rect = target.parentElement?.getBoundingClientRect()
    if (!rect) return
    setDragId(id)
    const room = rooms.find((r) => r.id === id)
    if (!room) return
    const px = rect.left + (room.x / 100) * rect.width
    const py = rect.top + (room.y / 100) * rect.height
    dragOffset.current = { dx: e.clientX - px, dy: e.clientY - py }
  }

  const onMouseMoveCanvas = (e: React.MouseEvent) => {
    if (dragId == null) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const nx = ((e.clientX - rect.left - dragOffset.current.dx) / rect.width) * 100
    const ny = ((e.clientY - rect.top - dragOffset.current.dy) / rect.height) * 100
    setRooms((curr) =>
      curr.map((r) =>
        r.id === dragId
          ? {
            ...r,
            x: Math.min(80, Math.max(0, nx)),
            y: Math.min(80, Math.max(0, ny)),
          }
          : r,
      ),
    )
  }
  const onMouseUpCanvas = () => setDragId(null)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold">{project?.name || "Project Design"}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportAll} disabled={isExporting}>
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting…" : "Export All"}
              </Button>
              <Button size="sm" className="bg-accent hover:bg-accent-dark text-white" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Left Sidebar - Tools */}
          <aside className="w-80 border-r border-border bg-muted/30 p-6 overflow-y-auto h-[calc(100vh-73px)]">
            <Tabs defaultValue="dimensions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dimensions">
                  <Ruler className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="rooms">
                  <Grid3x3 className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="style">
                  <Palette className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dimensions" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Dimensions</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Length (ft)</Label>
                        <span className="text-sm font-medium">{dimensions.length}</span>
                      </div>
                      <Slider
                        value={[dimensions.length]}
                        onValueChange={(value) => setDimensions((prev) => ({ ...prev, length: value[0] }))}
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Width (ft)</Label>
                        <span className="text-sm font-medium">{dimensions.width}</span>
                      </div>
                      <Slider
                        value={[dimensions.width]}
                        onValueChange={(value) => setDimensions((prev) => ({ ...prev, width: value[0] }))}
                        min={10}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Height (ft)</Label>
                        <span className="text-sm font-medium">{dimensions.height}</span>
                      </div>
                      <Slider
                        value={[dimensions.height]}
                        onValueChange={(value) => setDimensions((prev) => ({ ...prev, height: value[0] }))}
                        min={8}
                        max={20}
                        step={1}
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Maximize2 className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Total Area</span>
                    </div>
                    <p className="text-2xl font-bold">{dimensions.length * dimensions.width} sq ft</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Rooms</h3>
                  <Button size="sm" variant="outline" onClick={addRoom}>
                    Add Room
                  </Button>
                </div>

                <div className="space-y-2">
                  {rooms.map((room) => (
                    <Card
                      key={room.id}
                      className={`p-4 border-border cursor-pointer transition-all ${selectedRoom === room.id ? "border-primary shadow-md" : "hover:border-muted-foreground/50"
                        }`}
                      onClick={() => setSelectedRoom(room.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: room.color }} />
                        <div className="flex-1">
                          <p className="font-medium">{room.name}</p>
                          <p className="text-sm text-muted-foreground">{room.size}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Design Style</h3>

                  <div className="space-y-3">
                    <Card className="p-4 border-border hover:border-primary cursor-pointer transition-all">
                      <p className="font-medium mb-1">Modern Minimalist</p>
                      <p className="text-sm text-muted-foreground">Clean lines and open spaces</p>
                    </Card>

                    <Card className="p-4 border-border hover:border-primary cursor-pointer transition-all">
                      <p className="font-medium mb-1">Contemporary</p>
                      <p className="text-sm text-muted-foreground">Current trends and styles</p>
                    </Card>

                    <Card className="p-4 border-border hover:border-primary cursor-pointer transition-all">
                      <p className="font-medium mb-1">Traditional</p>
                      <p className="text-sm text-muted-foreground">Classic and timeless</p>
                    </Card>

                    <Card className="p-4 border-border hover:border-primary cursor-pointer transition-all">
                      <p className="font-medium mb-1">Industrial</p>
                      <p className="text-sm text-muted-foreground">Raw and urban aesthetic</p>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"].map(
                      (color) => (
                        <button
                          key={color}
                          className="w-full aspect-square rounded-lg border-2 border-border hover:border-foreground transition-colors"
                          style={{ backgroundColor: color }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </TabsContent>

              <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <span className="font-medium text-sm">AI Suggestion</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Consider adding a balcony to maximize natural light and outdoor space.
                </p>
              </div>
            </Tabs>
          </aside>

          {/* Main Canvas */}
          <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-73px)]">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{view3D ? "3D View" : "2D Floor Plan"}</h2>
                  <p className="text-muted-foreground">
                    {view3D
                      ? "Interactive 3D visualization of your design"
                      : "Drag and arrange rooms to customize your layout"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={view3D ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView3D(!view3D)}
                    className={view3D ? "bg-primary text-white" : ""}
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    {view3D ? "2D View" : "3D View"}
                  </Button>
                </div>
              </div>

              {/* Canvas Area */}
              {!view3D ? (
                <Card className="border-border bg-muted/30 aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                  <div
                    ref={canvasRef}
                    onMouseMove={onMouseMoveCanvas}
                    onMouseUp={onMouseUpCanvas}
                    className="absolute inset-8 border-2 border-dashed border-border rounded-lg bg-background/50 backdrop-blur-sm"
                  >
                    <div className="absolute top-4 left-4 text-sm font-medium text-muted-foreground">
                      {dimensions.length} ft × {dimensions.width} ft
                    </div>

                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        className={`absolute rounded-lg shadow-lg flex items-center justify-center text-white font-medium cursor-move ${selectedRoom === room.id ? "ring-2 ring-primary" : ""
                          }`}
                        style={{
                          left: `${room.x}%`,
                          top: `${room.y}%`,
                          width: `${room.w}%`,
                          height: `${room.h}%`,
                          backgroundColor: room.color,
                        }}
                        onMouseDown={(e) => {
                          setSelectedRoom(room.id)
                          onMouseDownRoom(e, room.id)
                        }}
                        title={room.name}
                      >
                        <span className="text-xs md:text-sm px-2 text-center">{room.name}</span>
                      </div>
                    ))}
                  </div>
                  {/* Grid overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            className="text-border"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                </Card>
              ) : (
                <Card className="border-border bg-gradient-to-b from-sky-100 to-muted/30 aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="relative"
                      style={{ transform: "rotateX(60deg) rotateZ(-45deg)", transformStyle: "preserve-3d" }}
                    >
                      {/* 3D Building Structure */}
                      <div className="relative w-96 h-96">
                        {/* Base/Foundation */}
                        <div
                          className="absolute bottom-0 w-full h-8 bg-gradient-to-b from-gray-400 to-gray-500 border-2 border-gray-600"
                          style={{ transform: "translateZ(-4px)" }}
                        />

                        {/* Main Building Body */}
                        <div
                          className="absolute bottom-8 w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 shadow-2xl"
                          style={{ transform: "translateZ(0px)" }}
                        >
                          {/* Windows */}
                          {[0, 1, 2].map((floor) => (
                            <div
                              key={floor}
                              className="absolute w-full flex justify-around px-8"
                              style={{ top: `${20 + floor * 30}%` }}
                            >
                              {[0, 1, 2, 3].map((window) => (
                                <div
                                  key={window}
                                  className="w-12 h-16 bg-gradient-to-br from-sky-300 to-sky-400 border-2 border-sky-500 shadow-inner"
                                />
                              ))}
                            </div>
                          ))}

                          {/* Door */}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-24 bg-gradient-to-b from-amber-700 to-amber-800 border-2 border-amber-900" />
                        </div>

                        {/* Roof */}
                        <div
                          className="absolute bottom-72 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[200px] border-r-[200px] border-b-[80px] border-l-transparent border-r-transparent border-b-red-600"
                          style={{ transform: "translateZ(10px)", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))" }}
                        />

                        {/* Chimney */}
                        <div
                          className="absolute bottom-80 right-24 w-8 h-16 bg-gradient-to-b from-red-700 to-red-800 border-2 border-red-900"
                          style={{ transform: "translateZ(15px)" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3D View Controls */}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">3D Controls</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <div className="mt-6">
                {selectedRoom != null && (
                  <Card className="p-4 border-border">
                    <h3 className="text-lg font-semibold mb-4">Edit Selected Room</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={rooms.find((r) => r.id === selectedRoom)?.name || ""}
                          onChange={(e) => updateSelectedRoom({ name: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Size (label)</Label>
                        <Input
                          value={rooms.find((r) => r.id === selectedRoom)?.size || ""}
                          onChange={(e) => updateSelectedRoom({ size: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Width (%)</Label>
                        <Slider
                          value={[rooms.find((r) => r.id === selectedRoom)?.w || 10]}
                          onValueChange={(v) => updateSelectedRoom({ w: v[0] })}
                          min={8}
                          max={40}
                          step={1}
                        />
                      </div>
                      <div>
                        <Label>Height (%)</Label>
                        <Slider
                          value={[rooms.find((r) => r.id === selectedRoom)?.h || 10]}
                          onValueChange={(v) => updateSelectedRoom({ h: v[0] })}
                          min={8}
                          max={40}
                          step={1}
                        />
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Design Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <Card className="p-4 border-border">
                  <p className="text-sm text-muted-foreground mb-1">Total Rooms</p>
                  <p className="text-2xl font-bold">{rooms.length}</p>
                </Card>

                <Card className="p-4 border-border">
                  <p className="text-sm text-muted-foreground mb-1">Floor Area</p>
                  <p className="text-2xl font-bold">{dimensions.length * dimensions.width}</p>
                  <p className="text-xs text-muted-foreground">sq ft</p>
                </Card>

                <Card className="p-4 border-border">
                  <p className="text-sm text-muted-foreground mb-1">Efficiency</p>
                  <p className="text-2xl font-bold">87%</p>
                </Card>

                <Card className="p-4 border-border">
                  <p className="text-sm text-muted-foreground mb-1">Est. Cost</p>
                  <p className="text-2xl font-bold">₹125K</p>
                </Card>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <Card className="p-4 border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Tasks</h3>
                    <span className="text-sm text-muted-foreground">
                      {tasks.filter((t) => t.done).length}/{tasks.length} done
                    </span>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {tasks.map((t) => (
                      <label key={t.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={(e) =>
                            setTasks((cur) => cur.map((x) => (x.id === t.id ? { ...x, done: e.target.checked } : x)))
                          }
                        />
                        <span className={t.done ? "line-through text-muted-foreground" : ""}>{t.title}</span>
                      </label>
                    ))}
                    {!tasks.length && <p className="text-sm text-muted-foreground">No tasks yet.</p>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Input placeholder="Add a task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                    <Button
                      onClick={() => {
                        if (!newTask.trim()) return
                        setTasks((cur) => [{ id: crypto.randomUUID(), title: newTask.trim(), done: false }, ...cur])
                        setNewTask("")
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  {/* progress bar */}
                  <div className="mt-4">
                    <div className="h-2 w-full bg-muted rounded">
                      <div
                        className="h-2 bg-primary rounded"
                        style={{
                          width: `${tasks.length ? Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 border-border">
                  <h3 className="text-lg font-semibold mb-3">Messages</h3>
                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {messages.map((m) => (
                      <div key={m.id} className="p-3 rounded border border-border">
                        <p className="text-sm">{m.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(m.at).toLocaleString()}</p>
                      </div>
                    ))}
                    {!messages.length && <p className="text-sm text-muted-foreground">No messages yet.</p>}
                  </div>
                  <div className="mt-3">
                    <Textarea
                      rows={3}
                      placeholder="Write a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        onClick={() => {
                          if (!newMessage.trim()) return
                          setMessages((cur) => [
                            { id: crypto.randomUUID(), text: newMessage.trim(), at: Date.now() },
                            ...cur,
                          ])
                          setNewMessage("")
                        }}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {isExporting && (
                <div className="mt-6">
                  <Card className="p-4 border-border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Preparing export…</p>
                      <span className="text-sm">{exportProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded mt-2">
                      <div className="h-2 bg-primary rounded" style={{ width: `${exportProgress}%` }} />
                    </div>
                  </Card>
                </div>
              )}

              {project?.designs && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Generated Design Layouts</h2>
                      <p className="text-muted-foreground">AI-generated architectural, structural, and MEP designs</p>
                    </div>
                    <Link href={`/dashboard/projects/${params.id}/designs`}>
                      <Button variant="outline" size="sm">
                        View All Details
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Architectural Design */}
                    <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 group">
                      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                        <OptimizedImage
                          src={project.designs.architectural.floorPlanImage || "/images/modern-minimalist-design.jpg"}
                          alt="Architectural Design"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-2 text-white mb-1">
                            <Building className="w-5 h-5" />
                            <h3 className="font-semibold">Architectural Design</h3>
                          </div>
                          <p className="text-xs text-white/80">Floor plans and layouts</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <Link href={`/dashboard/projects/${params.id}/designs`}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card>

                    {/* Structural Design */}
                    <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 group">
                      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                        <OptimizedImage
                          src={project.designs.structural.layoutImage || "/images/modern-minimalist-design.jpg"}
                          alt="Structural Design"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-2 text-white mb-1">
                            <Hammer className="w-5 h-5" />
                            <h3 className="font-semibold">Structural Design</h3>
                          </div>
                          <p className="text-xs text-white/80">Load-bearing elements</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <Link href={`/dashboard/projects/${params.id}/designs`}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card>

                    {/* Plumbing Design */}
                    <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 group">
                      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                        <OptimizedImage
                          src={project.designs.plumbing.layoutImage || "/images/modern-minimalist-design.jpg"}
                          alt="Plumbing Design"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-2 text-white mb-1">
                            <Droplets className="w-5 h-5" />
                            <h3 className="font-semibold">Plumbing Design</h3>
                          </div>
                          <p className="text-xs text-white/80">Water supply and drainage</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <Link href={`/dashboard/projects/${params.id}/designs`}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card>

                    {/* Electrical Design */}
                    <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 group">
                      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                        <OptimizedImage
                          src={project.designs.electrical.layoutImage || "/images/modern-minimalist-design.jpg"}
                          alt="Electrical Design"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-2 text-white mb-1">
                            <Zap className="w-5 h-5" />
                            <h3 className="font-semibold">Electrical Design</h3>
                          </div>
                          <p className="text-xs text-white/80">Circuits and wiring</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <Link href={`/dashboard/projects/${params.id}/designs`}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card>

                    {/* Interior Design */}
                    <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 group">
                      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                        <OptimizedImage
                          src={project.designs.interior.renderingImage || "/images/modern-minimalist-design.jpg"}
                          alt="Interior Design"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-2 text-white mb-1">
                            <Palette className="w-5 h-5" />
                            <h3 className="font-semibold">Interior Design</h3>
                          </div>
                          <p className="text-xs text-white/80">Style and finishes</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <Link href={`/dashboard/projects/${params.id}/designs`}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card>

                    {/* Exterior Design */}
                    <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 group">
                      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                        <OptimizedImage
                          src={project.designs.exterior.renderingImage || "/images/modern-minimalist-design.jpg"}
                          alt="Exterior Design"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center gap-2 text-white mb-1">
                            <Home className="w-5 h-5" />
                            <h3 className="font-semibold">Exterior Design</h3>
                          </div>
                          <p className="text-xs text-white/80">Facade and landscaping</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <Link href={`/dashboard/projects/${params.id}/designs`}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
