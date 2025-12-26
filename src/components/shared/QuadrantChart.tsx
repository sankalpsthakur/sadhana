import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { MoodQuadrant } from '../../types';
import { fontFamilies } from '../../theme/fonts';

interface QuadrantData {
  quadrant: MoodQuadrant;
  percentage: number;
  count: number;
}

interface QuadrantChartProps {
  data: QuadrantData[];
  title?: string;
}

export function QuadrantChart({ data, title }: QuadrantChartProps) {
  const { tokens, quadrants } = useTheme();

  // Sort by percentage descending
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      {title && (
        <Text style={[styles.title, { color: tokens.textPrimary }]}>{title}</Text>
      )}

      <View style={styles.barsContainer}>
        {sortedData.map((item) => {
          if (!item.quadrant) return null;
          const color = quadrants[item.quadrant];

          return (
            <View key={item.quadrant} style={styles.barRow}>
              <View style={styles.labelContainer}>
                <View style={[styles.colorDot, { backgroundColor: color }]} />
                <Text style={[styles.label, { color: tokens.textPrimary }]}>
                  {item.quadrant}
                </Text>
              </View>

              <View style={styles.barContainer}>
                <View style={[styles.barBg, { backgroundColor: tokens.border }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: color,
                        width: `${item.percentage}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.percentage, { color: tokens.textSecondary }]}>
                  {Math.round(item.percentage)}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <Text style={[styles.total, { color: tokens.textSecondary }]}>
        {total} check-ins this week
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 16,
  },
  barsContainer: {
    gap: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  label: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  barBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  percentage: {
    width: 40,
    textAlign: 'right',
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
  total: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
});
