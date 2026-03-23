// ============================================
// Waygo — Design Tokens
// ============================================

export const palette = {
  // Morning — warm amber sunrise
  morningBg: '#FFF8F0',
  morningBgSec: '#FFF0E0',
  morningSurface: '#FFF3E6',
  morningSurfaceAlt: '#FFEDD5',
  morningText: '#3D2E1F',
  morningTextSec: '#A08060',
  morningAccent: '#F59E0B',
  morningAccentBright: '#FBBF24',
  morningAccentMuted: '#D97706',
  morningStroke: '#F5E0C8',

  // Day — fresh emerald
  dayBg: '#F0FAF7',
  dayBgSec: '#E4F4EE',
  daySurface: '#E8F5F0',
  daySurfaceAlt: '#DCF0E8',
  dayText: '#1A2E28',
  dayTextSec: '#6B8F85',
  dayAccent: '#34D399',
  dayAccentBright: '#6EE7B7',
  dayAccentMuted: '#059669',
  dayStroke: '#C8E8DE',

  // Evening — warm rose sunset
  eveningBg: '#FFF5F5',
  eveningBgSec: '#FFE8EA',
  eveningSurface: '#FFEFF0',
  eveningSurfaceAlt: '#FFE4E6',
  eveningText: '#2D1A1E',
  eveningTextSec: '#9B6B72',
  eveningAccent: '#F43F5E',
  eveningAccentBright: '#FB7185',
  eveningAccentMuted: '#E11D48',
  eveningStroke: '#F5D0D5',

  // Night — deep cosmic
  nightBg: '#0C0B14',
  nightBgSec: '#12101F',
  nightSurface: 'rgba(20, 18, 36, 0.85)',
  nightSurfaceAlt: 'rgba(28, 24, 50, 0.75)',
  nightText: '#E8E6F0',
  nightTextSec: 'rgba(232, 230, 240, 0.55)',
  nightAccent: '#8B5CF6',
  nightAccentBright: '#A78BFA',
  nightAccentMuted: '#7C3AED',
  nightStroke: 'rgba(139, 92, 246, 0.2)',

  // Shared semantic
  white: '#FFFFFF',
  black: '#000000',
} as const;

// Static tokens — used as fallback and for layout constants only
export const tokens = {
  bg: { primary: palette.dayBg, secondary: palette.dayBgSec },
  surface: { card: palette.daySurface, cardAlt: palette.daySurfaceAlt },
  text: { primary: palette.dayText, secondary: palette.dayTextSec, inverse: '#FFFFFF' },
  accent: {
    move: palette.dayAccent,
    mood: '#BFD7E6',
    rhythm: '#F5E8B8',
    memory: '#DDE4EA',
  },
  stroke: { soft: palette.dayStroke },
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  sheet: 32,
  pill: 999,
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const shadows = {
  card: {
    shadowColor: '#2A3138',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 4,
  },
  cardSoft: {
    shadowColor: '#2A3138',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },
  hero: {
    shadowColor: '#2A3138',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.10,
    shadowRadius: 40,
    elevation: 6,
  },
} as const;

export const animation = {
  duration: { fast: 180, base: 260, slow: 420 },
  easing: {
    calmOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
    ambient: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
} as const;

export const typography = {
  family: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  size: {
    hero: 34,
    h1: 28,
    h2: 22,
    h3: 18,
    body: 16,
    caption: 13,
    chip: 12,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;
