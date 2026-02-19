"use client"

import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { ProgressAnalytics } from "@/components/progress-analytics"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"

export default function ProjectAnalyticsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/dashboard/projects/1/manage"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Project Management
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Project Analytics</h1>
                <p className="text-muted-foreground">Advanced progress tracking and insights</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Report
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent-dark text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <ProgressAnalytics />
          <AdvancedAnalyticsDashboard />
        </div>
      </div>
    </AuthGuard>
  )
}
