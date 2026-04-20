import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"

export async function GET() {
    const users = getAll("users")
    const projects = getAll("projects")
    const logs = getAll("activity_logs")

    const projectTypeCounts: Record<string, number> = {}
    projects.forEach((p: any) => {
        const type = (p.building_type || p.type || "Unknown").toString().toLowerCase()
        projectTypeCounts[type] = (projectTypeCounts[type] || 0) + 1
    })

    const projectStatuses: Record<string, number> = {}
    projects.forEach((p: any) => {
        const status = (p.status || (p.completed ? "completed" : "active") || "unknown").toString().toLowerCase()
        projectStatuses[status] = (projectStatuses[status] || 0) + 1
    })

    const now = new Date()
    const oneDayAgo = new Date(now)
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const months = [...Array(12)].map((_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
        const label = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
        return { label, date, count: 0 }
    })

    projects.forEach((p: any) => {
        const createdAt = p.created_at ? new Date(p.created_at) : null
        if (!createdAt || isNaN(createdAt.getTime())) return

        const monthLabel = createdAt.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
        const entry = months.find((m) => m.label === monthLabel)
        if (entry) entry.count += 1
    })

    const userGrowth = [...Array(12)].map((_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
        const label = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
        const count = users.filter((u: any) => {
            if (!u.created_at) return false
            const created = new Date(u.created_at)
            return created <= new Date(date.getFullYear(), date.getMonth() + 1, 0)
        }).length
        return { label, count }
    })

    const aiUsageActions = logs.filter((l: any) => /AI/i.test(l.action))
    const aiUsageTrend: Record<string, number> = {}
    aiUsageActions.forEach((l: any) => {
        const d = l.timestamp ? new Date(l.timestamp) : new Date()
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        aiUsageTrend[label] = (aiUsageTrend[label] || 0) + 1
    })

    const loginSuccess24h = logs.filter((l: any) => /login/i.test(l.action) && !/fail|failed|invalid/i.test(l.action) && l.timestamp && new Date(l.timestamp) >= oneDayAgo).length
    const loginFail24h = logs.filter((l: any) => /login.*fail|failed login|invalid credentials/i.test(l.action) && l.timestamp && new Date(l.timestamp) >= oneDayAgo).length
    const newUsers24h = users.filter((u: any) => u.created_at && new Date(u.created_at) >= oneDayAgo).length

    const usageTrend = Object.entries(aiUsageTrend).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()).map(([date, value]) => ({ date, value }))

    return NextResponse.json({
        projects_per_month: months.map((m) => ({ month: m.label, value: m.count })),
        project_types: Object.entries(projectTypeCounts).map(([type, value]) => ({ type, value })),
        project_statuses: Object.entries(projectStatuses).map(([status, value]) => ({ status, value })),
        user_growth: userGrowth,
        ai_usage_trend: usageTrend,
        ai_predictions: aiUsageActions.length,
        ai_feature_usage: {
            "Material Estimator": logs.filter((l: any) => /material/i.test(l.action)).length,
            "Vastu Analyzer": logs.filter((l: any) => /vastu/i.test(l.action)).length,
            "Layout Generator": logs.filter((l: any) => /layout/i.test(l.action)).length,
        },
        login_success_24h: loginSuccess24h,
        login_fail_24h: loginFail24h,
        new_users_24h: newUsers24h,
        recent_logs: logs
            .map((l: any) => ({ ...l, timestamp: l.timestamp || new Date().toISOString() }))
            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10),
    })
}
