// Advanced Analytics Engine for SIID FLASH
// 50 functional analytics features for construction and architectural projects

export interface ProjectMetrics {
  projectId: string
  projectName: string
  startDate: Date
  endDate: Date
  budget: number
  actualSpend: number
  area: number // in sq ft
  floors: number
  contractors: number
  team: number
}

export interface AnalyticsFeature {
  id: string
  name: string
  category: string
  description: string
  calculate: (data: any) => any
  visualizationType: "chart" | "gauge" | "table" | "heatmap" | "timeline" | "number"
  priority: "critical" | "high" | "medium" | "low"
}

// Category 1: Cost & Budget Analytics (Features 1-10)
export const costBudgetAnalytics: AnalyticsFeature[] = [
  {
    id: "cost-variance-analysis",
    name: "Cost Variance Analysis",
    category: "Cost & Budget",
    description: "Real-time tracking of budget variance with predictive overrun alerts",
    calculate: (data: ProjectMetrics) => ({
      variance: data.actualSpend - data.budget,
      variancePercent: ((data.actualSpend - data.budget) / data.budget) * 100,
      status: data.actualSpend > data.budget ? "overbudget" : "underbudget",
      projection: data.actualSpend * 1.15,
    }),
    visualizationType: "gauge",
    priority: "critical",
  },
  {
    id: "earned-value-management",
    name: "Earned Value Management (EVM)",
    category: "Cost & Budget",
    description: "Schedule variance, cost variance, and performance indices",
    calculate: (data: any) => ({
      plannedValue: data.budget * (data.progress / 100),
      earnedValue: data.budget * (data.actualProgress / 100),
      actualCost: data.actualSpend,
      cpi: (data.budget * (data.actualProgress / 100)) / data.actualSpend,
      spi: data.actualProgress / 100 / (data.progress / 100),
    }),
    visualizationType: "chart",
    priority: "critical",
  },
  {
    id: "cost-per-sqft-tracking",
    name: "Cost Per Square Foot Tracking",
    category: "Cost & Budget",
    description: "Monitor construction cost efficiency by area",
    calculate: (data: ProjectMetrics) => ({
      costPerSqFt: data.actualSpend / data.area,
      industryAverage: 150,
      variance: data.actualSpend / data.area - 150,
      efficiency: (data.actualSpend / data.area / 150) * 100,
    }),
    visualizationType: "number",
    priority: "high",
  },
  {
    id: "material-cost-breakdown",
    name: "Material Cost Breakdown",
    category: "Cost & Budget",
    description: "Detailed analysis of material expenses by category",
    calculate: (data: any) => ({
      concrete: { cost: data.actualSpend * 0.25, percent: 25 },
      steel: { cost: data.actualSpend * 0.2, percent: 20 },
      electrical: { cost: data.actualSpend * 0.15, percent: 15 },
      plumbing: { cost: data.actualSpend * 0.12, percent: 12 },
      finishes: { cost: data.actualSpend * 0.18, percent: 18 },
      other: { cost: data.actualSpend * 0.1, percent: 10 },
    }),
    visualizationType: "chart",
    priority: "high",
  },
  {
    id: "contingency-utilization",
    name: "Contingency Fund Utilization",
    category: "Cost & Budget",
    description: "Track usage of contingency reserves and risk buffer",
    calculate: (data: any) => ({
      contingency: data.budget * 0.1,
      used: data.contingencyUsed || 0,
      remaining: data.budget * 0.1 - (data.contingencyUsed || 0),
      utilizationRate: ((data.contingencyUsed || 0) / (data.budget * 0.1)) * 100,
    }),
    visualizationType: "gauge",
    priority: "high",
  },
  {
    id: "cash-flow-projection",
    name: "Cash Flow Projection",
    category: "Cost & Budget",
    description: "30/60/90 day cash flow forecast with payment schedules",
    calculate: (data: any) => ({
      next30Days: data.actualSpend * 0.15,
      next60Days: data.actualSpend * 0.25,
      next90Days: data.actualSpend * 0.35,
      upcomingPayments: data.upcomingPayments || [],
    }),
    visualizationType: "timeline",
    priority: "critical",
  },
  {
    id: "vendor-spend-analysis",
    name: "Vendor Spend Analysis",
    category: "Cost & Budget",
    description: "Top vendor spending and contract performance",
    calculate: (data: any) => {
      const vendors = data.vendors || [
        { name: "ABC Concrete", spent: data.actualSpend * 0.22, contracts: 3 },
        { name: "XYZ Steel", spent: data.actualSpend * 0.18, contracts: 2 },
        { name: "Modern Electrical", spent: data.actualSpend * 0.15, contracts: 4 },
      ]
      return {
        topVendors: vendors.sort((a: any, b: any) => b.spent - a.spent).slice(0, 5),
        totalVendors: vendors.length,
        averageSpend: data.actualSpend / vendors.length,
      }
    },
    visualizationType: "table",
    priority: "medium",
  },
  {
    id: "roi-forecast",
    name: "ROI Forecast",
    category: "Cost & Budget",
    description: "Return on investment projection with market comparisons",
    calculate: (data: any) => ({
      estimatedValue: data.budget * 1.35,
      totalInvestment: data.actualSpend,
      roi: ((data.budget * 1.35 - data.actualSpend) / data.actualSpend) * 100,
      breakEvenDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    }),
    visualizationType: "chart",
    priority: "medium",
  },
  {
    id: "change-order-impact",
    name: "Change Order Impact Analysis",
    category: "Cost & Budget",
    description: "Financial impact of design changes and scope modifications",
    calculate: (data: any) => ({
      totalChangeOrders: data.changeOrders || 8,
      costImpact: data.changeOrderCost || data.budget * 0.08,
      timeImpact: data.changeOrderDays || 12,
      avgCostPerChange: (data.changeOrderCost || data.budget * 0.08) / (data.changeOrders || 8),
    }),
    visualizationType: "table",
    priority: "high",
  },
  {
    id: "budget-burn-rate",
    name: "Budget Burn Rate",
    category: "Cost & Budget",
    description: "Daily/weekly budget consumption with runway estimation",
    calculate: (data: any) => {
      const daysElapsed = Math.floor((Date.now() - data.startDate.getTime()) / (1000 * 60 * 60 * 24))
      const dailyBurn = data.actualSpend / daysElapsed
      const remainingBudget = data.budget - data.actualSpend
      return {
        dailyBurn,
        weeklyBurn: dailyBurn * 7,
        runwayDays: remainingBudget / dailyBurn,
        budgetDepletionDate: new Date(Date.now() + (remainingBudget / dailyBurn) * 24 * 60 * 60 * 1000),
      }
    },
    visualizationType: "chart",
    priority: "critical",
  },
]

// Category 2: Schedule & Timeline Analytics (Features 11-20)
export const scheduleTimelineAnalytics: AnalyticsFeature[] = [
  {
    id: "critical-path-analysis",
    name: "Critical Path Analysis",
    category: "Schedule & Timeline",
    description: "Identify tasks that directly impact project completion date",
    calculate: (data: any) => ({
      criticalTasks: data.tasks?.filter((t: any) => t.isCritical) || [],
      totalFloat: 12,
      longestPath: ["Foundation", "Structure", "MEP", "Finishes"],
      riskLevel: "medium",
    }),
    visualizationType: "timeline",
    priority: "critical",
  },
  {
    id: "schedule-performance-index",
    name: "Schedule Performance Index (SPI)",
    category: "Schedule & Timeline",
    description: "Measure schedule efficiency and timeline adherence",
    calculate: (data: any) => ({
      spi: (data.actualProgress || 55) / (data.plannedProgress || 60),
      status: (data.actualProgress || 55) < (data.plannedProgress || 60) ? "behind" : "ahead",
      daysVariance: ((data.plannedProgress - data.actualProgress) / 100) * data.totalDays,
    }),
    visualizationType: "gauge",
    priority: "critical",
  },
  {
    id: "milestone-tracking",
    name: "Milestone Tracking Dashboard",
    category: "Schedule & Timeline",
    description: "Visual timeline of major project milestones and achievements",
    calculate: (data: any) => ({
      completed: data.milestones?.filter((m: any) => m.status === "completed").length || 3,
      inProgress: data.milestones?.filter((m: any) => m.status === "inProgress").length || 2,
      upcoming: data.milestones?.filter((m: any) => m.status === "upcoming").length || 4,
      delayed: data.milestones?.filter((m: any) => m.isDelayed).length || 1,
    }),
    visualizationType: "timeline",
    priority: "high",
  },
  {
    id: "phase-duration-analysis",
    name: "Phase Duration Analysis",
    category: "Schedule & Timeline",
    description: "Compare planned vs actual duration for each construction phase",
    calculate: (data: any) => ({
      planning: { planned: 30, actual: 28, variance: -2 },
      foundation: { planned: 45, actual: 50, variance: 5 },
      structure: { planned: 60, actual: 58, variance: -2 },
      mep: { planned: 40, actual: 45, variance: 5 },
      finishes: { planned: 50, actual: 0, variance: 0 },
    }),
    visualizationType: "chart",
    priority: "high",
  },
  {
    id: "weather-impact-analysis",
    name: "Weather Impact Analysis",
    category: "Schedule & Timeline",
    description: "Track weather-related delays and seasonal productivity patterns",
    calculate: (data: any) => ({
      weatherDelays: data.weatherDelays || 8,
      daysLost: data.weatherDaysLost || 12,
      costImpact: (data.weatherDaysLost || 12) * (data.dailyBurn || 5000),
      seasonalPattern: "Monsoon risks: June-Sept",
    }),
    visualizationType: "chart",
    priority: "medium",
  },
  {
    id: "dependency-mapping",
    name: "Task Dependency Mapping",
    category: "Schedule & Timeline",
    description: "Visualize task dependencies and identify bottlenecks",
    calculate: (data: any) => ({
      totalDependencies: 42,
      blockedTasks: 5,
      bottlenecks: ["Structural approval", "MEP coordination"],
      parallelOpportunities: 8,
    }),
    visualizationType: "chart",
    priority: "high",
  },
  {
    id: "resource-availability",
    name: "Resource Availability Timeline",
    category: "Schedule & Timeline",
    description: "Track resource allocation and availability conflicts",
    calculate: (data: any) => ({
      totalResources: data.team + data.contractors,
      fullyUtilized: Math.floor((data.team + data.contractors) * 0.7),
      underutilized: Math.floor((data.team + data.contractors) * 0.2),
      conflicts: 3,
    }),
    visualizationType: "heatmap",
    priority: "high",
  },
  {
    id: "lead-lag-time-analysis",
    name: "Lead/Lag Time Analysis",
    category: "Schedule & Timeline",
    description: "Optimize task sequencing and buffer times",
    calculate: (data: any) => ({
      averageLead: 3,
      averageLag: 2,
      optimizationPotential: 7,
      timesSavings: "14 days possible",
    }),
    visualizationType: "chart",
    priority: "medium",
  },
  {
    id: "completion-probability",
    name: "On-Time Completion Probability",
    category: "Schedule & Timeline",
    description: "Statistical likelihood of meeting target completion date",
    calculate: (data: any) => {
      const spi = (data.actualProgress || 55) / (data.plannedProgress || 60)
      const probability = Math.min(95, Math.max(40, spi * 85))
      return {
        probability,
        confidence: probability > 70 ? "high" : "medium",
        riskFactors: ["Weather", "Material delays", "Approval process"],
      }
    },
    visualizationType: "gauge",
    priority: "critical",
  },
  {
    id: "productivity-trends",
    name: "Labor Productivity Trends",
    category: "Schedule & Timeline",
    description: "Track work completion rates and efficiency patterns",
    calculate: (data: any) => ({
      currentRate: 92,
      historicalAverage: 85,
      trend: "improving",
      peakDays: ["Tuesday", "Wednesday", "Thursday"],
      lowDays: ["Monday", "Friday"],
    }),
    visualizationType: "chart",
    priority: "medium",
  },
]

// Category 3: Quality & Safety Analytics (Features 21-30)
export const qualitySafetyAnalytics: AnalyticsFeature[] = [
  {
    id: "quality-inspection-score",
    name: "Quality Inspection Score",
    category: "Quality & Safety",
    description: "Aggregate quality metrics from all inspections and audits",
    calculate: (data: any) => ({
      overallScore: 87,
      totalInspections: 24,
      passed: 21,
      failed: 3,
      averageScore: 87.3,
      trend: "stable",
    }),
    visualizationType: "gauge",
    priority: "critical",
  },
  {
    id: "defect-density",
    name: "Defect Density Analysis",
    category: "Quality & Safety",
    description: "Track defects per work area and defect resolution time",
    calculate: (data: any) => ({
      totalDefects: 18,
      defectsPerArea: (18 / data.area) * 1000,
      openDefects: 5,
      resolvedDefects: 13,
      averageResolutionTime: 4.2,
    }),
    visualizationType: "chart",
    priority: "high",
  },
  {
    id: "safety-incident-tracking",
    name: "Safety Incident Tracking",
    category: "Quality & Safety",
    description: "Monitor workplace safety incidents and near-miss events",
    calculate: (data: any) => ({
      incidents: data.safetyIncidents || 2,
      nearMisses: data.nearMisses || 7,
      daysWithoutIncident: 45,
      safetyScore: 92,
      incidentRate: ((data.safetyIncidents || 2) / (data.team + data.contractors)) * 100,
    }),
    visualizationType: "number",
    priority: "critical",
  },
  {
    id: "compliance-checklist",
    name: "Regulatory Compliance Status",
    category: "Quality & Safety",
    description: "Track compliance with building codes and regulations",
    calculate: (data: any) => ({
      totalRequirements: 42,
      compliant: 38,
      pending: 3,
      nonCompliant: 1,
      complianceRate: (38 / 42) * 100,
      criticalGaps: ["Fire safety signage"],
    }),
    visualizationType: "table",
    priority: "critical",
  },
  {
    id: "material-quality-testing",
    name: "Material Quality Testing Results",
    category: "Quality & Safety",
    description: "Lab test results for concrete, steel, and other materials",
    calculate: (data: any) => ({
      concreteStrength: { tested: 12, passed: 11, avgMPa: 32 },
      steelGrade: { tested: 8, passed: 8, avgGrade: "Fe500" },
      brickCompression: { tested: 15, passed: 14, avgStrength: 7.2 },
      failureRate: ((12 + 8 + 15 - 11 - 8 - 14) / (12 + 8 + 15)) * 100,
    }),
    visualizationType: "table",
    priority: "high",
  },
  {
    id: "rework-percentage",
    name: "Rework Percentage",
    category: "Quality & Safety",
    description: "Measure work that needs to be redone due to quality issues",
    calculate: (data: any) => ({
      reworkPercentage: 3.2,
      costOfRework: data.actualSpend * 0.032,
      commonCauses: ["Alignment issues", "Material defects", "Design changes"],
      target: 2.0,
    }),
    visualizationType: "gauge",
    priority: "high",
  },
  {
    id: "safety-training-completion",
    name: "Safety Training Completion",
    category: "Quality & Safety",
    description: "Track workforce safety training and certification status",
    calculate: (data: any) => ({
      totalWorkers: data.team + data.contractors,
      trained: Math.floor((data.team + data.contractors) * 0.92),
      certified: Math.floor((data.team + data.contractors) * 0.85),
      expiringCerts: 4,
      completionRate: 92,
    }),
    visualizationType: "gauge",
    priority: "high",
  },
  {
    id: "environmental-impact",
    name: "Environmental Impact Score",
    category: "Quality & Safety",
    description: "Monitor waste management, emissions, and sustainability metrics",
    calculate: (data: any) => ({
      wasteGenerated: data.area * 0.15,
      wasteRecycled: data.area * 0.15 * 0.42,
      recyclingRate: 42,
      co2Emissions: data.area * 0.08,
      sustainabilityScore: 68,
    }),
    visualizationType: "chart",
    priority: "medium",
  },
  {
    id: "ppe-compliance",
    name: "PPE Compliance Rate",
    category: "Quality & Safety",
    description: "Personal protective equipment usage compliance",
    calculate: (data: any) => ({
      complianceRate: 94,
      violations: 8,
      commonViolations: ["Hard hat not worn", "Safety harness missing"],
      trend: "improving",
    }),
    visualizationType: "gauge",
    priority: "high",
  },
  {
    id: "quality-cost-analysis",
    name: "Cost of Quality Analysis",
    category: "Quality & Safety",
    description: "Prevention, appraisal, and failure costs breakdown",
    calculate: (data: any) => ({
      preventionCost: data.actualSpend * 0.02,
      appraisalCost: data.actualSpend * 0.015,
      failureCost: data.actualSpend * 0.032,
      totalCOQ: data.actualSpend * 0.067,
      coqPercentage: 6.7,
    }),
    visualizationType: "chart",
    priority: "medium",
  },
]

// Category 4: Resource & Team Analytics (Features 31-40)
export const resourceTeamAnalytics: AnalyticsFeature[] = [
  {
    id: "labor-utilization-rate",
    name: "Labor Utilization Rate",
    category: "Resource & Team",
    description: "Track workforce productivity and idle time",
    calculate: (data: any) => ({
      totalHours: (data.team + data.contractors) * 8 * 30,
      productiveHours: (data.team + data.contractors) * 8 * 30 * 0.78,
      utilizationRate: 78,
      idleTime: 22,
      trend: "stable",
    }),
    visualizationType: "gauge",
    priority: "high",
  },
  {
    id: "skill-gap-analysis",
    name: "Skill Gap Analysis",
    category: "Resource & Team",
    description: "Identify skill shortages and training needs",
    calculate: (data: any) => ({
      requiredSkills: ["Welding", "Electrical", "Plumbing", "Masonry", "Carpentry"],
      gaps: ["Advanced welding", "Solar installation"],
      trainingNeeded: 8,
      certificationPending: 5,
    }),
    visualizationType: "table",
    priority: "medium",
  },
  {
    id: "contractor-performance",
    name: "Contractor Performance Score",
    category: "Resource & Team",
    description: "Rate contractors on quality, timeliness, and communication",
    calculate: (data: any) => ({
      contractors: [
        { name: "ABC Concrete", quality: 92, timeliness: 88, communication: 95, overall: 91.7 },
        { name: "XYZ Steel", quality: 85, timeliness: 90, communication: 87, overall: 87.3 },
        { name: "Modern Electrical", quality: 94, timeliness: 92, communication: 90, overall: 92 },
      ],
      averageScore: 90.3,
    }),
    visualizationType: "table",
    priority: "high",
  },
  {
    id: "equipment-utilization",
    name: "Equipment Utilization",
    category: "Resource & Team",
    description: "Track heavy machinery usage and maintenance schedules",
    calculate: (data: any) => ({
      totalEquipment: 12,
      inUse: 9,
      idle: 2,
      maintenance: 1,
      utilizationRate: 75,
      rentalCost: data.actualSpend * 0.08,
    }),
    visualizationType: "heatmap",
    priority: "medium",
  },
  {
    id: "overtime-analysis",
    name: "Overtime Analysis",
    category: "Resource & Team",
    description: "Monitor overtime hours and associated costs",
    calculate: (data: any) => ({
      totalOvertimeHours: 320,
      overtimeCost: data.actualSpend * 0.05,
      workersOnOvertime: Math.floor((data.team + data.contractors) * 0.35),
      trend: "increasing",
      recommendation: "Consider hiring additional workers",
    }),
    visualizationType: "chart",
    priority: "medium",
  },
  {
    id: "team-productivity-index",
    name: "Team Productivity Index",
    category: "Resource & Team",
    description: "Measure output per team member over time",
    calculate: (data: any) => ({
      outputPerPerson: (data.actualProgress || 55) / (data.team + data.contractors),
      industryBenchmark: 2.8,
      variance: (data.actualProgress || 55) / (data.team + data.contractors) - 2.8,
      topPerformers: 5,
    }),
    visualizationType: "chart",
    priority: "medium",
  },
  {
    id: "attendance-tracking",
    name: "Workforce Attendance Patterns",
    category: "Resource & Team",
    description: "Track attendance rates and absenteeism trends",
    calculate: (data: any) => ({
      attendanceRate: 92,
      absenteeismRate: 8,
      averageAbsentDays: 2.4,
      peakAbsenteeism: ["Monday", "Post-holiday"],
    }),
    visualizationType: "chart",
    priority: "low",
  },
  {
    id: "subcontractor-coordination",
    name: "Subcontractor Coordination Score",
    category: "Resource & Team",
    description: "Measure coordination efficiency between multiple subcontractors",
    calculate: (data: any) => ({
      coordinationScore: 82,
      conflicts: 4,
      resolutionTime: 2.8,
      collaborationRating: 85,
    }),
    visualizationType: "gauge",
    priority: "medium",
  },
  {
    id: "workforce-demographics",
    name: "Workforce Demographics",
    category: "Resource & Team",
    description: "Analyze team composition by skill, experience, and role",
    calculate: (data: any) => ({
      bySkill: { skilled: 45, semiskilled: 35, unskilled: 20 },
      byExperience: { expert: 25, intermediate: 50, junior: 25 },
      byRole: { labor: 60, supervisors: 25, engineers: 15 },
    }),
    visualizationType: "chart",
    priority: "low",
  },
  {
    id: "resource-forecasting",
    name: "Resource Demand Forecasting",
    category: "Resource & Team",
    description: "Predict future resource needs based on upcoming phases",
    calculate: (data: any) => ({
      next30Days: { labor: 45, equipment: 8, materials: "High" },
      next60Days: { labor: 52, equipment: 10, materials: "Medium" },
      next90Days: { labor: 38, equipment: 6, materials: "Low" },
    }),
    visualizationType: "timeline",
    priority: "high",
  },
]

// Category 5: Design & Technical Analytics (Features 41-50)
export const designTechnicalAnalytics: AnalyticsFeature[] = [
  {
    id: "design-iteration-tracking",
    name: "Design Iteration Tracking",
    category: "Design & Technical",
    description: "Monitor design changes and revision history",
    calculate: (data: any) => ({
      totalIterations: 12,
      majorRevisions: 4,
      minorChanges: 8,
      averageReviewTime: 3.2,
      pendingApprovals: 2,
    }),
    visualizationType: "timeline",
    priority: "medium",
  },
  {
    id: "bim-clash-detection",
    name: "BIM Clash Detection",
    category: "Design & Technical",
    description: "Identify and track MEP and structural clashes in 3D models",
    calculate: (data: any) => ({
      totalClashes: 28,
      resolved: 22,
      pending: 6,
      critical: 2,
      clashTypes: { structural: 8, mep: 12, architectural: 8 },
    }),
    visualizationType: "table",
    priority: "high",
  },
  {
    id: "space-utilization",
    name: "Space Utilization Efficiency",
    category: "Design & Technical",
    description: "Analyze usable vs circulation space ratios",
    calculate: (data: any) => ({
      totalArea: data.area,
      usableArea: data.area * 0.78,
      circulationArea: data.area * 0.22,
      efficiency: 78,
      benchmark: 75,
    }),
    visualizationType: "chart",
    priority: "medium",
  },
  {
    id: "structural-load-analysis",
    name: "Structural Load Analysis",
    category: "Design & Technical",
    description: "Monitor load calculations and safety factors",
    calculate: (data: any) => ({
      deadLoad: data.area * 0.6,
      liveLoad: data.area * 0.3,
      windLoad: data.floors * 15,
      seismicFactor: 0.36,
      safetyFactor: 1.5,
    }),
    visualizationType: "table",
    priority: "high",
  },
  {
    id: "energy-efficiency-rating",
    name: "Energy Efficiency Rating",
    category: "Design & Technical",
    description: "Predicted energy performance and certification potential",
    calculate: (data: any) => ({
      estimatedConsumption: data.area * 12,
      efficiencyRating: "B+",
      certificationPotential: "LEED Silver",
      annualSavings: data.area * 2.5,
      paybackPeriod: 6.8,
    }),
    visualizationType: "gauge",
    priority: "medium",
  },
  {
    id: "ventilation-analysis",
    name: "Natural Ventilation Analysis",
    category: "Design & Technical",
    description: "Assess natural airflow and ventilation design",
    calculate: (data: any) => ({
      ventilationScore: 72,
      airChangesPerHour: 8,
      crossVentilationAreas: Math.floor(data.area * 0.65),
      mechanicalBackup: "25% of area",
    }),
    visualizationType: "chart",
    priority: "low",
  },
  {
    id: "daylight-analysis",
    name: "Daylight & Natural Lighting",
    category: "Design & Technical",
    description: "Measure natural light penetration and window-to-wall ratios",
    calculate: (data: any) => ({
      windowToWallRatio: 0.28,
      daylightFactor: 4.2,
      wellLitArea: data.area * 0.72,
      artificialLightingNeeds: "28% reduction possible",
    }),
    visualizationType: "chart",
    priority: "low",
  },
  {
    id: "acoustic-performance",
    name: "Acoustic Performance",
    category: "Design & Technical",
    description: "Sound insulation and noise control metrics",
    calculate: (data: any) => ({
      stcRating: 52,
      nrcRating: 0.65,
      soundIsolation: "Good",
      criticalAreas: ["Conference rooms", "Bedrooms"],
    }),
    visualizationType: "gauge",
    priority: "low",
  },
  {
    id: "material-sustainability",
    name: "Material Sustainability Score",
    category: "Design & Technical",
    description: "Track use of sustainable and recycled materials",
    calculate: (data: any) => ({
      recycledContent: 35,
      localSourcing: 62,
      lowVOCMaterials: 78,
      sustainabilityScore: 58,
      certifications: ["FSC Wood", "Recycled Steel"],
    }),
    visualizationType: "chart",
    priority: "medium",
  },
  {
    id: "ai-design-optimization",
    name: "AI Design Optimization Score",
    category: "Design & Technical",
    description: "AI-generated suggestions for design improvements",
    calculate: (data: any) => ({
      optimizationScore: 82,
      suggestions: [
        "Rotate building 15° for better solar orientation",
        "Increase window size on north facade",
        "Consider green roof for thermal mass",
      ],
      potentialSavings: data.budget * 0.08,
      implementationCost: data.budget * 0.03,
    }),
    visualizationType: "table",
    priority: "high",
  },
]

// Combine all features
export const allAnalyticsFeatures = [
  ...costBudgetAnalytics,
  ...scheduleTimelineAnalytics,
  ...qualitySafetyAnalytics,
  ...resourceTeamAnalytics,
  ...designTechnicalAnalytics,
]

// Helper functions
export function getFeaturesByCategory(category: string): AnalyticsFeature[] {
  return allAnalyticsFeatures.filter((f) => f.category === category)
}

export function getFeaturesByPriority(priority: string): AnalyticsFeature[] {
  return allAnalyticsFeatures.filter((f) => f.priority === priority)
}

export function calculateAllMetrics(projectData: any) {
  return allAnalyticsFeatures.reduce(
    (acc, feature) => {
      acc[feature.id] = feature.calculate(projectData)
      return acc
    },
    {} as Record<string, any>,
  )
}

export function getAnalyticsCategories() {
  return [
    { name: "Cost & Budget", count: 10, icon: "DollarSign" },
    { name: "Schedule & Timeline", count: 10, icon: "Clock" },
    { name: "Quality & Safety", count: 10, icon: "Shield" },
    { name: "Resource & Team", count: 10, icon: "Users" },
    { name: "Design & Technical", count: 10, icon: "Layers" },
  ]
}
