import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';
import { phaseInfo } from '../../mock/phases';
import type { Phase } from '../../types';

// Bundled bowl-strike audio. 432 Hz fundamental, 3s exponential decay.
// See assets/audio/README.md for synthesis command.
const BOWL_STRIKE = require('../../../assets/audio/bowl_strike.m4a');

/**
 * Phase Open Ceremony (P10 — peak experience)
 *
 * Triggered when the user crosses into a new phase. A brief full-screen
 * takeover that honors the moment with restraint:
 *
 *   - Background fades from prior phase tint to next.
 *   - A particle bloom (six soft dots) expands and fades, simulating the
 *     bloom of attention around the bija syllable.
 *   - The Devanagari bija mantra of the chakra in play is rendered in the
 *     center.
 *   - Beneath, a slow 600ms reveal of the phase name in serif.
 *   - One tap anywhere dismisses (reverence > impatience).
 *
 * Audio: a struck bowl tone in the chakra's frequency is the spec. No bundled
 * asset yet — see TODO at bottom of file for the asset request.
 *
 * Reference: redesigns/sadhana-redesign.md §6 "Phase-open ceremony".
 */

interface PhaseOpenCeremonyProps {
  visible: boolean;
  phase: Phase;
  /**
   * Phase the user is leaving. Reserved for a future tint cross-fade
   * (previousPhase accent → next phase accent during the bloom). Not yet
   * read; kept in the API so callers don't need to refactor when the
   * cross-fade lands.
   */
  previousPhase?: Phase;
  onDismiss: () => void;
}

// Devanagari bija (seed) syllables per chakra, matching phaseInfo[].chakra
// (Muladhara → Lam, Svadhisthana → Vam, Manipura → Ram, Anahata → Yam,
// Vishuddha → Ham, Ajna → Om, Sahasrara → Om.) Phase 0 has no bija — we use
// the silent dot bindu.
const PHASE_BIJA: Record<Phase, string> = {
  0: '·',
  1: 'लं',
  2: 'वं',
  3: 'रं',
  4: 'यं',
  5: 'हं',
  6: 'ॐ',
  7: 'ॐ',
};

// One line from the tradition for each gate. Intentionally terse — ceremony
// is restraint, not exposition.
const PHASE_LINE: Record<Phase, string> = {
  0: 'The gate is chosen. Sit.',
  1: 'Fear is met. The body remembers safety.',
  2: 'Emotion moves. Nothing is held that wants to flow.',
  3: 'Shame becomes agency. The fire has somewhere to go.',
  4: 'Grief opens the heart. The way is through.',
  5: 'The leak is sealed. What is said is true.',
  6: 'The veil thins. Seeing is enough.',
  7: 'Nothing is grasped. Nothing is abandoned.',
};

const { width, height } = Dimensions.get('window');

// Six particle positions arranged around the central syllable.
const PARTICLE_ANGLES = [0, 60, 120, 180, 240, 300];
const PARTICLE_RADIUS = 110;

export function PhaseOpenCeremony({
  visible,
  phase,
  previousPhase,
  onDismiss,
}: PhaseOpenCeremonyProps) {
  const { tokens } = useTheme();

  const fadeIn = useRef(new Animated.Value(0)).current;
  const bijaOpacity = useRef(new Animated.Value(0)).current;
  const bijaScale = useRef(new Animated.Value(0.8)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameTranslate = useRef(new Animated.Value(8)).current;
  const lineOpacity = useRef(new Animated.Value(0)).current;
  const hintOpacity = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Audio.Sound | null>(null);

  const info = phaseInfo[phase];
  const bija = PHASE_BIJA[phase];
  const line = PHASE_LINE[phase];

  // Particles' interpolated scale and opacity.
  const particleScale = particleAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.2, 1, 1.4],
  });
  const particleAlpha = particleAnim.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 0.35, 0.18, 0],
  });

  useEffect(() => {
    if (!visible) {
      // Reset for the next opening.
      fadeIn.setValue(0);
      bijaOpacity.setValue(0);
      bijaScale.setValue(0.8);
      nameOpacity.setValue(0);
      nameTranslate.setValue(8);
      lineOpacity.setValue(0);
      hintOpacity.setValue(0);
      particleAnim.setValue(0);
      // Unload any sound left over from a prior open.
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
      return;
    }

    // Bowl strike — single soft attack synced with the bija reveal. The
    // heartbeat haptic fires on the same beat so body and ear arrive
    // together. Both are best-effort: a silenced device or a haptic-less
    // simulator should never block the visual ceremony.
    let cancelled = false;
    (async () => {
      try {
        // iOS: respect silent switch by not forcing playback in silent mode.
        // (setAudioModeAsync defaults are already conservative.)
        const { sound } = await Audio.Sound.createAsync(BOWL_STRIKE, {
          shouldPlay: true,
          volume: 0.85,
        });
        if (cancelled) {
          sound.unloadAsync().catch(() => {});
          return;
        }
        soundRef.current = sound;
      } catch {
        // Silently swallow — audio is enhancement, not requirement.
      }
    })();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );

    // Background fade
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Particle bloom — slow expansion, then drift out.
    Animated.timing(particleAnim, {
      toValue: 1,
      duration: 3200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Bija reveal (slow): opacity 0→1 over 1.2s, scale 0.8→1 same.
    Animated.parallel([
      Animated.timing(bijaOpacity, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bijaScale, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Phase name — 600ms slow reveal, after bija settles.
    Animated.parallel([
      Animated.timing(nameOpacity, {
        toValue: 1,
        duration: 600,
        delay: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(nameTranslate, {
        toValue: 0,
        duration: 600,
        delay: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Single line of tradition, fades in after the name.
    Animated.timing(lineOpacity, {
      toValue: 1,
      duration: 900,
      delay: 2300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // "Tap to continue" hint appears late, faint, so the eye is not pulled
    // away from the bija. Reverence > efficiency.
    Animated.timing(hintOpacity, {
      toValue: 0.45,
      duration: 800,
      delay: 4200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return () => {
      cancelled = true;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [
    visible,
    fadeIn,
    bijaOpacity,
    bijaScale,
    nameOpacity,
    nameTranslate,
    lineOpacity,
    hintOpacity,
    particleAnim,
  ]);

  // Particle nodes — six soft dots radiating from center.
  const particles = useMemo(
    () =>
      PARTICLE_ANGLES.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return {
          deg,
          dx: Math.cos(rad) * PARTICLE_RADIUS,
          dy: Math.sin(rad) * PARTICLE_RADIUS,
        };
      }),
    []
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss} accessibilityLabel="Dismiss ceremony">
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: tokens.bgPrimary,
              opacity: fadeIn,
            },
          ]}
        >
          {/* Soft phase-tint wash behind the bija. */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.tintWash,
              {
                backgroundColor: tokens.accent,
                opacity: fadeIn.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.12],
                }),
              },
            ]}
          />

          {/* Particle bloom — six soft dots in the chakra tint. */}
          <View pointerEvents="none" style={styles.particleField}>
            {particles.map((p) => (
              <Animated.View
                key={p.deg}
                style={[
                  styles.particle,
                  {
                    backgroundColor: tokens.accent,
                    opacity: particleAlpha,
                    transform: [
                      { translateX: p.dx },
                      { translateY: p.dy },
                      { scale: particleScale },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* Bija syllable — center of the screen, serif weight. */}
          <Animated.Text
            allowFontScaling={false}
            style={[
              styles.bija,
              {
                color: tokens.accentStrong,
                opacity: bijaOpacity,
                transform: [{ scale: bijaScale }],
              },
            ]}
          >
            {bija}
          </Animated.Text>

          {/* Phase name in serif, 600ms slow reveal. */}
          <Animated.Text
            allowFontScaling={false}
            style={[
              styles.phaseName,
              {
                color: tokens.textPrimary,
                opacity: nameOpacity,
                transform: [{ translateY: nameTranslate }],
              },
            ]}
          >
            {info?.name ?? `Phase ${phase}`}
          </Animated.Text>

          {/* Chakra waypoint (small, monoline). */}
          <Animated.Text
            allowFontScaling={false}
            style={[
              styles.chakra,
              {
                color: tokens.textMuted,
                opacity: nameOpacity,
              },
            ]}
          >
            {info?.chakra}
          </Animated.Text>

          {/* Single line from the tradition. */}
          <Animated.Text
            allowFontScaling={false}
            style={[
              styles.line,
              {
                color: tokens.textSecondary,
                opacity: lineOpacity,
              },
            ]}
          >
            {line}
          </Animated.Text>

          {/* Tap-to-continue hint, late and faint. */}
          <Animated.Text
            allowFontScaling={false}
            style={[
              styles.hint,
              { color: tokens.textMuted, opacity: hintOpacity },
            ]}
          >
            tap to continue
          </Animated.Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// Wave 11 wires audio + haptics:
//   - Single 432 Hz bowl strike (assets/audio/bowl_strike.m4a) on ceremony open.
//   - One Success notification haptic on the attack.
// Follow-ups (per redesigns §6 — not yet shipped):
//   - Per-chakra tones (C2..B2). Today a single placeholder serves all gates.
//   - Three slow heartbeat taps at 1s / 4s / 7s instead of a single notification.
//   - Settings → Ceremony toggle (default off at first launch).

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  tintWash: {
    ...StyleSheet.absoluteFillObject,
  },
  particleField: {
    position: 'absolute',
    top: height / 2 - 200,
    left: width / 2,
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  bija: {
    fontFamily: fontFamilies.display.regular,
    fontSize: 92,
    lineHeight: 110,
    textAlign: 'center',
    marginTop: -120,
    marginBottom: 32,
  },
  phaseName: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 28,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 8,
  },
  chakra: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 6,
  },
  line: {
    fontFamily: fontFamilies.display.regular,
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 28,
    paddingHorizontal: 16,
    maxWidth: 320,
  },
  hint: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    position: 'absolute',
    bottom: 60,
  },
});
