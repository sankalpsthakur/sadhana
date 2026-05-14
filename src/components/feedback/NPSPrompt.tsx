import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';
import { track } from '../../services/analytics';

/// Quiet, single-question NPS surface presented at moments of high
/// engagement (21 days of use + >=10 practices). Tone matches Sadhana's
/// reverent register — no exclamation marks, no "rate us!", no growth-hacks.

interface NPSPromptProps {
  visible: boolean;
  onClose: () => void;
}

const SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function NPSPrompt({ visible, onClose }: NPSPromptProps) {
  const { tokens } = useTheme();
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const dismiss = () => {
    setScore(null);
    setSubmitted(false);
    onClose();
  };

  const submit = (value: number) => {
    setScore(value);
    setSubmitted(true);
    track('nps_responded', { score: value });
    // Linger briefly so the seeker registers the acknowledgement.
    setTimeout(dismiss, 1400);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={dismiss}
    >
      <Pressable style={styles.backdrop} onPress={dismiss}>
        <Pressable
          style={[styles.card, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
          onPress={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <View style={styles.thanksWrap}>
              <Text style={[styles.thanksText, { color: tokens.textPrimary }]}>
                Received with gratitude.
              </Text>
            </View>
          ) : (
            <>
              <Text style={[styles.kicker, { color: tokens.accent }]}>A quiet question</Text>
              <Text style={[styles.title, { color: tokens.textPrimary }]}>
                How likely are you to recommend Sadhana to a fellow seeker?
              </Text>
              <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
                Zero is not at all. Ten is wholeheartedly.
              </Text>

              <View style={styles.scoreRow}>
                {SCORES.map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => submit(value)}
                    accessibilityRole="button"
                    accessibilityLabel={`Score ${value}`}
                    style={[
                      styles.scoreCell,
                      { borderColor: tokens.border, backgroundColor: tokens.bgPrimary },
                      score === value && { borderColor: tokens.accent },
                    ]}
                  >
                    <Text style={[styles.scoreText, { color: tokens.textPrimary }]}>{value}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={dismiss}
                accessibilityRole="button"
                accessibilityLabel="Not now"
                style={styles.skip}
              >
                <Text style={[styles.skipText, { color: tokens.textSecondary }]}>Not now</Text>
              </TouchableOpacity>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
  },
  kicker: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 18,
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  scoreCell: {
    minWidth: 30,
    height: 32,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
  },
  skip: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipText: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
  },
  thanksWrap: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  thanksText: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 16,
    lineHeight: 22,
  },
});
