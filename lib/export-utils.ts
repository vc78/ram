import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import JSZip from "jszip"
import saveAs from "file-saver"
import {
  createDocumentHeader,
  createDocumentFooter,
  addSection,
  addDataTable,
  addInfoBox,
} from "./document-template"

export interface ProjectData {
  id: string
  name: string
  type: string
  description: string
  location: string
  budget: string
  designs: any
  createdAt?: string
}

/**
 * Export project data to PDF format with professional template
 */
export async function exportProjectToPDF(project: ProjectData): Promise<void> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  let yPosition = createDocumentHeader(doc, project.name, `Project Type: ${project.type.toUpperCase()}`)

  // Project Details
  const details = {
    "Project Location": project.location,
    "Budget Allocation": project.budget,
    "Project Description": project.description,
    "Created Date": project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A",
  }

  yPosition = addInfoBox(doc, yPosition, details, pageWidth, pageHeight)

  // Cost Estimation
  if (project.designs?.estimatedCost) {
    const costData = [
      {
        "Category": "Construction",
        "Amount": `$${project.designs.estimatedCost.construction.toLocaleString()}`
      },
      {
        "Category": "Materials",
        "Amount": `$${project.designs.estimatedCost.materials.toLocaleString()}`
      },
      {
        "Category": "Labor",
        "Amount": `$${project.designs.estimatedCost.labor.toLocaleString()}`
      },
      {
        "Category": "Total",
        "Amount": `$${project.designs.estimatedCost.total.toLocaleString()}`
      },
    ]

    yPosition = addDataTable(
      doc,
      yPosition,
      costData,
      ["Category", "Amount"],
      pageHeight
    )
  }

  // Timeline
  if (project.designs?.timeline) {
    const timelineData = [
      {
        "Phase": "Design Phase",
        "Duration": project.designs.timeline.design
      },
      {
        "Phase": "Permits & Approvals",
        "Duration": project.designs.timeline.permits
      },
      {
        "Phase": "Construction",
        "Duration": project.designs.timeline.construction
      },
      {
        "Phase": "Total Duration",
        "Duration": project.designs.timeline.total
      },
    ]

    yPosition = addDataTable(
      doc,
      yPosition,
      timelineData,
      ["Phase", "Duration"],
      pageHeight
    )
  }

  // Architectural Design
  if (project.designs?.architectural) {
    const arch = project.designs.architectural
    const archContent = [
      `Floor Plan: ${arch.floorPlan || "N/A"}`,
      `Layout: ${arch.layout || "N/A"}`,
    ]
    yPosition = addSection(doc, yPosition, "Architectural Design", archContent, pageWidth, pageHeight)

    // Room Dimensions
    if (arch.dimensions?.rooms) {
      const roomData = arch.dimensions.rooms.map((room: any) => ({
        "Room Name": room.name,
        "Dimensions": room.dimensions,
        "Area": `${room.area} sq ft`
      }))

      yPosition = addDataTable(
        doc,
        yPosition,
        roomData,
        ["Room Name", "Dimensions", "Area"],
        pageHeight
      )
    }
  }

  // Add footer to all pages
  const pageCount = (doc as any).getNumberOfPages?.() || 1
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    createDocumentFooter(doc, `Project Report: ${project.name}`)
  }

  // Save the PDF
  doc.save(`${project.name.replace(/\s+/g, "-")}-project-report.pdf`)
}

/**
 * Export project data to Excel format
 */
export function exportProjectToExcel(project: ProjectData): void {
  const workbook = XLSX.utils.book_new()

  // Project Details Sheet
  const detailsData = [
    ["Project Name", project.name],
    ["Project Type", project.type.toUpperCase()],
    ["Location", project.location],
    ["Budget", project.budget],
    ["Description", project.description],
    ["Created", project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"],
  ]
  const detailsSheet = XLSX.utils.aoa_to_sheet(detailsData)
  XLSX.utils.book_append_sheet(workbook, detailsSheet, "Project Details")

  // Cost Estimation Sheet
  if (project.designs?.estimatedCost) {
    const costData = [
      ["Category", "Amount"],
      ["Construction", project.designs.estimatedCost.construction],
      ["Materials", project.designs.estimatedCost.materials],
      ["Labor", project.designs.estimatedCost.labor],
      ["Total", project.designs.estimatedCost.total],
    ]
    const costSheet = XLSX.utils.aoa_to_sheet(costData)
    XLSX.utils.book_append_sheet(workbook, costSheet, "Cost Estimation")
  }

  // Timeline Sheet
  if (project.designs?.timeline) {
    const timelineData = [
      ["Phase", "Duration"],
      ["Design Phase", project.designs.timeline.design],
      ["Permits & Approvals", project.designs.timeline.permits],
      ["Construction", project.designs.timeline.construction],
      ["Total Duration", project.designs.timeline.total],
    ]
    const timelineSheet = XLSX.utils.aoa_to_sheet(timelineData)
    XLSX.utils.book_append_sheet(workbook, timelineSheet, "Timeline")
  }

  // Room Dimensions Sheet
  if (project.designs?.architectural?.dimensions?.rooms) {
    const roomsData = [["Room Name", "Dimensions", "Area (sq ft)"]]
    project.designs.architectural.dimensions.rooms.forEach((room: any) => {
      roomsData.push([room.name, room.dimensions, room.area])
    })
    const roomsSheet = XLSX.utils.aoa_to_sheet(roomsData)
    XLSX.utils.book_append_sheet(workbook, roomsSheet, "Room Dimensions")
  }

  // Architectural Features Sheet
  if (project.designs?.architectural?.features) {
    const featuresData = [["Feature"]]
    project.designs.architectural.features.forEach((feature: string) => {
      featuresData.push([feature])
    })
    const featuresSheet = XLSX.utils.aoa_to_sheet(featuresData)
    XLSX.utils.book_append_sheet(workbook, featuresSheet, "Features")
  }

  // Save the Excel file
  XLSX.writeFile(workbook, `${project.name.replace(/\s+/g, "-")}-project-data.xlsx`)
}

/**
 * Download all design images as a ZIP file
 */
export async function downloadAllDesignsAsZip(project: ProjectData): Promise<void> {
  const zip = new JSZip()
  const projectFolder = zip.folder(project.name.replace(/\s+/g, "-"))

  if (!projectFolder) {
    throw new Error("Failed to create project folder in ZIP")
  }

  const designs = project.designs
  const imageUrls: { url: string; filename: string }[] = []

  // Collect all image URLs
  if (designs.architectural) {
    if (designs.architectural.floorPlanImage) {
      imageUrls.push({ url: designs.architectural.floorPlanImage, filename: "architectural-floor-plan.jpg" })
    }
    if (designs.architectural.renderingImage) {
      imageUrls.push({ url: designs.architectural.renderingImage, filename: "architectural-rendering.jpg" })
    }
  }

  if (designs.structural) {
    if (designs.structural.layoutImage) {
      imageUrls.push({ url: designs.structural.layoutImage, filename: "structural-layout.jpg" })
    }
    if (designs.structural.detailImage) {
      imageUrls.push({ url: designs.structural.detailImage, filename: "structural-details.jpg" })
    }
  }

  if (designs.plumbing) {
    if (designs.plumbing.layoutImage) {
      imageUrls.push({ url: designs.plumbing.layoutImage, filename: "plumbing-layout.jpg" })
    }
    if (designs.plumbing.isometricImage) {
      imageUrls.push({ url: designs.plumbing.isometricImage, filename: "plumbing-isometric.jpg" })
    }
  }

  if (designs.electrical) {
    if (designs.electrical.layoutImage) {
      imageUrls.push({ url: designs.electrical.layoutImage, filename: "electrical-layout.jpg" })
    }
    if (designs.electrical.singleLineImage) {
      imageUrls.push({ url: designs.electrical.singleLineImage, filename: "electrical-single-line.jpg" })
    }
  }

  if (designs.interior) {
    if (designs.interior.renderingImage) {
      imageUrls.push({ url: designs.interior.renderingImage, filename: "interior-rendering.jpg" })
    }
    if (designs.interior.moodBoardImage) {
      imageUrls.push({ url: designs.interior.moodBoardImage, filename: "interior-moodboard.jpg" })
    }
  }

  if (designs.exterior) {
    if (designs.exterior.renderingImage) {
      imageUrls.push({ url: designs.exterior.renderingImage, filename: "exterior-rendering.jpg" })
    }
    if (designs.exterior.landscapingImage) {
      imageUrls.push({ url: designs.exterior.landscapingImage, filename: "landscaping-plan.jpg" })
    }
  }

  // Download all images and add to ZIP
  const downloadPromises = imageUrls.map(async ({ url, filename }) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      projectFolder.file(filename, blob)
    } catch (error) {
      console.error(`[v0] Failed to download ${filename}:`, error)
    }
  })

  await Promise.all(downloadPromises)

  // Generate and download ZIP
  const zipBlob = await zip.generateAsync({ type: "blob" })
  saveAs(zipBlob, `${project.name.replace(/\s+/g, "-")}-designs.zip`)
}

/**
 * Export project with all formats (PDF, Excel, and Images ZIP)
 */
export async function exportProjectComplete(project: ProjectData): Promise<void> {
  try {
    // Export PDF
    await exportProjectToPDF(project)

    trackExportedDocument({
      name: `${project.name.replace(/\s+/g, "-")}-project-report.pdf`,
      type: "report",
      format: "pdf",
    })

    // Small delay to prevent browser blocking multiple downloads
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Export Excel
    exportProjectToExcel(project)

    trackExportedDocument({
      name: `${project.name.replace(/\s+/g, "-")}-project-data.xlsx`,
      type: "report",
      format: "xlsx",
    })

    // Small delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Export Images ZIP
    await downloadAllDesignsAsZip(project)

    trackExportedDocument({
      name: `${project.name.replace(/\s+/g, "-")}-designs.zip`,
      type: "design",
      format: "zip",
    })
  } catch (error) {
    console.error("[v0] Error during complete export:", error)
    throw error
  }
}

function trackExportedDocument(fileInfo: { name: string; type: string; format: string }) {
  const stored = localStorage.getItem("projectDocuments")
  const docs = stored ? JSON.parse(stored) : []

  const currentUser = JSON.parse(localStorage.getItem("user") || '{"name":"User"}')

  const newDoc = {
    id: crypto.randomUUID(),
    name: fileInfo.name,
    type: fileInfo.type,
    format: fileInfo.format,
    status: "approved",
    date: new Date().toISOString().split("T")[0],
    size: "N/A",
    version: "v1.0",
    uploadedBy: currentUser.name || "System",
  }

  docs.push(newDoc)
  localStorage.setItem("projectDocuments", JSON.stringify(docs))
  fetch("/api/db/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newDoc),
  }).catch((e) => console.error("DB export document failed", e))
}
