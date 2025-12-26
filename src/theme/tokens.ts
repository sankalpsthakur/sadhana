import { Phase } from '../types';
import { fontFamilies } from './fonts';

export type ThemeScheme = 'light' | 'dark';

export interface PhaseTokens {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  border: string;
  borderStrong: string;
  shadow: string;
  transitionSpeed: number; // in ms
  fontWeightHeading: '400' | '500' | '600' | '700';
  fontFamilyHeading: string;
  fontFamilyBody: string;
  fontFamilyBodyStrong: string;
}

const baseSchemes: Record<ThemeScheme, Omit<PhaseTokens, 'accent' | 'accentSoft' | 'accentStrong'>> = {
  light: {
    bgPrimary: '#F7F3EE',
    bgSecondary: '#FFFDFA',
    bgTertiary: '#F1EAE1',
    textPrimary: '#1F1B17',
    textSecondary: '#5E554B',
    textMuted: '#8A8076',
    border: '#E4D9CE',
    borderStrong: '#CBBEAF',
    shadow: 'rgba(31, 27, 23, 0.08)',
    transitionSpeed: 220,
    fontWeightHeading: '600',
    fontFamilyHeading: fontFamilies.display.semibold,
    fontFamilyBody: fontFamilies.text.regular,
    fontFamilyBodyStrong: fontFamilies.text.semibold,
  },
  dark: {
    bgPrimary: '#0E0F11',
    bgSecondary: '#15181C',
    bgTertiary: '#1C2026',
    textPrimary: '#F5F1EB',
    textSecondary: '#B5ACA2',
    textMuted: '#8A8076',
    border: '#2A2F37',
    borderStrong: '#3A414C',
    shadow: 'rgba(0, 0, 0, 0.45)',
    transitionSpeed: 260,
    fontWeightHeading: '600',
    fontFamilyHeading: fontFamilies.display.semibold,
    fontFamilyBody: fontFamilies.text.regular,
    fontFamilyBodyStrong: fontFamilies.text.semibold,
  },
};

const phaseAccents: Record<Phase, string> = {
  0: '#B26A3E',
  1: '#B26A3E',
  2: '#4F7B8A',
  3: '#C0713E',
  4: '#6C9A7A',
  5: '#3D7C9B',
  6: '#8B7D6A',
  7: '#74665B',
};

const withAlpha = (hex: string, alpha: number) => {
  const clamped = Math.max(0, Math.min(1, alpha));
  const channel = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${channel}`;
};

export function getPhaseTokens(phase: Phase, scheme: ThemeScheme): PhaseTokens {
  const base = baseSchemes[scheme];
  const accent = phaseAccents[phase];
  const accentSoft = withAlpha(accent, scheme === 'dark' ? 0.28 : 0.14);
  const accentStrong = scheme === 'dark' ? '#F6EBDD' : '#2B211A';

  return {
    ...base,
    accent,
    accentSoft,
    accentStrong,
  };
}

// Safety colors for banners and alerts
export const safetyColors = {
  red: '#D15A4A',      // Kavacha
  blue: '#4B78A6',     // Nightmare gate, Sleep emergency
  violet: '#6F6B9A',   // Neti cooldown
  amber: '#C79B3B',    // Serpent cooldown
  gray: '#7C746C',     // Union lock
};

// Mood quadrant colors
export const quadrantColors = {
  Red: '#D55C4A',      // High energy, low pleasantness
  Blue: '#4C78A6',     // Low energy, low pleasantness
  Green: '#4E9B72',    // Low energy, high pleasantness
  Yellow: '#D4A441',   // High energy, high pleasantness
};

// Confidence badge colors
export const confidenceColors = {
  Verified: '#4E9B72',   // Green check
  Mixed: '#C79B3B',      // Amber
  'Self-report': '#7C746C', // Gray
};

// Stability band colors
export const bandColors = {
  Unstable: '#D55C4A',
  Settling: '#C79B3B',
  Stable: '#4E9B72',
  Radiant: '#6F6B9A',
  'HV-Eligible': '#C79B3B', // Gold-ish
};

// Common spacing and sizing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  xxl: 40,
  xxxl: 56,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 34,
  display: 42,
};
