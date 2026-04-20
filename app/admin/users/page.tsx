"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Users,
  Search,
  MoreVertical,
  UserPlus,
  Shield,
  Mail,
  Calendar,
  Lock,
  Trash2,
  Ban,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const updateUser = async (userId: string, action: "block" | "delete") => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      if (res.ok) {
        if (action === 'delete') {
          setUsers((prev) => prev.filter((u) => u.id !== userId))
        } else if (action === 'block') {
          setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: 'Suspended' } : u))
        }
      }
    } catch (err) {
      console.error(`Failed to ${action} user ${userId}`, err)
    }
  }

  useEffect(() => {
    async function loadUsers() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (token) headers.Authorization = `Bearer ${token}`

        let res = await fetch('/api/backend-proxy/admin/users', { credentials: 'include', headers })
        if (!res.ok) res = await fetch('/api/admin/users', { credentials: 'include', headers })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            setUsers(data.map((u: any) => ({
              id: u.id,
              name: u.name || "Unknown",
              email: u.email || "",
              role: u.role || "user",
              projects: u.projects_count || 0,
              joined: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              status: u.status === 'blocked' || u.status === 'suspended' ? 'Suspended' : 'Active'
            })))
          } else {
            setUsers([
              { id: 1, name: "Suresh Kumar", email: "suresh@example.com", role: "user", projects: 3, joined: "2024-01-12", status: "Active" },
              { id: 2, name: "Admin SIID", email: "admin@siid.com", role: "admin", projects: 0, joined: "2023-11-05", status: "Active" },
              { id: 3, name: "Arjun Reddy", email: "arjun@v-dev.com", role: "contractor", projects: 12, joined: "2023-12-20", status: "Suspended" },
            ])
          }
        }
      } catch (err) {
        console.error("Failed to load users", err)
      }
    }
    loadUsers()
  }, [])

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Identity <span className="text-blue-500">Node</span></h1>
          <p className="text-slate-400 text-lg">Manage user credentials and privilege levels across the ecosystem.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 shadow-lg shadow-blue-500/20">
          <UserPlus className="w-4 h-4 mr-2" /> Add Network User
        </Button>
      </header>

      <Card className="bg-slate-900 border-slate-800 p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="pl-12 bg-slate-950 border-slate-800 text-white h-12 rounded-xl focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-800 bg-slate-900 shadow-xl">Filter</Button>
            <Button variant="outline" className="border-slate-800 bg-slate-900 shadow-xl">Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-800">
              <tr className="text-left">
                <th className="pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Operator</th>
                <th className="pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Privilege</th>
                <th className="pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Projects</th>
                <th className="pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Deployment</th>
                <th className="pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="pb-4 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="group hover:bg-slate-800/10 transition-colors">
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500 font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <Badge className={user.role === 'admin' ? "bg-red-500/10 text-red-500 border-red-500/20" : user.role === 'contractor' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-6 px-4">
                    <span className="text-sm font-mono text-slate-300">{user.projects}</span>
                  </td>
                  <td className="py-6 px-4">
                    <span className="text-xs text-slate-500">{user.joined}</span>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{user.status}</span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => updateUser(user.id, 'block')} title="Suspend user">
                        <Lock className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => updateUser(user.id, 'delete')} title="Delete user">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
