import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"

export async function GET() {
    const users = getAll("users")
    const projects = getAll("projects")
    const layouts = getAll("layouts") // Assuming this stores generated designs
    
    return NextResponse.json({
        total_users: users.length,
        total_projects: projects.length,
        active_projects: projects.filter((p: any) => p.status === 'active' || !p.status).length,
        ai_designs: layouts.length,
        reports_generated: 95 // Mocking this stat
    })
}
