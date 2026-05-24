export const colors = {
  canvas: '#F7F3EA',
  surface: '#FFFDF8',
  surfaceMuted: '#F0EADF',
  ink: '#181C18',
  muted: '#667067',
  line: '#DED8CB',
  accent: '#256D85',
  accentSoft: '#D9EDF2',
  success: '#2F7D50',
  warning: '#A35F18',
  danger: '#B74343',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
} as const;

export const typography = {
  title: 32,
  heading: 24,
  subheading: 18,
  body: 16,
  caption: 13,
} as const;

export const shadows = {
  card: {
    shadowColor: '#181C18',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
} as const;

export const motion = {
  quick: 120,
  standard: 180,
} as const;
