import type { SensorSnapshot } from '../types/dailyCycle';
import type { Permission, ReadRecordsOptions } from 'react-native-health-connect';
import {
  getSdkStatus,
  initialize,
  openHealthConnectSettings,
  readRecords,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

type InitStatus = 'uninitialized' | 'ready' | 'unavailable' | 'denied';

let initStatus: InitStatus = 'uninitialized';
let initPromise: Promise<boolean> | null = null;
const INIT_TIMEOUT_MS = 8000;

const permissions: Permission[] = [
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'HeartRateVariabilityRmssd' },
  { accessType: 'read', recordType: 'RestingHeartRate' },
];

async function initHealthConnect(): Promise<boolean> {
  if (initStatus === 'ready') return true;
  if (initStatus === 'unavailable') return false;
  if (initStatus === 'denied') return false;
  if (initPromise) return initPromise;

  initPromise = withTimeout(
    (async () => {
      const status = await getSdkStatus();
    if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
      initStatus = 'unavailable';
      return false;
    }
    const ok = await initialize();
    initStatus = ok ? 'ready' : 'unavailable';
    return ok;
    })(),
    INIT_TIMEOUT_MS,
    () => {
      initStatus = 'unavailable';
      return false;
    }
  ).finally(() => {
    initPromise = null;
  });

  return initPromise;
}

export async function requestHealthPermissions(): Promise<boolean> {
  const ok = await initHealthConnect();
  if (!ok) return false;

  const granted = await withTimeout(
    requestPermission(permissions),
    INIT_TIMEOUT_MS,
    () => [] as Permission[]
  );
  const grantedKeys = new Set(granted.map((p) => `${p.accessType}:${p.recordType}`));
  const allGranted = permissions.every((p) => grantedKeys.has(`${p.accessType}:${p.recordType}`));
  if (!allGranted) initStatus = 'denied';
  return allGranted;
}

export async function readSensorSnapshot(now: Date = new Date()): Promise<SensorSnapshot | null> {
  if (initStatus === 'uninitialized') {
    const ok = await initHealthConnect();
    if (!ok) return null;
  }
  if (initStatus !== 'ready') return null;

  const timeRangeFilter: ReadRecordsOptions['timeRangeFilter'] = {
    operator: 'between',
    startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    endTime: now.toISOString(),
  };

  const sleep = await safeRead('SleepSession', { timeRangeFilter, pageSize: 20, ascendingOrder: false });
  const hrv = await safeRead('HeartRateVariabilityRmssd', { timeRangeFilter, pageSize: 10, ascendingOrder: false });
  const resting = await safeRead('RestingHeartRate', { timeRangeFilter, pageSize: 10, ascendingOrder: false });

  const sleepMinutes = computeSleepMinutesFromSessions(sleep);
  const latestRmssdMs =
    typeof hrv?.[0]?.heartRateVariabilityMillis === 'number' ? (hrv[0].heartRateVariabilityMillis as number) : null;
  const latestRestingHr =
    typeof resting?.[0]?.beatsPerMinute === 'number' ? (resting[0].beatsPerMinute as number) : null;

  return {
    capturedAt: now,
    sleepDurationMinutes: sleepMinutes,
    sleepQualityScore: null,
    hrvTrend: classifyRmssd(latestRmssdMs),
    recoveryScore: latestRestingHr ? classifyRecoveryScoreFromRestingHr(latestRestingHr) : null,
    movementOvernight: null,
  };
}

export function openHealthSettings() {
  openHealthConnectSettings();
}

async function safeRead(recordType: any, options: ReadRecordsOptions): Promise<any[]> {
  try {
    const result = await readRecords(recordType, options);
    return Array.isArray(result?.records) ? result.records : [];
  } catch {
    return [];
  }
}

function computeSleepMinutesFromSessions(sessions: any[]): number | null {
  if (!Array.isArray(sessions) || sessions.length === 0) return null;
  const totalMs = sessions.reduce((sum: number, s: any) => {
    const start = Date.parse(String(s.startTime));
    const end = Date.parse(String(s.endTime));
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return sum;
    return sum + (end - start);
  }, 0);
  return totalMs > 0 ? Math.round(totalMs / 60000) : null;
}

function classifyRmssd(rmssdMs: number | null): 'low' | 'ok' | 'high' | null {
  if (rmssdMs === null) return null;
  if (rmssdMs < 20) return 'low';
  if (rmssdMs < 50) return 'ok';
  return 'high';
}

function classifyRecoveryScoreFromRestingHr(restingHrBpm: number): number | null {
  if (!Number.isFinite(restingHrBpm) || restingHrBpm <= 0) return null;
  const score = Math.round(100 - Math.min(60, Math.max(0, restingHrBpm - 40)) * 1.5);
  return Math.max(0, Math.min(100, score));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, onTimeout: () => T): Promise<T> {
  return new Promise((resolve) => {
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(onTimeout());
    }, timeoutMs);

    promise
      .then((value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        resolve(value);
      })
      .catch(() => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        resolve(onTimeout());
      });
  });
}
