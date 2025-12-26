/**
 * Flow Coordinator
 * The decision engine for Sadhana's gamified learning system.
 *
 * This IS the game engine. It decides what's available, when, based on:
 * 1. Time window (hard gates)
 * 2. Phase (feature availability)
 * 3. Mode (current biological state)
 * 4. State color (grounding vs activation)
 * 5. Eligibility (HV, stability thresholds)
 * 6. Daily cycle progress (what's been done today)
 *
 * The coordinator feels like a wise teacher who knows exactly what
 * lesson you're ready for, presented at exactly the right moment.
 */

import { Phase, Mode, MoodQuadrant, StabilityBand } from '../types';
import { DailyCycle } from '../types/dailyCycle';
import {
  TimeWindow,
  getTimeWindow,
  isDreamWindowOpen,
  isBrahmaMuhurta,
  getBlockedPractices,
  buildTimeContext,
  TimeContext,
} from './timeWindow';
import { getStabilityBand } from '../store/selectors';

// Flow types that can take over the screen
export type ActiveFlow =
  | 'morning-checkin'
  | 'dream-capture'
  | 'mission-select'
  | 'deep-work-preflight'
  | 'deep-work-active'
  | 'evening-notice'
  | 'evening-alert'
  | 'seal-flow'
  | 'night-mode'
  | 'brahma-prompt'
  | null;

// Cards that can appear on home screen
export type FlowCard =
  | 'morning-checkin-prompt'
  | 'dream-capture-prompt'
  | 'mission-reminder'
  | 'deep-work-nudge'
  | 'evening-wind-down'
  | 'seal-reminder'
  | 'dyad-status'
  | 'brahma-available';

// Blocked practice with reason
export interface BlockedPractice {
  practiceId: string;
  reason: string;
}

// Full coordinator output
export interface FlowDecision {
  // What flow (if any) should take over the screen
  activeFlow: ActiveFlow;

  // Priority cards to show on home
  flowCards: FlowCard[];

  // What practices are blocked right now
  blockedPractices: BlockedPractice[];

  // Contextual data
  timeContext: TimeContext;
  isNightMode: boolean;
  canStartDeepWork: boolean;
  canCaptureDream: boolean;
  shouldShowSealReminder: boolean;
}

export interface CoordinatorInput {
  // User state
  phase: Phase;
  mode: Mode;
  stability: number;
  moodQuadrant: MoodQuadrant;
  hasBlockingLock: boolean;
  hasDreamLock: boolean;

  // Daily cycle
  dailyCycle: DailyCycle;

  // Time
  now?: Date;
}

/**
 * The main coordinator function
 * Priority order preserves safety over productivity over engagement
 */
export function coordinateFlow(input: CoordinatorInput): FlowDecision {
  const now = input.now || new Date();
  const window = getTimeWindow(now);
  const band = getStabilityBand(input.stability);

  const timeContext = buildTimeContext(
    now,
    input.dailyCycle.wakeTimeInferred,
    input.dailyCycle.morningCheckinAt
  );

  // Collect flow cards
  const flowCards: FlowCard[] = [];
  const blockedPractices: BlockedPractice[] = [];

  // Get time-based blocks
  const timeBlocked = getBlockedPractices(window);
  timeBlocked.forEach((p) => {
    blockedPractices.push({
      practiceId: p,
      reason: `Not available during ${window.toLowerCase()} window`,
    });
  });

  // Check for active flow takeovers (priority order)
  let activeFlow: ActiveFlow = null;

  // 1. Night Mode is absolute
  if (input.dailyCycle.nightModeActiveAt) {
    return {
      activeFlow: 'night-mode',
      flowCards: [],
      blockedPractices: getAllBlockedForNight(),
      timeContext,
      isNightMode: true,
      canStartDeepWork: false,
      canCaptureDream: false,
      shouldShowSealReminder: false,
    };
  }

  // 2. Morning check-in is non-negotiable
  if (needsMorningCheckin(input.dailyCycle, window, now)) {
    activeFlow = 'morning-checkin';
    flowCards.push('morning-checkin-prompt');
  }

  // 3. Brahma Muhurta HV prompt (Phase 6+, eligible)
  if (
    !activeFlow &&
    isBrahmaMuhurta(now) &&
    input.phase >= 6 &&
    isHVEligible(input.stability, band) &&
    !input.hasBlockingLock
  ) {
    flowCards.push('brahma-available');
    // Don't force activeFlow - user can choose
  }

  // 4. Dream capture window (Phase 2+)
  const canCaptureDream =
    input.phase >= 2 &&
    isDreamWindowOpen(input.dailyCycle.wakeTimeInferred, now) &&
    !input.dailyCycle.dreamCaptured &&
    input.dailyCycle.morningCheckinAt !== null &&
    !input.hasDreamLock;

  if (canCaptureDream) {
    flowCards.push('dream-capture-prompt');
  }

  // 5. Mission selection (Phase 3+, morning, yellow)
  if (
    !activeFlow &&
    window === 'MORNING' &&
    input.phase >= 3 &&
    input.moodQuadrant === 'Yellow' &&
    !input.dailyCycle.mission &&
    input.dailyCycle.morningCheckinAt !== null
  ) {
    flowCards.push('mission-reminder');
  }

  // 6. Deep work nudge (Day window, Phase 3+, Yellow, stable)
  const canStartDeepWork =
    window === 'DAY' &&
    input.phase >= 3 &&
    input.moodQuadrant === 'Yellow' &&
    input.stability >= 70 &&
    !input.hasBlockingLock &&
    input.dailyCycle.morningCheckinAt !== null;

  if (canStartDeepWork && !hasActiveDeepWork(input.dailyCycle)) {
    flowCards.push('deep-work-nudge');
  }

  // 7. Dyad status (Phase 4+, morning)
  if (input.phase >= 4 && window === 'MORNING' && !input.dailyCycle.dyadCheckinDone) {
    flowCards.push('dyad-status');
  }

  // 8. Evening enforcement
  if (window === 'EVENING') {
    if (input.moodQuadrant === 'Yellow' && !activeFlow) {
      flowCards.push('evening-wind-down');
    } else if (
      input.moodQuadrant === 'Red' &&
      !activeFlow &&
      !input.dailyCycle.eveningAlertResolvedAt
    ) {
      activeFlow = 'evening-alert';
    }
  }

  // 9. Mission reminder if active
  if (
    input.dailyCycle.mission?.status === 'active' &&
    (window === 'DAY' || window === 'EVENING')
  ) {
    flowCards.push('mission-reminder');
  }

  // 10. Seal reminder
  const shouldShowSealReminder =
    !input.dailyCycle.sealedAt &&
    (window === 'EVENING' || window === 'NIGHT') &&
    isNearTypicalSleep(now, input.dailyCycle);

  if (shouldShowSealReminder) {
    flowCards.push('seal-reminder');
  }

  // Add phase-gated blocks
  if (input.phase < 2) {
    blockedPractices.push({ practiceId: 'dream-capture', reason: 'Unlocks at Phase 2' });
  }
  if (input.phase < 3) {
    blockedPractices.push({ practiceId: 'deep-work', reason: 'Unlocks at Phase 3' });
    blockedPractices.push({ practiceId: 'mission', reason: 'Unlocks at Phase 3' });
  }
  if (input.phase < 6) {
    blockedPractices.push({ practiceId: 'neti', reason: 'Unlocks at Phase 6' });
  }
  if (input.phase < 7) {
    blockedPractices.push({ practiceId: 'serpent', reason: 'Unlocks at Phase 7' });
  }

  // Add stability blocks
  if (input.stability < 70) {
    blockedPractices.push({
      practiceId: 'deep-work',
      reason: 'Requires stability ≥ 70',
    });
  }
  if (input.stability < 85) {
    blockedPractices.push({ practiceId: 'neti', reason: 'Requires stability ≥ 85' });
  }
  if (input.stability < 90) {
    blockedPractices.push({ practiceId: 'serpent', reason: 'Requires stability ≥ 90' });
  }

  return {
    activeFlow,
    flowCards: [...new Set(flowCards)], // dedupe
    blockedPractices,
    timeContext,
    isNightMode: false,
    canStartDeepWork,
    canCaptureDream,
    shouldShowSealReminder,
  };
}

// Helper: Check if morning checkin is needed
function needsMorningCheckin(
  cycle: DailyCycle,
  window: TimeWindow,
  now: Date
): boolean {
  // Already done today
  if (cycle.morningCheckinAt) return false;

  // Only prompt during wake hours
  if (window === 'NIGHT' && now.getHours() >= 21) return false;

  // We inferred wake but haven't checked in
  if (cycle.wakeTimeInferred) return true;

  // First app open of day during morning/brahma
  if (window === 'BRAHMA' || window === 'MORNING') return true;

  return false;
}

// Helper: Check HV eligibility
function isHVEligible(stability: number, band: StabilityBand): boolean {
  return stability >= 90 && band === 'HV-Eligible';
}

// Helper: Check for active deep work session
function hasActiveDeepWork(cycle: DailyCycle): boolean {
  return cycle.deepWorkSessions.some((s) => !s.completedAt);
}

// Helper: Check if near typical sleep time
function isNearTypicalSleep(now: Date, cycle: DailyCycle): boolean {
  // Simple check: after 8 PM
  return now.getHours() >= 20;
}

// Helper: All practices blocked during night mode
function getAllBlockedForNight(): BlockedPractice[] {
  return [
    { practiceId: 'deep-work', reason: 'Night mode active' },
    { practiceId: 'mission', reason: 'Night mode active' },
    { practiceId: 'transmute', reason: 'Night mode active' },
    { practiceId: 'bellows', reason: 'Night mode active' },
    { practiceId: 'forge', reason: 'Night mode active' },
    { practiceId: 'neti', reason: 'Night mode active' },
    { practiceId: 'serpent', reason: 'Night mode active' },
  ];
}

/**
 * Hook-friendly version that can be used in components
 */
export function useFlowDecision(input: CoordinatorInput): FlowDecision {
  return coordinateFlow(input);
}
