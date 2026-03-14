import { NextResponse } from "next/server"
import { getAll, insert, deleteWhere, updateWhere, saveTable } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const segments = url.pathname.split("/").filter(Boolean)
    const table = segments[segments.length - 1]
    const data = getAll(table)

    // simple filtering by query params
    const params = Object.fromEntries(url.searchParams.entries())
    let results = data
    Object.keys(params).forEach((key) => {
        results = results.filter((item) => String(item[key]) === params[key])
    })

    return NextResponse.json(results)
}

export async function POST(req: Request) {
    const url = new URL(req.url)
    const segments = url.pathname.split("/").filter(Boolean)
    const table = segments[segments.length - 1]

    let body: any
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    if (Array.isArray(body)) {
        saveTable(table, body)
    } else if (body && typeof body === "object") {
        if (body.id) {
            let data = getAll(table)
            const idx = data.findIndex((i: any) => i.id === body.id)
            if (idx >= 0) {
               data[idx] = body
            } else {
               data.push(body)
            }
            saveTable(table, data)
        } else {
            insert(table, body)
        }
    }

    return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
    const url = new URL(req.url)
    const segments = url.pathname.split("/").filter(Boolean)
    const table = segments[segments.length - 1]
    const id = url.searchParams.get("id")

    if (id) {
        deleteWhere(table, (r) => r.id === id)
        return NextResponse.json({ deleted: id })
    }

    return NextResponse.json({ error: "No id specified" }, { status: 400 })
}

export async function PUT(req: Request) {
    const url = new URL(req.url)
    const segments = url.pathname.split("/").filter(Boolean)
    const table = segments[segments.length - 1]
    let body: any
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    if (body && body.id) {
        updateWhere(table, (r) => r.id === body.id, () => body)
        return NextResponse.json({ updated: body.id })
    }

    return NextResponse.json({ error: "No id in body" }, { status: 400 })
}
