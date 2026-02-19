// SIID Knowledge Base - Trained Q&A for the AI Assistant
// Contains comprehensive answers about SIID platform, construction, and architecture

export interface KnowledgeEntry {
  keywords: string[]
  question: string
  answer: string
  category: "platform" | "design" | "construction" | "budget" | "contractors" | "features" | "technical" | "support"
}

export interface QAPair {
  id: string
  question: string
  answer: string
  category: string
  subcategory: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  tags: string[]
  relatedQuestions: string[]
  codeExamples?: string[]
  references?: string[]
}

export const SIID_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // Platform & Features
  {
    keywords: ["what is siid", "about siid", "siid platform", "tell me about siid"],
    question: "What is SIID?",
    answer: `SIID (Smart Intelligent Infrastructure Design) is an AI-powered architectural and construction platform that revolutionizes how buildings are designed, planned, and executed. Our platform offers:

• **AI Design Generation**: Create complete architectural, structural, electrical, plumbing, interior, and exterior designs automatically
• **Multi-Provider AI**: Choose from OpenAI, Anthropic, xAI (Grok) for diverse design perspectives
• **Budget Estimation**: Smart cost calculations in INR with detailed breakdowns
• **Contractor Marketplace**: Connect with verified professionals
• **Project Management**: Track your project from concept to completion
• **Real-time Collaboration**: Work with your team and contractors seamlessly

We support residential, commercial, institutional, industrial, airport, dam, playground, education, hospitality, transport, and civic projects.`,
    category: "platform",
  },
  {
    keywords: ["features", "what can siid do", "capabilities", "platform features"],
    question: "What features does SIID offer?",
    answer: `SIID offers 20+ advanced features:

**Design Features:**
1. AI-powered architectural plan generation
2. Structural engineering layouts
3. Electrical wiring diagrams
4. Plumbing system designs
5. Interior design suggestions
6. Exterior/landscape planning
7. 3D visualization previews
8. Multi-directional layouts (N/S/E/W)

**Project Management:**
9. Real-time progress tracking
10. Budget estimation & monitoring
11. Task management system
12. Team collaboration tools
13. Document management
14. Milestone tracking

**Contractor Features:**
15. Verified contractor marketplace
16. Rating & review system
17. Direct messaging
18. Quote comparison
19. Contract management

**Advanced Tools:**
20. AI Assistant (me!) for 24/7 help
21. Material cost calculator
22. Building code compliance checker
23. Energy efficiency analyzer
24. Smart home integration planner`,
    category: "features",
  },
  {
    keywords: ["how to start", "get started", "begin project", "create project", "new project"],
    question: "How do I start a new project?",
    answer: `Starting a new project in SIID is simple:

**Step 1: Create Account**
• Sign up at /signup or login at /login
• Verify your email

**Step 2: Start New Project**
• Go to Dashboard → Click "New Project"
• Select project type (Residential, Commercial, etc.)

**Step 3: Enter Details**
• Project name and description
• Location (city/state)
• Budget range

**Step 4: Set Requirements**
• Choose project size (Small/Medium/Large)
• Select features (Pool, Gym, Smart Home, etc.)
• Pick material quality tier

**Step 5: Generate Designs**
• Select AI providers (optional)
• Click "Generate AI Designs"
• Review architectural, structural, MEP designs

**Step 6: Connect with Contractors**
• Browse contractor marketplace
• Get quotes and hire professionals`,
    category: "platform",
  },
  // Design & Architecture
  {
    keywords: ["architectural design", "floor plan", "house design", "building design"],
    question: "How does AI architectural design work?",
    answer: `Our AI architectural design system works in multiple stages:

**1. Input Analysis**
The AI analyzes your inputs including:
• Plot size and dimensions
• Number of floors/rooms
• Budget constraints
• Style preferences
• Climate considerations
• Local building codes

**2. Design Generation**
The AI creates:
• Floor plans for each level
• Room layouts optimized for flow
• Window/door placements
• Staircase and elevation designs
• Parking and entrance layouts

**3. Multi-Directional Views**
We generate designs from:
• North elevation
• South elevation  
• East elevation
• West elevation
• Top/Plan view
• 3D isometric view

**4. Customization**
All designs are fully editable - adjust room sizes, swap layouts, change orientations, and more.`,
    category: "design",
  },
  {
    keywords: ["structural design", "structural plan", "foundation", "beams", "columns"],
    question: "What structural designs does SIID generate?",
    answer: `SIID generates comprehensive structural engineering plans:

**Foundation Designs:**
• Footing layouts and dimensions
• Raft/mat foundation plans
• Pile foundation (if needed)
• Foundation depth calculations

**Structural Frame:**
• Column positions and sizes
• Beam layouts (plinth, lintel, roof)
• Slab reinforcement details
• Load-bearing wall identification

**Steel/RCC Details:**
• Reinforcement schedules
• Bar bending schedules
• Steel tonnage estimates
• Concrete volume calculations

**Seismic Considerations:**
• Zone-appropriate design
• Shear wall placements
• Earthquake-resistant features

**Documentation:**
• Structural drawings (PDF/DWG)
• Material specifications
• Construction sequences
• Load calculations`,
    category: "design",
  },
  {
    keywords: ["electrical", "wiring", "electrical plan", "power", "outlets"],
    question: "What electrical designs are included?",
    answer: `Our electrical design module covers:

**Power Distribution:**
• Main panel board layout
• Sub-panel locations
• Circuit breaker sizing
• Load calculations per circuit

**Wiring Layout:**
• Wire routing paths
• Conduit placements
• Cable tray designs
• Wire gauge specifications

**Outlet Planning:**
• Power outlet positions
• Switch locations
• Height specifications
• Special outlets (AC, geyser, etc.)

**Lighting Design:**
• Light fixture positions
• Lighting calculations (lux levels)
• Emergency lighting
• Decorative lighting suggestions

**Safety Features:**
• Earthing/grounding layout
• Lightning protection
• Surge protection
• ELCB/MCB specifications

**Smart Integration:**
• Smart switch positions
• Automation wiring
• Network cable routing
• Security system wiring`,
    category: "design",
  },
  {
    keywords: ["plumbing", "water supply", "drainage", "pipes"],
    question: "What plumbing designs does SIID provide?",
    answer: `SIID generates complete plumbing and sanitation designs:

**Water Supply System:**
• Main line routing
• Internal pipe layout
• Hot/cold water separation
• Pressure calculations
• Tank placement (overhead/underground)
• Pump specifications

**Drainage System:**
• Waste pipe routing
• Soil pipe layout
• Vent pipe positions
• Slope calculations
• Trap locations
• Inspection chambers

**Fixtures:**
• Bathroom fixture placement
• Kitchen sink positioning
• Washing area layout
• Water heater locations

**Special Systems:**
• Rainwater harvesting
• Grey water recycling
• Septic tank design
• STP (if required)

**Material Specifications:**
• Pipe materials (PVC, CPVC, PPR)
• Fitting details
• Valve locations
• Meter positions`,
    category: "design",
  },
  // Budget & Cost
  {
    keywords: ["budget", "cost", "price", "estimate", "how much", "construction cost"],
    question: "How is the budget estimated?",
    answer: `SIID uses intelligent budget estimation based on multiple factors:

**Cost Tiers:**
• **Moderate**: ₹1,500/sqft - Basic quality, essential features
• **Intermediate**: ₹2,200/sqft - Good quality, standard features
• **Premium**: ₹3,000/sqft - High-end materials, luxury features

**Budget Breakdown:**
• Materials: ~60% of total
• Labor: ~30% of total
• Miscellaneous: ~10% (permits, contingency)

**Factors Considered:**
• Built-up area (sqft)
• Number of floors
• Location (metro vs tier-2 cities)
• Material quality selected
• Special features (pool, elevator, etc.)
• Smart home integration
• Foundation type required

**Example Calculation:**
For a 2000 sqft home in Intermediate tier:
2000 × ₹2,200 = ₹44,00,000 (₹44 Lakhs)
- Materials: ₹26.4 Lakhs
- Labor: ₹13.2 Lakhs
- Misc: ₹4.4 Lakhs`,
    category: "budget",
  },
  {
    keywords: ["material cost", "material price", "construction materials"],
    question: "What are typical material costs?",
    answer: `Here are typical material costs in India (2024):

**Cement:**
• OPC 53 Grade: ₹380-420/bag
• PPC: ₹340-380/bag
• Usage: ~0.4 bags/sqft

**Steel:**
• TMT Bars: ₹65,000-75,000/ton
• Structural Steel: ₹70,000-85,000/ton
• Usage: ~4-5 kg/sqft

**Bricks/Blocks:**
• Red Bricks: ₹7-10/piece
• AAC Blocks: ₹45-55/block
• Fly Ash Bricks: ₹5-7/piece

**Sand & Aggregate:**
• River Sand: ₹65-85/cft
• M-Sand: ₹45-55/cft
• Aggregate: ₹35-50/cft

**Electrical:**
• Wiring: ₹150-250/sqft
• Fixtures: ₹50,000-2,00,000/home

**Plumbing:**
• Pipes & Fittings: ₹100-180/sqft
• Sanitary: ₹50,000-3,00,000/home

**Flooring:**
• Tiles: ₹40-200/sqft
• Marble: ₹150-500/sqft
• Vitrified: ₹50-150/sqft`,
    category: "budget",
  },
  // Contractors
  {
    keywords: ["contractor", "find contractor", "hire contractor", "builder"],
    question: "How do I find and hire contractors?",
    answer: `SIID's contractor marketplace helps you find verified professionals:

**Finding Contractors:**
1. Go to Dashboard → Contractors
2. Filter by location, specialty, rating
3. View profiles, portfolios, reviews
4. Compare multiple contractors

**Verification Process:**
All contractors on SIID are verified for:
• Business registration
• GST compliance
• Past project verification
• Identity verification
• Insurance coverage

**Hiring Process:**
1. Send project details to shortlisted contractors
2. Receive quotes and proposals
3. Compare pricing and timelines
4. Schedule site visits/meetings
5. Finalize and sign digital contract
6. Make milestone-based payments

**Rating System:**
• 5-star rating system
• Verified reviews from past clients
• Response time tracking
• Completion rate display

**Categories Available:**
• Civil Contractors
• Architects
• Interior Designers
• Electrical Contractors
• Plumbing Contractors
• HVAC Specialists
• Landscape Designers`,
    category: "contractors",
  },
  // Technical
  {
    keywords: ["building code", "regulations", "permits", "approval"],
    question: "How does SIID handle building codes?",
    answer: `SIID incorporates building codes and helps with approvals:

**Code Compliance:**
• National Building Code (NBC) guidelines
• Local municipal regulations
• Fire safety norms
• Structural safety standards
• Environmental clearances

**Built-in Checks:**
• Setback requirements
• FAR/FSI calculations
• Height restrictions
• Parking requirements
• Open space requirements

**Approval Documents:**
SIID helps generate documents for:
• Building plan approval
• Structural stability certificate
• Fire NOC application
• Environmental clearance
• Occupancy certificate

**State-specific:**
We support regulations for:
• GHMC (Hyderabad)
• BBMP (Bangalore)
• BMC (Mumbai)
• SDMC/NDMC (Delhi)
• And 50+ other municipalities`,
    category: "technical",
  },
  {
    keywords: ["vastu", "feng shui", "direction", "orientation"],
    question: "Does SIID consider Vastu principles?",
    answer: `Yes, SIID can incorporate Vastu Shastra principles:

**Enabled Features:**
• Main entrance positioning (ideally North/East)
• Kitchen placement (Southeast)
• Master bedroom location (Southwest)
• Pooja room positioning (Northeast)
• Toilet placement guidelines

**Vastu Options:**
• Full Vastu compliance mode
• Partial Vastu (key elements)
• Modern fusion approach
• No Vastu constraints

**Direction-based Planning:**
• Plot orientation analysis
• Sun path consideration
• Wind direction optimization
• Natural light maximization

**To Enable:**
In project requirements, select "Vastu Compliant" under preferences, and the AI will generate designs following Vastu principles.`,
    category: "design",
  },
  // Smart Home
  {
    keywords: ["smart home", "automation", "iot", "home automation"],
    question: "What smart home features can SIID plan?",
    answer: `SIID plans complete smart home integration:

**Lighting:**
• Smart switches & dimmers
• Motion-activated lights
• Scheduled lighting
• Color-changing ambiance

**Climate Control:**
• Smart AC controllers
• Automated blinds/curtains
• Temperature sensors
• Zone-based HVAC

**Security:**
• Smart locks
• Video doorbells
• CCTV integration
• Motion sensors
• Glass break detectors

**Entertainment:**
• Multi-room audio
• Home theater setup
• Smart TV integration
• Voice assistant placement

**Energy Management:**
• Smart meters
• Solar integration
• Battery backup systems
• Consumption monitoring

**Voice Control:**
• Alexa/Google Home positions
• Voice-controlled zones
• Intercom system

**Wiring Requirements:**
• Network cable routing
• Power points for devices
• Hub placement
• Backup power planning`,
    category: "features",
  },
  // Support
  {
    keywords: ["help", "support", "contact", "issue", "problem"],
    question: "How can I get help or support?",
    answer: `SIID offers multiple support channels:

**Self-Service:**
• AI Assistant (that's me!) - Available 24/7
• Help Center at /help
• FAQ section on homepage
• Video tutorials

**Direct Support:**
• Email: support@siid.com
• WhatsApp: +91 9032306961
• Contact form at /contact

**Response Times:**
• AI Assistant: Instant
• WhatsApp: Within 2 hours
• Email: Within 24 hours

**Premium Support (Pro users):**
• Dedicated account manager
• Priority response
• Video call support
• On-site visits (select cities)

**Community:**
• User forums
• Design inspiration gallery
• Best practices blog

**For urgent issues:**
Use the WhatsApp button or call during business hours (9 AM - 7 PM IST).`,
    category: "support",
  },
  {
    keywords: ["login", "signup", "register", "account", "password"],
    question: "How do I create an account or login?",
    answer: `**Creating an Account:**
1. Visit /signup
2. Enter your name, email, password
3. Accept terms and conditions
4. Click "Sign Up"
5. Verify email (if required)

**Logging In:**
1. Visit /login
2. Enter email and password
3. Click "Log In"
4. Access your dashboard

**Forgot Password:**
1. Click "Forgot Password" on login page
2. Enter registered email
3. Check email for reset link
4. Create new password

**Account Security:**
• Use strong passwords
• Don't share login details
• Log out on shared devices
• Enable 2FA (coming soon)`,
    category: "support",
  },
  // Project Types
  {
    keywords: ["residential", "house", "home", "villa", "apartment"],
    question: "What residential projects does SIID support?",
    answer: `SIID supports all residential project types:

**Individual Houses:**
• Single-floor homes
• Duplex/Triplex villas
• Bungalows
• Farmhouses
• Row houses

**Apartments:**
• Low-rise (G+3)
• Mid-rise (G+7)
• High-rise towers
• Gated communities

**Size Categories:**
• Small: < 1,500 sqft
• Medium: 1,500 - 3,000 sqft
• Large: > 3,000 sqft

**Special Features:**
• Basement planning
• Terrace gardens
• Parking design
• Swimming pools
• Home offices
• Guest houses

Each design includes architectural, structural, electrical, plumbing, interior, and exterior plans.`,
    category: "design",
  },
  {
    keywords: ["commercial", "office", "shop", "mall", "retail"],
    question: "What commercial projects can SIID design?",
    answer: `SIID handles various commercial projects:

**Office Buildings:**
• Corporate offices
• Co-working spaces
• IT parks
• Business centers

**Retail:**
• Shopping malls
• Standalone shops
• Showrooms
• Retail complexes

**Hospitality:**
• Hotels
• Restaurants
• Cafes
• Banquet halls

**Healthcare:**
• Clinics
• Hospitals
• Diagnostic centers
• Wellness centers

**Mixed-Use:**
• Residential + Commercial
• Retail + Office
• Hotel + Retail

**Special Considerations:**
• Higher fire safety standards
• Accessibility compliance
• Commercial MEP loads
• Parking calculations
• Emergency exits`,
    category: "design",
  },
  // Advanced Features
  {
    keywords: ["3d", "visualization", "render", "preview"],
    question: "Does SIID provide 3D visualization?",
    answer: `Yes, SIID offers 3D visualization features:

**Current Features:**
• Isometric 3D views
• Floor-wise 3D models
• Exterior renders
• Interior previews

**Coming Soon:**
• Real-time 3D walkthrough
• VR compatibility
• AR visualization
• Photorealistic renders

**How to Access:**
1. Generate designs for your project
2. Go to project → Designs
3. Click on "3D View" tab
4. Rotate, zoom, explore

**Export Options:**
• Image downloads (JPG/PNG)
• PDF compilation
• 3D model files (OBJ/FBX)`,
    category: "features",
  },
  {
    keywords: ["compare", "comparison", "multiple designs", "alternatives"],
    question: "Can I compare multiple design options?",
    answer: `Yes! SIID supports design comparison:

**Multi-Provider Generation:**
• Enable OpenAI, Anthropic, xAI
• Each provider creates unique designs
• Generate up to 4 variants per provider
• Compare side-by-side

**Comparison View:**
• Overlay designs
• Switch between versions
• Compare room sizes
• Check cost differences

**Hybrid Selection:**
• Pick best elements from each
• Combine different designs
• Create custom mashups
• Request AI refinement

**Saving Options:**
• Save favorites
• Create shortlist
• Share with contractors
• Export comparison reports`,
    category: "features",
  },
  // Construction Process
  {
    keywords: ["construction process", "building process", "how to build", "construction steps"],
    question: "What is the typical construction process?",
    answer: `Here's the typical construction process:

**Phase 1: Pre-Construction**
1. Design finalization
2. Budget approval
3. Contractor selection
4. Permit acquisition
5. Material procurement planning

**Phase 2: Foundation**
1. Site clearing
2. Excavation
3. Foundation layout
4. Footing construction
5. Plinth beam casting

**Phase 3: Structure**
1. Column construction
2. Slab casting (floor-wise)
3. Beam construction
4. Staircase building
5. Roof slab casting

**Phase 4: Finishing**
1. Brickwork/walls
2. Plastering
3. Electrical rough-in
4. Plumbing rough-in
5. Flooring
6. Painting
7. Fixture installation

**Phase 5: Final**
1. Electrical finishing
2. Plumbing finishing
3. Carpentry/woodwork
4. Final painting
5. Cleaning
6. Handover

**Timeline:** Typically 8-14 months for 2000 sqft home.`,
    category: "construction",
  },
  {
    keywords: ["timeline", "how long", "duration", "time to build"],
    question: "How long does construction take?",
    answer: `Construction timelines vary by project:

**Residential:**
• Small house (< 1500 sqft): 6-8 months
• Medium house (1500-3000 sqft): 8-12 months
• Large villa (> 3000 sqft): 12-18 months
• Apartment (per floor): 3-4 months

**Commercial:**
• Small office: 4-6 months
• Medium commercial: 8-12 months
• Large complex: 18-24 months

**Factors Affecting Timeline:**
• Weather conditions
• Labor availability
• Material supply
• Design complexity
• Approval delays
• Payment schedules

**SIID Timeline Tracking:**
• Milestone-based tracking
• Real-time progress updates
• Delay alerts
• Contractor accountability
• Photo documentation`,
    category: "construction",
  },

  // A. Construction Basics & Cost (Questions 1-45)
  {
    keywords: ["how much", "cost to build", "building cost", "construction cost"],
    question: "How much does it cost to build a house?",
    answer:
      "Cost depends on area, materials, and design. Typically ranges from ₹1,500 to ₹3,000 per square foot depending on quality tier selected.",
    category: "budget",
  },
  {
    keywords: ["per square foot cost", "sqft cost", "rate per sqft"],
    question: "What is per square foot cost?",
    answer:
      "Approximately ₹1,500-₹3,000 per square foot depending on quality. Moderate quality: ₹1,500/sqft, Intermediate: ₹2,200/sqft, Premium: ₹3,000/sqft.",
    category: "budget",
  },
  {
    keywords: ["estimation", "what is estimation"],
    question: "What is estimation?",
    answer:
      "Calculation of construction cost including materials, labor, and miscellaneous expenses. SIID provides AI-powered automated cost estimation for your project.",
    category: "budget",
  },
  {
    keywords: ["boq", "bill of quantities"],
    question: "What is BOQ?",
    answer:
      "Bill of Quantities - a detailed document listing all materials, quantities, and costs required for construction. SIID automatically generates BOQ for your project.",
    category: "construction",
  },
  {
    keywords: ["foundation", "what is foundation"],
    question: "What is foundation?",
    answer:
      "Base of the building that transfers the structural load to the soil. It's the most critical part of construction ensuring stability.",
    category: "construction",
  },
  {
    keywords: ["best foundation", "foundation type"],
    question: "What type of foundation is best?",
    answer:
      "Depends on soil test results. Common types: shallow foundation for good soil, deep foundation (pile) for weak soil. SIID recommends the right type based on your site conditions.",
    category: "construction",
  },
  {
    keywords: ["soil test", "soil testing"],
    question: "What is soil test?",
    answer:
      "Determines soil strength and bearing capacity. Essential before construction to select the right foundation type and prevent future structural issues.",
    category: "construction",
  },
  {
    keywords: ["footing", "what is footing"],
    question: "What is footing?",
    answer:
      "Enlarged base of foundation that spreads the load over a larger area. It's the bottom-most structural element in contact with soil.",
    category: "construction",
  },
  {
    keywords: ["plinth", "what is plinth"],
    question: "What is plinth?",
    answer:
      "Portion between ground level and floor level. Typically 45-60 cm high, it protects the building from ground moisture and provides a raised platform.",
    category: "construction",
  },
  {
    keywords: ["slab", "what is slab"],
    question: "What is slab?",
    answer:
      "Flat concrete surface forming floors and roofs. It's a horizontal structural element that transfers loads to beams and columns.",
    category: "construction",
  },
  {
    keywords: ["beam", "what is beam"],
    question: "What is beam?",
    answer:
      "Structural element that supports slabs and transfers loads to columns. Beams run horizontally and resist bending forces.",
    category: "construction",
  },
  {
    keywords: ["column", "what is column", "pillar"],
    question: "What is column?",
    answer:
      "Vertical structural support that carries loads from beams and slabs to the foundation. Columns are critical load-bearing elements.",
    category: "construction",
  },
  {
    keywords: ["lintel", "what is lintel"],
    question: "What is lintel?",
    answer:
      "Support beam above doors and windows. It carries the load of the wall above the opening and prevents cracks.",
    category: "construction",
  },
  {
    keywords: ["staircase", "stairs"],
    question: "What is staircase?",
    answer:
      "Series of steps connecting different floors. SIID designs optimal staircase layouts considering space efficiency and building codes.",
    category: "construction",
  },
  {
    keywords: ["excavation", "digging"],
    question: "What is excavation?",
    answer:
      "Digging soil for foundation work. Depth depends on foundation type and soil bearing capacity determined by soil tests.",
    category: "construction",
  },
  {
    keywords: ["backfilling", "backfill"],
    question: "What is backfilling?",
    answer:
      "Filling soil after foundation work is completed. Proper backfilling prevents settlement and ensures stability around the foundation.",
    category: "construction",
  },
  {
    keywords: ["curing period", "curing time", "concrete curing"],
    question: "What is curing period?",
    answer:
      "Time needed for concrete to gain strength. Minimum 7-14 days of water curing is required for optimal concrete strength development.",
    category: "construction",
  },
  {
    keywords: ["finishing work", "finishing"],
    question: "What is finishing work?",
    answer:
      "Final stage including painting, flooring, and fixture installations. This gives the building its final appearance and makes it ready for occupancy.",
    category: "construction",
  },
  {
    keywords: ["handover stage", "handover", "completion"],
    question: "What is handover stage?",
    answer:
      "Final delivery of completed project to the owner. Includes final inspection, documentation, and transfer of keys with completion certificate.",
    category: "construction",
  },
  {
    keywords: ["labor contract", "labour contract"],
    question: "What is labor contract?",
    answer:
      "Payment arrangement based on work only, not materials. Owner provides materials, contractor provides labor and execution.",
    category: "construction",
  },
  {
    keywords: ["material contract"],
    question: "What is material contract?",
    answer:
      "Contractor supplies both materials and labor. Also called 'material + labor' contract, it's comprehensive but requires careful quality monitoring.",
    category: "construction",
  },
  {
    keywords: ["turnkey project", "turnkey"],
    question: "What is turnkey project?",
    answer:
      "Complete construction handled by one company from design to handover. Owner just provides requirements and receives a ready-to-use building.",
    category: "construction",
  },
  {
    keywords: ["supervision charge", "supervision cost"],
    question: "What is supervision charge?",
    answer:
      "Cost for professional site monitoring and quality control. Typically 3-5% of project cost, ensures work is done as per plans and standards.",
    category: "construction",
  },
  {
    keywords: ["project timeline", "construction timeline"],
    question: "What is project timeline?",
    answer:
      "Planned duration of construction from start to completion. SIID provides milestone-based timeline tracking with progress monitoring.",
    category: "construction",
  },
  {
    keywords: ["construction delay", "delay reasons"],
    question: "What causes construction delay?",
    answer:
      "Common causes: adverse weather, fund shortage, material unavailability, labor issues, permit delays, or design changes. SIID helps track and minimize delays.",
    category: "construction",
  },
  {
    keywords: ["contingency cost", "contingency budget"],
    question: "What is contingency cost?",
    answer:
      "Extra budget (typically 10-15%) for unforeseen expenses during construction. Essential for handling unexpected issues or price variations.",
    category: "budget",
  },
  {
    keywords: ["site clearance", "clearing site"],
    question: "What is site clearance?",
    answer:
      "Preparing land before construction by removing vegetation, debris, and leveling. First step in the construction process.",
    category: "construction",
  },
  {
    keywords: ["leveling", "land leveling"],
    question: "What is leveling?",
    answer:
      "Making ground surface even and at proper elevation. Essential for proper drainage and uniform foundation construction.",
    category: "construction",
  },
  {
    keywords: ["anti-termite treatment", "termite treatment"],
    question: "What is anti-termite treatment?",
    answer:
      "Chemical treatment to prevent termite damage to the structure. Applied before flooring and around foundation to protect wood and structure.",
    category: "construction",
  },
  {
    keywords: ["curing compound"],
    question: "What is curing compound?",
    answer:
      "Chemical liquid sprayed on concrete to retain moisture for proper curing. Alternative to water curing, especially useful in water-scarce areas.",
    category: "construction",
  },
  {
    keywords: ["ready-mix concrete", "rmc", "ready mix"],
    question: "What is ready-mix concrete?",
    answer:
      "Factory-made concrete delivered to site in mixer trucks. Ensures consistent quality and faster construction compared to on-site mixing.",
    category: "construction",
  },
  {
    keywords: ["on-site mixing", "site mixing"],
    question: "What is on-site mixing?",
    answer:
      "Concrete mixed at the construction site using cement, sand, aggregate, and water. Traditional method, requires quality control.",
    category: "construction",
  },
  {
    keywords: ["load-bearing structure", "load bearing"],
    question: "What is load-bearing structure?",
    answer:
      "Building where walls carry all the structural load. Traditional construction method, suitable for low-rise buildings up to 2-3 floors.",
    category: "construction",
  },
  {
    keywords: ["framed structure", "frame structure", "rcc frame"],
    question: "What is framed structure?",
    answer:
      "Building where columns and beams carry the load, walls are non-structural. Modern construction method, suitable for multi-story buildings.",
    category: "construction",
  },
  {
    keywords: ["framed vs load-bearing", "better structure type"],
    question: "Which is better: framed or load-bearing?",
    answer:
      "Framed structure is more flexible, allows larger spans, better for multi-story, and permits future modifications. Recommended for most modern constructions.",
    category: "construction",
  },
  {
    keywords: ["rcc design", "reinforced concrete design"],
    question: "What is RCC design?",
    answer:
      "Structural design of Reinforced Cement Concrete elements like beams, columns, slabs. SIID generates complete RCC structural designs with reinforcement details.",
    category: "design",
  },
  {
    keywords: ["site engineer", "site engineer role"],
    question: "What is site engineer's role?",
    answer:
      "Manages daily site activities, ensures quality, coordinates workers, monitors progress, and maintains construction as per approved drawings.",
    category: "construction",
  },
  {
    keywords: ["quality check", "quality inspection"],
    question: "What is quality check?",
    answer:
      "Regular inspection of construction standards at various stages. Ensures materials and workmanship meet specifications and building codes.",
    category: "construction",
  },
  {
    keywords: ["snag list", "punch list"],
    question: "What is snag list?",
    answer:
      "List of defects or incomplete items identified before handover. Contractor must fix all snags before final payment and project completion.",
    category: "construction",
  },
  {
    keywords: ["final billing", "final payment"],
    question: "What is final billing?",
    answer:
      "Last payment made after project completion, snag clearance, and final inspection. Typically includes retention money release.",
    category: "construction",
  },
  {
    keywords: ["retention money", "retention amount"],
    question: "What is retention money?",
    answer:
      "Amount (typically 5-10%) withheld from contractor for defect liability period. Released after successful completion of defect-free period.",
    category: "construction",
  },
  {
    keywords: ["defect liability period", "dlp"],
    question: "What is defect liability period?",
    answer:
      "Period (typically 6-12 months) after handover during which contractor must fix any defects that appear, usually at no cost to owner.",
    category: "construction",
  },
  {
    keywords: ["construction insurance"],
    question: "What is insurance in construction?",
    answer:
      "Coverage for accidents, damages, theft, and liability during construction. Protects both owner and contractor from financial losses.",
    category: "construction",
  },
  {
    keywords: ["safety gear", "ppe", "safety equipment"],
    question: "What is safety gear?",
    answer:
      "Personal protective equipment: helmet, gloves, safety shoes, harness. Mandatory for all workers on construction sites to prevent injuries.",
    category: "construction",
  },
  {
    keywords: ["shuttering oil", "formwork oil"],
    question: "What is shuttering oil?",
    answer:
      "Applied on formwork/shuttering to prevent concrete from sticking. Makes formwork removal easier and protects the formwork for reuse.",
    category: "construction",
  },
  {
    keywords: ["construction waste", "debris", "waste management"],
    question: "What is construction waste?",
    answer:
      "Unused material debris and scrap generated during construction. Proper waste management and disposal is essential for site safety and environment.",
    category: "construction",
  },
  {
    keywords: ["reduce construction cost", "cost savings", "save money"],
    question: "How to reduce construction cost?",
    answer:
      "Proper planning, efficient design, bulk material purchase, avoiding changes during construction, and material optimization. SIID's AI helps optimize costs.",
    category: "budget",
  },
  {
    keywords: ["value engineering"],
    question: "What is value engineering?",
    answer:
      "Cost optimization without compromising quality or functionality. SIID's AI suggests cost-effective alternatives while maintaining design integrity.",
    category: "budget",
  },
  {
    keywords: ["project tracking", "progress tracking"],
    question: "What is project tracking?",
    answer:
      "Monitoring construction progress against planned milestones. SIID provides real-time project tracking with photo documentation and status updates.",
    category: "features",
  },
  {
    keywords: ["milestone payment", "stage payment"],
    question: "What is milestone payment?",
    answer:
      "Payment released upon completion of specific work stages (foundation, structure, finishing, etc.). Ensures contractor is paid for completed work only.",
    category: "construction",
  },

  // C. Vastu, Design, Documents, AI (Questions 91-150)
  {
    keywords: ["vastu shastra", "what is vastu"],
    question: "What is Vastu Shastra?",
    answer:
      "Ancient Indian architectural science that harmonizes buildings with natural forces. SIID can generate Vastu-compliant layouts with detailed compliance scoring.",
    category: "design",
  },
  {
    keywords: ["best direction for entrance", "entrance direction", "main door direction"],
    question: "Which direction is best for entrance?",
    answer:
      "East or North directions are considered best for main entrance according to Vastu Shastra. SIID's Vastu generator ensures proper entrance placement.",
    category: "design",
  },
  {
    keywords: ["kitchen direction", "where should kitchen be"],
    question: "Where should kitchen be placed?",
    answer:
      "South-East direction is ideal for kitchen according to Vastu. This aligns with the fire element and morning sunlight for natural lighting.",
    category: "design",
  },
  {
    keywords: ["bedroom direction", "master bedroom"],
    question: "Where should bedroom be placed?",
    answer:
      "South-West direction is recommended for master bedroom. Provides stability and restful sleep according to Vastu principles.",
    category: "design",
  },
  {
    keywords: ["pooja room direction", "prayer room"],
    question: "Where should pooja room be?",
    answer:
      "North-East direction is ideal for pooja/prayer room. This direction is considered most auspicious and sacred in Vastu Shastra.",
    category: "design",
  },
  {
    keywords: ["vastu dosha", "vastu defect"],
    question: "What is vastu dosha?",
    answer:
      "Vastu imbalance or architectural defect that goes against Vastu principles. Can affect well-being and prosperity according to Vastu believers.",
    category: "design",
  },
  {
    keywords: ["correct vastu dosha", "vastu remedy"],
    question: "Can vastu dosha be corrected?",
    answer:
      "Yes, using remedies like mirrors, plants, colors, or design modifications. SIID's Vastu generator provides dosha detection and remedial suggestions.",
    category: "design",
  },
  {
    keywords: ["vastu score", "vastu compliance"],
    question: "What is vastu score?",
    answer:
      "Percentage (0-100%) indicating Vastu compliance level. SIID calculates comprehensive Vastu scores with detailed breakdown by category.",
    category: "design",
  },
  {
    keywords: ["2d layout", "floor plan"],
    question: "What is 2D layout?",
    answer:
      "Flat architectural drawing showing room arrangements, dimensions, and spatial relationships. SIID generates professional 2D layouts for all floors.",
    category: "design",
  },
  {
    keywords: ["3d elevation", "building elevation"],
    question: "What is 3D elevation?",
    answer:
      "Visual view of building's exterior from different sides (North, South, East, West). Shows architectural design, colors, materials, and aesthetics.",
    category: "design",
  },
  {
    keywords: ["floor plan"],
    question: "What is floor plan?",
    answer:
      "Top view showing room arrangement and layout of each floor. Includes dimensions, door/window positions, and space allocation.",
    category: "design",
  },
  {
    keywords: ["section drawing", "cross section"],
    question: "What is section drawing?",
    answer:
      "Vertical cut view of building showing internal structure, floor heights, and vertical relationships between spaces.",
    category: "design",
  },
  {
    keywords: ["structural drawing", "structural plan"],
    question: "What is structural drawing?",
    answer:
      "Engineering drawings showing reinforcement details, column-beam layout, and load distribution. SIID generates complete structural designs.",
    category: "design",
  },
  {
    keywords: ["electrical layout", "electrical plan"],
    question: "What is electrical layout?",
    answer:
      "Wiring diagram showing power distribution, switch positions, outlet locations, and lighting fixtures. SIID creates comprehensive electrical plans.",
    category: "design",
  },
  {
    keywords: ["plumbing layout", "plumbing plan"],
    question: "What is plumbing layout?",
    answer:
      "Plan showing water supply lines, drainage pipes, sanitary fixtures, and connections. Includes water and drainage system details.",
    category: "design",
  },
  {
    keywords: ["interior design"],
    question: "What is interior design?",
    answer:
      "Planning and aesthetics of indoor spaces including colors, furniture, lighting, and finishes. SIID generates AI-powered interior design suggestions.",
    category: "design",
  },
  {
    keywords: ["exterior design", "facade design"],
    question: "What is exterior design?",
    answer:
      "Outside appearance of the building including facade treatment, colors, textures, and landscaping. Defines the building's visual character.",
    category: "design",
  },
  {
    keywords: ["approval drawing", "submission plan"],
    question: "What is approval drawing?",
    answer:
      "Architectural plan submitted to local authorities for building permit. Must comply with local bylaws and regulations.",
    category: "technical",
  },
  {
    keywords: ["sanctioned plan", "approved plan"],
    question: "What is sanctioned plan?",
    answer:
      "Building plan officially approved by local municipal authority with stamp and signature. Required before starting construction legally.",
    category: "technical",
  },
  {
    keywords: ["documents needed for construction", "required documents"],
    question: "What documents are needed for construction?",
    answer:
      "Land ownership deed, approved building plan, NOCs, structural stability certificate, and various clearances. SIID helps organize all project documents.",
    category: "technical",
  },
  {
    keywords: ["progress report"],
    question: "What is progress report?",
    answer:
      "Document showing current construction status with photos and completion percentage. SIID generates progress PDFs with company stamps and signatures.",
    category: "features",
  },
  {
    keywords: ["work completion certificate", "completion certificate"],
    question: "What is work completion certificate?",
    answer:
      "Official proof that construction is completed as per approved plans. Required for occupancy and municipal records.",
    category: "technical",
  },
  {
    keywords: ["company stamp", "official stamp"],
    question: "What is company stamp?",
    answer:
      "Official authentication mark used on documents for legal validity. SIID allows adding company stamps to all generated documents.",
    category: "features",
  },
  {
    keywords: ["digital signature", "e-signature"],
    question: "What is digital signature?",
    answer:
      "Electronic authorization method for documents. SIID supports digital signatures on all generated PDFs for approved designs and reports.",
    category: "features",
  },
  {
    keywords: ["ai estimation", "automated estimation"],
    question: "What is AI estimation?",
    answer:
      "Automated cost calculation using artificial intelligence. SIID's AI analyzes project parameters and generates accurate budget estimates instantly.",
    category: "features",
  },
  {
    keywords: ["how ai helps construction", "ai in construction"],
    question: "How does AI help in construction?",
    answer:
      "AI assists in design generation, cost estimation, planning optimization, material calculation, error detection, and project monitoring. SIID uses advanced AI for all these tasks.",
    category: "platform",
  },
  {
    keywords: ["material calculator"],
    question: "What is material calculator?",
    answer:
      "Tool to estimate quantities of cement, steel, bricks, sand, and other materials needed. SIID provides AI-powered material calculator with cost breakdowns.",
    category: "features",
  },
  {
    keywords: ["siid flash", "what is siid flash"],
    question: "What is SIID FLASH?",
    answer:
      "AI-driven construction management platform that provides design generation, cost estimation, contractor marketplace, and project tracking in one integrated solution.",
    category: "platform",
  },
  {
    keywords: ["generate layouts", "siid layouts"],
    question: "Can SIID FLASH generate layouts?",
    answer:
      "Yes, using AI and Vastu rules, SIID generates architectural layouts, structural plans, MEP designs, and interior layouts automatically.",
    category: "features",
  },
  {
    keywords: ["siid estimate cost"],
    question: "Can SIID FLASH estimate cost?",
    answer:
      "Yes, automatically. SIID provides detailed cost estimation with material breakdown, labor costs, and comprehensive budget reports in Indian Rupees.",
    category: "features",
  },
  {
    keywords: ["download reports", "export reports"],
    question: "Can I download reports?",
    answer:
      "Yes, all designs, estimates, BOQ, progress reports, and documents can be downloaded in PDF format with professional formatting.",
    category: "features",
  },
  {
    keywords: ["contractors communicate", "contractor messaging"],
    question: "Can contractors communicate in app?",
    answer:
      "Yes, via secure messaging system. Direct communication with contractors, share documents, discuss project details within SIID platform.",
    category: "features",
  },
  {
    keywords: ["designs approved digitally", "digital approval"],
    question: "Can designs be approved digitally?",
    answer:
      "Yes, complete digital approval workflow with electronic signatures, stamps, and authorization. Streamlines approval process significantly.",
    category: "features",
  },
  {
    keywords: ["track project status", "project monitoring"],
    question: "Can I track project status?",
    answer:
      "Yes, in real-time. SIID provides live progress tracking, milestone completion status, photo updates, and timeline monitoring.",
    category: "features",
  },
  {
    keywords: ["share documents"],
    question: "Can I share documents?",
    answer:
      "Yes, via email or WhatsApp directly from SIID platform. Share designs, reports, and documents with contractors, architects, or family members.",
    category: "features",
  },
  {
    keywords: ["data secure", "is data safe", "security"],
    question: "Is my data secure?",
    answer:
      "Yes, with enterprise-level encryption, secure authentication, role-based access control, and regular backups. Your project data is completely protected.",
    category: "platform",
  },
  {
    keywords: ["view previous projects", "project history"],
    question: "Can I view previous projects?",
    answer:
      "Yes, access all your past projects anytime. SIID maintains complete project history with all designs, documents, and communications.",
    category: "features",
  },
  {
    keywords: ["ai vastu remedies", "vastu suggestions"],
    question: "Can AI suggest Vastu remedies?",
    answer:
      "Yes, SIID's AI analyzes Vastu doshas and provides practical remedies including room repositioning, color suggestions, and placement corrections.",
    category: "features",
  },
  {
    keywords: ["regenerate layouts", "generate again"],
    question: "Can layouts be regenerated?",
    answer:
      "Yes, generate unlimited design variations. Try different AI providers, adjust parameters, and regenerate layouts until you find the perfect design.",
    category: "features",
  },
  {
    keywords: ["compare designs"],
    question: "Can I compare designs?",
    answer:
      "Yes, side-by-side comparison of multiple designs. Compare layouts, costs, features, and Vastu scores to make informed decisions.",
    category: "features",
  },
  {
    keywords: ["ai local bylaws", "bylaws compliance"],
    question: "Does AI follow local bylaws?",
    answer:
      "Yes, configurable for different cities. SIID incorporates local building codes, setback requirements, FAR/FSI limits, and municipal regulations.",
    category: "technical",
  },
  {
    keywords: ["export images", "download images"],
    question: "Can I export images?",
    answer:
      "Yes, export designs as high-resolution images (JPG/PNG), PDFs, or 3D model files for presentations and printing.",
    category: "features",
  },
  {
    keywords: ["multi-floor buildings", "multiple floors"],
    question: "Does it support multi-floor buildings?",
    answer:
      "Yes, supports unlimited floors. Generate floor-wise plans for duplex, triplex, apartments, or commercial high-rise buildings.",
    category: "features",
  },
  {
    keywords: ["suitable for villas"],
    question: "Is it suitable for villas?",
    answer:
      "Yes, perfect for luxury villas. Handles complex layouts, multiple wings, landscaping, pools, and premium features with ease.",
    category: "features",
  },
  {
    keywords: ["commercial projects"],
    question: "Is it suitable for commercial projects?",
    answer:
      "Yes, supports offices, retail, hotels, hospitals, and mixed-use developments with commercial-grade MEP and structural designs.",
    category: "features",
  },
  {
    keywords: ["optimize sunlight", "natural light"],
    question: "Can AI optimize sunlight?",
    answer:
      "Yes, SIID's AI analyzes sun path and places windows, balconies, and openings to maximize natural lighting and ventilation.",
    category: "features",
  },
  {
    keywords: ["detect design errors", "error detection"],
    question: "Can AI detect design errors?",
    answer:
      "Yes, automated checks for structural conflicts, MEP clashes, code violations, and design inconsistencies before construction.",
    category: "features",
  },
  {
    keywords: ["support contractors"],
    question: "Does it support contractors?",
    answer:
      "Yes, contractor portal with project access, document downloads, progress updates, payment tracking, and communication tools.",
    category: "contractors",
  },
  {
    keywords: ["company approve designs"],
    question: "Can company approve designs?",
    answer:
      "Yes, role-based approval workflow. Company admins can review, comment, approve, or request changes with digital signatures.",
    category: "features",
  },
  {
    keywords: ["download stamped documents", "official documents"],
    question: "Can I download stamped documents?",
    answer:
      "Yes, all documents can include company stamp, digital signatures, and authorization for official use and record-keeping.",
    category: "features",
  },
  {
    keywords: ["cloud-based", "online platform"],
    question: "Is SIID FLASH cloud-based?",
    answer:
      "Yes, fully cloud-based. Access your projects from anywhere, any device with internet connection. No software installation needed.",
    category: "platform",
  },
  {
    keywords: ["work on mobile", "mobile app"],
    question: "Does it work on mobile?",
    answer:
      "Yes, fully responsive on mobile browsers. Access projects, view designs, communicate with contractors, and track progress from your smartphone.",
    category: "platform",
  },
  {
    keywords: ["multiple projects", "store projects"],
    question: "Can I store multiple projects?",
    answer:
      "Yes, create and manage unlimited projects. Each project maintains separate designs, documents, contractors, and communication history.",
    category: "features",
  },
  {
    keywords: ["role-based access"],
    question: "Is there role-based access?",
    answer:
      "Yes, four roles: Admin (full control), Company (approve designs), Contractor (view assigned projects), User (manage own projects).",
    category: "platform",
  },
  {
    keywords: ["ai answer questions", "ai assistant"],
    question: "Can AI answer construction questions?",
    answer:
      "Yes, 24/7 AI assistant trained on 200+ construction topics. Ask about materials, processes, costs, Vastu, design - anything construction-related.",
    category: "features",
  },
  {
    keywords: ["beginner-friendly", "easy to use"],
    question: "Is SIID FLASH beginner-friendly?",
    answer:
      "Yes, intuitive interface designed for non-technical users. Step-by-step workflows, helpful tooltips, and AI guidance throughout the process.",
    category: "platform",
  },
  {
    keywords: ["regional standards", "state standards"],
    question: "Does it support regional standards?",
    answer:
      "Yes, supports building codes and regulations for all Indian states and major cities. Configurable for specific municipal requirements.",
    category: "technical",
  },
  {
    keywords: ["reduce cost overruns", "budget control"],
    question: "Can it reduce cost overruns?",
    answer:
      "Yes, accurate initial estimation, material optimization, progress monitoring, and real-time cost tracking help prevent budget overruns.",
    category: "budget",
  },
  {
    keywords: ["progress pdfs"],
    question: "Does it generate progress PDFs?",
    answer:
      "Yes, professional progress reports with photos, completion percentage, task status, stamps, and signatures ready for official submission.",
    category: "features",
  },
  {
    keywords: ["siid scalable", "scalability"],
    question: "Is SIID FLASH scalable?",
    answer:
      "Yes, scales from small homes to large commercial complexes. Handles individual users, construction companies, and enterprise accounts.",
    category: "platform",
  },

  // D. Security, Sharing, Trust (Questions 151-200)
  {
    keywords: ["who can access", "project access"],
    question: "Who can access my project?",
    answer:
      "Only authorized users you explicitly grant access to. Project owner controls all permissions and can revoke access anytime.",
    category: "platform",
  },
  {
    keywords: ["documents encrypted", "encryption"],
    question: "Are documents encrypted?",
    answer:
      "Yes, all documents are encrypted both in transit (HTTPS) and at rest. Bank-level security protects your designs and data.",
    category: "platform",
  },
  {
    keywords: ["login secure", "secure authentication"],
    question: "Is login secure?",
    answer:
      "Yes, token-based authentication with secure session management. Passwords are hashed and never stored in plain text.",
    category: "platform",
  },
  {
    keywords: ["download without permission"],
    question: "Can someone download without permission?",
    answer:
      "No, all downloads require proper authentication and authorization. Unauthorized access attempts are logged and blocked.",
    category: "platform",
  },
  {
    keywords: ["downloads tracked", "audit trail"],
    question: "Are downloads tracked?",
    answer:
      "Yes, complete audit logging tracks all document downloads, views, and modifications with timestamps and user information.",
    category: "platform",
  },
  {
    keywords: ["revoke access", "remove access"],
    question: "Can I revoke access?",
    answer:
      "Yes, instantly revoke access for any user from project settings. Removed users immediately lose all project permissions.",
    category: "platform",
  },
  {
    keywords: ["whatsapp sharing secure"],
    question: "Is WhatsApp sharing secure?",
    answer:
      "Yes, shared via protected temporary links with expiration. Links can be password-protected and have limited access duration.",
    category: "features",
  },
  {
    keywords: ["ai prevent data leakage"],
    question: "Can AI prevent data leakage?",
    answer:
      "Yes, automated monitoring detects unusual access patterns, prevents unauthorized sharing, and alerts admins of security concerns.",
    category: "platform",
  },
  {
    keywords: ["apis protected", "api security"],
    question: "Are APIs protected?",
    answer:
      "Yes, all APIs use authentication tokens, rate limiting, input validation, and security headers to prevent attacks.",
    category: "platform",
  },
  {
    keywords: ["audit logging"],
    question: "Is there audit logging?",
    answer:
      "Yes, comprehensive logs of all actions including logins, document access, modifications, approvals, and sharing activities.",
    category: "platform",
  },
  {
    keywords: ["admin control permissions"],
    question: "Can admin control permissions?",
    answer:
      "Yes, full permission management. Set who can view, edit, approve, download, or share for each project and document type.",
    category: "platform",
  },
  {
    keywords: ["role-based access available"],
    question: "Is role-based access available?",
    answer:
      "Yes, four distinct roles (Admin, Company, Contractor, User) with predefined permissions ensuring proper access control.",
    category: "platform",
  },
  {
    keywords: ["messages encrypted"],
    question: "Are messages encrypted?",
    answer:
      "Yes, end-to-end encryption for all communications between users, contractors, and companies within the platform.",
    category: "platform",
  },
  {
    keywords: ["unauthorized edits"],
    question: "Can unauthorized edits happen?",
    answer:
      "No, strict permission controls prevent unauthorized modifications. Only users with edit permissions can make changes.",
    category: "platform",
  },
  {
    keywords: ["data backed up", "backup"],
    question: "Is data backed up?",
    answer:
      "Yes, automatic daily backups with multiple redundancy. Your project data is safe even in case of technical failures.",
    category: "platform",
  },
  {
    keywords: ["system reliable", "reliability"],
    question: "Is system reliable?",
    answer:
      "Yes, 99.9% uptime with robust infrastructure, load balancing, and failover systems ensuring continuous availability.",
    category: "platform",
  },
  {
    keywords: ["ai response accurate", "ai accuracy"],
    question: "Is AI response accurate?",
    answer:
      "Based on extensive training data covering 200+ construction topics. Continuously improving with user feedback and expert validation.",
    category: "features",
  },
  {
    keywords: ["ai explain calculations"],
    question: "Can AI explain calculations?",
    answer:
      "Yes, detailed breakdown of all cost estimates, material calculations, and design decisions with transparent methodology.",
    category: "features",
  },
  {
    keywords: ["ai suggest improvements"],
    question: "Can AI suggest improvements?",
    answer:
      "Yes, AI analyzes your design and suggests optimizations for cost, space utilization, energy efficiency, and Vastu compliance.",
    category: "features",
  },
  {
    keywords: ["ai detect mistakes"],
    question: "Can AI detect mistakes?",
    answer:
      "Yes, automated error detection for design conflicts, code violations, structural issues, and MEP clashes before construction.",
    category: "features",
  },
  {
    keywords: ["ai guide beginners"],
    question: "Can AI guide beginners?",
    answer:
      "Yes, step-by-step guidance for first-time builders with explanations, tooltips, and recommendations throughout the process.",
    category: "features",
  },
  {
    keywords: ["ai assist professionals"],
    question: "Can AI assist professionals?",
    answer:
      "Yes, powerful tools for architects, engineers, and contractors to accelerate design, automate calculations, and improve efficiency.",
    category: "features",
  },
  {
    keywords: ["ai work 24/7", "always available"],
    question: "Can AI work 24/7?",
    answer:
      "Yes, AI assistant available round the clock. Get instant answers to questions and generate designs anytime, any day.",
    category: "features",
  },
  {
    keywords: ["ai simple language"],
    question: "Can AI answer in simple language?",
    answer:
      "Yes, AI explains complex construction concepts in easy-to-understand terms suitable for non-technical users.",
    category: "features",
  },
  {
    keywords: ["ai complex questions"],
    question: "Can AI handle complex questions?",
    answer:
      "Yes, trained on comprehensive construction knowledge covering technical, regulatory, and practical aspects of building.",
    category: "features",
  },
  {
    keywords: ["ai continuously improving"],
    question: "Is AI continuously improving?",
    answer:
      "Yes, regular updates with new features, expanded knowledge base, and improved accuracy based on user interactions.",
    category: "platform",
  },
  {
    keywords: ["ai personalize answers"],
    question: "Can AI personalize answers?",
    answer:
      "Yes, considers your project context, location, budget, and preferences to provide relevant, tailored responses.",
    category: "features",
  },
  {
    keywords: ["ai local terms", "regional terms"],
    question: "Does AI understand local terms?",
    answer:
      "Yes, trained on Indian construction terminology, regional variations, and local building practices across different states.",
    category: "features",
  },
  {
    keywords: ["ai mixed language", "hindi english"],
    question: "Can AI handle mixed language queries?",
    answer: "Yes, understands Hinglish and common construction terms in multiple Indian languages mixed with English.",
    category: "features",
  },
  {
    keywords: ["ai trained for indian construction"],
    question: "Is AI trained for Indian construction?",
    answer:
      "Yes, specifically trained on Indian building codes, materials, costs, practices, and regulations for maximum relevance.",
    category: "platform",
  },
  {
    keywords: ["ai generate reports"],
    question: "Can AI generate reports?",
    answer:
      "Yes, automated generation of BOQ, cost estimates, progress reports, material lists, and compliance documents.",
    category: "features",
  },
  {
    keywords: ["ai guide approvals"],
    question: "Can AI guide approvals?",
    answer:
      "Yes, step-by-step guidance for obtaining building permits, NOCs, and other regulatory approvals from authorities.",
    category: "features",
  },
  {
    keywords: ["ai vastu layouts"],
    question: "Can AI suggest Vastu layouts?",
    answer:
      "Yes, AI Vastu Layout Generator creates 100% compliant designs with detailed scoring, dosha detection, and remedies.",
    category: "features",
  },
  {
    keywords: ["ai optimize materials"],
    question: "Can AI optimize materials?",
    answer:
      "Yes, calculates exact quantities, suggests cost-effective alternatives, and minimizes waste through smart planning.",
    category: "features",
  },
  {
    keywords: ["ai reduce human errors"],
    question: "Can AI reduce human errors?",
    answer:
      "Yes, automated checks, validations, and calculations eliminate common mistakes in design, estimation, and planning.",
    category: "features",
  },
  {
    keywords: ["ai save time"],
    question: "Can AI save time?",
    answer: "Yes, tasks that take days manually (design, estimation, BOQ) are completed in minutes with AI automation.",
    category: "features",
  },
  {
    keywords: ["ai save money"],
    question: "Can AI save money?",
    answer:
      "Yes, accurate estimation prevents budget overruns, material optimization reduces waste, and error detection avoids costly fixes.",
    category: "budget",
  },
  {
    keywords: ["ai replace consultants"],
    question: "Can AI replace consultants?",
    answer:
      "AI assists and accelerates work but doesn't replace human expertise. Best results come from AI + professional guidance.",
    category: "features",
  },
  {
    keywords: ["siid future-ready"],
    question: "Is SIID FLASH future-ready?",
    answer:
      "Yes, continuous innovation with latest AI models, new features, and emerging construction technologies integration.",
    category: "platform",
  },
  {
    keywords: ["siid ai-powered"],
    question: "Is SIID FLASH AI-powered?",
    answer:
      "Yes, core platform built on advanced AI with multiple provider support (OpenAI, Anthropic, xAI) for best results.",
    category: "platform",
  },
  {
    keywords: ["ai scale projects"],
    question: "Can AI scale with projects?",
    answer:
      "Yes, handles small homes to large complexes with equal efficiency. Performance scales with project complexity.",
    category: "platform",
  },
  {
    keywords: ["ai integrate new rules"],
    question: "Can AI integrate new rules?",
    answer:
      "Yes, regular updates incorporate new building codes, regulations, and construction standards as they're released.",
    category: "technical",
  },
  {
    keywords: ["ai explain vastu logic"],
    question: "Can AI explain Vastu logic?",
    answer: "Yes, detailed explanations of each Vastu principle, why it matters, and how it's applied in your design.",
    category: "design",
  },
  {
    keywords: ["ai auto-generate layouts"],
    question: "Can AI auto-generate layouts?",
    answer:
      "Yes, complete automation from requirements to final designs. Input details, click generate, get professional layouts.",
    category: "features",
  },
  {
    keywords: ["ai recommendations"],
    question: "Can AI provide recommendations?",
    answer:
      "Yes, intelligent suggestions for materials, contractors, design improvements, cost savings, and best practices.",
    category: "features",
  },
  {
    keywords: ["ai support companies"],
    question: "Can AI support companies?",
    answer:
      "Yes, construction company features including multi-project management, team collaboration, and client portal.",
    category: "platform",
  },
  {
    keywords: ["ai help contractors"],
    question: "Can AI help contractors?",
    answer:
      "Yes, contractor tools for bidding, project tracking, document access, and client communication streamline operations.",
    category: "contractors",
  },
  {
    keywords: ["ai help users"],
    question: "Can AI help users?",
    answer:
      "Yes, individual homeowners and builders get full AI assistance for design, budgeting, planning, and contractor management.",
    category: "platform",
  },
  {
    keywords: ["ai manage digitally"],
    question: "Can AI manage construction digitally?",
    answer:
      "Yes, complete digital transformation from design to handover with paperless workflows, cloud storage, and online collaboration.",
    category: "platform",
  },
  {
    keywords: ["why siid flash", "why siid", "why choose siid"],
    question: "Why SIID FLASH?",
    answer:
      "Because it makes construction smart, simple, and secure using AI. Save time, reduce costs, avoid errors, and build confidently with expert AI assistance.",
    category: "platform",
  },

  // Materials Knowledge (From second file)
  {
    keywords: ["what is cement", "cement"],
    question: "What is cement?",
    answer:
      "Cement is a binding material used to hold bricks, sand, and aggregates together in construction. Acts as the adhesive in concrete and mortar.",
    category: "construction",
  },
  {
    keywords: ["best cement", "cement for house"],
    question: "Which cement is best for house construction?",
    answer:
      "OPC 43 or PPC cement is commonly used for residential houses. OPC 53 for faster strength gain, PPC for better durability and economy.",
    category: "construction",
  },
  {
    keywords: ["sand used for", "what is sand"],
    question: "What is sand used for?",
    answer:
      "Sand is used in concrete mixing, plastering walls, and brick masonry as a fine aggregate. Essential component providing bulk and workability.",
    category: "construction",
  },
  {
    keywords: ["river sand vs m-sand", "sand difference"],
    question: "Difference between river sand and M-sand?",
    answer:
      "River sand is natural from riverbeds, M-sand is manufactured by crushing rocks. M-sand is more eco-friendly and readily available.",
    category: "construction",
  },
  {
    keywords: ["what is aggregate", "aggregate"],
    question: "What is aggregate?",
    answer:
      "Aggregates are crushed stones used in concrete for strength and volume. Provides structural integrity and reduces concrete cost.",
    category: "construction",
  },
  {
    keywords: ["aggregate size for slabs", "slab aggregate"],
    question: "What size aggregate is used for slabs?",
    answer:
      "20mm aggregates are commonly used for slabs. Provides good compaction and strength in RCC slab construction.",
    category: "construction",
  },
  {
    keywords: ["what is brick"],
    question: "What is brick?",
    answer:
      "Brick is a rectangular masonry unit made from clay or fly ash. Used for wall construction and load-bearing structures.",
    category: "construction",
  },
  {
    keywords: ["best brick", "brick type"],
    question: "Which brick is best for construction?",
    answer:
      "Red clay bricks and fly ash bricks are widely used. Fly ash bricks are lighter, eco-friendly, and provide good thermal insulation.",
    category: "construction",
  },
  {
    keywords: ["fly ash brick"],
    question: "What is fly ash brick?",
    answer:
      "Eco-friendly brick made from coal ash, a byproduct of thermal power plants. Lighter than clay bricks with better strength.",
    category: "construction",
  },
  {
    keywords: ["steel used for", "what is steel"],
    question: "What is steel used for?",
    answer:
      "Steel provides tensile strength and reinforcement to concrete structures. Used as rebars in beams, columns, and slabs.",
    category: "construction",
  },
  {
    keywords: ["steel in rcc", "rcc steel"],
    question: "Which steel is used in RCC?",
    answer:
      "TMT (Thermo-Mechanically Treated) steel bars are used in RCC construction for superior strength and ductility.",
    category: "construction",
  },
  {
    keywords: ["tmt steel", "what is tmt"],
    question: "What is TMT steel?",
    answer:
      "Thermo-Mechanically Treated steel bars with hard outer surface and soft inner core. Provides excellent strength, ductility, and earthquake resistance.",
    category: "construction",
  },
  {
    keywords: ["what is concrete"],
    question: "What is concrete?",
    answer:
      "Concrete is a mixture of cement, sand, aggregates (stone chips), and water. Forms the structural foundation of modern construction.",
    category: "construction",
  },
  {
    keywords: ["what is rcc"],
    question: "What is RCC?",
    answer:
      "Reinforced Cement Concrete - concrete with steel reinforcement bars embedded. Combines compressive strength of concrete with tensile strength of steel.",
    category: "construction",
  },
  {
    keywords: ["water curing"],
    question: "What is water curing?",
    answer:
      "Process of keeping concrete moist to prevent cracking and ensure proper strength development. Water prevents rapid moisture loss during concrete hardening.",
    category: "construction",
  },
  {
    keywords: ["curing days", "how many days curing"],
    question: "How many days curing is required?",
    answer:
      "Minimum 7-14 days for normal concrete. Longer curing (28 days) achieves full design strength. Critical for concrete durability.",
    category: "construction",
  },
  {
    keywords: ["what is plastering", "plastering"],
    question: "What is plastering?",
    answer:
      "Applying a smooth layer of cement mortar on walls for even surface and protection. Provides base for painting and aesthetics.",
    category: "construction",
  },
  {
    keywords: ["what is mortar", "mortar"],
    question: "What is mortar?",
    answer:
      "Mixture of cement and sand (typically 1:6 ratio) used to join bricks and for plastering. Acts as bonding agent in masonry.",
    category: "construction",
  },
  {
    keywords: ["binding wire"],
    question: "What is binding wire?",
    answer:
      "Annealed wire used to tie steel reinforcement bars together in RCC work. Holds rebars in position during concrete pouring.",
    category: "construction",
  },
  {
    keywords: ["what is shuttering", "formwork"],
    question: "What is shuttering?",
    answer:
      "Temporary wooden or metal mold to hold concrete in desired shape until it hardens. Also called formwork or centering.",
    category: "construction",
  },
  {
    keywords: ["wood for doors", "door material"],
    question: "What wood is used for doors?",
    answer:
      "Teak, sal, or engineered wood. Teak is premium and durable, engineered wood is cost-effective and termite-resistant.",
    category: "construction",
  },
  {
    keywords: ["what is plywood"],
    question: "What is plywood?",
    answer:
      "Engineered wood sheet made of thin wood layers glued together. Used for furniture, false ceilings, and interior work.",
    category: "construction",
  },
  {
    keywords: ["what is waterproofing"],
    question: "What is waterproofing?",
    answer:
      "Treatment to prevent water penetration into structures. Uses chemicals, membranes, or coatings to make surfaces water-resistant.",
    category: "construction",
  },
  {
    keywords: ["waterproofing where", "where waterproofing"],
    question: "Where is waterproofing required?",
    answer:
      "Bathrooms, terraces, roofs, basements, balconies, and water tanks. Prevents seepage, dampness, and structural damage.",
    category: "construction",
  },
  {
    keywords: ["paint primer"],
    question: "What is paint primer?",
    answer:
      "Base coat applied before painting that improves paint adhesion and coverage. Seals the surface and provides uniform texture.",
    category: "construction",
  },
  {
    keywords: ["what is putty", "wall putty"],
    question: "What is putty?",
    answer:
      "Smooth white powder mixed with water, applied before painting for ultra-smooth wall finish. Fills minor imperfections.",
    category: "construction",
  },
  {
    keywords: ["tile adhesive"],
    question: "What is tile adhesive?",
    answer:
      "Modern cement-based material used to fix tiles instead of traditional sand-cement mortar. Provides stronger bonding.",
    category: "construction",
  },
  {
    keywords: ["vitrified tile"],
    question: "What is vitrified tile?",
    answer:
      "High-strength ceramic tile with very low water absorption (< 0.5%). Durable, stain-resistant, and suitable for heavy traffic areas.",
    category: "construction",
  },
  {
    keywords: ["what is granite"],
    question: "What is granite?",
    answer:
      "Natural igneous rock used for flooring, countertops, and cladding. Extremely hard, durable, and available in various colors.",
    category: "construction",
  },
  {
    keywords: ["what is marble"],
    question: "What is marble?",
    answer:
      "Natural metamorphic stone used for premium flooring and wall cladding. Elegant appearance but requires maintenance.",
    category: "construction",
  },
  {
    keywords: ["what is gypsum"],
    question: "What is gypsum?",
    answer:
      "Mineral used for making false ceilings, partition walls, and decorative elements. Lightweight and fire-resistant.",
    category: "construction",
  },
  {
    keywords: ["what is pop", "plaster of paris"],
    question: "What is POP?",
    answer:
      "Plaster of Paris - quick-setting gypsum plaster for decorative finishes, cornices, and moldings. Provides smooth finish.",
    category: "construction",
  },
  {
    keywords: ["glass wool", "insulation"],
    question: "What is glass wool?",
    answer:
      "Fibrous insulation material made from glass fibers. Used for thermal and acoustic insulation in walls and ceilings.",
    category: "construction",
  },
  {
    keywords: ["what is bitumen"],
    question: "What is bitumen?",
    answer:
      "Black viscous petroleum product used for waterproofing and road construction. Applied on terraces and basements.",
    category: "construction",
  },
  {
    keywords: ["pvc pipe"],
    question: "What is PVC pipe?",
    answer:
      "Plastic (PolyVinyl Chloride) pipe used for cold water plumbing and drainage. Economical and corrosion-resistant.",
    category: "construction",
  },
  {
    keywords: ["what is cpvc"],
    question: "What is CPVC?",
    answer:
      "Chlorinated PVC pipe suitable for hot water plumbing. Can withstand temperatures up to 95°C without deformation.",
    category: "construction",
  },
  {
    keywords: ["what is upvc"],
    question: "What is UPVC?",
    answer:
      "Unplasticized PVC used for window frames, door frames, and drainage. More rigid and durable than regular PVC.",
    category: "construction",
  },
  {
    keywords: ["aluminum shutter", "aluminum window"],
    question: "What is aluminum shutter?",
    answer:
      "Lightweight window or door shutter made from aluminum alloy. Corrosion-resistant, durable, and requires minimal maintenance.",
    category: "construction",
  },
  {
    keywords: ["false ceiling"],
    question: "What is false ceiling?",
    answer:
      "Secondary ceiling below the main roof/slab for aesthetics, concealing wiring, and improving acoustics. Made from gypsum or POP.",
    category: "construction",
  },
  {
    keywords: ["what is insulation"],
    question: "What is insulation?",
    answer:
      "Material that reduces heat transfer and sound transmission. Improves energy efficiency and acoustic comfort in buildings.",
    category: "construction",
  },
]

export const siidKnowledgeBase: QAPair[] = SIID_KNOWLEDGE_BASE.map((entry, index) => ({
  id: `siid-${index + 1}`,
  question: entry.question,
  answer: entry.answer,
  category: entry.category,
  subcategory: entry.category,
  difficulty: index < 20 ? "beginner" : index < 100 ? "intermediate" : index < 200 ? "advanced" : "expert",
  tags: entry.keywords.slice(0, 5),
  relatedQuestions: [],
}))

export function searchKnowledgeBase(
  query: string,
  options?: {
    category?: string
    difficulty?: QAPair["difficulty"]
    tags?: string[]
    limit?: number
  },
): QAPair[] {
  const queryLower = query.toLowerCase()
  let results = [...siidKnowledgeBase]

  // Filter by category if specified
  if (options?.category && options.category !== "all") {
    results = results.filter((qa) => qa.category === options.category)
  }

  // Filter by difficulty if specified
  if (options?.difficulty) {
    results = results.filter((qa) => qa.difficulty === options.difficulty)
  }

  // Filter by tags if specified
  if (options?.tags && options.tags.length > 0) {
    results = results.filter((qa) => options.tags!.some((tag) => qa.tags.includes(tag)))
  }

  // Score and sort by relevance
  const scoredResults = results
    .map((qa) => {
      let score = 0
      const searchText = `${qa.question} ${qa.answer} ${qa.tags.join(" ")}`.toLowerCase()

      // Exact match in question gets highest score
      if (qa.question.toLowerCase().includes(queryLower)) {
        score += 100
      }

      // Match in answer
      if (qa.answer.toLowerCase().includes(queryLower)) {
        score += 50
      }

      // Match in tags
      qa.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(queryLower)) {
          score += 25
        }
      })

      // Word matching
      const queryWords = queryLower.split(" ").filter((w) => w.length > 2)
      queryWords.forEach((word) => {
        if (searchText.includes(word)) {
          score += 10
        }
      })

      return { qa, score }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)

  // Apply limit if specified
  const limit = options?.limit || 50
  return scoredResults.slice(0, limit).map((result) => result.qa)
}

export function getCategories(): string[] {
  const categories = new Set(siidKnowledgeBase.map((qa) => qa.category))
  return Array.from(categories).sort()
}

// Function to find the best matching answer (from existing code)
export function findBestAnswer(query: string): KnowledgeEntry | null {
  const queryLower = query.toLowerCase()

  // Score each entry based on keyword matches
  let bestMatch: KnowledgeEntry | null = null
  let highestScore = 0

  for (const entry of SIID_KNOWLEDGE_BASE) {
    let score = 0
    for (const keyword of entry.keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        score += keyword.split(" ").length // Multi-word keywords get higher score
      }
    }
    if (score > highestScore) {
      highestScore = score
      bestMatch = entry
    }
  }

  return highestScore > 0 ? bestMatch : null
}

// Get all entries for a category (from existing code)
export function getEntriesByCategory(category: KnowledgeEntry["category"]): KnowledgeEntry[] {
  return SIID_KNOWLEDGE_BASE.filter((entry) => entry.category === category)
}

// Get suggested questions (from existing code)
export function getSuggestedQuestions(): string[] {
  return SIID_KNOWLEDGE_BASE.slice(0, 8).map((entry) => entry.question)
}
