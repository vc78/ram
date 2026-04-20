import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getAll, updateWhere, deleteWhere, insert } from "@/lib/db"

export async function GET() {
    const users = getAll("users")
    const projects = getAll("projects")
    const logs = getAll("activity_logs")

    const enrichedUsers = users.map((user) => {
        const userLogs = logs.filter((l: any) => l.user_id === user.id)
        const lastActive = userLogs
            .map((l: any) => new Date(l.timestamp || l.created_at || 0))
            .filter((d: Date) => !Number.isNaN(d.getTime()))
            .sort((a: Date, b: Date) => b.getTime() - a.getTime())[0]

        return {
            ...user,
            projects_count: projects.filter((p: any) => p.user_id === user.id).length,
            last_active: lastActive ? lastActive.toISOString() : null,
            login_activity: userLogs.filter((l: any) => /login|sign in|admin login/i.test(l.action || ""))
        }
    })

    return NextResponse.json({ users: enrichedUsers })
}

export async function POST(req: Request) {
    const payload = await req.json()
    const { action, userId } = payload

    if (action === "block") {
        updateWhere("users", u => u.id === userId, u => ({ ...u, status: "blocked" }))
        return NextResponse.json({ success: true })
    } else if (action === "delete") {
        deleteWhere("users", u => u.id === userId)
        return NextResponse.json({ success: true })
    } else if (action === "create-admin") {
        const { name, email, password, status = "active" } = payload
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing name/email/password" }, { status: 400 })
        }

        const normalizedEmail = email.toLowerCase()
        const users = getAll("users")

        const exists = users.some((u: any) => u.email.toLowerCase() === normalizedEmail)
        if (exists) {
            return NextResponse.json({ error: "Admin user already exists" }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = {
            id: `u-${Date.now()}`,
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin",
            status,
            created_at: new Date().toISOString(),
        }

        insert("users", newUser)
        return NextResponse.json({ success: true, user: { ...newUser, password: undefined } })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
}

