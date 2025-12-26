import { Phase, PhaseInfo } from '../types';

export const phaseInfo: Record<Phase, PhaseInfo> = {
  0: {
    id: 0,
    name: 'Initiation',
    chakra: 'Grounding',
    chakraLocation: 'Base',
    description: 'Onboarding and baseline establishment',
  },
  1: {
    id: 1,
    name: 'Foundation',
    chakra: 'Muladhara',
    chakraLocation: 'Pelvic floor',
    description: 'Survival, Grounding, Stability',
  },
  2: {
    id: 2,
    name: 'Flow',
    chakra: 'Svadhisthana',
    chakraLocation: 'Sacrum',
    description: 'Subconscious, Creativity, Emotions',
  },
  3: {
    id: 3,
    name: 'Fire',
    chakra: 'Manipura',
    chakraLocation: 'Solar plexus',
    description: 'Agency, Will, Transformation',
  },
  4: {
    id: 4,
    name: 'Resonance',
    chakra: 'Anahata',
    chakraLocation: 'Heart',
    description: 'Coherence, Connection, Love',
  },
  5: {
    id: 5,
    name: 'Expression',
    chakra: 'Vishuddha',
    chakraLocation: 'Throat',
    description: 'Truth, Communication, Authenticity',
  },
  6: {
    id: 6,
    name: 'Vision',
    chakra: 'Ajna',
    chakraLocation: 'Third eye',
    description: 'Witness, Insight, Perception',
  },
  7: {
    id: 7,
    name: 'Union',
    chakra: 'Sahasrara',
    chakraLocation: 'Crown',
    description: 'Integration, Ecstasy, Service',
  },
};

export const phaseUnlockRequirements: Record<Phase, {
  stabilityRequired: number | null;
  durationDays: number;
  additionalRequirements: string[];
}> = {
  0: { stabilityRequired: null, durationDays: 3, additionalRequirements: ['Complete onboarding'] },
  1: { stabilityRequired: null, durationDays: 30, additionalRequirements: [] },
  2: { stabilityRequired: 70, durationDays: 14, additionalRequirements: ['No 2-night sleep crash'] },
  3: { stabilityRequired: 70, durationDays: 0, additionalRequirements: ['Phase 2 complete'] },
  4: { stabilityRequired: 75, durationDays: 0, additionalRequirements: ['7 missions complete'] },
  5: { stabilityRequired: 80, durationDays: 0, additionalRequirements: ['5 Dyad sessions'] },
  6: { stabilityRequired: 85, durationDays: 30, additionalRequirements: ['Clean dissociation checks'] },
  7: { stabilityRequired: 90, durationDays: 30, additionalRequirements: ['Master Lock requirements'] },
};
