import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { getTimeWindow } from '../../utils/timeWindow';
import { fontFamilies } from '../../theme/fonts';

/**
 * Night Mode Screen
 *
 * The sealed container - app enters this state after Seal the Day.
 *
 * Features:
 * - Extreme dim UI (conceptual - actual brightness is device-level)
 * - No notifications
 * - Only Emergency Downshift available
 * - Warm/red-tinted color scheme
 *
 * The day is sealed. See you tomorrow.
 */
export function NightModeScreen() {
  const { safety } = useTheme();
  const dreamIntention = useDailyCycleStore((s) => s.dreamIntention);
  const clearNightMode = useDailyCycleStore((s) => s.clearNightMode);
  const inferWake = useDailyCycleStore((s) => s.inferWake);
  const demoNow = useDailyCycleStore((s) => s.demoNow);

  const now = demoNow ?? new Date();
  const window = getTimeWindow(now);
  const canExitNightMode = window !== 'NIGHT';

  const handleEmergencyPress = () => {
    Alert.alert(
      'Emergency Downshift',
      'This will activate grounding protocols. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Activate',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Grounding Active',
              'Body scan and breath work are available.\n\nNo screens after this.',
              [{ text: 'Begin Body Scan' }]
            );
          },
        },
      ]
    );
  };

  const nightPalette = {
    bg: '#0C0B0A',
    surface: '#15110F',
    surfaceStrong: '#1A1412',
    text: '#E8DCD0',
    muted: '#8A7A70',
    accent: '#C4A898',
    border: '#2A2020',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: nightPalette.bg }]}>
      <View style={styles.content}>
        {/* Night mode badge */}
        <View style={[styles.badge, { backgroundColor: nightPalette.surfaceStrong }]}>
          <Text style={[styles.badgeText, { color: nightPalette.muted }]}>
            Night Mode Active
          </Text>
        </View>

        {/* Marker */}
        <Text style={styles.moonEmoji}>◐</Text>

        {/* Message */}
        <Text style={[styles.title, { color: nightPalette.text }]}>
          The day is sealed.
        </Text>
        <Text style={[styles.subtitle, { color: nightPalette.muted }]}>
          See you tomorrow.
        </Text>

        <TouchableOpacity
          style={[styles.wakeButton, { borderColor: nightPalette.border }]}
          onPress={() => {
            if (!canExitNightMode) {
              Alert.alert(
                'Still Night',
                'Night Mode stays locked until morning.\n\nUse the sleep tools or Emergency Downshift.',
                [{ text: 'OK' }]
              );
              return;
            }

            inferWake(now);
            clearNightMode();
          }}
          accessibilityRole="button"
          accessibilityLabel="Night Mode I’m awake"
        >
          <Text style={[styles.wakeText, { color: nightPalette.accent }]}>
            {canExitNightMode ? "I'm awake" : "I'm awake (still sealed)"}
          </Text>
        </TouchableOpacity>

        {/* Dream intention if set */}
        {dreamIntention && dreamIntention.type !== 'none' && (
          <View style={[styles.intentionBox, { backgroundColor: nightPalette.surfaceStrong }]}>
            <Text style={[styles.intentionLabel, { color: nightPalette.muted }]}>
              Tonight's intention:
            </Text>
            <Text style={[styles.intentionText, { color: nightPalette.text }]}>
              {dreamIntention.type === 'lucidity'
                ? 'Practice lucidity'
                : dreamIntention.type === 'shadow'
                ? 'Meet the shadow'
                : dreamIntention.type === 'guidance'
                ? `Receive guidance on: ${dreamIntention.description}`
                : dreamIntention.description || dreamIntention.type}
            </Text>
          </View>
        )}

        {/* Sleep support options */}
        <View style={styles.sleepOptions}>
          <Text style={[styles.optionsLabel, { color: nightPalette.muted }]}>
            If you can't sleep:
          </Text>
          <TouchableOpacity
            style={[styles.optionButton, { borderColor: nightPalette.border }]}
            onPress={() => Alert.alert('Body Scan', 'Starting 10-minute body scan...')}
          >
            <Text style={[styles.optionText, { color: nightPalette.accent }]}>
              Body Scan (10 min)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, { borderColor: nightPalette.border }]}
            onPress={() => Alert.alert('4-7-8 Breath', 'Starting breath cycle...')}
          >
            <Text style={[styles.optionText, { color: nightPalette.accent }]}>
              4-7-8 Breath (5 min)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.emergencyButton, { borderColor: safety.red + '60' }]}
          onPress={handleEmergencyPress}
        >
          <Text style={styles.emergencyIcon}>!</Text>
          <Text style={[styles.emergencyText, { color: safety.red }]}>
            Emergency Downshift
          </Text>
        </TouchableOpacity>
        <Text style={[styles.footerNote, { color: nightPalette.muted }]}>
          Always available
        </Text>
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 32,
  },
  badgeText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
    letterSpacing: 0.2,
  },
  moonEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 32,
  },
  wakeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 28,
  },
  wakeText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 14,
  },
  intentionBox: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 32,
  },
  intentionLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  intentionText: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  sleepOptions: {
    width: '100%',
    gap: 8,
  },
  optionsLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  optionButton: {
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    width: '100%',
  },
  emergencyIcon: {
    fontSize: 16,
  },
  emergencyText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 14,
  },
  footerNote: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
    marginTop: 8,
  },
});
