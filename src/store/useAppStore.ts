import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  Phase,
  Mode,
  Confidence,
  MoodQuadrant,
  BodyZone,
  SleepStatus,
  DriftStatus,
  AuditData,
  SafetyLocks,
  MoodCoordinates,
} from '../types';
import { persistStorage } from './persistStorage';

interface AppState {
  // Phase (capability level)
  phase: Phase;
  setPhase: (phase: Phase) => void;

  // Stability (0-100)
  stability: number;
  setStability: (stability: number) => void;

  // Mode (current biological state)
  mode: Mode;
  setMode: (mode: Mode) => void;

  // Confidence level for mode determination
  confidence: Confidence;
  setConfidence: (confidence: Confidence) => void;

  // Health integrations (local-only). When enabled, app will request/read Apple Health / Health Connect.
  healthIntegrationEnabled: boolean;
  setHealthIntegrationEnabled: (enabled: boolean) => void;

  // Subjective state (user-reported)
  moodQuadrant: MoodQuadrant;
  moodCoordinates: MoodCoordinates | null;
  setMood: (quadrant: MoodQuadrant, coordinates?: MoodCoordinates) => void;

  bodyZone: BodyZone;
  setBodyZone: (zone: BodyZone) => void;

  moodWord: string | null;
  setMoodWord: (word: string | null) => void;

  sleepStatus: SleepStatus;
  setSleepStatus: (status: SleepStatus) => void;

  // Audit (sensor) data
  audit: AuditData;
  setAudit: (audit: Partial<AuditData>) => void;

  // Safety locks
  locks: SafetyLocks;
  setLock: (lock: keyof SafetyLocks, value: boolean) => void;
  resetLocks: () => void;

  // Drift detection
  drift: DriftStatus;
  setDrift: (drift: DriftStatus) => void;

  // Cooldown timers (epoch ms)
  netiCooldownEndsAt: number | null; // 72h
  serpentCooldownEndsAt: number | null; // 7d = 168h
  setNetiCooldown: (hours: number | null, now?: Date) => void;
  setSerpentCooldown: (hours: number | null, now?: Date) => void;

  // Reset all state to defaults
  reset: () => void;

  // Onboarding
  hasOnboarded: boolean;
  completeOnboarding: () => void;
}

const defaultLocks: SafetyLocks = {
  kavacha: false,
  nightmare: false,
  neti: false,
  serpent: false,
  union: false,
  sleepEmergency: false,
};

const defaultAudit: AuditData = {
  hrv: null,
  arousal: null,
  movement: null,
  breath: null,
  temp: null,
};

const defaultState = {
  hasOnboarded: false,
  phase: 1 as Phase,
  stability: 70,
  mode: 'Mirror' as Mode,
  confidence: 'Self-report' as Confidence,
  healthIntegrationEnabled: false,
  moodQuadrant: null as MoodQuadrant,
  moodCoordinates: null as MoodCoordinates | null,
  bodyZone: null as BodyZone,
  moodWord: null as string | null,
  sleepStatus: 'Unknown' as SleepStatus,
  audit: defaultAudit,
  locks: defaultLocks,
  drift: 'Unknown' as DriftStatus,
  netiCooldownEndsAt: null as number | null,
  serpentCooldownEndsAt: null as number | null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...defaultState,

      setPhase: (phase) => set({ phase }),
      setStability: (stability) =>
        set({ stability: Math.max(0, Math.min(100, stability)) }),
      setMode: (mode) => set({ mode }),
      setConfidence: (confidence) => set({ confidence }),
      setHealthIntegrationEnabled: (enabled) => set({ healthIntegrationEnabled: enabled }),

      setMood: (quadrant, coordinates) =>
        set({
          moodQuadrant: quadrant,
          moodCoordinates: coordinates ?? null,
        }),

      setBodyZone: (zone) => set({ bodyZone: zone }),
      setMoodWord: (word) => set({ moodWord: word }),
      setSleepStatus: (status) => set({ sleepStatus: status }),

      setAudit: (auditUpdate) =>
        set((state) => ({
          audit: { ...state.audit, ...auditUpdate },
        })),

      setLock: (lock, value) =>
        set((state) => {
          if (__DEV__) {
            console.log('Lock update', { lock, value });
          }
          return {
            locks: { ...state.locks, [lock]: value },
          };
        }),

      resetLocks: () => set({ locks: defaultLocks }),

      setDrift: (drift) => set({ drift }),

      setNetiCooldown: (hours, now = new Date()) => {
        const endsAt = hours === null ? null : now.getTime() + hours * 60 * 60 * 1000;
        set({ netiCooldownEndsAt: endsAt });
        if (__DEV__) {
          console.log('Cooldown update', { type: 'neti', endsAt });
        }
      },
      setSerpentCooldown: (hours, now = new Date()) => {
        const endsAt = hours === null ? null : now.getTime() + hours * 60 * 60 * 1000;
        set({ serpentCooldownEndsAt: endsAt });
        if (__DEV__) {
          console.log('Cooldown update', { type: 'serpent', endsAt });
        }
      },

      completeOnboarding: () => set({ hasOnboarded: true }),

      reset: () => set(defaultState),
    }),
    {
      name: 'sadhana.app',
      storage: createJSONStorage(() => persistStorage),
      partialize: (state) => ({
        hasOnboarded: state.hasOnboarded,
        phase: state.phase,
        stability: state.stability,
        healthIntegrationEnabled: state.healthIntegrationEnabled,
        locks: state.locks,
        netiCooldownEndsAt: state.netiCooldownEndsAt,
        serpentCooldownEndsAt: state.serpentCooldownEndsAt,
      }),
    }
  )
);
