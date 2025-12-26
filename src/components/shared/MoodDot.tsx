import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MoodQuadrant } from '../../types';
import { useTheme } from '../../theme/useTheme';

interface MoodDotProps {
  quadrant: MoodQuadrant;
  size?: 'small' | 'medium' | 'large';
}

export function MoodDot({ quadrant, size = 'medium' }: MoodDotProps) {
  const { quadrants, tokens } = useTheme();

  const sizeMap = {
    small: 8,
    medium: 12,
    large: 16,
  };

  const dotSize = sizeMap[size];
  const color = quadrant ? quadrants[quadrant] : tokens.textSecondary;

  return (
    <View
      style={[
        styles.dot,
        {
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    // Base styles applied via inline
  },
});
