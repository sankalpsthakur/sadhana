/**
 * Daily Cycle Types
 * Track the "game day" state for Sadhana's gamified learning system.
 *
 * The daily cycle resets at 4:00 AM (start of Brahma Muhurta).
 * This creates natural "game days" aligned with circadian biology.
 */

// Check-in entry recorded during the day
export interface CheckinEntry {
  id: string;
  timestamp: Date;
  moodQuadrant: 'Red' | 'Blue' | 'Green' | 'Yellow';
  moodCoordinates?: { x: number; y: number };
  bodyZone?: string;
  word?: string;
  source: 'morning' | 'midday' | 'evening' | 'seal';
}

// Practice completed during the day
export interface PracticeEntry {
  id: string;
  practiceId: string;
  practiceName: string;
  timestamp: Date;
  durationSeconds: number;
  completed: boolean;
  notes?: string;
}

// Dream capture entry
export interface DreamEntry {
  id: string;
  capturedAt: Date;
  moodOnWaking: 'Red' | 'Blue' | 'Green' | 'Yellow';
  lucidityLevel: 'none' | 'semi' | 'full' | 'operator';
  symbols: string[]; // 1-3 tags
  voiceNoteUri?: string;
  isNightmare: boolean;
}

// Dream intention set before sleep
export interface DreamIntention {
  type: 'shadow' | 'resolve' | 'guidance' | 'lucidity' | 'none';
  description?: string;
  setAt: Date;
}

// Mission tracking
export interface Mission {
  id: string;
  pillar: 'restraint' | 'truth' | 'service' | 'output' | 'recovery';
  tier: 'ember' | 'flame' | 'blaze'; // T1, T2, T3
  title: string;
  instruction: string;
  acceptedAt: Date;
  status: 'active' | 'done' | 'failed' | 'extended' | 'skipped';
  resolvedAt?: Date;
  reflection?: string;
}

// Deep work session
export interface DeepWorkSession {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  intention: string;
  output?: string;
  durationMinutes: number;
  preflightPassed: boolean;
  returnedToGreen: boolean;
}

// Sensor snapshot from wake
export interface SensorSnapshot {
  capturedAt: Date;
  sleepDurationMinutes: number | null;
  sleepQualityScore: number | null; // 0-100
  hrvTrend: 'low' | 'ok' | 'high' | null;
  recoveryScore: number | null; // 0-100
  movementOvernight: 'restless' | 'normal' | 'still' | null;
}

export type HealthSyncStatus = 'idle' | 'syncing' | 'success' | 'no-data' | 'failed';
export type HealthSource = 'apple-health' | 'health-connect' | 'web' | 'unknown';

// Special day types
export type SpecialDay = 'rest' | 'intensive' | 'recovery' | null;

// The complete daily cycle state
export interface DailyCycle {
  // Identity
  date: string; // "2024-12-23" format

  // Wake tracking
  wakeTimeInferred: Date | null;
  sensorSnapshot: SensorSnapshot | null;
  healthSyncStatus: HealthSyncStatus;
  healthSyncAt: Date | null;
  healthSyncError: string | null;
  healthSyncSource: HealthSource;

  // Non-negotiables
  morningCheckinAt: Date | null;
  sealedAt: Date | null;
  nightModeActiveAt: Date | null;

  // Check-ins throughout day
  checkins: CheckinEntry[];

  // Practices completed
  practicesCompleted: PracticeEntry[];

  // Deep work sessions
  deepWorkSessions: DeepWorkSession[];

  // Dream work (Phase 2+)
  dreamCaptured: DreamEntry | null;
  dreamIntention: DreamIntention | null;

  // Mission (Phase 3+)
  mission: Mission | null;

  // Seal data
  finalMoodPlot: CheckinEntry | null;
  gratitudeLine: string | null;

  // Evening safety
  eveningAlertResolvedAt: Date | null;

  // Special day mode
  specialDay: SpecialDay;

  // Dyad (Phase 4+)
  dyadCheckinDone: boolean;
  dyadSyncScheduled: boolean;
}

// Helpers for creating fresh daily cycle
export function createFreshDailyCycle(date: Date = new Date()): DailyCycle {
  return {
    date: formatDateKey(date),
    wakeTimeInferred: null,
    sensorSnapshot: null,
    healthSyncStatus: 'idle',
    healthSyncAt: null,
    healthSyncError: null,
    healthSyncSource: 'unknown',
    morningCheckinAt: null,
    sealedAt: null,
    nightModeActiveAt: null,
    checkins: [],
    practicesCompleted: [],
    deepWorkSessions: [],
    dreamCaptured: null,
    dreamIntention: null,
    mission: null,
    finalMoodPlot: null,
    gratitudeLine: null,
    eveningAlertResolvedAt: null,
    specialDay: null,
    dyadCheckinDone: false,
    dyadSyncScheduled: false,
  };
}

// Format date as key string
export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Format date as cycle key with 4 AM boundary (matches daily cycle reset)
export function getCycleDateKey(date: Date): string {
  const adjusted = new Date(date);
  if (adjusted.getHours() < 4) {
    adjusted.setDate(adjusted.getDate() - 1);
  }
  return formatDateKey(adjusted);
}

// Check if a cycle date key is the immediate next day after another
export function isNextCycleDate(prevKey: string, nextKey: string): boolean {
  const prev = new Date(`${prevKey}T00:00:00.000Z`);
  prev.setUTCDate(prev.getUTCDate() + 1);
  return formatDateKey(prev) === nextKey;
}

// Check if we need to reset the daily cycle (new day at 4 AM)
export function shouldResetDailyCycle(
  currentCycleDate: string,
  now: Date = new Date()
): boolean {
  const todayKey = formatDateKey(now);
  const hour = now.getHours();

  // If it's before 4 AM, we're still on yesterday's cycle
  if (hour < 4) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return currentCycleDate !== formatDateKey(yesterday);
  }

  // After 4 AM, we're on today's cycle
  return currentCycleDate !== todayKey;
}
