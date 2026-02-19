import { streamText, tool, generateText } from "ai"
import { z } from "zod"
import { findBestAnswer } from "@/lib/siid-knowledge-base"

export async function POST(req: Request) {
  try {
    let body: any = {}
    try {
      body = await req.json()
    } catch (parseError) {
      console.log("[v0] Failed to parse request body, using defaults")
      body = {}
    }

    const rawMessages = body?.messages
    const messages = Array.isArray(rawMessages) ? rawMessages : []

    const projectContext = body?.projectContext
    const requestedModel = typeof body?.model === "string" && body.model.length > 0 ? body.model : "openai/gpt-5-mini"
    const enableWeb = Boolean(body?.enableWeb)
    const sync = Boolean(body?.sync)

    const userMessages = messages.filter((m: any) => m && m.role === "user")
    const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null
    const userQuery = lastUserMessage?.content || ""

    const knowledgeMatch = userQuery ? findBestAnswer(userQuery) : null

    const system =
      `You are SIID's expert AI assistant, trained specifically on the SIID platform - an AI-powered architectural and construction platform.

CORE KNOWLEDGE:
- SIID helps users design homes, offices, and buildings using AI
- We generate architectural, structural, electrical, plumbing, interior, and exterior designs
- Budget estimation in Indian Rupees (INR) with detailed breakdowns
- Contractor marketplace with verified professionals
- Project management and tracking tools

${knowledgeMatch
          ? `
TRAINED ANSWER FOR THIS QUERY:
The user is asking about: "${knowledgeMatch.question}"
Use this trained response as your primary answer:
${knowledgeMatch.answer}
`
          : ""
        }

RESPONSE GUIDELINES:
1. Be helpful, professional, and conversational
2. Use bullet points and formatting for clarity
3. Provide specific numbers and examples when discussing costs (always in ₹/INR)
4. If asked about features, explain how to access them in the platform
5. For construction queries, give practical, actionable advice
6. Always mention relevant SIID features that could help
7. If unsure, offer to connect the user with our support team

COST REFERENCE (2024 India):
- Moderate quality: ₹1,500/sqft
- Intermediate quality: ₹2,200/sqft  
- Premium quality: ₹3,000/sqft
- Cement: ₹380-420/bag
- Steel: ₹65,000-75,000/ton

${projectContext ? `PROJECT CONTEXT: ${JSON.stringify(projectContext)}` : ""}
${enableWeb ? "You may use the searchConstruction tool for current market data." : ""}`.trim()

    const searchConstruction = tool({
      description:
        "Search the web for construction-specific information (standards, codes, materials, pricing, processes).",
      inputSchema: z.object({
        query: z.string().min(3),
        limit: z.number().int().min(1).max(5).default(3),
      }),
      execute: async ({ query, limit }) => {
        const key = process.env.GOOGLE_API_KEY
        const cx = process.env.GOOGLE_CSE_ID
        if (!key || !cx) {
          return {
            ok: false,
            message: "Web search not configured.",
            results: [],
          }
        }
        const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(
          key,
        )}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent("construction " + query)}`
        const res = await fetch(url)
        if (!res.ok) {
          return { ok: false, message: `Search error: ${res.status}`, results: [] }
        }
        const data = await res.json().catch(() => ({}) as any)
        const items = Array.isArray(data?.items) ? data.items.slice(0, limit) : []
        return {
          ok: true,
          results: items.map((it: any) => ({
            title: it?.title,
            link: it?.link,
            snippet: it?.snippet,
          })),
        }
      },
    })

    // Friendly greeting when empty
    if (messages.length === 0) {
      return Response.json({
        text: `Hello! I'm SIID's AI Assistant, trained to help you with:

• **Design Generation** - Architectural, structural, MEP plans
• **Budget Estimation** - Costs in Indian Rupees
• **Construction Guidance** - Materials, timelines, processes
• **Contractor Finding** - Connect with verified professionals
• **Platform Help** - Navigate SIID features

What would you like to know?`,
      })
    }

    if (sync) {
      try {
        const { text } = await generateText({
          model: requestedModel,
          system,
          messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
          temperature: 0.6,
        })
        return Response.json({ text })
      } catch (err: any) {
        console.log("[v0] AI sync error:", err?.message || err)
        if (knowledgeMatch) {
          return Response.json({ text: knowledgeMatch.answer })
        }
        return Response.json({
          text: "I'm having trouble connecting right now. Please try again, or browse our Help section for common questions.",
        })
      }
    }

    try {
      const result = await streamText({
        model: requestedModel,
        system,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
        temperature: 0.6,
        tools: enableWeb ? { searchConstruction } : undefined,
      })
      return result.toAIStreamResponse()
    } catch (err: any) {
      console.log("[v0] AI stream error:", err?.message || err)
      if (knowledgeMatch) {
        return Response.json({ text: knowledgeMatch.answer })
      }
      return Response.json({
        text: "Streaming isn't available right now. Please resend your message.",
      })
    }
  } catch (outer: any) {
    console.log("[v0] Chat route fatal:", outer?.message || outer)
    return Response.json(
      {
        text: "I couldn't process that. Please try again—I'm here to help with designs, budgets, and construction.",
      },
      { status: 200 },
    )
  }
}
