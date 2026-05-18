import type { GroundingMode } from '../components/shared/GroundingModal';

/**
 * Mapping from practice id → guided modal experience.
 *
 * `comingSoon` means we don't have a real guided flow yet and we'll show
 * an honest "coming soon" sheet instead of silently logging the practice.
 * Bias guidance from the build plan: when the practice purpose vaguely
 * matches one of the three available modal types (breath / bodyscan /
 * grounding), use the closest fit. Pure writing or block-timer practices
 * (Dream Capture, Shadow Dex, Churn, Mission Engine, Deep Work) deserve
 * their own UI later — pretending to guide them with a breath modal feels
 * more broken than admitting we're working on it.
 */
export type PracticeModalKind = GroundingMode | 'comingSoon';

export const practiceModalMap: Record<string, PracticeModalKind> = {
  // Grounding-flavored somatic practices → 5-4-3-2-1 senses sequence.
  'heavy-earth': 'grounding',
  'gentle-warmth': 'grounding',

  // Body Scan is exactly the bodyscan flow.
  'body-scan': 'bodyscan',

  // Breath practices → 4-4-6 cycle. Bellows Breath isn't 4-4-6 but the
  // generic breath modal is closer than nothing, and the user can stop early.
  'coherence-breath': 'breath',
  'humming-drone': 'breath',
  'bellows-breath': 'breath',

  // Sleep Shield is a downshift body scan in spirit.
  'sleep-shield': 'bodyscan',
  // Emergency Downshift already works via NightMode/EmergencyFooter, but if a
  // user lands on it via the Practice screen we hand them the same bodyscan.
  'emergency-downshift': 'bodyscan',

  // Writing / timer / advanced practices need real UI — be honest.
  'dream-capture': 'comingSoon',
  'shadow-dex': 'comingSoon',
  'churn': 'comingSoon',
  'mission-engine': 'comingSoon',
  'deep-work': 'comingSoon',
  'silence-seal': 'comingSoon',
  'neti-slicing': 'comingSoon',
  'serpent-rise': 'comingSoon',
};

export function getPracticeModalKind(practiceId: string): PracticeModalKind {
  return practiceModalMap[practiceId] ?? 'comingSoon';
}
