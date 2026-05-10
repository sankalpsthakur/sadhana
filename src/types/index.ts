// Phase and Mode types
export type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Mode =
  | 'Armor'     // Muladhara - Low vagal + high arousal
  | 'Rebuild'   // Svadhisthana - Low energy + low movement
  | 'Mirror'    // Svadhisthana - Stable but noisy sleep
  | 'Forge'     // Manipura - Elevated HR + resilient HRV
  | 'Bridge'    // Anahata - Coherence signatures
  | 'Signal'    // Vishuddha - Stable + low arousal
  | 'Void'      // Ajna - Stable + low arousal + high clarity
  | 'Conductor'; // Sahasrara - HV-eligible + no risk markers

export type Confidence = 'Verified' | 'Mixed' | 'Self-report';

export type StabilityBand = 'Unstable' | 'Settling' | 'Stable' | 'Radiant' | 'HV-Eligible';

export type MoodQuadrant = 'Red' | 'Blue' | 'Green' | 'Yellow' | null;

export type BodyZone =
  | 'Head' | 'Throat' | 'Chest' | 'Solar' | 'Belly'
  | 'Pelvis' | 'Hands' | 'Feet' | 'Jaw' | 'Back' | null;

export type SleepStatus = 'Protected' | 'AtRisk' | 'Unknown';

export type DriftStatus = 'Aligned' | 'Drift' | 'Unknown';

// Audit (sensor) data types
export type AuditValue = 'Low' | 'OK' | 'High' | null;
export type ArousalValue = 'Spiky' | 'Steady' | null;
export type MovementValue = 'Still' | 'Active' | 'Exercising' | null;
export type BreathValue = 'Coherent' | 'Erratic' | null;
export type TempValue = number | null; // deviation from baseline

export interface AuditData {
  hrv: AuditValue;
  arousal: ArousalValue;
  movement: MovementValue;
  breath: BreathValue;
  temp: TempValue;
}

// Safety locks
export interface SafetyLocks {
  kavacha: boolean;      // Red quadrant + overwhelm
  nightmare: boolean;    // 2 consecutive terror nights
  neti: boolean;         // Dissociation flag (72h cooldown)
  serpent: boolean;      // Kill-switch triggered (7d cooldown)
  union: boolean;        // Partner destabilized
  sleepEmergency: boolean; // 2-night crash pattern
}

export type LockType = keyof SafetyLocks;

// Mood coordinates for the mood meter
export interface MoodCoordinates {
  x: number; // -1 to 1 (energy axis: left=low, right=high)
  y: number; // -1 to 1 (pleasantness axis: bottom=low, top=high)
}

// Phase metadata
export interface PhaseInfo {
  id: Phase;
  name: string;
  obstacle: string;
  chakra: string;
  chakraLocation: string;
  description: string;
  promise: string;
}

// Tool card states
export type ToolState = 'Available' | 'LockedPhase' | 'LockedState' | 'Cooldown';

export interface Tool {
  id: string;
  name: string;
  duration: string;
  state: ToolState;
  cooldownRemaining?: string;
}
