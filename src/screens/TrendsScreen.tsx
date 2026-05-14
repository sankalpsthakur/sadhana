import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { useAppStore } from '../store/useAppStore';
import { useDailyCycleStore } from '../store/useDailyCycleStore';
import { isTrendsLocked } from '../store/selectors';
import { QuadrantChart } from '../components/shared/QuadrantChart';
import { StatCard } from '../components/shared/StatCard';
import { MoodQuadrant } from '../types';
import { fontFamilies } from '../theme/fonts';

// Mock weekly data for demo purposes
const mockWeeklyData = {
  checkinsCompleted: 19,
  checkinsTotal: 21,
  practiceCount: 12,
  practicesByType: {
    grounding: 5,
    breath: 4,
    depth: 2,
    output: 1,
  },
  quadrantDistribution: [
    { quadrant: 'Green' as MoodQuadrant, percentage: 45, count: 9 },
    { quadrant: 'Yellow' as MoodQuadrant, percentage: 30, count: 6 },
    { quadrant: 'Blue' as MoodQuadrant, percentage: 15, count: 3 },
    { quadrant: 'Red' as MoodQuadrant, percentage: 10, count: 2 },
  ],
  missionOutcomes: {
    done: 5,
    failed: 1,
    skipped: 1,
  },
  stabilityTrend: +5,
  previousStability: 70,
  avgReturnToGreen: 12, // minutes
  sleepCrashes: 0,
};

// Day of week pattern labels from PRD
const patternLabels: Record<number, { category: string; insight: string }> = {
  0: { category: 'Weekly Summary', insight: 'Review your week and set intentions for the next' },
  1: { category: 'Trigger Correlation', insight: 'Notice what preceded Red/Yellow states' },
  2: { category: 'Recovery Insight', insight: 'Your return-to-Green patterns' },
  3: { category: 'Sleep Connection', insight: 'How sleep affects your regulation' },
  4: { category: 'Practice Efficacy', insight: 'Which practices work best for you' },
  5: { category: 'Sensor Insight', insight: 'What your body data reveals' },
  6: { category: 'Mission Pattern', insight: 'Your integrity across pillars' },
};

export function TrendsScreen() {
  const { tokens, quadrants } = useTheme();

  const stability = useAppStore((state) => state.stability);
  const isLocked = isTrendsLocked(stability);

  const checkins = useDailyCycleStore((s) => s.checkins);
  const practicesCompleted = useDailyCycleStore((s) => s.practicesCompleted);
  const [contribOpen, setContribOpen] = useState(false);

  // Days since the most recent practice (used for soft re-entry copy).
  const daysSinceLast = useMemo(() => {
    if (!practicesCompleted || practicesCompleted.length === 0) return null;
    const latest = practicesCompleted.reduce<Date | null>((acc, p) => {
      const t = p.timestamp instanceof Date ? p.timestamp : new Date(p.timestamp);
      if (!acc || t > acc) return t;
      return acc;
    }, null);
    if (!latest) return null;
    return Math.floor((Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24));
  }, [practicesCompleted]);

  const showReentry = daysSinceLast !== null && daysSinceLast > 7;

  // Get today's day of week for pattern card
  const dayOfWeek = new Date().getDay();
  const todayPattern = patternLabels[dayOfWeek];

  // Calculate real data from store (supplemented with mock for demo)
  const weeklyStats = useMemo(() => {
    // For MVP, use mock data supplemented with today's real data
    const todayCheckins = checkins.length;
    const todayPractices = practicesCompleted.length;

    return {
      ...mockWeeklyData,
      // Add today's data to the mock
      checkinsCompleted: mockWeeklyData.checkinsCompleted + todayCheckins,
      practiceCount: mockWeeklyData.practiceCount + todayPractices,
    };
  }, [checkins, practicesCompleted]);

  // Locked state
  if (isLocked) {
    const contributions = [
      { name: 'Sleep', note: 'Hours and consistency.' },
      { name: 'HRV trend', note: 'Where the autonomic system is settling.' },
      { name: 'RHR', note: 'Resting heart rate over the week.' },
      { name: 'Days observed', note: 'How long the practice has been held.' },
      { name: 'Recent variability', note: 'Return-to-Green latency after Red or Yellow.' },
    ];
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
        <ScrollView contentContainerStyle={styles.lockedScroll} showsVerticalScrollIndicator={false}>
          {showReentry && (
            <View style={[styles.reentryCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.accent }]}>
              <Text style={[styles.reentryTitle, { color: tokens.textPrimary }]}>
                Welcome back. Begin small.
              </Text>
              <Text style={[styles.reentryBody, { color: tokens.textSecondary }]}>
                You have been away {daysSinceLast} days. The body remembers. Today: one breath, on the cushion. That is the whole practice. Sthiti will rebuild as the body returns.
              </Text>
            </View>
          )}

          <Text style={[styles.lockedTitle, { color: tokens.textPrimary }]}>
            Sthiti is not yet established.
          </Text>
          <Text style={[styles.lockedSubtitle, { color: tokens.textSecondary }]}>
            The body is still arriving. Continue. Patterns settle into view at Sthiti 60+, held for 7 days.
          </Text>

          <View style={[styles.stabilityCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
            <Text style={[styles.stabilityLabel, { color: tokens.textSecondary }]}>
              Current Sthiti
            </Text>
            <Text style={[styles.stabilityValue, { color: tokens.textPrimary }]}>
              {stability}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: tokens.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: stability >= 60 ? quadrants.Green : quadrants.Yellow,
                    width: `${Math.min(stability, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressLabel, { color: tokens.textSecondary }]}>
              {stability >= 60 ? 'Hold for 7 days. The view will arrive.' : `${60 - stability} to threshold`}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.contribToggle, { borderColor: tokens.border }]}
            onPress={() => setContribOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="What Sthiti listens to"
          >
            <Text style={[styles.contribToggleText, { color: tokens.accent }]}>
              {contribOpen ? 'Hide what Sthiti listens to' : 'What Sthiti listens to'}
            </Text>
          </TouchableOpacity>

          {contribOpen && (
            <View style={[styles.contribCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
              {contributions.map((c) => (
                <View key={c.name} style={styles.contribRow}>
                  <Text style={[styles.contribName, { color: tokens.textPrimary }]}>{c.name}</Text>
                  <Text style={[styles.contribNote, { color: tokens.textSecondary }]}>{c.note}</Text>
                </View>
              ))}
              <Text style={[styles.contribFooter, { color: tokens.textSecondary }]}>
                Sthiti is a sum of what the body is reporting. Nothing is hidden.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Unlocked state
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>Trends</Text>
          <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
            This Week
          </Text>
        </View>

        {/* Key Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            title="Check-ins"
            value={`${weeklyStats.checkinsCompleted}/${weeklyStats.checkinsTotal}`}
            subtitle={`${Math.round((weeklyStats.checkinsCompleted / weeklyStats.checkinsTotal) * 100)}% complete`}
          />
          <View style={styles.statSpacer} />
          <StatCard
            title="Stability"
            value={stability}
            trend={weeklyStats.stabilityTrend > 0 ? 'up' : weeklyStats.stabilityTrend < 0 ? 'down' : 'neutral'}
            trendValue={weeklyStats.stabilityTrend > 0 ? `+${weeklyStats.stabilityTrend}` : `${weeklyStats.stabilityTrend}`}
          />
        </View>

        {/* Quadrant Distribution */}
        <QuadrantChart
          data={weeklyStats.quadrantDistribution}
          title="Mood Distribution"
        />

        {/* Practice Stats */}
        <View style={[styles.card, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Text style={[styles.cardTitle, { color: tokens.textPrimary }]}>
            Practices This Week
          </Text>
          <View style={styles.practiceStats}>
            <View style={styles.practiceStatItem}>
              <Text style={[styles.practiceStatValue, { color: tokens.textPrimary }]}>
                {weeklyStats.practiceCount}
              </Text>
              <Text style={[styles.practiceStatLabel, { color: tokens.textSecondary }]}>
                Total
              </Text>
            </View>
            {Object.entries(weeklyStats.practicesByType).map(([type, count]) => (
              <View key={type} style={styles.practiceStatItem}>
                <Text style={[styles.practiceStatValue, { color: tokens.textPrimary }]}>
                  {count}
                </Text>
                <Text style={[styles.practiceStatLabel, { color: tokens.textSecondary }]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mission Outcomes */}
        <View style={[styles.card, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Text style={[styles.cardTitle, { color: tokens.textPrimary }]}>
            Mission Outcomes
          </Text>
          <View style={styles.missionStats}>
            <View style={[styles.missionItem, { backgroundColor: quadrants.Green + '20' }]}>
              <Text style={[styles.missionValue, { color: quadrants.Green }]}>
                {weeklyStats.missionOutcomes.done}
              </Text>
              <Text style={[styles.missionLabel, { color: quadrants.Green }]}>Done</Text>
            </View>
            <View style={[styles.missionItem, { backgroundColor: quadrants.Red + '20' }]}>
              <Text style={[styles.missionValue, { color: quadrants.Red }]}>
                {weeklyStats.missionOutcomes.failed}
              </Text>
              <Text style={[styles.missionLabel, { color: quadrants.Red }]}>Failed</Text>
            </View>
            <View style={[styles.missionItem, { backgroundColor: tokens.textSecondary + '20' }]}>
              <Text style={[styles.missionValue, { color: tokens.textSecondary }]}>
                {weeklyStats.missionOutcomes.skipped}
              </Text>
              <Text style={[styles.missionLabel, { color: tokens.textSecondary }]}>Skipped</Text>
            </View>
          </View>
        </View>

        {/* Pattern Card (daily rotation) */}
        <View style={[styles.patternCard, { backgroundColor: tokens.accent + '10', borderColor: tokens.accent + '30' }]}>
          <View style={styles.patternHeader}>
            <Text style={styles.patternIcon}>💡</Text>
            <Text style={[styles.patternCategory, { color: tokens.accent }]}>
              {todayPattern.category}
            </Text>
          </View>
          <Text style={[styles.patternInsight, { color: tokens.textPrimary }]}>
            {todayPattern.insight}
          </Text>
          <Text style={[styles.patternHint, { color: tokens.textSecondary }]}>
            Check the Integrity Map for pillar balance when your state feels steady.
          </Text>
        </View>

        {/* Safety Stats */}
        <View style={[styles.card, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Text style={[styles.cardTitle, { color: tokens.textPrimary }]}>
            Safety Metrics
          </Text>
          <View style={styles.safetyStats}>
            <View style={styles.safetyItem}>
              <Text style={[styles.safetyValue, { color: weeklyStats.avgReturnToGreen < 15 ? quadrants.Green : quadrants.Yellow }]}>
                {weeklyStats.avgReturnToGreen} min
              </Text>
              <Text style={[styles.safetyLabel, { color: tokens.textSecondary }]}>
                Avg return to Green
              </Text>
            </View>
            <View style={styles.safetyItem}>
              <Text style={[styles.safetyValue, { color: weeklyStats.sleepCrashes === 0 ? quadrants.Green : quadrants.Red }]}>
                {weeklyStats.sleepCrashes}
              </Text>
              <Text style={[styles.safetyLabel, { color: tokens.textSecondary }]}>
                Sleep crashes
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.hintCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Text style={[styles.hintText, { color: tokens.textSecondary }]}>
            Deeper pattern insights are guided by stability and recent practice signals, not a forced gate order.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statSpacer: {
    width: 12,
  },
  card: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 16,
  },
  practiceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  practiceStatItem: {
    alignItems: 'center',
  },
  practiceStatValue: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 24,
    lineHeight: 30,
  },
  practiceStatLabel: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    marginTop: 4,
  },
  missionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  missionItem: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  missionValue: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 22,
    lineHeight: 28,
  },
  missionLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
    marginTop: 4,
  },
  patternCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  patternIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  patternCategory: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  patternInsight: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  patternHint: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    marginTop: 8,
  },
  safetyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  safetyItem: {
    alignItems: 'center',
  },
  safetyValue: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 20,
    lineHeight: 26,
  },
  safetyLabel: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  hintCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
  },
  hintText: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    textAlign: 'center',
  },
  // Locked state styles
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  lockedTitle: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 8,
  },
  lockedSubtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  stabilityCard: {
    width: '100%',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  stabilityLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
    marginBottom: 8,
  },
  stabilityValue: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 44,
    lineHeight: 50,
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressLabel: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    marginTop: 8,
  },
  lockedScroll: {
    padding: 24,
    paddingTop: 40,
  },
  reentryCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 24,
  },
  reentryTitle: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 6,
  },
  reentryBody: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  contribToggle: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  contribToggleText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
  contribCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  contribRow: {
    marginBottom: 10,
  },
  contribName: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 13,
    marginBottom: 2,
  },
  contribNote: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  contribFooter: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 6,
  },
});
