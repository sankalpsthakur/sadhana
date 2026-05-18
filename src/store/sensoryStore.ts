import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { persistStorage } from './persistStorage';

/**
 * Per-app sensory preferences for Sadhana's haptic + audio + TTS layer.
 *
 * Defaults follow the spec:
 *   - Voice guidance: ON (core feature for guided practices)
 *   - Breath haptics: ON for guided + breathwork; user can opt out
 *   - Practice bells: ON for all timed practices
 *
 * SensoryService reads these via `useSensoryStore.getState()` per call —
 * avoid hooking inside hot loops (e.g. per-breath haptic) for performance.
 */
interface SensoryState {
  voiceEnabled: boolean;
  hapticsEnabled: boolean;
  bellsEnabled: boolean;
  setVoice: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  setBells: (v: boolean) => void;
  toggleVoice: () => void;
  toggleHaptics: () => void;
  toggleBells: () => void;
}

export const useSensoryStore = create<SensoryState>()(
  persist(
    (set) => ({
      voiceEnabled: true,
      hapticsEnabled: true,
      bellsEnabled: true,
      setVoice: (v) => set({ voiceEnabled: v }),
      setHaptics: (v) => set({ hapticsEnabled: v }),
      setBells: (v) => set({ bellsEnabled: v }),
      toggleVoice: () => set((s) => ({ voiceEnabled: !s.voiceEnabled })),
      toggleHaptics: () => set((s) => ({ hapticsEnabled: !s.hapticsEnabled })),
      toggleBells: () => set((s) => ({ bellsEnabled: !s.bellsEnabled })),
    }),
    {
      name: 'sadhana.sensory',
      storage: createJSONStorage(() => persistStorage),
    }
  )
);
