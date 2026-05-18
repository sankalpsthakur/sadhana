// Bridge to NSUserDefaults-style launch arguments passed from XCUITest.
//
// iOS automatically parses launch arguments of the form `-Key Value` into
// NSUserDefaults at app start. React Native exposes these via
// `NativeModules.SettingsManager.settings` on iOS. We read them once at
// module-load so the rest of the app pays zero cost.
//
// All flags are no-ops in release builds (`__DEV__` and `__SANDBOX__` are
// both off in TestFlight production submissions), so adding them does not
// change production behavior. The flag surface area is small and explicit
// — every flag is enumerated below.
//
// Used by:
//   - src/services/SensoryService.ts (counter surface + voice gate seed)
//   - src/health/provider.ios.ts      (HealthKit init failure simulation)
//   - src/billing/storeKit.ts         (StoreKit mock: empty product list)
//   - src/store/useAppStore.ts        (force-reset onboarding for paywall test)
//   - src/store/useDailyCycleStore.ts (seed totalPracticesCompleted)

import { NativeModules, Platform } from 'react-native';

type SettingsBag = Record<string, unknown> | undefined;

function readSettings(): SettingsBag {
  if (Platform.OS !== 'ios') return undefined;
  try {
    return (NativeModules as { SettingsManager?: { settings?: SettingsBag } })
      .SettingsManager?.settings;
  } catch {
    return undefined;
  }
}

const settings = readSettings();

function readString(key: string): string | null {
  const value = settings?.[key];
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return null;
}

function readBool(key: string): boolean {
  const value = readString(key);
  return value === '1' || value === 'true' || value === 'YES';
}

export const uiTestFlags = {
  /** Master flag — when true, app is being driven by XCUITest. */
  enabled: readBool('UITestMode'),

  /** Force HealthKit init to resolve false synchronously. */
  healthKitInitFail: readBool('UITestHealthKitInitFail'),

  /** StoreKit product mock mode. Accepts: 'empty' (returns []). */
  storeKitMock: readString('UITestStoreKitMock'),

  /** Force-reset hasOnboarded=false so the boot route lands on OnboardingSequence. */
  resetOnboarding: readBool('UITestResetOnboarding'),

  /** Pre-seed totalPracticesCompleted before the milestone test. */
  seedPracticesCompleted: (() => {
    const raw = readString('UITestSeedPracticesCompleted');
    if (!raw) return null;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  })(),

  /** Disable voice guidance via the sensory store at boot. */
  voiceGuidanceOff: readBool('UITestVoiceGuidanceOff'),
};
