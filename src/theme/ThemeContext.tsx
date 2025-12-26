import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Phase } from '../types';
import {
  getPhaseTokens,
  PhaseTokens,
  ThemeScheme,
  safetyColors,
  quadrantColors,
  confidenceColors,
  bandColors,
  spacing,
  borderRadius,
  fontSize,
} from './tokens';

interface ThemeContextValue {
  phase: Phase;
  scheme: ThemeScheme;
  tokens: PhaseTokens;
  safety: typeof safetyColors;
  quadrants: typeof quadrantColors;
  confidence: typeof confidenceColors;
  bands: typeof bandColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  fontSize: typeof fontSize;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  phase: Phase;
  scheme?: ThemeScheme;
  children: ReactNode;
}

export function ThemeProvider({ phase, scheme, children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const resolvedScheme: ThemeScheme =
    scheme ?? (systemScheme === 'light' ? 'light' : 'dark');
  const value = useMemo<ThemeContextValue>(
    () => ({
      phase,
      scheme: resolvedScheme,
      tokens: getPhaseTokens(phase, resolvedScheme),
      safety: safetyColors,
      quadrants: quadrantColors,
      confidence: confidenceColors,
      bands: bandColors,
      spacing,
      borderRadius,
      fontSize,
    }),
    [phase, resolvedScheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
