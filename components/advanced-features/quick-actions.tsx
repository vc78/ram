"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, FileText, Users, Calendar, Download, Settings, HelpCircle, Zap } from "lucide-react"

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  color: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "new-project",
    label: "New Project",
    icon: <Plus className="w-5 h-5" />,
    href: "/dashboard/new-project",
    color: "bg-primary",
  },
  {
    id: "generate-design",
    label: "Generate Design",
    icon: <Zap className="w-5 h-5" />,
    href: "/dashboard/new-project",
    color: "bg-amber-500",
  },
  {
    id: "find-contractor",
    label: "Find Contractor",
    icon: <Users className="w-5 h-5" />,
    href: "/dashboard/contractors",
    color: "bg-green-500",
  },
  {
    id: "my-documents",
    label: "Documents",
    icon: <FileText className="w-5 h-5" />,
    href: "/dashboard",
    color: "bg-purple-500",
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: <Calendar className="w-5 h-5" />,
    href: "/dashboard/schedule",
    color: "bg-pink-500",
  },
  { id: "export", label: "Export", icon: <Download className="w-5 h-5" />, href: "/dashboard", color: "bg-orange-500" },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/dashboard/settings",
    color: "bg-gray-500",
  },
  { id: "help", label: "Get Help", icon: <HelpCircle className="w-5 h-5" />, href: "/help", color: "bg-indigo-500" },
]

export function QuickActions() {
  return (
    <Card className="p-6 border-border">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.id} href={action.href || "#"}>
            <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 hover:bg-muted bg-transparent">
              <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center text-white`}>
                {action.icon}
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  )
}
