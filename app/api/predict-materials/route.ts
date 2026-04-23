import { NextResponse } from "next/server"
import { ML_MODEL_WEIGHTS } from "@/lib/ml-weights"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      area, 
      floors, 
      qualityLevel = "standard", 
      foundationType = "shallow", 
      city = "hyderabad", 
      soilType = "red",
      brickType = "red_brick",
      cementType = "opc_43",
      numRooms = 3
    } = body

    if (!area || !floors) {
      return NextResponse.json({ error: "Missing required fields area or floors" }, { status: 400 })
    }

    const { parameters, mappings } = ML_MODEL_WEIGHTS
    const totalArea = area * floors

    // 1. Get Multipliers from Trained Mappings
    const qM = mappings.quality[qualityLevel as keyof typeof mappings.quality] || 1.0
    const sM = mappings.soil[soilType as keyof typeof mappings.soil] || 1.0
    const cM = mappings.city[city.toLowerCase() as keyof typeof mappings.city] || 1.15
    const bM = mappings.brick_type[brickType as keyof typeof mappings.brick_type] || 1.0
    // @ts-ignore - Ignore type error if cement_type mapping is not immediately picked up by TS
    const cTypeM = mappings.cement_type?.[cementType as keyof typeof mappings.cement_type] || 1.0

    // 2. Foundation Complexity adjustment
    let fM = 1.0
    if (foundationType === "deep") fM = 1.25
    else if (foundationType === "pile") fM = 1.45

    // 3. Room impact adjustment (Partition walls)
    // Assume baseline of 3 rooms for 1000 sqft. 
    // Every extra room adds to the internal wall area.
    const baselineRooms = Math.ceil(area / 350)
    const roomFactor = 1 + (Math.max(0, numRooms - baselineRooms) * parameters.cement.room_impact)

    // 4. Algorithm Execution
    const cement = totalArea * (parameters.cement.base_rate + (floors > 2 ? parameters.cement.floors_impact : 0)) * qM * sM * roomFactor * cTypeM
    
    const steelRate = floors >= parameters.steel.floor_threshold 
      ? parameters.steel.high_rise_rate 
      : parameters.steel.base_rate
    const steel = totalArea * steelRate * qM * sM

    const bricks = totalArea * parameters.bricks.base_rate * qM * bM * roomFactor

    const sand = totalArea * 1.8 * qM * roomFactor
    const aggregate = totalArea * 1.35 * qM

    const totalCost = totalArea * parameters.cost.base_per_sqft * qM * sM * cM * fM * roomFactor

    return NextResponse.json({
      cement: Math.ceil(cement),
      steel: Math.ceil(steel),
      bricks: Math.ceil(bricks),
      sand: Math.ceil(sand),
      aggregate: Math.ceil(aggregate),
      total_cost: Math.ceil(totalCost),
      ml_metadata: {
        algorithm: "Weighted Linear Regression v1.3",
        r_squared: ML_MODEL_WEIGHTS.metrics.r2_score,
        confidence: ML_MODEL_WEIGHTS.metrics.confidence,
        last_trained: ML_MODEL_WEIGHTS.last_trained,
        factors: { quality: qM, soil: sM, city: cM, foundation: fM, brick: bM, rooms: roomFactor, cement_type: cTypeM }
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Material algorithmic prediction failed" }, { status: 500 })
  }
}
