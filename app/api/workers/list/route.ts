import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"

export async function GET() {
  try {
    const workers = getAll("workers")
    return NextResponse.json({ workers })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
