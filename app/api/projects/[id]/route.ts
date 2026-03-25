import { NextResponse } from "next/server"
import { getAll, updateWhere, deleteWhere } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projects = getAll("projects")
    const project = projects.find((p: any) => p.id === id)

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    // Also merge in any estimation / advanced inputs stored separately
    const allInputs = getAll("project_inputs")
    const inputs = allInputs.find((i: any) => i.project_id === id)

    return NextResponse.json({ success: true, project: { ...project, advancedInputs: inputs || null } })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    updateWhere(
      "projects",
      (p: any) => p.id === id,
      (p: any) => ({ ...p, ...data, updated_at: new Date().toISOString() })
    )

    const updated = getAll("projects").find((p: any) => p.id === id)
    return NextResponse.json({ success: true, project: updated })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    deleteWhere("projects", (p: any) => p.id === id)
    deleteWhere("project_inputs", (i: any) => i.project_id === id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 })
  }
}
