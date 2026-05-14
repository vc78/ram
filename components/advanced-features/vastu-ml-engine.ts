import { runVastuRules, computeVastuScore, VastuDirection, RuleResult } from "@/lib/vastu-rules"

export type Direction = "North" | "Northeast" | "East" | "Southeast" | "South" | "Southwest" | "West" | "Northwest"

export interface VastuModelResult {
    status: "compliant" | "warning" | "non-compliant"
    confidence: number
}

const DIRECTION_MAP: Record<string, VastuDirection> = {
    "North": "N",
    "Northeast": "NE",
    "East": "E",
    "Southeast": "SE",
    "South": "S",
    "Southwest": "SW",
    "West": "W",
    "Northwest": "NW"
}

const ELEMENT_MAP: Record<string, string> = {
    "Main Entrance": "main_door",
    "Kitchen": "kitchen",
    "Chef Kitchen": "kitchen",
    "Kitchen/Dining": "kitchen",
    "Master Bedroom": "master_bedroom",
    "Master Bed/SW": "master_bedroom",
    "Owner Suite": "master_bedroom",
    "Pooja Room": "pooja",
    "Pooja/Northeast": "pooja",
    "Meditation Pad": "pooja",
    "Bathroom/Toilet": "toilet",
    "Common Bath": "bathroom",
    "Living Room": "living",
    "Main Lounge": "living",
    "Grand Atrium": "living",
    "Dining Area": "dining",
    "Staircase": "staircase",
    "Guest Room": "bedroom",
    "Guest Suite": "bedroom",
    "Study Room": "study",
    "Office/Library": "study",
    "Store Room": "store",
    "Brahmasthan": "brahmasthan",
}

/**
 * Supervised Learning Simulation Bridge - Uses the new rule engine to predict compliance
 */
export function predictVastuCompliance(element: string, currentDirection: string): VastuModelResult {
    const dir = DIRECTION_MAP[currentDirection] || "N"
    const engineKey = ELEMENT_MAP[element] || element.toLowerCase().replace(/\s+/g, '_')

    const layout: Record<string, string> = { [engineKey]: dir }
    const results = runVastuRules(layout)
    const rule = results.find(r => r.rule.includes(engineKey))

    if (!rule) {
        return { status: "warning", confidence: 0.5 }
    }

    let status: "compliant" | "warning" | "non-compliant" = "compliant"
    if (rule.severity === "critical") status = "non-compliant"
    else if (rule.severity === "moderate" || rule.severity === "minor") status = "warning"

    return {
        status,
        confidence: rule.score
    }
}

/**
 * Predicts the overall Vastu layout score using the new scoring logic
 */
export function predictOverallScore(results: Array<{ status: string; confidence: number }>): number {
    if (results.length === 0) return 0

    // For the sake of this bridge, we assume the average confidence is the score
    let totalScore = 0
    results.forEach(res => {
        totalScore += res.confidence * 100
    })

    const normalizedScore = Math.round(totalScore / results.length)
    return Math.min(Math.max(normalizedScore, 0), 100)
}
