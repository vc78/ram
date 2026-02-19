import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface LoadingStateProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingState({ message = "Loading...", size = "md" }: LoadingStateProps) {
  const sizeClasses = {
    sm: "p-4",
    md: "p-8",
    lg: "p-12",
  }

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <Card className={`text-center ${sizeClasses[size]}`}>
      <Loader2 className={`${iconSizes[size]} mx-auto mb-3 animate-spin text-primary`} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </Card>
  )
}
