export const REAL_TIME_CONSTRUCTION_DATA = [
  // Format: { area, floors, qualityLevel, city, cementUsed, steelUsed, brickCount, sandUsed, aggregateUsed, actualCost }
  // Simulated data for training
  { area: 1200, floors: 1, qualityLevel: "standard", city: "hyderabad", cementUsed: 540, steelUsed: 4560, brickCount: 26400, sandUsed: 2160, aggregateUsed: 1620, actualCost: 2880000 },
  { area: 1500, floors: 2, qualityLevel: "premium", city: "bangalore", cementUsed: 1500, steelUsed: 11400, brickCount: 66000, sandUsed: 5400, aggregateUsed: 4050, actualCost: 8100000 },
  { area: 800, floors: 1, qualityLevel: "economy", city: "chennai", cementUsed: 310, steelUsed: 2700, brickCount: 15000, sandUsed: 1200, aggregateUsed: 900, actualCost: 1600000 },
  { area: 2500, floors: 3, qualityLevel: "luxury", city: "mumbai", cementUsed: 3800, steelUsed: 31500, brickCount: 165000, sandUsed: 13500, aggregateUsed: 10125, actualCost: 24000000 },
  { area: 1800, floors: 2, qualityLevel: "standard", city: "pune", cementUsed: 1700, steelUsed: 13600, brickCount: 79200, sandUsed: 6480, aggregateUsed: 4860, actualCost: 5600000 },
  // ... adding more variety
  { area: 1000, floors: 1, qualityLevel: "standard", city: "hyderabad", cementUsed: 450, steelUsed: 3800, brickCount: 22000, sandUsed: 1800, aggregateUsed: 1350, actualCost: 2400000 },
  { area: 2000, floors: 2, qualityLevel: "premium", city: "delhi", cementUsed: 2000, steelUsed: 15200, brickCount: 88000, sandUsed: 7200, aggregateUsed: 5400, actualCost: 7500000 },
  { area: 3000, floors: 4, qualityLevel: "luxury", city: "bangalore", cementUsed: 5800, steelUsed: 52000, brickCount: 264000, sandUsed: 21600, aggregateUsed: 16200, actualCost: 18000000 },
  { area: 1500, floors: 1, qualityLevel: "economy", city: "lucknow", cementUsed: 600, steelUsed: 5000, brickCount: 30000, sandUsed: 2400, aggregateUsed: 1800, actualCost: 3200000 },
  { area: 2200, floors: 2, qualityLevel: "standard", city: "ahmedabad", cementUsed: 2100, steelUsed: 16500, brickCount: 96800, sandUsed: 7920, aggregateUsed: 5940, actualCost: 6200000 },
  { area: 1100, floors: 1, qualityLevel: "premium", city: "surat", cementUsed: 580, steelUsed: 5000, brickCount: 24200, sandUsed: 2300, aggregateUsed: 1700, actualCost: 3800000 },
  { area: 4000, floors: 5, qualityLevel: "luxury", city: "mumbai", cementUsed: 8500, steelUsed: 84000, brickCount: 440000, sandUsed: 36000, aggregateUsed: 27000, actualCost: 45000000 },
  { area: 900, floors: 1, qualityLevel: "standard", city: "kolkata", cementUsed: 410, steelUsed: 3400, brickCount: 19800, sandUsed: 1620, aggregateUsed: 1215, actualCost: 2100000 },
  { area: 1600, floors: 2, qualityLevel: "economy", city: "hyderabad", cementUsed: 1200, steelUsed: 10000, brickCount: 60000, sandUsed: 5000, aggregateUsed: 3800, actualCost: 4800000 },
  { area: 2800, floors: 3, qualityLevel: "standard", city: "bangalore", cementUsed: 3400, steelUsed: 28000, brickCount: 185000, sandUsed: 15000, aggregateUsed: 11000, actualCost: 10500000 },
  { area: 1300, floors: 1, qualityLevel: "premium", city: "pune", cementUsed: 750, steelUsed: 6500, brickCount: 35000, sandUsed: 2800, aggregateUsed: 2100, actualCost: 5200000 },
  { area: 3500, floors: 4, qualityLevel: "luxury", city: "delhi", cementUsed: 7200, steelUsed: 65000, brickCount: 300000, sandUsed: 25000, aggregateUsed: 18000, actualCost: 32000000 },
  { area: 1400, floors: 1, qualityLevel: "economy", city: "chennai", cementUsed: 550, steelUsed: 4800, brickCount: 28000, sandUsed: 2200, aggregateUsed: 1650, actualCost: 2900000 },
  { area: 2100, floors: 2, qualityLevel: "standard", city: "hyderabad", cementUsed: 1950, steelUsed: 16000, brickCount: 92000, sandUsed: 7500, aggregateUsed: 5600, actualCost: 5800000 },
  { area: 2600, floors: 3, qualityLevel: "premium", city: "bangalore", cementUsed: 3200, steelUsed: 26000, brickCount: 150000, sandUsed: 12500, aggregateUsed: 9500, actualCost: 11000000 },
  { area: 1000, floors: 1, qualityLevel: "luxury", city: "mumbai", cementUsed: 750, steelUsed: 7000, brickCount: 45000, sandUsed: 3500, aggregateUsed: 2500, actualCost: 6500000 },
  { area: 1700, floors: 2, qualityLevel: "standard", city: "pune", cementUsed: 1650, steelUsed: 13000, brickCount: 75000, sandUsed: 6000, aggregateUsed: 4500, actualCost: 5400000 },
  { area: 3200, floors: 4, qualityLevel: "premium", city: "delhi", cementUsed: 6200, steelUsed: 55000, brickCount: 280000, sandUsed: 22000, aggregateUsed: 16500, actualCost: 24000000 },
  { area: 1200, floors: 1, qualityLevel: "economy", city: "lucknow", cementUsed: 480, steelUsed: 4200, brickCount: 24000, sandUsed: 2000, aggregateUsed: 1500, actualCost: 2500000 },
  { area: 2400, floors: 2, qualityLevel: "standard", city: "ahmedabad", cementUsed: 2300, steelUsed: 18500, brickCount: 105000, sandUsed: 8500, aggregateUsed: 6400, actualCost: 6800000 }
];
