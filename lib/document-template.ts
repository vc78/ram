import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

/**
 * Professional document template with company branding
 */

export interface DocumentTemplateConfig {
    title: string
    subtitle?: string
    content?: string
    sections?: Array<{
        heading: string
        content: string | string[]
    }>
    data?: { [key: string]: string | number }[]
    columns?: string[]
    footerText?: string
    companyName?: string
    companyLogoPath?: string
}

const COMPANY_NAME = "SIID - Smart Intelligent Integrated Design"
const COMPANY_LOGO_COLOR = [59, 130, 246] // Primary blue
const BRANDING_COLOR = [59, 130, 246]
const TEXT_COLOR = [15, 23, 42] // Dark gray
const MUTED_COLOR = [100, 116, 139] // Muted gray
const ACCENT_COLOR = [244, 63, 94] // Rose/red accent

/**
 * Creates a professional PDF header with company branding
 */
export function createDocumentHeader(doc: jsPDF, title: string, subtitle?: string) {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Header background
    doc.setFillColor(...BRANDING_COLOR)
    doc.rect(0, 0, pageWidth, 40, "F")

    // Company name/logo area
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("SIID", 15, 15)
    doc.setFontSize(8)
    doc.text("Smart Intelligent Integrated Design", 15, 22)

    // Title on the right
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(title, pageWidth - 15, 15, { align: "right" })

    // Subtitle if provided
    if (subtitle) {
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.text(subtitle, pageWidth - 15, 23, { align: "right" })
    }

    // Border line
    doc.setDrawColor(...BRANDING_COLOR)
    doc.setLineWidth(0.5)
    doc.line(0, 40, pageWidth, 40)

    return 50 // Return Y position for content
}

/**
 * Creates a professional footer with company details
 */
export function createDocumentFooter(doc: jsPDF, customText?: string) {
    const pageHeight = doc.internal.pageSize.getHeight()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Footer line
    doc.setDrawColor(...MUTED_COLOR)
    doc.setLineWidth(0.3)
    doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25)

    // Footer text
    doc.setFontSize(8)
    doc.setTextColor(...MUTED_COLOR)
    doc.setFont("helvetica", "normal")

    const footerText = customText || "Official SIID Document | Confidential"
    doc.text(footerText, 15, pageHeight - 18)

    // Company branding footer
    doc.setFontSize(7)
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, pageHeight - 18, {
        align: "right",
    })
    doc.text("© 2024 SIID. All rights reserved.", pageWidth - 15, pageHeight - 13, {
        align: "right",
    })
}

/**
 * Add a section with heading and content
 */
export function addSection(
    doc: jsPDF,
    yPosition: number,
    heading: string,
    content: string | string[],
    pageWidth: number,
    pageHeight: number
) {
    let currentY = yPosition

    // Check if need new page
    if (currentY > pageHeight - 40) {
        doc.addPage()
        currentY = 20
        createDocumentHeader(doc, "Document Continuation")
    }

    // Section heading
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(...BRANDING_COLOR)
    doc.text(heading, 15, currentY)
    currentY += 6

    // Section content
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...TEXT_COLOR)

    if (Array.isArray(content)) {
        content.forEach((line) => {
            const wrappedText = doc.splitTextToSize(line, pageWidth - 30)
            doc.text(wrappedText, 15, currentY)
            currentY += wrappedText.length * 5 + 3
        })
    } else {
        const wrappedText = doc.splitTextToSize(content, pageWidth - 30)
        doc.text(wrappedText, 15, currentY)
        currentY += wrappedText.length * 5
    }

    currentY += 5

    return currentY
}

/**
 * Add a data table with professional styling
 */
export function addDataTable(
    doc: jsPDF,
    yPosition: number,
    data: { [key: string]: string | number }[],
    columns: string[],
    pageHeight: number
) {
    if (data.length === 0) return yPosition

    const pageWidth = doc.internal.pageSize.getWidth()

    // Check if need new page
    if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = 20
        createDocumentHeader(doc, "Document Continuation")
    }

    const tableData = data.map((row) =>
        columns.map((col) => String(row[col] || "N/A"))
    )

    autoTable(doc, {
        startY: yPosition,
        head: [columns],
        body: tableData,
        theme: "grid",
        headStyles: {
            fillColor: BRANDING_COLOR,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 10,
            halign: "center",
        },
        bodyStyles: {
            textColor: TEXT_COLOR,
            fontSize: 9,
        },
        alternateRowStyles: {
            fillColor: [244, 244, 245],
        },
        margin: { left: 15, right: 15 },
        didDrawPage: () => {
            createDocumentFooter(doc)
        },
    })

    return (doc as any).lastAutoTable.finalY + 10
}

/**
 * Add key-value pairs as a professional info box
 */
export function addInfoBox(
    doc: jsPDF,
    yPosition: number,
    data: { [key: string]: string | number },
    pageWidth: number,
    pageHeight: number
) {
    let currentY = yPosition

    // Check if need new page
    if (currentY > pageHeight - 50) {
        doc.addPage()
        currentY = 20
        createDocumentHeader(doc, "Document Continuation")
    }

    // Light background
    doc.setFillColor(243, 244, 246)
    doc.rect(15, currentY, pageWidth - 30, Object.keys(data).length * 8 + 5, "F")

    // Border
    doc.setDrawColor(...BRANDING_COLOR)
    doc.setLineWidth(0.5)
    doc.rect(15, currentY, pageWidth - 30, Object.keys(data).length * 8 + 5)

    // Content
    doc.setFontSize(9)
    currentY += 5

    Object.entries(data).forEach(([key, value]) => {
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...BRANDING_COLOR)
        doc.text(`${key}:`, 20, currentY)

        doc.setFont("helvetica", "normal")
        doc.setTextColor(...TEXT_COLOR)
        const wrappedValue = doc.splitTextToSize(String(value), pageWidth - 80)
        doc.text(wrappedValue, 80, currentY)

        currentY += 8
    })

    return currentY + 8
}

/**
 * Create a complete professional document
 */
export async function generateProfessionalDocument(
    config: DocumentTemplateConfig
): Promise<jsPDF> {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    let yPosition = createDocumentHeader(
        doc,
        config.title,
        config.subtitle
    )

    // Main content
    if (config.content) {
        yPosition = addSection(doc, yPosition, "Overview", config.content, pageWidth, pageHeight)
    }

    // Sections
    if (config.sections) {
        for (const section of config.sections) {
            yPosition = addSection(doc, yPosition, section.heading, section.content, pageWidth, pageHeight)
        }
    }

    // Data table
    if (config.data && config.columns) {
        yPosition = addDataTable(doc, yPosition, config.data, config.columns, pageHeight)
    }

    // Info box
    if (config.data && !config.columns) {
        const infoData = Array.isArray(config.data) ? config.data[0] : config.data
        yPosition = addInfoBox(doc, yPosition, infoData as { [key: string]: string | number }, pageWidth, pageHeight)
    }

    // Footer on all pages
    const totalPages = (doc as any).getNumberOfPages?.() || 1
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        createDocumentFooter(doc, config.footerText)
    }

    return doc
}

/**
 * Quick export function for simple documents
 */
export async function exportAsBeautifulPDF(
    filename: string,
    title: string,
    data: any,
    options?: {
        subtitle?: string
        sections?: Array<{ heading: string; content: string | string[] }>
        columns?: string[]
    }
): Promise<void> {
    const doc = await generateProfessionalDocument({
        title,
        subtitle: options?.subtitle,
        data: Array.isArray(data) ? data : [data],
        columns: options?.columns,
        sections: options?.sections,
        footerText: "Official Project Document | Confidential",
    })

    doc.save(filename)
}
