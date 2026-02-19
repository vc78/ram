import { type NextRequest, NextResponse } from "next/server"
import { siidKnowledgeBase, searchKnowledgeBase, getCategories, type QAPair } from "@/lib/siid-knowledge-base"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action") || "search"

  try {
    switch (action) {
      case "search": {
        const query = searchParams.get("query") || ""
        const category = searchParams.get("category") || undefined
        const difficulty = (searchParams.get("difficulty") as QAPair["difficulty"]) || undefined
        const tags = searchParams.get("tags")?.split(",").filter(Boolean) || undefined

        const results = searchKnowledgeBase(query, { category, difficulty, tags })

        return NextResponse.json({
          success: true,
          data: {
            results,
            total: results.length,
            query,
          },
        })
      }

      case "categories": {
        const categories = getCategories()
        return NextResponse.json({
          success: true,
          data: { categories },
        })
      }

      case "stats": {
        const stats = {
          totalQuestions: siidKnowledgeBase.length,
          categories: getCategories().length,
          byDifficulty: {
            beginner: siidKnowledgeBase.filter((q) => q.difficulty === "beginner").length,
            intermediate: siidKnowledgeBase.filter((q) => q.difficulty === "intermediate").length,
            advanced: siidKnowledgeBase.filter((q) => q.difficulty === "advanced").length,
            expert: siidKnowledgeBase.filter((q) => q.difficulty === "expert").length,
          },
          byCategory: getCategories().reduce(
            (acc, cat) => {
              acc[cat] = siidKnowledgeBase.filter((q) => q.category === cat).length
              return acc
            },
            {} as Record<string, number>,
          ),
        }

        return NextResponse.json({
          success: true,
          data: stats,
        })
      }

      case "all": {
        return NextResponse.json({
          success: true,
          data: {
            questions: siidKnowledgeBase,
            total: siidKnowledgeBase.length,
          },
        })
      }

      default: {
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
      }
    }
  } catch (error) {
    console.error("[AI Training API Error]", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "train": {
        // Endpoint for fine-tuning with new Q&A pairs
        // In production, this would trigger ML pipeline
        const { questions } = data as { questions: QAPair[] }

        // Validate questions
        if (!Array.isArray(questions) || questions.length === 0) {
          return NextResponse.json({ success: false, error: "Invalid training data" }, { status: 400 })
        }

        // Here you would:
        // 1. Store new questions in database
        // 2. Trigger retraining pipeline
        // 3. Update embeddings for semantic search

        return NextResponse.json({
          success: true,
          data: {
            message: "Training data received",
            questionsProcessed: questions.length,
            status: "queued",
          },
        })
      }

      case "feedback": {
        // Collect feedback on AI responses for improvement
        const { questionId, helpful, comment } = data

        // Store feedback for later analysis
        console.log("[v0] Feedback received:", { questionId, helpful, comment })

        return NextResponse.json({
          success: true,
          data: { message: "Feedback recorded" },
        })
      }

      default: {
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
      }
    }
  } catch (error) {
    console.error("[AI Training POST Error]", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
