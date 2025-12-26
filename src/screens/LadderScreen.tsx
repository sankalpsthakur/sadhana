import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { useAppStore } from '../store/useAppStore';
import { phaseInfo } from '../mock/phases';
import { Phase } from '../types';
import { fontFamilies } from '../theme/fonts';

export function LadderScreen() {
  const { tokens } = useTheme();
  const currentPhase = useAppStore((state) => state.phase);

  const phases: Phase[] = [1, 2, 3, 4, 5, 6, 7];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: tokens.textPrimary }]}>The Ladder</Text>
        <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
          Seven Phases of Sovereignty
        </Text>

        <View style={styles.ladder}>
          {phases.map((phaseId) => {
            const info = phaseInfo[phaseId];
            const isUnlocked = phaseId <= currentPhase;
            const isCurrent = phaseId === currentPhase;

            return (
              <View
                key={phaseId}
                style={[
                  styles.phaseRow,
                  {
                    backgroundColor: isCurrent ? tokens.bgSecondary : 'transparent',
                    borderColor: isUnlocked ? tokens.accent : tokens.border,
                    opacity: isUnlocked ? 1 : 0.5,
                  },
                ]}
              >
                <View style={styles.phaseNumber}>
                  <Text
                    style={[
                      styles.phaseNumberText,
                      { color: isUnlocked ? tokens.accent : tokens.textSecondary },
                    ]}
                  >
                    {phaseId}
                  </Text>
                </View>
                <View style={styles.phaseInfo}>
                  <Text style={[styles.phaseName, { color: tokens.textPrimary }]}>
                    {info.name}
                  </Text>
                  <Text style={[styles.phaseChakra, { color: tokens.textSecondary }]}>
                    {info.chakra}
                  </Text>
                </View>
                {isCurrent && (
                  <View style={[styles.currentBadge, { backgroundColor: tokens.accent }]}>
                    <Text style={[styles.currentBadgeText, { color: tokens.bgPrimary }]}>
                      Current
                    </Text>
                  </View>
                )}
                {!isUnlocked && (
                  <Text style={[styles.lockIcon, { color: tokens.textSecondary }]}>🔒</Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 24,
  },
  ladder: {
    gap: 8,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  phaseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseNumberText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 16,
  },
  phaseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  phaseName: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 15,
  },
  phaseChakra: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentBadgeText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 10,
  },
  lockIcon: {
    fontSize: 16,
  },
});
