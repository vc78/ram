import { NextResponse } from "next/server"
import { ML_MODEL_WEIGHTS } from "@/lib/ml-weights"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { area, floors, qualityLevel = "standard", foundationType = "shallow", city = "hyderabad", soilType = "red" } = body

    if (!area || !floors) {
      return NextResponse.json({ error: "Missing required fields area or floors" }, { status: 400 })
    }

    const { parameters, mappings } = ML_MODEL_WEIGHTS
    const totalArea = area * floors

    // 1. Get Multipliers from Trained Mappings
    const qM = mappings.quality[qualityLevel as keyof typeof mappings.quality] || 1.0
    const sM = mappings.soil[soilType as keyof typeof mappings.soil] || 1.0
    const cM = mappings.city[city.toLowerCase() as keyof typeof mappings.city] || 1.15 // Default for generic region

    // 2. Foundation Complexity adjustment (Heuristic)
    let fM = 1.0
    if (foundationType === "deep") fM = 1.25
    else if (foundationType === "pile") fM = 1.45

    // 3. Algorithm Execution (Trained Linear/Weighted Model)
    const cement = totalArea * (parameters.cement.base_rate + (floors > 2 ? parameters.cement.floors_impact : 0)) * qM * sM
    
    const steelRate = floors >= parameters.steel.floor_threshold 
      ? parameters.steel.high_rise_rate 
      : parameters.steel.base_rate
    const steel = totalArea * steelRate * qM * sM

    const bricks = totalArea * parameters.bricks.base_rate * qM

    const sand = totalArea * 1.8 * qM // Standard constant if not trained yet
    const aggregate = totalArea * 1.35 * qM

    const totalCost = totalArea * parameters.cost.base_per_sqft * qM * sM * cM * fM

    return NextResponse.json({
      cement: Math.ceil(cement),
      steel: Math.ceil(steel),
      bricks: Math.ceil(bricks),
      sand: Math.ceil(sand),
      aggregate: Math.ceil(aggregate),
      total_cost: Math.ceil(totalCost),
      ml_metadata: {
        algorithm: "Weighted Linear Regression v1.2",
        r_squared: ML_MODEL_WEIGHTS.metrics.r2_score,
        confidence: ML_MODEL_WEIGHTS.metrics.confidence,
        last_trained: ML_MODEL_WEIGHTS.last_trained,
        factors: { quality: qM, soil: sM, city: cM, foundation: fM }
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Material algorithmic prediction failed" }, { status: 500 })
  }
}
