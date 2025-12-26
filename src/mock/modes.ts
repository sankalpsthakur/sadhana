import { Mode } from '../types';

export interface ModeInfo {
  id: Mode;
  chakra: string;
  auditCondition: string;
  primaryPractice: string;
  description: string;
}

export const modeInfo: Record<Mode, ModeInfo> = {
  Armor: {
    id: 'Armor',
    chakra: 'Muladhara',
    auditCondition: 'Low vagal tone + high arousal',
    primaryPractice: 'Heavy Earth',
    description: 'Protective grounding when overwhelmed',
  },
  Rebuild: {
    id: 'Rebuild',
    chakra: 'Svadhisthana',
    auditCondition: 'Low energy + low movement + low resilience',
    primaryPractice: 'Gentle Warmth',
    description: 'Gentle restoration when depleted',
  },
  Mirror: {
    id: 'Mirror',
    chakra: 'Svadhisthana',
    auditCondition: 'Stable but noisy (sleep irregularity)',
    primaryPractice: 'Dream Capture',
    description: 'Morning reflection and dream work',
  },
  Forge: {
    id: 'Forge',
    chakra: 'Manipura',
    auditCondition: 'Elevated HR + resilient HRV',
    primaryPractice: 'Mission + Deep Work',
    description: 'Channel fire into purposeful action',
  },
  Bridge: {
    id: 'Bridge',
    chakra: 'Anahata',
    auditCondition: 'Coherence signatures (stable HRV)',
    primaryPractice: 'Resonant Breathing',
    description: 'Heart coherence and connection',
  },
  Signal: {
    id: 'Signal',
    chakra: 'Vishuddha',
    auditCondition: 'Stable + low arousal',
    primaryPractice: 'Silence Seal',
    description: 'Clear communication and truth',
  },
  Void: {
    id: 'Void',
    chakra: 'Ajna',
    auditCondition: 'Stable + low arousal + high clarity',
    primaryPractice: 'Neti Protocol',
    description: 'Witness state and perception shift',
  },
  Conductor: {
    id: 'Conductor',
    chakra: 'Sahasrara',
    auditCondition: 'HV-eligible + no risk markers',
    primaryPractice: 'Sushumna Rise',
    description: 'Full integration and ecstatic conduction',
  },
};

// Mode selection based on time of day (fallback when no sensor data)
export type TimeOfDay = 'morning' | 'day' | 'night';

export function getDefaultModeForTime(timeOfDay: TimeOfDay, phaseUnlocked: number): Mode {
  switch (timeOfDay) {
    case 'morning':
      return phaseUnlocked >= 2 ? 'Mirror' : 'Armor';
    case 'day':
      return 'Forge';
    case 'night':
      return 'Signal'; // Seal mode
    default:
      return 'Mirror';
  }
}

// Get current time of day
export function getCurrentTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 21) return 'day';
  return 'night';
}
