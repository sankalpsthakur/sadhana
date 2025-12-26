import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeContext } from './ThemeContext';
import { MoodQuadrant, LockType, Confidence, StabilityBand } from '../types';

export function useTheme() {
  const theme = useThemeContext();

  const styles = useMemo(() => {
    const { tokens } = theme;
    return StyleSheet.create({
      // Container styles
      container: {
        flex: 1,
        backgroundColor: tokens.bgPrimary,
      },
      card: {
        backgroundColor: tokens.bgSecondary,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: tokens.border,
        padding: theme.spacing.lg,
      },
      // Text styles
      heading: {
        color: tokens.textPrimary,
        fontFamily: tokens.fontFamilyHeading,
        fontSize: theme.fontSize.xxl,
        lineHeight: 30,
        letterSpacing: -0.2,
      },
      subheading: {
        color: tokens.textPrimary,
        fontFamily: tokens.fontFamilyHeading,
        fontSize: theme.fontSize.xl,
        lineHeight: 24,
        letterSpacing: -0.1,
      },
      body: {
        color: tokens.textPrimary,
        fontFamily: tokens.fontFamilyBody,
        fontSize: theme.fontSize.md,
        lineHeight: 22,
      },
      caption: {
        color: tokens.textSecondary,
        fontFamily: tokens.fontFamilyBody,
        fontSize: theme.fontSize.sm,
        lineHeight: 18,
      },
      // Button styles
      primaryButton: {
        backgroundColor: tokens.accent,
        borderRadius: theme.borderRadius.md,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      primaryButtonText: {
        color: tokens.bgPrimary,
        fontFamily: tokens.fontFamilyBodyStrong,
        fontSize: theme.fontSize.lg,
        letterSpacing: 0.2,
      },
    });
  }, [theme]);

  // Get color for mood quadrant
  const getQuadrantColor = (quadrant: MoodQuadrant): string => {
    if (!quadrant) return theme.tokens.textSecondary;
    return theme.quadrants[quadrant];
  };

  // Get safety banner color for lock type
  const getSafetyColor = (lockType: LockType): string => {
    const colorMap: Record<LockType, keyof typeof theme.safety> = {
      kavacha: 'red',
      nightmare: 'blue',
      neti: 'violet',
      serpent: 'amber',
      union: 'gray',
      sleepEmergency: 'blue',
    };
    return theme.safety[colorMap[lockType]];
  };

  // Get confidence badge color
  const getConfidenceColor = (confidence: Confidence): string => {
    return theme.confidence[confidence];
  };

  // Get stability band color
  const getBandColor = (band: StabilityBand): string => {
    return theme.bands[band];
  };

  return {
    ...theme,
    styles,
    getQuadrantColor,
    getSafetyColor,
    getConfidenceColor,
    getBandColor,
  };
}

export type ThemedStyles = ReturnType<typeof useTheme>['styles'];
