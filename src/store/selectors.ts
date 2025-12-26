import { useAppStore } from './useAppStore';
import { StabilityBand, MoodQuadrant, DriftStatus, LockType, SafetyLocks } from '../types';

// Get stability band from score
export function getStabilityBand(stability: number): StabilityBand {
  if (stability < 60) return 'Unstable';
  if (stability < 70) return 'Settling';
  if (stability < 85) return 'Stable';
  if (stability < 90) return 'Radiant';
  return 'HV-Eligible';
}

// Get number of stability pips to fill (1-5)
export function getStabilityPips(stability: number): number {
  if (stability < 60) return 1;
  if (stability < 70) return 2;
  if (stability < 85) return 3;
  if (stability < 90) return 4;
  return 5;
}

// Check if Trends tab should be locked
export function isTrendsLocked(stability: number): boolean {
  return stability < 60;
}

// Get count of active safety locks
export function useActiveLockCount(): number {
  const locks = useAppStore((state) => state.locks);
  return Object.values(locks).filter(Boolean).length;
}

// Get list of active lock types
export function useActiveLocks(): LockType[] {
  const locks = useAppStore((state) => state.locks);
  return (Object.keys(locks) as LockType[]).filter((key) => locks[key]);
}

// Compute audit proxy quadrant from sensor data
export function useAuditProxyQuadrant(): MoodQuadrant {
  const audit = useAppStore((state) => state.audit);

  // If insufficient data, return null
  if (!audit.hrv && !audit.arousal && !audit.movement) {
    return null;
  }

  // High arousal + low HRV → Red proxy
  if (audit.arousal === 'Spiky' && audit.hrv === 'Low') {
    return 'Red';
  }

  // Low energy + low movement + low HRV → Blue proxy
  if (audit.movement === 'Still' && audit.hrv === 'Low') {
    return 'Blue';
  }

  // Stable HRV + low arousal → Green proxy
  if ((audit.hrv === 'OK' || audit.hrv === 'High') && audit.arousal === 'Steady') {
    return 'Green';
  }

  // Elevated HR + stable HRV → Yellow proxy
  if (audit.hrv === 'OK' && audit.arousal === 'Steady' && audit.movement === 'Active') {
    return 'Yellow';
  }

  // Default to Green if we have stable data
  if (audit.hrv === 'OK' || audit.hrv === 'High') {
    return 'Green';
  }

  return null;
}

// Compute drift status
export function useComputedDrift(): DriftStatus {
  const moodQuadrant = useAppStore((state) => state.moodQuadrant);
  const audit = useAppStore((state) => state.audit);

  // If no mood plotted yet, unknown
  if (!moodQuadrant) return 'Unknown';

  // Get audit proxy
  const proxyQuadrant = computeProxyQuadrant(audit);

  // If insufficient audit data, unknown
  if (!proxyQuadrant) return 'Unknown';

  // Compare
  if (moodQuadrant === proxyQuadrant) return 'Aligned';
  return 'Drift';
}

// Helper function to compute proxy quadrant (non-hook version)
function computeProxyQuadrant(audit: {
  hrv: 'Low' | 'OK' | 'High' | null;
  arousal: 'Spiky' | 'Steady' | null;
  movement: 'Still' | 'Active' | 'Exercising' | null;
}): MoodQuadrant {
  if (!audit.hrv && !audit.arousal && !audit.movement) {
    return null;
  }

  if (audit.arousal === 'Spiky' && audit.hrv === 'Low') {
    return 'Red';
  }

  if (audit.movement === 'Still' && audit.hrv === 'Low') {
    return 'Blue';
  }

  if ((audit.hrv === 'OK' || audit.hrv === 'High') && audit.arousal === 'Steady') {
    return 'Green';
  }

  if (audit.hrv === 'OK' && audit.arousal === 'Steady' && audit.movement === 'Active') {
    return 'Yellow';
  }

  if (audit.hrv === 'OK' || audit.hrv === 'High') {
    return 'Green';
  }

  return null;
}

// Check if any intensity-blocking lock is active
export function useHasBlockingLock(): boolean {
  const locks = useAppStore((state) => state.locks);
  return locks.kavacha || locks.nightmare || locks.neti || locks.serpent || locks.sleepEmergency;
}

// Get primary blocking lock for display
export function usePrimaryBlockingLock(): LockType | null {
  const locks = useAppStore((state) => state.locks);

  // Priority order
  if (locks.kavacha) return 'kavacha';
  if (locks.sleepEmergency) return 'sleepEmergency';
  if (locks.nightmare) return 'nightmare';
  if (locks.serpent) return 'serpent';
  if (locks.neti) return 'neti';
  if (locks.union) return 'union';

  return null;
}
