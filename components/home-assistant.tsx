"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { findBestAnswer, getSuggestedQuestions } from "@/lib/siid-knowledge-base"
import { Bot, Sparkles, Send } from "lucide-react"

const DEFAULT_MODEL = "openai/gpt-5-mini"

const MODEL_OPTIONS = [
  { value: "openai/gpt-5-mini", label: "OpenAI GPT-5 Mini" },
  { value: "openai/gpt-5", label: "OpenAI GPT-5" },
  { value: "google/gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { value: "google/gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  { value: "anthropic/claude-sonnet-4.5", label: "Claude Sonnet 4.5" },
  { value: "anthropic/claude-haiku", label: "Claude Haiku" },
  { value: "fireworks/llama-3.1-70b-instruct", label: "Llama 3.1 70B (FW)" },
  { value: "fireworks/llama-3.1-8b-instruct", label: "Llama 3.1 8B (FW)" },
  { value: "bedrock/anthropic.claude-3-sonnet-20240229-v1:0", label: "Bedrock Claude 3 Sonnet" },
  { value: "bedrock/amazon.nova-pro-v1:0", label: "Bedrock Nova Pro" },
]

type Message = { id: string; role: "user" | "assistant"; content: string }

export function HomeAssistant({
  projectContext,
  className,
}: {
  projectContext?: any
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [model, setModel] = React.useState<string>(DEFAULT_MODEL)
  const [customModel, setCustomModel] = React.useState<string>("")
  const [enableWeb, setEnableWeb] = React.useState<boolean>(false)

  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const activeModel = customModel.trim() || model

  const suggestedQuestions = getSuggestedQuestions().slice(0, 4)

  async function sendMessage(e?: React.FormEvent, quickMessage?: string) {
    e?.preventDefault()
    const trimmed = quickMessage || input.trim()
    if (!trimmed || isLoading) return
    const newUser: Message = { id: crypto.randomUUID(), role: "user", content: trimmed }
    setMessages((m) => [...m, newUser])
    setInput("")
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newUser],
          model: activeModel,
          enableWeb,
          projectContext,
          sync: true,
        }),
      })

      let data: any = null
      let text = ""
      try {
        data = await res.json()
        if (typeof data?.text === "string") text = data.text
      } catch (_) {}

      if (!res.ok || !text.trim()) {
        const kbMatch = findBestAnswer(trimmed)
        if (kbMatch) {
          text = kbMatch.answer
        } else {
          let fallback = ""
          try {
            const sr = await fetch(`/api/search?query=${encodeURIComponent(trimmed)}`)
            if (sr.ok) {
              const sj = await sr.json().catch(() => ({}) as any)
              const items = Array.isArray(sj?.results) ? sj.results.slice(0, 3) : []
              if (items.length) {
                fallback =
                  "I couldn't reach AI just now. Here are related results:\n\n" +
                  items
                    .map((it: any, i: number) => `${i + 1}. ${it?.title || "Result"} — ${it?.snippet || ""}`)
                    .join("\n")
              }
            }
          } catch (_) {}
          text =
            fallback ||
            "I'm available and will reply. I couldn't reach the AI momentarily—please try again or disable Web for now."
        }
      }

      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: text }])
    } catch (_err: any) {
      const kbMatch = findBestAnswer(trimmed)
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            kbMatch?.answer ||
            "I hit a temporary issue. Please try again—I'll respond with helpful guidance without showing any error codes.",
        },
      ])
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-primary text-primary-foreground px-5 py-3 shadow-lg hover:brightness-110 smooth-hover flex items-center gap-2"
          aria-label="Open SIID Assistant"
        >
          <Bot className="w-5 h-5" />
          Ask SIID
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Trained</span>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[420px] bg-card text-card-foreground rounded-xl shadow-2xl border p-0 overflow-hidden">
          <div className="px-3 py-3 border-b bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold">SIID Assistant</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Trained</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs flex items-center gap-1">
                <input type="checkbox" checked={enableWeb} onChange={(e) => setEnableWeb(e.target.checked)} />
                Web
              </label>
              <button
                onClick={() => setOpen(false)}
                className="text-xs px-2 py-1 rounded-md border hover:bg-muted smooth-hover"
                aria-label="Close assistant"
              >
                Close
              </button>
            </div>
          </div>

          <div className="p-3">
            <div className="flex gap-2 mb-2">
              <select
                className="w-1/2 text-xs border rounded-md px-2 py-1 bg-background"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                aria-label="Select model"
              >
                {MODEL_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <input
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="Custom model (optional)"
                className="w-1/2 text-xs border rounded-md px-2 py-1 bg-background"
                aria-label="Custom model string"
              />
            </div>

            <div
              className="h-56 overflow-auto rounded-md border p-2 bg-background space-y-2"
              role="log"
              aria-live="polite"
            >
              {messages.length === 0 ? (
                <div className="text-center py-4">
                  <Sparkles className="w-8 h-8 mx-auto text-primary/30 mb-2" />
                  <p className="text-xs text-muted-foreground mb-3">
                    Ask about construction, designs, budgets, or SIID features
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(undefined, q)}
                        className="text-xs px-2 py-1 rounded-md border hover:bg-muted transition-colors"
                      >
                        {q.length > 25 ? q.slice(0, 25) + "..." : q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[85%] rounded-md p-2 text-sm whitespace-pre-wrap",
                      m.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-muted text-foreground",
                    )}
                  >
                    {m.content}
                  </div>
                ))
              )}
              {isLoading ? (
                <div className="mr-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-pulse [animation-delay:120ms]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/70 animate-pulse [animation-delay:240ms]" />
                </div>
              ) : null}
            </div>

            <form onSubmit={sendMessage} className="mt-2 flex items-center gap-2" aria-label="Send a message to SIID">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 text-sm bg-background"
                placeholder="Ask about construction or your project…"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:brightness-110 smooth-hover flex items-center gap-1"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {error ? <div className="mt-2 text-xs text-destructive">{error}</div> : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomeAssistant
