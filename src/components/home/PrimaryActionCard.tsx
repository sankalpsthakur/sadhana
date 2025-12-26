import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { getPrimaryPractice } from '../../mock/tools';
import { modeInfo } from '../../mock/modes';
import { getCooldownStatus } from '../../utils/cooldowns';
import { fontFamilies } from '../../theme/fonts';

interface PrimaryActionCardProps {
  onStart?: (practiceId: string) => void;
}

export function PrimaryActionCard({ onStart }: PrimaryActionCardProps) {
  const { tokens, getConfidenceColor } = useTheme();
  const phase = useAppStore((state) => state.phase);
  const mode = useAppStore((state) => state.mode);
  const confidence = useAppStore((state) => state.confidence);
  const netiCooldownEndsAt = useAppStore((state) => state.netiCooldownEndsAt);
  const serpentCooldownEndsAt = useAppStore((state) => state.serpentCooldownEndsAt);
  const demoNow = useDailyCycleStore((s) => s.demoNow);
  const now = demoNow ?? new Date();
  const netiCooldown = getCooldownStatus(netiCooldownEndsAt, now);
  const serpentCooldown = getCooldownStatus(serpentCooldownEndsAt, now);

  const practice = getPrimaryPractice(mode, phase);
  const mInfo = modeInfo[mode];

  const getReasonText = (): string => {
    switch (mode) {
      case 'Armor':
        return 'Arousal is high. Bring attention to feet first.';
      case 'Rebuild':
        return 'Energy is low. Gentle restoration recommended.';
      case 'Mirror':
        return 'Morning reflection time. Capture what emerged in sleep.';
      case 'Forge':
        return 'Energy is ready. Channel into purposeful action.';
      case 'Bridge':
        return 'Heart is coherent. Deepen the connection.';
      case 'Signal':
        return 'System is quiet. Honor the silence.';
      case 'Void':
        return 'Conditions are clear. Witness state available.';
      case 'Conductor':
        return 'All systems aligned. Full integration possible.';
      default:
        return 'Practice recommended based on your current state.';
    }
  };

  if (!practice) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      <Text style={[styles.title, { color: tokens.textPrimary }]}>{practice.name}</Text>
      <View style={[styles.divider, { backgroundColor: tokens.border }]} />

      <Text style={[styles.reason, { color: tokens.textSecondary }]}>{getReasonText()}</Text>

      <View style={styles.auditRow}>
        <Text style={[styles.auditLabel, { color: tokens.textSecondary }]}>Audit: </Text>
        <Text style={[styles.auditValue, { color: getConfidenceColor(confidence) }]}>
          {confidence}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: tokens.accent }]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Primary Action Start ${practice.name}`}
        onPress={() => {
          if (practice.id === 'neti-protocol' && netiCooldown) {
            Alert.alert('Cooldown Active', `Neti is in cooldown for ${netiCooldown.label}.`);
            return;
          }
          if (practice.id === 'sushumna-rise' && serpentCooldown) {
            Alert.alert('Cooldown Active', `Serpent is in cooldown for ${serpentCooldown.label}.`);
            return;
          }
          if (onStart) {
            onStart(practice.id);
            return;
          }
          Alert.alert(practice.name, practice.description);
        }}
      >
        <Text style={[styles.buttonText, { color: tokens.bgPrimary }]}>
          START ({practice.duration})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.whyLink}
        accessibilityRole="button"
        accessibilityLabel={`Primary Action Why ${practice.name}`}
        onPress={() => Alert.alert(practice.name, practice.description)}
      >
        <Text style={[styles.whyText, { color: tokens.accent }]}>Why this? ↗</Text>
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
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 22,
    lineHeight: 28,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  reason: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  auditRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  auditLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
  },
  auditValue: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 11,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  whyLink: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  whyText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
});
