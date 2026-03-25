import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"

export async function GET() {
  try {
    const tasks = getAll("tasks")
    return NextResponse.json({ tasks })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
