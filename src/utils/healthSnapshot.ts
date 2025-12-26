import type { AuditValue, Confidence, SleepStatus } from '../types';
import type { SensorSnapshot } from '../types/dailyCycle';

export function deriveSnapshotSignals(snapshot: SensorSnapshot) {
  const hrvLabel: AuditValue =
    snapshot.hrvTrend === 'low' ? 'Low' : snapshot.hrvTrend === 'ok' ? 'OK' : snapshot.hrvTrend === 'high' ? 'High' : null;

  const sleepStatus: SleepStatus =
    snapshot.sleepDurationMinutes === null ? 'Unknown' : snapshot.sleepDurationMinutes >= 420 ? 'Protected' : 'AtRisk';

  const confidence: Confidence =
    snapshot.sleepDurationMinutes !== null && (snapshot.hrvTrend !== null || snapshot.recoveryScore !== null)
      ? 'Mixed'
      : 'Self-report';

  const hasData =
    snapshot.sleepDurationMinutes !== null ||
    snapshot.hrvTrend !== null ||
    snapshot.recoveryScore !== null ||
    snapshot.movementOvernight !== null;

  return { hrvLabel, sleepStatus, confidence, hasData };
}

export function hasSnapshotData(snapshot: SensorSnapshot | null): boolean {
  if (!snapshot) return false;
  return (
    snapshot.sleepDurationMinutes !== null ||
    snapshot.hrvTrend !== null ||
    snapshot.recoveryScore !== null ||
    snapshot.movementOvernight !== null
  );
}

export function formatSleepDuration(minutes: number | null): string {
  if (minutes === null) return '-';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
