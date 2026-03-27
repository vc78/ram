import { NextResponse } from "next/server"
import { removeAuthCookies } from "@/lib/jwt"

export async function POST() {
  await removeAuthCookies()
  return NextResponse.json({ message: "Logout successful" }, { status: 200 })
}
