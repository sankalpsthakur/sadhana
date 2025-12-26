import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { getPracticeById } from '../../mock/practices';
import { fontFamilies } from '../../theme/fonts';

interface EveningAlertProps {
  visible: boolean;
  onComplete: () => void;
}

type AlertStep = 'intro' | 'heavy-earth' | 'churn' | 'complete';

export function EveningAlert({ visible, onComplete }: EveningAlertProps) {
  const { tokens, quadrants } = useTheme();
  const [step, setStep] = useState<AlertStep>('intro');

  const recordPractice = useDailyCycleStore((s) => s.recordPractice);
  const resolveEveningAlert = useDailyCycleStore((s) => s.resolveEveningAlert);
  const demoNow = useDailyCycleStore((s) => s.demoNow);

  const logPractice = (practiceId: string) => {
    const practice = getPracticeById(practiceId);
    const durationSeconds = practice?.durationMinutes
      ? Math.round(practice.durationMinutes * 60)
      : 180;
    recordPractice({
      practiceId,
      practiceName: practice?.name ?? practiceId,
      timestamp: demoNow ?? new Date(),
      durationSeconds,
      completed: true,
    });
  };

  const handleHeavyEarthComplete = () => {
    logPractice('heavy-earth');
    setStep('churn');
  };

  const handleChurnComplete = () => {
    logPractice('churn');
    resolveEveningAlert();
    setStep('complete');
  };

  const handleDone = () => {
    setStep('intro');
    onComplete();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
        {step === 'intro' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: quadrants.Red }]}>Evening Alert</Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />
            <Text style={[styles.body, { color: tokens.textPrimary }]}>
              You are in Red during the evening window. Before sealing, we need to ground and
              discharge to protect sleep.
            </Text>

            <View style={styles.steps}>
              <Text style={[styles.stepItem, { color: tokens.textSecondary }]}>
                1. Heavy Earth (3-5 min)
              </Text>
              <Text style={[styles.stepItem, { color: tokens.textSecondary }]}>
                2. Churn (3 min)
              </Text>
            </View>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: quadrants.Red }]}
              onPress={() => setStep('heavy-earth')}
              accessibilityRole="button"
              accessibilityLabel="Begin Heavy Earth"
            >
              <Text style={[styles.primaryText, { color: tokens.bgPrimary }]}>
                Begin Heavy Earth →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'heavy-earth' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: tokens.textPrimary }]}>Heavy Earth</Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />
            <Text style={[styles.body, { color: tokens.textSecondary }]}>
              Slow the breath. Feel weight in feet and hips. Let the body sink.
            </Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
              onPress={handleHeavyEarthComplete}
              accessibilityRole="button"
              accessibilityLabel="Complete Heavy Earth"
            >
              <Text style={[styles.primaryText, { color: tokens.bgPrimary }]}>
                Heavy Earth Complete →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'churn' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: tokens.textPrimary }]}>Churn</Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />
            <Text style={[styles.body, { color: tokens.textSecondary }]}>
              Discharge the charge. Write or breathe it out without editing.
            </Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
              onPress={handleChurnComplete}
              accessibilityRole="button"
              accessibilityLabel="Complete Churn"
            >
              <Text style={[styles.primaryText, { color: tokens.bgPrimary }]}>
                Churn Complete →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'complete' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: tokens.textPrimary }]}>Grounded</Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />
            <Text style={[styles.body, { color: tokens.textSecondary }]}>
              You are clear to seal the day.
            </Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
              onPress={handleDone}
              accessibilityRole="button"
              accessibilityLabel="Evening Alert Done"
            >
              <Text style={[styles.primaryText, { color: tokens.bgPrimary }]}>
                Continue →
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
  },
  divider: {
    height: 1,
    marginVertical: 24,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
  steps: {
    marginTop: 16,
    gap: 6,
  },
  stepItem: {
    fontSize: 12,
    lineHeight: 18,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
