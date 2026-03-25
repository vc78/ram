import { NextResponse } from "next/server"
import { getAll, updateWhere, deleteWhere } from "@/lib/db"

export async function GET() {
    const users = getAll("users")
    const projects = getAll("projects")
    
    const enrichedUsers = users.map(user => ({
        ...user,
        projects_count: projects.filter((p: any) => p.user_id === user.id).length
    }))

    return NextResponse.json({ users: enrichedUsers })
}

export async function POST(req: Request) {
    const { action, userId } = await req.json()
    
    if (action === "block") {
        updateWhere("users", u => u.id === userId, u => ({ ...u, status: "blocked" }))
    } else if (action === "delete") {
        deleteWhere("users", u => u.id === userId)
    }
    
    return NextResponse.json({ success: true })
}
