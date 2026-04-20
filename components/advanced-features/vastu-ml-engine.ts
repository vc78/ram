export type Direction = "North" | "Northeast" | "East" | "Southeast" | "South" | "Southwest" | "West" | "Northwest"

export interface VastuModelResult {
    status: "compliant" | "warning" | "non-compliant"
    confidence: number
}

// In a real-world scenario, these weights would be learned from a dataset
// Here we are creating a heuristic-based neural network simulation
const directionWeights: Record<string, Record<Direction, number>> = {
    "Main Entrance": { North: 1.0, Northeast: 0.9, East: 1.0, Southeast: 0.2, South: 0.1, Southwest: 0.0, West: 0.4, Northwest: 0.5 },
    "Kitchen": { North: 0.1, Northeast: 0.0, East: 0.5, Southeast: 1.0, South: 0.6, Southwest: 0.1, West: 0.4, Northwest: 0.8 },
    "Chef Kitchen": { North: 0.1, Northeast: 0.0, East: 0.5, Southeast: 1.0, South: 0.6, Southwest: 0.1, West: 0.4, Northwest: 0.8 },
    "Kitchen/Dining": { North: 0.2, Northeast: 0.1, East: 0.7, Southeast: 0.9, South: 0.5, Southwest: 0.1, West: 0.6, Northwest: 0.7 },
    "Master Bedroom": { North: 0.3, Northeast: 0.1, East: 0.2, Southeast: 0.1, South: 0.8, Southwest: 1.0, West: 0.7, Northwest: 0.4 },
    "Master Bed/SW": { North: 0.1, Northeast: 0.0, East: 0.1, Southeast: 0.1, South: 0.9, Southwest: 1.0, West: 0.6, Northwest: 0.3 },
    "Owner Suite": { North: 0.2, Northeast: 0.1, East: 0.2, Southeast: 0.1, South: 0.9, Southwest: 1.0, West: 0.7, Northwest: 0.4 },
    "Pooja Room": { North: 0.8, Northeast: 1.0, East: 0.9, Southeast: 0.2, South: 0.1, Southwest: 0.0, West: 0.3, Northwest: 0.4 },
    "Pooja/Northeast": { North: 0.7, Northeast: 1.0, East: 0.8, Southeast: 0.1, South: 0.0, Southwest: 0.0, West: 0.2, Northwest: 0.3 },
    "Meditation Pad": { North: 0.9, Northeast: 1.0, East: 0.9, Southeast: 0.2, South: 0.1, Southwest: 0.0, West: 0.3, Northwest: 0.5 },
    "Bathroom/Toilet": { North: 0.2, Northeast: 0.0, East: 0.1, Southeast: 0.4, South: 0.6, Southwest: 0.1, West: 0.8, Northwest: 1.0 },
    "Common Bath": { North: 0.3, Northeast: 0.1, East: 0.2, Southeast: 0.5, South: 0.7, Southwest: 0.2, West: 0.9, Northwest: 1.0 },
    "Living Room": { North: 1.0, Northeast: 0.9, East: 1.0, Southeast: 0.5, South: 0.3, Southwest: 0.2, West: 0.6, Northwest: 0.7 },
    "Main Lounge": { North: 1.0, Northeast: 0.9, East: 0.9, Southeast: 0.4, South: 0.2, Southwest: 0.1, West: 0.5, Northwest: 0.8 },
    "Grand Atrium": { North: 1.0, Northeast: 1.0, East: 0.9, Southeast: 0.3, South: 0.2, Southwest: 0.1, West: 0.4, Northwest: 0.7 },
    "Dining Area": { North: 0.6, Northeast: 0.5, East: 0.8, Southeast: 0.4, South: 0.4, Southwest: 0.3, West: 1.0, Northwest: 0.7 },
    "Staircase": { North: 0.1, Northeast: 0.0, East: 0.2, Southeast: 0.6, South: 1.0, Southwest: 1.0, West: 0.8, Northwest: 0.5 },
    "Guest Room": { North: 0.4, Northeast: 0.5, East: 0.3, Southeast: 0.2, South: 0.1, Southwest: 0.1, West: 0.7, Northwest: 1.0 },
    "Guest Suite": { North: 0.5, Northeast: 0.6, East: 0.4, Southeast: 0.2, South: 0.1, Southwest: 0.1, West: 0.8, Northwest: 1.0 },
    "Study Room": { North: 0.8, Northeast: 0.9, East: 1.0, Southeast: 0.3, South: 0.2, Southwest: 0.1, West: 0.4, Northwest: 0.5 },
    "Office/Library": { North: 0.9, Northeast: 1.0, East: 0.9, Southeast: 0.2, South: 0.1, Southwest: 0.1, West: 0.5, Northwest: 0.6 },
    "Store Room": { North: 0.1, Northeast: 0.1, East: 0.2, Southeast: 0.4, South: 0.8, Southwest: 1.0, West: 0.6, Northwest: 0.3 },
    "Brahmasthan": { North: 0.5, Northeast: 0.5, East: 0.5, Southeast: 0.5, South: 0.5, Southwest: 0.5, West: 0.5, Northwest: 0.5 },
    "Courtyard": { North: 0.5, Northeast: 0.5, East: 0.5, Southeast: 0.5, South: 0.5, Southwest: 0.5, West: 0.5, Northwest: 0.5 },
    "Manager Cabin": { North: 0.2, Northeast: 0.1, East: 0.2, Southeast: 0.1, South: 0.9, Southwest: 1.0, West: 0.7, Northwest: 0.4 },
    "Accounts": { North: 1.0, Northeast: 0.8, East: 0.7, Southeast: 0.2, South: 0.1, Southwest: 0.0, West: 0.3, Northwest: 0.4 },
    "Workstations": { North: 0.9, Northeast: 1.0, East: 0.9, Southeast: 0.4, South: 0.3, Southwest: 0.1, West: 0.6, Northwest: 0.7 },
    "Reception": { North: 1.0, Northeast: 1.0, East: 0.9, Southeast: 0.4, South: 0.1, Southwest: 0.0, West: 0.5, Northwest: 0.7 },
    "Emergency": { North: 0.2, Northeast: 0.1, East: 0.3, Southeast: 0.4, South: 0.5, Southwest: 0.2, West: 0.8, Northwest: 1.0 },
    "OPD Ward": { North: 1.0, Northeast: 0.9, East: 0.8, Southeast: 0.4, South: 0.2, Southwest: 0.1, West: 0.6, Northwest: 0.7 },
    "Healing Garden": { North: 0.8, Northeast: 1.0, East: 0.9, Southeast: 0.2, South: 0.1, Southwest: 0.0, West: 0.3, Northwest: 0.4 },
    "Diagnostics": { North: 0.3, Northeast: 0.2, East: 0.4, Southeast: 0.5, South: 0.4, Southwest: 0.3, West: 1.0, Northwest: 0.8 },
    "Central Nursing": { North: 0.5, Northeast: 0.5, East: 0.5, Southeast: 0.5, South: 0.5, Southwest: 0.5, West: 0.5, Northwest: 0.5 },
    "Operation Theater": { North: 0.1, Northeast: 0.2, East: 1.0, Southeast: 0.6, South: 0.4, Southwest: 0.1, West: 0.3, Northwest: 0.5 },
    "Admin/ICU": { North: 0.2, Northeast: 0.1, East: 0.2, Southeast: 0.1, South: 0.8, Southwest: 1.0, West: 0.7, Northwest: 0.4 },
    "General Ward": { North: 0.5, Northeast: 0.5, East: 0.5, Southeast: 0.4, South: 1.0, Southwest: 0.6, West: 0.7, Northwest: 0.5 },
    "Kitchen/Cafeteria": { North: 0.1, Northeast: 0.0, East: 0.5, Southeast: 1.0, South: 0.6, Southwest: 0.1, West: 0.4, Northwest: 0.3 },
}



/**
 * Supervised Learning Simulation - Predicts Vastu compliance given an element and its direction
 */
export function predictVastuCompliance(element: string, currentDirection: string): VastuModelResult {
    const dir = currentDirection as Direction
    const weights = directionWeights[element]

    if (!weights) {
        return { status: "non-compliant", confidence: 0 }
    }

    // "Activation Function" (Sigmoid-like normalization)
    const score = weights[dir]

    // "Classification"
    if (score >= 0.8) {
        return { status: "compliant", confidence: score }
    } else if (score >= 0.4) {
        return { status: "warning", confidence: score }
    } else {
        return { status: "non-compliant", confidence: score }
    }
}

/**
 * Predicts the overall Vastu layout score using an aggregated sum of node activations
 */
export function predictOverallScore(results: Array<{ status: string; confidence: number }>): number {
    if (results.length === 0) return 0

    let totalScore = 0
    results.forEach(res => {
        totalScore += res.confidence * 100
    })

    // Normalize to 100%
    const normalizedScore = Math.round(totalScore / results.length)
    return Math.min(Math.max(normalizedScore, 0), 100)
}
