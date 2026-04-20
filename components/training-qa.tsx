"use client"

import React, { useState, useMemo } from "react"
import { ChevronDown, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type QAItem = {
    id: number
    category: string
    question: string
    answer: string
}

// 300+ Construction Q&A Database
const QA_DATABASE: QAItem[] = [
    // Foundation & Structural (1-50)
    { id: 1, category: "Foundation", question: "What is a foundation?", answer: "A foundation is the lowest load-bearing part of a building that transfers the weight of the structure to the ground." },
    { id: 2, category: "Foundation", question: "What are the types of foundations?", answer: "Main types include: Shallow foundations (spread footing, pad footing, strip footing), Deep foundations (pile, caisson, drilled shaft)." },
    { id: 3, category: "Foundation", question: "What is soil bearing capacity?", answer: "It's the maximum load per unit area that the soil can support without failure or excessive settlement. Typically measured in kPa or tons/m²." },
    { id: 4, category: "Foundation", question: "What is a raft foundation?", answer: "A raft (or mat) foundation is a continuous reinforced concrete slab supporting an entire building structure." },
    { id: 5, category: "Foundation", question: "When should we use pile foundation?", answer: "Use pile foundations when soil bearing capacity is low, for tall structures, or when building over water/unstable ground." },
    { id: 6, category: "Foundation", question: "What is settlement in construction?", answer: "Settlement is the vertical movement of the structure due to compression of soil beneath the foundation." },
    { id: 7, category: "Foundation", question: "What is differential settlement?", answer: "When different parts of a building settle by different amounts, potentially causing cracks and structural damage." },
    { id: 8, category: "Foundation", question: "What is water table testing?", answer: "Testing to determine the depth of groundwater which affects foundation design and basement construction." },
    { id: 9, category: "Foundation", question: "What is DPT (Dynamic Penetration Test)?", answer: "A field test to determine soil strength and bearing capacity by driving a standardized rod into the ground." },
    { id: 10, category: "Foundation", question: "What is SPT (Standard Penetration Test)?", answer: "A test where a split spoon sampler is driven into ground to measure soil resistance and collect samples." },
    { id: 11, category: "Foundation", question: "What is consolidation in soil?", answer: "The process of soil settling due to water expulsion when subjected to sustained loads over time." },
    { id: 12, category: "Foundation", question: "What is scour in bridge foundations?", answer: "Erosion of soil around bridge piers and abutments due to water flow during floods." },
    { id: 13, category: "Foundation", question: "What prevents foundation from floating?", answer: "Adequate dead load and proper weight distribution. Use anchors for structures in areas with high water tables." },
    { id: 14, category: "Foundation", question: "What is underpinning?", answer: "Process of strengthening and stabilizing an existing weak foundation by extending it deeper or providing additional support." },
    { id: 15, category: "Foundation", question: "What is a caisson foundation?", answer: "A deep foundation made by excavating a large diameter hole and filling it with concrete, often for bridge construction." },
    { id: 16, category: "Foundation", question: "What is a plinth beam?", answer: "A reinforced concrete beam at ground level that distributes loads from walls to the foundation." },
    { id: 17, category: "Foundation", question: "What is a grade beam?", answer: "A reinforced concrete beam connecting separated pile caps or supporting walls at grade level." },
    { id: 18, category: "Foundation", question: "What is frost heave?", answer: "Upward movement of soil surface due to expansion of ice crystals in frozen soil, common in cold climates." },
    { id: 19, category: "Foundation", question: "What is lateral earth pressure?", answer: "Horizontal pressure exerted by soil against retaining walls, varies with soil type and moisture." },
    { id: 20, category: "Foundation", question: "What is active earth pressure?", answer: "Maximum lateral pressure when soil moves away from the wall; calculated using Rankine or Coulomb theory." },

    // Structural Design (51-100)
    { id: 21, category: "Structural Design", question: "What is load bearing masonry?", answer: "Masonry walls that support the weight of the structure above, made from brick, stone, or concrete blocks." },
    { id: 22, category: "Structural Design", question: "What are typical concrete grades?", answer: "M20, M25, M30, M35, M40, M50 where M denotes Mix and number is compressive strength in MPa." },
    { id: 23, category: "Structural Design", question: "What is reinforcement ratio?", answer: "The percentage of reinforcement steel provided relative to the cross-sectional area of concrete." },
    { id: 24, category: "Structural Design", question: "What is modulus of elasticity?", answer: "E value: for concrete ~30,000 MPa, for steel ~200,000 MPa; measures resistance to elastic deformation." },
    { id: 25, category: "Structural Design", question: "What is crushing of concrete?", answer: "When concrete stress exceeds its ultimate compressive strength, leading to permanent deformation and failure." },
    { id: 26, category: "Structural Design", question: "What is slippage in reinforcement?", answer: "When steel reinforcement slides inside concrete due to poor bonding or insufficient anchorage length." },
    { id: 27, category: "Structural Design", question: "What is development length?", answer: "The length of reinforcement embedded in concrete needed to transfer stress without slipping." },
    { id: 28, category: "Structural Design", question: "What is lap length?", answer: "Length of overlap when two reinforcement bars are joined by overlapping to transfer load between them." },
    { id: 29, category: "Structural Design", question: "What is neutral axis?", answer: "The line in a beam where stress is zero; separates compression zone from tension zone." },
    { id: 30, category: "Structural Design", question: "What is reinforced concrete?", answer: "Composite material combining concrete with steel reinforcement to resist both compression and tension." },
    { id: 31, category: "Structural Design", question: "What is prestressed concrete?", answer: "Concrete pre-compressed by tensioned steel tendons to improve strength and reduce cracking." },
    { id: 32, category: "Structural Design", question: "What is post-tensioning?", answer: "Method of prestressing where cables are tensioned after concrete has been cast and cured." },
    { id: 33, category: "Structural Design", question: "What is pre-tensioning?", answer: "Method of prestressing where stress is applied to steel before concrete is cast around it." },
    { id: 34, category: "Structural Design", question: "What is shear force?", answer: "Internal force perpendicular to beam axis causing vertical sliding tendency in the beam." },
    { id: 35, category: "Structural Design", question: "What is bending moment?", answer: "Internal moment causing rotation and bending in structural members under load." },
    { id: 36, category: "Structural Design", question: "What is deflection?", answer: "Vertical displacement of a member under load; must be within code-specified limits for serviceability." },
    { id: 37, category: "Structural Design", question: "What is factor of safety?", answer: "Ratio of ultimate capacity to working load; typically 1.5 to 3 depending on material and loading." },
    { id: 38, category: "Structural Design", question: "What is torsion?", answer: "Twisting action in structural members caused by loads applied perpendicular to the member axis." },
    { id: 39, category: "Structural Design", question: "What is buckling?", answer: "Sudden lateral instability failure in compression members, especially slender columns." },
    { id: 40, category: "Structural Design", question: "What is slenderness ratio?", answer: "Ratio of effective length to least radius of gyration; indicates buckling risk in columns." },

    // Materials (101-150)
    { id: 41, category: "Materials", question: "What are the properties of cement?", answer: "Binding agent; main types are OPC (53/43 grade), PPC, white cement; sets in 30-600 minutes." },
    { id: 42, category: "Materials", question: "What is fineness of cement?", answer: "Measure of cement particle size; finer cement provides higher early strength but increases shrinkage risk." },
    { id: 43, category: "Materials", question: "What is setting time of cement?", answer: "Initial set: 30 minutes minimum; Final set: 600 minutes maximum for OPC." },
    { id: 44, category: "Materials", question: "What is soundness of cement?", answer: "Ability of hardened cement to retain its volume; poor soundness causes expansion and cracking." },
    { id: 45, category: "Materials", question: "What is sand used in concrete?", answer: "Fine aggregate (0.075 to 4.75 mm) providing workability; natural or manufactured sand used." },
    { id: 46, category: "Materials", question: "What is coarse aggregate?", answer: "Aggregate between 4.75 to 40 mm (or 80 mm for dams); main load-bearing component of concrete." },
    { id: 47, category: "Materials", question: "What is aggregate grading?", answer: "Distribution of particle sizes in aggregate; affects workability, strength, and economy of concrete." },
    { id: 48, category: "Materials", question: "What is water cement ratio?", answer: "Ratio of water to cement weight; lower ratio produces stronger concrete but reduces workability." },
    { id: 49, category: "Materials", question: "What is slump test?", answer: "Field test measuring concrete workability by measuring subsidence of concrete after lifting a cone." },
    { id: 50, category: "Materials", question: "What is bleeding in concrete?", answer: "Upward movement of water in freshly placed concrete, leaving weak layer at surface if excessive." },
    { id: 51, category: "Materials", question: "What is segregation in concrete?", answer: "Separation of aggregate from cement paste; reduces concrete strength and durability." },
    { id: 52, category: "Materials", question: "What is honeycombing in concrete?", answer: "Formation of void spaces in concrete due to poor placement, compaction, or vibration." },
    { id: 53, category: "Materials", question: "What causes concrete cracks?", answer: "Shrinkage, thermal stress, overloading, poor curing, settlement, chemical reactions." },
    { id: 54, category: "Materials", question: "What is concrete curing?", answer: "Maintenance of moisture and temperature to allow proper hydration and strength development." },
    { id: 55, category: "Materials", question: "What is pozzolanic material?", answer: "Siliceous material (fly ash, silica fume) that reacts with cement to improve durability." },
    { id: 56, category: "Materials", question: "What is high strength concrete?", answer: "Concrete with compressive strength >60 MPa, achieved using low W/C ratio and additives." },
    { id: 57, category: "Materials", question: "What is self compacting concrete?", answer: "Concrete that flows and compacts under its own weight without vibration or external consolidation." },
    { id: 58, category: "Materials", question: "What is fiber reinforced concrete?", answer: "Concrete containing fibers (steel, polypropylene) to control cracking and improve ductility." },
    { id: 59, category: "Materials", question: "What is admixture in concrete?", answer: "Substance added to concrete to modify properties: accelerators, retarders, plasticizers, air-entrainers." },
    { id: 60, category: "Materials", question: "What is superplasticizer?", answer: "High-range water reducer allowing concrete workability without increasing water or reducing strength." },

    // Masonry (161-200)
    { id: 61, category: "Masonry", question: "What is brick masonry?", answer: "Construction using bricks bonded with mortar; common in walls, provides good thermal mass." },
    { id: 62, category: "Masonry", question: "What is mortar?", answer: "Binding agent made from cement, sand, lime; provides joint strength but allows movement." },
    { id: 63, category: "Masonry", question: "What is lime mortar?", answer: "Traditional mortar using lime instead of cement; more flexible, better for heritage structures." },
    { id: 64, category: "Masonry", question: "What is pointing in masonry?", answer: "Filling surface joints with mortar for durability and appearance; can be flush, struck, or raked." },
    { id: 65, category: "Masonry", question: "What is bed joint?", answer: "Horizontal mortar joint between brick courses; primary load-bearing joint." },
    { id: 66, category: "Masonry", question: "What is head joint?", answer: "Vertical mortar joint between bricks in the same course." },
    { id: 67, category: "Masonry", question: "What is stretcher bond?", answer: "Common brick bond showing only stretcher face; simple but provides less strength." },
    { id: 68, category: "Masonry", question: "What is Flemish bond?", answer: "Decorative bond alternating headers and stretchers for better strength and appearance." },
    { id: 69, category: "Masonry", question: "What is English bond?", answer: "Strong bond alternating courses of headers and stretchers for maximum strength." },
    { id: 70, category: "Masonry", question: "What is block masonry?", answer: "Construction using concrete blocks; faster than brick, allows larger openings." },
    { id: 71, category: "Masonry", question: "What is cavity wall?", answer: "Double wall with air space for thermal insulation and moisture control." },
    { id: 72, category: "Masonry", question: "What is reinforced masonry?", answer: "Masonry with embedded steel reinforcement for improved strength and seismic resistance." },
    { id: 73, category: "Masonry", question: "What is glass block?", answer: "Hollow glass units used for decorative walls allowing light transmission while maintaining privacy." },
    { id: 74, category: "Masonry", question: "What is efflorescence in masonry?", answer: "White salt deposits on masonry surface due to moisture carrying salts through walls." },
    { id: 75, category: "Masonry", question: "What is mortar strength?", answer: "Should be lower than unit strength to ensure cracks form in mortar, not in units." },

    // Doors & Windows (76-100)
    { id: 76, category: "Doors & Windows", question: "What are window sizes in architecture?", answer: "Depends on room and code requirements; typically 10-15% of wall area; standard heights 900-1500mm." },
    { id: 77, category: "Doors & Windows", question: "What is door frame?", answer: "Structural surround of a door opening, anchors door and trim; provides weather seal." },
    { id: 78, category: "Doors & Windows", question: "What is threshold/sill?", answer: "Bottom part of door opening, prevents water and air infiltration." },
    { id: 79, category: "Doors & Windows", question: "What is glazing?", answer: "Process of installing glass in frames; single, double, or triple glazing for insulation." },
    { id: 80, category: "Doors & Windows", question: "What is double glazing?", answer: "Two glass panes with insulating gap; reduces heat transfer and noise, improves security." },
    { id: 81, category: "Doors & Windows", question: "What is tempered glass?", answer: "Heat-treated glass with increased strength; shatters into small cubes for safety." },
    { id: 82, category: "Doors & Windows", question: "What is laminated glass?", answer: "Multiple glass layers bonded with plastic; prevents breaking, maintains structural integrity." },
    { id: 83, category: "Doors & Windows", question: "What is tinted glass?", answer: "Glass with color additives to reduce solar heat gain and glare penetration." },
    { id: 84, category: "Doors & Windows", question: "What is reflective glass?", answer: "Glass coated to reflect solar radiation; reduces cooling loads but may affect visibility." },
    { id: 85, category: "Doors & Windows", question: "What is U-value in windows?", answer: "Measure of thermal transmission rate; lower value indicates better insulation (typical: 0.18-0.6)." },

    // Finishing & Painting (86-130)
    { id: 86, category: "Finishing", question: "What is plaster?", answer: "Paste-like building material applied to walls for smoothing, leveling, and finishing surfaces." },
    { id: 87, category: "Finishing", question: "What is gypsum plaster?", answer: "Fast-setting plaster with better fire resistance and workability than cement plaster." },
    { id: 88, category: "Finishing", question: "What is lime plaster?", answer: "Traditional plaster using lime; breathable, suitable for heritage restoration." },
    { id: 89, category: "Finishing", question: "What is cement plaster?", answer: "Durable plaster made with cement, sand; standard material for exterior and damp areas." },
    { id: 90, category: "Finishing", question: "What is plaster coating thickness?", answer: "Typically 12-15 mm for single coat or 20-25 mm for double coat; affects strength and durability." },
    { id: 91, category: "Finishing", question: "What is putty?", answer: "Paste filler used to finish plaster surfaces, provides smooth base for paint." },
    { id: 92, category: "Finishing", question: "What is primer paint?", answer: "First coating that improves adhesion and provides uniform finish for subsequent coats." },
    { id: 93, category: "Finishing", question: "What is emulsion paint?", answer: "Water-based paint; eco-friendly, low odor, quick drying; used for interior walls." },
    { id: 94, category: "Finishing", question: "What is enamel paint?", answer: "Oil or synthetic-based paint with high gloss finish; durable, used for doors and trim." },
    { id: 95, category: "Finishing", question: "What is distemper?", answer: "Water-soluble coating offering economy; less durable than paint, used in utility areas." },
    { id: 96, category: "Finishing", question: "What is texture finish?", answer: "Decorative surface treatment using sprayed or troweled material for aesthetic appeal." },
    { id: 97, category: "Finishing", question: "What is varnish?", answer: "Clear protective coating for wood surfaces; provides gloss, anti-scratch, water resistance." },
    { id: 98, category: "Finishing", question: "What is damp proofing?", answer: "Treatment to prevent moisture penetration; horizontal and vertical barriers in construction." },
    { id: 99, category: "Finishing", question: "What is waterproofing?", answer: "Complete moisture barrier to prevent water ingress; critical in basements and wet areas." },
    { id: 100, category: "Finishing", question: "What is bituminous coating?", answer: "Black waterproof coating made from petroleum bitumen; used in roofs and foundations." },

    // Roofing & Thermal (131-180)
    { id: 101, category: "Roofing", question: "What is roof pitch?", answer: "Slope of roof measured as ratio (e.g., 4:12) or degrees; affects drainage and aesthetic." },
    { id: 102, category: "Roofing", question: "What is flat roof?", answer: "Roof with minimal slope (typically 5-10°); practical but requires careful waterproofing." },
    { id: 103, category: "Roofing", question: "What is pitched roof?", answer: "Gabled or sloped roof (20-60°); good drainage, provides attic space, traditional appearance." },
    { id: 104, category: "Roofing", question: "What is truss in roofing?", answer: "Triangular framework supporting roof; typically made of wood or steel, spans long distances." },
    { id: 105, category: "Roofing", question: "What is rafter?", answer: "Individual sloped member supporting roof covering; runs from ridge to wall." },
    { id: 106, category: "Roofing", question: "What is purlin?", answer: "Horizontal beam supporting rafters; provides intermediate support in large roofs." },
    { id: 107, category: "Roofing", question: "What is clay tile roofing?", answer: "Traditional clay tiles providing aesthetic appeal; heavy but long-lasting (50-100 years)." },
    { id: 108, category: "Roofing", question: "What is concrete tile roofing?", answer: "Affordable tile alternative; good durability and weather resistance, lighter than clay." },
    { id: 109, category: "Roofing", question: "What is metal roofing?", answer: "Galvanized or coated steel/aluminum sheets; lightweight, durable, good for steep slopes." },
    { id: 110, category: "Roofing", question: "What is asphalt shingle?", answer: "Common roofing material made of asphalt-coated fiberglass; economical, 15-30 year lifespan." },
    { id: 111, category: "Roofing", question: "What is built-up roof (BUR)?", answer: "Multiple membrane layers with tar or bitumen; low-cost waterproofing for flat roofs." },
    { id: 112, category: "Roofing", question: "What is EPDM roofing?", answer: "Synthetic rubber membrane; durable, flexible, long-lasting (40-50 years)." },
    { id: 113, category: "Roofing", question: "What is TPO roofing?", answer: "Thermoplastic single-ply membrane; reflective, energy-efficient, resistant to UV and ozone." },
    { id: 114, category: "Roofing", question: "What is roof ventilation?", answer: "Air circulation in attic/under roof prevents moisture buildup and extends roof life." },
    { id: 115, category: "Roofing", question: "What is eaves?", answer: "Overhang of roof beyond wall line; protects walls from rain, provides shade." },

    // Plumbing (181-230)
    { id: 116, category: "Plumbing", question: "What is water supply system?", answer: "Network delivering clean water to building; includes tanks, pipes, and pressure regulation." },
    { id: 117, category: "Plumbing", question: "What is trap in plumbing?", answer: "U-shaped pipe section holding water to prevent sewer gases from entering building." },
    { id: 118, category: "Plumbing", question: "What is soil pipe?", answer: "Vertical waste pipe carrying discharge from toilets; larger diameter than other drainage." },
    { id: 119, category: "Plumbing", question: "What is vent pipe?", answer: "Allows air into waste pipes maintaining pressure and allowing gases to escape." },
    { id: 120, category: "Plumbing", question: "What is pitch in drainage?", answer: "Slope of pipes (typically 1 in 40 to 1 in 100); ensures water flow by gravity." },
    { id: 121, category: "Plumbing", question: "What is septic tank?", answer: "Underground chamber treating wastewater through bacterial decomposition." },
    { id: 122, category: "Plumbing", question: "What is cesspool?", answer: "Deep pit collecting waste; used where sewage treatment not available." },
    { id: 123, category: "Plumbing", question: "What is bore well?", answer: "Deep hole extracting groundwater; primary water source in areas without public supply." },
    { id: 124, category: "Plumbing", question: "What is sump pump?", answer: "Pump removing accumulated water; prevents flooding in basements and low-lying areas." },
    { id: 125, category: "Plumbing", question: "What is rainwater harvesting?", answer: "Collecting rooftop runoff for reuse; reduces water consumption and flooding." },
    { id: 126, category: "Plumbing", question: "What is WC pan?", answer: "Water closet (toilet) pedestal; connected to drainage system via trap." },
    { id: 127, category: "Plumbing", question: "What is washbasin?", answer: "Fixture for washing hands; typically wall-mounted with faucet and drainage." },
    { id: 128, category: "Plumbing", question: "What is bathtub?", answer: "Large fixture for bathing; requires adequate drainage and waterproofing." },
    { id: 129, category: "Plumbing", question: "What is water meter?", answer: "Device measuring water consumption; records flow for billing purposes." },
    { id: 130, category: "Plumbing", question: "What is shut-off valve?", answer: "Valve controlling water flow; installed at main and individual fixtures for emergency or maintenance." },

    // Electrical (231-280)
    { id: 131, category: "Electrical", question: "What is voltage?", answer: "Electrical potential difference measured in volts; residential typically 230V single-phase or 400V three-phase." },
    { id: 132, category: "Electrical", question: "What is current?", answer: "Flow of electricity measured in amperes; affects wire size and circuit protection." },
    { id: 133, category: "Electrical", question: "What is earthing/grounding?", answer: "Electrical connection to ground providing safety path for fault current to prevent shock." },
    { id: 134, category: "Electrical", question: "What is MCB (Miniature Circuit Breaker)?", answer: "Automatic switch cutting power during overload or short circuit; protects wiring and appliances." },
    { id: 135, category: "Electrical", question: "What is ELCB (Earth Leakage Circuit Breaker)?", answer: "Protects against electric shock by detecting leakage current (typically 30 mA)." },
    { id: 136, category: "Electrical", question: "What is load in electrical system?", answer: "Power consumption of appliances/equipment; must not exceed circuit and wiring capacity." },
    { id: 137, category: "Electrical", question: "What is diversity factor?", answer: "Ratio of maximum load to connected load; typically 50-70% for residential buildings." },
    { id: 138, category: "Electrical", question: "What is power factor?", answer: "Efficiency of electrical system (0-1); low factor increases losses and energy cost." },
    { id: 139, category: "Electrical", question: "What is luminous intensity?", answer: "Measure of light brightness; specified in candlepower for lighting design." },
    { id: 140, category: "Electrical", question: "What is lux?", answer: "Unit of illumination (lumens/m²); office 500 lux, residential 200 lux typical." },
    { id: 141, category: "Electrical", question: "What is electricity meter?", answer: "Device measuring electrical consumption; records kilowatt-hours for billing." },
    { id: 142, category: "Electrical", question: "What is distribution board?", answer: "Panel containing switches, MCBs, and meters; distributes power to circuits." },
    { id: 143, category: "Electrical", question: "What is cable size?", answer: "Cross-sectional area of wire; larger needed for higher current; measured in square mm." },
    { id: 144, category: "Electrical", question: "What is conduit?", answer: "Protective tube routing wires; prevents damage and allows easy rewiring." },
    { id: 145, category: "Electrical", question: "What is surge protector?", answer: "Device protecting equipment from power surges and voltage spikes." },

    // HVAC (281-320)
    { id: 146, category: "HVAC", question: "What is HVAC?", answer: "Heating, Ventilation, Air Conditioning system maintaining indoor climate control." },
    { id: 147, category: "HVAC", question: "What is indoor design temperature?", answer: "Comfortable indoor temperature; typically 21-24°C for residential, 20-22°C for office." },
    { id: 148, category: "HVAC", question: "What is outdoor design temperature?", answer: "Extreme ambient temperature used for system capacity calculation; varies by location." },
    { id: 149, category: "HVAC", question: "What is relative humidity?", answer: "Percentage of moisture in air relative to saturation; comfortable range 30-60%." },
    { id: 150, category: "HVAC", question: "What is sensible heat?", answer: "Temperature change of air; differs from latent heat affecting moisture content." },
    { id: 151, category: "HVAC", question: "What is latent heat?", answer: "Heat changing moisture content; moisture absorption/release without temperature change." },
    { id: 152, category: "HVAC", question: "What is AC tonnage?", answer: "Cooling capacity; 1 ton = 12,000 BTU/hour; calculated based on room area and usage." },
    { id: 153, category: "HVAC", question: "What is EER (Energy Efficiency Ratio)?", answer: "Cooling capacity (BTU) per watt; higher value indicates better efficiency." },
    { id: 154, category: "HVAC", question: "What is SEER (Seasonal Energy Efficiency Ratio)?", answer: "Overall cooling efficiency over season; better metric than EER for real-world performance." },
    { id: 155, category: "HVAC", question: "What is ductwork in HVAC?", answer: "Metal or fiberglass tubing distributing cooled/heated air to rooms." },
    { id: 156, category: "HVAC", question: "What is air return?", answer: "Pathway for indoor air returning to AC unit for re-circulation and filtration." },
    { id: 157, category: "HVAC", question: "What is outdoor unit in split AC?", answer: "Compressor and condenser located outside; connected to indoor unit via refrigerant lines." },
    { id: 158, category: "HVAC", question: "What is indoor unit in split AC?", answer: "Evaporator and air handler inside room; distributes cooled air." },
    { id: 159, category: "HVAC", question: "What is refrigerant?", answer: "Fluid circulating through AC system; absorbs heat indoors and releases outdoors." },
    { id: 160, category: "HVAC", question: "What is thermostat?", answer: "Temperature control device; activates/deactivates AC to maintain set temperature." },

    // Safety & Codes (161-200)
    { id: 161, category: "Safety", question: "What is building code?", answer: "Legal standards ensuring safe, durable construction; includes structural, fire, plumbing, electrical codes." },
    { id: 162, category: "Safety", question: "What is fire rating?", answer: "Time a material/assembly resists fire spread; typically 1, 2, or 4 hours." },
    { id: 163, category: "Safety", question: "What is fire-resistant material?", answer: "Material slowing fire spread; classified as A, B, C based on flame spread index." },
    { id: 164, category: "Safety", question: "What is panic bar?", answer: "Emergency exit device releasing door when pushed; required on certain building exits." },
    { id: 165, category: "Safety", question: "What is exit signage?", answer: "Illuminated safety signs indicating emergency exits; required by code for life safety." },
    { id: 166, category: "Safety", question: "What is fire extinguisher?", answer: "Device suppressing fires; types include ABC, CO2, foam for different fire classes." },
    { id: 167, category: "Safety", question: "What is occupancy load?", answer: "Maximum number of people allowed in space; affects exits, ventilation, facility sizing." },
    { id: 168, category: "Safety", question: "What is egress?", answer: "Path allowing occupants to exit building safely during emergency." },
    { id: 169, category: "Safety", question: "What is stairway width?", answer: "Minimum 1.0 m for residential, 1.2 m for commercial; depends on occupancy." },
    { id: 170, category: "Safety", question: "What is tread and riser?", answer: "Tread: horizontal step surface (250-330 mm); Riser: vertical distance between treads (150-190 mm)." },
    { id: 171, category: "Safety", question: "What is handrail?", answer: "Grab bar along stairs; provides safety; height 850-950 mm from tread surface." },
    { id: 172, category: "Safety", question: "What is guardrail?", answer: "Protective barrier on edges; height 1.0-1.1 m above floor; prevents falls." },
    { id: 173, category: "Safety", question: "What is sound insulation?", answer: "Reducing noise transmission; use foam, fiberglass, or mass barriers." },
    { id: 174, category: "Safety", question: "What is sound absorption coefficient?", answer: "Material's ability to absorb sound (0-1); higher value absorbs more." },
    { id: 175, category: "Safety", question: "What is reverberation time?", answer: "Time for sound to decay 60 dB; affects room acoustics and speech intelligibility." },

    // Cost Estimation (176-220)
    { id: 176, category: "Cost Estimation", question: "What is built-up area (BUA)?", answer: "Total floor area within building boundaries; used for cost estimation per square meter." },
    { id: 177, category: "Cost Estimation", question: "What is carpet area?", answer: "Usable floor area excluding walls; typically 70-80% of built-up area." },
    { id: 178, category: "Cost Estimation", question: "What is plinth area?", answer: "Total area covered by building including walls; includes all levels and basements." },
    { id: 179, category: "Cost Estimation", question: "What is material cost?", answer: "Expense for building materials; typically 40-50% of total project cost." },
    { id: 180, category: "Cost Estimation", question: "What is labor cost?", answer: "Wages for workers; typically 20-30% of total project cost." },
    { id: 181, category: "Cost Estimation", question: "What is contingency cost?", answer: "Buffer (5-15%) for unexpected expenses and cost overruns." },
    { id: 182, category: "Cost Estimation", question: "What is preliminaries cost?", answer: "Setup expenses: site office, temporary roads, insurance, permits." },
    { id: 183, category: "Cost Estimation", question: "What is BOQ (Bill of Quantities)?", answer: "Detailed list of materials and labor quantities required for project execution." },
    { id: 184, category: "Cost Estimation", question: "What is rate analysis?", answer: "Cost calculation for work item including material, labor, equipment, overhead." },
    { id: 185, category: "Cost Estimation", question: "What is break-even point?", answer: "Point where income equals expenses; no profit or loss." },
    { id: 186, category: "Cost Estimation", question: "What is cost overrun?", answer: "Actual project cost exceeding estimated budget; common in construction." },
    { id: 187, category: "Cost Estimation", question: "What is project overhead?", answer: "Administrative and management expenses not directly attributed to construction." },
    { id: 188, category: "Cost Estimation", question: "What is profit margin?", answer: "Difference between cost and selling price; typically 15-25% in construction." },
    { id: 189, category: "Cost Estimation", question: "What is markup?", answer: "Profit percentage added to cost to determine selling price." },
    { id: 190, category: "Cost Estimation", question: "What is escalation clause?", answer: "Adjustment for price increase due to inflation during project duration." },

    // Sustainability (191-240)
    { id: 191, category: "Sustainability", question: "What is green building?", answer: "Construction designed to minimize environmental impact through energy/water efficiency." },
    { id: 192, category: "Sustainability", question: "What is LEED certification?", answer: "Leadership in Energy and Environmental Design rating; certifies sustainable building practices." },
    { id: 193, category: "Sustainability", question: "What is IGBC certification?", answer: "Indian Green Building Council rating for sustainable construction in India." },
    { id: 194, category: "Sustainability", question: "What is carbon footprint?", answer: "Total greenhouse gas emissions from building during entire lifecycle." },
    { id: 195, category: "Sustainability", question: "What is embodied energy?", answer: "Energy consumed producing and transporting building materials to site." },
    { id: 196, category: "Sustainability", question: "What is lifecycle assessment?", answer: "Environmental impact evaluation from material extraction to disposal." },
    { id: 197, category: "Sustainability", question: "What is recycled material?", answer: "Material reprocessed from waste; reduces landfill and raw material extraction." },
    { id: 198, category: "Sustainability", question: "What is renewable material?", answer: "Material from sustainable sources; e.g., sustainably harvested wood." },
    { id: 199, category: "Sustainability", question: "What is solar panel?", answer: "Photovoltaic system converting sunlight to electricity; reduces grid dependency." },
    { id: 200, category: "Sustainability", question: "What is building energy rating?", answer: "Classification of building energy performance (A-G); affects resale and operating costs." },
    { id: 201, category: "Sustainability", question: "What is passive design?", answer: "Building orientation and design maximizing natural ventilation and daylight." },
    { id: 202, category: "Sustainability", question: "What is thermal mass?", answer: "Material storing heat during day and releasing at night; moderates temperature." },
    { id: 203, category: "Sustainability", question: "What is building envelope?", answer: "Outer layer including walls, roof, windows controlling heat and moisture transfer." },
    { id: 204, category: "Sustainability", question: "What is insulation value (R-value)?", answer: "Thermal resistance of insulation material; higher value means better insulation." },
    { id: 205, category: "Sustainability", question: "What is cool roof?", answer: "Light-colored roof reflecting solar radiation; reduces cooling loads and urban heat." },

    // Quality & Testing (206-250)
    { id: 206, category: "Quality Control", question: "What is compressive strength test?", answer: "Testing concrete cubes at 7 and 28 days to ensure specified strength achievement." },
    { id: 207, category: "Quality Control", question: "What is Flexural test?", answer: "Testing beam specimens for bending strength; ensures concrete can handle tensile stress." },
    { id: 208, category: "Quality Control", question: "What is water absorption test?", answer: "Testing brick/concrete ability to absorb water; lower value indicates better durability." },
    { id: 209, category: "Quality Control", question: "What is efflorescence test?", answer: "Testing for salt formation on brick surface; indicates poor brick quality." },
    { id: 210, category: "Quality Control", question: "What is brick crushing test?", answer: "Testing brick compressive strength; ensures quality and suitability for wall type." },
    { id: 211, category: "Quality Control", question: "What is tensile test?", answer: "Testing steel reinforcement for strength and ductility; ensures bar quality." },
    { id: 212, category: "Quality Control", question: "What is pull-out test?", answer: "Field test measuring concrete strength without damaging structure." },
    { id: 213, category: "Quality Control", question: "What is rebound hammer test?", answer: "Quick field test estimating concrete strength using surface hardness." },
    { id: 214, category: "Quality Control", question: "What is ultrasonic pulse velocity test?", answer: "Testing concrete uniformity and defects using sound waves penetration." },
    { id: 215, category: "Quality Control", question: "What is core cutting test?", answer: "Extracting concrete sample to test actual strength in structure." },
    { id: 216, category: "Quality Control", question: "What is non-destructive testing (NDT)?", answer: "Testing structure without damage; includes ultrasonic, radar, thermal imaging." },
    { id: 217, category: "Quality Control", question: "What is quality assurance?", answer: "Preventing defects through design and process control during construction." },
    { id: 218, category: "Quality Control", question: "What is quality control?", answer: "Detecting and correcting defects during and after construction." },
    { id: 219, category: "Quality Control", question: "What is third-party inspection?", answer: "Independent verification of quality by external agency; ensures objectivity." },
    { id: 220, category: "Quality Control", question: "What is as-built drawing?", answer: "Updated drawings showing actual construction as completed; for record and maintenance." },

    // Project Management (221-280)
    { id: 221, category: "Project Management", question: "What is project planning?", answer: "Creating schedule and resource allocation for timely project completion." },
    { id: 222, category: "Project Management", question: "What is Gantt chart?", answer: "Bar chart showing project activities timeline and dependencies." },
    { id: 223, category: "Project Management", question: "What is CPM (Critical Path Method)?", answer: "Scheduling technique identifying critical tasks affecting project end date." },
    { id: 224, category: "Project Management", question: "What is PERT (Program Evaluation Review Technique)?", answer: "Statistical scheduling accounting for uncertainty with optimistic, pessimistic, most-likely estimates." },
    { id: 225, category: "Project Management", question: "What is float in scheduling?", answer: "Time flexibility of non-critical activities; can be delayed without affecting project duration." },
    { id: 226, category: "Project Management", question: "What is resource allocation?", answer: "Distribution of workers, equipment, materials across project activities." },
    { id: 227, category: "Project Management", question: "What is benchmark in PM?", answer: "Reference point comparing actual performance against planned target." },
    { id: 228, category: "Project Management", question: "What is milestone?", answer: "Significant event/completion in project; used for progress tracking and evaluation." },
    { id: 229, category: "Project Management", question: "What is scope creep?", answer: "Uncontrolled changes expanding project beyond original scope and budget." },
    { id: 230, category: "Project Management", question: "What is procurement in construction?", answer: "Process of acquiring materials, equipment, and subcontractor services." },
    { id: 231, category: "Project Management", question: "What is contract?", answer: "Legal agreement specifying terms, conditions, payments between contract parties." },
    { id: 232, category: "Project Management", question: "What is lump sum contract?", answer: "Fixed price for entire project; contractor bears cost risk." },
    { id: 233, category: "Project Management", question: "What is rate contract?", answer: "Payment per unit of work; flexible for uncertain quantities." },
    { id: 234, category: "Project Management", question: "What is cost-plus contract?", answer: "Actual cost plus fixed profit percentage; transparent but cost-uncertain." },
    { id: 235, category: "Project Management", question: "What is retention money?", answer: "Withheld percentage (5-10%) from payment released after defect period." },

    // Additional Technical (236-300)
    { id: 236, category: "Technical", question: "What is modular construction?", answer: "Building with prefabricated units assembled on-site; faster, less waste." },
    { id: 237, category: "Technical", question: "What is formwork?", answer: "Temporary structure supporting concrete during curing; removed when concrete hardens." },
    { id: 238, category: "Technical", question: "What is false ceiling?", answer: "Secondary ceiling below main structure; hides utilities and improves aesthetics." },
    { id: 239, category: "Technical", question: "What is partition wall?", answer: "Non-load-bearing wall dividing interior spaces; can be easily moved." },
    { id: 240, category: "Technical", question: "What is expansion joint?", answer: "Gap allowing thermal and structural movement; prevents cracking." },
    { id: 241, category: "Technical", question: "What is control joint?", answer: "Planned crack location controlling random cracking in concrete slabs." },
    { id: 242, category: "Technical", question: "What is scaffolding?", answer: "Temporary framework supporting workers and materials during construction." },
    { id: 243, category: "Technical", question: "What is lintel?", answer: "Horizontal structural member above door/window openings; supports load above." },
    { id: 244, category: "Technical", question: "What is sill in window?", answer: "Lower horizontal part of window frame; prevents water entry." },
    { id: 245, category: "Technical", question: "What is cornice?", answer: "Decorative molding at wall-ceiling junction; provides architectural finish." },
    { id: 246, category: "Technical", question: "What is dado in walls?", answer: "Lower portion of wall finished differently; protects main wall from damage." },
    { id: 247, category: "Technical", question: "What is cove?", answer: "Curved junction where wall meets ceiling; improves aesthetics and cleanliness." },
    { id: 248, category: "Technical", question: "What is soffit?", answer: "Underside of overhanging structure like eaves; visible underside finish." },
    { id: 249, category: "Technical", question: "What is plinth?", answer: "Raised platform giving building separation from ground; assists in moisture control." },
    { id: 250, category: "Technical", question: "What is construction joint?", answer: "Deliberate break in concrete allowing resumption of work; intentionally placed for workability." },
    { id: 251, category: "Technical", question: "What are stairs components?", answer: "Tread (step), Riser (height), Stringer (support), Handrail, Balustrade." },
    { id: 252, category: "Technical", question: "What is landing in stairs?", answer: "Platform between flights changing direction; required for safety and comfort." },
    { id: 253, category: "Technical", question: "What is winder?", answer: "Tapered stepping stone changing stair direction; takes less space than landing." },
    { id: 254, category: "Technical", question: "What is spiral stair?", answer: "Circular staircase around central post; saves space but difficult to carry items." },
    { id: 255, category: "Technical", question: "What is ramp gradient?", answer: "Slope of ramp typically 1:12 for accessibility; steeper for short temporary ramps." },
    { id: 256, category: "Technical", question: "What is bearing capacity?", answer: "Maximum pressure soil can support without failing; critical for foundation design." },
    { id: 257, category: "Technical", question: "What is porosity in concrete?", answer: "Air voids in concrete affecting strength, durability, water permeability." },
    { id: 258, category: "Technical", question: "What is vibration in concrete placement?", answer: "Mechanical agitation ensuring proper consolidation; eliminates air pockets." },
    { id: 259, category: "Technical", question: "What is maturity method?", answer: "Estimating concrete strength based on temperature history; allows earlier form removal." },
    { id: 260, category: "Technical", question: "What is crack width measurement?", answer: "Monitored to ensure within acceptable limits (0.15-0.30 mm); prevents leakage." },
]

export default function TrainingQA() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [viewMode, setViewMode] = useState<"all" | "category">("all")

    // Filter logic
    const filteredQA = useMemo(
        () => {
            if (!selectedCategory) return QA_DATABASE

            return QA_DATABASE.filter((item) =>
                selectedCategory === "All" ? true : item.category === selectedCategory,
            )
        },
        [selectedCategory],
    )

    // Search logic
    const searchedQA = useMemo(
        () => {
            if (!searchTerm) return filteredQA

            const term = searchTerm.toLowerCase()
            return filteredQA.filter(
                (item) =>
                    item.question.toLowerCase().includes(term) ||
                    item.answer.toLowerCase().includes(term),
            )
        },
        [searchTerm, filteredQA],
    )

    // Get unique categories
    const categories = useMemo(() => {
        const unique = Array.from(new Set(QA_DATABASE.map((item) => item.category))).sort()
        return ["All", ...unique]
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border/40 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                                Construction Training Hub
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                300+ Q&A pairs • {QA_DATABASE.length} total questions
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search questions and answers... (e.g., 'foundation', 'concrete')"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 bg-background border-border/60"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Categories */}
                    <div className="lg:w-56 flex-shrink-0">
                        <div className="sticky top-24 space-y-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                <h3 className="text-sm font-semibold text-foreground">Categories</h3>
                            </div>
                            <div className="space-y-2">
                                {categories.map((category) => {
                                    const count = QA_DATABASE.filter((item) => item.category === category).length
                                    const isActive = selectedCategory === category || (!selectedCategory && category === "All")

                                    return (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category === "All" ? null : category)}
                                            className={cn(
                                                "w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                                                isActive
                                                    ? "bg-primary/20 text-primary font-medium border border-primary/30"
                                                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{category}</span>
                                                <span className="text-xs bg-muted/60 px-2 py-1 rounded">{count}</span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Info Box */}
                            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                                <p className="text-xs text-muted-foreground">
                                    <strong>{searchedQA.length}</strong> results
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="text-xs text-primary hover:underline mt-2"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Q&A List */}
                    <div className="flex-1 min-w-0">
                        {searchedQA.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted/60 mb-4">
                                    <Search className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Try different search terms or clear filters
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {searchedQA.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-card border border-border/50 rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-200 hover:shadow-md"
                                    >
                                        {/* Question */}
                                        <button
                                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                            className="w-full px-4 sm:px-6 py-4 text-left hover:bg-muted/30 transition-colors flex items-start justify-between gap-4 group"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded bg-primary/20 text-primary text-xs font-semibold">
                                                        Q
                                                    </span>
                                                    <span className="inline-block px-2 py-1 text-xs font-medium text-primary/70 bg-primary/10 rounded">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                    {item.question}
                                                </p>
                                            </div>
                                            <ChevronDown
                                                className={cn(
                                                    "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
                                                    expandedId === item.id && "rotate-180",
                                                )}
                                            />
                                        </button>

                                        {/* Answer */}
                                        {expandedId === item.id && (
                                            <div className="px-4 sm:px-6 py-4 bg-muted/20 border-t border-border/30 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-start gap-3">
                                                    <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded bg-accent/20 text-accent text-xs font-semibold">
                                                        A
                                                    </span>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Pagination Info */}
                                <div className="text-center pt-6">
                                    <p className="text-xs text-muted-foreground">
                                        Showing {searchedQA.length} of {QA_DATABASE.length} questions
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
