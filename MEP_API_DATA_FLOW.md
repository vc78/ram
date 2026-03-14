# MEP Data Flow & API Integration

## Overview

This document explains how MEP (Mechanical, Electrical, Plumbing) data flows from user selections through to design generation.

## Data Flow Diagram

```
┌─────────────────────────┐
│   User Interface        │
│   (Step 3: MEP Form)    │
└────────────┬────────────┘
             │ User Selects:
             │ - HVAC System
             │ - Electrical Load
             │ - Water System
             │ - Drainage Type
             │ - Safety Features
             ▼
┌─────────────────────────┐
│  React State Update     │
│  requirements object    │
└────────────┬────────────┘
             │ User clicks:
             │ "Calculate Budget"
             ▼
┌─────────────────────────┐
│  calculateBudget()      │
│  - MEP Cost Calc        │
│  - Total Cost Updated   │
│  - Breakdown includes   │
│    MEP line item        │
└────────────┬────────────┘
             │ Returns:
             │ BudgetEstimation
             │ with MEP costs
             ▼
┌─────────────────────────┐
│  Step 4: Display Budget │
│  - Show MEP breakdown   │
│  - Show total estimate  │
└────────────┬────────────┘
             │ User clicks:
             │ "Generate Designs"
             ▼
┌─────────────────────────┐
│  handleSubmit()         │
│  - Compile projectData  │
│  - Include requirements │
│    with all MEP fields  │
└────────────┬────────────┘
             │ POST to API
             ▼
┌─────────────────────────┐
│  /api/generate-designs  │
│  - Receives complete    │
│    MEP requirements     │
│  - Generates MEP plans  │
│  - Returns design       │
│    variants             │
└────────────┬────────────┘
             │ Response:
             │ { designs: [...] }
             ▼
┌─────────────────────────┐
│  Designs with MEP       │
│  - Floor plans show     │
│    MEP systems          │
│  - 3D shows equipment   │
│  - Drawings include     │
│    MEP layers           │
└─────────────────────────┘
```

## State Management

### Initial State (Step 3)

```typescript
const [requirements, setRequirements] = useState({
  // Architectural
  size: "medium",
  features: [],
  materials: "standard",
  smartOptions: [],
  
  // MEP Systems
  hvac: "split-ac",                    // Default: Split AC
  electricalLoad: "standard",          // Default: Standard
  waterSystem: "municipal",            // Default: Municipal
  drainageType: "municipal",           // Default: Municipal
  fireExtinguishing: false,            // Default: No
  backupPower: false,                  // Default: No
  solarIntegration: false,             // Default: No
  rainwaterHarvesting: false,          // Default: No
})
```

### State Updates

**When HVAC system selected:**
```typescript
setRequirements(prev => ({ ...prev, hvac: "central-ac" }))
```

**When Safety feature toggled:**
```typescript
setRequirements(prev => ({
  ...prev,
  fireExtinguishing: !prev.fireExtinguishing
}))
```

## Budget Calculation with MEP

### Cost Breakdown Logic

```typescript
// MEP System Costs (in Lakhs)

// 1. HVAC Costs
const hvacCosts = {
  "window-ac": sqFt * 0.008,      // ₹80/sq ft
  "split-ac": sqFt * 0.012,       // ₹120/sq ft
  "central-ac": sqFt * 0.018,     // ₹180/sq ft
  "vrf": sqFt * 0.025,            // ₹250/sq ft
  "natural-ventilation": sqFt * 0.003 // ₹30/sq ft
}
mepCost += hvacCosts[requirements.hvac]

// 2. Electrical Costs
const electricalCosts = {
  "standard": sqFt * 0.008,       // ₹80/sq ft
  "high": sqFt * 0.015,           // ₹150/sq ft
  "very-high": sqFt * 0.025       // ₹250/sq ft
}
mepCost += electricalCosts[requirements.electricalLoad]

// 3. Water System Costs
const waterSystemCosts = {
  "municipal": sqFt * 0.006,      // ₹60/sq ft
  "borewell": sqFt * 0.008 + 2,   // ₹80/sq ft + ₹2L
  "hybrid": sqFt * 0.01 + 3,      // ₹100/sq ft + ₹3L
  "recycled": sqFt * 0.015 + 4    // ₹150/sq ft + ₹4L
}
mepCost += waterSystemCosts[requirements.waterSystem]

// 4. Drainage Costs
const drainageCosts = {
  "municipal": sqFt * 0.004,      // ₹40/sq ft
  "septic": sqFt * 0.008 + 1.5,   // ₹80/sq ft + ₹1.5L
  "treatment-plant": sqFt * 0.015 + 4 // ₹150/sq ft + ₹4L
}
mepCost += drainageCosts[requirements.drainageType]

// 5. Safety & Sustainability (if selected)
if (requirements.fireExtinguishing) {
  mepCost += sqFt * 0.003         // ₹30/sq ft
}
if (requirements.backupPower) {
  mepCost += 2                     // ₹2L
}
if (requirements.solarIntegration) {
  mepCost += sqFt * 0.015         // ₹150/sq ft
}
if (requirements.rainwaterHarvesting) {
  mepCost += 1.5                   // ₹1.5L
}

// 6. Add to total
totalCost += mepCost
```

### Budget JSON Response (Step 4)

```json
{
  "stage": "intermediate",
  "budgetRange": {
    "min": 380000,
    "max": 460000
  },
  "breakdown": {
    "materials": 140000,
    "labor": 100000,
    "technology": 40000,
    "mep": 80000,           // MEP line item
    "design": 30000,
    "contingency": 50000
  },
  "reasoning": [
    "2000 sq ft project",
    "MEP Systems: +₹8.0 lakhs",
    "HVAC (Split AC): 2000 × 0.012 = ₹2.4L",
    "Electrical (Standard): 2000 × 0.008 = ₹1.6L",
    "Water (Municipal): 2000 × 0.006 = ₹1.2L",
    "Drainage (Municipal): 2000 × 0.004 = ₹0.8L",
    "Fire extinguishing: 2000 × 0.003 = ₹0.6L",
    "Backup power: ₹2.0L",
    "Well-balanced modern design"
  ]
}
```

## Project Data Creation

### Before API Call

```typescript
const projectId = Date.now().toString()
const projectData = {
  id: projectId,
  name: formData.name,
  description: formData.description,
  location: formData.location,
  
  // GPS Coordinates
  coordinates: formData.locationData ? {
    latitude: formData.locationData.latitude,
    longitude: formData.locationData.longitude,
    placeId: formData.locationData.placeId,
    formattedAddress: formData.locationData.formattedAddress,
  } : null,
  
  budget: formData.budget,
  type: projectType,
  
  // ALL Requirements including MEP
  requirements: {
    // Architectural
    size: "medium",
    features: ["Modern Kitchen", "Swimming Pool"],
    materials: "standard",
    smartOptions: ["Smart Lighting", "security System"],
    
    // MEP Systems - ALL INCLUDED
    hvac: "split-ac",
    electricalLoad: "standard",
    waterSystem: "municipal",
    drainageType: "municipal",
    fireExtinguishing: true,
    backupPower: false,
    solarIntegration: true,
    rainwaterHarvesting: true,
  },
  
  budgetEstimation: { /* ... */ },
  createdAt: new Date().toISOString(),
}
```

## API Request Payload

### POST `/api/generate-designs`

```json
{
  "projectData": {
    "id": "1709705400000",
    "name": "Modern Villa Design",
    "description": "A contemporary villa with sustainable features",
    "location": "Mumbai, Maharashtra, India",
    "coordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777,
      "placeId": "ChIJXeL...",
      "formattedAddress": "Mumbai, Maharashtra 400001, India"
    },
    "budget": "₹38-46 Lakhs",
    "type": "residential",
    "requirements": {
      "size": "medium",
      "features": ["Modern Kitchen", "Swimming Pool"],
      "materials": "standard",
      "smartOptions": ["Smart Lighting", "Security System"],
      
      "hvac": "split-ac",
      "electricalLoad": "standard",
      "waterSystem": "municipal",
      "drainageType": "municipal",
      "fireExtinguishing": true,
      "backupPower": false,
      "solarIntegration": true,
      "rainwaterHarvesting": true
    },
    "budgetEstimation": {
      "stage": "intermediate",
      "budgetRange": { "min": 380000, "max": 460000 },
      "breakdown": {
        "materials": 140000,
        "labor": 100000,
        "technology": 40000,
        "mep": 80000,
        "design": 30000,
        "contingency": 50000
      },
      "reasoning": [/* ... */]
    },
    "createdAt": "2026-03-06T10:30:00.000Z"
  },
  "options": {
    "providers": ["anthropic/claude-sonnet-4.5"],
    "variantsPerProvider": 4
  }
}
```

## Design Generation API Processing

### What the API Does with MEP Data

```typescript
// Pseudo-code in /api/generate-designs

function generateDesignVariants(projectData, options) {
  const { requirements } = projectData
  
  // 1. Extract MEP specifications
  const mepSpec = {
    hvac: requirements.hvac,           // "split-ac"
    electricalLoad: requirements.electricalLoad, // "standard"
    waterSystem: requirements.waterSystem, // "municipal"
    drainageType: requirements.drainageType, // "municipal"
    systems: {
      fire: requirements.fireExtinguishing,
      backup: requirements.backupPower,
      solar: requirements.solarIntegration,
      rainwater: requirements.rainwaterHarvesting
    }
  }
  
  // 2. For each AI provider
  for (const provider of options.providers) {
    
    // 3. Generate variants
    for (let i = 0; i < options.variantsPerProvider; i++) {
      
      // 4. Create MEP-aware design prompt
      const designPrompt = `
        Generate a ${projectData.type} design with:
        - Location: ${projectData.location} (${projectData.coordinates.latitude}, ${projectData.coordinates.longitude})
        - Size: ${requirements.size}
        - Materials: ${requirements.materials}
        
        MEP Systems Required:
        - HVAC: ${mepSpec.hvac} system with appropriate ductwork
        - Electrical: ${mepSpec.electricalLoad} load circuits and panels
        - Water: ${mepSpec.waterSystem} supply system
        - Drainage: ${mepSpec.drainageType} drainage system
        - Fire Safety: ${mepSpec.systems.fire ? 'Include sprinklers' : 'Standard'}
        - Backup Power: ${mepSpec.systems.backup ? 'Include generator' : 'Grid only'}
        - Solar: ${mepSpec.systems.solar ? 'Rooftop panels' : 'None'}
        - Rainwater: ${mepSpec.systems.rainwater ? 'Collection system' : 'None'}
        
        Include MEP layouts in plans and 3D model.
      `
      
      // 5. Send to AI provider
      const design = await callAIProvider(provider, designPrompt)
      
      // 6. Add MEP specifications to design metadata
      design.mepSpecifications = mepSpec
      design.includes = {
        mechanicalPlan: true,
        electricalPlan: true,
        plumbingPlan: true,
        fireSafetyPlan: mepSpec.systems.fire,
        solarLayout: mepSpec.systems.solar,
        rainwaterPlan: mepSpec.systems.rainwater,
      }
      
      variants.push(design)
    }
  }
  
  return variants
}
```

## Response from Design API

### Design Variant with MEP

```json
{
  "id": "design_001",
  "projectId": "1709705400000",
  "title": "Modern Contemporary Villa",
  "description": "A sleek modern villa design with contemporary MEP systems",
  "mepSpecifications": {
    "hvac": "split-ac",
    "electricalLoad": "standard",
    "waterSystem": "municipal",
    "drainageType": "municipal",
    "systems": {
      "fire": true,
      "backup": false,
      "solar": true,
      "rainwater": true
    }
  },
  "includes": {
    "mechanicalPlan": true,
    "electricalPlan": true,
    "plumbingPlan": true,
    "fireSafetyPlan": true,
    "solarLayout": true,
    "rainwaterPlan": true
  },
  "drawings": {
    "floorPlan": { /* SVG/image */ },
    "mechanicalLayout": { /* MEP ductwork */ },
    "electricalLayout": { /* Circuits and panels */ },
    "plumbingLayout": { /* Water and drainage */ },
    "fireSafetyPlan": { /* Sprinkler heads, hydrants */ },
    "3dModel": { /* 3D representation */ }
  },
  "estimatedCost": {
    "construction": 280000,
    "mep": 80000,
    "total": 360000
  },
  "provider": "anthropic",
  "generatedAt": "2026-03-06T10:35:00.000Z"
}
```

## Storage in LocalStorage

### Project Saved to Browser

```typescript
const projects = JSON.parse(localStorage.getItem("projects") || "[]")
projects.push({
  ...projectData,      // Includes all MEP requirements
  designs,            // Array of design variants with MEP
  status: "planning",
  progress: 0,
})
localStorage.setItem("projects", JSON.stringify(projects))
```

## Summary: MEP Data Journey

1. **User Interface** → User selects MEP systems in Step 3
2. **React State** → Requirements object updated with MEP values
3. **Budget Calculation** → MEP costs computed and included
4. **Project Data** → Entire requirements (including MEP) packaged
5. **API Request** → sendt to `/api/generate-designs` with full MEP spec
6. **Design Generation** → AI uses MEP to generate layouts and systems
7. **API Response** → Designs include MEP drawings and specifications
8. **Local Storage** → Full project with MEP and designs saved
9. **Dashboard** → Users can view and compare MEP-considered designs

---

This ensures that **every design generated is aware of and includes proper MEP system layouts** based on the user's selections.
