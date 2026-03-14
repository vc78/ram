"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Wind, Droplets, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WeatherData {
  temperature: number
  condition: "sunny" | "cloudy" | "rainy" | "windy"
  humidity: number
  windSpeed: number
  constructionAdvice: string
  location?: string
  timestamp?: string
  error?: string
}

export function WeatherWidget({ location = "Hyderabad" }: { location?: string }) {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    condition: "sunny",
    humidity: 50,
    windSpeed: 10,
    constructionAdvice: "Loading weather data...",
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchWeather = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
      if (!response.ok) {
        throw new Error("Failed to fetch weather")
      }
      const data = await response.json()
      setWeather(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("[v0] Weather fetch error:", error)
      setWeather({
        temperature: 28,
        condition: "sunny",
        humidity: 50,
        windSpeed: 10,
        constructionAdvice: "Unable to fetch weather data. Please try again later.",
        error: (error as Error)?.message || "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()

    // Refresh weather every 10 minutes
    const interval = setInterval(() => {
      fetchWeather()
    }, 600000)

    return () => clearInterval(interval)
  }, [location])
  // </CHANGE>

  const getWeatherIcon = (condition: WeatherData["condition"]) => {
    switch (condition) {
      case "sunny":
        return <Sun className="w-12 h-12 text-amber-400" />
      case "cloudy":
        return <Cloud className="w-12 h-12 text-gray-400" />
      case "rainy":
        return <CloudRain className="w-12 h-12 text-blue-400" />
      case "windy":
        return <Wind className="w-12 h-12 text-teal-400" />
    }
  }

  const getBackgroundGradient = () => {
    switch (weather.condition) {
      case "sunny":
        return "from-amber-50 to-orange-100"
      case "cloudy":
        return "from-gray-50 to-slate-100"
      case "rainy":
        return "from-blue-50 to-indigo-100"
      case "windy":
        return "from-teal-50 to-cyan-100"
      default:
        return "from-blue-50 to-blue-100"
    }
  }
  // </CHANGE>

  return (
    <Card className={`p-4 border-border bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-500`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-muted-foreground">{weather.location || location}</div>
        <Button variant="ghost" size="sm" onClick={fetchWeather} disabled={loading} className="h-8 w-8 p-0">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
        {/* </CHANGE> */}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold">{weather.temperature}°C</div>
          <div className="text-sm capitalize text-muted-foreground">{weather.condition}</div>
          {lastUpdated && (
            <div className="text-xs text-muted-foreground mt-1">
              Updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
          {/* </CHANGE> */}
        </div>
        {getWeatherIcon(weather.condition)}
      </div>

      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1">
          <Droplets className="w-4 h-4 text-blue-500" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-4 h-4 text-teal-500" />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
        <strong>Construction Tip:</strong> {weather.constructionAdvice}
      </div>

      {weather.error && <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded p-2">{weather.error}</div>}
      {/* </CHANGE> */}
    </Card>
  )
}
