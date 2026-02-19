"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, FolderArchive, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  exportProjectToPDF,
  exportProjectToExcel,
  downloadAllDesignsAsZip,
  exportProjectComplete,
} from "@/lib/export-utils"
import type { ProjectData } from "@/lib/export-utils"

interface ExportMenuProps {
  project: ProjectData
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ExportMenu({ project, variant = "outline", size = "sm" }: ExportMenuProps) {
  const { toast } = useToast()
  const [exporting, setExporting] = useState<string | null>(null)

  const handleExport = async (type: "pdf" | "excel" | "zip" | "all") => {
    setExporting(type)

    try {
      switch (type) {
        case "pdf":
          await exportProjectToPDF(project)
          toast({
            title: "PDF exported",
            description: "Project report has been downloaded as PDF.",
          })
          break

        case "excel":
          exportProjectToExcel(project)
          toast({
            title: "Excel exported",
            description: "Project data has been downloaded as Excel file.",
          })
          break

        case "zip":
          await downloadAllDesignsAsZip(project)
          toast({
            title: "Images downloaded",
            description: "All design images have been packaged and downloaded.",
          })
          break

        case "all":
          await exportProjectComplete(project)
          toast({
            title: "Complete export",
            description: "All project files (PDF, Excel, and images) have been downloaded.",
          })
          break
      }
    } catch (error) {
      console.error("[v0] Export error:", error)
      toast({
        title: "Export failed",
        description: "Failed to export project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExporting(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={!!exporting}>
          {exporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("pdf")} disabled={!!exporting}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")} disabled={!!exporting}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("zip")} disabled={!!exporting}>
          <FolderArchive className="w-4 h-4 mr-2" />
          Download Images (ZIP)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("all")} disabled={!!exporting}>
          <Download className="w-4 h-4 mr-2" />
          Export All Formats
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
