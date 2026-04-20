import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { signToken, setAuthCookies } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase()
    let user: any = null

    // 1. Try MongoDB connection
    let isDbConnected = false
    try {
      const conn = await dbConnect()
      if (conn) isDbConnected = true
    } catch (e) {
      // Catch real connection failures silently to rely on the fallback
    }

    // 2. Load from MongoDB if connected
    if (isDbConnected) {
      try {
        user = await User.findOne({ email: lowerEmail })
      } catch (e) {
        console.error("MongoDB query error:", e)
      }
    }

    // 3. Fallback to lib/db.ts (local JSON file)
    if (!user) {
      const { getAll } = require("@/lib/db")
      const localUsers = getAll("users")
      user = localUsers.find((u: any) => u.email.toLowerCase() === lowerEmail)
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // 4. Verification Check (Handles both hashed and plain fallback if necessary)
    const isMatch = await bcrypt.compare(password, user.password).catch(() => password === user.password)
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // 5. Generate token (use _id or id)
    const token = await signToken({
      userId: (user._id || user.id).toString(),
      email: user.email,
      role: user.role,
    })

    // 6. Set HTTP-only cookie
    await setAuthCookies(token)

    // 7. Return sanitized user object
    const sanitizedUser = {
      id: (user._id || user.id).toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    }

    return NextResponse.json({
      message: "Login successful",
      access_token: token,
      token_type: "bearer",
      user: sanitizedUser,
    }, { status: 200 })

  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
