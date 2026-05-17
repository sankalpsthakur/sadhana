import { NativeModules, Platform } from 'react-native';

/// Bridge to `IOSAppsReviewPromptsBridge`. Calls `SKStoreReviewController`
/// behind a 120-day throttle. Peak names mirror the framework spec — Sadhana
/// uses `sambandhaReached` at the 30-day Sambandha milestone.

export type PeakName = 'sambandhaReached' | 'sthitiMilestone' | 'phaseAdvanced';

type NativeModule = {
  requestIfPeak: (peak: PeakName) => Promise<{ presented: boolean; peak: PeakName }>;
};

const nativeModule: NativeModule | undefined =
  Platform.OS === 'ios' ? (NativeModules.IOSAppsReviewPromptsBridge as NativeModule | undefined) : undefined;

export async function requestIfPeak(peak: PeakName): Promise<boolean> {
  if (!nativeModule) return false;
  try {
    const { presented } = await nativeModule.requestIfPeak(peak);
    return presented;
  } catch {
    return false;
  }
}
