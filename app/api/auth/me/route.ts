import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Missing authentication token" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload?.userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    let user: any = null
    const userId = payload.userId

    // 1. Try MongoDB connection
    let isDbConnected = false
    try {
      await dbConnect()
      isDbConnected = true
    } catch (e) {
      console.warn("MongoDB connection failed in auth-me, using fallback.")
    }

    if (isDbConnected) {
      try {
        user = await User.findById(userId)
      } catch (e) {
        console.error("MongoDB query failed in auth-me:", e)
      }
    }

    // 2. Fallback to lib/db.ts (local JSON file)
    if (!user) {
      const { getAll } = require("@/lib/db")
      const localUsers = getAll("users")
      user = localUsers.find((u: any) => (u._id || u.id).toString() === userId.toString())
    }
    
    if (!user) {
      return NextResponse.json({ error: "User profile not found in database" }, { status: 404 })
    }

    // Return sanitized user object
    const sanitizedUser = {
      id: (user._id || user.id).toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      settings_data: user.settings_data || "{}"
    }

    return NextResponse.json({
      user: sanitizedUser,
    }, { status: 200 })

  } catch (error: any) {
    console.error("Auth-Me error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
