import { Phase, Mode, MoodQuadrant } from '../types';

export type TimeWindow = 'brahma' | 'morning' | 'day' | 'evening' | 'night';

export interface Practice {
  id: string;
  name: string;
  duration: string;
  durationMinutes: number;
  description: string;
  purpose: string;
  minPhase: Phase;
  minStability?: number;
  timeWindows: TimeWindow[] | 'all';
  recommendedModes: Mode[] | 'all';
  recommendedQuadrants: MoodQuadrant[];
  icon: string;
  category: 'grounding' | 'breath' | 'depth' | 'output' | 'recovery' | 'advanced';
}

// Master practice catalog from PRD Section 7
export const practiceLibrary: Practice[] = [
  // Grounding Practices (always available)
  {
    id: 'heavy-earth',
    name: 'Heavy Earth',
    duration: '3-5 min',
    durationMinutes: 4,
    description: 'Grounding practice for overwhelm',
    purpose: 'Reduce high arousal, return to baseline',
    minPhase: 0,
    timeWindows: 'all',
    recommendedModes: ['Armor', 'Rebuild'],
    recommendedQuadrants: ['Red', 'Blue'],
    icon: '🪨',
    category: 'grounding',
  },
  {
    id: 'gentle-warmth',
    name: 'Gentle Warmth',
    duration: '5 min',
    durationMinutes: 5,
    description: 'Restore energy from low state',
    purpose: 'Warmth, rest, sleep protection',
    minPhase: 0,
    timeWindows: 'all',
    recommendedModes: ['Rebuild'],
    recommendedQuadrants: ['Blue'],
    icon: '☀️',
    category: 'grounding',
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    duration: '5 min',
    durationMinutes: 5,
    description: 'Somatic awareness practice',
    purpose: 'Establish baseline, capture body state',
    minPhase: 0,
    timeWindows: 'all',
    recommendedModes: 'all',
    recommendedQuadrants: ['Green', 'Blue', 'Yellow', 'Red'],
    icon: '🧘',
    category: 'grounding',
  },

  // Breath Practices
  {
    id: 'coherence-breath',
    name: 'Coherence Breath',
    duration: '5 min',
    durationMinutes: 5,
    description: 'Return to baseline, vagal tone',
    purpose: 'Heart coherence, parasympathetic activation',
    minPhase: 1,
    timeWindows: ['day', 'evening'],
    recommendedModes: ['Bridge', 'Mirror'],
    recommendedQuadrants: ['Yellow', 'Green'],
    icon: '💨',
    category: 'breath',
  },
  {
    id: 'humming-drone',
    name: 'Humming / Drone',
    duration: '3 min',
    durationMinutes: 3,
    description: 'Vagal toning downshift',
    purpose: 'Evening downshift, NOT for activation',
    minPhase: 1,
    timeWindows: ['evening', 'night'],
    recommendedModes: ['Signal', 'Bridge'],
    recommendedQuadrants: ['Yellow', 'Green'],
    icon: '🎵',
    category: 'breath',
  },
  {
    id: 'bellows-breath',
    name: 'Bellows Breath',
    duration: '90s',
    durationMinutes: 2,
    description: 'Activation for transmutation',
    purpose: 'Energize before deep work',
    minPhase: 3,
    timeWindows: ['morning', 'day'],
    recommendedModes: ['Forge'],
    recommendedQuadrants: ['Yellow'],
    icon: '🔥',
    category: 'breath',
  },

  // Depth Practices
  {
    id: 'dream-capture',
    name: 'Dream Capture',
    duration: '≤60s',
    durationMinutes: 1,
    description: 'Morning dream logging',
    purpose: 'Capture dreams, symbols, patterns',
    minPhase: 2,
    timeWindows: ['morning'],
    recommendedModes: ['Mirror'],
    recommendedQuadrants: ['Green', 'Blue', 'Yellow'],
    icon: '🌙',
    category: 'depth',
  },
  {
    id: 'shadow-dex',
    name: 'Shadow Dex',
    duration: '1-2 min',
    durationMinutes: 2,
    description: 'Name patterns and complexes',
    purpose: 'Pattern recognition, shadow work',
    minPhase: 2,
    timeWindows: ['day', 'evening'],
    recommendedModes: ['Mirror', 'Signal'],
    recommendedQuadrants: ['Green', 'Yellow'],
    icon: '👤',
    category: 'depth',
  },
  {
    id: 'churn',
    name: 'Churn (Burn)',
    duration: '3 min',
    durationMinutes: 3,
    description: 'Discharge, text discarded',
    purpose: 'Release before sleep, no backspace',
    minPhase: 2,
    timeWindows: ['evening', 'night'],
    recommendedModes: ['Armor', 'Rebuild', 'Mirror'],
    recommendedQuadrants: ['Red', 'Blue', 'Yellow'],
    icon: '🔄',
    category: 'depth',
  },

  // Output Practices
  {
    id: 'mission-engine',
    name: 'Mission Engine',
    duration: '30s + exec',
    durationMinutes: 1,
    description: 'Daily behavioral mission',
    purpose: 'Select and track daily mission',
    minPhase: 3,
    timeWindows: ['morning', 'day'],
    recommendedModes: ['Forge', 'Bridge'],
    recommendedQuadrants: ['Yellow', 'Green'],
    icon: '🎯',
    category: 'output',
  },
  {
    id: 'deep-work',
    name: 'Deep Work',
    duration: '25 min',
    durationMinutes: 25,
    description: 'Focused output block',
    purpose: 'Transmutation into creation',
    minPhase: 3,
    timeWindows: ['day'],
    recommendedModes: ['Forge'],
    recommendedQuadrants: ['Yellow'],
    icon: '⚡',
    category: 'output',
  },

  // Recovery Practices
  {
    id: 'sleep-shield',
    name: 'Sleep Shield',
    duration: '5-10 min',
    durationMinutes: 7,
    description: 'Late-night downshift',
    purpose: 'Protect sleep when Red/Blue at seal',
    minPhase: 1,
    timeWindows: ['night'],
    recommendedModes: ['Armor', 'Rebuild'],
    recommendedQuadrants: ['Red', 'Blue'],
    icon: '🛡️',
    category: 'recovery',
  },
  {
    id: 'emergency-downshift',
    name: 'Emergency Downshift',
    duration: '1-3 min',
    durationMinutes: 2,
    description: 'Acute safety override',
    purpose: 'Panic, overwhelm, voltage spikes',
    minPhase: 0,
    timeWindows: 'all',
    recommendedModes: 'all',
    recommendedQuadrants: ['Red'],
    icon: '🆘',
    category: 'recovery',
  },

  // Advanced Practices
  {
    id: 'silence-seal',
    name: 'Silence Seal',
    duration: '4 hours',
    durationMinutes: 240,
    description: 'Speech fast, expression hygiene',
    purpose: 'Clean expression, can break without penalty',
    minPhase: 5,
    minStability: 80,
    timeWindows: ['morning', 'day'],
    recommendedModes: ['Signal'],
    recommendedQuadrants: ['Green'],
    icon: '🤫',
    category: 'advanced',
  },
  {
    id: 'neti-slicing',
    name: 'Neti (Slicing)',
    duration: '5-7 min',
    durationMinutes: 6,
    description: 'Witness work, dissolution',
    purpose: 'Uncoupling from identification',
    minPhase: 6,
    minStability: 85,
    timeWindows: ['brahma'],
    recommendedModes: ['Void'],
    recommendedQuadrants: ['Green'],
    icon: '🔮',
    category: 'advanced',
  },
  {
    id: 'serpent-rise',
    name: 'Serpent (Sushumna)',
    duration: '6-12 min',
    durationMinutes: 9,
    description: 'High-voltage union work',
    purpose: 'Full channel activation with kill-switch',
    minPhase: 7,
    minStability: 90,
    timeWindows: ['brahma'],
    recommendedModes: ['Conductor'],
    recommendedQuadrants: ['Green'],
    icon: '🐍',
    category: 'advanced',
  },
];

// Get current time window
export function getCurrentTimeWindow(): TimeWindow {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 6) return 'brahma';
  if (hour >= 6 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// Check if practice is available in current time window
export function isPracticeAvailableNow(practice: Practice): boolean {
  if (practice.timeWindows === 'all') return true;
  return practice.timeWindows.includes(getCurrentTimeWindow());
}

// Get practices filtered by phase, stability, and optionally mode/quadrant
export function getAvailablePractices(
  phase: Phase,
  stability: number,
  mode?: Mode,
  quadrant?: MoodQuadrant
): Practice[] {
  return practiceLibrary.filter((p) => {
    // Stability check
    if (p.minStability && stability < p.minStability) return false;

    // Time window check
    if (!isPracticeAvailableNow(p)) return false;

    return true;
  });
}

// Get recommended practices for current state
export function getRecommendedPractices(
  phase: Phase,
  stability: number,
  mode: Mode,
  quadrant: MoodQuadrant
): Practice[] {
  return getAvailablePractices(phase, stability).filter((p) => {
    // Mode affinity
    const modeMatch = p.recommendedModes === 'all' || p.recommendedModes.includes(mode);

    // Quadrant affinity
    const quadrantMatch = !quadrant || p.recommendedQuadrants.includes(quadrant);

    return modeMatch && quadrantMatch;
  });
}

// Get practices locked by phase
export function getLockedPractices(phase: Phase): Practice[] {
  return [];
}

// Get practices locked by time window
export function getTimeBlockedPractices(phase: Phase, stability: number): Practice[] {
  return practiceLibrary.filter((p) => {
    if (p.minStability && stability < p.minStability) return false;
    return !isPracticeAvailableNow(p);
  });
}

// Get practice by ID
export function getPracticeById(id: string): Practice | undefined {
  return practiceLibrary.find((p) => p.id === id);
}

// Time window labels
export const timeWindowLabels: Record<TimeWindow, string> = {
  brahma: 'Brahma Muhurta (4-6 AM)',
  morning: 'Morning (6-11 AM)',
  day: 'Day (11 AM-5 PM)',
  evening: 'Evening (5-9 PM)',
  night: 'Night (9 PM-4 AM)',
};
