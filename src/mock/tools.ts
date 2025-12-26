import { Phase, Mode, Tool } from '../types';

export interface ToolConfig {
  id: string;
  name: string;
  duration: string;
  description: string;
  minPhase: Phase;
  modes: Mode[] | 'all';
}

// Master tool library
export const toolLibrary: ToolConfig[] = [
  // Phase 1 tools
  {
    id: 'heavy-earth',
    name: 'Heavy Earth',
    duration: '3:00',
    description: 'Grounding practice for overwhelm',
    minPhase: 1,
    modes: ['Armor'],
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    duration: '5:00',
    description: 'Somatic awareness practice',
    minPhase: 1,
    modes: 'all',
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    duration: '4:00',
    description: 'Nervous system regulation',
    minPhase: 1,
    modes: ['Armor', 'Rebuild'],
  },
  {
    id: 'seal-protocol',
    name: 'Seal Protocol',
    duration: '2:00',
    description: 'Sleep protection routine',
    minPhase: 1,
    modes: ['Signal'],
  },

  // Phase 2 tools
  {
    id: 'dream-capture',
    name: 'Dream Capture',
    duration: '5:00',
    description: 'Morning dream journaling',
    minPhase: 2,
    modes: ['Mirror'],
  },
  {
    id: 'gentle-warmth',
    name: 'Gentle Warmth',
    duration: '7:00',
    description: 'Sacral restoration practice',
    minPhase: 2,
    modes: ['Rebuild'],
  },
  {
    id: 'water-breath',
    name: 'Water Breath',
    duration: '6:00',
    description: 'Flowing breath pattern',
    minPhase: 2,
    modes: ['Rebuild', 'Mirror'],
  },

  // Phase 3 tools
  {
    id: 'mission-forge',
    name: 'Mission Forge',
    duration: '15:00',
    description: 'Deep work with intention',
    minPhase: 3,
    modes: ['Forge'],
  },
  {
    id: 'fire-breath',
    name: 'Fire Breath',
    duration: '5:00',
    description: 'Energizing breath work',
    minPhase: 3,
    modes: ['Forge'],
  },
  {
    id: 'transmute',
    name: 'Transmute',
    duration: '8:00',
    description: 'Channel intensity into creation',
    minPhase: 3,
    modes: ['Forge'],
  },

  // Phase 4 tools
  {
    id: 'resonant-breathing',
    name: 'Resonant Breathing',
    duration: '10:00',
    description: 'Heart coherence practice',
    minPhase: 4,
    modes: ['Bridge'],
  },
  {
    id: 'dyad-connect',
    name: 'Dyad Connect',
    duration: '20:00',
    description: 'Partner coherence session',
    minPhase: 4,
    modes: ['Bridge'],
  },

  // Phase 5 tools
  {
    id: 'silence-seal',
    name: 'Silence Seal',
    duration: '15:00',
    description: 'Deep silence practice',
    minPhase: 5,
    modes: ['Signal'],
  },
  {
    id: 'truth-speak',
    name: 'Truth Speak',
    duration: '10:00',
    description: 'Authentic expression practice',
    minPhase: 5,
    modes: ['Signal'],
  },

  // Phase 6 tools
  {
    id: 'neti-protocol',
    name: 'Neti Protocol',
    duration: '20:00',
    description: 'Witness consciousness practice',
    minPhase: 6,
    modes: ['Void'],
  },
  {
    id: 'dark-room',
    name: 'Dark Room',
    duration: '30:00',
    description: 'Sensory withdrawal practice',
    minPhase: 6,
    modes: ['Void'],
  },

  // Phase 7 tools
  {
    id: 'sushumna-rise',
    name: 'Sushumna Rise',
    duration: '25:00',
    description: 'Full channel activation',
    minPhase: 7,
    modes: ['Conductor'],
  },
  {
    id: 'union-seal',
    name: 'Union Seal',
    duration: '15:00',
    description: 'Integration and service',
    minPhase: 7,
    modes: ['Conductor'],
  },
];

// Get tools available for a given phase and mode
export function getAvailableTools(phase: Phase, mode: Mode): Tool[] {
  return toolLibrary
    .filter((tool) => {
      const phaseOk = tool.minPhase <= phase;
      const modeOk = tool.modes === 'all' || tool.modes.includes(mode);
      return phaseOk && modeOk;
    })
    .map((tool) => ({
      id: tool.id,
      name: tool.name,
      duration: tool.duration,
      state: 'Available' as const,
    }));
}

// Get primary practice for current mode
export function getPrimaryPractice(mode: Mode, phase: Phase): ToolConfig | null {
  const modeTools = toolLibrary.filter(
    (tool) => tool.minPhase <= phase && (tool.modes === 'all' || tool.modes.includes(mode))
  );

  // Return the first tool that matches the mode specifically
  const primaryTool = modeTools.find(
    (tool) => tool.modes !== 'all' && tool.modes.includes(mode)
  );

  return primaryTool || modeTools[0] || null;
}
