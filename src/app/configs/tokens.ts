import { deepFreeze } from '../../utils/deep-freeze'

export const tokens = deepFreeze({
  colors: {
    primary: {
      400: '#A5B4FC',
      500: '#6366F1',
      600: '#4F46E5'
    },
    background: {
      50: '#FFFFFF',
      600: '#4A4A4A',
      700: '#363636',
      800: '#2A2A2A',
      900: '#1C1C1C',
      950: '#000000'
    },
    border: {
      700: '#4A4A4A',
      800: '#363636'
    },
    content: {
      50: '#FFFFFF',
      100: '#E5E5E5',
      400: '#A1A1A1',
      600: '#6B7280',
      950: '#000000'
    },
    success: {
      300: '#86EFAC',
      500: '#22C55E',
      950: '#052E16'
    },
    warning: {
      300: '#FDE047',
      500: '#EAB308',
      950: '#422006'
    },
    error: {
      300: '#FDA4AF',
      500: '#F43F5E',
      950: '#4C0519'
    },
    info: {
      300: '#7DD3FC',
      500: '#0EA5E9',
      950: '#082F49'
    },
    neutral: {
      300: '#D4D4D4',
      500: '#737373',
      950: '#404040'
    }
  },
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    '4xl': 64,
    '5xl': 96,
    '6xl': 128
  },
  fontSize: {
    '2xs': 8,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 999
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    '2xs': 12,
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
    '4xl': 48,
    '5xl': 56
  }
} as const)

export type Tokens = typeof tokens
