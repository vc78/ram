/**
 * Resume/CV parser for extracting information from PDF and DOC files
 */

export interface ParsedResume {
  name: string
  email: string
  phone: string
  skills: string[]
  experience: ExperienceItem[]
  education: EducationItem[]
  summary: string
}

export interface ExperienceItem {
  company: string
  position: string
  duration: string
  description: string
}

export interface EducationItem {
  institution: string
  degree: string
  year: string
}

/**
 * Parse resume from file
 */
export async function parseResume(file: File): Promise<ParsedResume> {
  const text = await extractTextFromFile(file)
  return extractResumeData(text)
}

/**
 * Extract text from PDF or DOC file
 */
async function extractTextFromFile(file: File): Promise<string> {
  // For demo purposes, we'll simulate text extraction
  // In production, you would use libraries like pdf-parse or mammoth

  const fileName = file.name.toLowerCase()

  if (fileName.endsWith(".pdf")) {
    return await extractFromPDF(file)
  } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
    return await extractFromDOC(file)
  }

  throw new Error("Unsupported file format. Please upload PDF or DOC/DOCX")
}

/**
 * Extract text from PDF (simulated for demo)
 */
async function extractFromPDF(file: File): Promise<string> {
  // In production, use pdf-parse or similar library
  // For now, return sample parsed text
  return `
    John Doe
    john.doe@email.com | +1 (555) 123-4567
    
    PROFESSIONAL SUMMARY
    Experienced Civil Engineer with 8+ years in construction and structural design
    
    SKILLS
    • Structural Analysis • AutoCAD • Revit • Project Management
    • Building Codes • Construction Management • Steel Design
    
    EXPERIENCE
    Senior Structural Engineer | ABC Construction | 2020 - Present
    - Led structural design for 15+ commercial projects
    - Managed team of 5 junior engineers
    
    Structural Engineer | XYZ Engineering | 2016 - 2020
    - Designed structural systems for residential buildings
    - Conducted site inspections and quality control
    
    EDUCATION
    Master of Science in Civil Engineering | MIT | 2016
    Bachelor of Engineering in Civil Engineering | State University | 2014
  `
}

/**
 * Extract text from DOC/DOCX (simulated for demo)
 */
async function extractFromDOC(file: File): Promise<string> {
  // In production, use mammoth.js or similar library
  return await extractFromPDF(file) // Use same sample for demo
}

/**
 * Extract structured data from resume text
 */
function extractResumeData(text: string): ParsedResume {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  // Extract name (usually first non-empty line)
  const name = extractName(lines)

  // Extract contact info
  const email = extractEmail(text)
  const phone = extractPhone(text)

  // Extract skills
  const skills = extractSkills(text)

  // Extract experience
  const experience = extractExperience(text)

  // Extract education
  const education = extractEducation(text)

  // Extract summary
  const summary = extractSummary(text)

  return {
    name,
    email,
    phone,
    skills,
    experience,
    education,
    summary,
  }
}

function extractName(lines: string[]): string {
  // First line is usually the name
  const nameLine = lines[0]
  if (nameLine && nameLine.length < 50 && !nameLine.includes("@")) {
    return nameLine
  }
  return "Unknown"
}

function extractEmail(text: string): string {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/
  const match = text.match(emailRegex)
  return match ? match[0] : ""
}

function extractPhone(text: string): string {
  const phoneRegex = /[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}/
  const match = text.match(phoneRegex)
  return match ? match[0] : ""
}

function extractSkills(text: string): string[] {
  const skills: string[] = []
  const skillsSection = text.match(/SKILLS(.*?)(?=EXPERIENCE|EDUCATION|$)/is)

  if (skillsSection) {
    const skillText = skillsSection[1]
    // Extract items starting with • or - or numbered
    const skillMatches = skillText.match(/[•\-*]\s*([^\n•\-*]+)/g)
    if (skillMatches) {
      skillMatches.forEach((skill) => {
        const cleaned = skill.replace(/[•\-*]\s*/, "").trim()
        if (cleaned) skills.push(cleaned)
      })
    }
  }

  return skills
}

function extractExperience(text: string): ExperienceItem[] {
  const experience: ExperienceItem[] = []
  const expSection = text.match(/EXPERIENCE(.*?)(?=EDUCATION|CERTIFICATIONS|$)/is)

  if (expSection) {
    const expText = expSection[1]
    // Simple pattern matching for job entries
    const jobPattern = /([^|\n]+)\s*\|\s*([^|\n]+)\s*\|\s*([^|\n]+)/g
    const matches = [...expText.matchAll(jobPattern)]

    matches.forEach((match) => {
      experience.push({
        position: match[1].trim(),
        company: match[2].trim(),
        duration: match[3].trim(),
        description: "",
      })
    })
  }

  return experience
}

function extractEducation(text: string): EducationItem[] {
  const education: EducationItem[] = []
  const eduSection = text.match(/EDUCATION(.*?)$/is)

  if (eduSection) {
    const eduText = eduSection[1]
    const eduPattern = /([^|\n]+)\s*\|\s*([^|\n]+)\s*\|\s*(\d{4})/g
    const matches = [...eduText.matchAll(eduPattern)]

    matches.forEach((match) => {
      education.push({
        degree: match[1].trim(),
        institution: match[2].trim(),
        year: match[3].trim(),
      })
    })
  }

  return education
}

function extractSummary(text: string): string {
  const summarySection = text.match(/(?:PROFESSIONAL SUMMARY|SUMMARY|OBJECTIVE)(.*?)(?=SKILLS|EXPERIENCE|EDUCATION)/is)
  return summarySection ? summarySection[1].trim() : ""
}

/**
 * Format experience years from resume
 */
export function calculateTotalExperience(experience: ExperienceItem[]): string {
  // Simple calculation - in production would parse dates properly
  return `${experience.length * 2}+ years`
}

/**
 * Format skills list for display
 */
export function formatSkills(skills: string[]): string {
  return skills.join(", ")
}
