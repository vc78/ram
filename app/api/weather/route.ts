import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") || "Hyderabad"

  try {
    // Using Open-Meteo API (free, no API key required)
    // First, get coordinates for the location using geocoding
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
    )

    if (!geoResponse.ok) {
      throw new Error("Failed to fetch location coordinates")
    }

    const geoData = await geoResponse.json()

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Location not found")
    }

    const { latitude, longitude, name } = geoData.results[0]

    // Get weather data using coordinates
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
    )

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const weatherData = await weatherResponse.json()
    const current = weatherData.current

    // Map WMO weather codes to conditions
    const getCondition = (code: number): "sunny" | "cloudy" | "rainy" | "windy" => {
      if (code === 0 || code === 1) return "sunny"
      if (code === 2 || code === 3) return "cloudy"
      if (code >= 51 && code <= 67) return "rainy"
      if (code >= 71 && code <= 77) return "rainy"
      if (code >= 80 && code <= 82) return "rainy"
      if (code >= 95 && code <= 99) return "rainy"
      return "cloudy"
    }

    const condition = getCondition(current.weather_code)

    // Construction advice based on weather
    const advice = {
      sunny: "Excellent conditions for concrete work, painting, and outdoor construction activities.",
      cloudy: "Ideal for most construction activities. Concrete curing is optimal in these conditions.",
      rainy: "Avoid concrete pouring and painting. Focus on indoor work and covered areas.",
      windy: "Secure loose materials. Avoid tall scaffolding work and crane operations if wind is strong.",
    }

    return NextResponse.json({
      temperature: Math.round(current.temperature_2m),
      condition,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      constructionAdvice: advice[condition],
      location: name,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Weather API error:", error)

    // Fallback data if API fails
    return NextResponse.json(
      {
        temperature: 28,
        condition: "sunny",
        humidity: 50,
        windSpeed: 10,
        constructionAdvice: "Weather data temporarily unavailable. Please check local conditions.",
        location,
        timestamp: new Date().toISOString(),
        error: "Failed to fetch real-time weather data",
      },
      { status: 200 },
    )
  }
}
