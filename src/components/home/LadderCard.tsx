import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { getStabilityBand } from '../../store/selectors';
import { phaseInfo, phaseUnlockRequirements } from '../../mock/phases';
import { Phase } from '../../types';
import { fontFamilies } from '../../theme/fonts';

export function LadderCard() {
  const { tokens } = useTheme();
  const phase = useAppStore((state) => state.phase);
  const stability = useAppStore((state) => state.stability);

  const currentInfo = phaseInfo[phase];
  const nextPhase = (phase < 7 ? phase + 1 : null) as Phase | null;
  const nextInfo = nextPhase ? phaseInfo[nextPhase] : null;
  const nextRequirements = nextPhase ? phaseUnlockRequirements[nextPhase] : null;
  const band = getStabilityBand(stability);

  // Calculate progress toward next phase
  const getProgress = (): number => {
    if (!nextRequirements || nextRequirements.stabilityRequired === null) {
      return 0;
    }
    const required = nextRequirements.stabilityRequired;
    if (stability >= required) return 100;
    return Math.round((stability / required) * 100);
  };

  const getRequirementText = (): string => {
    if (!nextRequirements) return 'You have reached the highest phase.';

    const parts: string[] = [];

    if (nextRequirements.stabilityRequired) {
      const needed = nextRequirements.stabilityRequired - stability;
      if (needed > 0) {
        parts.push(`+${needed} stability needed`);
      } else {
        parts.push('Stability requirement met');
      }
    }

    if (nextRequirements.durationDays > 0) {
      parts.push(`${nextRequirements.durationDays} days at current band`);
    }

    if (nextRequirements.additionalRequirements.length > 0) {
      parts.push(...nextRequirements.additionalRequirements);
    }

    return parts.join(' • ');
  };

  const progress = getProgress();

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Current Phase</Text>
          <Text style={[styles.phaseName, { color: tokens.textPrimary }]}>
            {currentInfo.name}
          </Text>
          <Text style={[styles.chakra, { color: tokens.textSecondary }]}>
            {currentInfo.chakra} • {currentInfo.chakraLocation}
          </Text>
        </View>

        {nextInfo && (
          <View style={styles.nextBadge}>
            <Text style={[styles.nextLabel, { color: tokens.textSecondary }]}>Next</Text>
            <Text style={[styles.nextName, { color: tokens.accent }]}>{nextInfo.name}</Text>
          </View>
        )}
      </View>

      {/* Progress bar */}
      {nextPhase && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBg, { backgroundColor: tokens.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: tokens.accent,
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: tokens.textSecondary }]}>
            {progress}%
          </Text>
        </View>
      )}

      <Text style={[styles.requirement, { color: tokens.textSecondary }]}>
        {getRequirementText()}
      </Text>

      <TouchableOpacity style={styles.link}>
        <Text style={[styles.linkText, { color: tokens.accent }]}>View Ladder →</Text>
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
    marginBottom: 16,
  },
  label: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  phaseName: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 20,
    lineHeight: 26,
    marginTop: 2,
  },
  chakra: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    marginTop: 2,
  },
  nextBadge: {
    alignItems: 'flex-end',
  },
  nextLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  nextName: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 13,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    minWidth: 36,
    textAlign: 'right',
  },
  requirement: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  link: {
    marginTop: 12,
  },
  linkText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
});
