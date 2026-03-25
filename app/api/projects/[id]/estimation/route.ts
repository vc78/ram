import { NextResponse } from "next/server"
import { updateWhere, getAll } from "@/lib/db"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    // Merge estimation data into the project record
    updateWhere(
      "projects",
      (p: any) => p.id === id,
      (p: any) => ({
        ...p,
        estimation: data.estimation,
        materialQuantity: data.materialQuantity,
        designs: data.designs || p.designs,
        updated_at: new Date().toISOString()
      })
    )

    const updated = getAll("projects").find((p: any) => p.id === id)
    return NextResponse.json({ success: true, project: updated })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save estimation" }, { status: 500 })
  }
}
