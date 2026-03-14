import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import JSZip from "jszip"
import saveAs from "file-saver"

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
 * Export project data to PDF format
 */
export async function exportProjectToPDF(project: ProjectData): Promise<void> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Title
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text(project.name, pageWidth / 2, yPosition, { align: "center" })
  yPosition += 10

  // Project Type
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Project Type: ${project.type.toUpperCase()}`, pageWidth / 2, yPosition, { align: "center" })
  yPosition += 15

  // Project Details Section
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Project Details", 14, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const details = [
    ["Location", project.location],
    ["Budget", project.budget],
    ["Description", project.description],
    ["Created", project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"],
  ]

  autoTable(doc, {
    startY: yPosition,
    head: [["Property", "Value"]],
    body: details,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 14, right: 14 },
  })

  yPosition = (doc as any).lastAutoTable.finalY + 15

  // Cost Estimation
  if (project.designs?.estimatedCost) {
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Cost Estimation", 14, yPosition)
    yPosition += 8

    const costData = [
      ["Construction", `$${project.designs.estimatedCost.construction.toLocaleString()}`],
      ["Materials", `$${project.designs.estimatedCost.materials.toLocaleString()}`],
      ["Labor", `$${project.designs.estimatedCost.labor.toLocaleString()}`],
      ["Total", `$${project.designs.estimatedCost.total.toLocaleString()}`],
    ]

    autoTable(doc, {
      startY: yPosition,
      head: [["Category", "Amount"]],
      body: costData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14, right: 14 },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15
  }

  // Timeline
  if (project.designs?.timeline) {
    if (yPosition > pageHeight - 60) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Project Timeline", 14, yPosition)
    yPosition += 8

    const timelineData = [
      ["Design Phase", project.designs.timeline.design],
      ["Permits & Approvals", project.designs.timeline.permits],
      ["Construction", project.designs.timeline.construction],
      ["Total Duration", project.designs.timeline.total],
    ]

    autoTable(doc, {
      startY: yPosition,
      head: [["Phase", "Duration"]],
      body: timelineData,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14, right: 14 },
    })
  }

  // Add new page for architectural details
  doc.addPage()
  yPosition = 20

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Architectural Design", 14, yPosition)
  yPosition += 8

  if (project.designs?.architectural) {
    const arch = project.designs.architectural
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    // Floor Plan
    doc.setFont("helvetica", "bold")
    doc.text("Floor Plan:", 14, yPosition)
    yPosition += 6
    doc.setFont("helvetica", "normal")
    const floorPlanLines = doc.splitTextToSize(arch.floorPlan || "N/A", pageWidth - 28)
    doc.text(floorPlanLines, 14, yPosition)
    yPosition += floorPlanLines.length * 5 + 8

    // Layout
    if (yPosition > pageHeight - 40) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFont("helvetica", "bold")
    doc.text("Layout:", 14, yPosition)
    yPosition += 6
    doc.setFont("helvetica", "normal")
    const layoutLines = doc.splitTextToSize(arch.layout || "N/A", pageWidth - 28)
    doc.text(layoutLines, 14, yPosition)
    yPosition += layoutLines.length * 5 + 8

    // Room Dimensions
    if (arch.dimensions?.rooms && yPosition < pageHeight - 60) {
      doc.setFont("helvetica", "bold")
      doc.text("Room Dimensions:", 14, yPosition)
      yPosition += 8

      const roomData = arch.dimensions.rooms.map((room: any) => [room.name, room.dimensions, `${room.area} sq ft`])

      autoTable(doc, {
        startY: yPosition,
        head: [["Room", "Dimensions", "Area"]],
        body: roomData,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 14, right: 14 },
      })
    }
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
