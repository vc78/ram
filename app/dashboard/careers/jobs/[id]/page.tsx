"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import { apiGet, apiPost } from "@/lib/backend"

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [apps, setApps] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const j = await apiGet<any[]>("/careers/jobs")
      const found = Array.isArray(j) ? j.find((x: any) => String(x.id) === String(id)) : null
      setJob(found || null)
      const a = await apiGet<any[]>("/careers/applications")
      const fa = Array.isArray(a)
        ? a.filter(
            (x: any) =>
              x.role?.toLowerCase() === (found?.title || "").toLowerCase() ||
              (found?.project && x.project?.toLowerCase() === found.project.toLowerCase()),
          )
        : []
      setApps(fa)
    }
    load()
  }, [id])

  async function generateLetterOnServer(app: any, action: "approved" | "rejected") {
    try {
      const data = await apiPost<{ text?: string }>("/letters/approval", {
        action,
        appId: app.id,
        name: app.candidateName,
      })
      if (data?.text) {
        const blob = new Blob([data.text], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `SIID-${action}-letter-${app.id}.txt`
        a.click()
        URL.revokeObjectURL(url)
        return
      }
    } catch {
      // no-op; fall back to client generator below
    }
    downloadLetter(app, action)
  }

  function downloadLetter(app: any, action: "approved" | "rejected") {
    const stamp = new Date().toLocaleString()
    const text = `Government of Demo Works
Ref: SIID/${app.id}/${new Date().getFullYear()}

To: ${app.candidateName}
Role: ${app.role}
Project: ${app.project}

Decision: ${action === "approved" ? "APPROVED" : "REJECTED"}
Date: ${stamp}

This is an auto-generated demo letter for showcase purposes only.

Authorized Signatory
`
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `SIID-${action}-letter-${app.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!job) {
    return (
      <main className="container mx-auto p-8">
        <Link href="/dashboard/careers" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Careers
        </Link>
        <p className="mt-6 text-muted-foreground">Loading job…</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/careers" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Careers
        </Link>
        <div className="text-right">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-sm text-muted-foreground">
            {job.project} • {job.location}
          </p>
        </div>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Type: {job.type}</span>
          <span>Salary: {job.salary}</span>
          <span>Posted: {job.postedDate}</span>
          <span>Match Score: {job.matchScore}%</span>
        </div>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Applicants</h2>
      <div className="space-y-4">
        {apps.length === 0 && <p className="text-muted-foreground">No applicants yet for this role.</p>}
        {apps.map((app) => (
          <Card key={app.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{app.candidateName}</div>
                <div className="text-sm text-muted-foreground">
                  {app.role} • {app.project} • {app.experience}
                </div>
                <div className="text-sm text-muted-foreground">
                  {app.email} • {app.phone}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => generateLetterOnServer(app, "approved")} className="bg-primary text-white">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/careers/apply?role=${encodeURIComponent(app.role)}`)}
                >
                  View Profile
                </Button>
                <Button variant="destructive" onClick={() => generateLetterOnServer(app, "rejected")}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
