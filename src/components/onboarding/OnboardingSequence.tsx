import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { phaseInfo } from '../../mock/phases';
import { Phase } from '../../types';
import { fontFamilies } from '../../theme/fonts';

type Step = 'question' | 'path' | 'compass';

export function OnboardingSequence() {
  const { tokens } = useTheme();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [step, setStep] = useState<Step>('question');

  const phases: Phase[] = useMemo(() => [1, 2, 3, 4, 5, 6, 7], []);

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
      {step === 'question' && (
        <View style={styles.center}>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>
            What would change if you could trust your own nervous system?
          </Text>
          <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
            Sadhana is a closed-loop practice system. Phase is capability. Mode is right now.
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
            onPress={() => setStep('path')}
          >
            <Text style={[styles.primaryText, { color: tokens.bgPrimary }]}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'path' && (
        <View style={styles.content}>
          <Text style={[styles.heading, { color: tokens.textPrimary }]}>The Path</Text>
          <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
            Seven phases. You unlock depth by building stability.
          </Text>

          <ScrollView contentContainerStyle={styles.phaseList} showsVerticalScrollIndicator={false}>
            {phases.map((p) => (
              <View
                key={p}
                style={[
                  styles.phaseRow,
                  { borderColor: tokens.border, backgroundColor: tokens.bgSecondary },
                ]}
              >
                <Text style={[styles.phaseNumber, { color: tokens.accent }]}>{p}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.phaseName, { color: tokens.textPrimary }]}>
                    {phaseInfo[p].name}
                  </Text>
                  <Text style={[styles.phaseSub, { color: tokens.textSecondary }]}>
                    {phaseInfo[p].chakra}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
            onPress={() => setStep('compass')}
          >
            <Text style={[styles.primaryText, { color: tokens.bgPrimary }]}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 'compass' && (
        <View style={styles.center}>
          <Text style={[styles.heading, { color: tokens.textPrimary }]}>The Compass</Text>
          <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
            Each check-in captures two truths: what you report, and what the system can infer.
            Start by plotting your mood and naming it.
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
            onPress={completeOnboarding}
          >
            <Text style={[styles.primaryText, { color: tokens.bgPrimary }]}>Start</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 28 },
  center: { flex: 1, justifyContent: 'center' },
  content: { flex: 1 },
  title: { fontFamily: fontFamilies.display.semibold, fontSize: 30, lineHeight: 36, marginBottom: 16 },
  heading: { fontFamily: fontFamilies.display.semibold, fontSize: 24, lineHeight: 30, marginBottom: 12 },
  subtitle: { fontFamily: fontFamilies.text.regular, fontSize: 14, lineHeight: 22, marginBottom: 24 },
  primaryButton: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontFamily: fontFamilies.text.semibold, fontSize: 16, letterSpacing: 0.2 },
  phaseList: { paddingBottom: 16, gap: 10 },
  phaseRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 14, gap: 12 },
  phaseNumber: { fontFamily: fontFamilies.display.semibold, fontSize: 18, width: 24, textAlign: 'center' },
  phaseName: { fontFamily: fontFamilies.text.semibold, fontSize: 15 },
  phaseSub: { fontFamily: fontFamilies.text.regular, fontSize: 12 },
});
