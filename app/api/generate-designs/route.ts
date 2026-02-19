import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 60

const ENABLE_REAL_AI = process.env.ENABLE_REAL_AI === "true"

const PROJECT_CONTEXTS = {
  residential: {
    spaces: ["living room", "kitchen", "master bedroom", "bathroom", "dining room", "home office", "guest room"],
    buildingType: "residential home",
    focusAreas: "family living, privacy, and comfort",
    typicalFeatures: ["open floor plans", "natural lighting", "storage solutions", "outdoor living spaces"],
  },
  commercial: {
    spaces: ["reception", "open office", "conference room", "break room", "lobby", "storage"],
    buildingType: "commercial office building",
    focusAreas: "productivity, collaboration, and professional environment",
    typicalFeatures: ["flexible workspaces", "meeting rooms", "modern amenities", "accessibility"],
  },
  transport: {
    spaces: [
      "ticket hall",
      "platform",
      "waiting area",
      "concourse",
      "retail zone",
      "control room",
      "security checkpoint",
    ],
    buildingType: "transport facility (station/terminal/depot)",
    focusAreas: "passenger flow, accessibility, and wayfinding",
    typicalFeatures: [
      "clear circulation paths",
      "passenger information systems",
      "accessibility features",
      "retail integration",
    ],
  },
  airport: {
    spaces: [
      "terminal hall",
      "check-in area",
      "security zone",
      "departure lounge",
      "baggage claim",
      "retail area",
      "customs",
    ],
    buildingType: "airport terminal",
    focusAreas: "passenger processing, security, and efficient circulation",
    typicalFeatures: ["large span structures", "baggage handling", "security screening", "retail and dining"],
  },
  education: {
    spaces: [
      "classrooms",
      "laboratories",
      "library",
      "auditorium",
      "cafeteria",
      "administrative offices",
      "sports facilities",
    ],
    buildingType: "educational institution",
    focusAreas: "learning environments, safety, and accessibility",
    typicalFeatures: [
      "flexible learning spaces",
      "technology integration",
      "outdoor learning areas",
      "safety features",
    ],
  },
  hospitality: {
    spaces: ["lobby", "guest rooms", "restaurant", "conference halls", "spa", "fitness center", "pool area"],
    buildingType: "hotel or resort",
    focusAreas: "guest experience, comfort, and luxury",
    typicalFeatures: ["premium finishes", "guest amenities", "dining facilities", "event spaces"],
  },
  institutional: {
    spaces: ["entrance hall", "offices", "meeting rooms", "public areas", "archives", "auditorium"],
    buildingType: "institutional building",
    focusAreas: "public service, accessibility, and dignity",
    typicalFeatures: ["formal architecture", "public accessibility", "security", "durability"],
  },
  industrial: {
    spaces: ["production floor", "warehouse", "loading docks", "offices", "quality control", "utilities"],
    buildingType: "industrial facility",
    focusAreas: "operational efficiency, safety, and logistics",
    typicalFeatures: ["large clear spans", "heavy-duty infrastructure", "material handling", "safety systems"],
  },
  dam: {
    spaces: ["control room", "powerhouse", "spillway", "maintenance areas", "observation deck"],
    buildingType: "dam and hydroelectric facility",
    focusAreas: "structural integrity, water management, and power generation",
    typicalFeatures: [
      "massive concrete structures",
      "water control systems",
      "power generation equipment",
      "monitoring systems",
    ],
  },
  playground: {
    spaces: ["play areas", "sports courts", "pavilions", "restrooms", "equipment storage", "seating areas"],
    buildingType: "recreational facility",
    focusAreas: "safety, accessibility, and community engagement",
    typicalFeatures: ["safe surfacing", "age-appropriate equipment", "shade structures", "accessibility"],
  },
  civic: {
    spaces: ["public halls", "council chambers", "offices", "public service areas", "archives", "courtrooms"],
    buildingType: "civic building",
    focusAreas: "public service, transparency, and accessibility",
    typicalFeatures: ["formal architecture", "public spaces", "security", "accessibility"],
  },
} as const

type ProjectCategory = keyof typeof PROJECT_CONTEXTS

export async function POST(req: Request) {
  try {
    const { projectData, options } = await req.json()
    const providers: string[] = options?.providers?.length
      ? options.providers
      : ["openai/gpt-5-mini", "anthropic/claude-sonnet-4.5", "xai/grok-4-fast"]

    const variantsPerProvider = Math.min(Math.max(options?.variantsPerProvider ?? 4, 1), 4)

    const normalizedProviders = Array.isArray(options?.providers) ? options.providers.filter(Boolean) : providers
    if (!normalizedProviders || normalizedProviders.length === 0) {
      const fallbacks = buildFallbackVariants(projectData, 4)
      const first = fallbacks[0]
      return Response.json({
        designs: {
          variants: fallbacks,
          architectural: first.categories.architectural,
          structural: first.categories.structural,
          plumbing: first.categories.plumbing,
          electrical: first.categories.electrical,
          interior: first.categories.interior,
          exterior: first.categories.exterior,
          estimatedCost: first.estimatedCost,
          timeline: first.timeline,
        },
      })
    }

    if (!ENABLE_REAL_AI) {
      const fallbacks = buildFallbackVariants(projectData, 4)
      const first = fallbacks[0]
      return Response.json({
        designs: {
          variants: fallbacks,
          architectural: first.categories.architectural,
          structural: first.categories.structural,
          plumbing: first.categories.plumbing,
          electrical: first.categories.electrical,
          interior: first.categories.interior,
          exterior: first.categories.exterior,
          estimatedCost: first.estimatedCost,
          timeline: first.timeline,
        },
      })
    }

    const tasks: Promise<any>[] = []
    for (const model of normalizedProviders) {
      for (let i = 0; i < variantsPerProvider; i++) {
        tasks.push(generateVariant(projectData, model, i + 1))
      }
    }

    let variants: any[] = []
    try {
      variants = await Promise.all(tasks)
    } catch (e) {
      console.warn("[v0] AI provider(s) failed, using mock variants.", e)
      variants = buildFallbackVariants(projectData, 4)
    }

    if (!variants || variants.length === 0) {
      variants = buildFallbackVariants(projectData, 4)
    }

    const first = variants[0]
    return Response.json({
      designs: {
        variants,
        architectural: first.categories.architectural,
        structural: first.categories.structural,
        plumbing: first.categories.plumbing,
        electrical: first.categories.electrical,
        interior: first.categories.interior,
        exterior: first.categories.exterior,
        estimatedCost: first.estimatedCost,
        timeline: first.timeline,
      },
    })
  } catch (error) {
    console.error("Error generating designs with AI:", error)
    const { projectData } = await req.json().catch(() => ({ projectData: {} }))

    const styles = ["Modern Scandinavian", "Neo-classical", "Tropical Minimal", "Industrial Loft"]
    const fallbacks = styles.map((style, i) => {
      const base = generateMockDesigns(projectData || {}, style)
      return {
        id: `fallback-${i + 1}`,
        provider: "mock",
        model: "mock",
        variant: i + 1,
        categories: base,
        estimatedCost: base.estimatedCost,
        timeline: base.timeline,
      }
    })

    const first = fallbacks[0]
    return Response.json({
      designs: {
        variants: fallbacks,
        architectural: first.categories.architectural,
        structural: first.categories.structural,
        plumbing: first.categories.plumbing,
        electrical: first.categories.electrical,
        interior: first.categories.interior,
        exterior: first.categories.exterior,
        estimatedCost: first.estimatedCost,
        timeline: first.timeline,
      },
    })
  }
}

const VariantSchema = z.object({
  style: z
    .string()
    .describe("A clear design style label, e.g. 'Modern Scandinavian', 'Tropical Minimal', 'Neo-classical'."),
  projectTypeSpecificSpaces: z
    .array(z.string())
    .min(3)
    .max(8)
    .describe("List spaces specific to this project type (e.g., platforms for transport, classrooms for education)"),
  architecturalFeatures: z.array(z.string()).min(4).max(8),
  structuralNotes: z.array(z.string()).min(3).max(6),
  interiorPalette: z.array(z.string()).min(4).max(6),
  interiorMaterials: z.array(z.string()).min(4).max(6),
  exteriorMaterials: z.array(z.string()).min(4).max(6),
  outdoorFeatures: z.array(z.string()).min(3).max(6),
  interiorPrimaryRoom: z
    .string()
    .optional()
    .describe("Pick the main interior space to visualize for this variant from the project-specific spaces."),
  exteriorTimeOfDay: z
    .enum(["day", "golden hour", "dusk", "night"])
    .optional()
    .describe("Exterior time-of-day to diversify renders."),
  exteriorAngle: z
    .enum(["street level", "eye level", "three-quarter", "aerial"])
    .optional()
    .describe("Camera angle to diversify exterior visuals."),
  planConcept: z
    .string()
    .optional()
    .describe("Short concept for the floor plan (e.g., 'courtyard core', 'split-level', 'atrium spine')."),
})

async function generateVariant(projectData: any, model: string, variantIndex: number) {
  const projectCategory = (projectData.type || "residential") as ProjectCategory
  const context = PROJECT_CONTEXTS[projectCategory] || PROJECT_CONTEXTS.residential

  let override: z.infer<typeof VariantSchema> | null = null
  try {
    if (ENABLE_REAL_AI) {
      const { object } = await generateObject({
        model,
        schema: VariantSchema,
        maxOutputTokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  `You are an expert AEC (Architecture, Engineering, Construction) designer specializing in ${projectCategory} projects.\n\n` +
                  `PROJECT TYPE CONTEXT:\n` +
                  `- Building Type: ${context.buildingType}\n` +
                  `- Focus Areas: ${context.focusAreas}\n` +
                  `- Typical Spaces: ${context.spaces.join(", ")}\n` +
                  `- Key Features: ${context.typicalFeatures.join(", ")}\n\n` +
                  `PROJECT DETAILS:\n` +
                  `- Location: ${projectData.location || "unspecified location"}\n` +
                  `- Budget: ${projectData.budget || "unknown"}\n` +
                  `- Size: ${projectData?.requirements?.size || "medium"}\n\n` +
                  `CRITICAL REQUIREMENTS:\n` +
                  `1. Generate features and layouts SPECIFICALLY for ${projectCategory} projects\n` +
                  `2. Use spaces from the project type context (${context.spaces.slice(0, 5).join(", ")}, etc.)\n` +
                  `3. DO NOT default to generic office or residential spaces unless that's the project type\n` +
                  `4. Prefer reinforced concrete (RCC) structural systems; avoid wood/timber explicitly\n` +
                  `5. Make this variant meaningfully different from others with distinct interiorPrimaryRoom, exteriorTimeOfDay, exteriorAngle, and planConcept\n\n` +
                  `Return strictly JSON for the given schema with project-type-appropriate content.`,
              },
            ],
          },
        ],
      })
      override = object
    }
  } catch (e) {
    console.warn("[v0] AI variant generation failed for model:", model, e)
  }

  const base = generateMockDesigns(projectData, override?.style, {
    interiorRoom: override?.interiorPrimaryRoom,
    exteriorTimeOfDay: override?.exteriorTimeOfDay,
    exteriorAngle: override?.exteriorAngle,
    planConcept: override?.planConcept,
    variantIndex,
    provider: providerFromModel(model),
    projectTypeSpaces: override?.projectTypeSpecificSpaces,
  })

  return {
    id: `${providerFromModel(model)}-${variantIndex}`,
    provider: providerFromModel(model),
    model,
    variant: variantIndex,
    categories: base,
    estimatedCost: base.estimatedCost,
    timeline: base.timeline,
  }
}

function providerFromModel(model: string) {
  if (model.startsWith("openai/")) return "openai"
  if (model.startsWith("anthropic/")) return "anthropic"
  if (model.startsWith("xai/")) return "xai"
  if (model.startsWith("gpt-")) return "openai"
  return "ai"
}

function pickResidentialRooms() {
  return ["Living Room", "Master Bedroom", "Bathroom", "Kitchen", "Dining", "Garden/Patio"]
}

function buildAnglesSet() {
  return [
    { angle: "eye level", timeOfDay: "day" as const },
    { angle: "three-quarter", timeOfDay: "golden hour" as const },
    { angle: "aerial", timeOfDay: "dusk" as const },
  ]
}

function generateMockDesigns(
  projectData: any,
  styleOverride?: string,
  opts?: {
    interiorRoom?: string
    exteriorTimeOfDay?: "day" | "golden hour" | "dusk" | "night"
    exteriorAngle?: "street level" | "eye level" | "three-quarter" | "aerial"
    planConcept?: string
    variantIndex?: number
    provider?: string
    projectTypeSpaces?: string[]
  },
) {
  const projectCategory = (projectData.type || "residential") as ProjectCategory
  const context = PROJECT_CONTEXTS[projectCategory] || PROJECT_CONTEXTS.residential

  const budgetNum = Number.parseInt((projectData.budget || "").toString().replace(/[^0-9]/g, "")) || 100000
  const projectStyle = styleOverride || projectData.style || "modern"
  const projectSize = projectData.size || projectData?.requirements?.size || "medium"
  const features = (projectData?.requirements?.features || []) as string[]
  const materialsPref = "reinforced concrete (RCC), cement, stone, steel; no wood or timber"

  const variantIndex = opts?.variantIndex ?? 1
  const variantLabel = ["Option A", "Option B", "Option C", "Option D"][(variantIndex - 1) % 4]
  const timeOfDay = opts?.exteriorTimeOfDay || (["day", "golden hour", "dusk", "night"][(variantIndex - 1) % 4] as any)
  const angle =
    opts?.exteriorAngle || (["street level", "eye level", "three-quarter", "aerial"][(variantIndex - 1) % 4] as any)

  const primarySpaces = opts?.projectTypeSpaces || context.spaces
  const interiorRoom = opts?.interiorRoom || primarySpaces[(variantIndex - 1) % primarySpaces.length]

  const baseTimestamp = Date.now()
  const variantSeed = variantIndex * 1000
  const projectHash = (projectData.name || projectData.location || "project")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Generate unique seeds for each image category
  const seeds = {
    floorPlan: baseTimestamp + variantSeed + projectHash + 1,
    rendering: baseTimestamp + variantSeed + projectHash + 2,
    structuralLayout: baseTimestamp + variantSeed + projectHash + 3,
    structuralDetail: baseTimestamp + variantSeed + projectHash + 4,
    plumbingLayout: baseTimestamp + variantSeed + projectHash + 5,
    plumbingIsometric: baseTimestamp + variantSeed + projectHash + 6,
    electricalLayout: baseTimestamp + variantSeed + projectHash + 7,
    electricalSingleLine: baseTimestamp + variantSeed + projectHash + 8,
    interiorRendering: baseTimestamp + variantSeed + projectHash + 9,
    interiorMoodBoard: baseTimestamp + variantSeed + projectHash + 10,
    exteriorRendering: baseTimestamp + variantSeed + projectHash + 11,
    landscaping: baseTimestamp + variantSeed + projectHash + 12,
    // new seeds for galleries
    galleryBase: baseTimestamp + variantSeed + projectHash + 1000,
  }

  // Helper function to create unique, contextual image URLs
  const createImageUrl = (prompt: string, seed: number, width = 1200, height = 900) => {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=flux`
  }

  const interiorRooms =
    projectCategory === "residential"
      ? pickResidentialRooms()
      : (Array.from(new Set([...(opts?.projectTypeSpaces || context.spaces)].slice(0, 6))) as string[])

  const interiorAngles = buildAnglesSet()
  const interiorRoomViews = interiorRooms.flatMap((room, i) => {
    return interiorAngles.map((cfg, j) => {
      const seed = seeds.galleryBase + i * 10 + j
      const image = createImageUrl(
        `photorealistic interior rendering ${context.buildingType} ${room} ${projectStyle} style furniture lighting decor professional visualization materials emphasis: concrete, cement plaster, stone, tile; avoid wood/timber surfaces; camera angle: ${cfg.angle}; time of day: ${cfg.timeOfDay}; ${projectData.location} variant ${variantIndex} ${variantLabel}`,
        seed,
      )
      return { room, angle: cfg.angle, timeOfDay: cfg.timeOfDay, image }
    })
  })

  const exteriorAngles: Array<"street level" | "eye level" | "three-quarter" | "aerial"> = [
    "street level",
    "eye level",
    "three-quarter",
    "aerial",
  ]
  const exteriorTimes: Array<"day" | "golden hour" | "dusk" | "night"> = ["day", "golden hour", "dusk", "night"]
  const exteriorAngleViews = exteriorAngles.flatMap((ang, i) =>
    exteriorTimes.map((tod, j) => {
      const seed = seeds.galleryBase + 200 + i * 10 + j
      const image = createImageUrl(
        `photorealistic exterior rendering ${context.buildingType} ${projectStyle} architecture facade landscaping ${projectData.location} camera angle: ${ang}, ${tod} lighting, RCC reinforced concrete, cladding: fiber-cement, stone, stucco; avoid wood; professional visualization ${variantLabel} variant ${variantIndex}`,
        seed,
      )
      return { angle: ang, timeOfDay: tod, image }
    }),
  )

  return {
    architectural: {
      floorPlanImage: createImageUrl(
        `detailed architectural floor plan blueprint ${context.buildingType} ${projectStyle} style ${projectSize} size top view technical drawing with dimensions room labels ${projectData.location} ${variantLabel} plan concept: ${opts?.planConcept || "functional flow"} spaces: ${primarySpaces.slice(0, 6).join(", ")} features: ${(features || []).slice(0, 6).join(", ")} materials: concrete cement RCC no wood variant ${variantIndex}`,
        seeds.floorPlan,
      ),
      floorPlan:
        `${variantLabel}: ` +
        `${context.buildingType} design guided by "${opts?.planConcept || "efficient circulation"}". ` +
        `Main entrance leads to ${primarySpaces[0]}; layout adapted for ${projectData.location} climate and ${projectSize} footprint with focus on ${context.focusAreas}.`,
      layout:
        `${variantLabel} layout emphasizing ${context.typicalFeatures.slice(0, 3).join(", ")}. ` +
        `Circulation prioritizes ${context.focusAreas} with spaces including ${primarySpaces.slice(0, 4).join(", ")}.`,
      renderingImage: createImageUrl(
        `photorealistic 3D architectural rendering ${context.buildingType} ${projectStyle} architecture exterior view ${angle}, ${timeOfDay} lighting, ${projectData.location} professional visualization primary structure: RCC reinforced concrete, materials: concrete, cement steel; avoid wood and timber; features: ${(features || []).slice(0, 6).join(", ")} ${variantLabel} variant ${variantIndex}`,
        seeds.rendering,
      ),
      dimensions: {
        totalArea: projectCategory === "residential" ? 2400 : projectCategory === "transport" ? 8000 : 4500,
        rooms: generateRoomsForProjectType(projectCategory, primarySpaces),
      },
      features: context.typicalFeatures
        .concat([
          "High ceilings for spacious feel",
          "Natural lighting throughout",
          "Energy-efficient design",
          "Accessibility features",
        ])
        .slice(0, 6),
    },
    structural: {
      layoutImage: createImageUrl(
        `structural engineering layout diagram ${context.buildingType} foundation beams columns load bearing walls RCC reinforced concrete frame technical blueprint cross section ${variantLabel} ${projectStyle} style variant ${variantIndex}`,
        seeds.structuralLayout,
      ),
      foundation: `Reinforced concrete (RCC) foundation system designed for ${context.buildingType}. Adapted for ${projectData.location} soil conditions with proper drainage and load distribution.`,
      framework: `Reinforced concrete (RCC) frame with columns, beams, and slabs optimized for ${context.buildingType}. Structural system designed to support ${context.focusAreas}.`,
      detailImage: createImageUrl(
        `structural detail diagram reinforced concrete (RCC) frame construction technical drawing cross section showing rebar, connections, shear reinforcement, slab-column joints ${variantLabel} ${context.buildingType} variant ${variantIndex}`,
        seeds.structuralDetail,
      ),
      materials: [
        "Reinforced concrete columns and beams (RCC)",
        "Reinforced concrete slabs",
        "Concrete grade M25–M35 depending on loads",
        "Steel reinforcement Fe500/Fe550",
        "Concrete block or AAC infill (non-structural)",
      ],
      loadBearing: ["RCC column grid", "RCC beams", "Shear walls (as needed)", "Stair and lift cores (RCC)"],
      specifications: `Designed to IS/ACI/Eurocode standards for ${context.buildingType}. Wind and seismic as per local zone; durability provisions for RCC (cover, admixtures).`,
    },
    plumbing: {
      layoutImage: createImageUrl(
        `plumbing system layout diagram ${context.buildingType} water supply lines drainage pipes fixtures isometric view technical blueprint ${variantLabel} ${projectStyle} style variant ${variantIndex}`,
        seeds.plumbingLayout,
      ),
      waterSupply: `Main water line with pressure regulator designed for ${context.buildingType}. Hot water system with ${projectCategory === "residential" ? "50-gallon tank heater" : "commercial water heaters"
        } for efficiency.`,
      drainage: `PVC drainage system with proper venting for ${context.buildingType}. Main drain line with cleanouts at strategic locations. Greywater and blackwater separated for potential recycling.`,
      isometricImage: createImageUrl(
        `plumbing isometric 3D diagram water supply drainage system pipes valves fixtures technical illustration ${context.buildingType} ${variantLabel} ${projectStyle} style variant ${variantIndex}`,
        seeds.plumbingIsometric,
      ),
      fixtures: generateFixturesForProjectType(projectCategory, primarySpaces),
      pipingLayout: `Centralized plumbing core for efficiency in ${context.buildingType}. PEX piping for hot/cold water distribution. Copper piping for main lines. All pipes insulated.`,
      specifications: `Low-flow fixtures for water conservation. Pressure-balanced valves for safety. All plumbing meets IPC standards for ${context.buildingType}.`,
    },
    electrical: {
      layoutImage: createImageUrl(
        `electrical system layout diagram ${context.buildingType} circuits outlets switches lighting panel wiring schematic technical blueprint ${variantLabel} ${projectStyle} style variant ${variantIndex}`,
        seeds.electricalLayout,
      ),
      mainPanel: `${projectCategory === "residential" ? "200" : "400"}-amp main service panel with ${projectCategory === "residential" ? "30" : "60"} circuit capacity for ${context.buildingType}. AFCI/GFCI protection included.`,
      singleLineImage: createImageUrl(
        `electrical single line diagram power distribution panel circuits breakers technical drawing schematic ${context.buildingType} ${variantLabel} ${projectStyle} style variant ${variantIndex}`,
        seeds.electricalSingleLine,
      ),
      circuits: generateCircuitsForProjectType(projectCategory, primarySpaces),
      lighting: `LED lighting throughout for energy efficiency in ${context.buildingType}. Lighting design optimized for ${context.focusAreas}. Motion sensors in appropriate areas.`,
      specifications: `All wiring 12/2 and 14/2 Romex with ground. Smart controls included. Emergency lighting and exit signs as required for ${context.buildingType}.`,
    },
    interior: {
      renderingImage: createImageUrl(
        `photorealistic interior design rendering ${context.buildingType} ${interiorRoom} ${projectStyle} style furniture lighting decor professional visualization materials emphasis: concrete, cement plaster, stone, tile; avoid wood/timber surfaces; features: ${(features || []).slice(0, 6).join(", ")} ${variantLabel} variant ${variantIndex}`,
        seeds.interiorRendering,
      ),
      style: `${projectStyle} design appropriate for ${context.buildingType} with mineral finishes`,
      moodBoardImage: createImageUrl(
        `interior design mood board ${projectStyle} style color palette mineral materials concrete, cement plaster, terrazzo, stone; no wood; inspiration collage for ${context.buildingType} ${interiorRoom} ${variantLabel} variant ${variantIndex}`,
        seeds.interiorMoodBoard,
      ),
      colorPalette:
        projectCategory === "residential"
          ? ["Warm White (#F5F5F0)", "Cool Gray (#9EA3A8)", "Charcoal (#2E2E2E)", "Sage Green (#87A96B)"]
          : projectCategory === "transport"
            ? ["Clean White (#FFFFFF)", "Transit Blue (#0066CC)", "Safety Yellow (#FFD700)", "Concrete Gray (#7A7A7A)"]
            : ["Clean White (#FFFFFF)", "Graphite (#3A3A3A)", "Accent Blue (#3B82F6)", "Concrete Gray (#7A7A7A)"],
      materials: [
        "Polished concrete or vitrified tile flooring",
        "Porcelain tile in wet areas",
        "Quartz/Stone countertops",
        "Cement plaster/drywall smooth finish",
        "Modular furniture systems (laminate/metal)",
      ],
      furniture: generateFurnitureForProjectType(projectCategory, primarySpaces),
      lighting: `Layered lighting design with ambient, task, and accent lighting for ${context.buildingType}. Smart lighting controls for energy management. Natural light maximized through window placement.`,
      features: context.typicalFeatures
        .concat([
          "Built-in storage solutions",
          "Technology integration",
          "Acoustic treatment",
          "Accessibility features",
        ])
        .slice(0, 6),
      roomViews: interiorRoomViews,
    },
    exterior: {
      renderingImage: createImageUrl(
        `photorealistic exterior rendering ${context.buildingType} ${projectStyle} architecture facade landscaping ${projectData.location} ${angle}, ${timeOfDay} lighting, professional visualization primary structure: RCC reinforced concrete, cladding: fiber-cement panels, stone, stucco; avoid wood; features: ${(features || []).slice(0, 6).join(", ")} ${variantLabel} variant ${variantIndex}`,
        seeds.exteriorRendering,
      ),
      facade: `Modern RCC-based facade for ${context.buildingType} with fiber-cement or stone accents; large energy-efficient glazing; covered entry designed for ${context.focusAreas}.`,
      landscapingImage: createImageUrl(
        `landscaping site plan ${context.buildingType} design outdoor spaces plants trees pathways top view technical drawing ${variantLabel} ${projectStyle} style variant ${variantIndex}`,
        seeds.landscaping,
      ),
      roofing: `Reinforced concrete slab roof with waterproofing and insulation appropriate for ${context.buildingType}; proper drainage system.`,
      landscaping: `Professional landscape design with native plants for ${projectData.location} climate, optimized for ${context.buildingType}.`,
      outdoor: generateOutdoorFeaturesForProjectType(projectCategory),
      materials: [
        "Reinforced concrete (RCC) primary structure",
        "Fiber cement panels / stucco finish",
        "Stone cladding accents",
        "Curtain wall glazing system",
        "Concrete walkways and patios",
      ],
      angleViews: exteriorAngleViews,
    },
    estimatedCost: {
      construction: Math.round(budgetNum * 0.5),
      materials: Math.round(budgetNum * 0.3),
      labor: Math.round(budgetNum * 0.15),
      total: budgetNum,
    },
    timeline: {
      design: "4-6 weeks for complete design development and documentation",
      permits: "6-8 weeks for permit approval and inspections",
      construction:
        projectCategory === "residential"
          ? "6-9 months for complete construction"
          : projectCategory === "transport" || projectCategory === "airport"
            ? "18-24 months for complete construction"
            : "9-12 months for complete construction",
      total:
        projectCategory === "residential"
          ? "10-14 months from start to completion"
          : projectCategory === "transport" || projectCategory === "airport"
            ? "24-30 months from start to completion"
            : "14-18 months from start to completion",
    },
  }
}

function generateRoomsForProjectType(projectCategory: ProjectCategory, spaces: readonly string[]) {
  const baseRooms = spaces.slice(0, 6).map((space, idx) => ({
    name: space.charAt(0).toUpperCase() + space.slice(1),
    area: 200 + idx * 100,
    dimensions: `${10 + idx * 2}' x 20'`,
  }))
  return baseRooms
}

function generateFixturesForProjectType(projectCategory: ProjectCategory, spaces: readonly string[]) {
  if (projectCategory === "residential") {
    return [
      { room: "Master Bathroom", type: "Toilet, Sink, Shower, Bathtub", quantity: 4 },
      { room: "Bathroom 2", type: "Toilet, Sink, Shower", quantity: 3 },
      { room: "Kitchen", type: "Sink, Dishwasher connection", quantity: 2 },
    ]
  } else if (projectCategory === "transport" || projectCategory === "airport") {
    return [
      { room: "Public Restrooms (Multiple)", type: "Toilets, Sinks, Urinals", quantity: 40 },
      { room: "Staff Facilities", type: "Toilets, Sinks, Showers", quantity: 12 },
      { room: "Cleaning Stations", type: "Utility Sinks", quantity: 6 },
    ]
  } else {
    return [
      { room: "Restrooms (4)", type: "Toilets, Sinks, Urinals", quantity: 16 },
      { room: "Break Room", type: "Sink, Dishwasher", quantity: 2 },
      { room: "Janitor Closet", type: "Utility Sink", quantity: 1 },
    ]
  }
}

function generateCircuitsForProjectType(projectCategory: ProjectCategory, spaces: readonly string[]) {
  if (projectCategory === "residential") {
    return [
      { area: "Kitchen", load: "20A dedicated circuits (2)", outlets: 8 },
      { area: "Living Areas", load: "15A general lighting", outlets: 12 },
      { area: "Bedrooms", load: "15A general purpose", outlets: 10 },
    ]
  } else if (projectCategory === "transport" || projectCategory === "airport") {
    return [
      { area: "Public Areas", load: "20A circuits", outlets: 60 },
      { area: "Information Systems", load: "30A dedicated", outlets: 20 },
      { area: "Security Systems", load: "30A dedicated", outlets: 15 },
      { area: "HVAC System", load: "100A dedicated", outlets: 0 },
    ]
  } else {
    return [
      { area: "Office Spaces", load: "20A circuits", outlets: 40 },
      { area: "Reception", load: "15A lighting", outlets: 8 },
      { area: "HVAC System", load: "60A dedicated", outlets: 0 },
    ]
  }
}

function generateFurnitureForProjectType(projectCategory: ProjectCategory, spaces: readonly string[]) {
  if (projectCategory === "residential") {
    return [
      { room: "Living Room", items: ["Sectional sofa", "Coffee table", "TV console", "Accent chairs"] },
      { room: "Dining", items: ["Dining table (seats 6)", "Dining chairs", "Buffet cabinet"] },
      { room: "Master Bedroom", items: ["King bed", "Nightstands", "Dresser", "Reading chair"] },
    ]
  } else if (projectCategory === "transport") {
    return [
      { room: "Waiting Area", items: ["Bench seating", "Information displays", "Ticket machines", "Waste bins"] },
      { room: "Ticket Hall", items: ["Service counters", "Queue barriers", "Signage systems", "Seating"] },
      { room: "Control Room", items: ["Control desks", "Monitor arrays", "Ergonomic chairs", "Communication systems"] },
    ]
  } else if (projectCategory === "education") {
    return [
      { room: "Classrooms", items: ["Student desks", "Teacher desk", "Whiteboard", "Storage cabinets"] },
      { room: "Library", items: ["Bookshelves", "Reading tables", "Study carrels", "Computer stations"] },
      { room: "Cafeteria", items: ["Dining tables", "Chairs", "Serving counters", "Vending machines"] },
    ]
  } else {
    return [
      { room: "Reception", items: ["Reception desk", "Waiting chairs", "Coffee table", "Display shelving"] },
      { room: "Main Spaces", items: ["Workstations", "Task chairs", "Storage units", "Collaboration tables"] },
    ]
  }
}

function generateOutdoorFeaturesForProjectType(projectCategory: ProjectCategory) {
  if (projectCategory === "residential") {
    return ["Covered patio (RCC slab)", "Exterior lighting", "Boundary wall", "Driveway and walkways", "Garden beds"]
  } else if (projectCategory === "transport" || projectCategory === "airport") {
    return [
      "Covered drop-off zones",
      "Pedestrian walkways",
      "Parking facilities",
      "Landscaped areas",
      "Wayfinding signage",
      "Exterior lighting",
    ]
  } else if (projectCategory === "education") {
    return [
      "Outdoor learning spaces",
      "Sports facilities",
      "Playground areas",
      "Parking",
      "Landscaped courtyards",
      "Bike racks",
    ]
  } else {
    return ["Covered entrance", "Outdoor seating areas", "Parking", "Bike racks", "Exterior lighting", "Signage"]
  }
}

function buildFallbackVariants(projectData: any, count: number) {
  const styles = [
    "Modern Scandinavian",
    "Neo-classical",
    "Tropical Minimal",
    "Industrial Loft",
    "Mediterranean Contemporary",
    "Japandi",
    "Art Deco Revival",
    "Biophilic Modern",
  ]
  return Array.from({ length: Math.max(1, Math.min(count, 8)) }, (_, i) => {
    const base = generateMockDesigns(projectData || {}, styles[i % styles.length], {
      variantIndex: i + 1,
      provider: "mock",
    })
    return {
      id: `fallback-${i + 1}`,
      provider: "mock",
      model: "mock",
      variant: i + 1,
      categories: base,
      estimatedCost: base.estimatedCost,
      timeline: base.timeline,
    }
  })
}
