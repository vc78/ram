import type { NextRequest } from "next/server"

type Application = {
  id: number
  candidateName: string
  role: string
  project: string
  experience: string
  matchScore: number
  status: "pending" | "approved" | "rejected"
  appliedDate: string
  email: string
  phone: string
  resume?: string
  skills: string[]
}

let APPLICATIONS: Application[] = [
  {
    id: 1,
    candidateName: "Michael Chen",
    role: "Senior Structural Engineer",
    project: "Modern Villa",
    experience: "12 years",
    matchScore: 95,
    status: "pending",
    appliedDate: "2024-01-16",
    email: "michael.chen@email.com",
    phone: "+91 90000 00001",
    skills: ["Structural Analysis", "AutoCAD", "Revit", "PE Licensed"],
  },
]

export async function GET() {
  return Response.json(APPLICATIONS)
}

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}))
  const matchScore = Math.floor(Math.random() * 20) + 75
  const next: Application = {
    id: APPLICATIONS.length ? Math.max(...APPLICATIONS.map((a) => a.id)) + 1 : 1,
    candidateName: b?.fullName || "Applicant",
    role: b?.role || "Unknown Role",
    project: b?.project || "Unassigned",
    experience: b?.experience || "—",
    matchScore,
    status: "pending",
    appliedDate: new Date().toISOString().split("T")[0],
    email: b?.email || "",
    phone: b?.phone || "",
    skills: typeof b?.skills === "string" ? b.skills.split(",").map((s: string) => s.trim()) : [],
    resume: b?.resume || undefined,
  }
  APPLICATIONS = [next, ...APPLICATIONS]
  return Response.json({ ok: true, matchScore, application: next }, { status: 201 })
}
