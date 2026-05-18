import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';

export type GroundingMode = 'breath' | 'bodyscan' | 'grounding';

type Phase = 'inhale' | 'hold' | 'exhale';

export type GroundingCompletion = 'complete' | 'stopped';

interface GroundingModalProps {
  visible: boolean;
  mode: GroundingMode;
  /**
   * Title override (e.g. practice name from the library). Falls back to the
   * generic mode title if not supplied.
   */
  title?: string;
  /**
   * Called when the user dismisses the modal. `outcome` is 'complete' when the
   * eligibility gate had been reached (full cycles / all zones / all senses);
   * 'stopped' otherwise. Callers should only record the practice on
   * 'complete' so partial taps no longer log silently.
   */
  onClose: (outcome: GroundingCompletion) => void;
}

// 4-4-6 box-style breath cycle (seconds)
const BREATH_PATTERN: { phase: Phase; seconds: number; label: string }[] = [
  { phase: 'inhale', seconds: 4, label: 'Breathe in' },
  { phase: 'hold', seconds: 4, label: 'Hold' },
  { phase: 'exhale', seconds: 6, label: 'Breathe out' },
];
const BREATH_MIN_CYCLES = 3;

// 14 zones, ~4s each = ~60s body scan
const BODY_ZONES = [
  'Crown of the head',
  'Forehead and jaw',
  'Throat',
  'Shoulders',
  'Chest',
  'Upper back',
  'Belly',
  'Lower back',
  'Hips and pelvis',
  'Thighs',
  'Knees',
  'Calves',
  'Ankles',
  'Feet',
];
const BODY_ZONE_SECONDS = 4;

// 5-4-3-2-1 grounding sequence (senses anchoring) — used for general
// grounding-flavored practices that aren't strictly breath or body scan.
const GROUNDING_STEPS: { label: string; spoken: string; seconds: number }[] = [
  { label: 'Name 5 things you can see', spoken: 'Name five things you can see.', seconds: 12 },
  { label: 'Name 4 things you can feel', spoken: 'Name four things you can feel.', seconds: 10 },
  { label: 'Name 3 things you can hear', spoken: 'Name three things you can hear.', seconds: 10 },
  { label: 'Name 2 things you can smell', spoken: 'Name two things you can smell.', seconds: 8 },
  { label: 'Name 1 thing you can taste', spoken: 'Name one thing you can taste.', seconds: 8 },
];

function speakSafe(text: string, muted: boolean) {
  if (muted) return;
  try {
    // Stop any in-flight utterance so cues don't queue up if the user
    // toggles mute or the phase advances quickly.
    Speech.stop();
    Speech.speak(text, { rate: 0.9, pitch: 0.95 });
  } catch {
    // Speech is non-essential; never let a TTS failure break the modal.
  }
}

export function GroundingModal({ visible, mode, title, onClose }: GroundingModalProps) {
  const { tokens, safety } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) {
      // Make sure no narration leaks past close.
      Speech.stop();
      return;
    }
    setStepIndex(0);
    setCycleCount(0);
    const initialSeconds =
      mode === 'breath'
        ? BREATH_PATTERN[0].seconds
        : mode === 'bodyscan'
        ? BODY_ZONE_SECONDS
        : GROUNDING_STEPS[0].seconds;
    setSecondsLeft(initialSeconds);

    // Initial spoken cue.
    if (mode === 'breath') speakSafe(BREATH_PATTERN[0].label, muted);
    else if (mode === 'bodyscan') speakSafe(`Notice your ${BODY_ZONES[0].toLowerCase()}.`, muted);
    else speakSafe(GROUNDING_STEPS[0].spoken, muted);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 1 ? s - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      Speech.stop();
    };
    // muted intentionally omitted: re-opening shouldn't restart on mute toggle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, mode]);

  useEffect(() => {
    if (!visible || secondsLeft > 0) return;
    if (mode === 'breath') {
      const next = (stepIndex + 1) % BREATH_PATTERN.length;
      if (next === 0) setCycleCount((c) => c + 1);
      setStepIndex(next);
      setSecondsLeft(BREATH_PATTERN[next].seconds);
      speakSafe(BREATH_PATTERN[next].label, muted);
    } else if (mode === 'bodyscan') {
      if (stepIndex + 1 >= BODY_ZONES.length) {
        // body scan complete; pause counter
        return;
      }
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      setSecondsLeft(BODY_ZONE_SECONDS);
      speakSafe(`Notice your ${BODY_ZONES[nextIdx].toLowerCase()}.`, muted);
    } else {
      if (stepIndex + 1 >= GROUNDING_STEPS.length) {
        // 5-4-3-2-1 complete; pause counter
        return;
      }
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      setSecondsLeft(GROUNDING_STEPS[nextIdx].seconds);
      speakSafe(GROUNDING_STEPS[nextIdx].spoken, muted);
    }
  }, [secondsLeft, visible, mode, stepIndex, muted]);

  const handleToggleMute = () => {
    setMuted((m) => {
      if (!m) Speech.stop();
      return !m;
    });
  };

  const handleClose = (outcome: GroundingCompletion) => {
    Speech.stop();
    onClose(outcome);
  };

  const isBreath = mode === 'breath';
  const isBodyScan = mode === 'bodyscan';
  const isGrounding = mode === 'grounding';

  const fallbackTitle = isBreath
    ? '4-4-6 Breath'
    : isBodyScan
    ? 'Body Scan'
    : '5-4-3-2-1 Grounding';
  const displayTitle = title ?? fallbackTitle;

  const currentLabel = isBreath
    ? BREATH_PATTERN[stepIndex].label
    : isBodyScan
    ? BODY_ZONES[stepIndex]
    : GROUNDING_STEPS[stepIndex].label;

  const totalSteps = isBreath
    ? BREATH_MIN_CYCLES
    : isBodyScan
    ? BODY_ZONES.length
    : GROUNDING_STEPS.length;
  const stepDisplay = isBreath
    ? Math.min(cycleCount + 1, BREATH_MIN_CYCLES)
    : stepIndex + 1;
  const progressLabel = isBreath
    ? `Cycle ${stepDisplay} / ${BREATH_MIN_CYCLES}`
    : `${stepDisplay} / ${totalSteps}`;

  const isBodyScanDone = isBodyScan && stepIndex + 1 >= BODY_ZONES.length && secondsLeft === 0;
  const isGroundingDone =
    isGrounding && stepIndex + 1 >= GROUNDING_STEPS.length && secondsLeft === 0;
  const isBreathEligible = isBreath && cycleCount >= BREATH_MIN_CYCLES;
  const isCompleteEligible = isBreathEligible || isBodyScanDone || isGroundingDone;

  const buttonLabel = isCompleteEligible ? 'Complete' : 'Stop early';
  const buttonAccessibility = isCompleteEligible
    ? 'Complete practice'
    : 'Stop practice early without logging';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => handleClose(isCompleteEligible ? 'complete' : 'stopped')}
    >
      <View style={[styles.backdrop, { backgroundColor: '#000000CC' }]}>
        <View style={[styles.card, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Pressable
            style={styles.muteButton}
            onPress={handleToggleMute}
            accessibilityRole="button"
            accessibilityLabel={muted ? 'Unmute narration' : 'Mute narration'}
            accessibilityState={{ selected: muted }}
            testID="GroundingMuteButton"
            hitSlop={12}
          >
            <Text style={[styles.muteText, { color: tokens.textSecondary }]}>
              {muted ? '🔇' : '🔊'}
            </Text>
          </Pressable>

          <Text style={[styles.eyebrow, { color: safety.red }]}>Grounding active</Text>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>{displayTitle}</Text>
          <Text style={[styles.progress, { color: tokens.textSecondary }]}>{progressLabel}</Text>

          <View style={[styles.circle, { borderColor: tokens.accent }]}>
            <Text style={[styles.cue, { color: tokens.textPrimary }]}>
              {isBodyScanDone || isGroundingDone ? 'Complete' : currentLabel}
            </Text>
            {!isBodyScanDone && !isGroundingDone && (
              <Text style={[styles.timer, { color: tokens.accent }]}>{secondsLeft}s</Text>
            )}
          </View>

          <Text style={[styles.hint, { color: tokens.textSecondary }]}>
            {isBreath
              ? 'Stay with each cycle. Move only when you feel ready.'
              : isBodyScan
              ? 'Notice without judgment. Soften where you find tension.'
              : 'Anchor in what is actually here. The senses are the doorway.'}
          </Text>

          <Pressable
            style={[
              styles.doneButton,
              {
                backgroundColor: isCompleteEligible ? tokens.accent : 'transparent',
                borderColor: tokens.accent,
                borderWidth: isCompleteEligible ? 0 : 1,
              },
            ]}
            onPress={() => handleClose(isCompleteEligible ? 'complete' : 'stopped')}
            accessibilityRole="button"
            accessibilityLabel={buttonAccessibility}
            testID="GroundingDoneButton"
          >
            <Text
              style={[
                styles.doneText,
                { color: isCompleteEligible ? tokens.bgPrimary : tokens.accent },
              ]}
            >
              {buttonLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', borderWidth: 1, borderRadius: 16, padding: 24, alignItems: 'center' },
  muteButton: { position: 'absolute', top: 12, right: 12, padding: 8 },
  muteText: { fontSize: 18 },
  eyebrow: { fontFamily: fontFamilies.text.semibold, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 6 },
  title: { fontFamily: fontFamilies.display.semibold, fontSize: 22, lineHeight: 28, marginBottom: 4, textAlign: 'center', paddingHorizontal: 24 },
  progress: { fontFamily: fontFamilies.text.medium, fontSize: 12, marginBottom: 20 },
  circle: { width: 180, height: 180, borderRadius: 90, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  cue: { fontFamily: fontFamilies.text.semibold, fontSize: 16, textAlign: 'center', paddingHorizontal: 12 },
  timer: { fontFamily: fontFamilies.display.semibold, fontSize: 28, marginTop: 6 },
  hint: { fontFamily: fontFamilies.text.regular, fontSize: 13, lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  doneButton: { width: '100%', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  doneText: { fontFamily: fontFamilies.text.semibold, fontSize: 15 },
});
