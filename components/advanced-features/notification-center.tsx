"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck, Settings, X, AlertCircle, CheckCircle2, Info, Calendar } from "lucide-react"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "reminder"
  title: string
  message: string
  time: string
  read: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Design Approved",
    message: "Your architectural design for Modern Villa has been approved by the contractor.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Payment Due",
    message: "Milestone payment of ₹2,50,000 is due for the foundation work.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "New Quote Received",
    message: "Spark Electrical Services has sent a quote for your project.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "reminder",
    title: "Site Visit Tomorrow",
    message: "Scheduled site inspection with contractor at 10:00 AM.",
    time: "1 day ago",
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [isOpen, setIsOpen] = useState(true)

  const unreadCount = notifications.filter((n) => !n.read).length

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

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full shadow-lg">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
    )
  }

  return (
    <Card className="p-4 border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.read ? "bg-background" : "bg-primary/5 border-primary/20"
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{notification.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNotification(notification.id)
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <span className="text-xs text-muted-foreground mt-2 block">{notification.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
