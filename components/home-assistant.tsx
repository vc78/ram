"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { findBestAnswer, getFollowUpQuestions } from "@/lib/siid-knowledge-base"
import { Bot, Sparkles, Send, Star, MessageCircle } from "lucide-react"

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

const INITIAL_TOPIC_CARDS = [
  {
    id: "launch-project",
    title: "Launch New Project",
    description: "Get a step-by-step start for your next design or construction project.",
    prompt: "Help me start a new residential project with budget estimation and vendor selection.",
  },
  {
    id: "budget-estimate",
    title: "Estimate Budget",
    description: "Quickly calculate cost projections for materials and labor.",
    prompt: "Estimate the budget for a 1500 sqft 2-story house in Mumbai.",
  },
  {
    id: "find-contractors",
    title: "Find Contractors",
    description: "Learn how to discover and compare verified contractors.",
    prompt: "How to choose the best contractor for a structural design project?",
  },
  {
    id: "design-advice",
    title: "Design Guidance",
    description: "Get high-level design suggestions and feature ideas.",
    prompt: "Recommend modern architectural features for a 3BHK layout.",
  },
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
  const [highPerformance, setHighPerformance] = React.useState(false)
  const [feedbackByMessage, setFeedbackByMessage] = React.useState<Record<string, "up" | "down">>({})
  const [followUpQuestions, setFollowUpQuestions] = React.useState<string[]>([])
  const [activeWelcome, setActiveWelcome] = React.useState(true)

  const activeModel = customModel.trim() || model

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("siid-assistant-history")
      if (stored) {
        const parsed = JSON.parse(stored) as Message[]
        if (Array.isArray(parsed)) {
          setMessages(parsed)
        }
      }
    } catch {
      // ignore malformed storage state
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem("siid-assistant-history", JSON.stringify(messages.slice(-50)))
  }, [messages])

  async function sendMessage(e?: React.FormEvent, quickMessage?: string) {
    e?.preventDefault()
    const trimmed = quickMessage || input.trim()
    if (!trimmed || isLoading) return

    setActiveWelcome(false)

    if (highPerformance) {
      const cachedReply = messages.find((m) => m.role === "assistant" && m.content.toLowerCase().includes(trimmed.toLowerCase()))
      if (cachedReply) {
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: trimmed }, { id: crypto.randomUUID(), role: "assistant", content: cachedReply.content }])
        setFollowUpQuestions(getFollowUpQuestions(trimmed, 4))
        return
      }
    }

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
      } catch (_) { }

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
          } catch (_) { }
          text =
            fallback ||
            "I'm available and will reply. I couldn't reach the AI momentarily—please try again or disable Web for now."
        }
      }

      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: text }])
      setFollowUpQuestions(getFollowUpQuestions(trimmed, 4))
    } catch (_err: any) {
      const kbMatch = findBestAnswer(trimmed)
      const errorAnswer =
        kbMatch?.answer ||
        "I hit a temporary issue. Please try again—I'll respond with helpful guidance without showing any error codes."
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: errorAnswer,
        },
      ])
      setFollowUpQuestions(getFollowUpQuestions(trimmed, 4))
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
          className="rounded-2xl bg-gradient-to-r from-primary to-accent text-white px-5 py-3 shadow-[0_10px_30px_rgba(59,130,246,0.45)] hover:shadow-[0_12px_28px_rgba(59,130,246,0.55)] transition-all duration-200 flex items-center gap-2"
          aria-label="Open SIID Assistant"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-bold">SIID Smart Help</span>
          <span className="text-[10px] bg-white/30 px-2 py-0.5 rounded-full">Live</span>
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
            <div className="flex flex-wrap gap-2 mb-2 items-center">
              <select
                className="w-[45%] text-xs border rounded-md px-2 py-1 bg-background"
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

            <div className="mb-2 text-[11px] text-muted-foreground flex flex-wrap gap-2 items-center">
              <label className="inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={highPerformance}
                  onChange={(e) => setHighPerformance(e.target.checked)}
                />
                High-performance cache mode
              </label>
              <button
                onClick={() => {
                  localStorage.removeItem("siid-assistant-history")
                  setMessages([])
                  setFeedbackByMessage({})
                  setActiveWelcome(true)
                }}
                className="text-xs px-2 py-1 rounded-md border hover:bg-muted"
              >
                Clear history
              </button>
              <span>{messages.length} messages stored · {highPerformance ? "Cache accelerated" : "Standard mode"}</span>
            </div>

            <div
              className="h-56 overflow-auto rounded-md border p-2 bg-background space-y-2"
              role="log"
              aria-live="polite"
            >
              {messages.length === 0 && activeWelcome ? (
                <div className="space-y-3">
                  <div className="text-center py-2">
                    <Sparkles className="w-10 h-10 mx-auto text-primary/40 mb-2" />
                    <h3 className="text-sm font-semibold">Welcome to SIID Assistant</h3>
                    <p className="text-xs text-muted-foreground">Choose a task to get a guided, user-friendly answer.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {INITIAL_TOPIC_CARDS.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => sendMessage(undefined, card.prompt)}
                        className="text-left p-3 rounded-xl border border-secondary/20 bg-gradient-to-r from-white to-secondary/5 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-primary">{card.title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">{card.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={cn("mb-2")}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-md p-2 text-sm whitespace-pre-wrap",
                        m.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "mr-auto bg-muted text-foreground",
                      )}
                    >
                      {m.content}
                    </div>
                    {m.role === "assistant" ? (
                      <div className="ml-1 mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <button
                          onClick={() =>
                            setFeedbackByMessage((prev) => ({
                              ...prev,
                              [m.id]: prev[m.id] === "up" ? undefined : "up",
                            }))
                          }
                          className={cn(
                            "px-2 py-1 rounded-sm border",
                            feedbackByMessage[m.id] === "up" ? "border-emerald-500 bg-emerald-50" : "border-border",
                          )}
                        >
                          👍
                        </button>
                        <button
                          onClick={() =>
                            setFeedbackByMessage((prev) => ({
                              ...prev,
                              [m.id]: prev[m.id] === "down" ? undefined : "down",
                            }))
                          }
                          className={cn(
                            "px-2 py-1 rounded-sm border",
                            feedbackByMessage[m.id] === "down" ? "border-rose-500 bg-rose-50" : "border-border",
                          )}
                        >
                          👎
                        </button>
                        <span>{feedbackByMessage[m.id] === "up" ? "Thanks for the thumbs up!" : feedbackByMessage[m.id] === "down" ? "Got it, we’ll improve." : "Rate this response"}</span>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
              {followUpQuestions.length > 0 ? (
                <div className="mb-2 rounded-lg border border-primary/20 bg-primary/10 p-2">
                  <p className="text-xs text-primary font-semibold mb-1">Related follow-up questions</p>
                  <div className="flex flex-wrap gap-1">
                    {followUpQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(undefined, q)}
                        className="text-[11px] px-2 py-1 rounded-full border border-primary/40 bg-white/90 hover:bg-primary/10 text-primary transition"
                        aria-label={`Follow up question: ${q}`}
                      >
                        <Star className="inline-block w-3 h-3 mr-1" />{q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
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
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
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
