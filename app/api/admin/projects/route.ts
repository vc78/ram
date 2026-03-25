import { NextResponse } from "next/server"
import { getAll, deleteWhere } from "@/lib/db"

export async function GET() {
    const projects = getAll("projects")
    const users = getAll("users")
    
    const enrichedProjects = projects.map(p => ({
        ...p,
        user_name: users.find(u => u.id === p.user_id)?.name || "Unknown User"
    }))

    return NextResponse.json({ projects: enrichedProjects })
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (id) {
        deleteWhere("projects", p => p.id === id)
    }
    return NextResponse.json({ success: true })
}
