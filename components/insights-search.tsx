"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  TrendingUp,
  Clock,
  Bookmark,
  BookmarkCheck,
  Filter,
  Grid3X3,
  List,
  ExternalLink,
  Share2,
  Copy,
  Check,
  Sparkles,
  Building2,
  Users,
  FileText,
  Calculator,
  Briefcase,
  Phone,
  Leaf,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  History,
  ArrowUpRight,
  Lightbulb,
  Target,
  Globe,
  SlidersHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", label: "All", icon: Grid3X3 },
  { id: "ai", label: "AI & Tech", icon: Sparkles },
  { id: "construction", label: "Construction", icon: Building2 },
  { id: "contractors", label: "Contractors", icon: Users },
  { id: "budget", label: "Budget", icon: Calculator },
  { id: "careers", label: "Careers", icon: Briefcase },
  { id: "sustainability", label: "Green", icon: Leaf },
]

const quickSearches = [
  { label: "AI Design", query: "AI Design", icon: Sparkles },
  { label: "Find Contractors", query: "Contractor", icon: Users },
  { label: "Budget Planning", query: "Budget", icon: Calculator },
  { label: "Green Building", query: "Green", icon: Leaf },
]

const trendingTopics = ["Smart Materials 2024", "AI Floor Plans", "Green Certification", "Labor Cost Index"]

type ViewMode = "grid" | "list"
type SortOption = "relevance" | "recent" | "popular"

export function InsightsSearch() {
  const [qInput, setQInput] = useState("")
  const [q, setQ] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [filterByBookmarks, setFilterByBookmarks] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetcher = async (url: string, body: any) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return res.json()
  }

  const mutate = async () => {
    if (!q.trim()) {
      setData(null)
      return
    }
    setIsLoading(true)
    try {
      const result = await fetcher("/api/search", { q, limit: 20 })
      setData(result)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    mutate()
  }, [q])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(mutate, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh, q])

  const ok = data?.ok
  const rawResults: Array<{ title: string; link: string; snippet: string }> = ok ? (data?.results ?? []) : []

  const filteredResults = useMemo(() => {
    let results = rawResults

    if (selectedCategory !== "all") {
      results = results.filter((r) => {
        const text = (r.title + r.snippet).toLowerCase()
        switch (selectedCategory) {
          case "ai":
            return text.includes("ai") || text.includes("design") || text.includes("generat")
          case "construction":
            return text.includes("construct") || text.includes("building") || text.includes("material")
          case "contractors":
            return text.includes("contractor") || text.includes("hire")
          case "budget":
            return text.includes("budget") || text.includes("cost") || text.includes("estimat") || text.includes("inr")
          case "careers":
            return text.includes("career") || text.includes("job") || text.includes("hiring")
          case "sustainability":
            return text.includes("green") || text.includes("sustain") || text.includes("eco")
          default:
            return true
        }
      })
    }

    if (filterByBookmarks) {
      results = results.filter((r) => bookmarks.includes(r.link))
    }

    if (sortBy === "popular") {
      results = [...results].sort((a, b) => b.snippet.length - a.snippet.length)
    }

    return results
  }, [rawResults, selectedCategory, sortBy, filterByBookmarks, bookmarks])

  const copyLink = useCallback((link: string) => {
    const fullLink = link.startsWith("http") ? link : `${window.location.origin}${link}`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullLink)
        .then(() => {
          setCopiedLink(link)
          setTimeout(() => setCopiedLink(null), 2000)
        })
        .catch(() => {
          // Fallback to execCommand
          const textarea = document.createElement("textarea")
          textarea.value = fullLink
          textarea.style.position = "fixed"
          textarea.style.left = "-9999px"
          document.body.appendChild(textarea)
          textarea.select()
          try {
            document.execCommand("copy")
            setCopiedLink(link)
            setTimeout(() => setCopiedLink(null), 2000)
          } catch {
            console.warn("Copy failed")
          }
          document.body.removeChild(textarea)
        })
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = fullLink
      textarea.style.position = "fixed"
      textarea.style.left = "-9999px"
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand("copy")
        setCopiedLink(link)
        setTimeout(() => setCopiedLink(null), 2000)
      } catch {
        console.warn("Copy failed")
      }
      document.body.removeChild(textarea)
    }
  }, [])

  const executeSearch = useCallback(
    (query: string) => {
      setQ(query)
      setQInput(query)
      if (query && !searchHistory.includes(query)) {
        setSearchHistory((prev) => [query, ...prev.slice(0, 9)])
      }
      setShowHistory(false)
    },
    [searchHistory],
  )

  const toggleBookmark = useCallback((link: string) => {
    setBookmarks((prev) => (prev.includes(link) ? prev.filter((l) => l !== link) : [...prev, link]))
  }, [])

  const shareResult = useCallback(
    async (result: { title: string; link: string }) => {
      const fullLink = result.link.startsWith("http") ? result.link : `${window.location.origin}${result.link}`

      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.({ title: result.title, url: fullLink })
      ) {
        try {
          await navigator.share({ title: result.title, url: fullLink })
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            copyLink(result.link)
          }
        }
      } else {
        copyLink(result.link)
      }
    },
    [copyLink],
  )

  const getCategoryIcon = (result: { title: string; snippet: string }) => {
    const text = (result.title + result.snippet).toLowerCase()
    if (text.includes("ai") || text.includes("design")) return Sparkles
    if (text.includes("contractor")) return Users
    if (text.includes("budget") || text.includes("cost")) return Calculator
    if (text.includes("career") || text.includes("job")) return Briefcase
    if (text.includes("green") || text.includes("sustain")) return Leaf
    if (text.includes("contact") || text.includes("phone")) return Phone
    if (text.includes("project")) return FileText
    return Building2
  }

  const resultStats = useMemo(
    () => ({
      total: filteredResults.length,
      bookmarked: filteredResults.filter((r) => bookmarks.includes(r.link)).length,
    }),
    [filteredResults, bookmarks],
  )

  const clearSearch = useCallback(() => {
    setQInput("")
    setQ("")
    setSelectedCategory("all")
    setFilterByBookmarks(false)
  }, [])

  return (
    <TooltipProvider>
      <Card className="border-border bg-background overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Live Insights</CardTitle>
                <CardDescription>Discover construction trends, AI tools & more</CardDescription>
              </div>
            </div>

            {/* View controls */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={autoRefresh ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                  >
                    <RefreshCw className={cn("h-4 w-4", autoRefresh && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Auto-refresh {autoRefresh ? "ON" : "OFF"}</TooltipContent>
              </Tooltip>

              <div className="flex border rounded-lg overflow-hidden">
                {[
                  { mode: "list" as ViewMode, icon: List },
                  { mode: "grid" as ViewMode, icon: Grid3X3 },
                ].map(({ mode, icon: Icon }) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => setViewMode(mode)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </div>

            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    onFocus={() => setShowHistory(true)}
                    placeholder="Search insights, trends, tools..."
                    className="pl-10 pr-10 h-11"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") executeSearch(qInput)
                      if (e.key === "Escape") setShowHistory(false)
                    }}
                  />
                  {qInput && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Filter dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-11 w-11 bg-transparent">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    {[
                      { value: "relevance", label: "Relevance", icon: Target },
                      { value: "recent", label: "Most Recent", icon: Clock },
                      { value: "popular", label: "Most Popular", icon: TrendingUp },
                    ].map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortBy(option.value as SortOption)}
                        className={cn(sortBy === option.value && "bg-secondary")}
                      >
                        <option.icon className="h-4 w-4 mr-2" />
                        {option.label}
                        {sortBy === option.value && <Check className="h-4 w-4 ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked={filterByBookmarks} onCheckedChange={setFilterByBookmarks}>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmarked Only
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button onClick={() => executeSearch(qInput)} disabled={isLoading} className="h-11 px-5">
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {/* Search history dropdown */}
              {showHistory && searchHistory.length > 0 && (
                <Card className="absolute top-full left-0 right-0 mt-2 z-50 p-2 shadow-lg border">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <History className="h-3 w-3" /> Recent Searches
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setSearchHistory([])}>
                      Clear
                    </Button>
                  </div>
                  {searchHistory.map((term) => (
                    <Button
                      key={term}
                      variant="ghost"
                      className="w-full justify-start text-sm h-9"
                      onClick={() => executeSearch(term)}
                    >
                      <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                      {term}
                    </Button>
                  ))}
                </Card>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Quick Search</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((item) => (
                <Button
                  key={item.query}
                  variant="outline"
                  size="sm"
                  className="h-9 bg-transparent"
                  onClick={() => executeSearch(item.query)}
                >
                  <item.icon className="h-3.5 w-3.5 mr-1.5" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  className="h-9"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <cat.icon className="h-3.5 w-3.5 mr-1.5" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Results</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {isLoading ? "Searching..." : `${resultStats.total} found`}
                </span>
                {q && (
                  <Badge variant="secondary" className="text-xs">
                    "{q}"
                  </Badge>
                )}
              </div>
            </div>

            {/* Trending (show when no search) */}
            {!q && (
              <div className="p-4 rounded-xl bg-muted/50 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Trending Now</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1.5 px-3"
                      onClick={() => executeSearch(topic)}
                    >
                      {topic}
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Results list */}
            <div className={cn("space-y-3", viewMode === "grid" && "grid grid-cols-1 md:grid-cols-2 gap-3 space-y-0")}>
              {(isLoading ? Array.from({ length: 3 }) : filteredResults).map((r: any, i: number) => {
                const IconComponent = !isLoading ? getCategoryIcon(r) : Building2
                const isExpanded = expandedCard === r?.link
                const isBookmarked = bookmarks.includes(r?.link)

                return (
                  <Card
                    key={i}
                    className={cn(
                      "group relative overflow-hidden transition-all duration-200",
                      "hover:shadow-md hover:border-primary/20",
                      isBookmarked && "border-primary/30 bg-primary/5",
                    )}
                  >
                    {isLoading ? (
                      <div className="p-4 space-y-3">
                        <div className="h-5 w-3/4 animate-pulse bg-muted rounded" />
                        <div className="h-4 w-full animate-pulse bg-muted rounded" />
                        <div className="h-4 w-1/2 animate-pulse bg-muted rounded" />
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="p-2 rounded-lg bg-muted shrink-0">
                              <IconComponent className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <a
                                href={r.link}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold hover:text-primary transition-colors flex items-center gap-1 group/link"
                              >
                                <span className="truncate">{r.title}</span>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                              </a>
                              <p className={cn("text-sm text-muted-foreground mt-1", !isExpanded && "line-clamp-2")}>
                                {r.snippet}
                              </p>

                              {r.snippet.length > 100 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 mt-1 text-xs p-0 hover:bg-transparent"
                                  onClick={() => setExpandedCard(isExpanded ? null : r.link)}
                                >
                                  {isExpanded ? (
                                    <>
                                      Show less <ChevronUp className="h-3 w-3 ml-1" />
                                    </>
                                  ) : (
                                    <>
                                      Read more <ChevronDown className="h-3 w-3 ml-1" />
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => toggleBookmark(r.link)}
                                >
                                  {isBookmarked ? (
                                    <BookmarkCheck className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Bookmark className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{isBookmarked ? "Remove" : "Bookmark"}</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => copyLink(r.link)}
                                >
                                  {copiedLink === r.link ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy link</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => shareResult(r)}>
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Share</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{r.link}</span>
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>

            {/* No results state */}
            {!isLoading && filteredResults.length === 0 && (
              <div className="text-center py-12 rounded-xl bg-muted/30">
                <div className="p-4 rounded-full bg-muted inline-block mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {filterByBookmarks
                    ? "No bookmarked items match your search."
                    : "Try adjusting your search or filters."}
                </p>
                <Button variant="outline" onClick={clearSearch}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          <Separator />

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-2">Pro Tips</h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>• Use quick search buttons for instant results</li>
                  <li>• Bookmark important insights for later</li>
                  <li>• Enable auto-refresh for live updates</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

export default InsightsSearch
