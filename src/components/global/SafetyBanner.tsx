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
    text: 'The body is asking for ground. Depth will open when it has settled.',
    expanded: 'The nervous system is showing signs of overwhelm. Intensity practices rest until Mood returns to Green.',
  },
  nightmare: {
    text: 'Dream work is resting. The body is asking for sleep first.',
    expanded: 'Two consecutive nights of terror were noted. Mirror mode and dream practices rest for three stable nights.',
  },
  neti: {
    text: 'Neti is resting. The body is asking to be felt again.',
    expanded: 'A dissociation signal was noted. Witness practices rest for 72 hours while embodiment returns.',
  },
  serpent: {
    text: 'Voltage is high. The body is asking to cool.',
    expanded: 'The kill-switch was used. High-voltage practices rest for 7 days while the system stabilizes.',
  },
  union: {
    text: 'Dyad is resting. The partner is stabilizing.',
    expanded: 'Your partner\'s stability has dropped. Dyad practices rest until they return to baseline.',
  },
  sleepEmergency: {
    text: 'Sleep is uneven. The body is asking for restoration.',
    expanded: 'A two-night crash pattern was noted. Only grounding and seal practices remain until sleep is restored.',
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
