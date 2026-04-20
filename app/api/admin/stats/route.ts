import { NextResponse } from "next/server"
import { getAll } from "@/lib/db"

export async function GET() {
    const users = getAll("users")
    const projects = getAll("projects")
    const layouts = getAll("layouts") // Assuming this stores generated designs
    const logs = getAll("activity_logs")

    const now = new Date()
    const oneDayAgo = new Date(now)
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const dailyActiveUsers = new Set(
        logs
            .filter((l: any) => l.timestamp && new Date(l.timestamp) >= oneDayAgo)
            .map((l: any) => l.user_id)
    ).size

    const completedProjects = projects.filter((p: any) => p.status === 'completed' || p.completed === true).length

    const totalRevenue = projects.reduce((sum: number, p: any) => {
        const budgetMax = p?.estimation?.budgetRange?.max
        const parsed = typeof budgetMax === 'string' ? Number(budgetMax.replace(/[^0-9.]/g, '')) : Number(budgetMax)
        if (!Number.isNaN(parsed)) return sum + parsed
        if (p?.estimation?.budget) {
            const b = typeof p.estimation.budget === 'string' ? Number(p.estimation.budget.replace(/[^0-9.]/g, '')) : Number(p.estimation.budget)
            if (!Number.isNaN(b)) return sum + b
        }
        return sum
    }, 0)

    const aiPredictions = logs.filter((l: any) => /AI/i.test(l.action)).length
    const aiFeatureUsage = {
        "Material Estimator": logs.filter((l: any) => /material/i.test(l.action)).length,
        "Vastu Analyzer": logs.filter((l: any) => /vastu/i.test(l.action)).length,
        "Layout Generator": logs.filter((l: any) => /layout/i.test(l.action)).length,
    }

    const failedLogins24h = logs.filter((l: any) => /login.*fail|failed login|invalid credentials/i.test(l.action) && l.timestamp && new Date(l.timestamp) >= oneDayAgo).length
    const successfulLogins24h = logs.filter((l: any) => /login/i.test(l.action) && !/fail|failed/i.test(l.action) && l.timestamp && new Date(l.timestamp) >= oneDayAgo).length
    const newUsers24h = users.filter((u: any) => u.created_at && new Date(u.created_at) >= oneDayAgo).length
    const currentlyOnlineUsers = new Set(logs.filter((l: any) => /login/i.test(l.action) && l.timestamp && new Date(l.timestamp) >= new Date(now.getTime() - 1000 * 60 * 10)).map((l: any) => l.user_id)).size
    const projectInProgress = projects.filter((p: any) => (p.status || "").toLowerCase() === "in-progress" || (p.status || "").toLowerCase() === "active").length
    const averageProjectDurationDays = projects
        .filter((p: any) => p.created_at && p.completed_at)
        .reduce((acc: number, p: any, idx: number, arr: any[]) => {
            const start = new Date(p.created_at)
            const end = new Date(p.completed_at)
            const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
            return acc + days
        }, 0)
    const avgProjectDuration = projectInProgress ? Number((averageProjectDurationDays / (projects.filter((p: any) => p.created_at && p.completed_at).length || 1)).toFixed(1)) : 0

    return NextResponse.json({
        total_users: users.length,
        total_projects: projects.length,
        active_projects: projects.filter((p: any) => p.status === 'active' || !p.status).length,
        completed_projects: completedProjects,
        total_revenue: Number(totalRevenue.toFixed(2)),
        daily_active_users: dailyActiveUsers,
        ai_designs: layouts.length,
        reports_generated: 95,
        ai_predictions: aiPredictions,
        ai_feature_usage: aiFeatureUsage,
        logs_count: logs.length,
        new_users_24h: newUsers24h,
        login_success_24h: successfulLogins24h,
        login_fail_24h: failedLogins24h,
        online_users: currentlyOnlineUsers,
        in_progress_projects: projectInProgress,
        avg_project_duration_days: avgProjectDuration,
        system_time: now.toISOString(),
    })
}

