import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { track } from './analytics';
import { requestIfPeak } from './reviewPrompts';

const DAY_MS = 24 * 60 * 60 * 1000;
const LAPSED_THRESHOLD_MS = 7 * DAY_MS;
const NPS_DAYS = 21;
const NPS_PRACTICE_THRESHOLD = 10;
const SAMBANDHA_DAYS = 30;

/// Centralised hook driving the wave13 feedback loops:
/// - emits `app_open` once per mount
/// - emits `session_start` / `session_end`
/// - detects 7+ day absences and emits `lapsed_user`
/// - exposes a banner string ("Welcome back. Begin small.") to surface on Home
/// - decides when to present the quiet NPS modal
/// - fires the App Store review prompt at the Sambandha milestone (day 30)
export function useFeedbackLoops(): {
  showNps: boolean;
  closeNps: () => void;
  welcomeBackBanner: string | null;
  dismissWelcomeBack: () => void;
} {
  const firstOpenedAt = useAppStore((s) => s.firstOpenedAt);
  const lastActiveAt = useAppStore((s) => s.lastActiveAt);
  const totalPracticesCompleted = useAppStore((s) => s.totalPracticesCompleted);
  const npsShownAt = useAppStore((s) => s.npsShownAt);
  const sambandhaReachedAt = useAppStore((s) => s.sambandhaReachedAt);
  const markActive = useAppStore((s) => s.markActive);
  const markNpsShown = useAppStore((s) => s.markNpsShown);
  const markSambandhaReached = useAppStore((s) => s.markSambandhaReached);

  const [showNps, setShowNps] = useState(false);
  const [welcomeBackBanner, setWelcomeBackBanner] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const now = Date.now();
    const wasLapsed =
      typeof lastActiveAt === 'number' && now - lastActiveAt >= LAPSED_THRESHOLD_MS;
    const installAge = typeof firstOpenedAt === 'number' ? now - firstOpenedAt : 0;

    track('app_open', { lapsed: wasLapsed, install_age_days: Math.floor(installAge / DAY_MS) });
    track('session_start', {});

    if (wasLapsed) {
      track('lapsed_user', {
        absence_days: Math.floor((now - (lastActiveAt ?? now)) / DAY_MS),
      });
      // Reverent soft welcome — replaces the push notification on cold
      // launch when expo-notifications is not wired.
      setWelcomeBackBanner('Welcome back. Begin small.');
    }

    markActive(now);

    // NPS gating: 21 days of use + >=10 practices + never shown before.
    const eligibleForNps =
      !npsShownAt &&
      typeof firstOpenedAt === 'number' &&
      installAge >= NPS_DAYS * DAY_MS &&
      totalPracticesCompleted >= NPS_PRACTICE_THRESHOLD;
    if (eligibleForNps) {
      setShowNps(true);
      markNpsShown(now);
      track('nps_shown', { install_age_days: Math.floor(installAge / DAY_MS) });
    }

    // Sambandha milestone (30 continuous days of practice) — fire the peak
    // App Store review prompt exactly once.
    if (
      !sambandhaReachedAt &&
      typeof firstOpenedAt === 'number' &&
      installAge >= SAMBANDHA_DAYS * DAY_MS
    ) {
      markSambandhaReached(now);
      track('sthiti_milestone', { milestone: 'sambandha', days: SAMBANDHA_DAYS });
      void requestIfPeak('sambandhaReached');
    }

    const handleBeforeUnload = () => {
      track('session_end', {});
    };
    return () => {
      handleBeforeUnload();
    };
    // We deliberately run this only once per mount; subsequent calls would
    // double-count opens. Future revisions could re-fire on AppState change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeNps = () => setShowNps(false);
  const dismissWelcomeBack = () => setWelcomeBackBanner(null);

  return { showNps, closeNps, welcomeBackBanner, dismissWelcomeBack };
}
