"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Activity, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLogs() {
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const loadLogs = async () => {
        setLoading(true)
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            if (token) headers.Authorization = `Bearer ${token}`

            let res = await fetch('/api/backend-proxy/admin/logs', { credentials: 'include', headers })
            if (!res.ok) res = await fetch('/api/admin/logs', { credentials: 'include', headers })
            if (res.ok) {
                const data = await res.json()
                setLogs(data.logs || data.recent_logs || [])
            }
        } catch (e) {
            console.error("Failed to load logs", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadLogs()
    }, [])

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-white">Activity <span className="text-blue-500">Logs</span></h1>
                    <p className="text-slate-400">Recent login, project, and AI events for SIID operations.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={loadLogs}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </Button>
            </header>

            <Card className="bg-slate-900 border-slate-800 overflow-x-auto">
                <CardHeader>
                    <CardTitle className="text-white">Latest System Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="p-6 text-slate-400">Loading logs…</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                                    <th className="p-3">Time</th>
                                    <th className="p-3">User</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="p-3 text-sm text-slate-300">{new Date(log.timestamp || log.created_at).toLocaleString()}</td>
                                        <td className="p-3 text-sm text-slate-200">{log.user_name || log.username || "System"}</td>
                                        <td className="p-3 text-sm text-slate-300">{log.action}</td>
                                    </tr>
                                ))}
                                {logs.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={3} className="p-6 text-center text-slate-500">No logs available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Activity className="w-4 h-4" />
                    <p>Automatically archived projected logs and error severities also available in <strong>System Reports</strong>.</p>
                </div>
            </Card>
        </div>
    )
}
