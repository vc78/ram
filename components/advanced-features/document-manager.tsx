"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
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
  Search,
  MoreVertical,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Bot
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ShareButton } from "@/components/share-button"
import { shareDocument } from "@/lib/share-utils"
import { SitePhotoUpload } from "@/components/work-schedule/site-photo-upload"

// Assume these exist in your ui folder, if not, native HTML variants will still render nicely
import { ScrollArea } from "@/components/ui/scroll-area"

interface Document {
  id: string
  name: string
  type: "approval" | "design" | "contract" | "permit" | "report" | "layout" | "blueprint"
  format: "pdf" | "doc" | "docx" | "xls" | "xlsx" | "csv" | "png" | "jpg" | "jpeg" | "zip" | "dwg"
  status: "pending" | "approved" | "draft" | "rejected"
  date: string
  size: string
  version: string
  uploadedBy: string
  url?: string
  mlAnalysis?: {
    summary: string
    confidenceScore: number
    risks: string[]
    financialObligations: string[]
    extractedSpecs: string[]
    docClass: string
  }
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
  {
    id: "7",
    name: "Plumbing Blueprint.pdf",
    type: "blueprint",
    format: "pdf",
    status: "rejected",
    date: "2024-02-01",
    size: "7.2 MB",
    version: "v1.0",
    uploadedBy: "Plumber",
  },
]

type SortField = 'name' | 'date' | 'size' | 'status' | 'type';
type SortOrder = 'asc' | 'desc';

export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isDragging, setIsDragging] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/db/documents")
        if (res.ok) {
          const dbDocs: Document[] = await res.json()
          localStorage.setItem("projectDocuments", JSON.stringify(dbDocs))
          setDocuments([...MOCK_DOCUMENTS, ...dbDocs])
          return
        }
      } catch (err) {
        console.error("Failed to load documents from DB", err)
      }
      const stored = localStorage.getItem("projectDocuments")
      const storedDocs = stored ? JSON.parse(stored) : []
      setDocuments([...MOCK_DOCUMENTS, ...storedDocs])
    }
    load()
  }, [])

  const saveDocuments = async (docs: Document[]) => {
    const userDocs = docs.filter((d) => !MOCK_DOCUMENTS.find((m) => m.id === d.id))
    localStorage.setItem("projectDocuments", JSON.stringify(userDocs))
    setDocuments(docs)
    try {
      await fetch("/api/db/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDocs),
      })
    } catch (err) {
      console.error("Failed to save documents to DB", err)
    }
  }

  // Sorting and Filtering Logic
  const processedDocs = useMemo(() => {
    let result = documents;

    // Filter by type or status
    if (filter !== "all") {
      result = result.filter(d => d.type === filter || d.status === filter);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.uploadedBy.toLowerCase().includes(lowerQuery) ||
        d.type.toLowerCase().includes(lowerQuery)
      );
    }

    // Sorting
    return result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'size') {
        const aSize = Number.parseFloat(a.size.replace(/[^\d.]/g, ""));
        const bSize = Number.parseFloat(b.size.replace(/[^\d.]/g, ""));
        comparison = aSize - bSize;
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [documents, filter, searchQuery, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getTypeIcon = (format: Document["format"]) => {
    const className = "w-5 h-5";
    if (["png", "jpg", "jpeg"].includes(format)) return <FileImage className={`${className} text-blue-500`} />
    if (["xls", "xlsx", "csv"].includes(format)) return <FileSpreadsheet className={`${className} text-green-500`} />
    if (["zip"].includes(format)) return <FileArchive className={`${className} text-amber-500`} />
    if (["dwg"].includes(format)) return <Folder className={`${className} text-purple-500`} />
    return <FileText className={`${className} text-red-500`} />
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-medium flex gap-1 items-center px-2 py-0.5">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-medium flex gap-1 items-center px-2 py-0.5">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none font-medium flex gap-1 items-center px-2 py-0.5">
            <AlertCircle className="w-3 h-3" /> Rejected
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="secondary" className="font-medium px-2 py-0.5">
            Draft
          </Badge>
        )
    }
  }

  const handleDownload = async (doc: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}...`,
    })

    if (doc.url) {
      const a = document.createElement("a")
      a.href = doc.url
      a.download = doc.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return
    }

    if (doc.format === "pdf") {
      try {
        const { jsPDF } = await import("jspdf")
        const pdf = new jsPDF()
        pdf.setFontSize(22)
        pdf.setTextColor(15, 23, 42)
        pdf.text(doc.name, 20, 30)

        pdf.setFontSize(14)
        pdf.setTextColor(100, 116, 139)
        pdf.text(`Official SIID Document Generator`, 20, 40)

        pdf.setDrawColor(226, 232, 240)
        pdf.line(20, 45, 190, 45)

        pdf.setFontSize(12)
        pdf.setTextColor(51, 65, 85)
        pdf.text(`Type: ${doc.type.toUpperCase()}`, 20, 60)
        pdf.text(`Status: ${doc.status.toUpperCase()}`, 20, 70)
        pdf.text(`Uploaded By: ${doc.uploadedBy}`, 20, 80)
        pdf.text(`Date of Issue: ${doc.date}`, 20, 90)
        pdf.text(`Version Code: ${doc.version}`, 20, 100)

        pdf.setDrawColor(59, 130, 246)
        pdf.setLineWidth(1)
        pdf.rect(140, 60, 40, 20)
        pdf.setFontSize(10)
        pdf.setTextColor(59, 130, 246)
        pdf.text("VERIFIED", 160, 70, { align: "center" })
        pdf.text("SIID SYSTEM", 160, 75, { align: "center" })

        pdf.save(doc.name)
      } catch (err) {
        console.error("Failed to generate mock PDF", err)
      }
      return
    }

    // Text File Fallback
    const blob = new Blob([`SIID DIGITAL TWIN - DOCUMENT PLACEHOLDER\n\nFilename: ${doc.name}\nType: ${doc.type}\nStatus: ${doc.status}\nUploaded By: ${doc.uploadedBy}\nDate: ${doc.date}\nVersion: ${doc.version}\n\n*This is an auto-generated system placeholder for demonstration*`], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = doc.name + (doc.name.endsWith(".txt") ? "" : ".txt")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"User"}')
    const form = new FormData()
    Array.from(files).forEach((f) => form.append("files", f))

    // Optimistic UI update could go here
    toast({
      title: "Uploading files...",
      description: "Please wait while we process your documents.",
    })

    try {
      const res = await fetch("/api/uploads/photos", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")

      const newDocs: Document[] = []
      
      for (const file of Array.from(files)) {
        const extension = file.name.split(".").pop()?.toLowerCase() as Document["format"]
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2)
        const urlEntry = data.saved?.find((s: any) => s.filename === file.name)
        const url = urlEntry ? urlEntry.url : URL.createObjectURL(file)

        // Perform ML Analysis
        let mlData = undefined
        try {
          const aiRes = await fetch("/api/analyze-document", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.name, fileType: extension, size: file.size })
          })
          const aiResult = await aiRes.json()
          if (aiResult.success) {
            mlData = aiResult.analysis
          }
        } catch (e) {
          console.error("AI Analysis Failed", e)
        }

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
          url,
          mlAnalysis: mlData
        }
        newDocs.push(newDoc)
      }

      const updatedDocs = [...newDocs, ...documents]
      saveDocuments(updatedDocs)

      toast({
        title: "Upload Successful",
        description: `${newDocs.length} file(s) processed and added to the registry.`,
      })

      setUploadDialogOpen(false)
    } catch (err) {
      toast({
        title: "Upload Error",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this document?")) {
      const updatedDocs = documents.filter((d) => d.id !== id)
      saveDocuments(updatedDocs)
      toast({
        title: "Document Deleted",
        description: "Document has been securely removed.",
      })
    }
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
        title: "Link Copied",
        description: `Sharing link for ${doc.name} copied to clipboard.`,
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
      pdf.setFontSize(24)
      pdf.setTextColor(15, 23, 42)
      pdf.text("SIID Progress Report", 105, 25, { align: "center" })

      pdf.setDrawColor(59, 130, 246)
      pdf.setLineWidth(2)
      pdf.rect(150, 15, 40, 20)
      pdf.setFontSize(8)
      pdf.setTextColor(59, 130, 246)
      pdf.text("DOCUMENT", 170, 22, { align: "center" })
      pdf.text("REGISTRY", 170, 27, { align: "center" })
      pdf.text("OFFICIAL", 170, 32, { align: "center" })

      // Project Info
      pdf.setFontSize(11)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Generated Date: ${date}`, 20, 45)
      pdf.text(`Project Authority: SIID System`, 20, 52)
      pdf.text(`Requested By: ${currentUser.name}`, 20, 59)

      pdf.setDrawColor(226, 232, 240)
      pdf.line(20, 65, 190, 65)

      // Summary
      pdf.setFontSize(14)
      pdf.setTextColor(15, 23, 42)
      pdf.text("Document Repository Summary", 20, 75)

      pdf.setFontSize(11)
      pdf.setTextColor(71, 85, 105)
      pdf.text(`Total Documents Managed: ${documents.length}`, 20, 85)
      pdf.text(`Approved Documents: ${documents.filter(d => d.status === 'approved').length}`, 20, 92)
      pdf.text(`Pending Review: ${documents.filter(d => d.status === 'pending').length}`, 20, 99)

      pdf.line(20, 105, 190, 105)

      // Footer
      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      pdf.text("SIID AI Management Platform - Official Audit Export", 105, 280, { align: "center" })
      pdf.text("Contact Support: support@siidstarc.com", 105, 285, { align: "center" })

      pdf.save(`SIID-Document-Report-${date}.pdf`)

      toast({
        title: "Report Generated",
        description: "Official Document Summary has been downloaded.",
      })
    } catch (error) {
      console.error("PDF Error:", error)
      toast({
        title: "Report Generation Failed",
        description: "Could not assemble the PDF report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filterOptions = ["all", "approval", "design", "contract", "permit", "layout", "blueprint", "approved", "pending", "rejected"]

  return (
    <>
      <Card
        className={`p-6 border-border shadow-sm flex flex-col min-h-[600px] transition-all duration-200 ${isDragging ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <div className="text-center animate-in fade-in zoom-in duration-200 pointer-events-none">
              <Upload className="w-16 h-16 mx-auto mb-4 text-primary animate-bounce" />
              <h2 className="text-2xl font-bold text-primary">Drop files to upload</h2>
              <p className="text-muted-foreground mt-2">Documents will be added to the registry</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Folder className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Document Repository</h3>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <span>{documents.length} Files</span>
                <span className="w-1 h-1 rounded-full bg-border inline-block"></span>
                <span>
                  {documents.reduce((acc, d) => {
                    const size = Number.parseFloat(d.size.replace(/[^\d.]/g, ""))
                    return acc + (Number.isNaN(size) ? 0 : size)
                  }, 0).toFixed(1)} MB
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-9 bg-background focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant={showPhotoGallery ? "secondary" : "outline"}
              onClick={() => setShowPhotoGallery(!showPhotoGallery)}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden lg:inline">Site Photos</span>
            </Button>
            <Button variant="outline" onClick={generateProgressPDF} className="gap-2">
              <Stamp className="w-4 h-4" />
              <span className="hidden lg:inline">Report</span>
            </Button>
            <Button onClick={() => setUploadDialogOpen(true)} className="gap-2 shadow-sm">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="relative w-full mb-6 md:hidden">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files, types, or owners..."
            className="pl-9 bg-background focus-visible:ring-1 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {showPhotoGallery && (
          <div className="mb-6 animate-in slide-in-from-top-4 fade-in duration-300">
            <SitePhotoUpload />
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 -mx-2 px-2 custom-scrollbar">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mr-2">
            <Filter className="w-4 h-4" />
            Filters:
          </div>
          {filterOptions.map((f) => (
            <Badge
              key={f}
              variant={filter === f ? "default" : "outline"}
              className={`cursor-pointer capitalize whitespace-nowrap px-3 py-1 text-sm font-medium transition-colors ${filter === f ? 'shadow-sm' : 'hover:bg-muted bg-background'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </Badge>
          ))}
        </div>

        {/* Industry Standard Data Table */}
        <div className="rounded-xl border bg-card overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 border-b uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4 font-medium cursor-pointer hover:bg-muted/80 transition-colors group" onClick={() => toggleSort('name')}>
                    <div className="flex items-center gap-1">
                      File Name
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortField === 'name' ? 'opacity-100 text-foreground' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </th>
                  <th className="px-5 py-4 font-medium hidden md:table-cell cursor-pointer hover:bg-muted/80 transition-colors group" onClick={() => toggleSort('status')}>
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortField === 'status' ? 'opacity-100 text-foreground' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </th>
                  <th className="px-5 py-4 font-medium hidden lg:table-cell cursor-pointer hover:bg-muted/80 transition-colors group" onClick={() => toggleSort('type')}>
                    <div className="flex items-center gap-1">
                      Category
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortField === 'type' ? 'opacity-100 text-foreground' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </th>
                  <th className="px-5 py-4 font-medium hidden sm:table-cell cursor-pointer hover:bg-muted/80 transition-colors group" onClick={() => toggleSort('date')}>
                    <div className="flex items-center gap-1">
                      Uploaded
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortField === 'date' ? 'opacity-100 text-foreground' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {processedDocs.length > 0 ? (
                  processedDocs.map((doc) => (
                    <tr key={doc.id} className="bg-background hover:bg-muted/40 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-background border shadow-sm flex items-center justify-center flex-shrink-0">
                            {getTypeIcon(doc.format)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate cursor-pointer hover:underline" onClick={() => setPreviewDoc(doc)}>
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {doc.size} • {doc.version}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="capitalize font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md text-xs">
                          {doc.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{doc.date}</span>
                          <span className="text-xs text-muted-foreground">{doc.uploadedBy}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors hidden sm:flex" onClick={() => handleDownload(doc)} title="Download">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" onClick={() => setPreviewDoc(doc)} title="Preview">
                            <Eye className="w-4 h-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Document Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownload(doc)}>
                                <Download className="w-4 h-4 mr-2" /> Download
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleShare(doc)}>
                                <ShareButton data={{ url: doc.url || "", title: doc.name }} showText={true} className="w-full justify-start p-0 h-auto font-normal" variant="ghost" />
                              </DropdownMenuItem>
                              {!MOCK_DOCUMENTS.find((m) => m.id === doc.id) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => handleDelete(doc.id)}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <h4 className="text-lg font-medium text-foreground">No documents found</h4>
                        <p className="text-sm mt-1 max-w-sm mx-auto">
                          We couldn't find any documents matching your current filters and search query. Try adjusting your criteria.
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => { setFilter("all"); setSearchQuery(""); }}>
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Advanced Upload Dialog via generic HTML dropzone styling */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Upload Documents</DialogTitle>
            <DialogDescription>
              Drag and drop your files here or click to browse.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center hover:bg-muted/50 transition-colors cursor-pointer group relative">
              <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => processFiles(e.target.files)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.zip,.dwg"
              />
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm font-medium">Drag & drop files or click to browse</p>
              <p className="text-xs text-muted-foreground mt-2">
                Supports PDF, Images, Excel, CAD & Archives up to 50MB
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-between items-center bg-muted/30 p-2 -mx-6 -mb-6 px-6 pb-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground tracking-tight">Secure server upload channel activated.</p>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0">
          <div className="p-6 pb-4 border-b bg-muted/10 flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                {previewDoc && getTypeIcon(previewDoc.format)}
                <span className="truncate max-w-[400px]" title={previewDoc?.name}>{previewDoc?.name}</span>
              </DialogTitle>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="font-medium bg-background px-2 py-0.5 rounded-md border shadow-sm">v{previewDoc?.version.replace('v', '')}</span>
                <span>{previewDoc?.size}</span>
                <span>•</span>
                <span>Uploaded {previewDoc?.date}</span>
                <span>•</span>
                <span className="capitalize">{previewDoc?.type}</span>
              </div>
            </div>
            <div className="hidden sm:block">
              {previewDoc && getStatusBadge(previewDoc.status)}
            </div>
          </div>

          <div className="bg-muted min-h-[500px] flex items-center justify-center relative p-8">
            {previewDoc?.url ? (
              <div className="w-full h-full flex items-center justify-center shadow-lg rounded-xl overflow-hidden bg-background">
                {["png", "jpg", "jpeg"].includes(previewDoc.format) ? (
                  <img src={previewDoc.url} alt={previewDoc.name} className="max-w-full max-h-[60vh] object-contain" />
                ) : previewDoc.format === "pdf" ? (
                  <iframe src={previewDoc.url} className="w-full min-h-[60vh]" title={previewDoc.name} />
                ) : (
                  <div className="text-center p-12">
                    <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                      {getTypeIcon(previewDoc.format)}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">File Viewer Unvailable</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                      This file format ({previewDoc.format.toUpperCase()}) requires a specialized local application to view.
                    </p>
                    <Button onClick={() => previewDoc && handleDownload(previewDoc)} className="mt-6">
                      <Download className="w-4 h-4 mr-2" /> Download File
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full max-w-lg bg-background rounded-2xl p-10 text-center shadow-md border animate-in fade-in zoom-in-95 duration-300">
                <FileText className="w-20 h-20 mx-auto mb-6 text-muted-foreground/40" />
                <h3 className="text-xl font-semibold mb-2">Digital Twin Placeholder</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  This mock document demonstrates our document flow. It has not been physically attached to a real file.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="secondary" onClick={() => setPreviewDoc(null)}>Close</Button>
                  <Button onClick={() => previewDoc && handleDownload(previewDoc)}>
                    <Download className="w-4 h-4 mr-2" /> Generate Test File
                  </Button>
                </div>
              </div>
            )}
            
            {previewDoc?.mlAnalysis && (
              <div className="absolute top-4 right-4 w-96 bg-background/95 backdrop-blur shadow-2xl rounded-2xl border p-5 max-h-[80vh] overflow-y-auto z-10 animate-in slide-in-from-right-8">
                <div className="flex items-center gap-2 mb-4 border-b pb-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base leading-none">Smart Document Analysis</h4>
                    <p className="text-xs text-muted-foreground mt-1">{previewDoc.mlAnalysis.docClass} • {previewDoc.mlAnalysis.confidenceScore}% Confidence</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground leading-relaxed">
                    {previewDoc.mlAnalysis.summary}
                  </p>

                  {previewDoc.mlAnalysis.risks.length > 0 && (
                    <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                      <h5 className="font-semibold text-red-800 flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" /> Potential Risks
                      </h5>
                      <ul className="list-disc pl-4 space-y-1 text-red-900/80 text-xs">
                        {previewDoc.mlAnalysis.risks.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}

                  {previewDoc.mlAnalysis.financialObligations.length > 0 && (
                    <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
                      <h5 className="font-semibold text-amber-800 flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5" /> Obligations
                      </h5>
                      <ul className="list-disc pl-4 space-y-1 text-amber-900/80 text-xs">
                        {previewDoc.mlAnalysis.financialObligations.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  )}

                  {previewDoc.mlAnalysis.extractedSpecs.length > 0 && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                      <h5 className="font-semibold text-blue-800 flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider">
                        <Bot className="w-3.5 h-3.5" /> Extracted Specs
                      </h5>
                      <ul className="list-disc pl-4 space-y-1 text-blue-900/80 text-xs">
                        {previewDoc.mlAnalysis.extractedSpecs.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

