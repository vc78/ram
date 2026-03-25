import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"
import { predictProjectRisks, forecastMaterialPrices } from "@/lib/ml-models"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projects = getAll("projects")
    const project = projects.find(p => p.id === id)

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    const industryMetrics = {
        risks: predictProjectRisks(project, project.location),
        trends: forecastMaterialPrices()
    }

    return NextResponse.json({ success: true, ...industryMetrics })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Analytics Pipeline Error" }, { status: 500 })
  }
}
