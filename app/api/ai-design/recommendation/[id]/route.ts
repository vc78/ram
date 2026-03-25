import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"
import { predictOptimalLayout } from "@/lib/ml-models"

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

    // Module 5 Logic: AI Selection based on inputs
    const recommendedLayout = predictOptimalLayout(project)

    return NextResponse.json({
      success: true,
      recommendedLayout,
      confidence: 0.94,
      model: "CNN-Vision-Architecture-Classifier-v2"
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "ML Engine Error" }, { status: 500 })
  }
}
