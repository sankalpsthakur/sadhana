import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { useAppStore } from '../store/useAppStore';
import { useDailyCycleStore } from '../store/useDailyCycleStore';
import { phaseInfo } from '../mock/phases';
import { Phase } from '../types';
import { fontFamilies } from '../theme/fonts';

/**
 * PathScreen — the visible 90-day arc.
 *
 * Three nested layers of attention, ink-on-parchment:
 *   1. Today      — warm parchment slab, soft shadow, the present gate.
 *   2. This cycle — 28 days as small dots. Saffron-filled for days held,
 *                   8%-black ring for empty, a thin outlined ring for today.
 *   3. The horizon — a hairline ink line carrying three waypoints rendered
 *                    as Unicode glyphs (● for reached, ○ for ahead):
 *                      Sambandha (~30) · Adhikara (~60) · Sthiti (~90).
 *
 * No bright colors. No predictive arrows. No emojis. Only what is earned and
 * what is possible. Serif for titles (Fraunces, falls back to system "New
 * York" on iOS, Times New Roman elsewhere), sans for body (Sora).
 *
 * Vertical rhythm: 16 / 24 / 40 / 56.
 */

const SAFFRON = '#C77818';
const EMPTY_DOT = 'rgba(0,0,0,0.08)';

// Serif used for any small typographic flourish that should fall back to
// system serif if Fraunces hasn't loaded yet (e.g. waypoint glyphs).
const SERIF_FALLBACK = Platform.select({
  ios: 'New York',
  default: 'Times New Roman',
});

const WAYPOINTS = [
  { day: 30, name: 'Sambandha', meaning: 'Relationship with the gate.' },
  { day: 60, name: 'Adhikara', meaning: 'Capacity. The body is ready.' },
  { day: 90, name: 'Sthiti', meaning: 'Stability. The work has settled.' },
];

const CYCLE_LENGTH = 28;
const HORIZON_LENGTH = 90;

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function PathScreen() {
  const { tokens } = useTheme();
  const phase = useAppStore((state) => state.phase);
  const setPhase = useAppStore((state) => state.setPhase);
  const stability = useAppStore((state) => state.stability);
  const mode = useAppStore((state) => state.mode);

  const sealedAt = useDailyCycleStore((s) => s.sealedAt);
  const practicesCompleted = useDailyCycleStore((s) => s.practicesCompleted);

  // Days observed on the chosen gate, derived from the earliest practice
  // timestamp until a real phase-start date lands in the store.
  const daysObserved = useMemo(() => {
    if (!practicesCompleted || practicesCompleted.length === 0) return 0;
    const first = practicesCompleted.reduce<Date | null>((acc, p) => {
      const t = p.timestamp instanceof Date ? p.timestamp : new Date(p.timestamp);
      if (!acc || t < acc) return t;
      return acc;
    }, null);
    if (!first) return 0;
    const today = new Date();
    const diff = Math.floor((today.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.min(diff + 1, HORIZON_LENGTH));
  }, [practicesCompleted]);

  // Cycle position: which day (1..28) we are on.
  const cycleDay = useMemo(() => {
    const today = new Date();
    const idx = (getDayOfYear(today) % CYCLE_LENGTH) || CYCLE_LENGTH;
    return idx;
  }, []);

  const phases: Phase[] = [1, 2, 3, 4, 5, 6, 7];
  const currentInfo = phaseInfo[phase];

  // Horizon position: 0..1 of the arc.
  const horizonProgress = Math.min(daysObserved / HORIZON_LENGTH, 1);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: tokens.textPrimary }]}>The Path</Text>
        <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
          Today, this cycle, and the longer arc. The body sets the pace.
        </Text>

        {/* Layer 1 — Today (warm parchment, soft drop shadow). */}
        <View
          style={[
            styles.todayCard,
            {
              backgroundColor: tokens.bgSecondary,
              borderColor: tokens.border,
              shadowColor: '#2B211A',
            },
          ]}
        >
          <Text style={[styles.layerLabel, { color: tokens.textSecondary }]}>Today</Text>
          <Text style={[styles.todayGate, { color: tokens.textPrimary }]}>
            {currentInfo.obstacle}
          </Text>
          <Text style={[styles.todayMeta, { color: tokens.textSecondary }]}>
            {mode} mode  ·  Sthiti {stability}
          </Text>
          <Text style={[styles.todayPromise, { color: tokens.textSecondary }]}>
            {currentInfo.promise}
          </Text>
        </View>

        {/* Layer 2 — This cycle (28-day grid). */}
        <View style={[styles.layerCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <View style={styles.cycleHeader}>
            <Text style={[styles.layerLabel, { color: tokens.textSecondary }]}>This cycle</Text>
            <Text style={[styles.cycleCounter, { color: tokens.textSecondary }]}>
              Day {cycleDay} of {CYCLE_LENGTH}
            </Text>
          </View>
          <View style={styles.cycleGrid}>
            {Array.from({ length: CYCLE_LENGTH }, (_, i) => {
              const dayIdx = i + 1;
              const isPast = dayIdx < cycleDay;
              const isToday = dayIdx === cycleDay;
              const wasHeld = isPast && !!sealedAt;
              // Three visual states:
              //   today  — outlined ring in saffron, transparent center
              //   held   — solid saffron fill
              //   empty  — 8% black ring, transparent center
              const backgroundColor = wasHeld ? SAFFRON : 'transparent';
              const borderColor = isToday ? SAFFRON : wasHeld ? SAFFRON : EMPTY_DOT;
              const borderWidth = isToday ? 1.5 : 1;
              return (
                <View
                  key={dayIdx}
                  style={[
                    styles.cycleDot,
                    {
                      backgroundColor,
                      borderColor,
                      borderWidth,
                    },
                  ]}
                />
              );
            })}
          </View>
          <Text style={[styles.cycleNote, { color: tokens.textSecondary }]}>
            Filled dots are days the practice was held. The body has its own rhythm.
          </Text>
        </View>

        {/* Layer 3 — The horizon (90-day ink line + three waypoint glyphs). */}
        <View style={[styles.layerCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Text style={[styles.layerLabel, { color: tokens.textSecondary }]}>The horizon</Text>

          {/* Hairline ink line with three glyph waypoints. */}
          <View style={styles.horizonTrack}>
            <View style={[styles.horizonLine, { backgroundColor: tokens.textPrimary, opacity: 0.45 }]} />
            {WAYPOINTS.map((wp) => {
              const reached = daysObserved >= wp.day;
              const leftPct = (wp.day / HORIZON_LENGTH) * 100;
              return (
                <View
                  key={wp.name}
                  style={[styles.horizonGlyph, { left: `${leftPct}%` }]}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.horizonGlyphText,
                      {
                        color: reached ? SAFFRON : tokens.textPrimary,
                        fontFamily: SERIF_FALLBACK,
                      },
                    ]}
                  >
                    {reached ? '●' : '○'}
                  </Text>
                </View>
              );
            })}
            {/* Position marker — small saffron tick. */}
            {daysObserved > 0 && (
              <View
                style={[
                  styles.horizonMarker,
                  {
                    backgroundColor: SAFFRON,
                    left: `${horizonProgress * 100}%`,
                  },
                ]}
              />
            )}
          </View>

          <View style={styles.waypointRow}>
            {WAYPOINTS.map((wp) => {
              const reached = daysObserved >= wp.day;
              return (
                <View key={wp.name} style={styles.waypoint}>
                  <Text
                    style={[
                      styles.waypointName,
                      { color: reached ? tokens.textPrimary : tokens.textSecondary },
                    ]}
                  >
                    {wp.name}
                  </Text>
                  <Text style={[styles.waypointDay, { color: tokens.textSecondary }]}>
                    Day {wp.day}
                  </Text>
                  <Text style={[styles.waypointMeaning, { color: tokens.textSecondary }]}>
                    {wp.meaning}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={[styles.horizonNote, { color: tokens.textSecondary }]}>
            {daysObserved === 0
              ? 'The arc begins on the first day held.'
              : `${daysObserved} ${daysObserved === 1 ? 'day' : 'days'} observed.`}
          </Text>
        </View>

        {/* Gate selection — quiet, after the arc. */}
        <Text style={[styles.gatesHeading, { color: tokens.textPrimary }]}>Seven Gates</Text>
        <Text style={[styles.gatesSub, { color: tokens.textSecondary }]}>
          All gates are open. Choose the one alive in you.
        </Text>
        <View style={styles.gateList}>
          {phases.map((phaseId) => {
            const info = phaseInfo[phaseId];
            const isCurrent = phaseId === phase;
            return (
              <TouchableOpacity
                key={phaseId}
                style={[
                  styles.gateRow,
                  {
                    backgroundColor: isCurrent ? tokens.bgSecondary : 'transparent',
                    borderColor: isCurrent ? SAFFRON : tokens.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Sit with ${info.obstacle}`}
                onPress={() => setPhase(phaseId)}
              >
                <Text
                  style={[
                    styles.gateNumber,
                    { color: isCurrent ? SAFFRON : tokens.textSecondary },
                  ]}
                >
                  {phaseId}
                </Text>
                <View style={styles.gateInfo}>
                  <Text style={[styles.gateName, { color: tokens.textPrimary }]}>
                    {info.obstacle}
                  </Text>
                  <Text style={[styles.gatePromise, { color: tokens.textSecondary }]}>
                    {info.promise}
                  </Text>
                </View>
                {isCurrent && (
                  <Text style={[styles.gateActive, { color: SAFFRON }]}>Active</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Vertical rhythm: 16 / 24 / 40 / 56.
const RHYTHM = { sm: 16, md: 24, lg: 40, xl: 56 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: RHYTHM.md,
    paddingBottom: RHYTHM.xl,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: RHYTHM.lg,
  },
  // Today — warm parchment, soft drop shadow.
  todayCard: {
    padding: RHYTHM.md,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: RHYTHM.md,
    // Soft drop shadow (iOS) / elevation (Android).
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  layerCard: {
    padding: RHYTHM.md,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: RHYTHM.md,
  },
  layerLabel: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: RHYTHM.sm,
  },
  todayGate: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 6,
  },
  todayMeta: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    letterSpacing: 0.4,
    marginBottom: 12,
  },
  todayPromise: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  cycleCounter: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    letterSpacing: 0.4,
  },
  cycleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: RHYTHM.sm,
  },
  cycleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cycleNote: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  // Horizon — thin ink line with three serif glyphs.
  horizonTrack: {
    height: 24,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: RHYTHM.md,
    position: 'relative',
  },
  horizonLine: {
    height: 1,
    width: '100%',
    position: 'absolute',
  },
  horizonGlyph: {
    position: 'absolute',
    transform: [{ translateX: -8 }],
    width: 16,
    alignItems: 'center',
  },
  horizonGlyphText: {
    fontSize: 14,
    lineHeight: 16,
  },
  horizonMarker: {
    width: 3,
    height: 14,
    borderRadius: 1.5,
    position: 'absolute',
    top: 5,
    marginLeft: -1.5,
  },
  waypointRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  waypoint: {
    flex: 1,
    paddingRight: 8,
  },
  waypointName: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 13,
    marginBottom: 2,
  },
  waypointDay: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  waypointMeaning: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  horizonNote: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  gatesHeading: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 20,
    marginTop: RHYTHM.md,
    marginBottom: 4,
  },
  gatesSub: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: RHYTHM.sm,
  },
  gateList: {
    gap: 8,
  },
  gateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  gateNumber: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 16,
    width: 24,
    textAlign: 'center',
  },
  gateInfo: {
    flex: 1,
    marginLeft: 12,
  },
  gateName: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 14,
  },
  gatePromise: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  gateActive: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
