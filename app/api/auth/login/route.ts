import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()
        const users = getAll("users")
        
        console.log(`Login attempt for: ${email}`)
        
        // Find user case-insensitively
        const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
        
        if (!user) {
            console.log(`User not found: ${email}`)
            return NextResponse.json({ detail: "Invalid email or password" }, { status: 401 })
        }

        let isPasswordCorrect = false
        
        // 1. Try bcrypt comparison (if it looks like a hash)
        if (user.password && user.password.includes("$2")) {
          try {
            isPasswordCorrect = await bcrypt.compare(password, user.password)
          } catch (e) {
            console.error("Bcrypt comparison error:", e)
          }
        }
        
        // 2. Fallback to plain text Comparison (for old demo users)
        if (!isPasswordCorrect && user.password === password) {
          isPasswordCorrect = true
        }
        
        if (!isPasswordCorrect) {
            console.log(`Invalid password for: ${email}`)
            return NextResponse.json({ detail: "Invalid email or password" }, { status: 401 })
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
