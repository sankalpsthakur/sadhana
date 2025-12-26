import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Tool, ToolState } from '../../types';
import { fontFamilies } from '../../theme/fonts';

interface ToolCardProps {
  tool: Tool;
  onPress?: () => void;
}

export function ToolCard({ tool, onPress }: ToolCardProps) {
  const { tokens } = useTheme();

  const isLocked = tool.state === 'LockedPhase' || tool.state === 'LockedState';
  const isCooldown = tool.state === 'Cooldown';
  const isAvailable = tool.state === 'Available';

  const getStateIndicator = () => {
    switch (tool.state) {
      case 'LockedPhase':
        return '🔒';
      case 'LockedState':
        return '⚠️';
      case 'Cooldown':
        return '⏳';
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: tokens.bgSecondary,
          borderColor: isAvailable ? tokens.accent : tokens.border,
          opacity: isLocked ? 0.5 : 1,
        },
      ]}
      onPress={isAvailable ? onPress : undefined}
      activeOpacity={isAvailable ? 0.7 : 1}
      disabled={!isAvailable}
    >
      <View style={styles.header}>
        <Text style={[styles.name, { color: tokens.textPrimary }]}>{tool.name}</Text>
        {getStateIndicator() && (
          <Text style={styles.stateIcon}>{getStateIndicator()}</Text>
        )}
      </View>

      <Text style={[styles.duration, { color: tokens.textSecondary }]}>
        {isCooldown && tool.cooldownRemaining
          ? `Cooldown: ${tool.cooldownRemaining}`
          : tool.duration}
      </Text>

      {isAvailable && (
        <View style={[styles.startBadge, { backgroundColor: tokens.accent }]}>
          <Text style={[styles.startText, { color: tokens.bgPrimary }]}>Start</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  stateIcon: {
    fontSize: 14,
    marginLeft: 4,
  },
  duration: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    marginTop: 4,
  },
  startBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  startText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 10,
  },
});
