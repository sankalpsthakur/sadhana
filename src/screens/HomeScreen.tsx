import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/useTheme';
import { useAppStore } from '../store/useAppStore';
import { useDailyCycleStore } from '../store/useDailyCycleStore';
import { usePrimaryBlockingLock, useHasBlockingLock } from '../store/selectors';
import { coordinateFlow, FlowCard } from '../utils/flowCoordinator';
import { formatTimeRemaining } from '../utils/timeWindow';
import { shouldTriggerKavacha } from '../utils/safety';
import type { HomeScreenProps } from '../navigation/types';
import { requestHealthPermissions, readSensorSnapshot, openHealthSettings } from '../health';
import { deriveSnapshotSignals } from '../utils/healthSnapshot';
import { getCooldownStatus } from '../utils/cooldowns';
import { fontFamilies } from '../theme/fonts';

// Components
import { SafetyBanner } from '../components/global/SafetyBanner';
import { ModeHeader } from '../components/global/ModeHeader';
import { StateStrip } from '../components/global/StateStrip';
import { PrimaryActionCard } from '../components/home/PrimaryActionCard';
import { QuickJournalCard } from '../components/home/QuickJournalCard';
import { HealthIntegrationCard } from '../components/home/HealthIntegrationCard';
import { ModeToolsGrid } from '../components/home/ModeToolsGrid';
import { PatternCard } from '../components/home/PatternCard';
import { LadderCard } from '../components/home/LadderCard';
import { EmergencyFooter } from '../components/global/EmergencyFooter';
import { DemoControlPanel } from '../components/demo/DemoControlPanel';

// Flows
import {
  MorningCheckin,
  SealFlow,
  NightModeScreen,
  DreamCapture,
  DeepWorkFlow,
  MissionSelect,
  EveningAlert,
} from '../components/flows';

export function HomeScreen() {
  const { tokens, quadrants } = useTheme();
  const navigation = useNavigation<HomeScreenProps['navigation']>();

  // App state
  const phase = useAppStore((s) => s.phase);
  const mode = useAppStore((s) => s.mode);
  const stability = useAppStore((s) => s.stability);
  const moodQuadrant = useAppStore((s) => s.moodQuadrant);
  const bodyZone = useAppStore((s) => s.bodyZone);
  const moodWord = useAppStore((s) => s.moodWord);
  const locks = useAppStore((s) => s.locks);
  const setLock = useAppStore((s) => s.setLock);
  const netiCooldownEndsAt = useAppStore((s) => s.netiCooldownEndsAt);
  const serpentCooldownEndsAt = useAppStore((s) => s.serpentCooldownEndsAt);
  const setNetiCooldown = useAppStore((s) => s.setNetiCooldown);
  const setSerpentCooldown = useAppStore((s) => s.setSerpentCooldown);
  const primaryLock = usePrimaryBlockingLock();
  const hasBlockingLock = useHasBlockingLock();
  const healthIntegrationEnabled = useAppStore((s) => s.healthIntegrationEnabled);
  const setHealthIntegrationEnabled = useAppStore((s) => s.setHealthIntegrationEnabled);
  const setAudit = useAppStore((s) => s.setAudit);
  const setConfidence = useAppStore((s) => s.setConfidence);
  const setSleepStatus = useAppStore((s) => s.setSleepStatus);

  // Daily cycle state
  const dailyCycle = useDailyCycleStore();
  const now = dailyCycle.demoNow ?? new Date();
  const nightmareStreak = useDailyCycleStore((s) => s.nightmareStreak);
  const nightmareRecoveryStreak = useDailyCycleStore((s) => s.nightmareRecoveryStreak);

  // Flow modal states
  const [showMorningCheckin, setShowMorningCheckin] = useState(false);
  const [showSealFlow, setShowSealFlow] = useState(false);
  const [showDreamCapture, setShowDreamCapture] = useState(false);
  const [showDeepWork, setShowDeepWork] = useState(false);
  const [showMissionSelect, setShowMissionSelect] = useState(false);
  const [showEveningAlert, setShowEveningAlert] = useState(false);
  const [isConnectingHealth, setIsConnectingHealth] = useState(false);
  const [healthConnectError, setHealthConnectError] = useState<string | null>(null);

  // Ensure fresh daily cycle on mount
  useEffect(() => {
    dailyCycle.ensureFreshCycle();
  }, []);

  const healthPlatform =
    Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
  const healthSource =
    healthPlatform === 'ios' ? 'apple-health' : healthPlatform === 'android' ? 'health-connect' : 'web';
  const openHealthPermissionSettings =
    Platform.OS === 'android' ? openHealthSettings : Linking.openSettings;

  const syncHealthSnapshot = async (trigger: 'auto' | 'manual') => {
    if (!healthIntegrationEnabled) return;
    if (dailyCycle.healthSyncStatus === 'syncing') return;

    dailyCycle.setHealthSyncStatus('syncing', { source: healthSource });
    try {
      const snapshot = await readSensorSnapshot(now);

      if (!snapshot) {
        dailyCycle.setSensorSnapshot(null);
        dailyCycle.setHealthSyncStatus('no-data', {
          source: healthSource,
          error:
            Platform.OS === 'ios'
              ? 'No Health data returned. Try a device with Health data.'
              : 'No Health data returned.',
        });
        if (__DEV__) {
          console.log('Health sync', { trigger, status: 'no-data', source: healthSource });
        }
        return;
      }

      dailyCycle.setSensorSnapshot(snapshot);
      const { hrvLabel, sleepStatus, confidence, hasData } = deriveSnapshotSignals(snapshot);

      setAudit({ hrv: hrvLabel });
      setSleepStatus(sleepStatus);
      setConfidence(confidence);

      dailyCycle.setHealthSyncStatus(hasData ? 'success' : 'no-data', {
        source: healthSource,
        error: hasData ? null : 'No usable Health data found.',
      });

      if (__DEV__) {
        console.log('Health sync', {
          trigger,
          status: hasData ? 'success' : 'no-data',
          source: healthSource,
          hasData,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Health sync failed';
      dailyCycle.setSensorSnapshot(null);
      dailyCycle.setHealthSyncStatus('failed', { source: healthSource, error: message });
      if (__DEV__) {
        console.log('Health sync', { trigger, status: 'failed', source: healthSource, error: message });
      }
    }
  };

  // Sensor snapshot (local-only HealthKit / Health Connect) when enabled.
  useEffect(() => {
    if (!healthIntegrationEnabled) return;
    let cancelled = false;
    const run = async () => {
      await syncHealthSnapshot('auto');
      if (cancelled) return;
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [healthIntegrationEnabled, dailyCycle.date, dailyCycle.demoNow]);

  // Coordinate flows
  const flowDecision = useMemo(() => {
    return coordinateFlow({
      phase,
      mode,
      stability,
      moodQuadrant,
      hasBlockingLock,
      hasDreamLock: locks.nightmare,
      dailyCycle: {
        date: dailyCycle.date,
        wakeTimeInferred: dailyCycle.wakeTimeInferred,
        sensorSnapshot: dailyCycle.sensorSnapshot,
        healthSyncStatus: dailyCycle.healthSyncStatus,
        healthSyncAt: dailyCycle.healthSyncAt,
        healthSyncError: dailyCycle.healthSyncError,
        healthSyncSource: dailyCycle.healthSyncSource,
        morningCheckinAt: dailyCycle.morningCheckinAt,
        sealedAt: dailyCycle.sealedAt,
        nightModeActiveAt: dailyCycle.nightModeActiveAt,
        checkins: dailyCycle.checkins,
        practicesCompleted: dailyCycle.practicesCompleted,
        deepWorkSessions: dailyCycle.deepWorkSessions,
        dreamCaptured: dailyCycle.dreamCaptured,
        dreamIntention: dailyCycle.dreamIntention,
        mission: dailyCycle.mission,
        finalMoodPlot: dailyCycle.finalMoodPlot,
        gratitudeLine: dailyCycle.gratitudeLine,
        eveningAlertResolvedAt: dailyCycle.eveningAlertResolvedAt,
        specialDay: dailyCycle.specialDay,
        dyadCheckinDone: dailyCycle.dyadCheckinDone,
        dyadSyncScheduled: dailyCycle.dyadSyncScheduled,
      },
      now: dailyCycle.demoNow ?? undefined,
    });
  }, [
    phase,
    mode,
    stability,
    moodQuadrant,
    hasBlockingLock,
    locks.nightmare,
    dailyCycle,
    dailyCycle.demoNow,
  ]);

  useEffect(() => {
    if (!__DEV__) return;
    console.log('Flow decision', {
      activeFlow: flowDecision.activeFlow,
      window: flowDecision.timeContext.window,
      moodQuadrant,
      demoNow: dailyCycle.demoNow?.toISOString() ?? null,
      eveningAlertResolvedAt: dailyCycle.eveningAlertResolvedAt?.toISOString?.() ?? null,
    });
  }, [
    flowDecision.activeFlow,
    flowDecision.timeContext.window,
    moodQuadrant,
    dailyCycle.demoNow,
    dailyCycle.eveningAlertResolvedAt,
  ]);

  // Auto-show morning check-in if needed
  useEffect(() => {
    if (
      flowDecision.activeFlow === 'morning-checkin' &&
      !dailyCycle.morningCheckinAt
    ) {
      setShowMorningCheckin(true);
    }
  }, [flowDecision.activeFlow, dailyCycle.morningCheckinAt]);

  // Auto-show evening alert if needed
  useEffect(() => {
    if (flowDecision.activeFlow === 'evening-alert' && !dailyCycle.eveningAlertResolvedAt) {
      setShowEveningAlert(true);
    }
  }, [flowDecision.activeFlow, dailyCycle.eveningAlertResolvedAt]);

  // Trigger/clear kavacha lock based on overwhelm signals
  useEffect(() => {
    if (locks.kavacha && moodQuadrant === 'Green') {
      setLock('kavacha', false);
      return;
    }
    if (!locks.kavacha && shouldTriggerKavacha(moodQuadrant, moodWord, bodyZone)) {
      setLock('kavacha', true);
    }
  }, [locks.kavacha, moodQuadrant, moodWord, bodyZone, setLock]);

  // Keep nightmare lock consistent with streak counters
  useEffect(() => {
    if (!locks.nightmare && nightmareStreak >= 2) {
      setLock('nightmare', true);
      return;
    }
    if (locks.nightmare && nightmareRecoveryStreak >= 3) {
      setLock('nightmare', false);
    }
  }, [locks.nightmare, nightmareStreak, nightmareRecoveryStreak, setLock]);

  // Clear expired cooldown locks
  useEffect(() => {
    const checkCooldowns = () => {
      const current = dailyCycle.demoNow ?? new Date();
      const netiActive = getCooldownStatus(netiCooldownEndsAt, current);
      const serpentActive = getCooldownStatus(serpentCooldownEndsAt, current);

      if (!netiActive && netiCooldownEndsAt) {
        setNetiCooldown(null);
        setLock('neti', false);
      }
      if (!serpentActive && serpentCooldownEndsAt) {
        setSerpentCooldown(null);
        setLock('serpent', false);
      }
    };

    checkCooldowns();
    if (dailyCycle.demoNow) return;
    const interval = setInterval(checkCooldowns, 60 * 1000);
    return () => clearInterval(interval);
  }, [
    dailyCycle.demoNow,
    netiCooldownEndsAt,
    serpentCooldownEndsAt,
    setLock,
    setNetiCooldown,
    setSerpentCooldown,
  ]);

  // Night mode takes over the entire screen
  if (flowDecision.isNightMode) {
    return <NightModeScreen />;
  }

  // Calculate dream window time remaining
  const dreamMinutesRemaining = dailyCycle.wakeTimeInferred
    ? Math.max(
        0,
        180 -
          Math.max(0, Math.floor((now.getTime() - dailyCycle.wakeTimeInferred.getTime()) / 60000))
      )
    : 0;

  const openSealFlow = () => {
    if (flowDecision.activeFlow === 'evening-alert') {
      setShowEveningAlert(true);
      return;
    }
    setShowSealFlow(true);
  };

  // Render flow card component
  const renderFlowCard = (card: FlowCard) => {
    switch (card) {
      case 'morning-checkin-prompt':
        return (
          <TouchableOpacity
            key={card}
            style={[styles.flowCard, { backgroundColor: tokens.accent + '20', borderColor: tokens.accent }]}
            onPress={() => setShowMorningCheckin(true)}
          >
            <Text style={[styles.flowCardTitle, { color: tokens.accent }]}>
              Morning Check-in
            </Text>
            <Text style={[styles.flowCardDesc, { color: tokens.textSecondary }]}>
              10 seconds to establish baseline
            </Text>
          </TouchableOpacity>
        );

      case 'dream-capture-prompt':
        return (
          <TouchableOpacity
            key={card}
            style={[styles.flowCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
            onPress={() => setShowDreamCapture(true)}
          >
            <View style={styles.flowCardHeader}>
              <Text style={[styles.flowCardTitle, { color: tokens.textPrimary }]}>
                Dream Capture
              </Text>
              <View style={[styles.timerBadge, { backgroundColor: tokens.accent + '20' }]}>
                <Text style={[styles.timerText, { color: tokens.accent }]}>
                  {formatTimeRemaining(dreamMinutesRemaining)}
                </Text>
              </View>
            </View>
            <Text style={[styles.flowCardDesc, { color: tokens.textSecondary }]}>
              Window closes soon. Capture before it fades.
            </Text>
          </TouchableOpacity>
        );

      case 'deep-work-nudge':
        return (
          <TouchableOpacity
            key={card}
            style={[styles.flowCard, { backgroundColor: quadrants.Yellow + '15', borderColor: quadrants.Yellow }]}
            onPress={() => setShowDeepWork(true)}
          >
            <Text style={[styles.flowCardTitle, { color: quadrants.Yellow }]}>
              Deep Work Available
            </Text>
            <Text style={[styles.flowCardDesc, { color: tokens.textSecondary }]}>
              You're in Yellow. Ready for transmutation.
            </Text>
          </TouchableOpacity>
        );

      case 'mission-reminder': {
        const mission = dailyCycle.mission;
        const title = mission ? `Mission: ${mission.title}` : 'Select Today’s Mission';
        const desc = mission
          ? mission.status === 'active'
            ? mission.instruction
            : `Status: ${mission.status}`
          : 'One clean action for today. Choose deliberately.';

        return (
          <TouchableOpacity
            key={card}
            style={[styles.flowCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
            onPress={() => {
              if (mission) {
                navigation.navigate('Journal');
              } else {
                setShowMissionSelect(true);
              }
            }}
          >
            <Text style={[styles.flowCardTitle, { color: tokens.textPrimary }]}>
              {title}
            </Text>
            <Text style={[styles.flowCardDesc, { color: tokens.textSecondary }]} numberOfLines={2}>
              {desc}
            </Text>
          </TouchableOpacity>
        );
      }

      case 'dyad-status': {
        const dyadCheckinDone = dailyCycle.dyadCheckinDone;
        return (
          <TouchableOpacity
            key={card}
            style={[styles.flowCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
            onPress={() => {
              if (!dyadCheckinDone) dailyCycle.recordDyadCheckin();
            }}
          >
            <Text style={[styles.flowCardTitle, { color: tokens.textPrimary }]}>
              Dyad Status
            </Text>
            <Text style={[styles.flowCardDesc, { color: tokens.textSecondary }]}>
              {dyadCheckinDone ? 'Checked in ✓' : 'Tap to record check-in'}
            </Text>
          </TouchableOpacity>
        );
      }

      case 'brahma-available':
        return (
          <TouchableOpacity
            key={card}
            style={[styles.flowCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.accent }]}
            onPress={() => navigation.navigate('Practice')}
          >
            <Text style={[styles.flowCardTitle, { color: tokens.accent }]}>
              Brahma Muhurta
            </Text>
            <Text style={[styles.flowCardDesc, { color: tokens.textSecondary }]}>
              High-voltage window open. Enter only if eligible.
            </Text>
          </TouchableOpacity>
        );

      case 'seal-reminder':
        return (
          <TouchableOpacity
            key={card}
            style={[styles.flowCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
            onPress={openSealFlow}
          >
            <Text style={[styles.flowCardTitle, { color: tokens.textPrimary }]}>
              Seal the Day
            </Text>
            <Text style={[styles.flowCardDesc, { color: tokens.textSecondary }]}>
              Time to close the container
            </Text>
          </TouchableOpacity>
        );

      case 'evening-wind-down':
        return (
          <View
            key={card}
            style={[styles.flowCard, { backgroundColor: quadrants.Yellow + '10', borderColor: quadrants.Yellow }]}
          >
            <Text style={[styles.flowCardTitle, { color: quadrants.Yellow }]}>
              Still Running Hot
            </Text>
            <Text style={[styles.flowCardDesc, { color: tokens.textSecondary }]}>
              Evening. Time to return to Green.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.bgPrimary }]} edges={['top']}>
      {/* H0: Safety Banner (conditional) */}
      {primaryLock && <SafetyBanner lockType={primaryLock} />}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 180 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Flow Cards (priority inserts from coordinator) */}
        {flowDecision.flowCards.length > 0 && (
          <View style={styles.flowCardsContainer}>
            {flowDecision.flowCards.map(renderFlowCard)}
          </View>
        )}

        {/* H1: Mode Header */}
        <ModeHeader />

        {/* H2: State Strip (Dual Truth) */}
        <StateStrip />

        {/* Local-only Health connect CTA */}
        {(Platform.OS === 'ios' || Platform.OS === 'android') && (
          <HealthIntegrationCard
            platform={healthPlatform}
            isEnabled={healthIntegrationEnabled}
            isConnecting={isConnectingHealth}
            syncStatus={dailyCycle.healthSyncStatus}
            syncAt={dailyCycle.healthSyncAt}
            syncError={dailyCycle.healthSyncError}
            snapshot={dailyCycle.sensorSnapshot}
            connectError={healthConnectError}
            onConnect={async () => {
              if (isConnectingHealth) return;
              setHealthConnectError(null);
              setIsConnectingHealth(true);
              let ok = false;
              let errorMessage: string | null = null;
              try {
                ok = await requestHealthPermissions();
              } catch (error) {
                errorMessage = error instanceof Error ? error.message : 'Unable to connect to Health data.';
              } finally {
                setIsConnectingHealth(false);
              }
              if (!ok) {
                const message =
                  errorMessage ??
                  (Platform.OS === 'ios'
                    ? 'Permission not granted. Apple Health access is required.'
                    : 'Permission not granted. Health Connect access is required.');
                setHealthConnectError(message);
                Alert.alert(
                  Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect',
                  `${message}\n\nData stays on-device. Enable access in system settings and try again.`,
                  [
                    { text: 'Not now', style: 'cancel' },
                    { text: 'Settings', onPress: openHealthPermissionSettings },
                  ]
                );
                return;
              }
              setHealthIntegrationEnabled(true);
              await syncHealthSnapshot('manual');
            }}
            onSync={() => syncHealthSnapshot('manual')}
            onOpenSettings={openHealthPermissionSettings}
          />
        )}

        {/* H3: Primary Action Card */}
        <PrimaryActionCard
          onStart={(practiceId) => {
            if (practiceId === 'dream-capture') {
              if (locks.nightmare) {
                Alert.alert(
                  'Dream work paused',
                  'Two consecutive nightmare nights detected. Dream capture is locked for recovery.'
                );
                return;
              }
              setShowDreamCapture(true);
              return;
            }
            if (practiceId === 'mission-forge') {
              setShowDeepWork(true);
              return;
            }
            if (practiceId === 'seal-protocol' || practiceId === 'silence-seal' || practiceId === 'union-seal') {
              openSealFlow();
              return;
            }
            navigation.navigate('Practice');
          }}
        />

        {/* H4: Quick Journal Card */}
        <QuickJournalCard />

        {/* H5: Mode Tools Grid */}
        <ModeToolsGrid />

        {/* H6: Pattern Card */}
        <PatternCard />

        {/* H7: Ladder Card */}
        <LadderCard />

        {/* Demo Controls (development only) */}
        {__DEV__ && (
          <DemoControlPanel
            onShowMorningCheckin={() => setShowMorningCheckin(true)}
            onShowDreamCapture={() => setShowDreamCapture(true)}
            onShowDeepWork={() => setShowDeepWork(true)}
            onShowSealFlow={() => setShowSealFlow(true)}
          />
        )}
      </ScrollView>

      {/* Emergency Footer */}
      <EmergencyFooter />

      {/* Flow Modals */}
      <MorningCheckin
        visible={showMorningCheckin}
        onComplete={() => setShowMorningCheckin(false)}
      />

      <SealFlow
        visible={showSealFlow}
        onComplete={() => setShowSealFlow(false)}
      />

      <DreamCapture
        visible={showDreamCapture}
        onComplete={() => setShowDreamCapture(false)}
        onSkip={() => setShowDreamCapture(false)}
        minutesRemaining={dreamMinutesRemaining}
      />

      <DeepWorkFlow
        visible={showDeepWork}
        onComplete={() => setShowDeepWork(false)}
        onCancel={() => setShowDeepWork(false)}
      />

      <MissionSelect
        visible={showMissionSelect}
        onComplete={() => setShowMissionSelect(false)}
        onCancel={() => setShowMissionSelect(false)}
      />

      <EveningAlert
        visible={showEveningAlert}
        onComplete={() => setShowEveningAlert(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  flowCardsContainer: {
    gap: 12,
  },
  flowCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
  },
  flowCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flowCardTitle: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 18,
    lineHeight: 24,
  },
  flowCardDesc: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  timerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  timerText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
  },
});
