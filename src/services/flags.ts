import { NativeModules, Platform } from 'react-native';

/// Bridge to `IOSAppsFlagsBridge` (see
/// `ios/Sadhana/IOSAppsAnalyticsBridge.swift`). The same file hosts all
/// three bridges; the JS surface is split to keep concerns narrow.

export type FlagKey =
  | 'paywallVariant'
  | 'kusalaMitraEnabled'
  | 'pathScreenEnabled'
  | 'sanghaCountEnabled';

type FlagValue = string | boolean | number | null;

type NativeFlagsModule = {
  getFlag: (key: FlagKey) => Promise<{ key: FlagKey; value: FlagValue }>;
};

const nativeModule: NativeFlagsModule | undefined =
  Platform.OS === 'ios' ? (NativeModules.IOSAppsFlagsBridge as NativeFlagsModule | undefined) : undefined;

const FALLBACK: Record<FlagKey, FlagValue> = {
  paywallVariant: 'control',
  kusalaMitraEnabled: false,
  pathScreenEnabled: true,
  sanghaCountEnabled: false,
};

export async function getFlag<T extends FlagValue = FlagValue>(key: FlagKey): Promise<T> {
  if (!nativeModule) return FALLBACK[key] as T;
  try {
    const { value } = await nativeModule.getFlag(key);
    if (value === null || value === undefined) return FALLBACK[key] as T;
    return value as T;
  } catch {
    return FALLBACK[key] as T;
  }
}
