import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

export function StatCard({ title, value, subtitle, trend, trendValue, color }: StatCardProps) {
  const { tokens, quadrants } = useTheme();

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return quadrants.Green;
      case 'down':
        return quadrants.Red;
      default:
        return tokens.textSecondary;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      <Text style={[styles.title, { color: tokens.textSecondary }]}>{title}</Text>
      <Text style={[styles.value, { color: color || tokens.textPrimary }]}>{value}</Text>

      {(subtitle || trendValue) && (
        <View style={styles.footer}>
          {subtitle && (
            <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>{subtitle}</Text>
          )}
          {trend && trendValue && (
            <View style={styles.trendContainer}>
              <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
                {getTrendIcon()}
              </Text>
              <Text style={[styles.trendValue, { color: getTrendColor() }]}>
                {trendValue}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
  },
  title: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  value: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 28,
    lineHeight: 34,
    fontVariant: ['tabular-nums'],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  subtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 12,
    marginRight: 2,
  },
  trendValue: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
  },
});
