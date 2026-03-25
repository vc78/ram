import { NextResponse } from "next/server"
import { getAll, insert, updateWhere } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { task_id } = body

    if (!task_id) {
      return NextResponse.json({ error: "task_id is required" }, { status: 400 })
    }

    const tasks = getAll("tasks")
    const task = tasks.find(t => t.id === task_id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    if (task.status === "completed") {
      return NextResponse.json({ error: "Task is already completed" }, { status: 400 })
    }

    const workers = getAll("workers")
    
    let bestWorker = null
    let highestScore = -1

    for (const worker of workers) {
      let score = 0
      
      // Skill Match (50)
      if (worker.skill.toLowerCase() === task.required_skill.toLowerCase()) {
        score += 50
      }

      // Experience * 5 (Max 20)
      score += Math.min(worker.experience * 5, 20)
      
      // Availability (20)
      if (worker.availability) {
        score += 20
      }

      // Performance Score normalized (10) => assuming performance score is out of 100
      score += (worker.performance_score * 0.1)

      if (score > highestScore) {
        highestScore = score
        bestWorker = worker
      }
    }

    if (!bestWorker || highestScore < 50) {
       return NextResponse.json({ error: "No suitable worker found" }, { status: 400 })
    }

    const newAssignment = {
      id: `assn_${Date.now()}`,
      task_id,
      worker_id: bestWorker.id,
      score: highestScore,
      assigned_at: new Date().toISOString(),
      status: "active"
    }

    insert("assignments", newAssignment)
    
    // Update task status
    updateWhere("tasks", r => r.id === task_id, r => ({ ...r, status: "assigned" }))

    // Update worker availability to false since they are now assigned (optional but logical)
    updateWhere("workers", r => r.id === bestWorker.id, r => ({ ...r, availability: false }))

    return NextResponse.json({ 
      success: true, 
      assignment: newAssignment, 
      worker: bestWorker 
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
