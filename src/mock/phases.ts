import { Phase, PhaseInfo } from '../types';

export const phaseInfo: Record<Phase, PhaseInfo> = {
  0: {
    id: 0,
    name: 'Initiation',
    obstacle: 'Confusion',
    chakra: 'Grounding',
    chakraLocation: 'Base',
    description: 'Onboarding and baseline establishment',
    promise: 'Choose the gate you want to work with first.',
  },
  1: {
    id: 1,
    name: 'Fear',
    obstacle: 'Fear',
    chakra: 'Muladhara',
    chakraLocation: 'Pelvic floor',
    description: 'Meet fear by training the body to recognize safety again.',
    promise: 'Build steadiness, courage, and the ability to stay present under pressure.',
  },
  2: {
    id: 2,
    name: 'Guilt',
    obstacle: 'Guilt',
    chakra: 'Svadhisthana',
    chakraLocation: 'Sacrum',
    description: 'Soften guilt by letting stuck emotion move without drowning in it.',
    promise: 'Recover clean desire, softness, creativity, and emotional flow.',
  },
  3: {
    id: 3,
    name: 'Shame',
    obstacle: 'Shame',
    chakra: 'Manipura',
    chakraLocation: 'Solar plexus',
    description: 'Transmute shame by turning self-attack into disciplined agency.',
    promise: 'Reclaim will, action, and the right to take up space.',
  },
  4: {
    id: 4,
    name: 'Grief',
    obstacle: 'Grief',
    chakra: 'Anahata',
    chakraLocation: 'Heart',
    description: 'Let grief move through without closing the heart.',
    promise: 'Practice coherence, forgiveness, tenderness, and repair.',
  },
  5: {
    id: 5,
    name: 'Lies',
    obstacle: 'Lies',
    chakra: 'Vishuddha',
    chakraLocation: 'Throat',
    description: 'Release the leak into performance and false speech.',
    promise: 'Train truthful expression, clean boundaries, and signal over noise.',
  },
  6: {
    id: 6,
    name: 'Illusion',
    obstacle: 'Illusion',
    chakra: 'Ajna',
    chakraLocation: 'Third eye',
    description: 'See through illusion by separating perception from projection.',
    promise: 'Strengthen witness, insight, discernment, and pattern clarity.',
  },
  7: {
    id: 7,
    name: 'Attachment',
    obstacle: 'Attachment',
    chakra: 'Sahasrara',
    chakraLocation: 'Crown',
    description: 'Surrender grasping without abandoning devotion.',
    promise: 'Integrate service, surrender, spaciousness, and clean commitment.',
  },
};

export const phaseUnlockRequirements: Record<Phase, {
  stabilityRequired: number | null;
  durationDays: number;
  additionalRequirements: string[];
}> = {
  0: { stabilityRequired: null, durationDays: 0, additionalRequirements: ['Complete onboarding'] },
  1: { stabilityRequired: null, durationDays: 30, additionalRequirements: [] },
  2: { stabilityRequired: null, durationDays: 0, additionalRequirements: [] },
  3: { stabilityRequired: null, durationDays: 0, additionalRequirements: [] },
  4: { stabilityRequired: null, durationDays: 0, additionalRequirements: [] },
  5: { stabilityRequired: null, durationDays: 0, additionalRequirements: [] },
  6: { stabilityRequired: null, durationDays: 0, additionalRequirements: [] },
  7: { stabilityRequired: null, durationDays: 0, additionalRequirements: [] },
};
