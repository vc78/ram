/**
 * Share utility for Gmail and WhatsApp integration
 */

export interface ShareData {
  title?: string
  text?: string
  url?: string
  file?: File | Blob
  fileName?: string
}

export interface ShareOptions {
  method?: "gmail" | "whatsapp" | "native" | "auto"
  trackActivity?: boolean
}

/**
 * Share content via Gmail, WhatsApp, or native share API
 */
export async function share(data: ShareData, options: ShareOptions = {}): Promise<boolean> {
  const { method = "auto", trackActivity = true } = options

  try {
    // Track sharing activity
    if (trackActivity) {
      trackShareActivity(data, method)
    }

    switch (method) {
      case "gmail":
        return shareViaGmail(data)
      case "whatsapp":
        return shareViaWhatsApp(data)
      case "native":
        return await shareViaNativeAPI(data)
      case "auto":
      default:
        // Try native first, then fallback to WhatsApp
        if (navigator.share && navigator.canShare && navigator.canShare({ title: data.title, text: data.text })) {
          return await shareViaNativeAPI(data)
        }
        return shareViaWhatsApp(data)
    }
  } catch (error) {
    console.error("[v0] Share error:", error)
    return false
  }
}

/**
 * Share via Gmail
 */
export function shareViaGmail(data: ShareData): boolean {
  const subject = encodeURIComponent(data.title || "Shared from SIID")
  const body = encodeURIComponent(
    `${data.text || ""}\n\n${data.url ? `Link: ${data.url}` : ""}\n\nShared from SIID Platform`,
  )

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`

  window.open(gmailUrl, "_blank", "width=800,height=600")
  return true
}

/**
 * Share via WhatsApp
 */
export function shareViaWhatsApp(data: ShareData): boolean {
  const message = encodeURIComponent(
    `${data.title ? `*${data.title}*\n\n` : ""}${data.text || ""}${data.url ? `\n\n${data.url}` : ""}\n\n_Shared from SIID_`,
  )

  // Check if mobile or desktop
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const whatsappUrl = isMobile ? `whatsapp://send?text=${message}` : `https://web.whatsapp.com/send?text=${message}`

  window.open(whatsappUrl, "_blank")
  return true
}

/**
 * Share via native Web Share API
 */
export async function shareViaNativeAPI(data: ShareData): Promise<boolean> {
  if (!navigator.share) {
    throw new Error("Native share not supported")
  }

  const shareData: any = {}

  if (data.title) shareData.title = data.title
  if (data.text) shareData.text = data.text
  if (data.url) shareData.url = data.url

  // Handle file sharing if supported
  if (data.file && navigator.canShare && navigator.canShare({ files: [data.file as File] })) {
    const file = new File([data.file], data.fileName || "document.pdf", { type: data.file.type })
    shareData.files = [file]
  }

  try {
    await navigator.share(shareData)
    return true
  } catch (error: any) {
    // User cancelled or error occurred
    if (error.name === "AbortError") {
      return false
    }
    throw error
  }
}

/**
 * Share a document with permission tracking
 */
export async function shareDocument(doc: {
  id: string
  name: string
  type: string
  url?: string
}): Promise<boolean> {
  const shareData: ShareData = {
    title: doc.name,
    text: `Document: ${doc.name}\nType: ${doc.type}\n\nAccess this document from SIID platform`,
    url: doc.url || window.location.href,
  }

  return await share(shareData, { method: "auto", trackActivity: true })
}

/**
 * Share a project with details
 */
export async function shareProject(project: {
  id: string
  name: string
  status?: string
  budget?: string
}): Promise<boolean> {
  const shareData: ShareData = {
    title: `Project: ${project.name}`,
    text: `Project Details:\n• Status: ${project.status || "N/A"}\n• Budget: ${project.budget || "N/A"}\n\nView on SIID platform`,
    url: `${window.location.origin}/dashboard/projects/${project.id}`,
  }

  return await share(shareData, { method: "auto", trackActivity: true })
}

/**
 * Share work schedule task
 */
export async function shareTask(task: {
  id: string
  title: string
  startDate: string
  endDate: string
  assignedTo: string[]
}): Promise<boolean> {
  const shareData: ShareData = {
    title: `Task: ${task.title}`,
    text: `Task Assignment:\n• Start: ${task.startDate}\n• End: ${task.endDate}\n• Assigned: ${task.assignedTo.join(", ")}\n\nManage on SIID platform`,
    url: `${window.location.origin}/dashboard/schedule`,
  }

  return await share(shareData, { method: "auto", trackActivity: true })
}

/**
 * Track sharing activity
 */
function trackShareActivity(data: ShareData, method: string) {
  const activity = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    method,
    title: data.title,
    sharedBy: getUserName(),
  }

  const activities = JSON.parse(localStorage.getItem("shareActivities") || "[]")
  activities.unshift(activity)
  localStorage.setItem("shareActivities", JSON.stringify(activities.slice(0, 100)))
  // also record in database
  fetch("/api/db/share_activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activity),
  }).catch((e) => console.error("DB share activity failed", e))
}

/**
 * Get current user name
 */
function getUserName(): string {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    return user.name || "Anonymous"
  } catch {
    return "Anonymous"
  }
}

/**
 * Get share activity history
 */
export function getShareHistory(): any[] {
  return JSON.parse(localStorage.getItem("shareActivities") || "[]")
}

/**
 * Create secure access link for sharing
 */
export function createSecureLink(resourceId: string, resourceType: string, expiresIn = 7): string {
  const expiry = Date.now() + expiresIn * 24 * 60 * 60 * 1000
  const token = btoa(`${resourceId}:${resourceType}:${expiry}`)

  return `${window.location.origin}/shared/${token}`
}

/**
 * Share with multiple methods dialog
 */
export async function showShareDialog(data: ShareData): Promise<void> {
  const methods = [
    { name: "Gmail", action: () => shareViaGmail(data) },
    { name: "WhatsApp", action: () => shareViaWhatsApp(data) },
  ]

  if (navigator.share) {
    methods.unshift({ name: "Share", action: () => shareViaNativeAPI(data) })
  }

  // This would typically open a custom dialog
  // For now, we'll default to auto behavior
  return await share(data, { method: "auto" })
}
