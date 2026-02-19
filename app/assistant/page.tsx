"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getSuggestedQuestions, getEntriesByCategory, SIID_KNOWLEDGE_BASE } from "@/lib/siid-knowledge-base"
import {
  Sparkles,
  Send,
  Home,
  Building2,
  IndianRupee,
  Users,
  Zap,
  FileText,
  HelpCircle,
  ChevronLeft,
  Bot,
  User,
  Lightbulb,
  BookOpen,
} from "lucide-react"

type Message = { id: string; role: "user" | "assistant"; content: string }

const CATEGORIES = [
  { id: "platform", label: "Platform", icon: Sparkles },
  { id: "design", label: "Design", icon: Building2 },
  { id: "construction", label: "Construction", icon: Home },
  { id: "budget", label: "Budget", icon: IndianRupee },
  { id: "contractors", label: "Contractors", icon: Users },
  { id: "features", label: "Features", icon: Zap },
  { id: "technical", label: "Technical", icon: FileText },
  { id: "support", label: "Support", icon: HelpCircle },
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, isLoading])

  const suggestedQuestions = selectedCategory
    ? getEntriesByCategory(selectedCategory as any).map((e) => e.question)
    : getSuggestedQuestions()

  async function submit(text?: string) {
    const query = text || input.trim()
    if (!query || isLoading) return

    const user = { id: crypto.randomUUID(), role: "user" as const, content: query }
    setMessages((m) => [...m, user])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, user], sync: true }),
      })

      let answer = ""
      try {
        const data = await res.json()
        if (typeof data?.text === "string") answer = data.text
      } catch (_) {}

      if (!answer.trim()) {
        answer =
          "I'm here to help! Could you rephrase your question? You can also browse the categories on the left for common topics."
      }

      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: answer }])
    } catch (_err) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I ran into a temporary issue. Please try again—I'm ready to help with your questions about SIID.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">SIID AI Assistant</span>
              <Badge variant="secondary" className="ml-2">
                Trained
              </Badge>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{SIID_KNOWLEDGE_BASE.length}+ trained responses</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Browse Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  All Topics
                </Button>
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <cat.icon className="w-4 h-4 mr-2" />
                    {cat.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="min-h-[70vh] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  Ask me anything about SIID
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  I'm trained on construction, architecture, budgets, and the SIID platform
                </p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-4">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px]">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Bot className="w-16 h-16 mx-auto text-primary/20 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Welcome to SIID Assistant</h3>
                      <p className="text-muted-foreground mb-6">
                        Ask me about designs, budgets, contractors, or how to use SIID
                      </p>

                      {/* Quick Questions */}
                      <div className="max-w-2xl mx-auto">
                        <div className="flex items-center gap-2 justify-center mb-3">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium">Popular Questions</span>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {suggestedQuestions.slice(0, 6).map((q) => (
                            <Button
                              key={q}
                              variant="outline"
                              size="sm"
                              className="text-xs bg-transparent"
                              onClick={() => submit(q)}
                            >
                              {q.length > 40 ? q.slice(0, 40) + "..." : q}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
                        {m.role === "assistant" && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-4 whitespace-pre-wrap",
                            m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          {m.content}
                        </div>
                        {m.role === "user" && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length > 0 && messages.length < 6 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {suggestedQuestions.slice(0, 4).map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-transparent"
                        onClick={() => submit(q)}
                        disabled={isLoading}
                      >
                        {q.length > 35 ? q.slice(0, 35) + "..." : q}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    submit()
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about designs, budgets, construction..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
