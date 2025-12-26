import { Platform } from 'react-native';
import type { SensorSnapshot } from '../types/dailyCycle';

export async function requestHealthPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const mod = await import('./provider.ios');
    return mod.requestHealthPermissions();
  }
  if (Platform.OS === 'android') {
    const mod = await import('./provider.android');
    return mod.requestHealthPermissions();
  }
  const mod = await import('./provider.web');
  return mod.requestHealthPermissions();
}

export async function readSensorSnapshot(now: Date = new Date()): Promise<SensorSnapshot | null> {
  if (Platform.OS === 'ios') {
    const mod = await import('./provider.ios');
    return mod.readSensorSnapshot(now);
  }
  if (Platform.OS === 'android') {
    const mod = await import('./provider.android');
    return mod.readSensorSnapshot(now);
  }
  const mod = await import('./provider.web');
  return mod.readSensorSnapshot(now);
}

export async function openHealthSettings(): Promise<void> {
  if (Platform.OS === 'android') {
    const mod = await import('./provider.android');
    return mod.openHealthSettings();
  }
}
