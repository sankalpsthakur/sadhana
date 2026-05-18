import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';

interface ComingSoonModalProps {
  visible: boolean;
  practiceName: string;
  /** Short purpose/description blurb from the practice library. */
  blurb?: string;
  onClose: () => void;
}

/**
 * Honest placeholder for practices that aren't wired to a guided modal yet.
 * Replaces the old `Alert.alert('Logged', ...)` toast that fired on every tap
 * and gave the impression the app was broken.
 *
 * Does NOT log the practice in the daily cycle — taps land here intentionally
 * and the user should be able to back out cleanly.
 */
export function ComingSoonModal({ visible, practiceName, blurb, onClose }: ComingSoonModalProps) {
  const { tokens } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: '#000000CC' }]}>
        <View style={[styles.card, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
          <Text style={[styles.eyebrow, { color: tokens.textSecondary }]}>Coming soon</Text>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>{practiceName}</Text>
          {blurb ? (
            <Text style={[styles.blurb, { color: tokens.textSecondary }]}>{blurb}</Text>
          ) : null}
          <Text style={[styles.body, { color: tokens.textSecondary }]}>
            We're recording the audio guide for this practice. It'll arrive in a future build.
            For now, try a Body Scan or 4-4-6 Breath instead — they're live.
          </Text>

          <Pressable
            style={[styles.button, { backgroundColor: tokens.accent }]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={`Close ${practiceName} coming soon`}
            testID="ComingSoonCloseButton"
          >
            <Text style={[styles.buttonText, { color: tokens.bgPrimary }]}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', borderWidth: 1, borderRadius: 16, padding: 24, alignItems: 'center' },
  eyebrow: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  blurb: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontFamily: fontFamilies.text.semibold, fontSize: 15 },
});
