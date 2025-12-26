import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { MoodQuadrant } from '../../types';
import { fontFamilies } from '../../theme/fonts';

interface SealFlowProps {
  visible: boolean;
  onComplete: () => void;
}

type SealStep = 'review' | 'plot' | 'gratitude' | 'complete';

/**
 * Seal the Day Flow
 *
 * Multi-screen flow that closes the daily container.
 * Forces reflection, captures final state, enables meaning-making.
 *
 * Flow:
 * 1. Day Review (summary of activity)
 * 2. Final Mood Plot
 * 3. Gratitude (optional)
 * 4. Seal Complete → Night Mode
 */
export function SealFlow({ visible, onComplete }: SealFlowProps) {
  const { tokens, quadrants } = useTheme();
  const [step, setStep] = useState<SealStep>('review');
  const [selectedQuadrant, setSelectedQuadrant] = useState<MoodQuadrant>(null);
  const [gratitude, setGratitude] = useState('');

  const setMood = useAppStore((s) => s.setMood);
  const dailyCycle = useDailyCycleStore();
  const dreamIntention = dailyCycle.dreamIntention;
  const now = dailyCycle.demoNow ?? new Date();

  const handleContinue = () => {
    if (step === 'review') {
      setStep('plot');
    } else if (step === 'plot' && selectedQuadrant) {
      setStep('gratitude');
    } else if (step === 'gratitude') {
      // Record the seal
      dailyCycle.sealTheDay(
        {
          timestamp: now,
          moodQuadrant: selectedQuadrant!,
        },
        gratitude.trim() || undefined
      );

      // Update app store
      setMood(selectedQuadrant);

      // Activate night mode
      dailyCycle.activateNightMode();

      setStep('complete');
    } else if (step === 'complete') {
      // Reset for next time
      setStep('review');
      setSelectedQuadrant(null);
      setGratitude('');
      onComplete();
    }
  };

  const handleSkipGratitude = () => {
    dailyCycle.sealTheDay(
      {
        timestamp: now,
        moodQuadrant: selectedQuadrant!,
      },
      undefined
    );
    setMood(selectedQuadrant);
    dailyCycle.activateNightMode();
    setStep('complete');
  };

  // Calculate day summary
  const checkinCount = dailyCycle.checkins.length;
  const practiceCount = dailyCycle.practicesCompleted.length;
  const missionStatus = dailyCycle.mission?.status;
  const practiceNames = dailyCycle.practicesCompleted
    .map((p) => p.practiceName)
    .join(', ');

  const quadrantData: { quadrant: MoodQuadrant; label: string; emoji: string }[] = [
    { quadrant: 'Red', label: 'Activated', emoji: '🔴' },
    { quadrant: 'Yellow', label: 'Energized', emoji: '🟡' },
    { quadrant: 'Blue', label: 'Depleted', emoji: '🔵' },
    { quadrant: 'Green', label: 'Calm', emoji: '🟢' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
        {/* Step 1: Review */}
        {step === 'review' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: tokens.textPrimary }]}>
              Seal the Day
            </Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />

            <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
              Today:
            </Text>

            <View style={styles.summaryList}>
              <Text style={[styles.summaryItem, { color: tokens.textPrimary }]}>
                • Check-ins: {checkinCount}
              </Text>
              {practiceCount > 0 && (
                <Text style={[styles.summaryItem, { color: tokens.textPrimary }]}>
                  • Practices: {practiceNames || practiceCount}
                </Text>
              )}
              {missionStatus && (
                <Text style={[styles.summaryItem, { color: tokens.textPrimary }]}>
                  • Mission: {missionStatus === 'done' ? 'Complete ✓' : missionStatus}
                </Text>
              )}
              {dailyCycle.dreamCaptured && (
                <Text style={[styles.summaryItem, { color: tokens.textPrimary }]}>
                  • Dream captured ✓
                </Text>
              )}
            </View>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: tokens.accent }]}
              onPress={handleContinue}
              accessibilityRole="button"
              accessibilityLabel="Seal Continue"
            >
              <Text style={[styles.continueText, { color: tokens.bgPrimary }]}>
                Continue →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Final Plot */}
        {step === 'plot' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: tokens.textPrimary }]}>
              Where are you now?
            </Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />

            <View style={styles.moodGrid}>
              {quadrantData.map(({ quadrant, label, emoji }) => (
                <TouchableOpacity
                  key={quadrant}
                  style={[
                    styles.quadrantButton,
                    {
                      backgroundColor:
                        selectedQuadrant === quadrant
                          ? quadrants[quadrant!] + '30'
                          : tokens.bgSecondary,
                      borderColor:
                        selectedQuadrant === quadrant
                          ? quadrants[quadrant!]
                          : tokens.border,
                    },
                  ]}
                  onPress={() => setSelectedQuadrant(quadrant)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Seal Plot ${label}`}
                >
                  <Text style={styles.quadrantEmoji}>{emoji}</Text>
                  <Text
                    style={[
                      styles.quadrantLabel,
                      {
                        color:
                          selectedQuadrant === quadrant
                            ? quadrants[quadrant!]
                            : tokens.textSecondary,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={[
                styles.continueButton,
                {
                  backgroundColor: selectedQuadrant ? tokens.accent : tokens.border,
                  opacity: selectedQuadrant ? 1 : 0.5,
                },
              ]}
              onPress={handleContinue}
              disabled={!selectedQuadrant}
              accessibilityRole="button"
              accessibilityLabel="Seal Plot Continue"
            >
              <Text
                style={[
                  styles.continueText,
                  { color: selectedQuadrant ? tokens.bgPrimary : tokens.textSecondary },
                ]}
              >
                Plot →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Gratitude */}
        {step === 'gratitude' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: tokens.textPrimary }]}>
              One thing from today:
            </Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />

            <TextInput
              style={[
                styles.gratitudeInput,
                {
                  backgroundColor: tokens.bgSecondary,
                  borderColor: tokens.border,
                  color: tokens.textPrimary,
                },
              ]}
              placeholder="Optional..."
              placeholderTextColor={tokens.textSecondary}
              value={gratitude}
              onChangeText={setGratitude}
              maxLength={100}
              autoFocus
            />

            <View style={{ flex: 1 }} />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.skipButton, { borderColor: tokens.border }]}
                onPress={handleSkipGratitude}
                accessibilityRole="button"
                accessibilityLabel="Seal Gratitude Skip"
              >
                <Text style={[styles.skipText, { color: tokens.textSecondary }]}>
                  Skip
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: tokens.accent }]}
                onPress={handleContinue}
                accessibilityRole="button"
                accessibilityLabel="Seal Gratitude Save"
              >
                <Text style={[styles.continueText, { color: tokens.bgPrimary }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 4: Complete */}
        {step === 'complete' && (
          <View style={styles.completeContent}>
            <Text style={[styles.completeTitle, { color: tokens.textPrimary }]}>
              Day sealed.
            </Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />

            <Text style={[styles.completeSubtitle, { color: tokens.textSecondary }]}>
              Sleep well.
            </Text>

            <Text style={styles.moonEmoji}>🌙</Text>

            {dreamIntention && dreamIntention.type !== 'none' && (
              <View style={[styles.intentionBox, { backgroundColor: tokens.bgSecondary }]}>
                <Text style={[styles.intentionLabel, { color: tokens.textSecondary }]}>
                  Tonight's intention:
                </Text>
                <Text style={[styles.intentionText, { color: tokens.textPrimary }]}>
                  {dreamIntention.type === 'lucidity'
                    ? 'Practice lucidity'
                    : dreamIntention.description || dreamIntention.type}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: tokens.accent }]}
              onPress={handleContinue}
              accessibilityRole="button"
              accessibilityLabel="Seal Done"
            >
              <Text style={[styles.continueText, { color: tokens.bgPrimary }]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');
const gridSize = (width - 64) / 2;

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
  completeContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  subtitle: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  summaryList: {
    gap: 8,
    marginBottom: 32,
  },
  summaryItem: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  quadrantButton: {
    width: gridSize,
    height: gridSize,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quadrantEmoji: {
    fontSize: 32,
  },
  quadrantLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  gratitudeInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontFamily: fontFamilies.text.regular,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  skipText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 15,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeTitle: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
  },
  completeSubtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  moonEmoji: {
    fontSize: 64,
    marginVertical: 48,
  },
  intentionBox: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 32,
  },
  intentionLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  intentionText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 15,
    lineHeight: 22,
  },
});
