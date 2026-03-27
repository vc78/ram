import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { signToken, setAuthCookies } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    // Attempt database connection with a shorter timeout or fallback
    let isDbConnected = false
    try {
      await dbConnect()
      isDbConnected = true
    } catch (e) {
      console.warn("MongoDB Connection failed, falling back to JSON DB:", e)
    }

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let user: any = null
    const lowerEmail = email.toLowerCase()

    // 1. Try MongoDB first if connected
    if (isDbConnected) {
      try {
        user = await User.findOne({ email: lowerEmail }).select("+password")
      } catch (e) {
        console.error("MongoDB Query failed:", e)
      }
    }

    // 2. Fallback to lib/db.ts (local JSON file) if not found in MongoDB
    if (!user) {
      const { getAll } = require("@/lib/db")
      const localUsers = getAll("users")
      user = localUsers.find((u: any) => u.email.toLowerCase() === lowerEmail)
      
      // Adapt local user to mongoose-like format if found
      if (user) {
        user._id = user.id || user._id
        // Handle both hashed (signup) and plain (seed) passwords
        const isMatch = password === user.password || await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
        }
      }
    } else {
      // Compare password for MongoDB user (always hashed)
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }
    }
    
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "Your account is currently " + user.status }, { status: 403 })
    }

    // Generate token
    const token = await signToken({
      userId: (user._id || user.id).toString(),
      email: user.email,
      role: user.role,
    })

    // Set HTTP-only cookie
    await setAuthCookies(token)

    // Return sanitized user object
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
