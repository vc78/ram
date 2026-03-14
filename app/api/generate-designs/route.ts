import { generateObject } from "ai"
import { z } from "zod"
import fs from "fs"
import path from "path"

// Dataset Support for pre-rendered specialized engineering assets
const USE_DATASET = process.env.USE_DATASET === "true"
let DATASET: Array<Record<string, any>> = []

function loadDataset() {
  try {
    const csvPath = path.join(process.cwd(), "data", "design_dataset.csv")
    if (fs.existsSync(csvPath)) {
      const csv = fs.readFileSync(csvPath, "utf-8")
      const lines = csv.trim().split("\n")
      const headers = lines.shift()?.split(",") || []
      DATASET = lines.map((l) => {
        const cols = l.split(",")
        const obj: any = {}
        headers.forEach((h, i) => {
          obj[h] = cols[i]?.replace(/^"|"$/g, "")
        })
        return obj
      })
    }
  } catch (e) {
    console.warn("Dataset load failed, falling back to dynamic generation", e)
    DATASET = []
  }
}

if (USE_DATASET) {
  loadDataset()
}

function pickDatasetImage(category?: string) {
  if (!DATASET.length) return null
  let pool = DATASET
  if (category) {
    pool = DATASET.filter((r) => r.category === category)
    if (pool.length === 0) pool = DATASET
  }
  const row = pool[Math.floor(Math.random() * pool.length)]
  return row?.image_url || null
}

export const maxDuration = 120 // Increased for heavy AI lifting

const ENABLE_REAL_AI = process.env.ENABLE_REAL_AI === "true"

// ADVANCED PROJECT CONTEXTS 
const PROJECT_CONTEXTS = {
  residential: {
    spaces: ["Living Hall", "Modular Kitchen", "Master Suite", "Pooja Room", "Balcony Garden", "Home Office"],
    buildingType: "Contemporary Residence",
    focusAreas: "Vastu Compliance, Natural Ventilation, Space Optimization",
    typicalFeatures: ["Double Height Ceiling", "Clerestory Windows", "Integrated Smart Home"],
  },
  commercial: {
    spaces: ["Lobby", "Open Workstation", "Executive Cabin", "Conference Hub", "Server Room", "Cafeteria"],
    buildingType: "Grade-A Office Space",
    focusAreas: "Employee Wellbeing, Scalability, Brand Identity",
    typicalFeatures: ["Raised Access Floors", "Acoustic Baffles", "Flexible Partitioning"],
  },
  industrial: {
    spaces: ["Production Floor", "Mezzanine Storage", "Quality Lab", "Loading Bay", "Worker Locker Room"],
    buildingType: "Modern Industrial Facility",
    focusAreas: "Logistics Flow, Heavy Load Capacity, Fire Safety",
    typicalFeatures: ["Large Span PeB Structure", "Epoxy Flooring", "Dock Levelers"],
  },
  airport: {
    spaces: ["Check-in Island", "Security Screening", "Duty Free Mall", "Boarding Gate Lounge", "VIP Terminal"],
    buildingType: "International Airport Terminal",
    focusAreas: "Passenger Experience, High Security, Efficient Transit",
    typicalFeatures: ["Steel Space Frame", "Baggage Handling System", "Solar Glazing"],
  },
  hospitality: {
    spaces: ["Grand Lobby", "Deluxe Suite", "Infinity Pool", "All-day Dining", "Wellness Spa"],
    buildingType: "Boutique Luxury Hotel",
    focusAreas: "Opulence, Service Efficiency, Guest Comfort",
    typicalFeatures: ["Signature Lighting", "Premium Stone Finishes", "Water Features"],
  },
} as const

type ProjectCategory = keyof typeof PROJECT_CONTEXTS

const VariantSchema = z.object({
  style: z.string().describe("Design style label, e.g. 'Neo-Modern', 'Zen-Minimalist', 'Industrial-Chic'"),
  architecturalFeatures: z.array(z.string()).min(5).max(10),
  structuralSpecifications: z.object({
    foundationType: z.string(),
    frameSystem: z.string(),
    materialUsageEfficiency: z.string(),
  }),
  mepIntelligence: z.object({
    hvacStrategy: z.string(),
    electricalOptimization: z.string(),
    waterconservation: z.string(),
  }),
  vastuScore: z.number().min(0).max(100).optional(),
  sustainabilityRating: z.string(),
  estimatedTimeline: z.object({
    designPhase: z.string(),
    constructionPhase: z.string(),
    handoverDate: z.string(),
  })
})

export async function POST(req: Request) {
  try {
    const { projectData, options } = await req.json()
    const category = (projectData.type || "residential") as ProjectCategory
    const context = PROJECT_CONTEXTS[category] || PROJECT_CONTEXTS.residential

    const variantCount = Math.min(options?.variantsPerProvider || 4, 4)
    
    // 1. Generate core intelligence for each variant
    const variants = []
    for (let i = 0; i < variantCount; i++) {
      const variantId = `variant-${i + 1}`
      
      // Mocked AI Logic for high-speed response (Can be swapped with real 'ai' package calls)
      const mockStyle = i === 0 ? "Neo-Modern" : i === 1 ? "Contemporary Tropical" : i === 2 ? "Industrial Loft" : "Zen Minimalist"
      
      const designData = {
        style: mockStyle,
        architecturalFeatures: [
          `${context.typicalFeatures[0]} integration`,
          "Maximum Floor Area Ratio (FAR) utilization",
          "Passive cooling facade design",
          "Universal accessibility compliance",
          "Interactive LED lighting zones"
        ],
        structuralSpecifications: {
          foundationType: "Raft Foundation with Anti-Termite Treatment",
          frameSystem: "RCC Moment Resisting Frame (Seismic Zone III compliant)",
          materialUsageEfficiency: "High (Low waste structural grid)"
        },
        mepIntelligence: {
          hvacStrategy: projectData.requirements?.hvac === "vrf" ? "Energy efficient VRF with heat recovery" : "High-COP Ducted Split System",
          electricalOptimization: "Automated Power Factor Correction & Smart Distribution",
          waterconservation: "Greywater recycling for landscaping & low-flow fixtures"
        },
        vastuScore: category === "residential" ? 85 + (i * 2) : undefined,
        sustainabilityRating: "LEED Gold equivalent / GRIHA 4-Star",
        estimatedTimeline: {
            designPhase: "45 Days",
            constructionPhase: "12 - 14 Months",
            handoverDate: "Q3 2026"
        }
      }

      const visualAssets = generateVisualAssets(projectData, designData, i + 1, category)
      
      variants.push({
        id: variantId,
        provider: "SIID-AI-Engine-v4",
        model: "Enterprise-AEC-Model",
        variant: i + 1,
        categories: visualAssets,
        ...designData
      })
    }

    return Response.json({
      designs: {
        variants,
        summary: {
          totalVariants: variants.length,
          bestVastu: variants.sort((a,b) => (b.vastuScore || 0) - (a.vastuScore || 0))[0].id,
          mostEfficient: variants[0].id
        }
      }
    })

  } catch (error: any) {
    console.error("AI Design Generation Failure:", error)
    return Response.json({ error: "Architecture engine failed to initialize visuals." }, { status: 500 })
  }
}

function generateVisualAssets(projectData: any, designData: any, index: number, category: ProjectCategory) {
  const seed = Date.now() + index
  const location = projectData.location || "India"
  const style = designData.style
  
  const createUrl = (prompt: string, s: number) => {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&seed=${s}&model=flux-realism`
  }

  return {
    architectural: {
      floorPlanImage: createUrl(`architectural technical floor plan blueprint ${category} building, high detail, 2D top view, professional cad drawing, white background, black lines, dimensions, labels, ${designData.style}`, seed + 1),
      renderingImage: createUrl(`photorealistic 3D architectural rendering of a ${designData.style} ${category} building in ${location}, golden hour lighting, cinematic, ultra-detailed facade, high-end materials: concrete, glass, metal`, seed + 2),
      description: `A ${designData.style} approach focusing on ${designData.architecturalFeatures.join(", ")}.`,
    },
    structural: {
      layoutImage: createUrl(`structural engineering diagram of RCC frame building, foundation, columns, beams, technical blueprint, 3D isometric view, professional white background`, seed + 3),
      specifications: designData.structuralSpecifications
    },
    mep: {
        layoutImage: createUrl(`MEP engineering layout diagram, plumbing and electrical conduits schematic, 3D visualization inside a ${category} building, colorful pipes and wires, technical`, seed + 4),
        details: designData.mepIntelligence
    },
    interior: {
      renderingImage: createUrl(`luxurious interior design rendering of a ${category} lobby/hall, ${designData.style} style, expensive furniture, ambient lighting, high quality materials: marble, wood, velvet`, seed + 5),
      moodBoardImage: createUrl(`interior design mood board for ${designData.style} style, materials swatches, color palette, fabric, stone, metal textures, professional presentation`, seed + 6)
    },
    exterior: {
        renderingImage: createUrl(`wide angle aerial view of a ${category} building site in ${location}, ${designData.style} architecture, beautiful landscaping, cars on road, people walking, photorealistic`, seed + 7)
    },
    estimatedCost: {
        total: projectData.budget || "₹1.4 Cr - ₹1.8 Cr",
        breakdown: "Civil: 45%, Finishing: 30%, MEP: 15%, Permits: 10%"
    },
    timeline: designData.estimatedTimeline
  }
}
