import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, SectionList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { useAppStore } from '../store/useAppStore';
import { useDailyCycleStore } from '../store/useDailyCycleStore';
import { PracticeCard } from '../components/shared/PracticeCard';
import { GroundingModal, GroundingMode, GroundingCompletion } from '../components/shared/GroundingModal';
import { ComingSoonModal } from '../components/shared/ComingSoonModal';
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
import { getPracticeModalKind } from '../mock/practiceModalMap';
import { track } from '../services/analytics';

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

  // Active modal state — exactly one of grounding / comingSoon is set at a time.
  // We track the practice itself (not just the id) so completion handlers can
  // record the entry without re-resolving from the library.
  const [activeGrounding, setActiveGrounding] = useState<
    { practice: Practice; modalMode: GroundingMode } | null
  >(null);
  const [comingSoonPractice, setComingSoonPractice] = useState<Practice | null>(null);
  // Capture the start timestamp so we can record real elapsed seconds on
  // completion, not the nominal library duration.
  const startedAtRef = useRef<Date | null>(null);

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

    track('practice_started', {
      practice_id: practice.id,
      practice_name: practice.name,
      phase,
      mode,
    });

    const kind = getPracticeModalKind(practice.id);
    if (kind === 'comingSoon') {
      // Don't record anything — honest placeholder rather than silent log.
      setComingSoonPractice(practice);
      return;
    }

    startedAtRef.current = new Date();
    setActiveGrounding({ practice, modalMode: kind });
  };

  const handleGroundingClose = (outcome: GroundingCompletion) => {
    const session = activeGrounding;
    setActiveGrounding(null);
    if (!session) return;

    if (outcome !== 'complete') {
      // User backed out before the eligibility gate — don't log a phantom
      // practice. The 'stopped' label on the button told them this.
      track('practice_stopped', {
        practice_id: session.practice.id,
        practice_name: session.practice.name,
        phase,
        mode,
      });
      return;
    }

    const startedAt = startedAtRef.current ?? new Date();
    const elapsedSeconds = Math.max(
      1,
      Math.round((Date.now() - startedAt.getTime()) / 1000)
    );

    recordPractice({
      practiceId: session.practice.id,
      practiceName: session.practice.name,
      timestamp: new Date(),
      durationSeconds: elapsedSeconds,
      completed: true,
    });
    recordPracticeCompleted();
    track('practice_completed', {
      practice_id: session.practice.id,
      practice_name: session.practice.name,
      duration_seconds: elapsedSeconds,
      phase,
      mode,
    });
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

      {activeGrounding && (
        <GroundingModal
          visible={activeGrounding !== null}
          mode={activeGrounding.modalMode}
          title={activeGrounding.practice.name}
          onClose={handleGroundingClose}
        />
      )}
      <ComingSoonModal
        visible={comingSoonPractice !== null}
        practiceName={comingSoonPractice?.name ?? ''}
        blurb={comingSoonPractice?.purpose}
        onClose={() => setComingSoonPractice(null)}
      />
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
