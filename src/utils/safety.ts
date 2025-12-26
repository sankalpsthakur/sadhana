import { BodyZone, MoodQuadrant } from '../types';

const OVERWHELM_WORDS = new Set([
  'overloaded',
  'panicked',
  'agitated',
  'enraged',
  'pressed',
]);

const OVERWHELM_ZONES = new Set<Exclude<BodyZone, null>>([
  'Chest',
  'Solar',
  'Belly',
  'Jaw',
]);

export function shouldTriggerKavacha(
  quadrant: MoodQuadrant,
  moodWord: string | null,
  bodyZone: BodyZone
): boolean {
  if (quadrant !== 'Red') return false;
  if (moodWord && OVERWHELM_WORDS.has(moodWord)) return true;
  if (bodyZone && OVERWHELM_ZONES.has(bodyZone)) return true;
  return false;
}
