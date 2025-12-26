import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { useAppStore } from '../store/useAppStore';
import { useDailyCycleStore } from '../store/useDailyCycleStore';
import { MoodDot } from '../components/shared/MoodDot';
import { MoodQuadrant } from '../types';
import { fontFamilies } from '../theme/fonts';

type TabType = 'today' | 'history' | 'dreams';

interface TimelineEntry {
  id: string;
  type: 'checkin' | 'practice' | 'mission' | 'deep-work' | 'dream' | 'seal';
  time: Date;
  title: string;
  subtitle?: string;
  quadrant?: MoodQuadrant;
  icon: string;
}

export function JournalScreen() {
  const { tokens, quadrants } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [showDreamDetail, setShowDreamDetail] = useState(false);

  const phase = useAppStore((s) => s.phase);

  const checkins = useDailyCycleStore((s) => s.checkins);
  const practicesCompleted = useDailyCycleStore((s) => s.practicesCompleted);
  const mission = useDailyCycleStore((s) => s.mission);
  const deepWorkSessions = useDailyCycleStore((s) => s.deepWorkSessions);
  const dreamCaptured = useDailyCycleStore((s) => s.dreamCaptured);
  const sealedAt = useDailyCycleStore((s) => s.sealedAt);
  const finalMoodPlot = useDailyCycleStore((s) => s.finalMoodPlot);
  const gratitudeLine = useDailyCycleStore((s) => s.gratitudeLine);

  // Build timeline entries
  const timelineEntries = useMemo(() => {
    const entries: TimelineEntry[] = [];

    // Check-ins
    checkins.forEach((c) => {
      entries.push({
        id: c.id,
        type: 'checkin',
        time: c.timestamp,
        title: c.source === 'morning' ? 'Morning Check-in' : 'Check-in',
        subtitle: c.word || undefined,
        quadrant: c.moodQuadrant,
        icon: '◉',
      });
    });

    // Practices
    practicesCompleted.forEach((p) => {
      entries.push({
        id: p.id,
        type: 'practice',
        time: p.timestamp,
        title: p.practiceName || p.practiceId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        subtitle: `${Math.round(p.durationSeconds / 60)} min`,
        icon: '◎',
      });
    });

    // Deep work sessions
    deepWorkSessions.forEach((d) => {
      if (d.completedAt) {
        entries.push({
          id: d.id,
          type: 'deep-work',
          time: d.completedAt,
          title: 'Deep Work',
          subtitle: d.output || d.intention,
          icon: '▣',
        });
      }
    });

    // Mission
    if (mission) {
      entries.push({
        id: 'mission',
        type: 'mission',
        time: mission.acceptedAt,
        title: `Mission: ${mission.pillar}`,
        subtitle: mission.status === 'active' ? 'In progress' : mission.status,
        icon: '⟡',
      });
    }

    // Dream
    if (dreamCaptured) {
      entries.push({
        id: dreamCaptured.id,
        type: 'dream',
        time: dreamCaptured.capturedAt,
        title: 'Dream Captured',
        subtitle: dreamCaptured.symbols?.join(', '),
        quadrant: dreamCaptured.moodOnWaking,
        icon: '◐',
      });
    }

    // Seal
    if (sealedAt) {
      entries.push({
        id: 'seal',
        type: 'seal',
        time: sealedAt,
        title: 'Day Sealed',
        subtitle: gratitudeLine || undefined,
        quadrant: finalMoodPlot?.moodQuadrant ?? null,
        icon: '⊘',
      });
    }

    // Sort by time descending
    return entries.sort((a, b) => b.time.getTime() - a.time.getTime());
  }, [checkins, practicesCompleted, mission, deepWorkSessions, dreamCaptured, sealedAt, finalMoodPlot, gratitudeLine]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const lucidityLabel = (level: string) => {
    if (level === 'operator') return 'Operator';
    if (level === 'full') return 'Full';
    if (level === 'semi') return 'Semi';
    return 'None';
  };

  const tabs: { key: TabType; label: string; minPhase?: number }[] = [
    { key: 'today', label: 'Today' },
    { key: 'history', label: 'History' },
    { key: 'dreams', label: 'Dreams', minPhase: 2 },
  ];

  const renderTodayTab = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {timelineEntries.length > 0 ? (
        <View style={styles.timeline}>
          {timelineEntries.map((entry, index) => (
            <View key={entry.id} style={styles.timelineItem}>
              {/* Timeline connector */}
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, { backgroundColor: tokens.accent }]} />
                {index < timelineEntries.length - 1 && (
                  <View style={[styles.timelineLine, { backgroundColor: tokens.border }]} />
                )}
              </View>

              {/* Entry card */}
              <TouchableOpacity
                style={[styles.entryCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
                activeOpacity={entry.type === 'dream' ? 0.7 : 1}
                onPress={() => {
                  if (entry.type !== 'dream') return;
                  setShowDreamDetail(true);
                }}
                accessibilityRole={entry.type === 'dream' ? 'button' : undefined}
                accessibilityLabel={entry.type === 'dream' ? 'Open Dream Detail' : undefined}
              >
                <View style={styles.entryHeader}>
                  <Text style={styles.entryIcon}>{entry.icon}</Text>
                  <Text style={[styles.entryTitle, { color: tokens.textPrimary }]}>
                    {entry.title}
                  </Text>
                  {entry.quadrant && <MoodDot quadrant={entry.quadrant} size="small" />}
                </View>

                {entry.subtitle && (
                  <Text
                    style={[styles.entrySubtitle, { color: tokens.textSecondary }]}
                    numberOfLines={1}
                  >
                    {entry.subtitle}
                  </Text>
                )}

                <Text style={[styles.entryTime, { color: tokens.textSecondary }]}>
                  {formatTime(entry.time)}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>—</Text>
          <Text style={[styles.emptyTitle, { color: tokens.textPrimary }]}>
            No entries yet today
          </Text>
          <Text style={[styles.emptySubtitle, { color: tokens.textSecondary }]}>
            Complete your morning check-in to start tracking
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderHistoryTab = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>—</Text>
      <Text style={[styles.emptyTitle, { color: tokens.textPrimary }]}>
        History Coming Soon
      </Text>
      <Text style={[styles.emptySubtitle, { color: tokens.textSecondary }]}>
        View your past entries and patterns across days
      </Text>
    </View>
  );

  const renderDreamsTab = () => {
    if (phase < 2) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⊘</Text>
          <Text style={[styles.emptyTitle, { color: tokens.textPrimary }]}>
            Dreams Locked
          </Text>
          <Text style={[styles.emptySubtitle, { color: tokens.textSecondary }]}>
            Reach Phase 2 (Flow) to unlock dream journaling
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {dreamCaptured ? (
          <TouchableOpacity
            style={[styles.dreamCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
            onPress={() => setShowDreamDetail(true)}
            accessibilityRole="button"
            accessibilityLabel="Open Dream Detail"
          >
            <View style={styles.dreamHeader}>
              <Text style={styles.dreamIcon}>◐</Text>
              <View style={styles.dreamHeaderText}>
                <Text style={[styles.dreamTitle, { color: tokens.textPrimary }]}>
                  Today's Dream
                </Text>
                <Text style={[styles.dreamTime, { color: tokens.textSecondary }]}>
                  {formatTime(dreamCaptured.capturedAt)}
                </Text>
              </View>
              {dreamCaptured.moodOnWaking && <MoodDot quadrant={dreamCaptured.moodOnWaking} size="medium" />}
            </View>

            {dreamCaptured.lucidityLevel && dreamCaptured.lucidityLevel !== 'none' && (
              <View style={[styles.lucidityBadge, { backgroundColor: tokens.accent + '20' }]}>
                <Text style={[styles.lucidityText, { color: tokens.accent }]}>
                  Lucidity: {lucidityLabel(dreamCaptured.lucidityLevel)}
                </Text>
              </View>
            )}

            {dreamCaptured.symbols && dreamCaptured.symbols.length > 0 && (
              <View style={styles.symbolsContainer}>
                <Text style={[styles.symbolsLabel, { color: tokens.textSecondary }]}>
                  Symbols
                </Text>
                <View style={styles.symbolsList}>
                  {dreamCaptured.symbols.map((symbol, i) => (
                    <View
                      key={i}
                      style={[styles.symbolChip, { backgroundColor: tokens.bgPrimary, borderColor: tokens.border }]}
                    >
                      <Text style={[styles.symbolText, { color: tokens.textPrimary }]}>
                        {symbol}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>◌</Text>
            <Text style={[styles.emptyTitle, { color: tokens.textPrimary }]}>
              No dream captured today
            </Text>
            <Text style={[styles.emptySubtitle, { color: tokens.textSecondary }]}>
              Dream capture is available within 3 hours of waking
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: tokens.textPrimary }]}>Journal</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { borderBottomColor: tokens.border }]}>
        {tabs.map((tab) => {
          const isLocked = tab.minPhase !== undefined && phase < tab.minPhase;
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                isActive && [styles.activeTab, { borderBottomColor: tokens.accent }],
              ]}
              onPress={() => !isLocked && setActiveTab(tab.key)}
              disabled={isLocked}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isLocked
                      ? tokens.textSecondary
                      : isActive
                        ? tokens.accent
                        : tokens.textPrimary,
                  },
                ]}
              >
                {tab.label}
              </Text>
              {isLocked && (
                <Text style={[styles.lockIcon, { color: tokens.textSecondary }]}>🔒</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab content */}
      <View style={styles.tabContent}>
        {activeTab === 'today' && renderTodayTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'dreams' && renderDreamsTab()}
      </View>

      <Modal visible={showDreamDetail} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: tokens.bgPrimary }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: tokens.textPrimary }]}>
              Dream Detail
            </Text>
            <TouchableOpacity
              onPress={() => setShowDreamDetail(false)}
              accessibilityRole="button"
              accessibilityLabel="Close Dream Detail"
            >
              <Text style={[styles.modalClose, { color: tokens.textSecondary }]}>Close</Text>
            </TouchableOpacity>
          </View>

          {dreamCaptured ? (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: tokens.textSecondary }]}>Captured</Text>
                <Text style={[styles.detailValue, { color: tokens.textPrimary }]}>
                  {formatTime(dreamCaptured.capturedAt)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: tokens.textSecondary }]}>Mood on waking</Text>
                <View style={styles.detailMood}>
                  <MoodDot quadrant={dreamCaptured.moodOnWaking} size="medium" />
                  <Text style={[styles.detailValue, { color: tokens.textPrimary }]}>
                    {dreamCaptured.moodOnWaking}
                  </Text>
                </View>
              </View>

              {dreamCaptured.lucidityLevel && dreamCaptured.lucidityLevel !== 'none' && (
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: tokens.textSecondary }]}>Lucidity</Text>
                  <Text style={[styles.detailValue, { color: tokens.textPrimary }]}>
                    {lucidityLabel(dreamCaptured.lucidityLevel)}
                  </Text>
                </View>
              )}

              <View style={styles.symbolsContainer}>
                <Text style={[styles.symbolsLabel, { color: tokens.textSecondary }]}>
                  Symbols
                </Text>
                {dreamCaptured.symbols && dreamCaptured.symbols.length > 0 ? (
                  <View style={styles.symbolsList}>
                    {dreamCaptured.symbols.map((symbol, i) => (
                      <View
                        key={i}
                        style={[styles.symbolChip, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
                      >
                        <Text style={[styles.symbolText, { color: tokens.textPrimary }]}>
                          {symbol}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={[styles.detailValue, { color: tokens.textSecondary }]}>
                    —
                  </Text>
                )}
              </View>

              {dreamCaptured.isNightmare && (
                <View
                  style={[
                    styles.nightmareBadge,
                    { backgroundColor: quadrants.Red + '15', borderColor: quadrants.Red },
                  ]}
                >
                  <Text style={[styles.nightmareText, { color: quadrants.Red }]}>
                    Nightmare flagged
                  </Text>
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>—</Text>
              <Text style={[styles.emptyTitle, { color: tokens.textPrimary }]}>
                No dream captured today
              </Text>
              <Text style={[styles.emptySubtitle, { color: tokens.textSecondary }]}>
                Capture a dream to view details
              </Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 20,
    lineHeight: 26,
  },
  modalClose: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    marginBottom: -1,
  },
  tabText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
  },
  lockIcon: {
    fontSize: 10,
    marginLeft: 4,
  },
  tabContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 12,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  entryCard: {
    flex: 1,
    marginLeft: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  entryTitle: {
    flex: 1,
    fontFamily: fontFamilies.text.semibold,
    fontSize: 14,
    lineHeight: 20,
  },
  entrySubtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    marginLeft: 24,
  },
  entryTime: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    marginTop: 6,
    marginLeft: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 300,
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
  dreamCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  dreamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dreamIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  dreamHeaderText: {
    flex: 1,
  },
  dreamTitle: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 16,
    lineHeight: 22,
  },
  dreamTime: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  detailMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  detailValue: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  nightmareBadge: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  nightmareText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 12,
  },
  lucidityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  lucidityText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
  symbolsContainer: {
    marginTop: 16,
  },
  symbolsLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
    marginBottom: 8,
  },
  symbolsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symbolChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  symbolText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
});
