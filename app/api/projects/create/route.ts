import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { insert, getAll } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Module 1: Project Creation database representation
    const newProject = {
      id: randomUUID(),
      user_id: data.user_id || "demo-user",
      project_name: data.project_name,
      floors: data.floors,
      location: data.location,
      plot_area: data.plot_area,
      construction_type: data.construction_type,
      // Module 2 attributes
      materials: data.materials || "standard",
      amenities: data.amenities || [],
      construction_grade: data.construction_grade || "standard",
      building_type: data.building_type || "residential",
      interior_preference: data.interior_preference || "modern",
      exterior_type: data.exterior_type || "contemporary",
      created_at: new Date().toISOString()
    }

    insert("projects", newProject)

    return NextResponse.json({ success: true, project: newProject })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 })
  }
}

export async function GET() {
  const projects = getAll("projects")
  return NextResponse.json({ projects })
}
