import { NextResponse } from "next/server"
import { insert, getAll, updateWhere } from "@/lib/db"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Need to await params dynamically in Next 15
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    // Module 2: Advanced Project Inputs
    const advancedInputs = {
      project_id: id,
      materials: data.materials,
      amenities: data.amenities,
      features: data.features,
      construction_grade: data.construction_grade,
      updated_at: new Date().toISOString()
    }

    // Try to update if exists, else insert
    let existing = getAll("project_inputs").find(p => p.project_id === id)
    
    // If it's just a GET request simulated via POST or no new data
    if ((data.get_current || Object.keys(data).length === 0) && existing) {
        return NextResponse.json({ success: true, inputs: existing })
    }

    if (existing) {
        updateWhere("project_inputs", p => p.project_id === id, () => advancedInputs)
    } else {
        insert("project_inputs", advancedInputs)
    }

    return NextResponse.json({ success: true, inputs: advancedInputs })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save inputs" }, { status: 500 })
  }
}
