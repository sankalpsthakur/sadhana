import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { isTrendsLocked } from '../../store/selectors';
import { fontFamilies } from '../../theme/fonts';

export function PatternCard() {
  const { tokens } = useTheme();
  const stability = useAppStore((state) => state.stability);
  const moodQuadrant = useAppStore((state) => state.moodQuadrant);

  const isLocked = isTrendsLocked(stability);

  // Mock pattern insight based on state
  const getPatternText = (): string => {
    if (isLocked) {
      return 'Patterns settle into view at Sthiti 60+. The body is still learning to be still.';
    }
    if (!moodQuadrant) {
      return 'Log your mood to reveal patterns';
    }
    switch (moodQuadrant) {
      case 'Red':
        return 'Red entries tend to cluster in afternoons. Consider earlier grounding.';
      case 'Blue':
        return 'Blue entries correlate with late nights. Sleep protection may help.';
      case 'Green':
        return 'Green has been your baseline for 5 of the last 7 days. Stability growing.';
      case 'Yellow':
        return 'Yellow is rising. The fire wants somewhere to go.';
      default:
        return 'Keep logging to reveal your patterns.';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: tokens.textPrimary }]}>Today's Pattern</Text>
      </View>

      <Text style={[styles.insight, { color: tokens.textSecondary }]}>
        {getPatternText()}
      </Text>

      <TouchableOpacity style={styles.link} disabled={isLocked}>
        <Text style={[styles.linkText, { color: isLocked ? tokens.textSecondary : tokens.accent }]}>
          {isLocked ? 'Threshold ahead. Continue practice.' : 'View full trends →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 18,
    lineHeight: 24,
  },
  lockIcon: {
    fontSize: 14,
  },
  insight: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  link: {
    marginTop: 12,
  },
  linkText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
});
