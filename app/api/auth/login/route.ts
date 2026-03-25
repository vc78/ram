import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()
        const users = getAll("users")
        
        const user = users.find(u => u.email === email && u.password === password)
        
        if (!user) {
            return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 })
        }

        if (user.status === "blocked") {
            return NextResponse.json({ detail: "Your account is suspended. Contact administration." }, { status: 403 })
        }

        // Mock JWT token
        const token = "mock-jwt-token-" + Math.random().toString(36).substring(7)
        
        return NextResponse.json({
            access_token: token,
            token_type: "bearer",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (e) {
        return NextResponse.json({ detail: "Authentication node error" }, { status: 500 })
    }
}
