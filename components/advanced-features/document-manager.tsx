"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Download,
  Upload,
  Eye,
  Folder,
  Trash2,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Stamp,
  Camera,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ShareButton } from "@/components/share-button"
import { shareDocument } from "@/lib/share-utils"
import { SitePhotoUpload } from "@/components/work-schedule/site-photo-upload"

interface Document {
  id: string
  name: string
  type: "approval" | "design" | "contract" | "permit" | "report" | "layout" | "blueprint"
  format: "pdf" | "doc" | "docx" | "xls" | "xlsx" | "csv" | "png" | "jpg" | "jpeg" | "zip" | "dwg"
  status: "pending" | "approved" | "draft"
  date: string
  size: string
  version: string
  uploadedBy: string
  url?: string
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Building Plan Approval.pdf",
    type: "approval",
    format: "pdf",
    status: "approved",
    date: "2024-01-15",
    size: "2.4 MB",
    version: "v1.0",
    uploadedBy: "Admin",
  },
  {
    id: "2",
    name: "Architectural Drawings.dwg",
    type: "design",
    format: "dwg",
    status: "approved",
    date: "2024-01-10",
    size: "15.8 MB",
    version: "v2.1",
    uploadedBy: "Architect",
  },
  {
    id: "3",
    name: "Structural Certificate.pdf",
    type: "approval",
    format: "pdf",
    status: "pending",
    date: "2024-01-20",
    size: "1.2 MB",
    version: "v1.0",
    uploadedBy: "Engineer",
  },
  {
    id: "4",
    name: "Contractor Agreement.pdf",
    type: "contract",
    format: "pdf",
    status: "approved",
    date: "2024-01-05",
    size: "890 KB",
    version: "v1.0",
    uploadedBy: "Legal",
  },
  {
    id: "5",
    name: "Fire NOC Application.pdf",
    type: "permit",
    format: "pdf",
    status: "pending",
    date: "2024-01-22",
    size: "3.1 MB",
    version: "v1.0",
    uploadedBy: "Admin",
  },
  {
    id: "6",
    name: "Electrical Layout.pdf",
    type: "layout",
    format: "pdf",
    status: "draft",
    date: "2024-01-25",
    size: "5.6 MB",
    version: "v1.2",
    uploadedBy: "Electrician",
  },
]

export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const stored = localStorage.getItem("projectDocuments")
    const storedDocs = stored ? JSON.parse(stored) : []
    setDocuments([...MOCK_DOCUMENTS, ...storedDocs])
  }, [])

  const saveDocuments = (docs: Document[]) => {
    const userDocs = docs.filter((d) => !MOCK_DOCUMENTS.find((m) => m.id === d.id))
    localStorage.setItem("projectDocuments", JSON.stringify(userDocs))
    setDocuments(docs)
  }

  const filteredDocs = filter === "all" ? documents : documents.filter((d) => d.type === filter || d.status === filter)

  const getTypeIcon = (format: Document["format"]) => {
    if (["png", "jpg", "jpeg"].includes(format)) return <FileImage className="w-4 h-4" />
    if (["xls", "xlsx", "csv"].includes(format)) return <FileSpreadsheet className="w-4 h-4" />
    if (["zip"].includes(format)) return <FileArchive className="w-4 h-4" />
    if (["dwg"].includes(format)) return <Folder className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
    }
  }

  const handleDownload = (doc: Document) => {
    // Create a mock blob for download
    const blob = new Blob([`This is ${doc.name}`], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = doc.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}...`,
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newDocs: Document[] = []
    const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"User"}')

    Array.from(files).forEach((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() as Document["format"]
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)

      const newDoc: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        type: "design",
        format: extension || "pdf",
        status: "draft",
        date: new Date().toISOString().split("T")[0],
        size: `${sizeInMB} MB`,
        version: "v1.0",
        uploadedBy: currentUser.name || "User",
        url: URL.createObjectURL(file),
      }

      newDocs.push(newDoc)
    })

    const updatedDocs = [...documents, ...newDocs]
    saveDocuments(updatedDocs)

    toast({
      title: "Upload Successful",
      description: `${newDocs.length} file(s) uploaded successfully`,
    })

    setUploadDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const updatedDocs = documents.filter((d) => d.id !== id)
      saveDocuments(updatedDocs)
      toast({
        title: "Document Deleted",
        description: "Document removed successfully",
      })
    }
  }

  const handlePreview = (doc: Document) => {
    setPreviewDoc(doc)
  }

  const handleShare = async (doc: Document) => {
    const success = await shareDocument({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      url: doc.url,
    })

    if (success) {
      toast({
        title: "Shared Successfully",
        description: `${doc.name} has been shared`,
      })
    }
  }

  const generateProgressPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf")

      const pdf = new jsPDF()
      const date = new Date().toLocaleDateString()
      const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"User","email":"user@example.com"}')

      // Header
      pdf.setFontSize(20)
      pdf.setTextColor(59, 130, 246)
      pdf.text("Project Progress Report", 105, 20, { align: "center" })

      // Company Stamp Area
      pdf.setDrawColor(59, 130, 246)
      pdf.setLineWidth(2)
      pdf.rect(150, 10, 40, 20)
      pdf.setFontSize(8)
      pdf.setTextColor(59, 130, 246)
      pdf.text("COMPANY", 170, 17, { align: "center" })
      pdf.text("STAMP", 170, 22, { align: "center" })
      pdf.text("OFFICIAL", 170, 27, { align: "center" })

      // Project Info
      pdf.setFontSize(11)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Report Date: ${date}`, 20, 40)
      pdf.text(`Project ID: SIID-${Math.floor(Math.random() * 10000)}`, 20, 47)
      pdf.text(`Prepared By: ${currentUser.name}`, 20, 54)

      pdf.setDrawColor(200, 200, 200)
      pdf.line(20, 60, 190, 60)

      // Current Work Stage
      pdf.setFontSize(13)
      pdf.setTextColor(59, 130, 246)
      pdf.text("Current Work Stage", 20, 70)

      pdf.setFontSize(11)
      pdf.setTextColor(0, 0, 0)
      pdf.text("Stage: Foundation & Structural Work", 20, 80)
      pdf.text("Progress: 45% Complete", 20, 87)
      pdf.text("Status: On Schedule", 20, 94)

      pdf.line(20, 100, 190, 100)

      // Completed Tasks
      pdf.setFontSize(13)
      pdf.setTextColor(34, 197, 94)
      pdf.text("Completed Tasks", 20, 110)

      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      const completedTasks = [
        "Site survey and soil testing",
        "Architectural plans approved",
        "Foundation excavation completed",
        "Plinth beam casting done",
        "Ground floor column works finished",
      ]

      let yPos = 120
      completedTasks.forEach((task) => {
        pdf.text(`✓ ${task}`, 25, yPos)
        yPos += 7
      })

      pdf.line(20, yPos + 5, 190, yPos + 5)

      // Pending Tasks
      pdf.setFontSize(13)
      pdf.setTextColor(245, 158, 11)
      pdf.text("Pending Tasks", 20, yPos + 15)

      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      const pendingTasks = [
        "First floor slab casting",
        "Electrical conduit installation",
        "Plumbing rough-in work",
        "Brick masonry for walls",
        "Window frame installation",
      ]

      yPos += 25
      pendingTasks.forEach((task) => {
        pdf.text(`○ ${task}`, 25, yPos)
        yPos += 7
      })

      // Authorization Section
      yPos += 15
      pdf.setDrawColor(200, 200, 200)
      pdf.line(20, yPos, 190, yPos)

      yPos += 10
      pdf.setFontSize(11)
      pdf.setTextColor(0, 0, 0)
      pdf.text("Authorized Signatures:", 20, yPos)

      yPos += 15
      pdf.text("Project Manager: _______________________", 20, yPos)
      pdf.text("Site Engineer: _______________________", 20, yPos + 10)
      pdf.text("Contractor: _______________________", 20, yPos + 20)

      // Authority Names
      yPos += 35
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      pdf.text("Authority: SIID Project Management Division", 20, yPos)
      pdf.text(`Approved By: ${currentUser.name} (Project Coordinator)`, 20, yPos + 5)

      // Footer
      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      pdf.text("This is an official document generated by SIID", 105, 280, { align: "center" })
      pdf.text("For queries, contact: support@siid.com", 105, 285, { align: "center" })

      pdf.save(`Progress-Report-${date}.pdf`)

      toast({
        title: "Progress Report Generated",
        description: "PDF with company stamp and signatures has been downloaded",
      })
    } catch (error) {
      console.error("PDF Generation Error:", error)
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card className="p-6 border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Document Manager</h3>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={showPhotoGallery ? "default" : "outline"}
              onClick={() => setShowPhotoGallery(!showPhotoGallery)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Photos
            </Button>
            <Button size="sm" variant="outline" onClick={generateProgressPDF}>
              <Stamp className="w-4 h-4 mr-2" />
              Progress PDF
            </Button>
            <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {showPhotoGallery && (
          <div className="mb-6">
            <SitePhotoUpload />
          </div>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {["all", "design", "approval", "permit", "contract", "layout", "blueprint", "approved", "pending"].map(
            (f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize whitespace-nowrap"
              >
                {f}
              </Button>
            ),
          )}
        </div>

        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {getTypeIcon(doc.format)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{doc.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{doc.date}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.version}</span>
                    <span>•</span>
                    <span>{doc.uploadedBy}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {getStatusBadge(doc.status)}
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handlePreview(doc)} title="Preview">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)} title="Download">
                    <Download className="w-4 h-4" />
                  </Button>
                  <ShareButton
                    data={{
                      title: doc.name,
                      text: `Document: ${doc.name}\nType: ${doc.type}\nVersion: ${doc.version}`,
                      url: doc.url,
                    }}
                    variant="ghost"
                    size="sm"
                    showText={false}
                  />
                  {!MOCK_DOCUMENTS.find((m) => m.id === doc.id) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredDocs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No documents found</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between text-sm text-muted-foreground">
          <span>{filteredDocs.length} documents</span>
          <span>
            Total:{" "}
            {filteredDocs
              .reduce((acc, d) => {
                const size = Number.parseFloat(d.size.replace(/[^\d.]/g, ""))
                return acc + (Number.isNaN(size) ? 0 : size)
              }, 0)
              .toFixed(1)}{" "}
            MB
          </span>
        </div>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Select Files</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.zip,.dwg"
                onChange={handleFileUpload}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX, CSV, PNG, JPG, ZIP, DWG
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewDoc?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 font-medium capitalize">{previewDoc?.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Format:</span>
                <span className="ml-2 font-medium uppercase">{previewDoc?.format}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2">{previewDoc && getStatusBadge(previewDoc.status)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Version:</span>
                <span className="ml-2 font-medium">{previewDoc?.version}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Size:</span>
                <span className="ml-2 font-medium">{previewDoc?.size}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Uploaded By:</span>
                <span className="ml-2 font-medium">{previewDoc?.uploadedBy}</span>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-8 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Preview not available</p>
              <p className="text-xs text-muted-foreground mt-1">Download the file to view its contents</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDoc(null)}>
              Close
            </Button>
            {previewDoc && (
              <Button onClick={() => handleDownload(previewDoc)}>
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
