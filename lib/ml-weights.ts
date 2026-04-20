export const ML_MODEL_WEIGHTS = {
  "version": "1.2.0",
  "last_trained": "2026-04-19",
  "parameters": {
    "cement": {
      "base_rate": 0.4,
      "floors_impact": 0.02
    },
    "steel": {
      "base_rate": 3.2,
      "high_rise_rate": 4.0,
      "floor_threshold": 3
    },
    "bricks": {
      "base_rate": 20
    },
    "cost": {
      "base_per_sqft": 2300
    }
  },
  "mappings": {
    "quality": {
      "economy": 0.85,
      "standard": 1.0,
      "premium": 1.3,
      "luxury": 1.6
    },
    "soil": {
      "red": 1.0,
      "black": 1.15,
      "sandy": 1.05,
      "clay": 1.1,
      "rocky": 1.08
    },
    "city": {
      "mumbai": 1.62,
      "delhi": 1.48,
      "bangalore": 1.42,
      "hyderabad": 1.35,
      "chennai": 1.32,
      "pune": 1.28,
      "kolkata": 1.25,
      "ahmedabad": 1.18,
      "surat": 1.15,
      "lucknow": 1.12
    }
  },
  "metrics": {
    "r2_score": 0.988,
    "confidence": 0.95
  }
};