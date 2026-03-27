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
      console.warn("MongoDB Connection failed during signup, using JSON DB fallback:", e)
    }

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase()
    let existingUser: any = null

    // 1. Check for existing user
    if (isDbConnected) {
      try {
        existingUser = await User.findOne({ email: lowerEmail })
      } catch (e) {
        console.error("MongoDB Check failed:", e)
      }
    }

    if (!existingUser) {
      const { getAll } = require("@/lib/db")
      const localUsers = getAll("users")
      existingUser = localUsers.find((u: any) => u.email.toLowerCase() === lowerEmail)
    }

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // 2. Hash password and prepare user data
    const hashedPassword = await bcrypt.hash(password, 12)
    const userData = {
      name,
      email: lowerEmail,
      password: hashedPassword,
      role: "user",
      status: "active",
      settings_data: "{}",
      created_at: new Date().toISOString()
    }

    let newUser: any = null

    // 3. Save to MongoDB if connected
    if (isDbConnected) {
      try {
        newUser = await User.create(userData)
      } catch (e) {
        console.error("MongoDB Create failed:", e)
      }
    }

    // 4. Always ensure it's in the local JSON DB for reliability
    const { insert } = require("@/lib/db")
    if (!newUser) {
      // Create local user with ID if MongoDB failed
      const localUser = { id: `u${Date.now()}`, ...userData }
      insert("users", localUser)
      newUser = localUser
    } else {
      // Sync MongoDB user to local DB
      insert("users", { id: newUser._id.toString(), ...userData })
    }

    // 5. Generate token
    const token = await signToken({
      userId: (newUser._id || newUser.id).toString(),
      email: newUser.email,
      role: newUser.role,
    })

    // Set HTTP-only cookie
    await setAuthCookies(token)

    // Return sanitized user object
    const sanitizedUser = {
      id: (newUser._id || newUser.id).toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    }

    return NextResponse.json({
      message: "Signup successful",
      access_token: token,
      token_type: "bearer",
      user: sanitizedUser,
    }, { status: 201 })

  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
