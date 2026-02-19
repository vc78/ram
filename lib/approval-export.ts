import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export interface ApprovalProjectData {
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
 * Generate an approved designs PDF with all project designs and authorization stamp
 */
export async function generateApprovedDesignsPDF(project: ApprovalProjectData): Promise<void> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Helper function to add authorization stamp to each page
  const addAuthorizationStamp = () => {
    const stampX = pageWidth - 60
    const stampY = pageHeight - 45

    // Draw outer circle
    doc.setDrawColor(0, 100, 0)
    doc.setLineWidth(1.5)
    doc.circle(stampX, stampY, 25)

    // Draw inner circle
    doc.setLineWidth(0.5)
    doc.circle(stampX, stampY, 20)

    // Add text curved around the stamp
    doc.setFontSize(6)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 100, 0)
    doc.text("HIGHER COMMISSION", stampX, stampY - 14, { align: "center" })
    doc.text("BUILDING AUTHORITY", stampX, stampY + 17, { align: "center" })

    // Add center content
    doc.setFontSize(7)
    doc.text("APPROVED", stampX, stampY - 5, { align: "center" })

    // Add checkmark
    doc.setFontSize(14)
    doc.text("✓", stampX, stampY + 3, { align: "center" })

    // Add date
    doc.setFontSize(5)
    const approvalDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    doc.text(approvalDate, stampX, stampY + 10, { align: "center" })

    // Add reference number
    const refNumber = `REF: ${project.id.slice(0, 8).toUpperCase()}`
    doc.text(refNumber, stampX, stampY + 13, { align: "center" })

    // Reset text color
    doc.setTextColor(0, 0, 0)
  }

  // Helper function to add page header
  const addPageHeader = (title: string) => {
    doc.setFillColor(20, 60, 120)
    doc.rect(0, 0, pageWidth, 25, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(title, pageWidth / 2, 16, { align: "center" })
    doc.setTextColor(0, 0, 0)
  }

  // Helper function to add page footer
  const addPageFooter = (pageNum: number, totalPages: number) => {
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" })
    doc.text(`Project: ${project.name} | Generated: ${new Date().toLocaleString()}`, 14, pageHeight - 10)
    doc.setTextColor(0, 0, 0)
  }

  // Helper function to load and add image
  const addImageToPage = async (
    imageUrl: string,
    yPos: number,
    maxWidth: number,
    maxHeight: number,
  ): Promise<number> => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })

      // Calculate dimensions maintaining aspect ratio
      const img = new Image()
      await new Promise((resolve) => {
        img.onload = resolve
        img.src = base64
      })

      let width = maxWidth
      let height = (img.height / img.width) * width
      if (height > maxHeight) {
        height = maxHeight
        width = (img.width / img.height) * height
      }

      const xPos = (pageWidth - width) / 2
      doc.addImage(base64, "JPEG", xPos, yPos, width, height)
      return yPos + height + 10
    } catch (error) {
      console.error("Failed to add image:", error)
      return yPos
    }
  }

  const designs = project.designs
  const hasVariants = designs?.variants && Array.isArray(designs.variants) && designs.variants.length > 0
  const active = hasVariants ? designs.variants[0] : designs

  // Collect all pages we'll generate to calculate total
  const pages: { title: string; content: () => Promise<void> }[] = []

  // === PAGE 1: Cover Page ===
  pages.push({
    title: "Cover",
    content: async () => {
      // Header banner
      doc.setFillColor(20, 60, 120)
      doc.rect(0, 0, pageWidth, 50, "F")

      // Title
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text("APPROVED DESIGN PACKAGE", pageWidth / 2, 25, { align: "center" })
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("Official Building Commission Documentation", pageWidth / 2, 38, { align: "center" })

      // Project name
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(28)
      doc.setFont("helvetica", "bold")
      doc.text(project.name, pageWidth / 2, 80, { align: "center" })

      // Project type badge
      doc.setFillColor(230, 240, 250)
      doc.roundedRect(pageWidth / 2 - 30, 88, 60, 12, 3, 3, "F")
      doc.setFontSize(10)
      doc.setTextColor(20, 60, 120)
      doc.text(project.type.toUpperCase(), pageWidth / 2, 96, { align: "center" })

      // Project details
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      let yPos = 120

      const details = [
        { label: "Location", value: project.location },
        { label: "Budget", value: project.budget },
        { label: "Total Estimated Cost", value: `$${active?.estimatedCost?.total?.toLocaleString() || "N/A"}` },
        { label: "Project Duration", value: active?.timeline?.total || "N/A" },
        { label: "Approval Date", value: new Date().toLocaleDateString() },
        { label: "Reference Number", value: `SIID-${project.id.slice(0, 8).toUpperCase()}` },
      ]

      details.forEach((detail) => {
        doc.setFont("helvetica", "bold")
        doc.text(`${detail.label}:`, 40, yPos)
        doc.setFont("helvetica", "normal")
        doc.text(detail.value, 100, yPos)
        yPos += 10
      })

      // Description box
      yPos += 10
      doc.setFillColor(245, 245, 245)
      doc.roundedRect(30, yPos, pageWidth - 60, 40, 3, 3, "F")
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("Project Description:", 35, yPos + 10)
      doc.setFont("helvetica", "normal")
      const descLines = doc.splitTextToSize(project.description, pageWidth - 70)
      doc.text(descLines, 35, yPos + 20)

      // Included designs section
      yPos += 55
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("This Package Includes:", 40, yPos)
      yPos += 8

      const includedDesigns = [
        "Architectural Design & Floor Plans",
        "Structural Engineering Plans",
        "Plumbing System Layout",
        "Electrical System Design",
        "Interior Design Specifications",
        "Exterior & Landscaping Design",
      ]

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      includedDesigns.forEach((design) => {
        doc.setFillColor(0, 150, 0)
        doc.circle(45, yPos - 1.5, 2, "F")
        doc.text(design, 52, yPos)
        yPos += 7
      })

      addAuthorizationStamp()
    },
  })

  // === PAGE 2: Cost & Timeline Summary ===
  pages.push({
    title: "Cost & Timeline",
    content: async () => {
      addPageHeader("COST ESTIMATION & PROJECT TIMELINE")

      let yPos = 40

      // Cost Estimation Table
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Cost Breakdown", 14, yPos)
      yPos += 8

      const costData = [
        ["Construction", `$${active?.estimatedCost?.construction?.toLocaleString() || "0"}`],
        ["Materials", `$${active?.estimatedCost?.materials?.toLocaleString() || "0"}`],
        ["Labor", `$${active?.estimatedCost?.labor?.toLocaleString() || "0"}`],
      ]

      autoTable(doc, {
        startY: yPos,
        head: [["Category", "Estimated Cost"]],
        body: costData,
        theme: "grid",
        headStyles: { fillColor: [20, 60, 120], fontSize: 11 },
        bodyStyles: { fontSize: 10 },
        footStyles: { fillColor: [230, 240, 250], textColor: [0, 100, 0], fontStyle: "bold" },
        foot: [["TOTAL", `$${active?.estimatedCost?.total?.toLocaleString() || "0"}`]],
        margin: { left: 14, right: pageWidth / 2 + 10 },
        tableWidth: pageWidth / 2 - 20,
      })

      // Timeline Table
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Project Timeline", pageWidth / 2 + 10, 40)

      const timelineData = [
        ["Design Phase", active?.timeline?.design || "N/A"],
        ["Permits & Approvals", active?.timeline?.permits || "N/A"],
        ["Construction", active?.timeline?.construction || "N/A"],
      ]

      autoTable(doc, {
        startY: 48,
        head: [["Phase", "Duration"]],
        body: timelineData,
        theme: "grid",
        headStyles: { fillColor: [20, 60, 120], fontSize: 11 },
        bodyStyles: { fontSize: 10 },
        footStyles: { fillColor: [230, 240, 250], textColor: [0, 100, 0], fontStyle: "bold" },
        foot: [["TOTAL DURATION", active?.timeline?.total || "N/A"]],
        margin: { left: pageWidth / 2 + 10, right: 14 },
        tableWidth: pageWidth / 2 - 20,
      })

      // Features section
      yPos = (doc as any).lastAutoTable.finalY + 20

      if (active?.architectural?.features) {
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("Key Features", 14, yPos)
        yPos += 8

        const featuresData = active.architectural.features.map((f: string) => [f])
        autoTable(doc, {
          startY: yPos,
          head: [["Approved Features"]],
          body: featuresData,
          theme: "striped",
          headStyles: { fillColor: [20, 60, 120] },
          margin: { left: 14, right: 14 },
        })
      }

      addAuthorizationStamp()
    },
  })

  // === PAGE 3: Architectural Design ===
  pages.push({
    title: "Architectural",
    content: async () => {
      addPageHeader("ARCHITECTURAL DESIGN")

      let yPos = 35

      const arch = active?.architectural
      if (arch) {
        // Floor Plan section
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Floor Plan Specifications", 14, yPos)
        yPos += 6

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        const floorPlanLines = doc.splitTextToSize(arch.floorPlan || "N/A", pageWidth - 28)
        doc.text(floorPlanLines, 14, yPos)
        yPos += floorPlanLines.length * 4 + 8

        // Add floor plan image if available
        if (arch.floorPlanImage) {
          yPos = await addImageToPage(arch.floorPlanImage, yPos, pageWidth - 40, 80)
        }

        // Room dimensions table
        if (arch.dimensions?.rooms && yPos < pageHeight - 80) {
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.text("Room Dimensions", 14, yPos)
          yPos += 6

          const roomData = arch.dimensions.rooms.map((room: any) => [room.name, room.dimensions, `${room.area} sq ft`])

          autoTable(doc, {
            startY: yPos,
            head: [["Room", "Dimensions", "Area"]],
            body: roomData,
            theme: "grid",
            headStyles: { fillColor: [20, 60, 120], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 14, right: 14 },
          })
        }
      }

      addAuthorizationStamp()
    },
  })

  // === PAGE 4: Structural Design ===
  pages.push({
    title: "Structural",
    content: async () => {
      addPageHeader("STRUCTURAL ENGINEERING DESIGN")

      let yPos = 35
      const structural = active?.structural

      if (structural) {
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Foundation System", 14, yPos)
        yPos += 6

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        const foundationLines = doc.splitTextToSize(structural.foundation || "N/A", pageWidth - 28)
        doc.text(foundationLines, 14, yPos)
        yPos += foundationLines.length * 4 + 10

        doc.setFont("helvetica", "bold")
        doc.text("Framing System", 14, yPos)
        yPos += 6
        doc.setFont("helvetica", "normal")
        const framingLines = doc.splitTextToSize(structural.framing || "N/A", pageWidth - 28)
        doc.text(framingLines, 14, yPos)
        yPos += framingLines.length * 4 + 10

        // Add structural image if available
        if (structural.layoutImage) {
          yPos = await addImageToPage(structural.layoutImage, yPos, pageWidth - 40, 80)
        }

        // Materials table
        if (structural.materials) {
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.text("Structural Materials", 14, yPos)
          yPos += 6

          const materialsData = structural.materials.map((m: any) => [m.name, m.specification, m.quantity])

          autoTable(doc, {
            startY: yPos,
            head: [["Material", "Specification", "Quantity"]],
            body: materialsData,
            theme: "grid",
            headStyles: { fillColor: [20, 60, 120], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 14, right: 14 },
          })
        }
      }

      addAuthorizationStamp()
    },
  })

  // === PAGE 5: Plumbing Design ===
  pages.push({
    title: "Plumbing",
    content: async () => {
      addPageHeader("PLUMBING SYSTEM DESIGN")

      let yPos = 35
      const plumbing = active?.plumbing

      if (plumbing) {
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Water Supply System", 14, yPos)
        yPos += 6

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        const waterLines = doc.splitTextToSize(plumbing.waterSupply || "N/A", pageWidth - 28)
        doc.text(waterLines, 14, yPos)
        yPos += waterLines.length * 4 + 10

        doc.setFont("helvetica", "bold")
        doc.text("Drainage System", 14, yPos)
        yPos += 6
        doc.setFont("helvetica", "normal")
        const drainageLines = doc.splitTextToSize(plumbing.drainage || "N/A", pageWidth - 28)
        doc.text(drainageLines, 14, yPos)
        yPos += drainageLines.length * 4 + 10

        // Add plumbing image if available
        if (plumbing.layoutImage) {
          yPos = await addImageToPage(plumbing.layoutImage, yPos, pageWidth - 40, 80)
        }

        // Fixtures table
        if (plumbing.fixtures) {
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.text("Plumbing Fixtures", 14, yPos)
          yPos += 6

          const fixturesData = plumbing.fixtures.map((f: any) => [f.name, f.location, f.quantity])

          autoTable(doc, {
            startY: yPos,
            head: [["Fixture", "Location", "Quantity"]],
            body: fixturesData,
            theme: "grid",
            headStyles: { fillColor: [20, 60, 120], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 14, right: 14 },
          })
        }
      }

      addAuthorizationStamp()
    },
  })

  // === PAGE 6: Electrical Design ===
  pages.push({
    title: "Electrical",
    content: async () => {
      addPageHeader("ELECTRICAL SYSTEM DESIGN")

      let yPos = 35
      const electrical = active?.electrical

      if (electrical) {
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Power Distribution", 14, yPos)
        yPos += 6

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        const powerLines = doc.splitTextToSize(electrical.powerDistribution || "N/A", pageWidth - 28)
        doc.text(powerLines, 14, yPos)
        yPos += powerLines.length * 4 + 10

        doc.setFont("helvetica", "bold")
        doc.text("Lighting Design", 14, yPos)
        yPos += 6
        doc.setFont("helvetica", "normal")
        const lightingLines = doc.splitTextToSize(electrical.lighting || "N/A", pageWidth - 28)
        doc.text(lightingLines, 14, yPos)
        yPos += lightingLines.length * 4 + 10

        // Add electrical image if available
        if (electrical.layoutImage) {
          yPos = await addImageToPage(electrical.layoutImage, yPos, pageWidth - 40, 80)
        }

        // Circuits table
        if (electrical.circuits) {
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.text("Circuit Specifications", 14, yPos)
          yPos += 6

          const circuitsData = electrical.circuits.map((c: any) => [c.name, c.amperage, c.description])

          autoTable(doc, {
            startY: yPos,
            head: [["Circuit", "Amperage", "Description"]],
            body: circuitsData,
            theme: "grid",
            headStyles: { fillColor: [20, 60, 120], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 14, right: 14 },
          })
        }
      }

      addAuthorizationStamp()
    },
  })

  // === PAGE 7: Interior Design ===
  pages.push({
    title: "Interior",
    content: async () => {
      addPageHeader("INTERIOR DESIGN SPECIFICATIONS")

      let yPos = 35
      const interior = active?.interior

      if (interior) {
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Design Concept", 14, yPos)
        yPos += 6

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        const conceptLines = doc.splitTextToSize(interior.concept || "N/A", pageWidth - 28)
        doc.text(conceptLines, 14, yPos)
        yPos += conceptLines.length * 4 + 10

        doc.setFont("helvetica", "bold")
        doc.text("Color Palette", 14, yPos)
        yPos += 6
        doc.setFont("helvetica", "normal")
        const colorLines = doc.splitTextToSize(interior.colorPalette || "N/A", pageWidth - 28)
        doc.text(colorLines, 14, yPos)
        yPos += colorLines.length * 4 + 10

        // Add interior image if available
        if (interior.renderingImage) {
          yPos = await addImageToPage(interior.renderingImage, yPos, pageWidth - 40, 80)
        }

        // Materials table
        if (interior.materials) {
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.text("Interior Materials & Finishes", 14, yPos)
          yPos += 6

          const materialsData = interior.materials.map((m: any) => [m.name, m.application, m.finish])

          autoTable(doc, {
            startY: yPos,
            head: [["Material", "Application", "Finish"]],
            body: materialsData,
            theme: "grid",
            headStyles: { fillColor: [20, 60, 120], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 14, right: 14 },
          })
        }
      }

      addAuthorizationStamp()
    },
  })

  // === PAGE 8: Exterior Design ===
  pages.push({
    title: "Exterior",
    content: async () => {
      addPageHeader("EXTERIOR & LANDSCAPING DESIGN")

      let yPos = 35
      const exterior = active?.exterior

      if (exterior) {
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Facade Design", 14, yPos)
        yPos += 6

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        const facadeLines = doc.splitTextToSize(exterior.facade || "N/A", pageWidth - 28)
        doc.text(facadeLines, 14, yPos)
        yPos += facadeLines.length * 4 + 10

        doc.setFont("helvetica", "bold")
        doc.text("Landscaping Plan", 14, yPos)
        yPos += 6
        doc.setFont("helvetica", "normal")
        const landscapeLines = doc.splitTextToSize(exterior.landscaping || "N/A", pageWidth - 28)
        doc.text(landscapeLines, 14, yPos)
        yPos += landscapeLines.length * 4 + 10

        // Add exterior image if available
        if (exterior.renderingImage) {
          yPos = await addImageToPage(exterior.renderingImage, yPos, pageWidth - 40, 80)
        }

        // Materials table
        if (exterior.materials) {
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.text("Exterior Materials", 14, yPos)
          yPos += 6

          const materialsData = exterior.materials.map((m: any) => [m.name, m.application, m.color])

          autoTable(doc, {
            startY: yPos,
            head: [["Material", "Application", "Color"]],
            body: materialsData,
            theme: "grid",
            headStyles: { fillColor: [20, 60, 120], fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            margin: { left: 14, right: 14 },
          })
        }
      }

      addAuthorizationStamp()
    },
  })

  // === PAGE 9: Approval Certificate ===
  pages.push({
    title: "Certificate",
    content: async () => {
      // Decorative border
      doc.setDrawColor(20, 60, 120)
      doc.setLineWidth(3)
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20)
      doc.setLineWidth(1)
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

      // Certificate header
      doc.setFontSize(12)
      doc.setTextColor(20, 60, 120)
      doc.setFont("helvetica", "normal")
      doc.text("HIGHER COMMISSION FOR BUILDING AUTHORITY", pageWidth / 2, 40, { align: "center" })

      doc.setFontSize(28)
      doc.setFont("helvetica", "bold")
      doc.text("CERTIFICATE OF APPROVAL", pageWidth / 2, 60, { align: "center" })

      // Decorative line
      doc.setDrawColor(200, 180, 100)
      doc.setLineWidth(2)
      doc.line(50, 70, pageWidth - 50, 70)

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("This is to certify that the following project design has been", pageWidth / 2, 90, { align: "center" })
      doc.text("reviewed and approved by the Higher Commission for Building Authority", pageWidth / 2, 98, {
        align: "center",
      })

      // Project details box
      doc.setFillColor(250, 250, 250)
      doc.roundedRect(30, 110, pageWidth - 60, 60, 5, 5, "F")

      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(20, 60, 120)
      doc.text(project.name, pageWidth / 2, 130, { align: "center" })

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont("helvetica", "normal")
      doc.text(`Project Type: ${project.type.toUpperCase()}`, pageWidth / 2, 145, { align: "center" })
      doc.text(`Location: ${project.location}`, pageWidth / 2, 155, { align: "center" })
      doc.text(`Reference: SIID-${project.id.slice(0, 8).toUpperCase()}`, pageWidth / 2, 165, { align: "center" })

      // Approval details
      doc.setFontSize(11)
      doc.text("This approval includes:", pageWidth / 2, 185, { align: "center" })

      const approvedItems = [
        "Architectural Design & Floor Plans",
        "Structural Engineering Plans",
        "Plumbing System Design",
        "Electrical System Design",
        "Interior Design Specifications",
        "Exterior & Landscaping Design",
      ]

      let yPos = 198
      approvedItems.forEach((item) => {
        doc.setFillColor(0, 150, 0)
        doc.circle(70, yPos - 1.5, 2, "F")
        doc.text(item, 78, yPos)
        yPos += 8
      })

      // Validity statement
      doc.setFontSize(10)
      doc.text(
        `This approval is valid for construction commencing within 12 months of the approval date.`,
        pageWidth / 2,
        yPos + 10,
        { align: "center" },
      )

      // Signature section
      yPos += 30
      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(0.5)
      doc.line(30, yPos, 90, yPos)
      doc.line(pageWidth - 90, yPos, pageWidth - 30, yPos)

      doc.setFontSize(9)
      doc.text("Chief Architect", 60, yPos + 8, { align: "center" })
      doc.text("Building Commissioner", pageWidth - 60, yPos + 8, { align: "center" })

      // Date
      doc.setFontSize(10)
      doc.text(`Approval Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos + 25, { align: "center" })

      // Large central stamp
      const stampX = pageWidth / 2
      const stampY = pageHeight - 50

      doc.setDrawColor(0, 100, 0)
      doc.setLineWidth(2)
      doc.circle(stampX, stampY, 30)
      doc.setLineWidth(1)
      doc.circle(stampX, stampY, 25)

      doc.setFontSize(7)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(0, 100, 0)
      doc.text("HIGHER COMMISSION", stampX, stampY - 18, { align: "center" })
      doc.text("BUILDING AUTHORITY", stampX, stampY + 21, { align: "center" })

      doc.setFontSize(10)
      doc.text("OFFICIALLY", stampX, stampY - 6, { align: "center" })
      doc.setFontSize(12)
      doc.text("APPROVED", stampX, stampY + 4, { align: "center" })

      doc.setFontSize(16)
      doc.text("✓", stampX, stampY + 14, { align: "center" })
    },
  })

  // Generate all pages
  const totalPages = pages.length

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) {
      doc.addPage()
    }
    await pages[i].content()
    addPageFooter(i + 1, totalPages)
  }

  // Save the PDF
  doc.save(`${project.name.replace(/\s+/g, "-")}-APPROVED-DESIGNS.pdf`)
}
