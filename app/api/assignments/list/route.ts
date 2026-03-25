import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"

export async function GET() {
  try {
    const assignments = getAll("assignments")
    return NextResponse.json({ assignments })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
