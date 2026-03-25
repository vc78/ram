"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  TrendingUp,
  FileText,
  Bell,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Control", icon: Users },
    { href: "/admin/projects", label: "Project Fleet", icon: FolderOpen },
    { href: "/admin/analytics", label: "Core Analytics", icon: BarChart3 },
    { href: "/admin/reports", label: "System Reports", icon: FileText },
    { href: "/admin/settings", label: "Terminal Settings", icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 text-slate-200 border-r border-slate-800 flex flex-col z-40">
      <div className="p-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">SIID <span className="text-blue-500">ADMIN</span></span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-4 mb-4">Command Center</div>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                    : "hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-500" : "group-hover:text-slate-200"}`} />
                <span className="text-sm font-medium">{link.label}</span>
              </button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
           <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500">
             <TrendingUp className="w-3 h-3" />
             SYSTEM LOAD
           </div>
           <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-blue-600 w-1/3" />
           </div>
           <div className="mt-2 text-[10px] text-slate-600 text-center">v2.4.0-production</div>
        </div>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-400/5"
          onClick={() => {
            logout()
            router.push("/login")
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Exit Terminal</span>
        </Button>
      </div>
    </aside>
  )
}
