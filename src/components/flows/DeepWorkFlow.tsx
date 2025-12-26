import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Vibration,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { MoodQuadrant } from '../../types';
import { getTimeWindow } from '../../utils/timeWindow';
import { fontFamilies } from '../../theme/fonts';

interface DeepWorkFlowProps {
  visible: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

type DeepWorkStep = 'preflight' | 'bellows' | 'intention' | 'timer' | 'output' | 'return' | 'complete';

const TIMER_DURATION = 25 * 60; // 25 minutes in seconds
const QUICK_MOOD: Exclude<MoodQuadrant, null>[] = ['Green', 'Yellow', 'Red', 'Blue'];

/**
 * Deep Work Flow (Phase 3+)
 *
 * A complete focus session with:
 * 1. Preflight check (party readiness)
 * 2. Bellows breath
 * 3. Intention set
 * 4. 25-min timer (focused engagement)
 * 5. Output log (loot collection)
 * 6. Return check (safe extraction)
 */
export function DeepWorkFlow({
  visible,
  onComplete,
  onCancel,
}: DeepWorkFlowProps) {
  const { tokens, quadrants } = useTheme();
  const [step, setStep] = useState<DeepWorkStep>('preflight');
  const [intention, setIntention] = useState('');
  const [output, setOutput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [returnedToGreen, setReturnedToGreen] = useState<boolean | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stability = useAppStore((s) => s.stability);
  const moodQuadrant = useAppStore((s) => s.moodQuadrant);
  const setMood = useAppStore((s) => s.setMood);
  const startDeepWork = useDailyCycleStore((s) => s.startDeepWork);
  const completeDeepWork = useDailyCycleStore((s) => s.completeDeepWork);
  const demoNow = useDailyCycleStore((s) => s.demoNow);

  const timeWindow = getTimeWindow(demoNow ?? new Date());
  const isTimeAllowed = timeWindow === 'DAY';

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            Vibration.vibrate([0, 500, 200, 500]);
            setStep('output');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartBellows = () => {
    setStep('bellows');
  };

  const handleBellowsComplete = () => {
    setStep('intention');
  };

  const handleSetIntention = () => {
    if (!intention.trim()) return;

    const id = startDeepWork(intention.trim());
    setSessionId(id);
    setStep('timer');
    setIsTimerActive(true);
  };

  const handleTimerComplete = () => {
    setIsTimerActive(false);
    setStep('output');
  };

  const handleSkipTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerActive(false);
    setTimeRemaining(0);
    setStep('output');
  };

  const handleLogOutput = () => {
    setStep('return');
  };

  const handleReturnCheck = (isGreen: boolean) => {
    setReturnedToGreen(isGreen);

    if (sessionId) {
      completeDeepWork(sessionId, output.trim(), isGreen);
    }

    if (isGreen) {
      setMood('Green');
    }

    setStep('complete');

    setTimeout(() => {
      // Reset state
      setStep('preflight');
      setIntention('');
      setOutput('');
      setTimeRemaining(TIMER_DURATION);
      setSessionId(null);
      setReturnedToGreen(null);
      onComplete();
    }, 2000);
  };

  // Preflight checks
  const preflightChecks = [
    { label: 'Sleep last night: 7h+', passed: true },
    { label: 'Jaw tension: Low', passed: true },
    { label: 'HRV: Resilient', passed: stability >= 70 },
    { label: `Current state: ${moodQuadrant ?? '—'}`, passed: moodQuadrant === 'Yellow' },
  ];

  const allChecksPassed = isTimeAllowed && preflightChecks.every((c) => c.passed);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
        {/* Cancel button */}
        {step !== 'timer' && step !== 'complete' && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={[styles.cancelText, { color: tokens.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}

        {/* Step 1: Preflight */}
        {step === 'preflight' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: tokens.textPrimary }]}>
              Deep Work Pre-flight
            </Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />

            <View style={styles.checkList}>
              {preflightChecks.map((check, i) => (
                <View key={i} style={styles.checkRow}>
                  <Text style={[styles.checkIcon, { color: check.passed ? quadrants.Green : quadrants.Red }]}>
                    {check.passed ? '✓' : '✗'}
                  </Text>
                  <Text style={[styles.checkLabel, { color: tokens.textPrimary }]}>
                    {check.label}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ flex: 1 }} />

            {allChecksPassed ? (
              <>
                <Text style={[styles.clearText, { color: quadrants.Green }]}>
                  Clear to begin.
                </Text>
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
                  onPress={handleStartBellows}
                  accessibilityRole="button"
                  accessibilityLabel="Deep Work Begin"
                >
                  <Text style={[styles.buttonText, { color: tokens.bgPrimary }]}>
                    Begin Bellows → Deep Work
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {isTimeAllowed && (
                  <View style={styles.quickMoodContainer}>
                    <Text style={[styles.quickMoodLabel, { color: tokens.textSecondary }]}>
                      Set current state
                    </Text>
                    <View style={styles.quickMoodRow}>
                      {QUICK_MOOD.map((q) => (
                        <TouchableOpacity
                          key={q}
                          style={[
                            styles.quickMoodBtn,
                            {
                              borderColor: q === moodQuadrant ? tokens.accent : tokens.border,
                              backgroundColor: q === moodQuadrant ? tokens.accent + '15' : tokens.bgSecondary,
                            },
                          ]}
                          onPress={() => setMood(q)}
                          accessibilityRole="button"
                          accessibilityLabel={`Deep Work Set State ${q}`}
                        >
                          <Text
                            style={[
                              styles.quickMoodText,
                              { color: q === moodQuadrant ? tokens.accent : tokens.textSecondary },
                            ]}
                          >
                            {q}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <Text style={[styles.blockedText, { color: quadrants.Red }]}>
                  {isTimeAllowed
                    ? 'Pre-flight checks not passed. Ground first.'
                    : 'Deep Work is only available during the Day window (11:00–17:00).'}
                </Text>
              </>
            )}
          </View>
        )}

        {/* Step 2: Bellows Breath */}
        {step === 'bellows' && (
          <View style={styles.centeredContent}>
            <Text style={[styles.phaseTitle, { color: tokens.textSecondary }]}>
              BELLOWS BREATH
            </Text>
            <Text style={[styles.bigTimer, { color: tokens.textPrimary }]}>
              1:30
            </Text>
            <Text style={[styles.instruction, { color: tokens.textSecondary }]}>
              Rapid diaphragmatic pumping{'\n'}
              Then 30s breath hold{'\n'}
              Slow exhale with "Aim"
            </Text>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
              onPress={handleBellowsComplete}
            >
              <Text style={[styles.buttonText, { color: tokens.bgPrimary }]}>
                Complete
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Intention */}
        {step === 'intention' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: tokens.textPrimary }]}>
              What will you produce?
            </Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />

            <TextInput
              style={[
                styles.intentionInput,
                { backgroundColor: tokens.bgSecondary, borderColor: tokens.border, color: tokens.textPrimary },
              ]}
              placeholder="One line intention..."
              placeholderTextColor={tokens.textSecondary}
              value={intention}
              onChangeText={setIntention}
              maxLength={100}
              autoFocus
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: intention.trim() ? tokens.accent : tokens.border,
                  opacity: intention.trim() ? 1 : 0.5,
                },
              ]}
              onPress={handleSetIntention}
              disabled={!intention.trim()}
              accessibilityRole="button"
              accessibilityLabel="Deep Work Start Timer"
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: intention.trim() ? tokens.bgPrimary : tokens.textSecondary },
                ]}
              >
                Begin (25:00)
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Timer */}
        {step === 'timer' && (
          <View style={styles.timerContent}>
            <Text style={[styles.intentionDisplay, { color: tokens.textSecondary }]}>
              {intention}
            </Text>

            <Text style={[styles.bigTimer, { color: tokens.textPrimary }]}>
              {formatTime(timeRemaining)}
            </Text>

            <View style={[styles.progressBar, { backgroundColor: tokens.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: tokens.accent,
                    width: `${((TIMER_DURATION - timeRemaining) / TIMER_DURATION) * 100}%`,
                  },
                ]}
              />
            </View>

            <Text style={[styles.focusHint, { color: tokens.textSecondary }]}>
              Stay focused. No interruptions.
            </Text>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: tokens.border }]}
              onPress={handleTimerComplete}
              accessibilityRole="button"
              accessibilityLabel="Deep Work End Early"
            >
              <Text style={[styles.secondaryButtonText, { color: tokens.textSecondary }]}>
                End early
              </Text>
            </TouchableOpacity>

            {__DEV__ && (
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: tokens.border }]}
                onPress={handleSkipTimer}
                accessibilityRole="button"
                accessibilityLabel="Deep Work Skip Timer"
              >
                <Text style={[styles.secondaryButtonText, { color: tokens.textSecondary }]}>
                  Skip Timer (dev)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Step 5: Output */}
        {step === 'output' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: tokens.textPrimary }]}>
              What did you produce?
            </Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />

            <TextInput
              style={[
                styles.intentionInput,
                { backgroundColor: tokens.bgSecondary, borderColor: tokens.border, color: tokens.textPrimary },
              ]}
              placeholder="Log your output..."
              placeholderTextColor={tokens.textSecondary}
              value={output}
              onChangeText={setOutput}
              maxLength={200}
              autoFocus
            />

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: tokens.accent }]}
              onPress={handleLogOutput}
              accessibilityRole="button"
              accessibilityLabel="Deep Work Log Output"
            >
              <Text style={[styles.buttonText, { color: tokens.bgPrimary }]}>
                Log Output
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 6: Return Check */}
        {step === 'return' && (
          <View style={styles.content}>
            <Text style={[styles.title, { color: tokens.textPrimary }]}>
              Return Check
            </Text>
            <View style={[styles.divider, { backgroundColor: tokens.border }]} />

            <Text style={[styles.question, { color: tokens.textPrimary }]}>
              Are you in Green?
            </Text>
            <Text style={[styles.hint, { color: tokens.textSecondary }]}>
              Can you drop back to calm baseline?
            </Text>

            <View style={styles.returnButtons}>
              <TouchableOpacity
                style={[styles.returnButton, { backgroundColor: quadrants.Green + '30', borderColor: quadrants.Green }]}
                onPress={() => handleReturnCheck(true)}
                accessibilityRole="button"
                accessibilityLabel="Deep Work Return Yes"
              >
                <Text style={[styles.returnButtonText, { color: quadrants.Green }]}>
                  Yes — I'm grounded
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.returnButton, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
                onPress={() => handleReturnCheck(false)}
                accessibilityRole="button"
                accessibilityLabel="Deep Work Return No"
              >
                <Text style={[styles.returnButtonText, { color: tokens.textSecondary }]}>
                  No — still activated
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 7: Complete */}
        {step === 'complete' && (
          <View style={styles.centeredContent}>
            <Text style={[styles.completeText, { color: tokens.textPrimary }]}>
              {returnedToGreen ? 'Session complete' : 'Session complete\nGrounding recommended'}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cancelButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  cancelText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  timerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
  },
  phaseTitle: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 11,
    letterSpacing: 1.6,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginVertical: 24,
  },
  checkList: {
    gap: 16,
    marginBottom: 32,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkIcon: {
    fontSize: 18,
  },
  checkLabel: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  clearText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  blockedText: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 16,
  },
  quickMoodContainer: {
    marginTop: 8,
  },
  quickMoodLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  quickMoodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickMoodBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickMoodText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  bigTimer: {
    fontFamily: fontFamilies.display.regular,
    fontSize: 70,
    fontVariant: ['tabular-nums'],
  },
  instruction: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 24,
    marginBottom: 48,
  },
  intentionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontFamily: fontFamilies.text.regular,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  intentionDisplay: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
    marginBottom: 48,
    textAlign: 'center',
  },
  progressBar: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    marginTop: 32,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  focusHint: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    marginTop: 48,
  },
  secondaryButton: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
  },
  question: {
    fontFamily: fontFamilies.display.regular,
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 8,
  },
  hint: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 32,
  },
  returnButtons: {
    gap: 12,
  },
  returnButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  returnButtonText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 15,
  },
  completeText: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
});
