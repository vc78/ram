import { NextResponse } from "next/server"
import { insert, getAll } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, skill, experience, availability, performance_score, daily_cost } = body

    if (!name || !skill) {
      return NextResponse.json({ error: "Name and skill are required" }, { status: 400 })
    }

    const newWorker = {
      id: `wrk_${Date.now()}`,
      name,
      skill,
      experience: Number(experience) || 0,
      availability: Boolean(availability),
      performance_score: Number(performance_score) || 0,
      daily_cost: Number(daily_cost) || 0,
      created_at: new Date().toISOString()
    }

    insert("workers", newWorker)

    return NextResponse.json({ worker: newWorker })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
