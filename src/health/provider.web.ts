import type { SensorSnapshot } from '../types/dailyCycle';

export async function requestHealthPermissions(): Promise<boolean> {
  return false;
}

export async function readSensorSnapshot(_now: Date = new Date()): Promise<SensorSnapshot | null> {
  return null;
}

