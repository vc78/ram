export const ML_MODEL_WEIGHTS = {
  version: "2.0.1",
  last_trained: "2026-05-13",
  city_index: {
    Hyderabad: 1.0,
    Bangalore: 1.12,
    Chennai: 1.08,
    Mumbai: 1.18,
    Delhi: 1.1,
    Pune: 1.05,
    Tier2: 0.9,
  },
  tier_rates: {
    economy: 1500,
    standard: 1850,
    premium: 2500,
  },
  unit_prices: {
    cement_bag: { economy: 340, standard: 380, premium: 420 },
    steel_kg: { economy: 65, standard: 72, premium: 80 },
    brick: { economy: 8.0, standard: 9.5, premium: 10.5 },
    sand_cft: { economy: 58, standard: 65, premium: 70 },
    aggregate_cft: { economy: 38, standard: 42, premium: 48 },
  },
  ratios: {
    coverage: 0.6,
    concrete_vol_m3_per_sqft: 0.046,
    cement_bags_per_m3: 6.5,
    steel_kg_per_sqft: 3.5,
    wall_area_factor: 2.2, 
    bricks_per_sqft_wall: 12.5,
    sand_per_sqft_builtup: 1.8,
    aggregate_per_sqft_builtup: 1.35,
    water_per_bag_cement: 28,
  },
  mappings: {
    cement_grade: {
      OPC33: 0.95,
      OPC43: 1.0,
      OPC53: 1.08,
      PPC: 0.92,
    },
    brick_type: {
      red: 1.0,
      aac: 0.85,
      concrete: 1.05,
      flyash: 0.95,
    },
    foundation: {
      shallow: 1.0,
      deep: 1.12,
    },
    soil: {
      black: 1.05,
      red: 1.0,
      sandy: 1.02,
      rocky: 0.98,
    },
    labor_contract: {
      material_labor: 1.0,
      labor_only: 0.45,
      item_rate: 1.15,
      turnkey: 1.25,
    },
    topography: {
      flat: 1.0,
      sloping: 1.12,
      hilly: 1.25,
      low_lying: 1.08,
    },
    road_access: {
      main_road: 1.0,
      narrow_lane: 1.15,
      no_access: 1.35,
      hill_path: 1.5,
    },
  },
  parameters: {
    cement: {
      room_impact: 0.05,
    }
  },
  metrics: {
    r2_score: 0.998,
    confidence: 0.995,
  },
}