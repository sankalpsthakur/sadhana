import React, { useCallback, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/fonts';
import { safetyColors } from '../theme/tokens';
import { useAppStore } from '../store/useAppStore';
import { useDailyCycleStore } from '../store/useDailyCycleStore';
import { useSensoryStore } from '../store/sensoryStore';
import { restoreSadhanaPurchases } from '../billing';
import { requestHealthPermissions } from '../health';
import { track } from '../services/analytics';
import appJson from '../../app.json';

const APP_VERSION = (appJson as { expo?: { version?: string } }).expo?.version ?? '1.0.0';
const BUILD_NUMBER =
  (appJson as { expo?: { ios?: { buildNumber?: string } } }).expo?.ios?.buildNumber ?? null;

const SUPPORT_EMAIL = 'sankalphimself@gmail.com';
const PRIVACY_URL = 'https://github.com/sankalpsthakur/sadhana/blob/main/PRIVACY.md';
const TERMS_URL = 'https://github.com/sankalpsthakur/sadhana/blob/main/TERMS.md';
const MANAGE_SUBS_URL = Platform.select({
  ios: 'itms-apps://apps.apple.com/account/subscriptions',
  android: 'https://play.google.com/store/account/subscriptions',
  default: 'https://apps.apple.com/account/subscriptions',
});

const PERSISTED_STORE_KEYS = ['sadhana.app', 'sadhana.dailyCycle.v1'];

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  const { tokens } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: tokens.textSecondary }]}>{title}</Text>
      <View
        style={[styles.sectionCard, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
      >
        {children}
      </View>
    </View>
  );
}

type RowProps = {
  label: string;
  value?: string | null;
  onPress?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  testID?: string;
  showChevron?: boolean;
};

function Row({ label, value, onPress, destructive, disabled, testID, showChevron }: RowProps) {
  const { tokens } = useTheme();
  const Wrapper: React.ElementType = onPress ? TouchableOpacity : View;
  const wrapperProps: Record<string, unknown> = onPress
    ? {
        accessibilityRole: 'button',
        accessibilityLabel: label,
        onPress,
        disabled,
        testID,
      }
    : { testID };
  const labelColor = destructive ? safetyColors.red : tokens.textPrimary;

  return (
    <Wrapper {...wrapperProps} style={[styles.row, { borderBottomColor: tokens.border }]}>
      <View style={styles.rowLeft}>
        <Text
          style={[
            styles.rowLabel,
            { color: labelColor, opacity: disabled ? 0.5 : 1 },
          ]}
        >
          {label}
        </Text>
      </View>
      <View style={styles.rowRight}>
        {value ? (
          <Text style={[styles.rowValue, { color: tokens.textSecondary }]}>{value}</Text>
        ) : null}
        {onPress && showChevron !== false ? (
          <Text style={[styles.chevron, { color: tokens.textMuted }]}>›</Text>
        ) : null}
      </View>
    </Wrapper>
  );
}

export function SettingsScreen() {
  const { tokens } = useTheme();
  const entitlement = useAppStore((s) => s.entitlement);
  const healthIntegrationEnabled = useAppStore((s) => s.healthIntegrationEnabled);
  const setHealthIntegrationEnabled = useAppStore((s) => s.setHealthIntegrationEnabled);
  const resetAppStore = useAppStore((s) => s.reset);
  const setHasOnboarded = useAppStore((s) => s.completeOnboarding); // unused, but kept import path stable
  const resetDailyCycleStore = useDailyCycleStore((s) => s.reset);
  const healthSyncAt = useDailyCycleStore((s) => s.healthSyncAt);
  const healthSyncStatus = useDailyCycleStore((s) => s.healthSyncStatus);

  // suppress unused-warning for typed-but-not-rendered hook value
  void setHasOnboarded;

  const [isRestoring, setIsRestoring] = useState(false);
  const [isReconnectingHealth, setIsReconnectingHealth] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [healthRetryMessage, setHealthRetryMessage] = useState<string | null>(null);

  // Sensory preferences (haptic + audio + TTS). Tap to toggle.
  const voiceEnabled = useSensoryStore((s) => s.voiceEnabled);
  const hapticsEnabled = useSensoryStore((s) => s.hapticsEnabled);
  const bellsEnabled = useSensoryStore((s) => s.bellsEnabled);
  const toggleVoice = useSensoryStore((s) => s.toggleVoice);
  const toggleHaptics = useSensoryStore((s) => s.toggleHaptics);
  const toggleBells = useSensoryStore((s) => s.toggleBells);

  const openExternal = useCallback(async (url: string, friendlyName: string) => {
    try {
      const ok = await Linking.canOpenURL(url);
      if (!ok) throw new Error('Cannot open URL');
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        friendlyName,
        `Unable to open ${friendlyName}. You can copy and open it manually:\n\n${url}`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  }, []);

  const handleRestore = useCallback(async () => {
    if (isRestoring) return;
    setIsRestoring(true);
    try {
      const snapshot = await restoreSadhanaPurchases();
      if (snapshot.active) {
        useAppStore.getState().setEntitlement(snapshot);
        Alert.alert(
          'Restored',
          'Inner Phases Premium is now active on this device.'
        );
      } else {
        Alert.alert(
          'No purchase found',
          'No active Inner Phases Premium purchase is associated with this Apple ID.'
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Restore failed. Please try again.';
      Alert.alert('Restore failed', message);
    } finally {
      setIsRestoring(false);
    }
  }, [isRestoring]);

  const handleReconnectHealth = useCallback(async () => {
    if (isReconnectingHealth) return;
    setIsReconnectingHealth(true);
    setHealthRetryMessage(null);
    try {
      const ok = await requestHealthPermissions();
      if (ok) {
        setHealthIntegrationEnabled(true);
        setHealthRetryMessage('Connected. Sync will run from Home.');
      } else {
        setHealthRetryMessage(
          'Permission not granted. Open Settings → Privacy → Health to enable access.'
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to connect to Health data.';
      setHealthRetryMessage(message);
    } finally {
      setIsReconnectingHealth(false);
    }
  }, [isReconnectingHealth, setHealthIntegrationEnabled]);

  const handleOpenAppSettings = useCallback(() => {
    void openExternal('app-settings:', 'App settings');
  }, [openExternal]);

  const handleSupport = useCallback(() => {
    const subject = encodeURIComponent('Inner Phases feedback');
    const body = encodeURIComponent(
      `\n\n---\nApp version: ${APP_VERSION}${BUILD_NUMBER ? ` (${BUILD_NUMBER})` : ''}\nPlatform: ${Platform.OS} ${Platform.Version}`
    );
    void openExternal(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`, 'Mail');
  }, [openExternal]);

  const wipeEverything = useCallback(async () => {
    if (isWiping) return;
    setIsWiping(true);
    try {
      // 1. Reset Zustand state in-memory.
      resetAppStore();
      resetDailyCycleStore();

      // 2. Clear all persisted state (both SecureStore and AsyncStorage,
      //    since persistStorage falls back to AsyncStorage for legacy values).
      for (const key of PERSISTED_STORE_KEYS) {
        try {
          await SecureStore.deleteItemAsync(key);
        } catch {
          // ignore — key may not exist
        }
        try {
          await AsyncStorage.removeItem(key);
        } catch {
          // ignore
        }
      }
      try {
        await AsyncStorage.clear();
      } catch {
        // ignore — AsyncStorage may not have additional keys
      }

      // 3. Flip onboarding back off so App.tsx routes to OnboardingSequence.
      useAppStore.setState({ hasOnboarded: false, entitlement: null });

      void track('settings_data_deleted', { platform: Platform.OS });

      Alert.alert(
        'Data deleted',
        'All on-device data has been cleared. The app will return to onboarding.'
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to fully delete data.';
      Alert.alert('Delete failed', message);
    } finally {
      setIsWiping(false);
    }
  }, [isWiping, resetAppStore, resetDailyCycleStore]);

  const confirmWipe = useCallback(() => {
    Alert.alert(
      'Delete all data?',
      'This permanently clears your onboarding, entitlement, daily cycle history, locks, and learned patterns on this device. HealthKit data in Apple Health is not affected. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: () => {
            void wipeEverything();
          },
        },
      ]
    );
  }, [wipeEverything]);

  const confirmSignOut = useCallback(() => {
    Alert.alert(
      'Sign out / Reset?',
      'Inner Phases stores your practice locally — there is no remote account. Signing out clears the local profile and returns you to onboarding. Subscription receipts on this Apple ID are preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            void track('settings_signed_out', { platform: Platform.OS });
            void wipeEverything();
          },
        },
      ]
    );
  }, [wipeEverything]);

  const entitlementLabel = entitlement?.active
    ? `Active (${entitlement.productId ?? entitlement.source})`
    : 'Not active';

  const healthStatusValue = healthIntegrationEnabled
    ? healthSyncAt
      ? `${healthSyncStatus} · ${new Date(healthSyncAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`
      : healthSyncStatus
    : 'Not connected';

  const buildLabel = BUILD_NUMBER ? `${APP_VERSION} (${BUILD_NUMBER})` : APP_VERSION;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: tokens.bgPrimary }]}
      edges={['top']}
      testID="SettingsScreen"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: tokens.textPrimary }]}>Settings</Text>

        <Section title="Account">
          <Row label="Profile" value="Local profile" />
          <Row
            label="Sign out / Reset"
            destructive
            onPress={confirmSignOut}
            testID="SettingsSignOutRow"
          />
        </Section>

        <Section title="Subscription">
          <Row label="Entitlement" value={entitlementLabel} />
          <Row
            label="Manage subscription"
            onPress={() => openExternal(MANAGE_SUBS_URL, 'Subscriptions')}
            testID="SettingsManageSubscriptionRow"
          />
          <Row
            label={isRestoring ? 'Restoring...' : 'Restore purchases'}
            onPress={handleRestore}
            disabled={isRestoring}
            testID="SettingsRestoreRow"
          />
        </Section>

        <Section title="Apple Health">
          <Row label="Status" value={healthStatusValue} />
          <Row label="Reads" value="Sleep · HRV · Resting HR" />
          <Row
            label={isReconnectingHealth ? 'Requesting...' : 'Re-request HealthKit permission'}
            onPress={handleReconnectHealth}
            disabled={isReconnectingHealth}
            testID="SettingsReconnectHealthRow"
          />
          <Row
            label="Open iOS Health settings"
            onPress={handleOpenAppSettings}
            testID="SettingsOpenAppSettingsRow"
          />
          {healthRetryMessage ? (
            <View style={styles.inlineMessageWrap}>
              <Text style={[styles.inlineMessage, { color: tokens.textSecondary }]}>
                {healthRetryMessage}
              </Text>
            </View>
          ) : null}
        </Section>

        <Section title="Practice">
          <Row
            label="Voice guidance"
            value={voiceEnabled ? 'On' : 'Off'}
            onPress={toggleVoice}
            showChevron={false}
            testID="SettingsVoiceGuidanceRow"
          />
          <Row
            label="Breath haptics"
            value={hapticsEnabled ? 'On' : 'Off'}
            onPress={toggleHaptics}
            showChevron={false}
            testID="SettingsBreathHapticsRow"
          />
          <Row
            label="Practice bells"
            value={bellsEnabled ? 'On' : 'Off'}
            onPress={toggleBells}
            showChevron={false}
            testID="SettingsPracticeBellsRow"
          />
        </Section>

        <Section title="Notifications">
          <Row
            label="Practice reminders"
            value="Coming soon"
            disabled
            testID="SettingsNotificationsRow"
            showChevron={false}
          />
          <View style={styles.helperWrap}>
            <Text style={[styles.helper, { color: tokens.textSecondary }]}>
              Reminders are not yet implemented. Until they ship, your daily
              cycle is driven by morning check-in and evening seal prompts on
              Home.
            </Text>
          </View>
        </Section>

        <Section title="About">
          <Row label="Version" value={buildLabel} />
          <Row
            label="Privacy policy"
            onPress={() => openExternal(PRIVACY_URL, 'Privacy policy')}
            testID="SettingsPrivacyRow"
          />
          <Row
            label="Terms of use"
            onPress={() => openExternal(TERMS_URL, 'Terms of use')}
            testID="SettingsTermsRow"
          />
        </Section>

        <Section title="Support">
          <Row
            label={`Email ${SUPPORT_EMAIL}`}
            onPress={handleSupport}
            testID="SettingsSupportRow"
          />
        </Section>

        <Section title="Danger zone">
          <Row
            label={isWiping ? 'Deleting...' : 'Delete all data'}
            destructive
            onPress={confirmWipe}
            disabled={isWiping}
            testID="SettingsDeleteAllDataRow"
          />
          <View style={styles.helperWrap}>
            <Text style={[styles.helper, { color: tokens.textSecondary }]}>
              Clears every on-device entry — onboarding, entitlement cache,
              locks, cooldowns, check-ins, practices, dream entries, and
              learned wake/sleep patterns. Apple Health data is left
              untouched.
            </Text>
          </View>
        </Section>

        <View style={styles.footerWrap}>
          <Text style={[styles.footer, { color: tokens.textMuted }]}>
            Inner Phases · {buildLabel}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    gap: 22,
  },
  header: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
    marginTop: 12,
    marginBottom: 4,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLeft: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 15,
    lineHeight: 20,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 180,
    textAlign: 'right',
  },
  chevron: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 22,
    lineHeight: 22,
  },
  helperWrap: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 14,
  },
  helper: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  inlineMessageWrap: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
  inlineMessage: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
    lineHeight: 18,
  },
  footerWrap: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footer: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
  },
});
