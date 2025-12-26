import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  CheckinEntry,
  createFreshDailyCycle,
  DailyCycle,
  DeepWorkSession,
  DreamEntry,
  DreamIntention,
  formatDateKey,
  getCycleDateKey,
  HealthSource,
  HealthSyncStatus,
  isNextCycleDate,
  Mission,
  PracticeEntry,
  SensorSnapshot,
  shouldResetDailyCycle,
  SpecialDay,
} from '../types/dailyCycle';
import { persistStorage } from './persistStorage';
import { useAppStore } from './useAppStore';

interface DailyCycleState extends DailyCycle {
  // Learned patterns (7-day rolling average)
  typicalWakeTime: string;
  typicalSleepTime: string;

  // Debug-only override (do not persist)
  demoNow: Date | null;

  // Nightmare tracking (persists across cycles)
  nightmareStreak: number;
  nightmareRecoveryStreak: number;
  lastDreamDateKey: string | null;

  // Actions
  ensureFreshCycle: () => void;
  inferWake: (time?: Date) => void;
  setSensorSnapshot: (snapshot: SensorSnapshot | null) => void;
  setHealthSyncStatus: (
    status: HealthSyncStatus,
    options?: { error?: string | null; source?: HealthSource; at?: Date }
  ) => void;
  setDemoNow: (now: Date | null) => void;

  // Check-ins
  recordMorningCheckin: (checkin: Omit<CheckinEntry, 'id' | 'source'>) => void;
  recordCheckin: (checkin: Omit<CheckinEntry, 'id'>) => void;
  clearMorningCheckin: () => void;
  clearWakeTime: () => void;

  // Practices
  recordPractice: (practice: Omit<PracticeEntry, 'id'>) => void;

  // Deep work
  startDeepWork: (intention: string) => string; // returns session id
  completeDeepWork: (sessionId: string, output: string, returnedToGreen: boolean) => void;

  // Dream work
  captureDream: (dream: Omit<DreamEntry, 'id'>) => void;
  setDreamIntention: (intention: DreamIntention) => void;
  clearDreamCapture: () => void;

  // Missions
  acceptMission: (mission: Omit<Mission, 'acceptedAt' | 'status'>) => void;
  resolveMission: (status: 'done' | 'failed' | 'extended', reflection?: string) => void;
  clearMission: () => void;

  // Seal
  sealTheDay: (finalMood: Omit<CheckinEntry, 'id' | 'source'>, gratitude?: string) => void;
  activateNightMode: () => void;
  resolveEveningAlert: () => void;
  clearSeal: () => void;
  clearNightMode: () => void;

  // Special days
  setSpecialDay: (type: SpecialDay) => void;

  // Dyad
  recordDyadCheckin: () => void;
  scheduleDyadSync: () => void;
  clearDyadStatus: () => void;

  // Reset
  reset: () => void;
}

type PersistedShape = {
  // DailyCycle core
  date: string;
  wakeTimeInferred: string | null;
  sensorSnapshot: (Omit<SensorSnapshot, 'capturedAt'> & { capturedAt: string }) | null;
  healthSyncStatus: HealthSyncStatus;
  healthSyncAt: string | null;
  healthSyncError: string | null;
  healthSyncSource: HealthSource;
  morningCheckinAt: string | null;
  sealedAt: string | null;
  nightModeActiveAt: string | null;
  checkins: Array<Omit<CheckinEntry, 'timestamp'> & { timestamp: string }>;
  practicesCompleted: Array<Omit<PracticeEntry, 'timestamp'> & { timestamp: string }>;
  deepWorkSessions: Array<
    Omit<DeepWorkSession, 'startedAt' | 'completedAt'> & { startedAt: string; completedAt?: string }
  >;
  dreamCaptured: (Omit<DreamEntry, 'capturedAt'> & { capturedAt: string }) | null;
  dreamIntention: (Omit<DreamIntention, 'setAt'> & { setAt: string }) | null;
  mission:
    | (Omit<Mission, 'acceptedAt' | 'resolvedAt'> & { acceptedAt: string; resolvedAt?: string })
    | null;
  finalMoodPlot: (Omit<CheckinEntry, 'timestamp'> & { timestamp: string }) | null;
  gratitudeLine: string | null;
  eveningAlertResolvedAt: string | null;
  specialDay: SpecialDay;
  dyadCheckinDone: boolean;
  dyadSyncScheduled: boolean;

  // Learned patterns
  typicalWakeTime: string;
  typicalSleepTime: string;

  // Nightmare tracking
  nightmareStreak: number;
  nightmareRecoveryStreak: number;
  lastDreamDateKey: string | null;

  // Debug-only override is intentionally excluded from persistence.
  demoNow: null;
};

const generateId = () => Math.random().toString(36).substring(2, 9);
const toIso = (date: Date | null | undefined) => (date ? date.toISOString() : null);
const fromIso = (value: string | null | undefined) => (value ? new Date(value) : null);
const logCycle = (event: string, payload: Record<string, unknown> = {}) => {
  if (!__DEV__) return;
  console.log('DailyCycle', { event, ...payload });
};

function serializeState(state: DailyCycleState): PersistedShape {
  return {
    demoNow: null,
    date: state.date,
    wakeTimeInferred: toIso(state.wakeTimeInferred),
    sensorSnapshot: state.sensorSnapshot
      ? { ...state.sensorSnapshot, capturedAt: state.sensorSnapshot.capturedAt.toISOString() }
      : null,
    healthSyncStatus: state.healthSyncStatus,
    healthSyncAt: toIso(state.healthSyncAt),
    healthSyncError: state.healthSyncError,
    healthSyncSource: state.healthSyncSource,
    morningCheckinAt: toIso(state.morningCheckinAt),
    sealedAt: toIso(state.sealedAt),
    nightModeActiveAt: toIso(state.nightModeActiveAt),
    checkins: state.checkins.map((c) => ({ ...c, timestamp: c.timestamp.toISOString() })),
    practicesCompleted: state.practicesCompleted.map((p) => ({
      ...p,
      timestamp: p.timestamp.toISOString(),
    })),
    deepWorkSessions: state.deepWorkSessions.map((d) => ({
      ...d,
      startedAt: d.startedAt.toISOString(),
      completedAt: d.completedAt ? d.completedAt.toISOString() : undefined,
    })),
    dreamCaptured: state.dreamCaptured
      ? { ...state.dreamCaptured, capturedAt: state.dreamCaptured.capturedAt.toISOString() }
      : null,
    dreamIntention: state.dreamIntention
      ? { ...state.dreamIntention, setAt: state.dreamIntention.setAt.toISOString() }
      : null,
    mission: state.mission
      ? {
          ...state.mission,
          acceptedAt: state.mission.acceptedAt.toISOString(),
          resolvedAt: state.mission.resolvedAt ? state.mission.resolvedAt.toISOString() : undefined,
        }
      : null,
    finalMoodPlot: state.finalMoodPlot
      ? { ...state.finalMoodPlot, timestamp: state.finalMoodPlot.timestamp.toISOString() }
      : null,
    gratitudeLine: state.gratitudeLine,
    eveningAlertResolvedAt: toIso(state.eveningAlertResolvedAt),
    specialDay: state.specialDay,
    dyadCheckinDone: state.dyadCheckinDone,
    dyadSyncScheduled: state.dyadSyncScheduled,
    typicalWakeTime: state.typicalWakeTime,
    typicalSleepTime: state.typicalSleepTime,
    nightmareStreak: state.nightmareStreak,
    nightmareRecoveryStreak: state.nightmareRecoveryStreak,
    lastDreamDateKey: state.lastDreamDateKey,
  };
}

function deserializeState(persisted: Partial<PersistedShape>): Partial<DailyCycleState> {
  return {
    demoNow: null,
    date: persisted.date ?? formatDateKey(new Date()),
    wakeTimeInferred: fromIso(persisted.wakeTimeInferred),
    sensorSnapshot: persisted.sensorSnapshot
      ? { ...persisted.sensorSnapshot, capturedAt: new Date(persisted.sensorSnapshot.capturedAt) }
      : null,
    healthSyncStatus: persisted.healthSyncStatus ?? 'idle',
    healthSyncAt: fromIso(persisted.healthSyncAt),
    healthSyncError: persisted.healthSyncError ?? null,
    healthSyncSource: persisted.healthSyncSource ?? 'unknown',
    morningCheckinAt: fromIso(persisted.morningCheckinAt),
    sealedAt: fromIso(persisted.sealedAt),
    nightModeActiveAt: fromIso(persisted.nightModeActiveAt),
    checkins: (persisted.checkins ?? []).map((c) => ({ ...c, timestamp: new Date(c.timestamp) })),
    practicesCompleted: (persisted.practicesCompleted ?? []).map((p) => ({
      ...p,
      timestamp: new Date(p.timestamp),
    })),
    deepWorkSessions: (persisted.deepWorkSessions ?? []).map((d) => ({
      ...d,
      startedAt: new Date(d.startedAt),
      completedAt: d.completedAt ? new Date(d.completedAt) : undefined,
    })),
    dreamCaptured: persisted.dreamCaptured
      ? { ...persisted.dreamCaptured, capturedAt: new Date(persisted.dreamCaptured.capturedAt) }
      : null,
    dreamIntention: persisted.dreamIntention
      ? { ...persisted.dreamIntention, setAt: new Date(persisted.dreamIntention.setAt) }
      : null,
    mission: persisted.mission
      ? {
          ...persisted.mission,
          acceptedAt: new Date(persisted.mission.acceptedAt),
          resolvedAt: persisted.mission.resolvedAt ? new Date(persisted.mission.resolvedAt) : undefined,
        }
      : null,
    finalMoodPlot: persisted.finalMoodPlot
      ? { ...persisted.finalMoodPlot, timestamp: new Date(persisted.finalMoodPlot.timestamp) }
      : null,
    gratitudeLine: persisted.gratitudeLine ?? null,
    eveningAlertResolvedAt: fromIso(persisted.eveningAlertResolvedAt),
    specialDay: persisted.specialDay ?? null,
    dyadCheckinDone: persisted.dyadCheckinDone ?? false,
    dyadSyncScheduled: persisted.dyadSyncScheduled ?? false,
    typicalWakeTime: persisted.typicalWakeTime ?? '07:00',
    typicalSleepTime: persisted.typicalSleepTime ?? '22:30',
    nightmareStreak: persisted.nightmareStreak ?? 0,
    nightmareRecoveryStreak: persisted.nightmareRecoveryStreak ?? 0,
    lastDreamDateKey: persisted.lastDreamDateKey ?? null,
  };
}

export const useDailyCycleStore = create<DailyCycleState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...createFreshDailyCycle(),
      typicalWakeTime: '07:00',
      typicalSleepTime: '22:30',
      demoNow: null,
      nightmareStreak: 0,
      nightmareRecoveryStreak: 0,
      lastDreamDateKey: null,

      ensureFreshCycle: () => {
        const state = get();
        if (shouldResetDailyCycle(state.date)) {
          set({
            ...createFreshDailyCycle(),
            typicalWakeTime: state.typicalWakeTime,
            typicalSleepTime: state.typicalSleepTime,
            demoNow: null,
            nightmareStreak: state.nightmareStreak,
            nightmareRecoveryStreak: state.nightmareRecoveryStreak,
            lastDreamDateKey: state.lastDreamDateKey,
          });
        }
      },

      inferWake: (time = new Date()) => {
        set({ wakeTimeInferred: time });
        logCycle('wake-inferred', { at: time.toISOString() });
      },

      setSensorSnapshot: (snapshot) => {
        set({ sensorSnapshot: snapshot });
        logCycle('sensor-snapshot', {
          hasData: Boolean(snapshot),
          capturedAt: snapshot?.capturedAt?.toISOString(),
        });
      },

      setHealthSyncStatus: (status, options = {}) => {
        const at = options.at ?? new Date();
        set((state) => ({
          healthSyncStatus: status,
          healthSyncError: status === 'failed' ? options.error ?? state.healthSyncError : options.error ?? null,
          healthSyncSource: options.source ?? state.healthSyncSource,
          healthSyncAt: status === 'syncing' ? state.healthSyncAt : at,
        }));
        logCycle('health-sync', {
          status,
          source: options.source,
          error: options.error ?? null,
          at: at.toISOString(),
        });
      },

      setDemoNow: (now) => {
        set({ demoNow: now });
      },

      recordMorningCheckin: (checkin) => {
        const entry: CheckinEntry = {
          ...checkin,
          id: generateId(),
          source: 'morning',
        };
        set((state) => ({
          morningCheckinAt: checkin.timestamp,
          checkins: [...state.checkins, entry],
        }));
        logCycle('checkin', {
          source: 'morning',
          quadrant: entry.moodQuadrant,
          word: entry.word ?? null,
          bodyZone: entry.bodyZone ?? null,
        });
      },

      clearMorningCheckin: () => {
        set((state) => ({
          morningCheckinAt: null,
          checkins: state.checkins.filter((entry) => entry.source !== 'morning'),
        }));
      },

      recordCheckin: (checkin) => {
        const entry: CheckinEntry = {
          ...checkin,
          id: generateId(),
        };
        set((state) => ({
          checkins: [...state.checkins, entry],
        }));
        logCycle('checkin', {
          source: entry.source,
          quadrant: entry.moodQuadrant,
          word: entry.word ?? null,
          bodyZone: entry.bodyZone ?? null,
        });
      },

      clearWakeTime: () => {
        set({ wakeTimeInferred: null });
      },

      recordPractice: (practice) => {
        const entry: PracticeEntry = {
          ...practice,
          id: generateId(),
        };
        set((state) => ({
          practicesCompleted: [...state.practicesCompleted, entry],
        }));
        if (__DEV__) {
          console.log('Practice logged', {
            id: entry.practiceId,
            at: entry.timestamp.toISOString(),
            completed: entry.completed,
          });
        }

        const { setNetiCooldown, setSerpentCooldown, setLock } = useAppStore.getState();
        if (entry.practiceId === 'neti-slicing' || entry.practiceId === 'neti-protocol') {
          setNetiCooldown(72, entry.timestamp);
          setLock('neti', true);
        }
        if (entry.practiceId === 'serpent-rise' || entry.practiceId === 'sushumna-rise') {
          setSerpentCooldown(168, entry.timestamp);
          setLock('serpent', true);
        }
      },

      startDeepWork: (intention) => {
        const now = get().demoNow ?? new Date();
        const sessionId = generateId();
        const session: DeepWorkSession = {
          id: sessionId,
          startedAt: now,
          intention,
          durationMinutes: 25,
          preflightPassed: true,
          returnedToGreen: false,
        };
        set((state) => ({
          deepWorkSessions: [...state.deepWorkSessions, session],
        }));
        return sessionId;
      },

      completeDeepWork: (sessionId, output, returnedToGreen) => {
        const now = get().demoNow ?? new Date();
        set((state) => ({
          deepWorkSessions: state.deepWorkSessions.map((s) =>
            s.id === sessionId ? { ...s, completedAt: now, output, returnedToGreen } : s
          ),
        }));
      },

      captureDream: (dream) => {
        const entry: DreamEntry = {
          ...dream,
          id: generateId(),
        };
        const state = get();
        const cycleKey = getCycleDateKey(entry.capturedAt);
        const isConsecutive =
          state.lastDreamDateKey ? isNextCycleDate(state.lastDreamDateKey, cycleKey) : false;
        const { locks, setLock } = useAppStore.getState();

        let nightmareStreak = state.nightmareStreak;
        let nightmareRecoveryStreak = state.nightmareRecoveryStreak;

        if (entry.isNightmare) {
          nightmareStreak = isConsecutive ? state.nightmareStreak + 1 : 1;
          nightmareRecoveryStreak = 0;
        } else {
          nightmareStreak = 0;
          if (locks.nightmare) {
            nightmareRecoveryStreak = isConsecutive ? state.nightmareRecoveryStreak + 1 : 1;
          } else {
            nightmareRecoveryStreak = 0;
          }
        }

        set({
          dreamCaptured: entry,
          lastDreamDateKey: cycleKey,
          nightmareStreak,
          nightmareRecoveryStreak,
        });
        logCycle('dream-captured', {
          nightmare: entry.isNightmare,
          mood: entry.moodOnWaking,
          streak: nightmareStreak,
          recoveryStreak: nightmareRecoveryStreak,
        });

        if (entry.isNightmare && nightmareStreak >= 2 && !locks.nightmare) {
          setLock('nightmare', true);
        }

        if (!entry.isNightmare && locks.nightmare && nightmareRecoveryStreak >= 3) {
          setLock('nightmare', false);
        }
      },

      setDreamIntention: (intention) => {
        set({ dreamIntention: intention });
        logCycle('dream-intention', { type: intention.type });
      },

      clearDreamCapture: () => {
        set({ dreamCaptured: null });
      },

      acceptMission: (mission) => {
        const now = get().demoNow ?? new Date();
        const fullMission: Mission = {
          ...mission,
          acceptedAt: now,
          status: 'active',
        };
        set({ mission: fullMission });
        logCycle('mission-accepted', { id: fullMission.id, pillar: fullMission.pillar, tier: fullMission.tier });
      },

      resolveMission: (status, reflection) => {
        const now = get().demoNow ?? new Date();
        set((state) => ({
          mission: state.mission ? { ...state.mission, status, resolvedAt: now, reflection } : null,
        }));
        logCycle('mission-resolved', { status });
      },

      clearMission: () => {
        set({ mission: null });
      },

      sealTheDay: (finalMood, gratitude) => {
        const now = get().demoNow ?? new Date();
        const finalEntry: CheckinEntry = {
          ...finalMood,
          id: generateId(),
          source: 'seal',
        };
        set({
          sealedAt: now,
          finalMoodPlot: finalEntry,
          gratitudeLine: gratitude || null,
        });
        logCycle('seal', {
          mood: finalEntry.moodQuadrant,
          gratitude: gratitude ? 'yes' : 'no',
        });
      },

      activateNightMode: () => {
        const now = get().demoNow ?? new Date();
        set({ nightModeActiveAt: now });
      },

      resolveEveningAlert: () => {
        const now = get().demoNow ?? new Date();
        set({ eveningAlertResolvedAt: now });
      },

      clearSeal: () => {
        set({ sealedAt: null, finalMoodPlot: null, gratitudeLine: null });
      },

      clearNightMode: () => {
        set({ nightModeActiveAt: null });
      },

      setSpecialDay: (type) => {
        set({ specialDay: type });
      },

      recordDyadCheckin: () => {
        set({ dyadCheckinDone: true });
      },

      scheduleDyadSync: () => {
        set({ dyadSyncScheduled: true });
      },

      clearDyadStatus: () => {
        set({ dyadCheckinDone: false, dyadSyncScheduled: false });
      },

      reset: () => {
        set({
          ...createFreshDailyCycle(),
          typicalWakeTime: get().typicalWakeTime,
          typicalSleepTime: get().typicalSleepTime,
          demoNow: null,
          nightmareStreak: 0,
          nightmareRecoveryStreak: 0,
          lastDreamDateKey: null,
        });
      },
    }),
    {
      name: 'sadhana.dailyCycle.v1',
      storage: createJSONStorage(() => persistStorage),
      partialize: (state) => serializeState(state) as any,
      merge: (persisted, current) => ({
        ...current,
        ...deserializeState(persisted as any),
      }),
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0 || version === undefined) {
          return persistedState as any;
        }
        return persistedState as any;
      },
    }
  )
);
