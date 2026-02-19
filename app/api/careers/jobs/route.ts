import type { NextRequest } from "next/server"

type Job = {
  id: number
  title: string
  project: string
  location: string
  type: string
  salary: string
  applicants: number
  status: "active" | "closed"
  matchScore: number
  postedDate: string
  requirements: string[]
}

let JOBS: Job[] = [
  {
    id: 1,
    title: "Senior Structural Engineer",
    project: "Modern Villa",
    location: "Mumbai, MH",
    type: "Full-time",
    salary: "₹85,000 - ₹120,000",
    applicants: 12,
    status: "active",
    matchScore: 95,
    postedDate: "2024-01-15",
    requirements: ["10+ years experience", "PE License", "Steel & Concrete expertise"],
  },
  {
    id: 2,
    title: "Licensed Electrician",
    project: "Office Renovation",
    location: "Bengaluru, KA",
    type: "Contract",
    salary: "₹65/hour",
    applicants: 8,
    status: "active",
    matchScore: 88,
    postedDate: "2024-01-18",
    requirements: ["Licensed", "Commercial experience", "Smart systems knowledge"],
  },
]

export async function GET() {
  return Response.json(JOBS)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const next: Job = {
    id: JOBS.length ? Math.max(...JOBS.map((j) => j.id)) + 1 : 1,
    title: body?.title || "New Role",
    project: body?.project || "General",
    location: body?.location || "Remote",
    type: body?.type || "Full-time",
    salary: body?.salary || "₹50,000 - ₹70,000",
    applicants: 0,
    status: "active",
    matchScore: Math.min(99, Math.max(70, Number(body?.matchScore) || 80)),
    postedDate: new Date().toISOString().split("T")[0],
    requirements: Array.isArray(body?.requirements) ? body.requirements : ["Experience in domain"],
  }
  JOBS = [next, ...JOBS]
  return Response.json(next, { status: 201 })
}
