import { NextResponse } from 'next/server';

// ----------------------------------------
// CORE CONSTANTS & RULES ENGINE
// ----------------------------------------

type VastuZone = "NE" | "SE" | "SW" | "NW" | "Center" | "N" | "E" | "S" | "W";
type RoomType = "Kitchen" | "Bedroom" | "Pooja" | "Toilet" | "Living" | "Dining" | "Main Entrance" | "Master Bedroom";

interface VastuRule {
  idealZones: VastuZone[];
  penaltyZones: VastuZone[];
  weight: number;
  suggestions: { [key in VastuZone]?: string };
}

const VASTU_RULES: Record<RoomType, VastuRule> = {
  "Kitchen": {
    idealZones: ["SE", "NW"],
    penaltyZones: ["NE", "SW", "Center"],
    weight: 3,
    suggestions: {
      "NE": "Move Kitchen from Northeast to Southeast to prevent financial drain.",
      "SW": "Relocate Kitchen from Southwest. SW kitchen causes instability.",
      "Center": "A Kitchen in the Brahmasthan (Center) destroys home harmony. Move to SE."
    }
  },
  "Master Bedroom": {
    idealZones: ["SW", "S", "W"],
    penaltyZones: ["NE", "SE", "Center"],
    weight: 3,
    suggestions: {
      "NE": "Master Bedroom in Northeast disrupts health and clarity. Relocate to Southwest.",
      "SE": "SE Master Bedroom increases aggression. Best suited in Southwest."
    }
  },
  "Bedroom": {
    idealZones: ["S", "W", "NW"],
    penaltyZones: ["NE", "Center"],
    weight: 2,
    suggestions: {
      "NE": "Bedrooms in NE can block spiritual growth. Good for kids, bad for adults."
    }
  },
  "Pooja": {
    idealZones: ["NE", "E", "N"],
    penaltyZones: ["S", "SW", "NW", "Toilet_Adjacent"],
    weight: 3,
    suggestions: {
      "S": "Pooja in South is strictly prohibited. Move to Northeast.",
      "SW": "Pooja in SW limits spiritual connection. NE is highly recommended."
    }
  },
  "Toilet": {
    idealZones: ["NW", "W", "S"],
    penaltyZones: ["NE", "SE", "Center", "SW"],
    weight: 3,
    suggestions: {
      "NE": "CRITICAL: Toilet in Northeast brings severe health and financial ruin. Must remove.",
      "SE": "Toilet in Southeast blocks cash flow. Relocate to Northwest.",
      "SW": "Toilet in Southwest drains primary wealth. Relocate to West or Northwest."
    }
  },
  "Living": {
    idealZones: ["NE", "N", "E", "NW"],
    penaltyZones: ["SW"],
    weight: 1,
    suggestions: {
      "SW": "Living room in Southwest makes guests overstay and dominate. Move to North or East."
    }
  },
  "Dining": {
    idealZones: ["W", "E", "N"],
    penaltyZones: ["SW"],
    weight: 1,
    suggestions: {
      "SW": "Dining in Southwest is unideal for digestion. Move to West."
    }
  },
  "Main Entrance": {
    idealZones: ["NE", "E", "N"],
    penaltyZones: ["SW", "S", "SE"],
    weight: 3,
    suggestions: {
      "SW": "Southwest entrance brings major struggles. Block and use Northeast.",
      "S": "South entrance is generally avoided unless specific Pada is calculated."
    }
  }
};

// ----------------------------------------
// GEO-ENGINE: LAT/LONG TO TRUE NORTH
// ----------------------------------------

function calculateMagneticDeclination(lat: number, long: number): number {
  // Real-world implementation would use WMM (World Magnetic Model).
  // For the sake of this real-time engine, we apply a simplified approximation
  // based on India's geographic spread (-1 to +2 degrees usually).
  if (lat > 8 && lat < 37 && long > 68 && long < 97) {
    return (long - 80) * 0.05; // Heuristic approximation for India
  }
  return 0; // Default True North = Magnetic North for fallback
}

// Map angles to zones
function getZoneFromAngle(angle: number): VastuZone {
  const normalized = (angle % 360 + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return "N";
  if (normalized >= 22.5 && normalized < 67.5) return "NE";
  if (normalized >= 67.5 && normalized < 112.5) return "E";
  if (normalized >= 112.5 && normalized < 157.5) return "SE";
  if (normalized >= 157.5 && normalized < 202.5) return "S";
  if (normalized >= 202.5 && normalized < 247.5) return "SW";
  if (normalized >= 247.5 && normalized < 292.5) return "W";
  if (normalized >= 292.5 && normalized < 337.5) return "NW";
  return "Center";
}

// Calculate angle of room relative to center of plot
function calculateRoomAngle(plotCenter: {x: number, y: number}, roomCenter: {x: number, y: number}, declination: number): number {
  const dx = roomCenter.x - plotCenter.x;
  const dy = plotCenter.y - roomCenter.y; // Y is usually inverted in coordinate grids (0 at top)
  
  if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return -1; // Center Room
  
  let angle = Math.atan2(dx, dy) * (180 / Math.PI);
  // Apply True North Declination Correction
  angle = angle + declination;
  
  return (angle + 360) % 360;
}

// ----------------------------------------
// MAIN API ROUTE
// ----------------------------------------

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plot_size, location, layout_rooms } = body;
    
    if (!plot_size || !layout_rooms) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { lat, long } = location;
    const declination = calculateMagneticDeclination(lat, long);

    const plotCenter = { x: plot_size.width / 2, y: plot_size.length / 2 };
    
    let totalScore = 0;
    let earnedScore = 0;
    
    const violations: any[] = [];
    const suggestions: string[] = [];
    const zones_mapped: Record<string, any> = {};

    layout_rooms.forEach((room: any) => {
      const { type, x, y, width, length } = room;
      const roomCenter = { x: x + width / 2, y: y + length / 2 };
      
      const angle = calculateRoomAngle(plotCenter, roomCenter, declination);
      let zone: VastuZone;
      
      // Check if room falls within the central 1/9th area (Brahmasthan)
      const isCenter = 
        Math.abs(roomCenter.x - plotCenter.x) < plot_size.width / 6 &&
        Math.abs(roomCenter.y - plotCenter.y) < plot_size.length / 6;

      if (isCenter) {
        zone = "Center";
      } else {
        zone = getZoneFromAngle(angle);
      }

      zones_mapped[type] = { zone, angle: angle.toFixed(2), true_north_corrected: declination !== 0 };

      // Evaluate against Rules
      const rule = VASTU_RULES[type as RoomType];
      if (rule) {
        totalScore += rule.weight * 10; // Max 10 points per weight unit
        
        if (rule.idealZones.includes(zone)) {
          earnedScore += rule.weight * 10;
        } else if (rule.penaltyZones.includes(zone)) {
          earnedScore += 0; // 0 points for penalty zone
          const suggestion = rule.suggestions[zone] || `Move ${type} from ${zone} to ${rule.idealZones.join(' or ')}.`;
          violations.push({ room: type, current_zone: zone, severity: "High" });
          suggestions.push(suggestion);
        } else {
          earnedScore += rule.weight * 5; // Partial points for neutral zones
          suggestions.push(`Consider relocating ${type} to ${rule.idealZones.join(' or ')} for better energy flow.`);
        }
      }
    });

    const finalScore = Math.round((earnedScore / totalScore) * 100);
    let status = "Poor";
    if (finalScore >= 90) status = "Excellent";
    else if (finalScore >= 70) status = "Good";
    else if (finalScore >= 50) status = "Moderate";

    // Auto-Generate System Recommendation
    if (suggestions.length === 0) {
      suggestions.push("Layout is highly Vastu compliant. No structural changes recommended.");
    }

    return NextResponse.json({
      score: finalScore,
      status: status,
      true_north_offset: `${declination > 0 ? '+' : ''}${declination.toFixed(2)}°`,
      violations,
      suggestions,
      zones: zones_mapped
    });

  } catch (error) {
    console.error("Vastu Engine Error:", error);
    return NextResponse.json({ error: "Internal Server Error during Vastu Analysis" }, { status: 500 });
  }
}
