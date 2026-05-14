export type VastuDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" | "C";
export type VastuSeverity = "critical" | "moderate" | "minor" | "ok";

export interface RuleResult {
  rule: string;
  score: number;
  weight: number;
  defect: string;
  severity: VastuSeverity;
  recommendation: string;
}

export const VASTU_ZONES: Record<VastuDirection, { element: string; planet: string; ideal: string[] }> = {
  "N": { element: "Water", planet: "Mercury", ideal: ["living", "office", "treasury", "main_door"] },
  "NE": { element: "Water", planet: "Jupiter", ideal: ["pooja", "meditation", "open_space", "water"] },
  "E": { element: "Air", planet: "Sun", ideal: ["living", "dining", "study", "main_door"] },
  "SE": { element: "Fire", planet: "Venus", ideal: ["kitchen", "fire", "generator"] },
  "S": { element: "Earth", planet: "Mars", ideal: ["bedroom", "store", "heavy_items"] },
  "SW": { element: "Earth", planet: "Rahu", ideal: ["master_bedroom", "heavy_items", "store"] },
  "W": { element: "Water", planet: "Saturn", ideal: ["children_room", "dining", "study"] },
  "NW": { element: "Air", planet: "Moon", ideal: ["guest_room", "garage", "bathroom", "children_room"] },
  "C": { element: "Space", planet: "Brahma", ideal: ["open", "courtyard"] },
};

export const ROOM_ZONE_SCORE: Record<string, Record<string, number>> = {
  "kitchen": { "SE": 1.0, "NW": 0.5, "S": 0.3, "E": 0.4, "NE": 0.0, "N": 0.1, "SW": 0.1, "W": 0.3, "C": 0.0 },
  "master_bedroom": { "SW": 1.0, "S": 0.8, "W": 0.6, "NW": 0.4, "NE": 0.1, "N": 0.3, "E": 0.4, "SE": 0.3, "C": 0.0 },
  "children_room": { "W": 1.0, "NW": 0.8, "E": 0.7, "N": 0.6, "SW": 0.2, "S": 0.3, "SE": 0.3, "NE": 0.5, "C": 0.0 },
  "pooja": { "NE": 1.0, "N": 0.7, "E": 0.7, "SW": 0.0, "S": 0.1, "SE": 0.2, "W": 0.4, "NW": 0.4, "C": 0.3 },
  "living": { "N": 1.0, "E": 0.9, "NE": 0.7, "NW": 0.6, "SW": 0.3, "S": 0.4, "SE": 0.4, "W": 0.6, "C": 0.2 },
  "dining": { "W": 1.0, "E": 0.8, "N": 0.7, "S": 0.5, "NE": 0.4, "NW": 0.6, "SE": 0.5, "SW": 0.3, "C": 0.0 },
  "bathroom": { "NW": 1.0, "W": 0.7, "S": 0.6, "SE": 0.5, "NE": 0.0, "N": 0.2, "E": 0.2, "SW": 0.2, "C": 0.0 },
  "toilet": { "NW": 1.0, "W": 0.7, "S": 0.6, "NE": 0.0, "N": 0.1, "E": 0.1, "SW": 0.1, "SE": 0.4, "C": 0.0 },
  "study": { "W": 1.0, "E": 0.9, "N": 0.8, "NE": 0.7, "SW": 0.3, "S": 0.4, "SE": 0.4, "NW": 0.5, "C": 0.2 },
  "store": { "SW": 1.0, "S": 0.8, "W": 0.7, "NW": 0.5, "NE": 0.1, "N": 0.2, "E": 0.3, "SE": 0.5, "C": 0.1 },
  "staircase": { "S": 1.0, "SW": 0.9, "W": 0.8, "SE": 0.6, "NE": 0.0, "N": 0.2, "E": 0.2, "NW": 0.5, "C": 0.0 },
};

export const DOOR_SCORE: Record<string, number> = {
  "N": 0.9, "NE": 1.0, "E": 1.0, "SE": 0.3, "S": 0.1, "SW": 0.0, "W": 0.7, "NW": 0.6,
};

export const SLEEP_HEAD_SCORE: Record<string, number> = {
  "S": 1.0, "E": 0.8, "W": 0.6, "N": 0.0,
};

export const WATER_SCORE: Record<string, number> = {
  "NE": 1.0, "N": 0.8, "E": 0.7, "NW": 0.5, "SW": 0.2, "W": 0.4, "SE": 0.3, "S": 0.2, "C": 0.0,
};

export const RULE_WEIGHTS: Record<string, number> = {
  "kitchen_placement": 14,
  "master_bedroom_placement": 13,
  "pooja_placement": 10,
  "main_door_direction": 12,
  "toilet_bathroom": 8,
  "living_placement": 7,
  "staircase_placement": 6,
  "brahmasthan_open": 8,
  "children_room": 5,
  "sleep_head_direction": 6,
  "water_placement": 5,
  "study_placement": 4,
};

export function runVastuRules(layout: Record<string, string>): RuleResult[] {
  const results: RuleResult[] = [];

  const evaluate = (room: string, zone: string) => (ROOM_ZONE_SCORE[room]?.[zone] ?? 0.4);

  // Kitchen
  const kz = layout.kitchen;
  if (kz) {
    const s = evaluate("kitchen", kz);
    const sev: VastuSeverity = s < 0.3 ? "critical" : s < 0.6 ? "moderate" : s < 0.85 ? "minor" : "ok";
    results.push({
      rule: "kitchen_placement",
      score: s,
      weight: RULE_WEIGHTS.kitchen_placement,
      defect: s < 0.85 ? `Kitchen in ${kz} zone — fire element conflicts with ${VASTU_ZONES[kz as VastuDirection]?.element} element here` : "",
      severity: sev,
      recommendation: s < 0.85 ? "Relocate kitchen to SE (ideal) or NW (acceptable). Avoid NE at all costs." : "",
    });
  }

  // Master Bedroom
  const mbz = layout.master_bedroom;
  if (mbz) {
    const s = evaluate("master_bedroom", mbz);
    const sev: VastuSeverity = s < 0.3 ? "critical" : s < 0.6 ? "moderate" : s < 0.85 ? "minor" : "ok";
    results.push({
      rule: "master_bedroom_placement",
      score: s,
      weight: RULE_WEIGHTS.master_bedroom_placement,
      defect: s < 0.85 ? `Master bedroom in ${mbz} — SW/S zone preferred for stability & rest` : "",
      severity: sev,
      recommendation: s < 0.85 ? "Shift master bedroom to SW (best) or S. NE master bedroom causes health issues." : "",
    });
  }

  // Pooja
  const pz = layout.pooja;
  if (pz) {
    const s = evaluate("pooja", pz);
    const sev: VastuSeverity = s < 0.2 ? "critical" : s < 0.6 ? "moderate" : s < 0.85 ? "minor" : "ok";
    results.push({
      rule: "pooja_placement",
      score: s,
      weight: RULE_WEIGHTS.pooja_placement,
      defect: s < 0.85 ? `Pooja room in ${pz} — divine energy weakened outside NE/N/E zones` : "",
      severity: sev,
      recommendation: s < 0.85 ? "Place pooja room in NE corner for maximum positive energy. N or E are acceptable." : "",
    });
  }

  // Main Door
  const dz = layout.main_door;
  if (dz) {
    const s = DOOR_SCORE[dz] ?? 0.4;
    const sev: VastuSeverity = s < 0.2 ? "critical" : s < 0.6 ? "moderate" : s < 0.85 ? "minor" : "ok";
    results.push({
      rule: "main_door_direction",
      score: s,
      weight: RULE_WEIGHTS.main_door_direction,
      defect: s < 0.85 ? `Main entrance facing ${dz} — ${s < 0.2 ? 'highly inauspicious (Rahu/Mars zone)' : 'suboptimal direction'}` : "",
      severity: sev,
      recommendation: s < 0.85 ? "Ideal entrance: NE, E, or N. SW and S entrances bring instability & financial loss." : "",
    });
  }

  // Toilet / Bathroom
  const tz = layout.toilet;
  const bz = layout.bathroom;
  [ { name: "toilet", zone: tz }, { name: "bathroom", zone: bz } ].forEach(item => {
    if (item.zone) {
      let s = evaluate(item.name, item.zone);
      if (item.zone === "NE") s = 0.0;
      const sev: VastuSeverity = s < 0.2 ? "critical" : s < 0.6 ? "moderate" : "ok";
      results.push({
        rule: "toilet_bathroom",
        score: s,
        weight: RULE_WEIGHTS.toilet_bathroom / 2,
        defect: item.zone === "NE" ? "Toilet/bathroom in NE — most severe Vastu defect. Blocks positive energy." : (s < 0.6 ? `${item.name.charAt(0).toUpperCase() + item.name.slice(1)} in ${item.zone} causes energy imbalance` : ""),
        severity: sev,
        recommendation: item.zone === "NE" ? "Immediately relocate toilet away from NE. This is the single most harmful placement." : (s < 0.6 ? "NW is ideal for bathroom/toilet." : ""),
      });
    }
  });

  // Brahmasthan
  const bs = layout.brahmasthan || "open";
  const bss = bs === "open" ? 1.0 : 0.0;
  results.push({
    rule: "brahmasthan_open",
    score: bss,
    weight: RULE_WEIGHTS.brahmasthan_open,
    defect: bss === 1.0 ? "" : "Brahmasthan (central zone) is blocked/built — disrupts cosmic energy flow",
    severity: bss === 1.0 ? "ok" : "critical",
    recommendation: bss === 1.0 ? "" : "Keep the central zone open, as a courtyard or light shaft. Never place columns, toilets, or staircases here.",
  });

  // Living
  const lz = layout.living;
  if (lz) {
    const s = evaluate("living", lz);
    const sev: VastuSeverity = s < 0.5 ? "moderate" : s < 0.8 ? "minor" : "ok";
    results.push({
      rule: "living_placement",
      score: s,
      weight: RULE_WEIGHTS.living_placement,
      defect: s < 0.8 ? `Living room in ${lz} — N or E preferred for social harmony` : "",
      severity: sev,
      recommendation: s < 0.8 ? "Move living room to N or E zone for better social & financial energy." : "",
    });
  }

  // Staircase
  const sz = layout.staircase;
  if (sz) {
    let s = evaluate("staircase", sz);
    if (sz === "NE") s = 0.0;
    const sev: VastuSeverity = s < 0.2 ? "critical" : s < 0.6 ? "moderate" : "ok";
    results.push({
      rule: "staircase_placement",
      score: s,
      weight: RULE_WEIGHTS.staircase_placement,
      defect: sz === "NE" ? "Staircase in NE — blocks Jupiter's positive energy." : (s < 0.6 ? `Staircase in ${sz} causes energy drain` : ""),
      severity: sev,
      recommendation: s < 0.6 ? "Ideal staircase zones: S, SW, or W. Never NE or centre." : "",
    });
  }

  // Children's Room
  const crz = layout.children_room;
  if (crz) {
    const s = evaluate("children_room", crz);
    const sev: VastuSeverity = s < 0.5 ? "moderate" : s < 0.8 ? "minor" : "ok";
    results.push({
      rule: "children_room",
      score: s,
      weight: RULE_WEIGHTS.children_room,
      defect: s < 0.8 ? `Children's room in ${crz} — W or NW supports creativity & growth` : "",
      severity: sev,
      recommendation: s < 0.8 ? "Place children's room in W or NW for better focus and academic performance." : "",
    });
  }

  // Sleep Head
  const sh = layout.sleep_head;
  if (sh) {
    const s = SLEEP_HEAD_SCORE[sh] ?? 0.5;
    const sev: VastuSeverity = s === 0.0 ? "critical" : s < 0.7 ? "moderate" : "ok";
    results.push({
      rule: "sleep_head_direction",
      score: s,
      weight: RULE_WEIGHTS.sleep_head_direction,
      defect: s === 0.0 ? "Head pointing North while sleeping — body's magnetic field opposes Earth's, causes poor sleep & health." : (s < 0.7 ? `Head direction ${sh} is suboptimal` : ""),
      severity: sev,
      recommendation: s < 0.7 ? "Sleep with head pointing South (best) or East. North is strictly avoided." : "",
    });
  }

  // Water Body
  const wz = layout.water_body;
  if (wz) {
    const s = WATER_SCORE[wz] ?? 0.4;
    const sev: VastuSeverity = s < 0.4 ? "moderate" : s < 0.7 ? "minor" : "ok";
    results.push({
      rule: "water_placement",
      score: s,
      weight: RULE_WEIGHTS.water_placement,
      defect: s < 0.7 ? `Water body/sump in ${wz} — NE or N preferred for underground water` : "",
      severity: sev,
      recommendation: s < 0.7 ? "Place underground water tank in NE, N, or E. Avoid SW (causes financial instability)." : "",
    });
  }

  // Study
  const stz = layout.study;
  if (stz) {
    const s = evaluate("study", stz);
    const sev: VastuSeverity = s < 0.7 ? "minor" : "ok";
    results.push({
      rule: "study_placement",
      score: s,
      weight: RULE_WEIGHTS.study_placement,
      defect: s < 0.7 ? `Study in ${stz} — W or E zone improves concentration` : "",
      severity: sev,
      recommendation: s < 0.7 ? "Place study room in W (Saturn's wisdom) or E (Sun's clarity)." : "",
    });
  }

  return results;
}

export function computeVastuScore(results: RuleResult[]) {
  const totalWeight = results.reduce((acc, r) => acc + r.weight, 0);
  const weightedSum = results.reduce((acc, r) => acc + (r.score * r.weight), 0);
  const overall = totalWeight ? (weightedSum / totalWeight) * 100 : 0;

  const critical = results.filter(r => r.severity === "critical");
  const moderate = results.filter(r => r.severity === "moderate");
  const minor = results.filter(r => r.severity === "minor");

  let grade = "A+";
  if (critical.length >= 2 || overall < 35) grade = "D";
  else if (critical.length === 1 || overall < 55) grade = "C";
  else if (overall < 75) grade = "B";
  else if (overall < 90) grade = "A";

  return {
    overall_score: Math.round(overall * 10) / 10,
    grade,
    critical_defects: critical.length,
    moderate_defects: moderate.length,
    minor_defects: minor.length,
    defects: results.filter(r => r.defect).sort((a, b) => {
      const sevOrder = { critical: 0, moderate: 1, minor: 2, ok: 3 };
      return sevOrder[a.severity] - sevOrder[b.severity] || a.score - b.score;
    }),
  };
}
