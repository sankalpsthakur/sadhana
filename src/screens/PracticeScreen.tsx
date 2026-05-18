import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { useAppStore } from '../store/useAppStore';
import { useDailyCycleStore } from '../store/useDailyCycleStore';
import { PracticeCard } from '../components/shared/PracticeCard';
import { getCooldownStatus } from '../utils/cooldowns';
import { fontFamilies } from '../theme/fonts';
import {
  practiceLibrary,
  Practice,
  getAvailablePractices,
  getRecommendedPractices,
  getTimeBlockedPractices,
  getCurrentTimeWindow,
  timeWindowLabels,
} from '../mock/practices';
import { track } from '../services/analytics';
import { SensoryService } from '../services/SensoryService';

type PracticeStatus =
  | 'available'
  | 'recommended'
  | 'locked-time'
  | 'locked-stability'
  | 'cooldown'
  | 'completed';

interface PracticeWithStatus {
  practice: Practice;
  status: PracticeStatus;
  cooldownLabel?: string;
}

interface Section {
  title: string;
  data: PracticeWithStatus[];
}

export function PracticeScreen() {
  const { tokens, quadrants } = useTheme();

  const phase = useAppStore((s) => s.phase);
  const mode = useAppStore((s) => s.mode);
  const stability = useAppStore((s) => s.stability);
  const moodQuadrant = useAppStore((s) => s.moodQuadrant);
  const netiCooldownEndsAt = useAppStore((s) => s.netiCooldownEndsAt);
  const serpentCooldownEndsAt = useAppStore((s) => s.serpentCooldownEndsAt);

  const practicesCompleted = useDailyCycleStore((s) => s.practicesCompleted);
  const recordPractice = useDailyCycleStore((s) => s.recordPractice);
  const recordPracticeCompleted = useAppStore((s) => s.recordPracticeCompleted);
  const demoNow = useDailyCycleStore((s) => s.demoNow);
  const currentWindow = getCurrentTimeWindow();
  const now = demoNow ?? new Date();
  const netiCooldown = getCooldownStatus(netiCooldownEndsAt, now);
  const serpentCooldown = getCooldownStatus(serpentCooldownEndsAt, now);
  const cooldownById = useMemo(() => {
    const map = new Map<string, string>();
    if (netiCooldown) map.set('neti-slicing', netiCooldown.label);
    if (serpentCooldown) map.set('serpent-rise', serpentCooldown.label);
    return map;
  }, [netiCooldown?.label, serpentCooldown?.label]);

  // Get completed practice IDs for today
  const completedIds = useMemo(
    () => new Set(practicesCompleted.map((p) => p.practiceId)),
    [practicesCompleted]
  );

  // Build sections
  const sections = useMemo(() => {
    const result: Section[] = [];
    const cooldownIds = new Set(cooldownById.keys());

    // Today's completed practices
    const completed = practiceLibrary
      .filter((p) => completedIds.has(p.id))
      .map((practice) => ({ practice, status: 'completed' as PracticeStatus }));

    if (completed.length > 0) {
      result.push({
        title: `Today's Practices (${completed.length})`,
        data: completed,
      });
    }

    // Recommended for current state
    const recommended = getRecommendedPractices(phase, stability, mode, moodQuadrant)
      .filter((p) => !completedIds.has(p.id) && !cooldownIds.has(p.id))
      .slice(0, 3)
      .map((practice) => ({ practice, status: 'recommended' as PracticeStatus }));

    if (recommended.length > 0) {
      result.push({
        title: 'Recommended Now',
        data: recommended,
      });
    }

    // Available practices (not recommended, not completed)
    const recommendedIds = new Set(recommended.map((r) => r.practice.id));
    const available = getAvailablePractices(phase, stability)
      .filter((p) => !completedIds.has(p.id) && !recommendedIds.has(p.id) && !cooldownIds.has(p.id))
      .map((practice) => ({ practice, status: 'available' as PracticeStatus }));

    if (available.length > 0) {
      result.push({
        title: 'Available',
        data: available,
      });
    }

    // Time-blocked (available later today)
    const timeBlocked = getTimeBlockedPractices(phase, stability)
      .filter((p) => !completedIds.has(p.id) && !cooldownIds.has(p.id))
      .map((practice) => ({ practice, status: 'locked-time' as PracticeStatus }));

    if (timeBlocked.length > 0) {
      result.push({
        title: 'Available Later',
        data: timeBlocked,
      });
    }

    const cooldownLocked = practiceLibrary
      .filter((p) => cooldownIds.has(p.id) && !completedIds.has(p.id))
      .map((practice) => ({
        practice,
        status: 'cooldown' as PracticeStatus,
        cooldownLabel: cooldownById.get(practice.id),
      }));

    if (cooldownLocked.length > 0) {
      result.push({
        title: 'Cooldown',
        data: cooldownLocked,
      });
    }

    return result;
  }, [phase, mode, stability, moodQuadrant, completedIds, cooldownById]);

  const parseDurationSeconds = (duration: string): number => {
    // Common formats in mock data: "5:00", "20:00"
    const parts = duration.split(':');
    if (parts.length === 2) {
      const mins = Number(parts[0]);
      const secs = Number(parts[1]);
      if (Number.isFinite(mins) && Number.isFinite(secs)) return mins * 60 + secs;
    }
    const minsOnly = Number(duration);
    if (Number.isFinite(minsOnly)) return minsOnly * 60;
    return 5 * 60;
  };

  const handlePracticePress = (practice: Practice) => {
    if (completedIds.has(practice.id)) {
      Alert.alert('Already Done', 'This practice is already logged for today.');
      return;
    }
    const cooldownLabel = cooldownById.get(practice.id);
    if (cooldownLabel) {
      Alert.alert('Cooldown Active', `${practice.name} is in cooldown for ${cooldownLabel}.`);
      return;
    }

    const durationSeconds = parseDurationSeconds(practice.duration);

    // SD2: bell at practice start (full volume).
    // NOTE: in the current instant-log UX, "start" and "completion" fire in
    // the same handler. When the practice-runner UI ships, SD3 (mid-bell at
    // duration/2) and SD1/SD5 (breath haptics + voice guidance) will attach
    // to the runner; the SensoryService API surface is already in place.
    void SensoryService.bell(1.0);

    track('practice_started', {
      practice_id: practice.id,
      practice_name: practice.name,
      phase,
      mode,
    });
    recordPractice({
      practiceId: practice.id,
      practiceName: practice.name,
      timestamp: new Date(),
      durationSeconds,
      completed: true,
    });
    recordPracticeCompleted();

    // SD4: bell + success haptic at practice end. Bell volume defaults to
    // 1.0 (same as start) so the journey feels symmetric. The success haptic
    // is what marks "you finished" tactilely.
    void SensoryService.bell(1.0);
    SensoryService.successHaptic();

    track('practice_completed', {
      practice_id: practice.id,
      practice_name: practice.name,
      duration_seconds: durationSeconds,
      phase,
      mode,
    });

    Alert.alert('Logged', `${practice.name} (${Math.round(durationSeconds / 60)} min)`);
  };

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: tokens.textPrimary }]}>
        {section.title}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: PracticeWithStatus }) => (
    <PracticeCard
      practice={item.practice}
      status={item.status}
      cooldownLabel={item.cooldownLabel}
      currentPhase={phase}
      onPress={() => handlePracticePress(item.practice)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: tokens.textPrimary }]}>Practices</Text>
        <View style={[styles.windowBadge, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Text style={[styles.windowText, { color: tokens.textSecondary }]}>
            {timeWindowLabels[currentWindow].split(' ')[0]}
          </Text>
        </View>
      </View>

      {/* Mode context */}
      <View style={styles.contextRow}>
        <Text style={[styles.contextText, { color: tokens.textSecondary }]}>
          Mode: <Text style={{ color: tokens.accent }}>{mode}</Text>
        </Text>
        {moodQuadrant && (
          <View style={styles.quadrantContainer}>
            <View
              style={[
                styles.quadrantDot,
                { backgroundColor: quadrants[moodQuadrant] },
              ]}
            />
            <Text style={[styles.contextText, { color: tokens.textSecondary }]}>
              {moodQuadrant}
            </Text>
          </View>
        )}
      </View>

      {/* Practice list */}
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.practice.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>—</Text>
          <Text style={[styles.emptyTitle, { color: tokens.textPrimary }]}>
            All caught up
          </Text>
          <Text style={[styles.emptySubtitle, { color: tokens.textSecondary }]}>
            Check back during different time windows for more practices
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
  },
  windowBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  windowText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  contextText: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  quadrantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quadrantDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
