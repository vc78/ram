import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"

export async function GET() {
    const logs = getAll("activity_logs")
    const users = getAll("users")
    
    const enrichedLogs = logs.map(l => ({
        ...l,
        user_name: users.find(u => u.id === l.user_id)?.name || "System"
    })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ logs: enrichedLogs })
}
