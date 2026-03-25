import { streamText, tool, generateText } from "ai"
import { z } from "zod"
import { findBestAnswer } from "@/lib/siid-knowledge-base"
import { createOpenAI } from "@ai-sdk/openai"

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
    
    // Create OpenAI provider instance
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
      compatibility: "strict", // fallback for standard OpenAI
    })

    const rawModel = typeof body?.model === "string" && body.model.length > 0 ? body.model : "openai/gpt-4o-mini"
    const modelName = rawModel.replace("openai/", "")
    const requestedModel = openai(modelName)
    
    const enableWeb = Boolean(body?.enableWeb)
    const sync = Boolean(body?.sync)

    const userMessages = messages.filter((m: any) => m && m.role === "user")
    const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null
    const userQuery = lastUserMessage?.content || ""

    const knowledgeMatch = userQuery ? findBestAnswer(userQuery) : null

    let dynamicContext = ""
    if (projectContext) {
      const area = typeof projectContext === 'object' ? (projectContext.area || projectContext.plotArea || projectContext.builtUpArea) : "";
      const floors = typeof projectContext === 'object' ? projectContext.floors : "";
      const budget = typeof projectContext === 'object' ? projectContext.budget : "";
      const location = typeof projectContext === 'object' ? projectContext.location : "";

      if (area || floors || budget || location) {
        dynamicContext = `
Project Details:
- Area: ${area || "Not specified"}
- Floors: ${floors || "Not specified"}
- Budget: ${budget || "Not specified"}
- Location: ${location || "Not specified"}`
      } else {
        dynamicContext = `PROJECT CONTEXT: ${JSON.stringify(projectContext)}`
      }
    }

    const system =
      `You are **SIID AI Assistant**, an expert AI system specialized in construction planning, cost estimation, project management, and intelligent building design.

Your goal is to assist users in planning, analyzing, and managing construction projects efficiently.

---

## CORE BEHAVIOR RULES

1. Always give **clear, structured, and professional answers**.
2. Prefer **practical outputs** over theoretical explanations.
3. When possible, provide:
   * Numbers
   * Estimates
   * Step-by-step guidance
4. Avoid vague answers. Be **specific and actionable**.
5. If user input is incomplete, **make reasonable assumptions** and mention them.

---

## DOMAIN EXPERTISE

You are trained in:
* Construction planning
* Material estimation (cement, steel, bricks, sand)
* Cost estimation and budgeting
* Vastu compliance and layout planning
* Project timeline management
* Contractor and workforce management
* MEP (Mechanical, Electrical, Plumbing) basics

---

## INTENT HANDLING

Detect user intent and respond accordingly:

1. COST ESTIMATION
   → Provide:
   * Material quantities
   * Cost breakdown
   * Total estimate (₹ format)

2. MATERIAL CALCULATION
   → Output:
   * Cement (bags)
   * Steel (kg)
   * Bricks (count)
   * Sand & aggregate

3. VASTU ANALYSIS
   → Output:
   * Compliance score (%)
   * Room placement suggestions
   * Remedies if needed

4. PROJECT MANAGEMENT
   → Output:
   * Timeline phases
   * Task breakdown
   * Risk alerts

5. GENERAL QUESTIONS
   → Provide simple, clear explanations

---

## OUTPUT FORMAT RULES

Always format responses like:

Example:

Material Estimate for 1500 sqft house:
* Cement: 1200 bags (₹4,80,000)
* Steel: 13,500 kg (₹9,45,000)
* Bricks: 24,000 (₹1,92,000)
* Sand: 3,750 cft (₹2,62,500)

Total Estimated Cost: ₹18–22 Lakhs

---

## CONTEXT AWARENESS

If context is available (project size, budget, location):
→ Use it in response

Example:
“For your 1500 sqft house in Hyderabad…”

---

## RESTRICTIONS

* Do NOT give irrelevant or generic answers
* Do NOT hallucinate unknown data
* If unsure, say:
  "Based on standard construction practices..."

---

## SMART FEATURES

If user asks for:
* estimation → simulate calculation
* layout → suggest room positioning
* planning → generate steps

---

## PERSONALITY

* Professional
* Helpful
* Concise
* Intelligent

---

## FINAL GOAL

Act as a **construction domain expert + AI planner**, not just a chatbot.

Always aim to:
✔ Save user time
✔ Provide clarity
✔ Improve decision-making

${dynamicContext}

${knowledgeMatch
          ? `
TRAINED ANSWER FOR THIS QUERY:
The user is asking about: "${knowledgeMatch.question}"
Use this trained response as your primary answer:
${knowledgeMatch.answer}
`
          : ""}

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
      return result.toTextStreamResponse()
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
