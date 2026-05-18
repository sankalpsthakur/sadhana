import { NativeModules, Platform } from 'react-native';

/// Bridge to `IOSAppsAnalyticsBridge` (see
/// `ios/Sadhana/IOSAppsAnalyticsBridge.swift`). Web / Android targets fall
/// through to a no-op so the rest of the app can call `track()` freely
/// without platform guards.

export type AnalyticsEventName =
  | 'app_open'
  | 'session_start'
  | 'session_end'
  | 'practice_started'
  | 'practice_completed'
  | 'phase_advanced'
  | 'sthiti_milestone'
  | 'stability_check'
  | 'daily_reflection_written'
  | 'paywall_shown'
  | 'paywall_converted'
  | 'subscription_started'
  | 'referral_sent'
  | 'lapsed_user'
  | 'nps_shown'
  | 'nps_responded'
  | 'paywall_products_unavailable'
  | 'healthkit_init_failed'
  | 'settings_data_deleted'
  | 'settings_signed_out';

type NativeAnalyticsModule = {
  track: (event: string, properties: Record<string, unknown>) => Promise<{ status: string; event: string }>;
  setOptOut: (optedOut: boolean) => Promise<{ optedOut: boolean }>;
};

const nativeModule: NativeAnalyticsModule | undefined =
  Platform.OS === 'ios' ? (NativeModules.IOSAppsAnalyticsBridge as NativeAnalyticsModule | undefined) : undefined;

export async function track(
  event: AnalyticsEventName,
  properties: Record<string, unknown> = {}
): Promise<void> {
  if (!nativeModule) return;
  try {
    await nativeModule.track(event, properties);
  } catch {
    // Analytics must never break the user-facing flow.
  }
}

export async function setOptOut(optedOut: boolean): Promise<void> {
  if (!nativeModule) return;
  try {
    await nativeModule.setOptOut(optedOut);
  } catch {
    // ignored
  }
}
