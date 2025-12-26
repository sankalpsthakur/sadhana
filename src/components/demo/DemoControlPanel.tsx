import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Platform } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { Phase, Mode, Confidence, MoodQuadrant, BodyZone, LockType, AuditValue, ArousalValue, MovementValue } from '../../types';
import type { SpecialDay } from '../../types/dailyCycle';
import type { HealthSyncStatus, SensorSnapshot } from '../../types/dailyCycle';
import { deriveSnapshotSignals } from '../../utils/healthSnapshot';
import { getCooldownStatus } from '../../utils/cooldowns';

const PHASES: Phase[] = [0, 1, 2, 3, 4, 5, 6, 7];
const MODES: Mode[] = ['Armor', 'Rebuild', 'Mirror', 'Forge', 'Bridge', 'Signal', 'Void', 'Conductor'];
const CONFIDENCE_LEVELS: Confidence[] = ['Verified', 'Mixed', 'Self-report'];
const QUADRANTS: MoodQuadrant[] = ['Red', 'Blue', 'Green', 'Yellow', null];
const BODY_ZONES: BodyZone[] = ['Chest', 'Solar', 'Throat', 'Head', 'Belly', null];
const LOCK_TYPES: LockType[] = ['kavacha', 'nightmare', 'neti', 'serpent', 'union', 'sleepEmergency'];
const HRV_VALUES: AuditValue[] = ['Low', 'OK', 'High', null];
const AROUSAL_VALUES: ArousalValue[] = ['Spiky', 'Steady', null];
const MOVEMENT_VALUES: MovementValue[] = ['Still', 'Active', 'Exercising', null];
const SPECIAL_DAYS: SpecialDay[] = [null, 'rest', 'intensive', 'recovery'];
const MOOD_WORDS: Array<string | null> = [
  'overloaded',
  'panicked',
  'agitated',
  'enraged',
  'pressed',
  null,
];
const TIME_PRESETS = [
  { label: 'Late Night', hour: 2 },
  { label: 'Brahma', hour: 5 },
  { label: 'Morning', hour: 8 },
  { label: 'Day', hour: 13 },
  { label: 'Evening', hour: 18 },
  { label: 'Night', hour: 22 },
];

interface DemoControlPanelProps {
  onShowMorningCheckin?: () => void;
  onShowDreamCapture?: () => void;
  onShowDeepWork?: () => void;
  onShowSealFlow?: () => void;
}

export function DemoControlPanel({
  onShowMorningCheckin = () => {},
  onShowDreamCapture = () => {},
  onShowDeepWork = () => {},
  onShowSealFlow = () => {},
}: DemoControlPanelProps) {
  const { tokens } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const phase = useAppStore((s) => s.phase);
  const stability = useAppStore((s) => s.stability);
  const mode = useAppStore((s) => s.mode);
  const confidence = useAppStore((s) => s.confidence);
  const moodQuadrant = useAppStore((s) => s.moodQuadrant);
  const bodyZone = useAppStore((s) => s.bodyZone);
  const moodWord = useAppStore((s) => s.moodWord);
  const locks = useAppStore((s) => s.locks);
  const audit = useAppStore((s) => s.audit);
  const healthIntegrationEnabled = useAppStore((s) => s.healthIntegrationEnabled);
  const netiCooldownEndsAt = useAppStore((s) => s.netiCooldownEndsAt);
  const serpentCooldownEndsAt = useAppStore((s) => s.serpentCooldownEndsAt);

  const setPhase = useAppStore((s) => s.setPhase);
  const setStability = useAppStore((s) => s.setStability);
  const setMode = useAppStore((s) => s.setMode);
  const setConfidence = useAppStore((s) => s.setConfidence);
  const setMood = useAppStore((s) => s.setMood);
  const setBodyZone = useAppStore((s) => s.setBodyZone);
  const setMoodWord = useAppStore((s) => s.setMoodWord);
  const setLock = useAppStore((s) => s.setLock);
  const setAudit = useAppStore((s) => s.setAudit);
  const setHealthIntegrationEnabled = useAppStore((s) => s.setHealthIntegrationEnabled);
  const setSleepStatus = useAppStore((s) => s.setSleepStatus);
  const setNetiCooldown = useAppStore((s) => s.setNetiCooldown);
  const setSerpentCooldown = useAppStore((s) => s.setSerpentCooldown);
  const reset = useAppStore((s) => s.reset);

  const demoNow = useDailyCycleStore((s) => s.demoNow);
  const wakeTimeInferred = useDailyCycleStore((s) => s.wakeTimeInferred);
  const morningCheckinAt = useDailyCycleStore((s) => s.morningCheckinAt);
  const dreamCaptured = useDailyCycleStore((s) => s.dreamCaptured);
  const mission = useDailyCycleStore((s) => s.mission);
  const sealedAt = useDailyCycleStore((s) => s.sealedAt);
  const nightModeActiveAt = useDailyCycleStore((s) => s.nightModeActiveAt);
  const specialDay = useDailyCycleStore((s) => s.specialDay);
  const dyadCheckinDone = useDailyCycleStore((s) => s.dyadCheckinDone);
  const dyadSyncScheduled = useDailyCycleStore((s) => s.dyadSyncScheduled);
  const nightmareStreak = useDailyCycleStore((s) => s.nightmareStreak);
  const nightmareRecoveryStreak = useDailyCycleStore((s) => s.nightmareRecoveryStreak);
  const healthSyncStatus = useDailyCycleStore((s) => s.healthSyncStatus);
  const healthSyncAt = useDailyCycleStore((s) => s.healthSyncAt);
  const healthSyncError = useDailyCycleStore((s) => s.healthSyncError);

  const setDemoNow = useDailyCycleStore((s) => s.setDemoNow);
  const inferWake = useDailyCycleStore((s) => s.inferWake);
  const clearWakeTime = useDailyCycleStore((s) => s.clearWakeTime);
  const recordMorningCheckin = useDailyCycleStore((s) => s.recordMorningCheckin);
  const clearMorningCheckin = useDailyCycleStore((s) => s.clearMorningCheckin);
  const captureDream = useDailyCycleStore((s) => s.captureDream);
  const clearDreamCapture = useDailyCycleStore((s) => s.clearDreamCapture);
  const acceptMission = useDailyCycleStore((s) => s.acceptMission);
  const resolveMission = useDailyCycleStore((s) => s.resolveMission);
  const clearMission = useDailyCycleStore((s) => s.clearMission);
  const sealTheDay = useDailyCycleStore((s) => s.sealTheDay);
  const clearSeal = useDailyCycleStore((s) => s.clearSeal);
  const activateNightMode = useDailyCycleStore((s) => s.activateNightMode);
  const clearNightMode = useDailyCycleStore((s) => s.clearNightMode);
  const setSpecialDay = useDailyCycleStore((s) => s.setSpecialDay);
  const recordDyadCheckin = useDailyCycleStore((s) => s.recordDyadCheckin);
  const scheduleDyadSync = useDailyCycleStore((s) => s.scheduleDyadSync);
  const clearDyadStatus = useDailyCycleStore((s) => s.clearDyadStatus);
  const setSensorSnapshot = useDailyCycleStore((s) => s.setSensorSnapshot);
  const setHealthSyncStatus = useDailyCycleStore((s) => s.setHealthSyncStatus);
  const resetDailyCycle = useDailyCycleStore((s) => s.reset);

  const baseTime = demoNow ?? new Date();
  const moodForCheckin = moodQuadrant ?? 'Green';
  const netiCooldown = getCooldownStatus(netiCooldownEndsAt, baseTime);
  const serpentCooldown = getCooldownStatus(serpentCooldownEndsAt, baseTime);

  const randomize = () => {
    setPhase(PHASES[Math.floor(Math.random() * PHASES.length)]);
    setStability(Math.floor(Math.random() * 100));
    setMode(MODES[Math.floor(Math.random() * MODES.length)]);
    setConfidence(CONFIDENCE_LEVELS[Math.floor(Math.random() * CONFIDENCE_LEVELS.length)]);
    setMood(QUADRANTS[Math.floor(Math.random() * (QUADRANTS.length - 1))] as MoodQuadrant);
    setBodyZone(BODY_ZONES[Math.floor(Math.random() * (BODY_ZONES.length - 1))] as BodyZone);
    setAudit({
      hrv: HRV_VALUES[Math.floor(Math.random() * HRV_VALUES.length)],
      arousal: AROUSAL_VALUES[Math.floor(Math.random() * AROUSAL_VALUES.length)],
      movement: MOVEMENT_VALUES[Math.floor(Math.random() * MOVEMENT_VALUES.length)],
    });
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const healthSource =
    Platform.OS === 'ios' ? 'apple-health' : Platform.OS === 'android' ? 'health-connect' : 'web';

  const applyHealthSnapshot = (
    snapshot: SensorSnapshot | null,
    status: HealthSyncStatus,
    error?: string | null
  ) => {
    setSensorSnapshot(snapshot);
    setHealthSyncStatus(status, { source: healthSource, error: error ?? null });

    if (!snapshot) {
      setAudit({ hrv: null });
      setSleepStatus('Unknown');
      setConfidence('Self-report');
      return;
    }

    const { hrvLabel, sleepStatus, confidence } = deriveSnapshotSignals(snapshot);
    setAudit({ hrv: hrvLabel });
    setSleepStatus(sleepStatus);
    setConfidence(confidence);
  };

  const createSnapshot = (overrides: Partial<SensorSnapshot> = {}): SensorSnapshot => ({
    capturedAt: new Date(),
    sleepDurationMinutes: 430,
    sleepQualityScore: null,
    hrvTrend: 'ok',
    recoveryScore: 78,
    movementOvernight: 'normal',
    ...overrides,
  });

  const setDemoTime = (hour: number) => {
    const next = new Date(baseTime);
    next.setHours(hour, 0, 0, 0);
    setDemoNow(next);
  };

  const shiftDemoDay = (deltaDays: number) => {
    const next = new Date(baseTime);
    next.setDate(next.getDate() + deltaDays);
    setDemoNow(next);
  };

  const setWakeOffsetMinutes = (minutes: number) => {
    const wake = new Date(baseTime.getTime() - minutes * 60 * 1000);
    inferWake(wake);
  };

  if (!isExpanded) {
    return (
      <TouchableOpacity
        style={[styles.collapsedContainer, { backgroundColor: tokens.bgSecondary, borderColor: tokens.accent }]}
        onPress={() => setIsExpanded(true)}
        accessibilityRole="button"
        accessibilityLabel="Demo Controls"
      >
        <Text style={[styles.collapsedText, { color: tokens.accent }]}>🎛️ Demo Controls</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.accent }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: tokens.accent }]}>🎛️ Demo Controls</Text>
        <TouchableOpacity
          onPress={() => setIsExpanded(false)}
          accessibilityRole="button"
          accessibilityLabel="Demo Controls Collapse"
        >
          <Text style={[styles.collapseBtn, { color: tokens.textSecondary }]}>▼</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.controls} showsVerticalScrollIndicator={false}>
        {/* Daily routine flow launchers */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Daily Routine Flows</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={onShowMorningCheckin}
              accessibilityRole="button"
              accessibilityLabel="Demo Flow Morning Check-in"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Morning Check-in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={onShowDreamCapture}
              accessibilityRole="button"
              accessibilityLabel="Demo Flow Dream Capture"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Dream Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={onShowDeepWork}
              accessibilityRole="button"
              accessibilityLabel="Demo Flow Deep Work"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Deep Work</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={onShowSealFlow}
              accessibilityRole="button"
              accessibilityLabel="Demo Flow Seal"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Seal Flow</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily routine time override */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Time Override: {demoNow ? formatTime(demoNow) : 'Real time'}
          </Text>
          <View style={styles.buttonRow}>
            {TIME_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.label}
                style={[styles.optionBtn, { borderColor: tokens.border }]}
                onPress={() => setDemoTime(preset.hour)}
                accessibilityRole="button"
                accessibilityLabel={`Demo Time ${preset.label}`}
              >
                <Text style={[styles.optionText, { color: tokens.textSecondary }]}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => setDemoNow(null)}
              accessibilityRole="button"
              accessibilityLabel="Demo Time Clear"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => shiftDemoDay(-1)}
              accessibilityRole="button"
              accessibilityLabel="Demo Day Previous"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Prev Day</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => shiftDemoDay(1)}
              accessibilityRole="button"
              accessibilityLabel="Demo Day Next"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Next Day</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily routine state */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Wake: {wakeTimeInferred ? formatTime(wakeTimeInferred) : 'None'}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => inferWake(baseTime)}
              accessibilityRole="button"
              accessibilityLabel="Demo Wake Now"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Wake Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => setWakeOffsetMinutes(60)}
              accessibilityRole="button"
              accessibilityLabel="Demo Wake Minus 1h"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Wake -1h</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => setWakeOffsetMinutes(120)}
              accessibilityRole="button"
              accessibilityLabel="Demo Wake Minus 2h"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Wake -2h</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={clearWakeTime}
              accessibilityRole="button"
              accessibilityLabel="Demo Wake Clear"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear Wake</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Morning Check-in: {morningCheckinAt ? 'Done' : 'Pending'}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() =>
                recordMorningCheckin({
                  timestamp: baseTime,
                  moodQuadrant: moodForCheckin,
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Demo Morning Check-in Mark"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Mark Check-in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={clearMorningCheckin}
              accessibilityRole="button"
              accessibilityLabel="Demo Morning Check-in Clear"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear Check-in</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Dream Capture: {dreamCaptured ? 'Captured' : 'None'} · Nightmare streak {nightmareStreak} / Recovery {nightmareRecoveryStreak}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() =>
                captureDream({
                  capturedAt: baseTime,
                  moodOnWaking: moodForCheckin,
                  lucidityLevel: 'semi',
                  symbols: ['water'],
                  isNightmare: false,
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Demo Dream Capture Mark"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Capture Dream</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() =>
                captureDream({
                  capturedAt: baseTime,
                  moodOnWaking: 'Red',
                  lucidityLevel: 'none',
                  symbols: ['nightmare'],
                  isNightmare: true,
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Demo Dream Capture Nightmare"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Capture Nightmare</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={clearDreamCapture}
              accessibilityRole="button"
              accessibilityLabel="Demo Dream Clear"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear Dream</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Mission: {mission ? mission.status : 'None'}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() =>
                acceptMission({
                  id: 'demo-mission',
                  pillar: 'truth',
                  tier: 'ember',
                  title: 'The Real Answer',
                  instruction: 'Write the truth in one line.',
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Demo Mission Accept"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Accept Mission</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => resolveMission('done', 'Demo completion')}
              accessibilityRole="button"
              accessibilityLabel="Demo Mission Resolve Done"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Resolve Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={clearMission}
              accessibilityRole="button"
              accessibilityLabel="Demo Mission Clear"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear Mission</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Seal: {sealedAt ? 'Sealed' : 'Open'}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() =>
                sealTheDay({
                  timestamp: baseTime,
                  moodQuadrant: moodForCheckin,
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Demo Seal Day"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Seal Day</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={clearSeal}
              accessibilityRole="button"
              accessibilityLabel="Demo Seal Clear"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear Seal</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Night Mode: {nightModeActiveAt ? 'Active' : 'Off'}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={activateNightMode}
              accessibilityRole="button"
              accessibilityLabel="Demo Night Mode Activate"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Activate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={clearNightMode}
              accessibilityRole="button"
              accessibilityLabel="Demo Night Mode Clear"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Special Day: {specialDay ?? 'none'}
          </Text>
          <View style={styles.buttonRow}>
            {SPECIAL_DAYS.map((day) => (
              <TouchableOpacity
                key={day ?? 'none'}
                style={[
                  styles.optionBtn,
                  { borderColor: day === specialDay ? tokens.accent : tokens.border },
                ]}
                onPress={() => setSpecialDay(day)}
              >
                <Text style={[styles.optionText, { color: day === specialDay ? tokens.accent : tokens.textSecondary }]}>
                  {day ?? 'None'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Dyad: {dyadCheckinDone ? 'Checked in' : 'Not checked'} / {dyadSyncScheduled ? 'Scheduled' : 'Unscheduled'}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={recordDyadCheckin}
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Mark Check-in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={scheduleDyadSync}
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Schedule Sync</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={clearDyadStatus}
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear Dyad</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Phase Selector */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Phase: {phase}</Text>
          <View style={styles.buttonRow}>
            {PHASES.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.optionBtn,
                  { borderColor: p === phase ? tokens.accent : tokens.border },
                ]}
                onPress={() => setPhase(p)}
                accessibilityRole="button"
                accessibilityLabel={`Demo Phase ${p}`}
              >
                <Text style={[styles.optionText, { color: p === phase ? tokens.accent : tokens.textSecondary }]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stability Slider */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Stability: {stability}</Text>
          <View style={styles.sliderRow}>
            <Text style={[styles.sliderLabel, { color: tokens.textSecondary }]}>0</Text>
            <View style={styles.sliderContainer}>
              <View
                style={[
                  styles.sliderTrack,
                  { backgroundColor: tokens.border },
                ]}
              >
                <View
                  style={[
                    styles.sliderFill,
                    { backgroundColor: tokens.accent, width: `${stability}%` },
                  ]}
                />
              </View>
              <View style={styles.sliderButtons}>
                <TouchableOpacity
                  style={[styles.sliderBtn, { backgroundColor: tokens.border }]}
                  onPress={() => setStability(Math.max(0, stability - 10))}
                  accessibilityRole="button"
                  accessibilityLabel="Demo Stability Minus 10"
                >
                  <Text style={[styles.sliderBtnText, { color: tokens.textPrimary }]}>-10</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sliderBtn, { backgroundColor: tokens.border }]}
                  onPress={() => setStability(Math.min(100, stability + 10))}
                  accessibilityRole="button"
                  accessibilityLabel="Demo Stability Plus 10"
                >
                  <Text style={[styles.sliderBtnText, { color: tokens.textPrimary }]}>+10</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.sliderLabel, { color: tokens.textSecondary }]}>100</Text>
          </View>
        </View>

        {/* Mode Selector */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Mode: {mode}</Text>
          <View style={styles.buttonRow}>
            {MODES.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.optionBtn,
                  styles.modeBtn,
                  { borderColor: m === mode ? tokens.accent : tokens.border },
                ]}
                onPress={() => setMode(m)}
                accessibilityRole="button"
                accessibilityLabel={`Demo Mode ${m}`}
              >
                <Text
                  style={[styles.optionText, { color: m === mode ? tokens.accent : tokens.textSecondary }]}
                  numberOfLines={1}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Confidence Selector */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Confidence: {confidence}</Text>
          <View style={styles.buttonRow}>
            {CONFIDENCE_LEVELS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.optionBtn,
                  { borderColor: c === confidence ? tokens.accent : tokens.border },
                ]}
                onPress={() => setConfidence(c)}
                accessibilityRole="button"
                accessibilityLabel={`Demo Confidence ${c}`}
              >
                <Text style={[styles.optionText, { color: c === confidence ? tokens.accent : tokens.textSecondary }]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mood Quadrant */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Mood: {moodQuadrant || 'None'}</Text>
          <View style={styles.buttonRow}>
            {QUADRANTS.map((q) => (
              <TouchableOpacity
                key={q || 'null'}
                style={[
                  styles.optionBtn,
                  { borderColor: q === moodQuadrant ? tokens.accent : tokens.border },
                ]}
                onPress={() => setMood(q)}
                accessibilityRole="button"
                accessibilityLabel={`Demo Mood ${q ?? 'None'}`}
              >
                <Text style={[styles.optionText, { color: q === moodQuadrant ? tokens.accent : tokens.textSecondary }]}>
                  {q || '—'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Body Zone */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Body Zone: {bodyZone || 'None'}</Text>
          <View style={styles.buttonRow}>
            {BODY_ZONES.map((z) => (
              <TouchableOpacity
                key={z || 'null'}
                style={[
                  styles.optionBtn,
                  { borderColor: z === bodyZone ? tokens.accent : tokens.border },
                ]}
                onPress={() => setBodyZone(z)}
                accessibilityRole="button"
                accessibilityLabel={`Demo Body ${z ?? 'None'}`}
              >
                <Text style={[styles.optionText, { color: z === bodyZone ? tokens.accent : tokens.textSecondary }]}>
                  {z || '—'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mood Word */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Mood Word: {moodWord || 'None'}
          </Text>
          <View style={styles.buttonRow}>
            {MOOD_WORDS.map((word) => (
              <TouchableOpacity
                key={word || 'null'}
                style={[
                  styles.optionBtn,
                  { borderColor: word === moodWord ? tokens.accent : tokens.border },
                ]}
                onPress={() => setMoodWord(word)}
                accessibilityRole="button"
                accessibilityLabel={`Demo Mood Word ${word ?? 'Clear'}`}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: word === moodWord ? tokens.accent : tokens.textSecondary },
                  ]}
                >
                  {word || 'Clear'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Audit: HRV */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>HRV: {audit.hrv || 'None'}</Text>
          <View style={styles.buttonRow}>
            {HRV_VALUES.map((v) => (
              <TouchableOpacity
                key={v || 'null'}
                style={[
                  styles.optionBtn,
                  { borderColor: v === audit.hrv ? tokens.accent : tokens.border },
                ]}
                onPress={() => setAudit({ hrv: v })}
                accessibilityRole="button"
                accessibilityLabel={`Demo HRV ${v ?? 'None'}`}
              >
                <Text style={[styles.optionText, { color: v === audit.hrv ? tokens.accent : tokens.textSecondary }]}>
                  {v || '—'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Audit: Arousal */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Arousal: {audit.arousal || 'None'}</Text>
          <View style={styles.buttonRow}>
            {AROUSAL_VALUES.map((v) => (
              <TouchableOpacity
                key={v || 'null'}
                style={[
                  styles.optionBtn,
                  { borderColor: v === audit.arousal ? tokens.accent : tokens.border },
                ]}
                onPress={() => setAudit({ arousal: v })}
                accessibilityRole="button"
                accessibilityLabel={`Demo Arousal ${v ?? 'None'}`}
              >
                <Text style={[styles.optionText, { color: v === audit.arousal ? tokens.accent : tokens.textSecondary }]}>
                  {v || '—'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Health Integration */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Health Integration: {healthIntegrationEnabled ? 'On' : 'Off'}
          </Text>
          <View style={styles.lockRow}>
            <Text style={[styles.lockLabel, { color: tokens.textPrimary }]}>Enable Health</Text>
            <Switch
              value={healthIntegrationEnabled}
              onValueChange={(value) => {
                setHealthIntegrationEnabled(value);
                if (!value) {
                  applyHealthSnapshot(null, 'idle');
                }
              }}
              trackColor={{ false: tokens.border, true: tokens.accent }}
            />
          </View>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Sync: {healthSyncStatus}
            {healthSyncAt ? ` @ ${formatTime(healthSyncAt)}` : ''}
          </Text>
          {healthSyncError && (
            <Text style={[styles.label, { color: tokens.textSecondary }]}>Error: {healthSyncError}</Text>
          )}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => applyHealthSnapshot(createSnapshot(), 'success')}
              accessibilityRole="button"
              accessibilityLabel="Demo Health Sync OK"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Sync OK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => applyHealthSnapshot(null, 'no-data', 'No health records')}
              accessibilityRole="button"
              accessibilityLabel="Demo Health No Data"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>No Data</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => applyHealthSnapshot(null, 'failed', 'Permission denied')}
              accessibilityRole="button"
              accessibilityLabel="Demo Health Fail"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => applyHealthSnapshot(null, 'idle')}
              accessibilityRole="button"
              accessibilityLabel="Demo Health Clear"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cooldowns */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>
            Cooldowns: Neti {netiCooldown ? netiCooldown.label : 'Off'} / Serpent {serpentCooldown ? serpentCooldown.label : 'Off'}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => setNetiCooldown(72, baseTime)}
              accessibilityRole="button"
              accessibilityLabel="Demo Cooldown Neti"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Neti 72h</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => setSerpentCooldown(168, baseTime)}
              accessibilityRole="button"
              accessibilityLabel="Demo Cooldown Serpent"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Serpent 7d</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => setNetiCooldown(null)}
              accessibilityRole="button"
              accessibilityLabel="Demo Cooldown Neti Clear"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear Neti</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, { borderColor: tokens.border }]}
              onPress={() => setSerpentCooldown(null)}
              accessibilityRole="button"
              accessibilityLabel="Demo Cooldown Serpent Clear"
            >
              <Text style={[styles.optionText, { color: tokens.textSecondary }]}>Clear Serpent</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety Locks */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Safety Locks</Text>
          <View style={styles.lockGrid}>
            {LOCK_TYPES.map((lock) => (
              <View key={lock} style={styles.lockRow}>
                <Text style={[styles.lockLabel, { color: tokens.textPrimary }]}>{lock}</Text>
                <Switch
                  value={locks[lock]}
                  onValueChange={(value) => setLock(lock, value)}
                  trackColor={{ false: tokens.border, true: tokens.accent }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: tokens.border }]}
            onPress={randomize}
            accessibilityRole="button"
            accessibilityLabel="Demo Randomize"
          >
            <Text style={[styles.actionText, { color: tokens.textPrimary }]}>🎲 Random</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: tokens.accent }]}
            onPress={reset}
            accessibilityRole="button"
            accessibilityLabel="Demo Reset App"
          >
            <Text style={[styles.actionText, { color: tokens.bgPrimary }]}>↺ Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: tokens.border }]}
            onPress={resetDailyCycle}
            accessibilityRole="button"
            accessibilityLabel="Demo Reset Daily"
          >
            <Text style={[styles.actionText, { color: tokens.textPrimary }]}>Reset Daily</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  collapsedContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  collapsedText: {
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  collapseBtn: {
    fontSize: 12,
  },
  controls: {
    padding: 12,
    paddingTop: 0,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  optionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  modeBtn: {
    minWidth: 60,
  },
  optionText: {
    fontSize: 11,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderLabel: {
    fontSize: 10,
    width: 24,
    textAlign: 'center',
  },
  sliderContainer: {
    flex: 1,
    gap: 8,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  sliderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sliderBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lockGrid: {
    gap: 8,
  },
  lockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lockLabel: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
