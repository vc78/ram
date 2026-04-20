
export interface LayoutCell {
  title: string;
  color: string;
  description: string;
}

export interface VastuLayoutData {
  [row: number]: {
    [col: number]: LayoutCell;
  };
}

export const VASTU_DATASET: Record<string, VastuLayoutData> = {
  house: {
    0: {
      0: { title: "Guest Room", color: "#0891b2", description: "Ideal for guests, Northwest direction ensures mobility." },
      1: { title: "Living Room", color: "#2563eb", description: "North zone for social energy and wealth flow." },
      2: { title: "Pooja Room", color: "#059669", description: "Northeast (Ishanya) corner for spiritual growth." }
    },
    1: {
      0: { title: "Dining Area", color: "#0284c7", description: "West zone promotes healthy appetite and bonding." },
      1: { title: "Brahmasthan", color: "#d97706", description: "Center of the house, kept open for energy flow." },
      2: { title: "Study Room", color: "#16a34a", description: "East zone enhances concentration and learning." }
    },
    2: {
      0: { title: "Master Bedroom", color: "#7c3aed", description: "Southwest zone for stability and health." },
      1: { title: "Store Room", color: "#9333ea", description: "South zone for heavy storage and grounding." },
      2: { title: "Kitchen", color: "#dc2626", description: "Southeast (Agni) corner for the fire element." }
    }
  },
  commercial: {
    0: {
      0: { title: "Conference Room", color: "#0891b2", description: "Northwest for dynamic meetings." },
      1: { title: "Workstations", color: "#2563eb", description: "North zone for focus and productivity." },
      2: { title: "Reception", color: "#059669", description: "Northeast for welcoming positive vibes." }
    },
    1: {
      0: { title: "Pantry", color: "#0284c7", description: "West zone for staff refreshments." },
      1: { title: "Open Hall", color: "#d97706", description: "Central lobby for circulation." },
      2: { title: "Accounts", color: "#16a34a", description: "East zone for financial growth." }
    },
    2: {
      0: { title: "Manager Cabin", color: "#7c3aed", description: "Southwest for authoritative positioning." },
      1: { title: "Server Room", color: "#9333ea", description: "South zone for heavy equipment." },
      2: { title: "Utility/HVAC", color: "#dc2626", description: "Southeast for electrical and fire services." }
    }
  },
  apartment: {
    0: {
      0: { title: "Balcony/Northwest", color: "#0891b2", description: "Ventilation and open views." },
      1: { title: "Main Lounge", color: "#2563eb", description: "Primary social gathering space." },
      2: { title: "Pooja/Northeast", color: "#059669", description: "Sacred space in small format." }
    },
    1: {
      0: { title: "Kitchen/Dining", color: "#0284c7", description: "Combined utility area." },
      1: { title: "Central Foyer", color: "#d97706", description: "Internal circulation." },
      2: { title: "Children Bed", color: "#16a34a", description: "East-facing for morning sun." }
    },
    2: {
      0: { title: "Master Bed/SW", color: "#7c3aed", description: "Primary resting zone." },
      1: { title: "Common Bath", color: "#9333ea", description: "Tucked away for privacy." },
      2: { title: "Secondary Bed", color: "#dc2626", description: "Southeast corner guest/children bed." }
    }
  },
  villa: {
    0: {
      0: { title: "Guest Suite", color: "#0891b2", description: "Premium NW accommodation." },
      1: { title: "Grand Atrium", color: "#2563eb", description: "Double height N-facing entrance hall." },
      2: { title: "Meditation Pad", color: "#059669", description: "Ultra-quiet NE corner." }
    },
    1: {
      0: { title: "Home Theater", color: "#0284c7", description: "Soundproof West zone." },
      1: { title: "Courtyard", color: "#d97706", description: "Open-to-sky central space." },
      2: { title: "Office/Library", color: "#16a34a", description: "Bright East-lit workspace." }
    },
    2: {
      0: { title: "Owner Suite", color: "#7c3aed", description: "Massive SW retreat with balcony." },
      1: { title: "Dressing/Gym", color: "#9333ea", description: "Private wellness zone." },
      2: { title: "Chef Kitchen", color: "#dc2626", description: "High-end SE culinary studio." }
    }
  },
  hospital: {
    0: {
      0: { title: "Emergency", color: "#ef4444", description: "Northwest for quick movement and access." },
      1: { title: "OPD Ward", color: "#2563eb", description: "North zone for smooth patient flow." },
      2: { title: "Healing Garden", color: "#059669", description: "Northeast for recovery and peace." }
    },
    1: {
      0: { title: "Diagnostics", color: "#0284c7", description: "West zone for stable testing environments." },
      1: { title: "Central Nursing", color: "#d97706", description: "Hub for monitoring all wards." },
      2: { title: "Operation Theater", color: "#16a34a", description: "East zone for precision and vitality." }
    },
    2: {
      0: { title: "Admin/ICU", color: "#7c3aed", description: "Southwest for control and stability." },
      1: { title: "General Ward", color: "#9333ea", description: "South zone for patient accommodation." },
      2: { title: "Kitchen/Cafeteria", color: "#dc2626", description: "Southeast for fire-related services." }
    }
  }
};

