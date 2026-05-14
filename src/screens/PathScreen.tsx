import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
 * Three nested rows of attention, ink-on-paper aesthetic:
 *   1. Today      — the present moment of practice
 *   2. This cycle — the 28-day moon cycle, days as dots
 *   3. The horizon — 90-day arc with three waypoints
 *                    Sambandha (~30) · Adhikara (~60) · Sthiti (~90)
 *
 * No bright colors. No predictive arrows. Only what is earned and what is possible.
 */

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

  // Days observed on the chosen gate. Without a real phase-start date, we derive
  // a reasonable estimate from the earliest practice timestamp.
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

        {/* Layer 1 — Today */}
        <View style={[styles.layerCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Text style={[styles.layerLabel, { color: tokens.textSecondary }]}>Today</Text>
          <Text style={[styles.todayGate, { color: tokens.textPrimary }]}>
            {currentInfo.obstacle}
          </Text>
          <Text style={[styles.todayLine, { color: tokens.textSecondary }]}>
            {mode} mode · Sthiti {stability}
          </Text>
          <Text style={[styles.todayLine, { color: tokens.textSecondary }]}>
            {currentInfo.promise}
          </Text>
        </View>

        {/* Layer 2 — This cycle (28 days) */}
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
              const wasSealed = isPast && sealedAt; // best-effort signal
              return (
                <View
                  key={dayIdx}
                  style={[
                    styles.cycleDot,
                    {
                      backgroundColor: isToday
                        ? tokens.accent
                        : wasSealed
                        ? tokens.textSecondary
                        : 'transparent',
                      borderColor: isToday ? tokens.accent : tokens.border,
                      transform: isToday ? [{ scale: 1.3 }] : [{ scale: 1 }],
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

        {/* Layer 3 — The horizon (90-day arc with waypoints) */}
        <View style={[styles.layerCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Text style={[styles.layerLabel, { color: tokens.textSecondary }]}>The horizon</Text>
          <View style={styles.horizonTrack}>
            <View style={[styles.horizonLine, { backgroundColor: tokens.border }]} />
            <View
              style={[
                styles.horizonProgress,
                {
                  backgroundColor: tokens.accent,
                  width: `${horizonProgress * 100}%`,
                },
              ]}
            />
            <View
              style={[
                styles.horizonMarker,
                {
                  backgroundColor: tokens.accent,
                  borderColor: tokens.bgPrimary,
                  left: `${horizonProgress * 100}%`,
                },
              ]}
            />
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

        {/* Gate selection — kept at the bottom, secondary to the arc */}
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
                    borderColor: isCurrent ? tokens.accent : tokens.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Sit with ${info.obstacle}`}
                onPress={() => setPhase(phaseId)}
              >
                <Text
                  style={[
                    styles.gateNumber,
                    { color: isCurrent ? tokens.accent : tokens.textSecondary },
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
                  <Text style={[styles.gateActive, { color: tokens.accent }]}>Active</Text>
                )}
              </TouchableOpacity>
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
    paddingBottom: 40,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  layerCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  layerLabel: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  todayGate: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 4,
  },
  todayLine: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 2,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cycleCounter: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
  },
  cycleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  cycleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  cycleNote: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  horizonTrack: {
    height: 4,
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 24,
    position: 'relative',
  },
  horizonLine: {
    height: 1,
    width: '100%',
    position: 'absolute',
  },
  horizonProgress: {
    height: 2,
    position: 'absolute',
    opacity: 0.7,
  },
  horizonMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    position: 'absolute',
    top: -4,
    marginLeft: -6,
  },
  waypointRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  waypoint: {
    flex: 1,
    paddingHorizontal: 4,
  },
  waypointName: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 13,
    marginBottom: 2,
  },
  waypointDay: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 10,
    letterSpacing: 0.4,
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
    fontSize: 18,
    marginTop: 16,
    marginBottom: 2,
  },
  gatesSub: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    marginBottom: 12,
  },
  gateList: {
    gap: 6,
  },
  gateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  gateNumber: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 14,
    width: 24,
    textAlign: 'center',
  },
  gateInfo: {
    flex: 1,
    marginLeft: 10,
  },
  gateName: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 14,
  },
  gatePromise: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 1,
  },
  gateActive: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
