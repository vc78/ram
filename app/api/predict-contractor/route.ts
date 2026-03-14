import { NextResponse } from "next/server"

// Logistic Regression Sigmoid function
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z))
}

export async function POST(req: Request) {
  try {
    const { contractors } = await req.json()

    if (!contractors || !Array.isArray(contractors)) {
      return NextResponse.json({ error: "Invalid contractors array" }, { status: 400 })
    }

    // Market baseline heuristics for algorithmic comparison
    const MARKET_AVERAGE_RATE = 1000 // ₹ per day

    // Logistic Regression weights trained theoretically on historical contractor performance
    const WEIGHTS = {
      intercept: -2.5,
      rating: 1.2,          // High importance on rating
      logReviews: 0.4,      // Logarithmic trust in review volume
      logProjects: 0.5,     // Experience
      responseTime: -0.3,   // Faster is better (penalty per hour)
      verified: 0.8,        // Verification bonus
      rateDeviation: -1.5,  // Penalty for being too far from market average
    }

    const predictions = contractors.map((c: any) => {
      // 1. Feature Extraction
      const rating = c.rating || 0
      const reviews = Math.max(c.reviews || 0, 1) // Prevent log(0)
      const projects = Math.max(c.completedProjects || 0, 1)
      
      // Parse response time to numerical hours
      let responseHours = 24 // default
      if (c.responseTime) {
        const timeMatch = c.responseTime.match(/\d+/)
        if (timeMatch) {
          responseHours = parseInt(timeMatch[0], 10)
          if (c.responseTime.includes('day')) responseHours *= 24
        }
      }

      const verifiedStatus = c.verified ? 1 : 0
      
      // Parse rate
      let numericalRate = MARKET_AVERAGE_RATE
      if (c.hourlyRate) {
        const rateMatch = c.hourlyRate.replace(/,/g, '').match(/\d+/)
        if (rateMatch) numericalRate = parseInt(rateMatch[0], 10)
      }
      
      // Deviation from market average as a risk factor (too cheap = risk, too expensive = budget risk)
      const rateDeviation = Math.abs(numericalRate - MARKET_AVERAGE_RATE) / MARKET_AVERAGE_RATE

      // 2. Linear Combination (Z) calculation
      const z = WEIGHTS.intercept + 
                (WEIGHTS.rating * rating) + 
                (WEIGHTS.logReviews * Math.log10(reviews)) + 
                (WEIGHTS.logProjects * Math.log10(projects)) + 
                (WEIGHTS.responseTime * responseHours) + 
                (WEIGHTS.verified * verifiedStatus) + 
                (WEIGHTS.rateDeviation * rateDeviation)

      // 3. Logistic Regression Probability Output
      const reliabilityProbability = sigmoid(z)
      
      // 4. Transform to UI Metrics
      const reliabilityScore = Math.max(10, Math.min(99, Math.round(reliabilityProbability * 100)))
      
      let riskLevel = "Medium"
      if (reliabilityScore >= 85) riskLevel = "Low"
      else if (reliabilityScore < 60) riskLevel = "High"

      // Variance prediction (Delay)
      const delayDays = Math.round((1 - reliabilityProbability) * 14) // Max 14 days delay predicted
      const predictedDelay = delayDays <= 1 ? "None" : `+ ${delayDays} days`

      // Budget probability linear mapping
      const budgetProbRaw = (rating / 5) * 0.6 + (reliabilityProbability * 0.4)
      const onBudgetProbability = Math.round(budgetProbRaw * 100)

      return {
        id: c.id,
        mlMetrics: {
          reliabilityScore,
          riskLevel,
          predictedDelay,
          onBudgetProbability
        }
      }
    })

    return NextResponse.json({ success: true, predictions })

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "ML prediction failed" }, { status: 500 })
  }
}
