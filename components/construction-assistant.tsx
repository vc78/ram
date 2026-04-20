"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Send,
    X,
    Sparkles,
    Home,
    IndianRupee,
    Building2,
    LayoutPanelLeft,
    HardHat,
    Zap,
    Copy,
    Check,
    MessageCircle,
} from "lucide-react"

type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    metadata?: {
        category?: string
        confidence?: number
    }
}

const SYSTEM_PROMPT = `You are BuildAssist AI, an intelligent construction planning assistant for the SIID FLASH platform.

YOUR ROLE:
You help users plan, design, and estimate construction projects such as houses, apartments, commercial buildings, and interiors with expertise and professionalism.

YOUR CAPABILITIES:
- Ask detailed questions to understand user requirements completely
- Suggest building layouts and room arrangements based on dimensions
- Recommend materials aligned with budget and location
- Provide accurate cost estimation (low, medium, high budget options)
- Suggest realistic construction steps and project timelines
- Help with structural planning basics
- Guide users step-by-step like a professional consultant

YOUR RULES:
- ALWAYS ask clarifying questions before providing final suggestions
- ALWAYS provide structured, professional responses
- Use tables for cost/material comparisons when relevant
- Be simple, clear, and professional in all communications
- When given dimensions (plot size, room sizes), generate layout suggestions
- When given budget, optimize materials and design accordingly
- If user seems confused, guide them step-by-step through the process
- Include Indian construction standards where applicable
- Provide Indian pricing in Rupees (₹) when estimating costs
- Suggest materials commonly available in India

YOUR RESPONSE FORMAT (Always follow this):
1. Understanding Requirements (What you understood from user's input)
2. Tailored Suggestions (Specific recommendations based on their needs)
3. Estimated Cost Range (Low/Medium/High budget options)
4. Recommended Materials (List with specifications)
5. Next Steps (What to do next)
6. Follow-up Question (To better understand their needs)

INTERACTION STYLE:
- Be conversational yet professional
- Use emojis sparingly but appropriately
- Show enthusiasm for their project
- Ask one clear follow-up question per response
- Remember previous context in the conversation

ALWAYS respond in well-formatted, readable markdown.`

// SIID Logo SVG Component - Professional Design
function SIIDLogo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 200"
            className={cn(className, "drop-shadow-md")}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer circle */}
            <circle cx="100" cy="100" r="95" stroke="#4a9b7e" strokeWidth="2" />
            {/* Building outline */}
            <g transform="translate(70, 50)">
                <rect x="0" y="10" width="60" height="50" fill="none" stroke="#2d5a6d" strokeWidth="1.5" />
                {/* Windows */}
                <rect x="8" y="15" width="10" height="8" fill="#2d5a6d" />
                <rect x="22" y="15" width="10" height="8" fill="#2d5a6d" />
                <rect x="36" y="15" width="10" height="8" fill="#2d5a6d" />
                <rect x="8" y="30" width="10" height="8" fill="#2d5a6d" />
                <rect x="22" y="30" width="10" height="8" fill="#2d5a6d" />
                <rect x="36" y="30" width="10" height="8" fill="#2d5a6d" />
                {/* Roof */}
                <path d="M 0 10 L 30 0 L 60 10" fill="none" stroke="#2d5a6d" strokeWidth="1.5" />
            </g>
            {/* Ellipse orbit */}
            <ellipse cx="100" cy="100" rx="55" ry="25" fill="none" stroke="#4a9b7e" strokeWidth="2" />
            {/* Banner text */}
            <rect x="50" y="130" width="100" height="20" fill="#4a9b7e" rx="3" />
            <text x="100" y="143" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                SINCE 2025
            </text>
        </svg>
    )
}

// Training Q&A Database
type QAItem = {
    id: number
    category: string
    question: string
    answer: string
}

const TRAINING_QA_DATABASE: QAItem[] = [
    // Foundation
    { id: 1, category: "Foundation", question: "What is a foundation?", answer: "A foundation is the lowest load-bearing part of a building that transfers the weight of the structure to the ground." },
    { id: 2, category: "Foundation", question: "What are the types of foundations?", answer: "Main types include: Shallow foundations (spread footing, pad footing, strip footing), Deep foundations (pile, caisson, drilled shaft)." },
    { id: 3, category: "Foundation", question: "What is soil bearing capacity?", answer: "The maximum load per unit area that the soil can support without failure or excessive settlement. Typically measured in kPa or tons/m²." },
    { id: 4, category: "Foundation", question: "What is a raft foundation?", answer: "A raft (or mat) foundation is a continuous reinforced concrete slab supporting an entire building structure." },
    { id: 5, category: "Foundation", question: "When should we use pile foundation?", answer: "Use pile foundations when soil bearing capacity is low, for tall structures, or when building over water/unstable ground." },
    // Structural Design
    { id: 21, category: "Structural Design", question: "What is load bearing masonry?", answer: "Masonry walls that support the weight of the structure above, made from brick, stone, or concrete blocks." },
    { id: 22, category: "Structural Design", question: "What are typical concrete grades?", answer: "M20, M25, M30, M35, M40, M50 where M denotes Mix and number is compressive strength in MPa." },
    { id: 23, category: "Structural Design", question: "What is reinforcement ratio?", answer: "The percentage of reinforcement steel provided relative to the cross-sectional area of concrete." },
    { id: 24, category: "Structural Design", question: "What is modulus of elasticity?", answer: "E value: for concrete ~30,000 MPa, for steel ~200,000 MPa; measures resistance to elastic deformation." },
    // Materials
    { id: 41, category: "Materials", question: "What are the properties of cement?", answer: "Binding agent; main types are OPC (53/43 grade), PPC, white cement; sets in 30-600 minutes." },
    { id: 42, category: "Materials", question: "What is fineness of cement?", answer: "Measure of cement particle size; finer cement provides higher early strength but increases shrinkage risk." },
    { id: 48, category: "Materials", question: "What is water cement ratio?", answer: "Ratio of water to cement weight; lower ratio produces stronger concrete but reduces workability." },
    { id: 49, category: "Materials", question: "What is slump test?", answer: "Field test measuring concrete workability by measuring subsidence of concrete after lifting a cone." },
    // Masonry
    { id: 61, category: "Masonry", question: "What is brick masonry?", answer: "Construction using bricks bonded with mortar; common in walls, provides good thermal mass." },
    { id: 62, category: "Masonry", question: "What is mortar?", answer: "Binding agent made from cement, sand, lime; provides joint strength but allows movement." },
    // Roofing
    { id: 101, category: "Roofing", question: "What is roof pitch?", answer: "Slope of roof measured as ratio (e.g., 4:12) or degrees; affects drainage and aesthetic." },
    { id: 102, category: "Roofing", question: "What is flat roof?", answer: "Roof with minimal slope (typically 5-10°); practical but requires careful waterproofing." },
    // Plumbing
    { id: 116, category: "Plumbing", question: "What is water supply system?", answer: "Network delivering clean water to building; includes tanks, pipes, and pressure regulation." },
    { id: 124, category: "Plumbing", question: "What is rainwater harvesting?", answer: "Collecting rooftop runoff for reuse; reduces water consumption and flooding." },
    // Cost Estimation
    { id: 176, category: "Cost Estimation", question: "What is built-up area (BUA)?", answer: "Total floor area within building boundaries; used for cost estimation per square meter." },
    { id: 180, category: "Cost Estimation", question: "What is labor cost?", answer: "Wages for workers; typically 20-30% of total project cost." },
]

// Quick suggestions for initial state
const QUICK_SUGGESTIONS = [
    { label: "2BHK House", emoji: "🏠", prompt: "Help me design a 2BHK house" },
    { label: "Budget Estimate", emoji: "💰", prompt: "What's the cost for a 2000 sqft house?" },
    { label: "Commercial Space", emoji: "🏢", prompt: "Plan a commercial office" },
    { label: "Interior Design", emoji: "🎨", prompt: "Help with interior layout" },
]

// PROFESSIONAL FLOATING WIDGET IMPLEMENTATION
export default function ConstructionAssistant() {
    // State management
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [visibleSuggestions, setVisibleSuggestions] = useState(true)
    const [relatedQA, setRelatedQA] = useState<QAItem[]>([])

    // Refs for auto-scroll and measurements
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    // Extract keywords from text for finding related Q&A
    const extractKeywords = (text: string): string[] => {
        const keywords = [
            "foundation", "concrete", "reinforcement", "steel", "brick", "masonry",
            "roof", "plumbing", "electrical", "cost", "budget", "water", "cement",
            "design", "layout", "materials", "structural", "bearing", "load",
            "interior", "exterior", "wall", "floor", "beam", "column", "safety",
            "estimate", "2bhk", "house", "building", "commercial"
        ]
        return keywords.filter(k => text.toLowerCase().includes(k))
    }

    // Find related Q&A based on keywords
    const findRelatedQA = (userText: string): QAItem[] => {
        const keywords = extractKeywords(userText)
        if (keywords.length === 0) {
            return TRAINING_QA_DATABASE.sort(() => 0.5 - Math.random()).slice(0, 3)
        }

        const related = TRAINING_QA_DATABASE.filter(qa => {
            const qaText = (qa.question + " " + qa.answer).toLowerCase()
            return keywords.some(k => qaText.includes(k))
        })

        return related.sort(() => 0.5 - Math.random()).slice(0, 3)
    }

    // Handle training Q&A suggestion click
    const handleTrainingQuestionClick = (qa: QAItem) => {
        const qaMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: `[📚 Learning: ${qa.question}]`,
        }
        setMessages((prev) => [...prev, qaMessage])

        const qaAnswer: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: qa.answer,
            metadata: { category: qa.category, confidence: 1 },
        }
        setMessages((prev) => [...prev, qaAnswer])
        setRelatedQA([])
    }

    // Auto-scroll to bottom on new messages
    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading, relatedQA])

    // Load conversation history from localStorage
    useEffect(() => {
        try {
            const cached = localStorage.getItem("siid-chat-history")
            if (cached) {
                const parsed = JSON.parse(cached) as Message[]
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed)
                    setVisibleSuggestions(false)
                }
            }
        } catch {
            // Silently handle storage errors
        }
    }, [])

    // Persist messages to localStorage
    useEffect(() => {
        localStorage.setItem("siid-chat-history", JSON.stringify(messages.slice(-20)))
    }, [messages])

    async function sendMessage(e?: React.FormEvent, quickMessage?: string) {
        e?.preventDefault()
        const text = (quickMessage || input).trim()
        if (!text || isLoading) return

        // Hide suggestions when first message is sent
        if (messages.length === 0) setVisibleSuggestions(false)

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        }

        setMessages((prev) => [...prev, userMsg])
        setInput("")
        setIsLoading(true)
        setError(null)
        setRelatedQA([])

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    systemPrompt: SYSTEM_PROMPT,
                    sync: true, // Force sync response for JSON parsing
                }),
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            // Check content type
            const contentType = response.headers.get("content-type")
            let data: any = {}

            if (contentType?.includes("application/json")) {
                try {
                    data = await response.json()
                } catch (parseErr) {
                    console.error("Failed to parse JSON response:", parseErr)
                    throw new Error("Invalid response format")
                }
            } else if (contentType?.includes("text/plain")) {
                const text = await response.text()
                data = { content: text }
            } else {
                // Fallback: try to read as text
                const text = await response.text()
                if (text) {
                    try {
                        data = JSON.parse(text)
                    } catch {
                        data = { content: text }
                    }
                }
            }

            const assistantMsg: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content:
                    data.text ||
                    data.content ||
                    data.message ||
                    "I understood your query. Please provide more details for better suggestions.",
                metadata: { category: "construction", confidence: 0.9 },
            }

            setMessages((prev) => [...prev, assistantMsg])
        } catch (err) {
            console.error("Chat error:", err)
            setError("Connection error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // After assistant msg is added, find related Q&A
    useEffect(() => {
        if (messages.length > 0) {
            const lastUserMsg = [...messages].reverse().find(m => m.role === "user")
            if (lastUserMsg) {
                const related = findRelatedQA(lastUserMsg.content)
                setRelatedQA(related)
            }
        }
    }, [messages.length])

    // Utility functions
    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text).catch(() => { })
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 1500)
    }

    const clearHistory = () => {
        setMessages([])
        setVisibleSuggestions(true)
        setRelatedQA([])
        localStorage.removeItem("siid-chat-history")
    }

    // Calculate responsive dimensions
    const boxWidth = useMemo(() => "max-w-sm w-96", [])
    const boxHeight = "h-[500px] sm:h-[550px]"

    return (
        <>
            {/* FLOATING BUTTON - Always visible */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-40 group"
                    aria-label="Open BuildAssist AI"
                >
                    {/* Pulse effect ring */}
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse group-hover:bg-primary/50 transition-colors" />

                    {/* Main button */}
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 flex items-center justify-center text-white group-hover:-translate-y-1">
                        {/* Logo */}
                        <SIIDLogo className="w-7 h-7" />
                    </div>

                    {/* Notification dot */}
                    {messages.length > 0 && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-orange-400 rounded-full border-2 border-white shadow-md animate-bounce" />
                    )}
                </button>
            )}

            {/* CHAT BOX - Opens when clicked */}
            {isOpen && (
                <div
                    className="fixed bottom-6 right-6 z-50"
                    ref={chatContainerRef}
                >
                    <Card className={cn("flex flex-col", boxWidth, boxHeight, "shadow-2xl border-2 border-primary/20 overflow-hidden bg-card/95 backdrop-blur-sm")}>
                        {/* Header - Professional styling */}
                        <div className="px-4 py-3.5 bg-gradient-to-r from-primary/90 to-emerald-600/90 flex items-center justify-between flex-shrink-0 shadow-sm">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <SIIDLogo className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">BuildAssist AI</h3>
                                    <p className="text-xs text-white/70">Construction Expert</p>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-background to-muted/5">
                            {messages.length === 0 && visibleSuggestions && (
                                <div className="space-y-3 pt-2">
                                    <div className="text-center mb-3">
                                        <p className="text-xs font-semibold text-muted-foreground">Quick Start</p>
                                    </div>
                                    {QUICK_SUGGESTIONS.map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => sendMessage(undefined, item.prompt)}
                                            className="w-full text-left p-2.5 rounded-lg border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/40 transition-all duration-150 text-xs group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{item.emoji}</span>
                                                <span className="font-medium text-foreground group-hover:text-primary">
                                                    {item.label}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Messages */}
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn("flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === "user" && "justify-end")}
                                >
                                    {msg.role === "assistant" && (
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <SIIDLogo className="w-4 h-4" />
                                        </div>
                                    )}

                                    <div
                                        className={cn(
                                            "max-w-xs rounded-lg px-3 py-2 text-sm break-words",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-none shadow-sm"
                                                : "bg-muted border border-border/60 rounded-bl-none",
                                        )}
                                    >
                                        <p className="leading-relaxed">{msg.content}</p>

                                        {msg.role === "assistant" && (
                                            <button
                                                onClick={() => copyToClipboard(msg.content, msg.id)}
                                                className="mt-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
                                            >
                                                {copiedId === msg.id ? (
                                                    <>
                                                        <Check className="w-3 h-3" />
                                                        Copied
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3" />
                                                        Copy
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Related Training Suggestions */}
                            {relatedQA.length > 0 && (
                                <div className="space-y-2 mt-3 pt-3 border-t border-border/30">
                                    <p className="text-xs font-semibold text-muted-foreground px-1">📚 Related Training</p>
                                    {relatedQA.map((qa) => (
                                        <button
                                            key={qa.id}
                                            onClick={() => handleTrainingQuestionClick(qa)}
                                            className="w-full text-left p-2 rounded-lg border border-amber-200/40 bg-amber-50/30 hover:bg-amber-100/40 transition-all duration-150 group text-xs"
                                        >
                                            <div className="flex items-start gap-2">
                                                <span className="text-sm">💡</span>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground group-hover:text-amber-900 line-clamp-2">
                                                        {qa.question}
                                                    </p>
                                                    <span className="text-xs text-amber-700/60">{qa.category}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Loading state */}
                            {isLoading && (
                                <div className="flex gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-emerald-600 flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-4 h-4 text-white animate-spin" />
                                    </div>
                                    <div className="flex gap-1 items-center pt-1">
                                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" />
                                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:100ms]" />
                                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:200ms]" />
                                    </div>
                                </div>
                            )}

                            {/* Error message */}
                            {error && (
                                <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-2">
                                    {error}
                                </div>
                            )}

                            <div ref={messagesEndRef} className="h-1" />
                        </div>

                        {/* Divider */}
                        {messages.length > 0 && (
                            <div className="h-px bg-border/40" />
                        )}

                        {/* Input Area - Minimal and clean */}
                        <div className="px-4 py-3 border-t border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0 space-y-2">
                            {/* Clear history button - only show when messages exist */}
                            {messages.length > 0 && (
                                <button
                                    onClick={clearHistory}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" />
                                    Clear ({messages.length})
                                </button>
                            )}

                            {/* Input field */}
                            <form onSubmit={sendMessage} className="flex gap-1.5">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me..."
                                    className="flex-1 text-sm h-8 bg-background/80 border-border/40"
                                    disabled={isLoading}
                                    autoFocus={isOpen}
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isLoading || !input.trim()}
                                    className="h-8 w-8 p-0 bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>

                            {/* Subtle footer text */}
                            <p className="text-xs text-muted-foreground/60">Powered by SIID FLASH</p>
                        </div>
                    </Card>
                </div>
            )}
        </>
    )
}
