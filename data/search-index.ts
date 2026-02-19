export type SearchItem = {
  title: string
  link: string
  snippet: string
  category?: string
  tags?: string[]
}

export const searchIndex: SearchItem[] = [
  {
    title: "AI Design Generation",
    link: "/#features",
    snippet:
      "Generate architectural, structural, electrical, and plumbing designs instantly with AI. Customize every detail with smart recommendations and real-time previews.",
    category: "ai",
    tags: ["ai", "design", "architecture", "automation"],
  },
  {
    title: "Contractor Marketplace",
    link: "/dashboard/contractors",
    snippet:
      "Browse verified contractors, view ratings, portfolios, and hire directly without middlemen. Compare quotes and track project progress.",
    category: "contractors",
    tags: ["contractors", "marketplace", "hiring"],
  },
  {
    title: "Budget Estimator (INR)",
    link: "/#budget-estimator",
    snippet:
      "Smart estimator with material, labor, and contractor breakdowns in INR for transparent costs. Get accurate predictions based on real market data.",
    category: "budget",
    tags: ["budget", "estimator", "cost", "inr"],
  },
  {
    title: "Careers and Job Applications",
    link: "/dashboard/careers",
    snippet:
      "Explore open roles and apply with your resume. Hiring managers can approve or review applicants. Find your dream job in construction tech.",
    category: "careers",
    tags: ["careers", "jobs", "hiring", "employment"],
  },
  {
    title: "Project Management",
    link: "/dashboard",
    snippet:
      "Track tasks, messages, and team members with real-time updates across your projects. Gantt charts, milestones, and collaboration tools included.",
    category: "construction",
    tags: ["project", "management", "tasks", "collaboration"],
  },
  {
    title: "Get in Touch",
    link: "/contact",
    snippet:
      "Call 9032306961 or email venkatbodduluri78@gmail.com. Share a message via WhatsApp in one click. 24/7 support available.",
    category: "contact",
    tags: ["contact", "support", "phone", "email"],
  },
  {
    title: "Blog: Green Building Codes",
    link: "/blog",
    snippet:
      "Latest on green building codes, smart materials, and India construction trends. Stay updated with LEED certification requirements and sustainability practices.",
    category: "sustainability",
    tags: ["green", "sustainability", "building codes", "environment"],
  },
  {
    title: "Smart Materials Database",
    link: "/materials",
    snippet:
      "Explore our comprehensive database of construction materials with pricing, sustainability ratings, and supplier information across India.",
    category: "construction",
    tags: ["materials", "database", "suppliers", "pricing"],
  },
  {
    title: "BIM Integration Tools",
    link: "/tools/bim",
    snippet:
      "Seamlessly integrate with Building Information Modeling software. Import/export IFC files and collaborate with architects worldwide.",
    category: "ai",
    tags: ["bim", "integration", "modeling", "collaboration"],
  },
  {
    title: "Labor Cost Index 2024",
    link: "/reports/labor-cost",
    snippet:
      "Real-time labor cost indices across major Indian cities. Compare skilled and unskilled labor rates for accurate project budgeting.",
    category: "budget",
    tags: ["labor", "cost", "index", "wages"],
  },
  {
    title: "Structural Analysis AI",
    link: "/tools/structural",
    snippet:
      "AI-powered structural analysis for buildings up to 50 stories. Get load calculations, beam sizing, and foundation recommendations instantly.",
    category: "ai",
    tags: ["structural", "analysis", "engineering", "calculations"],
  },
  {
    title: "Permit Processing Guide",
    link: "/guides/permits",
    snippet:
      "Step-by-step guide for obtaining construction permits in India. Includes documentation checklists and estimated processing times by state.",
    category: "construction",
    tags: ["permits", "documentation", "legal", "compliance"],
  },
  {
    title: "Energy Efficiency Calculator",
    link: "/tools/energy",
    snippet:
      "Calculate energy consumption and savings for your building design. Get recommendations for solar panels, insulation, and HVAC optimization.",
    category: "sustainability",
    tags: ["energy", "efficiency", "solar", "green"],
  },
  {
    title: "Contractor Verification Process",
    link: "/contractors/verification",
    snippet:
      "Learn how we verify contractors through license checks, past project reviews, and customer feedback analysis for quality assurance.",
    category: "contractors",
    tags: ["verification", "quality", "trust", "reviews"],
  },
  {
    title: "Construction Trends 2024",
    link: "/blog/trends-2024",
    snippet:
      "Top construction trends including modular building, 3D printing, drone surveys, and AI-assisted design. Stay ahead of the industry curve.",
    category: "construction",
    tags: ["trends", "innovation", "technology", "2024"],
  },
  {
    title: "Training & Certifications",
    link: "/careers/training",
    snippet:
      "Access free training modules for construction professionals. Earn certifications in safety, project management, and sustainable building practices.",
    category: "careers",
    tags: ["training", "certification", "learning", "professional"],
  },
  {
    title: "Material Price Tracker",
    link: "/tools/price-tracker",
    snippet:
      "Track real-time prices of cement, steel, bricks, and other construction materials across Indian markets. Set alerts for price changes.",
    category: "budget",
    tags: ["prices", "materials", "tracking", "market"],
  },
  {
    title: "LEED Certification Guide",
    link: "/guides/leed",
    snippet:
      "Complete guide to achieving LEED certification for your building project. Includes point calculations and prerequisite checklists.",
    category: "sustainability",
    tags: ["leed", "certification", "green building", "standards"],
  },
  {
    title: "3D Visualization Studio",
    link: "/tools/3d-studio",
    snippet:
      "Create stunning 3D visualizations of your architectural designs. Virtual walkthroughs, material previews, and lighting simulations.",
    category: "ai",
    tags: ["3d", "visualization", "rendering", "virtual"],
  },
  {
    title: "Subcontractor Network",
    link: "/contractors/subcontractors",
    snippet:
      "Connect with specialized subcontractors for electrical, plumbing, HVAC, and finishing work. Verified professionals with guaranteed work.",
    category: "contractors",
    tags: ["subcontractors", "specialists", "network", "hiring"],
  },
]
