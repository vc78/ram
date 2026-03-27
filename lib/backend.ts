// Use relative paths in production to hit our own Next.js API routes
const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || "/api" 

function getAuthHeaders(init?: RequestInit) {
  try {
    if (typeof window === "undefined") return init?.headers || {}
    const token = localStorage.getItem("token")
    const base = init?.headers ? { ...(init.headers as Record<string, string>) } : {}
    if (token) base["Authorization"] = `Bearer ${token}`
    return base
  } catch {
    return init?.headers || {}
  }
}

export async function apiGet<T>(path: string, init?: RequestInit) {
  const url = `${getBaseUrl()}${path}`
  const headers = getAuthHeaders(init)
  const res = await fetch(url, { ...init, method: "GET", cache: "no-store", headers })
  let data: any = null
  try {
    data = await res.json()
  } catch {
    /* ignore parse errors */
  }

  if (!res.ok) {
    const message = (data && (data.detail || data.error || data.message)) || `GET ${path} failed: ${res.status}`
    if (res.status === 401) {
      try {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } catch { }
    }
    throw new Error(message)
  }

  return data as T
}

export async function apiPost<T>(path: string, body?: any, init?: RequestInit) {
  const url = `${getBaseUrl()}${path}`
  const headers = { "Content-Type": "application/json", ...getAuthHeaders(init) }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  })

  let data: any = null
  try {
    data = await res.json()
  } catch {
    /* ignore parse errors */
  }

  if (!res.ok) {
    let message = ""
    if (res.status === 502) {
      message = "Backend Offline: Is the Python server running on port 8002?"
    } else {
      message = (data && (data.detail || data.error || data.message)) || `POST ${path} failed: ${res.status}`
    }
    
    if (res.status === 401) {
      try {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } catch { }
    }
    throw new Error(message)
  }

  return data as T
}

export async function apiPut<T>(path: string, body?: any, init?: RequestInit) {
  const url = `${getBaseUrl()}${path}`
  const headers = { "Content-Type": "application/json", ...getAuthHeaders(init) }
  const res = await fetch(url, {
    method: "PUT",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  })

  let data: any = null
  try {
    data = await res.json()
  } catch {
    /* ignore parse errors */
  }

  if (!res.ok) {
    const message = (data && (data.detail || data.error || data.message)) || `PUT ${path} failed: ${res.status}`
    throw new Error(message)
  }

  return data as T
}
