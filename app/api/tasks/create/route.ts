import { NextResponse } from "next/server"
import { insert } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { task_name, required_skill, priority, deadline, project_id } = body

    if (!task_name || !required_skill) {
      return NextResponse.json({ error: "Task name and required skill are required" }, { status: 400 })
    }

    const newTask = {
      id: `tsk_${Date.now()}`,
      project_id: project_id || "default_proj",
      task_name,
      required_skill,
      priority: priority || "medium",
      deadline: deadline || new Date().toISOString(),
      status: "pending", // pending, assigned, completed
      created_at: new Date().toISOString()
    }

    insert("tasks", newTask)

    return NextResponse.json({ task: newTask })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
