import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Practice, TimeWindow, timeWindowLabels } from '../../mock/practices';
import { Phase } from '../../types';
import { fontFamilies } from '../../theme/fonts';

interface PracticeCardProps {
  practice: Practice;
  status: 'available' | 'recommended' | 'locked-time' | 'locked-stability' | 'cooldown' | 'completed';
  currentPhase?: Phase;
  cooldownLabel?: string;
  onPress?: () => void;
}

export function PracticeCard({ practice, status, cooldownLabel, currentPhase, onPress }: PracticeCardProps) {
  const { tokens, quadrants } = useTheme();

  const isLocked = status.startsWith('locked') || status === 'cooldown';
  const isCompleted = status === 'completed';
  const isRecommended = status === 'recommended';

  const getStatusInfo = () => {
    switch (status) {
      case 'available':
        return { label: null, color: tokens.accent };
      case 'recommended':
        return { label: 'Recommended', color: quadrants.Green };
      case 'locked-time':
        const windows = practice.timeWindows as TimeWindow[];
        const windowLabel = windows.length === 1 ? timeWindowLabels[windows[0]] : 'Later';
        return { label: windowLabel, color: tokens.textSecondary };
      case 'locked-stability':
        return { label: `Stability ${practice.minStability}+`, color: tokens.textSecondary };
      case 'cooldown':
        return { label: `Cooldown ${cooldownLabel ?? ''}`.trim(), color: tokens.textSecondary };
      case 'completed':
        return { label: 'Done', color: quadrants.Green };
      default:
        return { label: null, color: tokens.textSecondary };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isLocked ? tokens.bgPrimary : tokens.bgSecondary,
          borderColor: isRecommended ? quadrants.Green : tokens.border,
          borderWidth: isRecommended ? 2 : 1,
          opacity: isLocked ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{practice.icon}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.name,
              { color: isLocked ? tokens.textSecondary : tokens.textPrimary },
            ]}
            numberOfLines={1}
          >
            {practice.name}
          </Text>
          {isLocked && (
            <Text style={[styles.lockIcon, { color: tokens.textSecondary }]}>🔒</Text>
          )}
          {isCompleted && (
            <Text style={[styles.checkIcon, { color: quadrants.Green }]}>✓</Text>
          )}
        </View>

        <Text
          style={[styles.description, { color: tokens.textSecondary }]}
          numberOfLines={1}
        >
          {practice.description}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.duration, { color: tokens.textSecondary }]}>
            {practice.duration}
          </Text>
          {statusInfo.label && (
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 15,
    lineHeight: 20,
    flex: 1,
  },
  lockIcon: {
    fontSize: 12,
    marginLeft: 6,
  },
  checkIcon: {
    fontSize: 14,
    marginLeft: 6,
  },
  description: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  duration: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
  },
});
