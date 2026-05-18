import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';

type Mode = 'breath' | 'bodyscan';

type Phase = 'inhale' | 'hold' | 'exhale';

interface GroundingModalProps {
  visible: boolean;
  mode: Mode;
  onClose: () => void;
}

// 4-4-6 box-style breath cycle (seconds)
const BREATH_PATTERN: { phase: Phase; seconds: number; label: string }[] = [
  { phase: 'inhale', seconds: 4, label: 'Breathe in' },
  { phase: 'hold', seconds: 4, label: 'Hold' },
  { phase: 'exhale', seconds: 6, label: 'Breathe out' },
];

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

export function GroundingModal({ visible, mode, onClose }: GroundingModalProps) {
  const { tokens, safety } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) return;
    setStepIndex(0);
    setCycleCount(0);
    setSecondsLeft(mode === 'breath' ? BREATH_PATTERN[0].seconds : BODY_ZONE_SECONDS);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 1 ? s - 1 : 0));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [visible, mode]);

  useEffect(() => {
    if (!visible || secondsLeft > 0) return;
    if (mode === 'breath') {
      const next = (stepIndex + 1) % BREATH_PATTERN.length;
      if (next === 0) setCycleCount((c) => c + 1);
      setStepIndex(next);
      setSecondsLeft(BREATH_PATTERN[next].seconds);
    } else {
      if (stepIndex + 1 >= BODY_ZONES.length) {
        // body scan complete; pause counter
        return;
      }
      setStepIndex((i) => i + 1);
      setSecondsLeft(BODY_ZONE_SECONDS);
    }
  }, [secondsLeft, visible, mode, stepIndex]);

  const isBreath = mode === 'breath';
  const title = isBreath ? '4-4-6 Breath' : 'Body Scan';
  const currentLabel = isBreath ? BREATH_PATTERN[stepIndex].label : BODY_ZONES[stepIndex];
  const progressLabel = isBreath
    ? `Cycle ${cycleCount + 1}`
    : `${stepIndex + 1} / ${BODY_ZONES.length}`;
  const isBodyScanDone = !isBreath && stepIndex + 1 >= BODY_ZONES.length && secondsLeft === 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: '#000000CC' }]}>
        <View style={[styles.card, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Text style={[styles.eyebrow, { color: safety.red }]}>Grounding active</Text>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>{title}</Text>
          <Text style={[styles.progress, { color: tokens.textSecondary }]}>{progressLabel}</Text>

          <View style={[styles.circle, { borderColor: tokens.accent }]}>
            <Text style={[styles.cue, { color: tokens.textPrimary }]}>
              {isBodyScanDone ? 'Complete' : currentLabel}
            </Text>
            {!isBodyScanDone && (
              <Text style={[styles.timer, { color: tokens.accent }]}>{secondsLeft}s</Text>
            )}
          </View>

          <Text style={[styles.hint, { color: tokens.textSecondary }]}>
            {isBreath
              ? 'Stay with each cycle. Move only when you feel ready.'
              : 'Notice without judgment. Soften where you find tension.'}
          </Text>

          <Pressable
            style={[styles.doneButton, { backgroundColor: tokens.accent }]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Done with grounding"
            testID="GroundingDoneButton"
          >
            <Text style={[styles.doneText, { color: tokens.bgPrimary }]}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', borderWidth: 1, borderRadius: 16, padding: 24, alignItems: 'center' },
  eyebrow: { fontFamily: fontFamilies.text.semibold, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 6 },
  title: { fontFamily: fontFamilies.display.semibold, fontSize: 22, lineHeight: 28, marginBottom: 4 },
  progress: { fontFamily: fontFamilies.text.medium, fontSize: 12, marginBottom: 20 },
  circle: { width: 180, height: 180, borderRadius: 90, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  cue: { fontFamily: fontFamilies.text.semibold, fontSize: 16, textAlign: 'center', paddingHorizontal: 12 },
  timer: { fontFamily: fontFamilies.display.semibold, fontSize: 28, marginTop: 6 },
  hint: { fontFamily: fontFamilies.text.regular, fontSize: 13, lineHeight: 20, textAlign: 'center', marginBottom: 20 },
  doneButton: { width: '100%', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  doneText: { fontFamily: fontFamilies.text.semibold, fontSize: 15 },
});
