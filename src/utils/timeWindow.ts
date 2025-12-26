/**
 * Time Window Utilities
 * The circadian awareness engine for Sadhana's gamified learning system.
 *
 * The five windows create biological containers for different practices:
 * - BRAHMA: High-voltage window (cortisol rising, veil thin)
 * - MORNING: Activation phase (capture, intention, gentle ignition)
 * - DAY: Peak output (transmutation, missions, deep work)
 * - EVENING: Wind-down (return to baseline, process, close loops)
 * - NIGHT: Sleep protection (seal, no intensity)
 */

export type TimeWindow = 'BRAHMA' | 'MORNING' | 'DAY' | 'EVENING' | 'NIGHT';

export interface TimeContext {
  localTime: Date;
  window: TimeWindow;
  hour: number;
  minute: number;

  // Time-based calculations
  timeSinceWake: number | null;  // minutes since inferred wake
  timeSinceLastCheckin: number | null;

  // Learned patterns (7-day rolling average)
  typicalWakeTime: string;  // "07:15" format
  typicalSleepTime: string; // "22:30" format

  // Window boundaries for current time
  windowStart: string;
  windowEnd: string;
  minutesUntilNextWindow: number;
}

/**
 * Get the current time window based on hour
 *
 * Windows:
 * - BRAHMA: 4:00 - 6:00 (high voltage eligible)
 * - MORNING: 6:00 - 11:00 (activation)
 * - DAY: 11:00 - 17:00 (peak output)
 * - EVENING: 17:00 - 21:00 (wind down)
 * - NIGHT: 21:00 - 4:00 (sealed)
 */
export function getTimeWindow(date: Date = new Date()): TimeWindow {
  const hour = date.getHours();

  if (hour >= 4 && hour < 6) return 'BRAHMA';
  if (hour >= 6 && hour < 11) return 'MORNING';
  if (hour >= 11 && hour < 17) return 'DAY';
  if (hour >= 17 && hour < 21) return 'EVENING';
  return 'NIGHT'; // 21:00 - 3:59
}

/**
 * Get window boundaries as hour strings
 */
export function getWindowBoundaries(window: TimeWindow): { start: string; end: string } {
  const boundaries: Record<TimeWindow, { start: string; end: string }> = {
    BRAHMA: { start: '04:00', end: '06:00' },
    MORNING: { start: '06:00', end: '11:00' },
    DAY: { start: '11:00', end: '17:00' },
    EVENING: { start: '17:00', end: '21:00' },
    NIGHT: { start: '21:00', end: '04:00' },
  };
  return boundaries[window];
}

/**
 * Calculate minutes until the next window begins
 */
export function getMinutesUntilNextWindow(date: Date = new Date()): number {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const currentMinutes = hour * 60 + minute;

  // Window end times in minutes from midnight
  const windowEnds: number[] = [
    4 * 60,   // NIGHT ends at 4:00
    6 * 60,   // BRAHMA ends at 6:00
    11 * 60,  // MORNING ends at 11:00
    17 * 60,  // DAY ends at 17:00
    21 * 60,  // EVENING ends at 21:00
    28 * 60,  // NIGHT ends at 4:00 (next day, represented as 28:00)
  ];

  for (const endMinutes of windowEnds) {
    if (currentMinutes < endMinutes) {
      return endMinutes - currentMinutes;
    }
  }

  // Past 21:00, next window is at 4:00 tomorrow
  return (24 * 60 - currentMinutes) + (4 * 60);
}

/**
 * Check if we're in the dream capture window
 * Dream memory degrades rapidly - 3 hours from wake maximum
 */
export function isDreamWindowOpen(wakeTime: Date | null, now: Date = new Date()): boolean {
  if (!wakeTime) return false;

  const hoursSinceWake = (now.getTime() - wakeTime.getTime()) / (1000 * 60 * 60);
  if (hoursSinceWake < 0) return false;
  return hoursSinceWake <= 3;
}

/**
 * Check if we're in Brahma Muhurta (high-voltage eligible window)
 */
export function isBrahmaMuhurta(date: Date = new Date()): boolean {
  return getTimeWindow(date) === 'BRAHMA';
}

/**
 * Check if it's too late to start activating practices
 */
export function isTooLateForActivation(date: Date = new Date()): boolean {
  const window = getTimeWindow(date);
  return window === 'EVENING' || window === 'NIGHT';
}

/**
 * Get time-appropriate greeting
 */
export function getTimeGreeting(date: Date = new Date()): string {
  const window = getTimeWindow(date);

  switch (window) {
    case 'BRAHMA':
      return 'The veil is thin.';
    case 'MORNING':
      return 'Good morning.';
    case 'DAY':
      return 'Good afternoon.';
    case 'EVENING':
      return 'Good evening.';
    case 'NIGHT':
      return 'The day is sealed.';
  }
}

/**
 * Get practices blocked in current window
 */
export function getBlockedPractices(window: TimeWindow): string[] {
  switch (window) {
    case 'BRAHMA':
      return []; // Everything available for eligible users
    case 'MORNING':
      return ['serpent']; // Only in Brahma
    case 'DAY':
      return ['serpent', 'neti']; // High voltage only in Brahma
    case 'EVENING':
      return ['bellows', 'deep-work-new', 'neti', 'serpent', 'transmute'];
    case 'NIGHT':
      return ['bellows', 'deep-work', 'neti', 'serpent', 'transmute', 'mission', 'forge'];
  }
}

/**
 * Get practices available in current window
 */
export function getAvailablePractices(window: TimeWindow): string[] {
  switch (window) {
    case 'BRAHMA':
      return ['nyasa', 'serpent', 'neti', 'heavy-earth', 'coherence'];
    case 'MORNING':
      return ['dream-capture', 'heavy-earth', 'coherence', 'mission-select'];
    case 'DAY':
      return ['deep-work', 'mission', 'transmute', 'coherence', 'heavy-earth'];
    case 'EVENING':
      return ['coherence', 'humming', 'gentle-earth', 'journal', 'churn', 'dream-intention'];
    case 'NIGHT':
      return ['body-scan', '4-7-8-breath', 'legs-up-wall', 'seal'];
  }
}

/**
 * Format time remaining until window closes
 */
export function formatTimeRemaining(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Build full TimeContext object
 */
export function buildTimeContext(
  now: Date = new Date(),
  wakeTime: Date | null = null,
  lastCheckinTime: Date | null = null,
  typicalWakeTime: string = '07:00',
  typicalSleepTime: string = '22:30'
): TimeContext {
  const window = getTimeWindow(now);
  const boundaries = getWindowBoundaries(window);

  return {
    localTime: now,
    window,
    hour: now.getHours(),
    minute: now.getMinutes(),

    timeSinceWake: wakeTime
      ? Math.max(0, Math.floor((now.getTime() - wakeTime.getTime()) / (1000 * 60)))
      : null,

    timeSinceLastCheckin: lastCheckinTime
      ? Math.max(0, Math.floor((now.getTime() - lastCheckinTime.getTime()) / (1000 * 60)))
      : null,

    typicalWakeTime,
    typicalSleepTime,

    windowStart: boundaries.start,
    windowEnd: boundaries.end,
    minutesUntilNextWindow: getMinutesUntilNextWindow(now),
  };
}
