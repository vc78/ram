"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Camera, Upload, ImageIcon, MapPin, Calendar, Download, Trash2, Eye, Grid3x3, List, BrainCircuit, Activity, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface SitePhoto {
  id: string
  url: string
  filename: string
  format: "jpg" | "png" | "heic"
  uploadedAt: string
  taskId?: string
  taskName?: string
  date: string
  milestone?: string
  tags: string[]
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  comments?: string
  uploadedBy: string
  size: number
  mlAnalysis?: {
    progress: number
    phase: string
    confidenceScore: number
    safetyViolations: { type: string, description: string, severity: string }[]
    description: string
  }
}

const PHOTO_TAGS = [
  "Foundation",
  "Pillars",
  "Slab",
  "Plumbing",
  "Electrical",
  "Masonry",
  "Plastering",
  "Flooring",
  "Painting",
  "Carpentry",
  "Roofing",
  "Windows",
  "Doors",
  "Excavation",
  "Curing",
  "Steel Work",
  "Waterproofing",
  "Finishing",
  "Inspection",
  "Safety",
  "Equipment",
  "Materials",
  "Progress",
  "Issues",
  "Completed",
]

interface SitePhotoUploadProps {
  taskId?: string
  taskName?: string
  milestone?: string
  onPhotoUploaded?: (photo: SitePhoto) => void
}

export function SitePhotoUpload({ taskId, taskName, milestone, onPhotoUploaded }: SitePhotoUploadProps) {
  const [photos, setPhotos] = useState<SitePhoto[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterTag, setFilterTag] = useState<string>("all")
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [uploadData, setUploadData] = useState({
    tags: [] as string[],
    comments: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzedPhotos, setAnalyzedPhotos] = useState<Record<string, any>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      const res = await fetch("/api/db/photos")
      if (res.ok) {
        const allPhotos: SitePhoto[] = await res.json()
        // cache locally for offline use
        localStorage.setItem("sitePhotos", JSON.stringify(allPhotos))
        const filteredPhotos = taskId ? allPhotos.filter((p) => p.taskId === taskId) : allPhotos
        setPhotos(filteredPhotos)
        return
      }
    } catch (err) {
      console.error("Failed to load photos from DB", err)
    }

    // fallback to localStorage if DB read fails
    const stored = localStorage.getItem("sitePhotos")
    const allPhotos: SitePhoto[] = stored ? JSON.parse(stored) : []
    const filteredPhotos = taskId ? allPhotos.filter((p) => p.taskId === taskId) : allPhotos
    setPhotos(filteredPhotos)
  }

  const savePhotos = (newPhotos: SitePhoto[]) => {
    const stored = localStorage.getItem("sitePhotos")
    const allPhotos: SitePhoto[] = stored ? JSON.parse(stored) : []
    const otherPhotos = taskId ? allPhotos.filter((p) => p.taskId !== taskId) : []
    const updatedPhotos = [...otherPhotos, ...newPhotos]
    localStorage.setItem("sitePhotos", JSON.stringify(updatedPhotos))
    setPhotos(updatedPhotos)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files)
  }

  const handleFileSubmit = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"User"}')
    const form = new FormData()
    Array.from(selectedFiles).forEach((f) => form.append("files", f))

    setIsAnalyzing(true)
    try {
      const res = await fetch("/api/uploads/photos", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")

      const newPhotos: SitePhoto[] = []
      for (const file of Array.from(selectedFiles)) {
        const rawFormat = file.name.split(".").pop()?.toLowerCase() || ""
        if (!["jpg", "jpeg", "png", "heic"].includes(rawFormat)) continue

        let location: SitePhoto["location"] | undefined
        if ("geolocation" in navigator) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              const timeoutId = setTimeout(() => reject(new Error("Geolocation timeout")), 2000)
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  clearTimeout(timeoutId)
                  resolve(pos)
                },
                (err) => {
                  clearTimeout(timeoutId)
                  reject(err)
                },
                { timeout: 2000 }
              )
            })
            location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`,
            }
          } catch (error) {
            console.log("Location not available or timed out")
          }
        }

        const urlEntry = data.saved.find((s: any) => s.filename === file.name)
        const url = urlEntry ? urlEntry.url : URL.createObjectURL(file)

        // ML Auto Analysis for Site Photo
        let mlAnalysis = undefined
        let additionalTags: string[] = []
        try {
          const mlRes = await fetch("/api/analyze-site-photo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.name }),
          })
          if (mlRes.ok) {
            const mlData = await mlRes.json()
            if (mlData.success) {
               mlAnalysis = mlData.analysis
               additionalTags = mlData.analysis.autoTags || []
            }
          }
        } catch(mlErr) {
          console.warn("ML API Error", mlErr)
        }

        const newPhoto: SitePhoto = {
          id: crypto.randomUUID(),
          url,
          filename: file.name,
          format: rawFormat === "jpeg" ? "jpg" : (rawFormat as "jpg" | "png" | "heic"),
          uploadedAt: new Date().toISOString(),
          taskId,
          taskName,
          date: uploadData.date,
          milestone,
          tags: Array.from(new Set([...uploadData.tags, ...additionalTags])),
          location,
          comments: uploadData.comments,
          uploadedBy: currentUser.name || "User",
          size: file.size,
          mlAnalysis,
        }

        newPhotos.push(newPhoto)

        // also persist metadata server-side
        fetch("/api/db/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPhoto),
        }).catch((e) => console.error("DB photo insert failed", e))
      }

      const updatedPhotos = [...photos, ...newPhotos]
      savePhotos(updatedPhotos)

      if (onPhotoUploaded && newPhotos.length > 0) {
        newPhotos.forEach((photo) => onPhotoUploaded(photo))
      }

      toast({
        title: "Photos Uploaded & Analyzed",
        description: `${newPhotos.length} photo(s) uploaded and processed via ML engine`,
      })

      setUploadDialogOpen(false)
      resetUploadData()
    } catch (err) {
      toast({
        title: "Upload Error",
        description: (err as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetUploadData = () => {
    setUploadData({
      tags: [],
      comments: "",
      date: new Date().toISOString().split("T")[0],
    })
    setSelectedFiles(null)
  }

  const handleTagToggle = (tag: string) => {
    setUploadData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      const updatedPhotos = photos.filter((p) => p.id !== id)
      savePhotos(updatedPhotos)
      toast({
        title: "Photo Deleted",
        description: "Photo removed successfully",
      })
    }
  }

  const handleDownload = (photo: SitePhoto) => {
    const a = document.createElement("a")
    a.href = photo.url
    a.download = photo.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast({
      title: "Download Started",
      description: `Downloading ${photo.filename}...`,
    })
  }

  const filteredPhotos = filterTag === "all" ? photos : photos.filter((p) => p.tags.includes(filterTag))

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <>
      <Card className="p-6 border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Site Photos</h3>
            <Badge variant="secondary">{photos.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
            </Button>
            <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <Button
            variant={filterTag === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTag("all")}
            className="whitespace-nowrap"
          >
            All Photos
          </Button>
          {PHOTO_TAGS.slice(0, 10).map((tag) => (
            <Button
              key={tag}
              variant={filterTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterTag(tag)}
              className="whitespace-nowrap"
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* Photo Gallery */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                  <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {photo.mlAnalysis && (
                      <Badge className={`${photo.mlAnalysis.safetyViolations.length > 0 ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"} text-white border-0 shadow-sm font-medium flex items-center gap-1`}>
                        {photo.mlAnalysis.safetyViolations.length > 0 ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {photo.mlAnalysis.safetyViolations.length > 0 ? "Hazard Flag" : "Safe"}
                      </Badge>
                    )}
                  </div>
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {photo.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{photo.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPhoto(photo)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(photo)
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(photo.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="flex items-center gap-4 p-3 rounded-lg border bg-background hover:bg-muted transition-colors"
              >
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.filename}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{photo.filename}</div>
                  <div className="text-xs text-muted-foreground mt-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {photo.date}
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(photo.size)}</span>
                      {photo.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Located
                          </span>
                        </>
                      )}
                    </div>
                    {photo.taskName && (
                      <div className="text-xs">
                        Task: <span className="font-medium">{photo.taskName}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {photo.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPhoto(photo)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(photo)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(photo.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No photos yet</p>
            <p className="text-sm mb-4">Upload site photos to track progress</p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Photos
            </Button>
          </div>
        )}
      </Card>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          setUploadDialogOpen(open)
          if (!open) resetUploadData()
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Site Photos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="photo-upload">Select Photos</Label>
              <Input
                id="photo-upload"
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/heic"
                onChange={handleFileSelect}
                className="mt-2"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, HEIC • Multiple files allowed
                </p>
                {selectedFiles && selectedFiles.length > 0 && (
                  <p className="text-sm font-medium text-primary">
                    {selectedFiles.length} file(s) selected
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="photo-date">Date</Label>
              <Input
                id="photo-date"
                type="date"
                value={uploadData.date}
                onChange={(e) => setUploadData({ ...uploadData, date: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {PHOTO_TAGS.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={uploadData.tags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTagToggle(tag)}
                    className="h-8"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {uploadData.tags.length > 0 ? uploadData.tags.join(", ") : "None"}
              </p>
            </div>

            <div>
              <Label htmlFor="photo-comments">Comments / Remarks (Optional)</Label>
              <Textarea
                id="photo-comments"
                placeholder="Add any notes about these photos..."
                value={uploadData.comments}
                onChange={(e) => setUploadData({ ...uploadData, comments: e.target.value })}
                className="mt-2"
                rows={3}
              />
            </div>

            {taskName && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p className="text-muted-foreground">
                  Linked to task: <span className="font-medium text-foreground">{taskName}</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false)
                resetUploadData()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleFileSubmit} disabled={!selectedFiles || selectedFiles.length === 0 || isAnalyzing}>
              {isAnalyzing ? (
                <>AI Engine Scanning...</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" /> Upload Photos</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPhoto?.filename}</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative border rounded-lg overflow-hidden bg-muted flex items-center justify-center min-h-[300px]">
                <img
                  src={selectedPhoto.url || "/placeholder.svg"}
                  alt={selectedPhoto.filename}
                  className="w-full max-h-[500px] object-contain"
                />
                {selectedPhoto.mlAnalysis && (
                  <div className="absolute inset-0 pointer-events-none p-4 opacity-75">
                     {/* Simulated Computer Vision Overlays */}
                     {selectedPhoto.mlAnalysis.safetyViolations.map((v, i) => (
                       <div key={i} className="absolute border-2 border-red-500 bg-red-500/10 p-1 font-mono text-[10px] sm:text-xs text-red-500 font-bold backdrop-blur-sm shadow-xl" style={{ top: `${(i+1)*20}%`, left: `${(i+1)*25}%`, minWidth: '80px' }}>
                          [{v.type.toUpperCase()}] DETECTED
                       </div>
                     ))}
                     {selectedPhoto.mlAnalysis.safetyViolations.length === 0 && (
                        <div className="absolute bottom-4 right-4 bg-emerald-500/90 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> CV CONFIRM: SAFE
                        </div>
                     )}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2 font-medium">{selectedPhoto.date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Uploaded:</span>
                  <span className="ml-2 font-medium">{new Date(selectedPhoto.uploadedAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Format:</span>
                  <span className="ml-2 font-medium uppercase">{selectedPhoto.format}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <span className="ml-2 font-medium">{formatFileSize(selectedPhoto.size)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Uploaded By:</span>
                  <span className="ml-2 font-medium">{selectedPhoto.uploadedBy}</span>
                </div>
                {selectedPhoto.taskName && (
                  <div>
                    <span className="text-muted-foreground">Task:</span>
                    <span className="ml-2 font-medium">{selectedPhoto.taskName}</span>
                  </div>
                )}
                {selectedPhoto.milestone && (
                  <div>
                    <span className="text-muted-foreground">Milestone:</span>
                    <span className="ml-2 font-medium">{selectedPhoto.milestone}</span>
                  </div>
                )}
              </div>

              {selectedPhoto.location && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">Location Data Available</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{selectedPhoto.location.address}</p>
                </div>
              )}

              {selectedPhoto.tags.length > 0 && (
                <div>
                  <Label className="text-sm text-muted-foreground">Tags:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPhoto.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedPhoto.mlAnalysis && (
                <div className="mt-8 border-t pt-6 bg-gradient-to-br from-primary/5 to-transparent -mx-6 px-6 pb-6 -mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-lg text-primary tracking-tight">Computer Vision Engine</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div className="bg-background border rounded-lg p-4 shadow-sm">
                          <div className="text-sm text-muted-foreground mb-1">Detected Project Phase</div>
                          <div className="font-medium flex items-center gap-2">
                             <Activity className="w-4 h-4 text-blue-500" />
                             {selectedPhoto.mlAnalysis.phase}
                          </div>
                       </div>
                       
                       <div className="bg-background border rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-end mb-2">
                             <div className="text-sm text-muted-foreground">Est. Progress Component</div>
                             <div className="font-bold text-xl">{selectedPhoto.mlAnalysis.progress}%</div>
                          </div>
                          <Progress value={selectedPhoto.mlAnalysis.progress} className="h-2" />
                          <div className="mt-2 text-xs text-muted-foreground">AI Confidence: {selectedPhoto.mlAnalysis.confidenceScore.toFixed(1)}%</div>
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-medium flex items-center gap-2 text-sm">
                         Safety & Compliance Detection
                         <Badge variant="outline" className="text-[10px] font-mono shrink-0 ml-auto">OSHA CHECK</Badge>
                      </h5>
                      {selectedPhoto.mlAnalysis.safetyViolations.length > 0 ? (
                        <div className="space-y-2">
                          {selectedPhoto.mlAnalysis.safetyViolations.map((v, i) => (
                            <div key={i} className="flex gap-3 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-900 shadow-sm relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                              <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                              <div>
                                <strong className="block text-red-800 tracking-tight">{v.type.toUpperCase().replace(/_/g, " ")}</strong>
                                {v.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-800 shadow-sm">
                           <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                           No perimeter safety risks detected in visual sweep.
                        </div>
                      )}
                      
                      <div className="mt-4 pt-3 border-t">
                        <Label className="text-xs text-muted-foreground mb-1 block">Contextual Analysis</Label>
                        <p className="text-sm italic text-muted-foreground bg-muted/50 p-2 rounded border border-border/50">"{selectedPhoto.mlAnalysis.description}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className={selectedPhoto?.mlAnalysis ? "border-t bg-muted/40 p-4 -mb-6 -mx-6 mt-6 rounded-b" : ""}>
            <Button variant="outline" onClick={() => setSelectedPhoto(null)}>
              Close
            </Button>
            {selectedPhoto && (
              <Button onClick={() => handleDownload(selectedPhoto)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
