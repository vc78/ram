import type { NextRequest } from "next/server"

const BASE = process.env.BACKEND_URL // e.g., https://your-python-service.com

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;

  // Detect if we should use the local Next.js API (when Python backend is not configured)
  const isServerless = !BASE || BASE.includes("localhost") || BASE.includes("127.0.0.1")
  
  if (isServerless && (path.includes("auth") || path.includes("login") || path.includes("signup"))) {
    const localPath = `/api/${path.join("/")}`
    const localUrl = new URL(localPath + req.nextUrl.search, req.url)
    
    console.log(`Forwarding to local Next.js Auth API: ${localPath}`)
    
    try {
      const init: RequestInit = {
        method: req.method,
        headers: req.headers,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
      }
      const localRes = await fetch(localUrl, init)
      const body = await localRes.arrayBuffer()
      return new Response(body, { status: localRes.status, headers: localRes.headers })
    } catch (e: any) {
      console.error("Local auth proxy error:", e)
    }
  }

  // Regular proxy to the Python backend
  const target = `${BASE}/api/v1/${path.join("/")}${req.nextUrl.search}`
  const headers: Record<string, string> = {}
  req.headers.forEach((v, k) => {
    if (!["host", "content-length"].includes(k.toLowerCase())) headers[k] = v
  })

  const init: RequestInit = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
    signal: AbortSignal.timeout(10000), // 10 second timeout to prevent hanging requests
  }

  try {
    const r = await fetch(target, init)
    const body = await r.arrayBuffer()
    return new Response(body, { status: r.status, headers: r.headers })
  } catch (e: any) {
    const errorMessage = e?.name === 'AbortError' ? 'Backend request timeout' : e?.message || 'unknown'
    return new Response(JSON.stringify({ error: "Proxy error", detail: errorMessage }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE, proxy as HEAD, proxy as OPTIONS }
