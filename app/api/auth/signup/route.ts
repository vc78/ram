import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { signToken, setAuthCookies } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase()

    // 1. Try MongoDB connection
    let isDbConnected = false
    try {
      await dbConnect()
      isDbConnected = true
    } catch (e) {
      console.warn("MongoDB connection failed in signup, using fallback.")
    }

    // 2. Check if user already exists
    let existingUser = null
    if (isDbConnected) {
      try {
        existingUser = await User.findOne({ email: lowerEmail })
      } catch (e) {
        console.error("MongoDB check failed in signup:", e)
      }
    }

    // 3. Fallback check from JSON DB
    if (!existingUser) {
      const { getAll } = require("@/lib/db")
      const localUsers = getAll("users")
      existingUser = localUsers.find((u: any) => u.email.toLowerCase() === lowerEmail)
    }

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // 5. Create user (MongoDB + JSON fallback)
    let newUser: any = null
    if (isDbConnected) {
        try {
            newUser = await User.create({
                name,
                email: lowerEmail,
                password: hashedPassword,
                role: 'user',
                status: 'active'
            })
        } catch (e) {
            console.error("MongoDB creation failed in signup:", e)
        }
    }

    // Always sync to JSON DB for development resilience
    const { insert } = require("@/lib/db")
    const localId = `u${Date.now()}`
    const localUser = {
        id: newUser?._id?.toString() || localId,
        name,
        email: lowerEmail,
        password: hashedPassword,
        role: 'user',
        status: 'active'
    }
    insert("users", localUser)

    // Ensure we have a consistent user object for the token
    const userForToken = newUser || localUser

    // 6. Generate token
    const token = await signToken({
      userId: (userForToken._id || userForToken.id).toString(),
      email: userForToken.email,
      role: userForToken.role,
    })

    // 7. Set HTTP-only cookie
    await setAuthCookies(token)

    return NextResponse.json({
        message: "Signup successful",
        access_token: token,
        token_type: "bearer",
        user: {
            id: (userForToken._id || userForToken.id).toString(),
            name: userForToken.name,
            email: userForToken.email,
            role: userForToken.role,
            status: userForToken.status
        }
    }, { status: 201 })

  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
