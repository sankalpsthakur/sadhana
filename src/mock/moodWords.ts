import { MoodQuadrant } from '../types';

export const moodWordsByQuadrant: Record<Exclude<MoodQuadrant, null>, string[]> = {
  Red: [
    'anxious',
    'irritated',
    'overloaded',
    'restless',
    'pressed',
    'agitated',
    'panicked',
    'enraged',
  ],
  Yellow: [
    'motivated',
    'focused',
    'charged',
    'inspired',
    'confident',
    'bright',
    'playful',
    'driven',
  ],
  Blue: [
    'tired',
    'heavy',
    'numb',
    'sad',
    'foggy',
    'lonely',
    'spent',
    'flat',
  ],
  Green: [
    'calm',
    'steady',
    'clear',
    'content',
    'grounded',
    'open',
    'safe',
    'present',
  ],
};

