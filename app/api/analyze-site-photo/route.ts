import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { filename } = await req.json()
    
    // Simulate ML analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Pre-calculate deterministic values based on filename string hash
    const hash = filename.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
    
    const progressLevel = Math.min(100, Math.max(10, (hash % 9) * 10 + 15))
    const hasSafetyRisk = hash % 3 === 0
    const riskCount = (hash % 2) + 1

    const phases = ["Foundation & Excavation", "Structural Framing", "MEP Initial Rough-in", "Exterior Masonry", "Interior Finishing", "Final Handover"]
    const phase = phases[hash % phases.length]

    const safetyDetections = hasSafetyRisk ? [
      { type: "ppe_missing_helmet", description: `Warning: ${riskCount} worker(s) detected without safety helmets in zone B.`, severity: "high" },
      { type: "edge_protection", description: "Incomplete edge protection along the eastern perimeter.", severity: "medium" }
    ] : []

    const tags = ["Auto-Analyzed", phase, hasSafetyRisk ? "Safety Flag" : "Compliant"]

    return NextResponse.json({
      success: true,
      analysis: {
        progress: progressLevel,
        phase: phase,
        confidenceScore: 92 + (hash % 7) + 0.5,
        safetyViolations: safetyDetections,
        autoTags: tags,
        description: `Visual analysis of ${filename} indicates ${progressLevel}% completion of the ${phase} stage. ${hasSafetyRisk ? 'OSHA violations detected.' : 'Site appears compliant with standard protocols.'}`
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to analyze photo" }, { status: 500 })
  }
}
