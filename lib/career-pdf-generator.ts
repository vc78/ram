import { generateProfessionalDocument } from "./document-template"

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
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  if (action === "approved") {
    const approvalSections = [
      {
        heading: "Application Decision",
        content: [
          `We are pleased to inform you that your application for the position of ${application.role} for our ${application.project} project has been successfully APPROVED.`,
          "",
          `After careful review of your qualifications, experience, and skills, our team is impressed with your profile.`
        ]
      },
      {
        heading: "Application Details",
        content: [
          `Position: ${application.role}`,
          `Project: ${application.project}`,
          `Experience: ${application.experience || "As per resume"}`,
          `Match Score: ${application.matchScore || "N/A"}%`,
          `Application Date: ${application.appliedDate || "N/A"}`
        ]
      },
      {
        heading: "Next Steps",
        content: [
          "1. You will be contacted by our HR team within 2-3 business days to discuss offer details",
          "2. Please keep the following documents ready for verification:",
          "   • Educational certificates and transcripts",
          "   • Experience letters from previous employers",
          "   • Valid government-issued ID proof",
          "   • PAN card and Aadhaar card",
          "3. A formal offer letter will be sent to your registered email address",
          "4. Please confirm your acceptance within 7 days of receiving the offer"
        ]
      }
    ]

    const pdf = await generateProfessionalDocument({
      title: "Position Approval Letter",
      subtitle: `Ref: SIID/HR/APPROVED/${application.id}/${new Date().getFullYear()}`,
      sections: approvalSections,
      footerText: `Candidate: ${application.candidateName} | Date: ${currentDate} | SIID HR Department`
    })

    pdf.save(`SIID-Approval-${application.id}.pdf`)
  } else {
    const rejectionSections = [
      {
        heading: "Application Status",
        content: [
          `Thank you for your interest in the position of ${application.role} for our ${application.project} project.`,
          "",
          `After careful consideration of all applications received, we regret to inform you that we have decided not to proceed with your application at this time.`
        ]
      },
      {
        heading: "Application Details",
        content: [
          `Position: ${application.role}`,
          `Project: ${application.project}`,
          `Application Date: ${application.appliedDate || "N/A"}`
        ]
      },
      {
        heading: "Feedback & Future Opportunities",
        content: [
          "We appreciate the effort you have put into preparing your application. Please continue to explore other opportunities with SIID.",
          "We encourage you to apply for other positions that match your skill set and expertise.",
          "For any inquiries or questions, please feel free to contact our HR department."
        ]
      }
    ]

    const pdf = await generateProfessionalDocument({
      title: "Application Status Letter",
      subtitle: `Ref: SIID/HR/REJECTED/${application.id}/${new Date().getFullYear()}`,
      sections: rejectionSections,
      footerText: `Candidate: ${application.candidateName} | Date: ${currentDate} | SIID HR Department`
    })

    pdf.save(`SIID-Rejection-${application.id}.pdf`)
  }
}

