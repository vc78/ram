import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { filename, fileType, size } = await req.json()
    
    // Simulate ML NLP analysis processing time (3000ms)
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Pre-calculate deterministic values based on filename
    const hash = filename.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
    
    // Basic heuristics based on file type and name
    const isContract = filename.toLowerCase().includes("contract") || fileType === "contract"
    const isBlueprint = filename.toLowerCase().includes("plan") || fileType === "blueprint" || fileType === "design"

    let summary = `This document appears to be a standard ${fileType} document. `
    let risks = []
    let obligations = []
    let specs = []
    
    if (isContract) {
      summary += "It contains legal stipulations, financial obligations, and contractor terms."
      risks = [
        "Hidden clause detected: 5% late penalty fee compounding monthly.",
        "Material substitution clause allows contractor to use lower grade steel if supply chain is disrupted.",
        "Force Majeure clause is vaguely defined, potentially excusing extreme weather delays."
      ]
      obligations = [
        "Payment of 20% required within 15 days of Phase 1 completion.",
        "Client must secure necessary road permits before excavation begins.",
      ]
    } else if (isBlueprint) {
      summary += "It contains structural schematics, load bearing layouts, and dimension mappings."
      risks = [
        "Load bearing wall configuration on the east wing conflicts with standard MEP routing.",
        "Acoustic paneling specs missing from level 2 conference room layout."
      ]
      specs = [
        "Total structural footprint: 4500 sq ft.",
        "Primary material: Reinforced Concrete (Grade M25)",
        "Minimum ceiling height: 12ft"
      ]
    } else {
      summary += "Standard procedural or inspection document."
      risks = ["General compliance review recommended."]
      specs = ["No major structural specifications detected."]
    }

    const confidenceScore = 85 + (hash % 14) + 0.5

    return NextResponse.json({
      success: true,
      analysis: {
        summary: summary,
        confidenceScore: confidenceScore,
        risks: risks,
        financialObligations: obligations,
        extractedSpecs: specs,
        docClass: isContract ? "Smart Contract" : isBlueprint ? "Architectural Blueprint" : "General Document"
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to analyze document via NLP" }, { status: 500 })
  }
}
