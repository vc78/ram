interface ApplicationData {
  id: number
  candidateName: string
  role: string
  project: string
  experience?: string
  email?: string
  phone?: string
  matchScore?: number
  appliedDate?: string
  skills?: string[]
}

export async function generateApprovalLetter(application: ApplicationData, action: "approved" | "rejected") {
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Company Header
  doc.setFillColor(30, 58, 138) // Primary blue color
  doc.rect(0, 0, pageWidth, 40, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("SIID FLASH", pageWidth / 2, 20, { align: "center" })

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Smart Intelligent Infrastructure Design", pageWidth / 2, 28, { align: "center" })
  doc.text("Building Your Dreams with AI-Powered Excellence", pageWidth / 2, 34, { align: "center" })

  // Reset text color
  doc.setTextColor(0, 0, 0)

  // Date and Reference
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  doc.setFontSize(10)
  doc.text(`Date: ${currentDate}`, 14, 55)
  doc.text(`Ref: SIID/HR/${action.toUpperCase()}/${application.id}/${new Date().getFullYear()}`, 14, 62)

  // Recipient Address
  doc.setFont("helvetica", "bold")
  doc.text("To,", 14, 75)
  doc.setFont("helvetica", "normal")
  doc.text(application.candidateName, 14, 82)
  if (application.email) {
    doc.text(`Email: ${application.email}`, 14, 89)
  }
  if (application.phone) {
    doc.text(`Phone: ${application.phone}`, 14, 96)
  }

  // Subject Line
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  const subjectY = application.phone ? 110 : 103
  doc.text(`Subject: Application for ${application.role} Position`, 14, subjectY)

  // Salutation
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  const contentStartY = subjectY + 10
  doc.text(`Dear ${application.candidateName.split(" ")[0]},`, 14, contentStartY)

  if (action === "approved") {
    // Approval Letter Content
    const approvalText = [
      `We are pleased to inform you that your application for the position of ${application.role}`,
      `for our ${application.project} project has been successfully approved. After careful review`,
      `of your qualifications, experience, and skills, our team is impressed with your profile.`,
      "",
      `Your Application Details:`,
      `• Role: ${application.role}`,
      `• Project: ${application.project}`,
      `• Experience: ${application.experience || "As per resume"}`,
      `• Match Score: ${application.matchScore || "N/A"}%`,
      `• Application Date: ${application.appliedDate || "N/A"}`,
      "",
      `Key Skills Identified:`,
      ...(application.skills || ["As mentioned in your application"]).map((skill) => `  ✓ ${skill}`),
      "",
      `Next Steps:`,
      `1. You will be contacted by our HR team within 2-3 business days to discuss the offer details`,
      `2. Please keep the following documents ready for verification:`,
      `   • Educational certificates and transcripts`,
      `   • Experience letters from previous employers`,
      `   • Valid government-issued ID proof`,
      `   • PAN card and Aadhaar card`,
      `   • Recent passport-size photographs`,
      "",
      `3. A formal offer letter will be sent to your registered email address`,
      `4. Please confirm your acceptance within 7 days of receiving the offer`,
      "",
      `We look forward to welcoming you to the SIID FLASH team. Your expertise will be`,
      `valuable in delivering world-class construction projects using AI-powered design solutions.`,
      "",
      `If you have any questions, please feel free to contact our HR department at:`,
      `Email: careers@siidflash.com | Phone: +91-1800-123-4567`,
    ]

    let yPos = contentStartY + 10
    approvalText.forEach((line) => {
      if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = 20
      }
      doc.text(line, 14, yPos, { maxWidth: pageWidth - 28 })
      yPos += 6
    })

    // Signature section
    yPos += 10
    if (yPos > pageHeight - 50) {
      doc.addPage()
      yPos = 20
    }

    doc.setFont("helvetica", "bold")
    doc.text("Best Regards,", 14, yPos)
    yPos += 15
    doc.text("HR Department", 14, yPos)
    yPos += 6
    doc.setFont("helvetica", "normal")
    doc.text("SIID FLASH - Smart Intelligent Infrastructure Design", 14, yPos)
    yPos += 6
    doc.text("www.siidflash.com | careers@siidflash.com", 14, yPos)

    // Approval Stamp
    doc.setFillColor(34, 197, 94) // Green color
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")

    const stampX = pageWidth - 70
    const stampY = yPos - 35
    doc.rect(stampX, stampY, 55, 25, "F")
    doc.text("APPROVED", stampX + 27.5, stampY + 16, { align: "center" })
  } else {
    // Rejection Letter Content
    const rejectionText = [
      `Thank you for your interest in the ${application.role} position for our ${application.project}`,
      `project and for taking the time to apply with SIID FLASH.`,
      "",
      `After careful consideration of all applications received, we regret to inform you that we`,
      `will not be moving forward with your application at this time. This decision was made after`,
      `thorough evaluation of all candidates against our current requirements.`,
      "",
      `Your Application Summary:`,
      `• Role Applied: ${application.role}`,
      `• Project: ${application.project}`,
      `• Application Date: ${application.appliedDate || "N/A"}`,
      "",
      `While your profile demonstrates valuable experience and skills, we have selected candidates`,
      `whose qualifications more closely align with the specific requirements of this particular role.`,
      "",
      `We encourage you to:`,
      `• Keep an eye on our careers portal for future opportunities that may be a better fit`,
      `• Consider applying for other positions that match your expertise`,
      `• Connect with us on professional networks for updates on new openings`,
      "",
      `Your application and credentials will be kept in our database for 12 months and may be`,
      `considered for other suitable positions that become available during this period.`,
      "",
      `We appreciate your interest in SIID FLASH and wish you the very best in your career`,
      `endeavors. We hope you will consider us for future opportunities.`,
      "",
      `If you have any questions or would like feedback on your application, please feel free`,
      `to contact our HR department at careers@siidflash.com`,
    ]

    let yPos = contentStartY + 10
    rejectionText.forEach((line) => {
      if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = 20
      }
      doc.text(line, 14, yPos, { maxWidth: pageWidth - 28 })
      yPos += 6
    })

    // Signature section
    yPos += 10
    if (yPos > pageHeight - 50) {
      doc.addPage()
      yPos = 20
    }

    doc.setFont("helvetica", "bold")
    doc.text("Best Regards,", 14, yPos)
    yPos += 15
    doc.text("HR Department", 14, yPos)
    yPos += 6
    doc.setFont("helvetica", "normal")
    doc.text("SIID FLASH - Smart Intelligent Infrastructure Design", 14, yPos)
    yPos += 6
    doc.text("www.siidflash.com | careers@siidflash.com", 14, yPos)
  }

  // Reset color for footer
  doc.setTextColor(0, 0, 0)

  // Footer
  doc.setFillColor(240, 240, 240)
  doc.rect(0, pageHeight - 15, pageWidth, 15, "F")

  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text("This is a computer-generated document. No signature is required.", pageWidth / 2, pageHeight - 8, {
    align: "center",
  })

  // Save PDF
  const fileName = `${action}_${application.candidateName.replace(/\s+/g, "_")}_${application.role.replace(/\s+/g, "_")}_${Date.now()}.pdf`
  doc.save(fileName)
}
