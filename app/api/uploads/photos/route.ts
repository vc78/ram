import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const runtime = "nodejs" // we need fs access


// simple API for storing uploaded files in /public/uploads
export async function POST(req: Request) {
    try {
        const form = await req.formData()
        const files = form.getAll("files") as File[]
        if (!files || files.length === 0) {
            return NextResponse.json({ saved: [] })
        }

        const folder = path.join(process.cwd(), "public", "uploads")
        await fs.promises.mkdir(folder, { recursive: true })

        const saved: { url: string; filename: string }[] = []

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const filename = file.name
            const filePath = path.join(folder, filename)
            await fs.promises.writeFile(filePath, buffer)
            saved.push({ url: `/uploads/${filename}`, filename })
        }

        return NextResponse.json({ saved })
    } catch (err) {
        console.error("/api/uploads/photos error", err)
        return NextResponse.json({ saved: [], error: (err as Error).message }, { status: 500 })
    }
}

export async function GET() {
    try {
        const folder = path.join(process.cwd(), "public", "uploads")
        const files = await fs.promises.readdir(folder).catch(() => [])
        return NextResponse.json({ files })
    } catch (err) {
        console.error("/api/uploads/photos GET error", err)
        return NextResponse.json({ files: [] }, { status: 500 })
    }
}
