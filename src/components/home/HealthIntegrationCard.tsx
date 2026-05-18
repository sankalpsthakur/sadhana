import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import type { HealthSyncStatus } from '../../types/dailyCycle';
import type { SensorSnapshot } from '../../types/dailyCycle';
import { formatSleepDuration } from '../../utils/healthSnapshot';
import { fontFamilies } from '../../theme/fonts';

type HealthIntegrationCardProps = {
  platform: 'ios' | 'android' | 'web';
  isEnabled: boolean;
  isConnecting: boolean;
  syncStatus: HealthSyncStatus;
  syncAt: Date | null;
  syncError: string | null;
  snapshot: SensorSnapshot | null;
  connectError?: string | null;
  onConnect: () => void;
  onSync: () => void;
  onOpenSettings?: () => void;
};

const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const mapHrvLabel = (trend: SensorSnapshot['hrvTrend']) => {
  if (trend === 'low') return 'Low';
  if (trend === 'ok') return 'OK';
  if (trend === 'high') return 'High';
  return '-';
};

const formatStatus = (status: HealthSyncStatus, error: string | null) => {
  if (status === 'syncing') return 'Syncing...';
  if (status === 'success') return 'Sync complete';
  if (status === 'no-data') return error || 'No health data found yet';
  if (status === 'failed') return error || 'Sync failed';
  return 'Not synced yet';
};

export function HealthIntegrationCard({
  platform,
  isEnabled,
  isConnecting,
  syncStatus,
  syncAt,
  syncError,
  snapshot,
  connectError,
  onConnect,
  onSync,
  onOpenSettings,
}: HealthIntegrationCardProps) {
  const { tokens } = useTheme();
  const platformLabel = platform === 'ios' ? 'Apple Health' : platform === 'android' ? 'Health Connect' : 'Health';
  const settingsLabel = platform === 'ios' ? 'Open app settings' : `Open ${platformLabel} settings`;

  if (!isEnabled) {
    const failed = Boolean(connectError);
    const title = isConnecting
      ? 'Connecting...'
      : failed
        ? `${platformLabel} hasn't connected yet`
        : `Connect ${platformLabel}`;
    const subtitle = failed
      ? `${connectError} Tap retry, or open Settings to grant access.`
      : 'Reads sleep, HRV, and resting heart rate only. Nothing is written to Health. Metrics stay on this device.';
    const ctaLabel = isConnecting
      ? 'Connecting...'
      : failed
        ? 'Retry'
        : 'Connect';
    return (
      <View
        style={[styles.card, { backgroundColor: tokens.bgSecondary, borderColor: failed ? tokens.accent : tokens.border }]}
        accessibilityLabel={title}
        testID="HealthIntegrationCardDisconnected"
      >
        <Text style={[styles.title, { color: tokens.textPrimary }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>{subtitle}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: tokens.border }]}
            accessibilityRole="button"
            accessibilityLabel={failed ? `Retry ${platformLabel}` : `Connect ${platformLabel}`}
            testID="HealthIntegrationConnectButton"
            disabled={isConnecting}
            onPress={onConnect}
          >
            <Text style={[styles.actionText, { color: tokens.textPrimary }]}>{ctaLabel}</Text>
          </TouchableOpacity>
          {failed && onOpenSettings && (
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: tokens.border }]}
              accessibilityRole="button"
              accessibilityLabel={settingsLabel}
              testID="HealthIntegrationOpenSettingsButton"
              onPress={onOpenSettings}
            >
              <Text style={[styles.actionText, { color: tokens.textPrimary }]}>Settings</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  const statusText = formatStatus(syncStatus, syncError);
  const sleepLabel = formatSleepDuration(snapshot?.sleepDurationMinutes ?? null);
  const hrvLabel = mapHrvLabel(snapshot?.hrvTrend ?? null);
  const recoveryLabel =
    snapshot?.recoveryScore !== null && snapshot?.recoveryScore !== undefined
      ? `${Math.round(snapshot.recoveryScore)}`
      : '-';

  return (
    <View style={[styles.card, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      <Text style={[styles.title, { color: tokens.textPrimary }]}>{platformLabel} Connected</Text>
      <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
        {syncAt ? `Last sync: ${formatTime(syncAt)} - ${statusText}` : statusText}
      </Text>

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: tokens.textPrimary }]}>{sleepLabel}</Text>
          <Text style={[styles.metricLabel, { color: tokens.textSecondary }]}>Sleep</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: tokens.textPrimary }]}>{hrvLabel}</Text>
          <Text style={[styles.metricLabel, { color: tokens.textSecondary }]}>HRV</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: tokens.textPrimary }]}>{recoveryLabel}</Text>
          <Text style={[styles.metricLabel, { color: tokens.textSecondary }]}>Recovery</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: tokens.border }]}
          accessibilityRole="button"
          accessibilityLabel="Health Sync Now"
          onPress={onSync}
          disabled={isConnecting || syncStatus === 'syncing'}
        >
          <Text style={[styles.actionText, { color: tokens.textPrimary }]}>Sync now</Text>
        </TouchableOpacity>
        {onOpenSettings && (
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: tokens.border }]}
            accessibilityRole="button"
            accessibilityLabel={settingsLabel}
            onPress={onOpenSettings}
          >
            <Text style={[styles.actionText, { color: tokens.textPrimary }]}>Settings</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  title: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 16,
    lineHeight: 22,
  },
  subtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  errorText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 4,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 14,
  },
  metricLabel: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 10,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
});
