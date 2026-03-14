export type UserRole = "admin" | "company" | "contractor" | "user"

export interface SecurityContext {
  userId: string
  role: UserRole
  permissions: string[]
  sessionToken: string
}

// Role-based access control
export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "read:all",
    "write:all",
    "delete:all",
    "manage:users",
    "manage:projects",
    "manage:contractors",
    "approve:designs",
    "view:analytics",
  ],
  company: [
    "read:own",
    "write:own",
    "read:projects",
    "write:projects",
    "hire:contractors",
    "view:reports",
    "approve:submissions",
  ],
  contractor: ["read:assigned", "write:assigned", "update:progress", "upload:documents", "view:payments"],
  user: ["read:own", "write:own", "create:projects", "view:contractors", "download:documents"],
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return rolePermissions[role]?.includes(permission) || rolePermissions[role]?.includes("read:all") || false
}

export function checkAccess(context: SecurityContext, resource: string, action: string): boolean {
  const permission = `${action}:${resource}`
  return hasPermission(context.role, permission)
}

// Document download security
export function secureDownload(documentId: string, userId: string, role: UserRole): boolean {
  console.log("[v0] Secure download check", { documentId, userId, role })

  if (!hasPermission(role, "download:documents") && !hasPermission(role, "read:all")) {
    console.log("[v0] Download permission denied")
    return false
  }

  // Additional checks can be added here
  return true
}

// Encrypted communication
export async function encryptData(data: string, key?: string): Promise<string> {
  // Simple Base64 encoding for demonstration
  // In production, use proper encryption libraries
  return btoa(data)
}

export async function decryptData(encryptedData: string, key?: string): Promise<string> {
  try {
    return atob(encryptedData)
  } catch {
    throw new Error("Decryption failed")
  }
}

// API authentication
export function generateAuthToken(userId: string, role: UserRole): string {
  const timestamp = Date.now()
  const payload = { userId, role, timestamp }
  return btoa(JSON.stringify(payload))
}

export function validateAuthToken(token: string): SecurityContext | null {
  try {
    const payload = JSON.parse(atob(token))
    const tokenAge = Date.now() - payload.timestamp

    // Token expires after 24 hours
    if (tokenAge > 24 * 60 * 60 * 1000) {
      console.log("[v0] Token expired")
      return null
    }

    return {
      userId: payload.userId,
      role: payload.role,
      permissions: rolePermissions[payload.role] || [],
      sessionToken: token,
    }
  } catch (error) {
    console.log("[v0] Invalid token", error)
    return null
  }
}

// Project data privacy
export function canAccessProject(userId: string, projectId: string, role: UserRole): boolean {
  if (hasPermission(role, "read:all")) {
    return true
  }

  // Check if user owns or is assigned to the project
  const projects = JSON.parse(localStorage.getItem("userProjects") || "{}")
  return projects[userId]?.includes(projectId) || false
}

// Audit logging
export function logSecurityEvent(event: string, details: Record<string, any>) {
  const timestamp = new Date().toISOString()
  const log = { timestamp, event, details }

  console.log("[v0] Security Event:", log)

  const logs = JSON.parse(localStorage.getItem("securityLogs") || "[]")
  logs.push(log)

  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.shift()
  }

  localStorage.setItem("securityLogs", JSON.stringify(logs))

  // save to database as well
  fetch("/api/db/security_logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log),
  }).catch((e) => console.error("DB security log failed", e))
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

// SQL injection prevention (for demonstration)
export function sanitizeSQL(query: string): string {
  return query.replace(/;/g, "").replace(/--/g, "").replace(/\/\*/g, "").replace(/\*\//g, "")
}
