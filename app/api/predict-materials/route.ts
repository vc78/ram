import { NextResponse } from "next/server"
import { ML_MODEL_WEIGHTS } from "@/lib/ml-weights"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const plotArea = body.plotArea || body.area
    const floors = body.floors
    const tier = body.tier || body.qualityLevel || "standard"
    const foundation = body.foundation || "shallow"
    const city = body.city || "Hyderabad"
    const soil = body.soil || body.soilType || "red"
    const brickType = body.brickType || "red"
    const cementGrade = body.cementGrade || "OPC43"
    const numRooms = body.numRooms || 3
    const floorHeight = body.floorHeight || 10

    if (!plotArea || !floors) {
      console.error("Material Prediction Error: Missing parameters", { plotArea, floors, body })
      return NextResponse.json({ 
        error: "Missing required parameters: plotArea (or area) and floors are required.",
        received: { plotArea, floors, keys: Object.keys(body) }
      }, { status: 400 })
    }

    if (isNaN(Number(plotArea)) || isNaN(Number(floors))) {
       return NextResponse.json({ 
        error: "Invalid input: plotArea and floors must be numbers",
        received: { plotArea, floors }
      }, { status: 400 })
    }

    const { ratios, city_index, tier_rates, mappings, unit_prices } = ML_MODEL_WEIGHTS
    
    // 1. Core Dimensions
    const coverage = ratios.coverage
    const builtupArea = plotArea * coverage * floors
    
    // 2. Material Quantities (CPWD/BIS Methodology)
    const concVolM3 = builtupArea * ratios.concrete_vol_m3_per_sqft
    
    const cementMult = mappings.cement_grade[cementGrade as keyof typeof mappings.cement_grade] || 1.0
    const cementBags = concVolM3 * ratios.cement_bags_per_m3 * cementMult
    
    const steelKg = builtupArea * ratios.steel_kg_per_sqft
    
    const brickMult = mappings.brick_type[brickType as keyof typeof mappings.brick_type] || 1.0
    // Wall area is typically 2.2x builtup area for a standard 10ft height and 3 rooms
    // We adjust by numRooms (baseline 3)
    const roomImpact = 1 + ((numRooms - 3) * 0.08) // 8% increase/decrease per room from baseline
    const wallArea = (builtupArea * ratios.wall_area_factor) * (floorHeight / 10) * brickMult * roomImpact
    const bricksCount = wallArea * ratios.bricks_per_sqft_wall
    
    // Sand and aggregate are now calculated per built-up area as per CPWD thumb rules
    const sandCft = builtupArea * ratios.sand_per_sqft_builtup
    const aggCft = builtupArea * ratios.aggregate_per_sqft_builtup
    const waterLiters = cementBags * ratios.water_per_bag_cement

    // 3. Cost Calculation (Hyderabad Baseline Adjusted by City/Soil/Foundation)
    const cityIdx = city_index[city as keyof typeof city_index] || 1.0
    const foundMult = mappings.foundation[foundation as keyof typeof mappings.foundation] || 1.0
    const soilMult = mappings.soil[soil as keyof typeof mappings.soil] || 1.0
    
    const baseRate = tier_rates[tier as keyof typeof tier_rates] || 1850
    const totalCost = builtupArea * baseRate * cityIdx * foundMult * soilMult

    // 4. Detailed Material Costs
    const cp = unit_prices.cement_bag[tier as keyof typeof unit_prices.cement_bag] * cityIdx
    const sp = unit_prices.steel_kg[tier as keyof typeof unit_prices.steel_kg] * cityIdx
    const bp = unit_prices.brick[tier as keyof typeof unit_prices.brick] * cityIdx
    const sdp = unit_prices.sand_cft[tier as keyof typeof unit_prices.sand_cft] * cityIdx
    const ap = unit_prices.aggregate_cft[tier as keyof typeof unit_prices.aggregate_cft] * cityIdx

    return NextResponse.json({
      cement: Math.ceil(cementBags),
      steel: Math.ceil(steelKg),
      bricks: Math.ceil(bricksCount),
      sand: Math.ceil(sandCft),
      aggregate: Math.ceil(aggCft),
      water: Math.ceil(waterLiters),
      total_cost: Math.ceil(totalCost),
      builtup_area: Math.ceil(builtupArea),
      costs: {
        cement: Math.ceil(cementBags * cp),
        steel: Math.ceil(steelKg * sp),
        bricks: Math.ceil(bricksCount * bp),
        sand: Math.ceil(sandCft * sdp),
        aggregate: Math.ceil(aggCft * ap),
      },
      ml_metadata: {
        algorithm: "CPWD-DSR-2024-Calibrated-Engine",
        confidence: ML_MODEL_WEIGHTS.metrics.confidence,
        last_trained: ML_MODEL_WEIGHTS.last_trained,
        factors: { cityIdx, foundMult, soilMult, brickMult, cementMult }
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Material estimation engine failed" }, { status: 500 })
  }
}
