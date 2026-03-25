// 5️⃣ Module 3 & 4 — Material & Cost ML Engine
export function calculateMaterialsLinearRegression(builtUpAreaSqFt: number) {
  // Using user provided Linear Regression formulas
  const cementBags = Math.round(0.40 * builtUpAreaSqFt + 5)
  const steelKg = Math.round(4.5 * builtUpAreaSqFt + 20)
  
  // Imputed secondary items (based on std civil ratios)
  const bricks = Math.round(8 * builtUpAreaSqFt)
  const sandCFT = Math.round(1.2 * builtUpAreaSqFt)
  const aggregateCFT = Math.round(1.5 * builtUpAreaSqFt)

  return {
    cement: cementBags,
    steel: steelKg,
    bricks: bricks,
    sand: sandCFT,
    aggregate: aggregateCFT,
  }
}

export function estimateCost(materials: ReturnType<typeof calculateMaterialsLinearRegression>, constructionGrade: string = "Standard") {
  // Mock prices
  const rates = {
    cement: 400, // per bag
    steel: 70, // per kg
    bricks: 8, // per piece
    sand: 60, // per cft
    aggregate: 50, // per cft
  }

  const multiplier = constructionGrade === "Premium" ? 1.3 : constructionGrade === "Luxury" ? 1.6 : 1.0

  return {
    cementCost: materials.cement * rates.cement * multiplier,
    steelCost: materials.steel * rates.steel * multiplier,
    bricksCost: materials.bricks * rates.bricks * multiplier,
    sandCost: materials.sand * rates.sand * multiplier,
    aggregateCost: materials.aggregate * rates.aggregate * multiplier,
    totalBaseCost: (
      materials.cement * rates.cement +
      materials.steel * rates.steel +
      materials.bricks * rates.bricks +
      materials.sand * rates.sand +
      materials.aggregate * rates.aggregate
    ) * multiplier
  }
}

// 7️⃣ Module 5 & 6 — Design Selection & Layout ML
export function predictOptimalLayout(projectData: any) {
  // Mock CNN/Vision classification logic
  // Returns probability scores for different layout styles
  const plotArea = Number(projectData.plot_area) || 0
  const floors = Number(projectData.floors) || 1
  
  if (plotArea < 1000) return "Compact Studio Layout"
  if (plotArea > 3000 && floors > 1) return "Luxury Duplex Villa"
  if (floors > 3) return "Multi-Story Apartment Logic"
  return "Modern Suburban Residence"
}

// 11️⃣ Industry Level Features (20+) - Forecasting Engines
export function predictProjectRisks(projectData: any, location: string) {
  const risks = []
  
  // Logic based on location/terrain (Mock)
  if (location.toLowerCase().includes("coastal")) {
    risks.push({ category: "External", factor: "High Humidity / Corrosion Risk", impact: "High" })
  }
  
  if (Number(projectData.floors) > 4) {
    risks.push({ category: "Structural", factor: "Foundation Stability / Soil Pressure", impact: "Medium" })
  }

  // Cost forecasting (Randomized but based on inflation mock)
  const inflationRisk = 3.5 + Math.random() * 2
  
  return {
    risks,
    inflationForecast: `${inflationRisk.toFixed(1)}% annually`,
    delayRisk: Math.random() > 0.7 ? "Moderate" : "Low",
    weatherImpact: "Clear Sky / Suitable for Slab Casting"
  }
}

export function forecastMaterialPrices() {
  return {
    cementTrend: "Increasing (Supply Chain Pressure)",
    steelTrend: "Stable (Global Market Correction)",
    laborAvailability: "Adequate"
  }
}
