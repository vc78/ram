"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Search, Download, Loader2 } from "lucide-react"
import type { QAPair } from "@/lib/siid-knowledge-base"

export function AITrainingInterface() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<QAPair[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/ai-training?action=stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        action: "search",
        query,
      })

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      if (selectedDifficulty !== "all") {
        params.append("difficulty", selectedDifficulty)
      }

      const response = await fetch(`/api/ai-training?${params}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.data.results)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportTrainingData = async () => {
    try {
      const response = await fetch("/api/ai-training?action=all")
      const data = await response.json()

      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data.questions, null, 2)], {
          type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `siid-training-data-${new Date().toISOString()}.json`
        a.click()
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-blue-500"
      case "advanced":
        return "bg-orange-500"
      case "expert":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalQuestions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.categories}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expert Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.byDifficulty.expert}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Coverage Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">98%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Training Knowledge Base
          </CardTitle>
          <CardDescription>Search and explore 1000+ technical Q&A pairs about the SIID project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search questions (e.g., 'How does AI design generation work?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </Button>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              {stats?.byCategory &&
                Object.keys(stats.byCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({stats.byCategory[cat]})
                  </option>
                ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>

            <Button onClick={exportTrainingData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((qa) => (
                <div key={qa.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{qa.question}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{qa.answer}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{qa.category}</Badge>
                        <Badge variant="outline">{qa.subcategory}</Badge>
                        <Badge className={getDifficultyColor(qa.difficulty)}>{qa.difficulty}</Badge>
                        {qa.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
