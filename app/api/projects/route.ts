import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"

export async function GET() {
  try {
    const projects = getAll("projects")
    return NextResponse.json({ success: true, projects })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 })
  }
}
