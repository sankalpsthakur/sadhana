import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';

/// In-app "Welcome back. Begin small." banner shown on cold launch after a
/// 7+ day absence. Sits above the tab bar without blocking navigation so the
/// seeker can dismiss with intent.

interface WelcomeBackBannerProps {
  message: string;
  onDismiss: () => void;
}

export function WelcomeBackBanner({ message, onDismiss }: WelcomeBackBannerProps) {
  const { tokens } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={styles.safe} pointerEvents="box-none">
      <View
        style={[
          styles.banner,
          { backgroundColor: tokens.bgSecondary, borderColor: tokens.border },
        ]}
      >
        <Text style={[styles.text, { color: tokens.textPrimary }]} numberOfLines={2}>
          {message}
        </Text>
        <TouchableOpacity
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss welcome message"
          style={styles.dismiss}
        >
          <Text style={[styles.dismissText, { color: tokens.textSecondary }]}>Close</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  text: {
    flex: 1,
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  dismiss: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dismissText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
});
