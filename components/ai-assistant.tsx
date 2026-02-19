"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Message = { id: string; role: "user" | "assistant"; content: string }

export function AiAssistant({
  title = "SIID Assistant",
  placeholder = "Ask anything about your project, designs, or workflows...",
  className,
}: {
  title?: string
  placeholder?: string
  className?: string
}) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const formRef = React.useRef<HTMLFormElement>(null)
  const endRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, isLoading])

  async function submit() {
    const text = input.trim()
    if (!text || isLoading) return
    const user = { id: crypto.randomUUID(), role: "user" as const, content: text }
    setMessages((m) => [...m, user])
    setInput("")
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, user], sync: true }),
      })

      let data: any = null
      let answer = ""
      try {
        data = await res.json()
        if (typeof data?.text === "string") answer = data.text
      } catch (_) {
        // ignore parse errors
      }

      if (!res.ok || !answer.trim()) {
        let fallback = ""
        try {
          const sr = await fetch(`/api/search?query=${encodeURIComponent(text)}`)
          if (sr.ok) {
            const sj = await sr.json().catch(() => ({}) as any)
            const items = Array.isArray(sj?.results) ? sj.results.slice(0, 3) : []
            if (items.length) {
              fallback =
                "I couldn’t reach AI just now. Here are related results:\n\n" +
                items
                  .map((it: any, i: number) => `${i + 1}. ${it?.title || "Result"} — ${it?.snippet || ""}`)
                  .join("\n")
            }
          }
        } catch (_) {
          // ignore fallback errors
        }
        answer =
          fallback ||
          "I’m here and ready to help. I couldn’t reach the AI momentarily—please try again, or ask a shorter question."
      }

      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: answer }])
    } catch (_err: any) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I ran into a temporary issue. Please try again—your question will work without errors, and I’ll respond helpfully.",
        },
      ])
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  const quickPrompts = [
    "Summarize my project's key requirements.",
    "How do I generate North/South/East/West architectural layouts?",
    "Give steps to create floor-by-floor structural plans.",
    "Best practices for plumbing and electrical layout generation.",
  ]

  return (
    <Card className={cn("max-w-3xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="text-pretty">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!!error && <div className="text-sm text-destructive">{error}</div>}

        <div className="rounded-md border bg-card p-3 max-h-[50vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-muted-foreground text-sm">Start a conversation or tap a prompt below.</div>
          ) : null}
          {messages.map((m) => (
            <div key={m.id} className="mb-3">
              <div className="text-xs text-muted-foreground mb-1">{m.role === "user" ? "You" : "SIID"}</div>
              <div
                className={cn(
                  "rounded-md p-3 text-sm whitespace-pre-wrap",
                  m.role === "user" ? "bg-muted" : "bg-secondary",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((q) => (
            <Button key={q} variant="secondary" size="sm" onClick={() => setInput(q)}>
              {q}
            </Button>
          ))}
        </div>

        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Thinking..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
