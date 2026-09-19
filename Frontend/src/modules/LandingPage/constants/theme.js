// Appzeto Super App - Brand & 4-Pillar Theme System
export const APPZETO_THEME = {
  // Brand Master (Teal + Lime Accent as seen in Appzeto logo)
  brand: {
    primary: '#00838F',
    primaryDark: '#006064',
    accent: '#84CC16',
    lime: '#A3E635',
    tealGradient: 'linear-gradient(135deg, #00838F 0%, #004D40 100%)',
    bgLight: '#F0FDFA',
    border: 'rgba(0, 131, 143, 0.25)',
    glow: 'rgba(0, 131, 143, 0.35)',
  },

  // 1. Food Delivery (Warm Coral / Sunset Flame)
  food: {
    name: 'Food Delivery',
    tagline: 'Hot & Fresh at Your Doorstep',
    primary: '#FF5722',
    accent: '#FF7A00',
    secondary: '#E64A19',
    bg: 'rgba(255, 87, 34, 0.08)',
    border: 'rgba(255, 87, 34, 0.25)',
    shadow: 'rgba(255, 87, 34, 0.3)',
    gradient: 'linear-gradient(135deg, #FF5722 0%, #FF8A00 100%)',
    bgGradient: 'from-[#FF5722] to-[#FF8A00]',
    textColor: 'text-[#FF5722]',
    badgeBg: 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/30',
  },

  // 2. Taxi / Ride Hailing (Golden Taxi Amber)
  taxi: {
    name: 'Taxi & Mobility',
    tagline: 'Fast, Safe & Transparent Rides',
    primary: '#F59E0B',
    accent: '#D97706',
    secondary: '#B45309',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.25)',
    shadow: 'rgba(245, 158, 11, 0.3)',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
    bgGradient: 'from-[#F59E0B] to-[#EAB308]',
    textColor: 'text-[#D97706]',
    badgeBg: 'bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/30',
  },

  // 3. Service Provider (Electric Cyan / Sky Tech Blue)
  services: {
    name: 'Service Provider',
    tagline: 'Verified Home & Personal Experts',
    primary: '#0284C7',
    accent: '#00A3FF',
    secondary: '#0369A1',
    bg: 'rgba(2, 132, 199, 0.08)',
    border: 'rgba(2, 132, 199, 0.25)',
    shadow: 'rgba(2, 132, 199, 0.3)',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #00A3FF 100%)',
    bgGradient: 'from-[#0284C7] to-[#00A3FF]',
    textColor: 'text-[#0284C7]',
    badgeBg: 'bg-[#0284C7]/10 text-[#0284C7] border-[#0284C7]/30',
  },

  // 4. Quick Commerce (Fresh Emerald / Mint Green)
  quickCommerce: {
    name: 'Quick Commerce',
    tagline: '10-Minute Grocery & Essentials',
    primary: '#10B981',
    accent: '#059669',
    secondary: '#047857',
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.25)',
    shadow: 'rgba(16, 185, 129, 0.3)',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    bgGradient: 'from-[#10B981] to-[#059669]',
    textColor: 'text-[#10B981]',
    badgeBg: 'bg-[#10B981]/10 text-[#047857] border-[#10B981]/30',
  },

  // Multi-gradient spectrum across all 4 pillars
  spectrum: {
    textGradient: 'bg-gradient-to-r from-[#FF5722] via-[#F59E0B] via-[#0284C7] to-[#10B981]',
    brandGradient: 'bg-gradient-to-r from-[#00838F] via-[#0284C7] to-[#84CC16]',
    borderGradient: 'linear-gradient(90deg, #FF5722, #F59E0B, #0284C7, #10B981)',
  }
};

// Backward-compatibility export
export const LANDING_THEME = {
  orange: APPZETO_THEME.food,
  blue: APPZETO_THEME.services,
  green: APPZETO_THEME.quickCommerce,
  yellow: APPZETO_THEME.taxi,
  multicolor: {
    textGradient: APPZETO_THEME.spectrum.textGradient,
    buttonGradient: APPZETO_THEME.spectrum.textGradient,
    textGradientStyle: APPZETO_THEME.spectrum.borderGradient,
  }
};
