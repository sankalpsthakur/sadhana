// TODO(deprecation): expo-av is being replaced by expo-audio + expo-video in
// Expo SDK 55. When we migrate to SDK 55, swap Audio.Sound + setAudioModeAsync
// for the new expo-audio API. expo-haptics + expo-speech are unaffected.
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

import { useSensoryStore } from '../store/sensoryStore';

/**
 * Sadhana sensory layer facade.
 *
 * Single import point for haptic + audio + TTS cues, with respect-settings
 * guards baked in. Screens should never import expo-haptics / expo-av /
 * expo-speech directly — go through this service so future settings or
 * accessibility changes only need to update one file.
 *
 * Cue mapping (per `feedback-design-wave-2026-05-18.md` §3.3):
 *   - SD1 (breath pacing)      -> breath()
 *   - SD2 (bell at start)      -> bell({ volume: 1.0 })
 *   - SD3 (bell at midpoint)   -> bell({ volume: 0.5 })
 *   - SD4 (bell at end)        -> bell() + successHaptic()
 *   - SD5 (voice guidance)     -> speak()
 *   - SD6 (journal warm save)  -> warmHaptic()
 *   - SD7 (streak milestone)   -> bell() + successHaptic() + speak()
 *   - SD8 (DeepWork timer end) -> warningHaptic()
 */

let bellSound: Audio.Sound | null = null;
let bellLoadingPromise: Promise<Audio.Sound> | null = null;
let didConfigureAudioSession = false;

// Test-observability counters. Incremented on every successful (gate-passed)
// invocation. Read by the XCUITest journey-acceptance suite via the
// `<View testID="sensory.counters" accessibilityLabel={JSON.stringify(...)} />`
// surface mounted in `App.tsx` under `__DEV__`. Production builds (where
// `__DEV__` is false) never render the surface, so this object is dead state.
export const sensoryCounters = {
  bell: 0,
  warm: 0,
  success: 0,
  warning: 0,
  speak: 0,
};

async function loadBell(): Promise<Audio.Sound> {
  if (bellSound) return bellSound;
  if (bellLoadingPromise) return bellLoadingPromise;

  bellLoadingPromise = (async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/meditation-bell.mp3'),
        { volume: 1.0 }
      );
      bellSound = sound;
      return sound;
    } finally {
      bellLoadingPromise = null;
    }
  })();

  return bellLoadingPromise;
}

export const SensoryService = {
  /**
   * Configure the AVAudioSession (iOS) / equivalent (Android) so meditation
   * bells play even when the silent switch is on, and TTS ducks other audio
   * cleanly (Spotify, Apple Music continue at lower volume).
   *
   * Call once at app boot from `App.tsx`. Safe to call multiple times — only
   * the first invocation hits the native bridge.
   */
  async configureAudioSession(): Promise<void> {
    if (didConfigureAudioSession) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
        staysActiveInBackground: false,
        allowsRecordingIOS: false,
      });
      didConfigureAudioSession = true;
    } catch (e) {
      if (__DEV__) {
        console.warn('[Sensory] audio session config failed', e);
      }
    }
  },

  /**
   * Play the meditation bell. Respects the user's "Practice bells" preference.
   *
   * @param volume - 0.0–1.0. SD2 (start) uses 1.0; SD3 (midpoint) uses 0.5.
   */
  async bell(volume: number = 1.0): Promise<void> {
    if (!useSensoryStore.getState().bellsEnabled) return;
    sensoryCounters.bell += 1;
    try {
      const sound = await loadBell();
      await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
      await sound.replayAsync();
    } catch (e) {
      if (__DEV__) {
        console.warn('[Sensory] bell failed', e);
      }
    }
  },

  /**
   * Breath-pacing haptic — one selectionAsync per breath cycle (SD1).
   * Respects "Breath haptics" preference. Fire-and-forget; never throws.
   */
  breath(): void {
    if (!useSensoryStore.getState().hapticsEnabled) return;
    // breath() not counted — it fires at ~6 Hz during a practice and would
    // dominate the counter telemetry. Add a separate `breath` counter only if
    // a future test needs it.
    Haptics.selectionAsync().catch(() => {
      // Swallow — haptic hardware unavailable on simulator or older devices.
    });
  },

  /**
   * Warm impact for journal-save and other "gentle confirmation" moments (SD6).
   * Respects "Breath haptics" preference (treated as the unified haptic gate).
   */
  warmHaptic(): void {
    if (!useSensoryStore.getState().hapticsEnabled) return;
    sensoryCounters.warm += 1;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
  },

  /**
   * Success notification haptic — practice completion, streak milestone (SD4, SD7).
   */
  successHaptic(): void {
    if (!useSensoryStore.getState().hapticsEnabled) return;
    sensoryCounters.success += 1;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },

  /**
   * Warning notification haptic — deep-work timer end (SD8 migration target).
   * Replaces the previous `Vibration.vibrate([0, 500, 200, 500])` pattern with
   * the platform-standard "warning" notification.
   */
  warningHaptic(): void {
    if (!useSensoryStore.getState().hapticsEnabled) return;
    sensoryCounters.warning += 1;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },

  /**
   * Text-to-speech for guided practice narration, streak announcements,
   * step-by-step instructions (SD5, SD7).
   *
   * Respects "Voice guidance" preference. Cancels any in-flight utterance
   * (Speech.stop() is synchronous-ish; the ~100ms session settle delay is
   * acceptable for sequenced narration via the onDone callback).
   */
  speak(text: string, opts?: Partial<Speech.SpeechOptions>): void {
    if (!useSensoryStore.getState().voiceEnabled) return;
    if (!text || !text.trim()) return;
    sensoryCounters.speak += 1;
    Speech.stop();
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.9,
      pitch: 1.0,
      ...opts,
    });
  },

  /**
   * Cancel any in-flight TTS — useful when navigating away from a guided
   * practice mid-narration.
   */
  stopSpeaking(): void {
    Speech.stop();
  },

  /**
   * Release the bell audio buffer. Call from app teardown / tests; routine
   * use doesn't require it (sound is reused across plays).
   */
  async unload(): Promise<void> {
    if (bellSound) {
      try {
        await bellSound.unloadAsync();
      } catch {
        // ignore — already unloaded
      }
      bellSound = null;
    }
  },
};
