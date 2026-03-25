import { NextResponse } from "next/server"
import { insert, getAll, updateWhere } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const timelines = getAll("project_timelines")
  const timeline = timelines.find(t => t.project_id === id)
  
  if (!timeline) {
    // Return default initial phases if none exist
    return NextResponse.json({
      success: true,
      phases: [
        { title: "Foundation", progress: 0, status: "pending", team: "TBD" },
        { title: "Framing", progress: 0, status: "pending", team: "TBD" },
        { title: "Mechanical", progress: 0, status: "pending", team: "TBD" },
        { title: "Finishing", progress: 0, status: "pending", team: "TBD" }
      ]
    })
  }

  return NextResponse.json({ success: true, ...timeline })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    const timelineData = {
      project_id: id,
      phases: data.phases,
      updated_at: new Date().toISOString()
    }

    let existing = getAll("project_timelines").find(t => t.project_id === id)
    if (existing) {
        updateWhere("project_timelines", t => t.project_id === id, () => timelineData)
    } else {
        insert("project_timelines", timelineData)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
