# MEP Systems Implementation Guide

## Overview

The MEP (Mechanical, Electrical, Plumbing) Systems section has been integrated into the project creation workflow to ensure AI-generated designs include proper MEP layouts based on user requirements.

## MEP Components & Configuration

### 1. Mechanical Systems (HVAC)

**Options Available:**
- **Window AC** - Budget-friendly, single room cooling
- **Split AC** - Standard Multi-room cooling
- **Central AC** - Whole building air conditioning
- **VRF (Variable Refrigerant Flow)** - Premium, zone-based cooling
- **Natural Ventilation** - Passive cooling with openings

**Impact on Design:**
- Determines ductwork routing and placement
- Affects outdoor unit locations
- Influences room dimensions and ceiling heights
- Impacts load calculations and equipment sizing

**Cost Implications:**
- Window AC: ₹80/sq ft
- Split AC: ₹120/sq ft
- Central AC: ₹180/sq ft
- VRF: ₹250/sq ft
- Natural Ventilation: ₹30/sq ft

### 2. Electrical Systems

**Load Categories:**
- **Standard** - Residential typical loads (4-6 kW)
- **High** - Commercial/Mixed use (10-15 kW)
- **Very High** - Industrial/Data centers (20+ kW)

**Impact on Design:**
- Main panel location and capacity
- Substation/transformer requirements
- Cable routing and conduit sizing
- Distribution board placement
- Emergency lighting and backup considerations

**Cost Implications:**
- Standard Load: ₹80/sq ft
- High Load: ₹150/sq ft
- Very High Load: ₹250/sq ft

### 3. Water Supply Systems

**System Types:**
- **Municipal** - Direct connection to municipal supply
  - Simple meter and filters
  - Cost: ₹60/sq ft

- **Borewell** - Ground water extraction
  - Includes pump, motor, overhead tank
  - Cost: ₹80/sq ft + ₹2L equipment

- **Hybrid** - Municipal + Borewell for redundancy
  - Dual source with automatic switching
  - Cost: ₹100/sq ft + ₹3L equipment

- **Recycled/Treated** - With greywater treatment
  - Treatment plant + storage tanks
  - Cost: ₹150/sq ft + ₹4L treatment system

**Impact on Design:**
- Water tank location (roof/underground)
- Pump room size and ventilation
- Pipe routing through walls/floors
- Pressure requirements and boosting

### 4. Drainage Systems

**System Types:**
- **Municipal** - Connection to city sewage network
  - Simple gravity drainage
  - Cost: ₹40/sq ft

- **Septic** - On-site treatment for smaller projects
  - Includes septic tank and soak pit
  - Cost: ₹80/sq ft + ₹1.5L tank

- **Treatment Plant** - For larger or eco-conscious projects
  - Full biological treatment system
  - Cost: ₹150/sq ft + ₹4L treatment plant

**Impact on Design:**
- Drainage slope requirements (1:100 gradient)
- Septic tank location and accessibility
- Soak pit area requirements
- Vents and inspection chambers placement

### 5. Safety Features

#### Fire Extinguishing System
- **Includes:** Sprinklers, hydrants, fire alarm
- **Cost:** ₹30/sq ft
- **Requirements:**
  - Water source (dedicated tank or municipal)
  - Pump room with pressure gauge
  - Pipe network with sprinkler heads
  - Emergency exit signage

#### Backup Power (Generator)
- **Includes:** Generator, fuel tank, ATS panel
- **Cost:** ₹2L
- **Requirements:**
  - Outdoor generator room with ventilation
  - Fuel storage area away from main building
  - Automatic Transfer Switch (ATS) in electrical panel
  - Sound insulation enclosure

### 6. Sustainability Features

#### Solar Integration
- **Includes:** Solar panels on terrace/walls
- **Cost:** ₹150/sq ft
- **Considerations:**
  - Terrace load capacity analysis
  - String inverters or microinverters
  - Battery storage options
  - Grid tie-in or hybrid system

#### Rainwater Harvesting
- **Includes:** Collection, filtration, storage
- **Cost:** ₹1.5L
- **System Components:**
  - Roof catchment area
  - First-flush diverter
  - Sand/charcoal filters
  - Sump/storage tank
  - Recharge boring to groundwater

## MEP Layout Generation

When these requirements are selected, the AI design system generates:

### 1. MEP Drawings Include:
- **Mechanical Plan:** HVAC ductwork, equipment locations
- **Electrical Plan:** Panel locations, outlets, switches, lighting
- **Plumbing Plan:** Water supply lines, drainage routes
- **Fire Safety Plot:** Sprinkler heads, hydrants, alarms

### 2. Integration Points:
- **3D Model:** MEP equipment shown in their actual locations
- **Floor Plans:** MEP routes overlaid with architectural plans
- **Sections:** Ductwork, pipes shown in vertical cuts
- **Specifications:** Material lists, equipment details

### 3. CoordinationRules:
- MEP doesn't interfere with structural columns/beams
- Adequate clearances maintained
- Service accessibility preserved
- Maintenance spaces allocated

## Data Flow

```
User Selections (Step 3)
    ↓
Requirements State Updated
    ↓
Budget Calculation (MEP Costs Added)
    ↓
Project Data Created
    ↓
Sent to Design Generation API
    ↓
AI Generates MEP Layouts
    ↓
Displays in Design Variants
```

## MEP Cost Calculations in Budget

### Breakdown by System:

**HVAC System:**
- Selected system cost calculated per sq ft
- Central systems add planning/coordination costs
- VRF systems include smart controls

**Electrical System:**
- Based on load category selected
- Includes panel, wiring, fixtures
- Smart/automated systems add premium

**Water Systems:**
- Supply system cost (municipal cheapest, recycled most expensive)
- Drainage system cost (municipal cheapest, treatment plant most expensive)
- Tank sizes based on project size

**Safety/Sustainability:**
- Fire system: adds ₹30/sq ft
- Generator: adds flat ₹2L
- Solar: ₹150/sq ft investment
- Rainwater: ₹1.5L setup cost

### Total MEP Cost Example:

For a 2000 sq ft residential project:
- HVAC (Split AC): 2000 × 0.012 = ₹2.4L
- Electrical (Standard): 2000 × 0.008 = ₹1.6L
- Water (Municipal): 2000 × 0.006 = ₹1.2L
- Drainage (Municipal): 2000 × 0.004 = ₹0.8L
- Backup Power: ₹2L
- **Total MEP: ₹8L**

This adds ₹8L to the base construction cost in the budget breakdown.

## Design Generation with MEPRequirements

When designs are generated, the API receives:

```typescript
{
  requirements: {
    size: "medium",
    features: [...],
    materials: "standard",
    smartOptions: [...],
    // MEP Systems
    hvac: "split-ac",
    electricalLoad: "standard",
    waterSystem: "municipal",
    drainageType: "municipal",
    fireExtinguishing: true,
    backupPower: false,
    solarIntegration: false,
    rainwaterHarvesting: false
  }
}
```

The AI uses this to:
1. **Size Equipment:** Based on building area and load
2. **Route Systems:** Following design principles
3. **Optimize Layout:** Minimal conflicts, efficient paths
4. **Calculate Quantities:** Material takeoffs
5. **Generate Drawings:** Professional MEP plans

## Best Practices

### For Architects/Designers:

1. **Match MEP to Project Type:**
   - Residential: Split AC, Standard electrical, Municipal water
   - Commercial: Central AC, High electrical, Recycled water
   - Industrial: VRF/Central, Very High electrical, Treatment plant

2. **Consider Climate:**
   - Hot regions: Larger AC capacity, ventilation
   - Coastal areas: Corrosion-resistant materials, backup power
   - Water-scarce: Recycled water, rainwater harvesting

3. **Budget Allocation:**
   - MEP typically 15-20% of construction cost
   - VRF systems can be 25-30% of HVAC budget
   - Good drainage system prevents costly damage

### For Users Creating Projects:

1. **Start Conservative:** Begin with standard options, upgrade if needed
2. **Consider Future:** Opt for hybrid systems if scalability needed
3. **Climate-Aware:** Choose water systems based on local availability
4. **Sustainability:** Solar/rainwater harvesting add long-term savings

## Troubleshooting

### Issue: MEP costs seem high

**Solution:**
- VRF and recycled water systems are premium
- Larger projects distribute costs over more area
- Safety features add to cost but provide value

### Issue: Selected MEP not appearing in designs

**Solution:**
- Ensure design generation API is updated
- Check that MEP data is included in requirements
- Verify enough variants are being generated

### Issue: MEP routing conflicts with architecture

**Solution:**
- AI resolves conflicts by:
  - Moving pipes/ducts to different paths
  - Using wall chases and false ceilings
  - Coordinating with architectural elements
- May require manual adjustment in final design

## Future Enhancements

1. **3D MEP Visualization:** Interactive pipe/duct routing
2. **Coordination Checker:** Auto-detect conflicts
3. **Energy Calculator:** Based on HVAC/lighting selection
4. **Maintenance Plan:** Service access documentation
5. **Code Compliance:** Auto-check against local standards
6. **Cost Optimization:** Suggest alternatives based on budget

## Configuration Files

MEP settings are stored in:
```
projectData.requirements = {
  hvac: string
  electricalLoad: string
  waterSystem: string
  drainageType: string
  fireExtinguishing: boolean
  backupPower: boolean
  solarIntegration: boolean
  rainwaterHarvesting: boolean
}
```

## API Integration

When sending project data to design generation:

```typescript
POST /api/generate-designs
{
  projectData: {
    // ... other fields
    requirements: {
      // ... architectural requirements
      // MEP Systems Included Automatically
    }
  }
}
```

The design generation engine will:
1. Parse MEP requirements
2. Apply system sizing rules
3. Generate system-specific layouts
4. Include in design variants

## Summary

The MEP Systems integration ensures that:
✅ User selections drive design decisions  
✅ Cost estimates include MEP expenses  
✅ Designs include proper MEP documentation  
✅ Layouts respect engineering best practices  
✅ Systems are coordinated without conflicts  

This creates comprehensive, constructable designs ready for detailed engineering.
