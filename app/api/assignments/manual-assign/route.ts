import { NextResponse } from "next/server"
import { getAll, insert, updateWhere } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { task_id, worker_id } = body

    if (!task_id || !worker_id) {
      return NextResponse.json({ error: "task_id and worker_id are required" }, { status: 400 })
    }

    const tasks = getAll("tasks")
    const task = tasks.find(t => t.id === task_id)

    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })

    const workers = getAll("workers")
    const worker = workers.find(w => w.id === worker_id)

    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 })

    // Calculate score even on manual just for logging
    let score = 0
    if (worker.skill.toLowerCase() === task.required_skill.toLowerCase()) score += 50
    score += Math.min(worker.experience * 5, 20)
    if (worker.availability) score += 20
    score += (worker.performance_score * 0.1)

    const newAssignment = {
      id: `assn_${Date.now()}`,
      task_id,
      worker_id,
      score,
      assigned_at: new Date().toISOString(),
      status: "active"
    }

    insert("assignments", newAssignment)
    
    // Update task status
    updateWhere("tasks", r => r.id === task_id, r => ({ ...r, status: "assigned" }))
    updateWhere("workers", r => r.id === worker_id, r => ({ ...r, availability: false }))

    return NextResponse.json({ 
      success: true, 
      assignment: newAssignment, 
      worker 
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
