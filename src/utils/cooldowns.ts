export interface CooldownStatus {
  hoursRemaining: number;
  label: string;
}

export function getCooldownStatus(endsAtMs: number | null, now: Date = new Date()): CooldownStatus | null {
  if (!endsAtMs) return null;
  const diffMs = endsAtMs - now.getTime();
  if (diffMs <= 0) return null;

  const hoursRemaining = Math.ceil(diffMs / (60 * 60 * 1000));
  const days = Math.floor(hoursRemaining / 24);
  const hours = hoursRemaining % 24;
  const label = days > 0 ? `${days}d ${hours}h` : `${hoursRemaining}h`;

  return { hoursRemaining, label };
}
