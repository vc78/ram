// Authentication utilities
// Integrated with backend MySQL authentication

export interface User {
  id?: number
  email: string
  name: string
  role?: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  const token = localStorage.getItem("token")
  if (!userStr || !token) return null

  try {
    const user = JSON.parse(userStr)
    if (!user.email || !user.name) {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      return null
    }
    return user
    // </CHANGE>
  } catch {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    return null
  }
}

export async function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("rememberedEmail")
    localStorage.removeItem("loginAttempts")
    document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Clear server-side cookie
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (e) {
      console.error("Logout API failed:", e)
    }
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function validateSession(): boolean {
  const user = getCurrentUser()
  if (!user) return false

  // Check if user object has all required fields
  return !!(user.email && user.name)
}

/**
 * Generates a user-specific key for localStorage to prevent data sharing between users.
 */
export function getUserDataKey(baseKey: string): string {
  if (typeof window === "undefined") return baseKey
  const user = getCurrentUser()
  if (!user) return baseKey
  // Sanitize email to use as a safe key suffix
  const safeEmail = user.email.toLowerCase().replace(/[^a-z0-9]/g, '_')
  return `${baseKey}_${safeEmail}`
}
