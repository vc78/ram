export const ML_MODEL_WEIGHTS = {
  "version": "1.5.0",
  "last_trained": "2026-05-13",
  "parameters": {
    "cement": {
      "base_rate": 0.4195,
      "floors_impact": 0.03,
      "room_impact": 0.015
    },
    "steel": {
      "base_rate": 3.5328,
      "high_rise_rate": 4.2,
      "floor_threshold": 3
    },
    "bricks": {
      "base_rate": 20.05
    },
    "cost": {
      "base_per_sqft": 1970
    }
  },
  "mappings": {
    "quality": {
      "economy": 0.88,
      "standard": 1,
      "premium": 1.25,
      "luxury": 1.55
    },
    "brick_type": {
      "red_brick": 1,
      "aac_block": 0.15,
      "fly_ash": 1.05,
      "wire_cut": 1.1
    },
    "cement_type": {
      "opc_43": 1,
      "opc_53": 0.95,
      "ppc": 1.02
    },
    "soil": {
      "red": 1,
      "black": 1.18,
      "sandy": 1.05,
      "clay": 1.12,
      "rocky": 1.06
    },
    "city": {
      "mumbai": 1.65,
      "delhi": 1.5,
      "bangalore": 1.45,
      "hyderabad": 1.38,
      "chennai": 1.35,
      "pune": 1.3,
      "kolkata": 1.28,
      "ahmedabad": 1.2,
      "surat": 1.18,
      "lucknow": 1.15
    },
    "topography": {
      "flat": 1,
      "moderate_slope": 1.15,
      "steep_slope": 1.35
    },
    "road_access": {
      "wide_truck_access": 1,
      "narrow_tractor_access": 1.12
    },
    "labor_contract": {
      "turnkey_premium": 1.25,
      "item_rate_standard": 1,
      "daily_wage_local": 0.85
    }
  },
  "metrics": {
    "r2_score": 0.994,
    "confidence": 0.99
  }
};