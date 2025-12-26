import AppleHealthKit, { HealthKitPermissions } from 'react-native-health';
import type { SensorSnapshot } from '../types/dailyCycle';

type InitStatus = 'uninitialized' | 'ready' | 'denied';

let initStatus: InitStatus = 'uninitialized';
let initPromise: Promise<boolean> | null = null;
const INIT_TIMEOUT_MS = 8000;
const isHealthKitAvailable = () => typeof AppleHealthKit?.initHealthKit === 'function';

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.HeartRateVariability,
      AppleHealthKit.Constants.Permissions.RestingHeartRate,
    ],
    write: [AppleHealthKit.Constants.Permissions.MindfulSession],
  },
};

function initHealthKit(): Promise<boolean> {
  if (!isHealthKitAvailable()) {
    initStatus = 'denied';
    return Promise.resolve(false);
  }
  if (initStatus === 'ready') return Promise.resolve(true);
  if (initStatus === 'denied') return Promise.resolve(false);
  if (initPromise) return initPromise;

  const promise = new Promise<boolean>((resolve) => {
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      initStatus = 'denied';
      resolve(false);
    }, INIT_TIMEOUT_MS);

    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);

      if (error) {
        initStatus = 'denied';
        resolve(false);
        return;
      }
      initStatus = 'ready';
      resolve(true);
    });
  }).finally(() => {
    initPromise = null;
  });

  initPromise = promise;
  return promise;
}

export async function requestHealthPermissions(): Promise<boolean> {
  return initHealthKit();
}

export async function readSensorSnapshot(now: Date = new Date()): Promise<SensorSnapshot | null> {
  if (initStatus === 'uninitialized') {
    const ok = await initHealthKit();
    if (!ok) return null;
  }
  if (initStatus !== 'ready') return null;

  const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const endDate = now.toISOString();

  const sleepSamples = await new Promise<any[]>((resolve) => {
    AppleHealthKit.getSleepSamples(
      { startDate, endDate, ascending: false, limit: 200 },
      (err: any, results: any[]) => {
        if (err || !Array.isArray(results)) return resolve([]);
        resolve(results);
      }
    );
  });

  const hrvSamples = await new Promise<any[]>((resolve) => {
    AppleHealthKit.getHeartRateVariabilitySamples(
      { startDate, endDate, ascending: false, limit: 10, unit: AppleHealthKit.Constants.Units.second },
      (err: any, results: any[]) => {
        if (err || !Array.isArray(results)) return resolve([]);
        resolve(results);
      }
    );
  });

  const restingHrSamples = await new Promise<any[]>((resolve) => {
    AppleHealthKit.getRestingHeartRateSamples(
      { startDate, endDate, ascending: false, limit: 10, unit: AppleHealthKit.Constants.Units.bpm },
      (err: any, results: any[]) => {
        if (err || !Array.isArray(results)) return resolve([]);
        resolve(results);
      }
    );
  });

  const sleepMinutes = computeSleepDurationMinutes(sleepSamples);
  const latestHrvSeconds = typeof hrvSamples?.[0]?.value === 'number' ? (hrvSamples[0].value as number) : null;
  const latestRestingHrBpm = typeof restingHrSamples?.[0]?.value === 'number' ? (restingHrSamples[0].value as number) : null;

  return {
    capturedAt: now,
    sleepDurationMinutes: sleepMinutes,
    sleepQualityScore: null,
    hrvTrend: classifyHrvTrend(latestHrvSeconds),
    recoveryScore: latestRestingHrBpm ? classifyRecoveryScoreFromRestingHr(latestRestingHrBpm) : null,
    movementOvernight: null,
  };
}

function computeSleepDurationMinutes(samples: any[]): number | null {
  if (!Array.isArray(samples) || samples.length === 0) return null;

  const stages = samples.filter((s) => ['DEEP', 'CORE', 'REM'].includes(String(s.value)));
  const asleep = samples.filter((s) => String(s.value) === 'ASLEEP');
  const inbed = samples.filter((s) => String(s.value) === 'INBED');

  const source = stages.length > 0 ? stages : asleep.length > 0 ? asleep : inbed;
  if (source.length === 0) return null;

  const totalMs = source.reduce((sum: number, s: any) => {
    const start = Date.parse(String(s.startDate));
    const end = Date.parse(String(s.endDate));
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return sum;
    return sum + (end - start);
  }, 0);

  return totalMs > 0 ? Math.round(totalMs / 60000) : null;
}

function classifyHrvTrend(hrvSeconds: number | null): 'low' | 'ok' | 'high' | null {
  if (hrvSeconds === null) return null;
  const hrvMs = hrvSeconds * 1000;
  if (hrvMs < 30) return 'low';
  if (hrvMs < 60) return 'ok';
  return 'high';
}

function classifyRecoveryScoreFromRestingHr(restingHrBpm: number): number | null {
  if (!Number.isFinite(restingHrBpm) || restingHrBpm <= 0) return null;

  // Very rough heuristic (local-only): lower resting HR tends to correlate with better recovery.
  // Clamp into 0–100.
  const score = Math.round(100 - Math.min(60, Math.max(0, restingHrBpm - 40)) * 1.5);
  return Math.max(0, Math.min(100, score));
}
