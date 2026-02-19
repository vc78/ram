export const dynamic = "force-dynamic"

async function checkBackend() {
  const url = process.env.BACKEND_URL

  // If BACKEND_URL is not configured, we operate in local mode
  if (!url) return { configured: false, status: "local_mode" as const }

  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/healthz`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(3000), // 3 second timeout
    })
    if (!res.ok) return { configured: true, status: "local_mode" as const } // Treat offline as local mode
    return { configured: true, status: "online" as const }
  } catch {
    // Backend is unreachable - operate in local/fallback mode
    return { configured: true, status: "local_mode" as const }
  }
}

export async function GET() {
  try {
    const backend = await checkBackend()
    return Response.json(
      {
        ok: true,
        message: "Your endpoint is reachable.",
        backend,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (err: any) {
    // Never surface a 500 to the UI
    return Response.json(
      {
        ok: false,
        error: "Unhandled error in GET your-endpoint",
        detail: err?.message ?? "unknown",
      },
      { status: 200 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      query?: string
      payload?: unknown
    }

    // Basic validation example
    if (body && typeof body !== "object") {
      return Response.json({ ok: false, error: "Invalid JSON body provided." }, { status: 200 })
    }

    const backend = await checkBackend()

    return Response.json(
      {
        ok: true,
        received: body ?? {},
        backend,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (err: any) {
    // Never surface a 500 to the UI
    return Response.json(
      {
        ok: false,
        error: "Unhandled error in POST your-endpoint",
        detail: err?.message ?? "unknown",
      },
      { status: 200 },
    )
  }
}
