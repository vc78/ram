"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck, Settings, X, AlertCircle, CheckCircle2, Info, Calendar, Sparkles, Zap, ArrowRight, Bot, Clock } from "lucide-react"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "reminder"
  title: string
  message: string
  time: string
  read: boolean
  timestamp: number
  mlInsights?: {
    urgencyScore: number // 0-100
    category: "Action Required" | "Decision Pending" | "Observation"
    suggestedAction?: string
  }
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Design Approved",
    message: "Your architectural design for Modern Villa has been approved by the contractor.",
    time: "2 hours ago",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    read: false,
    mlInsights: {
      urgencyScore: 45,
      category: "Observation",
      suggestedAction: "View Approved Design"
    }
  },
  {
    id: "2",
    type: "warning",
    title: "Payment Due",
    message: "Milestone payment of ₹2,50,000 is due for the foundation work.",
    time: "5 hours ago",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    read: false,
    mlInsights: {
      urgencyScore: 92,
      category: "Action Required",
      suggestedAction: "Process Payment Now"
    }
  },
  {
    id: "3",
    type: "info",
    title: "New Quote Received",
    message: "Spark Electrical Services has sent a quote for your project.",
    time: "1 day ago",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    read: true,
    mlInsights: {
      urgencyScore: 78,
      category: "Decision Pending",
      suggestedAction: "Compare Quotes"
    }
  },
  {
    id: "4",
    type: "reminder",
    title: "Site Visit Tomorrow",
    message: "Scheduled site inspection with contractor at 10:00 AM.",
    time: "1 day ago",
    timestamp: Date.now() - 26 * 60 * 60 * 1000,
    read: true,
    mlInsights: {
      urgencyScore: 85,
      category: "Action Required",
      suggestedAction: "Review Inspection Checklist"
    }
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [sortMode, setSortMode] = useState<"time" | "smart">("smart")

  const unreadCount = notifications.filter((n) => !n.read).length

  const sortedNotifications = useMemo(() => {
    let sorted = [...notifications]
    if (sortMode === "smart") {
      sorted.sort((a, b) => {
        const scoreA = a.mlInsights?.urgencyScore || 0
        const scoreB = b.mlInsights?.urgencyScore || 0
        return scoreB - scoreA
      })
    } else {
      sorted.sort((a, b) => b.timestamp - a.timestamp)
    }
    return sorted
  }, [notifications, sortMode])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      case "reminder":
        return <Calendar className="w-5 h-5 text-purple-500" />
    }
  }

  const getUrgencyColor = (score: number) => {
    if (score >= 90) return "text-red-600 bg-red-100 border-red-200"
    if (score >= 70) return "text-orange-600 bg-orange-100 border-orange-200"
    if (score >= 40) return "text-blue-600 bg-blue-100 border-blue-200"
    return "text-slate-600 bg-slate-100 border-slate-200"
  }

  return (
    <Card className="flex flex-col h-full border-border bg-gradient-to-br from-background to-muted/20 relative overflow-hidden backdrop-blur-xl">
      {/* Decorative Tech BG */}
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

      <div className="p-6 pb-4 border-b relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg tracking-tight">Intelligence Hub</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={markAllRead} title="Mark all read">
              <CheckCheck className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" title="Settings">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* ML Sort Toggle */}
        <div className="flex bg-muted p-1 rounded-lg">
          <button 
            onClick={() => setSortMode("smart")}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-medium py-1.5 px-3 rounded-md transition-all ${
              sortMode === "smart" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Priority Sort
          </button>
          <button 
            onClick={() => setSortMode("time")}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-medium py-1.5 px-3 rounded-md transition-all ${
              sortMode === "time" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Chronological
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10 custom-scrollbar">
        {sortedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
             <Bell className="w-12 h-12 mb-4 opacity-20" />
             <p>No new insights or notifications</p>
          </div>
        ) : (
          sortedNotifications.map((notification, index) => {
            const urgencyClasses = notification.mlInsights ? getUrgencyColor(notification.mlInsights.urgencyScore) : ""
            const isHighUrgency = notification.mlInsights && notification.mlInsights.urgencyScore >= 90
            
            return (
              <div
                key={notification.id}
                className={`relative group overflow-hidden p-4 rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer
                  ${notification.read ? "bg-background/80 hover:bg-background border-border" : "bg-card shadow-sm border-primary/20"}
                  ${isHighUrgency && !notification.read ? "ring-1 ring-red-500/30" : ""}
                `}
                onClick={() => markAsRead(notification.id)}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Visual urgency line */}
                {notification.mlInsights && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    notification.mlInsights.urgencyScore >= 80 ? 'bg-red-500' :
                    notification.mlInsights.urgencyScore >= 50 ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                )}

                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 p-2 rounded-full flex-shrink-0 ${notification.read ? 'bg-muted' : 'bg-primary/10'}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                       <h4 className={`font-semibold text-sm truncate pr-6 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                         {notification.title}
                       </h4>
                       <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 absolute top-2 right-2 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                      >
                        <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                    
                    <p className={`text-sm mt-1 leading-relaxed ${notification.read ? 'text-muted-foreground' : 'text-foreground/90'}`}>
                      {notification.message}
                    </p>

                    {/* ML Insights Enhanced UI */}
                    {notification.mlInsights && (
                      <div className="mt-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={`text-[10px] leading-tight px-1.5 py-0 border ${urgencyClasses}`}>
                            <Zap className="w-3 h-3 mr-1 fill-current" />
                            Urgency: {notification.mlInsights.urgencyScore}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                            <Bot className="w-3 h-3" />
                            {notification.mlInsights.category}
                          </span>
                        </div>
                        
                        {notification.mlInsights.suggestedAction && (
                           <div className="flex items-center">
                              <button className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1">
                                {notification.mlInsights.suggestedAction}
                                <ArrowRight className="w-3 h-3" />
                              </button>
                           </div>
                        )}
                      </div>
                    )}

                    <span className="text-[11px] font-medium text-muted-foreground/60 mt-3 block uppercase tracking-wider">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
