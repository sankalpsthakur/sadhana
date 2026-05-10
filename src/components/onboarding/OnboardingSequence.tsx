import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { phaseInfo } from '../../mock/phases';
import { Phase } from '../../types';
import { fontFamilies } from '../../theme/fonts';
import {
  purchaseSadhanaSubscription,
  refreshSadhanaEntitlement,
  restoreSadhanaPurchases,
} from '../../billing';
import { SADHANA_PAYWALL_COPY } from '../../billing/products';

type Step = 'question' | 'path' | 'paywall';

export function OnboardingSequence() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setPhase = useAppStore((s) => s.setPhase);
  const setEntitlement = useAppStore((s) => s.setEntitlement);
  const [step, setStep] = useState<Step>('question');
  const [selectedPhase, setSelectedPhase] = useState<Phase>(1);
  const [purchaseState, setPurchaseState] = useState<'idle' | 'purchasing' | 'restoring'>('idle');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const phases: Phase[] = useMemo(() => [1, 2, 3, 4, 5, 6, 7], []);
  const selectedInfo = phaseInfo[selectedPhase];

  const finishOnboarding = () => {
    setPhase(selectedPhase);
    completeOnboarding();
  };

  const startTrial = async () => {
    if (purchaseState !== 'idle') return;
    setPurchaseError(null);
    setPurchaseState('purchasing');
    try {
      await purchaseSadhanaSubscription('com.sadhana.premium.annual');
      const entitlement = await refreshSadhanaEntitlement();
      if (!entitlement.active) {
        setPurchaseError('Purchase did not activate Sadhana Premium yet. Please restore after it appears in your Apple account.');
        return;
      }
      setEntitlement(entitlement);
      finishOnboarding();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to start trial. Please try again or restore an existing purchase.';
      setPurchaseError(message);
    } finally {
      setPurchaseState('idle');
    }
  };

  const restore = async () => {
    if (purchaseState !== 'idle') return;
    setPurchaseError(null);
    setPurchaseState('restoring');
    try {
      const entitlement = await restoreSadhanaPurchases();
      if (entitlement.active) {
        setEntitlement(entitlement);
        finishOnboarding();
        return;
      }
      setPurchaseError('No active Sadhana Premium purchase was found.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Restore failed. Please try again.';
      setPurchaseError(message);
    } finally {
      setPurchaseState('idle');
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: tokens.bgPrimary,
          paddingBottom: Math.max(20, insets.bottom + 16),
        },
      ]}
    >
      {step === 'question' && (
        <View style={styles.center}>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>
            What would change if you could trust your own nervous system?
          </Text>
          <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
            Sadhana is a paid practice system for working with seven inner gates:
            fear, guilt, shame, grief, lies, illusion, and attachment. Pick the
            gate you want to defeat first.
          </Text>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Onboarding Continue"
            testID="OnboardingContinueButton"
            onPress={() => setStep('path')}
          >
            <Text style={[styles.primaryText, { color: tokens.bgPrimary }]}>Continue</Text>
          </Pressable>
        </View>
      )}

      {step === 'path' && (
        <View style={styles.content}>
          <Text style={[styles.heading, { color: tokens.textPrimary }]}>The Path</Text>
          <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
            Pick the gate that is alive for you now. The path is not sequential:
            every gate opens with Premium, and your daily state decides the practice.
          </Text>

          <ScrollView contentContainerStyle={styles.phaseList} showsVerticalScrollIndicator={false}>
            {phases.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.phaseRow,
                  {
                    borderColor: p === selectedPhase ? tokens.accent : tokens.border,
                    backgroundColor: tokens.bgSecondary,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Choose ${phaseInfo[p].obstacle}`}
                onPress={() => setSelectedPhase(p)}
              >
                <Text style={[styles.phaseNumber, { color: tokens.accent }]}>{p}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.phaseName, { color: tokens.textPrimary }]}>
                    {phaseInfo[p].obstacle}
                  </Text>
                  <Text style={[styles.phaseSub, { color: tokens.textSecondary }]}>
                    {phaseInfo[p].promise}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Pressable
            style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`Work on ${selectedInfo.obstacle}`}
            testID="OnboardingPhaseContinueButton"
            onPress={() => setStep('paywall')}
          >
            <Text style={[styles.primaryText, { color: tokens.bgPrimary }]}>
              Work on {selectedInfo.obstacle}
            </Text>
          </Pressable>
        </View>
      )}

      {step === 'paywall' && (
        <View style={styles.center}>
          <Text style={[styles.kicker, { color: tokens.accent }]}>Your first gate</Text>
          <Text style={[styles.heading, { color: tokens.textPrimary }]}>{selectedInfo.obstacle}</Text>
          <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
            {selectedInfo.promise} Start with a 14-day trial. After that, Sadhana stays
            paid so the full ladder remains focused, private, and ad-free.
          </Text>
          <View style={[styles.promiseBox, { borderColor: tokens.border, backgroundColor: tokens.bgSecondary }]}>
            <Text style={[styles.promiseTitle, { color: tokens.textPrimary }]}>
              {SADHANA_PAYWALL_COPY.title}
            </Text>
            <Text style={[styles.phaseSub, { color: tokens.textSecondary }]}>
              All seven gates unlocked. No forced order. Daily practices adapt to your state.
            </Text>
            <Text style={[styles.phaseSub, { color: tokens.textSecondary }]}>
              {SADHANA_PAYWALL_COPY.trial}
            </Text>
          </View>
          {purchaseError && (
            <Text style={[styles.errorText, { color: tokens.textSecondary }]}>{purchaseError}</Text>
          )}
          <Pressable
            style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Start 14-day free trial"
            testID="OnboardingStartTrialButton"
            disabled={purchaseState !== 'idle'}
            onPress={startTrial}
          >
            <Text style={[styles.primaryText, { color: tokens.bgPrimary }]}>
              {purchaseState === 'purchasing' ? 'Opening App Store...' : 'Start 14-day free trial'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.restoreButton}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Restore purchases"
            testID="OnboardingRestoreButton"
            disabled={purchaseState !== 'idle'}
            onPress={restore}
          >
            <Text style={[styles.restoreText, { color: tokens.textSecondary }]}>
              {purchaseState === 'restoring' ? 'Restoring...' : SADHANA_PAYWALL_COPY.restore}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 28 },
  center: { flex: 1, justifyContent: 'center' },
  content: { flex: 1 },
  title: { fontFamily: fontFamilies.display.semibold, fontSize: 30, lineHeight: 36, marginBottom: 16 },
  heading: { fontFamily: fontFamilies.display.semibold, fontSize: 24, lineHeight: 30, marginBottom: 12 },
  kicker: { fontFamily: fontFamilies.text.semibold, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 },
  subtitle: { fontFamily: fontFamilies.text.regular, fontSize: 14, lineHeight: 22, marginBottom: 24 },
  primaryButton: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontFamily: fontFamilies.text.semibold, fontSize: 16, letterSpacing: 0.2 },
  phaseList: { paddingBottom: 16, gap: 10 },
  phaseRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 14, gap: 12 },
  phaseNumber: { fontFamily: fontFamilies.display.semibold, fontSize: 18, width: 24, textAlign: 'center' },
  phaseName: { fontFamily: fontFamilies.text.semibold, fontSize: 15 },
  phaseSub: { fontFamily: fontFamilies.text.regular, fontSize: 12, lineHeight: 18 },
  promiseBox: { borderWidth: 1, borderRadius: 14, padding: 16, gap: 8, marginBottom: 18 },
  promiseTitle: { fontFamily: fontFamilies.text.semibold, fontSize: 16, lineHeight: 22 },
  errorText: { fontFamily: fontFamilies.text.regular, fontSize: 12, lineHeight: 18, marginBottom: 12 },
  restoreButton: { alignItems: 'center', paddingVertical: 14 },
  restoreText: { fontFamily: fontFamilies.text.medium, fontSize: 13 },
});
