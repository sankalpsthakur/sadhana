import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { LockType } from '../../types';
import { fontFamilies } from '../../theme/fonts';

interface SafetyBannerProps {
  lockType: LockType;
}

const lockMessages: Record<LockType, { text: string; expanded: string }> = {
  kavacha: {
    text: 'Depth locked. Ground first.',
    expanded: 'Your nervous system is showing signs of overwhelm. All intensity practices are locked until you return to Green on the Mood Meter.',
  },
  nightmare: {
    text: 'Dream work paused for nervous system safety.',
    expanded: 'Two consecutive nights of terror detected. Mirror mode and dream practices are locked for 3 stable nights.',
  },
  neti: {
    text: 'Neti paused. Return to embodiment.',
    expanded: 'A dissociation flag was detected. Witness practices are in cooldown for 72 hours.',
  },
  serpent: {
    text: 'Voltage too high. Cooling in progress.',
    expanded: 'Kill-switch was triggered. High-voltage practices are locked for 7 days while your system stabilizes.',
  },
  union: {
    text: 'Dyad paused. Partner stabilizing.',
    expanded: 'Your partner\'s stability has dropped. Dyad practices are paused until they return to baseline.',
  },
  sleepEmergency: {
    text: 'Sleep integrity compromised. Seal mode active.',
    expanded: 'Two-night crash pattern detected. Only grounding and seal practices are available until sleep is restored.',
  },
};

export function SafetyBanner({ lockType }: SafetyBannerProps) {
  const { getSafetyColor, tokens, spacing } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const bannerColor = getSafetyColor(lockType);
  const message = lockMessages[lockType];

  if (isDismissed) return null;

  return (
    <Pressable
      onPress={() => setIsExpanded(!isExpanded)}
      style={[
        styles.container,
        {
          backgroundColor: bannerColor + '20', // 20% opacity
          borderColor: bannerColor,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>🛡️</Text>
        <Text style={[styles.text, { color: tokens.textPrimary }]}>{message.text}</Text>
      </View>

      {isExpanded && (
        <Text style={[styles.expanded, { color: tokens.textSecondary }]}>
          {message.expanded}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
            setIsDismissed(true);
          }}
        >
          <Text style={[styles.actionText, { color: tokens.textSecondary }]}>Dismiss</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
        >
          <Text style={[styles.actionText, { color: tokens.accent }]}>Why?</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    flex: 1,
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
    lineHeight: 20,
  },
  expanded: {
    marginTop: 8,
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  actionText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
});
