import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { getTimeGreeting } from '../../utils/timeWindow';
import { MoodQuadrant } from '../../types';
import { fontFamilies } from '../../theme/fonts';

interface MorningCheckinProps {
  visible: boolean;
  onComplete: () => void;
  sleepDuration?: string;
  recoveryStatus?: 'Good' | 'Fair' | 'Poor' | null;
}

/**
 * Morning Check-in Flow
 *
 * The daily "login bonus" - establishes baseline with minimal friction.
 * 10-30 seconds to complete. Creates the habit anchor.
 *
 * Flow:
 * 1. Show greeting + overnight data
 * 2. Quick mood plot (4 quadrants)
 * 3. Record and proceed
 */
export function MorningCheckin({
  visible,
  onComplete,
  sleepDuration = '—',
  recoveryStatus = null,
}: MorningCheckinProps) {
  const { tokens, quadrants } = useTheme();
  const [selectedQuadrant, setSelectedQuadrant] = useState<MoodQuadrant>(null);

  const setMood = useAppStore((s) => s.setMood);
  const recordMorningCheckin = useDailyCycleStore((s) => s.recordMorningCheckin);
  const inferWake = useDailyCycleStore((s) => s.inferWake);
  const demoNow = useDailyCycleStore((s) => s.demoNow);

  const now = demoNow ?? new Date();
  const greeting = getTimeGreeting(now);

  const handleQuadrantSelect = (quadrant: MoodQuadrant) => {
    setSelectedQuadrant(quadrant);
  };

  const handleComplete = () => {
    if (!selectedQuadrant) return;

    // Infer wake time as now
    inferWake(now);

    // Record the morning check-in
    recordMorningCheckin({
      timestamp: now,
      moodQuadrant: selectedQuadrant,
    });

    // Update app store mood
    setMood(selectedQuadrant);

    // Clear selection for next time
    setSelectedQuadrant(null);

    onComplete();
  };

  const quadrantData: { quadrant: MoodQuadrant; label: string; emoji: string }[] = [
    { quadrant: 'Red', label: 'Activated', emoji: '🔴' },
    { quadrant: 'Yellow', label: 'Energized', emoji: '🟡' },
    { quadrant: 'Blue', label: 'Depleted', emoji: '🔵' },
    { quadrant: 'Green', label: 'Calm', emoji: '🟢' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
        <View style={styles.content}>
          {/* Greeting */}
          <Text style={[styles.greeting, { color: tokens.textPrimary }]}>
            {greeting}
          </Text>

          <View style={[styles.divider, { backgroundColor: tokens.border }]} />

          {/* Overnight data */}
          {(sleepDuration !== '—' || recoveryStatus) && (
            <View style={styles.overnightData}>
              <Text style={[styles.dataText, { color: tokens.textSecondary }]}>
                Sleep: {sleepDuration}
                {recoveryStatus && ` • Recovery: ${recoveryStatus}`}
              </Text>
            </View>
          )}

          {/* Question */}
          <Text style={[styles.question, { color: tokens.textPrimary }]}>
            Where are you now?
          </Text>

          {/* Mood Grid */}
          <View style={styles.moodGrid}>
            {quadrantData.map(({ quadrant, label, emoji }) => (
              <TouchableOpacity
                key={quadrant}
                style={[
                  styles.quadrantButton,
                  {
                    backgroundColor:
                      selectedQuadrant === quadrant
                        ? quadrants[quadrant!] + '30'
                        : tokens.bgSecondary,
                    borderColor:
                      selectedQuadrant === quadrant
                        ? quadrants[quadrant!]
                        : tokens.border,
                  },
                ]}
                onPress={() => handleQuadrantSelect(quadrant)}
                activeOpacity={0.7}
              >
                <Text style={styles.quadrantEmoji}>{emoji}</Text>
                <Text
                  style={[
                    styles.quadrantLabel,
                    {
                      color:
                        selectedQuadrant === quadrant
                          ? quadrants[quadrant!]
                          : tokens.textSecondary,
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Quick plot button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              {
                backgroundColor: selectedQuadrant ? tokens.accent : tokens.border,
                opacity: selectedQuadrant ? 1 : 0.5,
              },
            ]}
            onPress={handleComplete}
            disabled={!selectedQuadrant}
          >
            <Text
              style={[
                styles.continueText,
                { color: selectedQuadrant ? tokens.bgPrimary : tokens.textSecondary },
              ]}
            >
              Quick plot →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');
const gridSize = (width - 64) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  greeting: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 32,
    lineHeight: 38,
  },
  divider: {
    height: 1,
    marginVertical: 24,
  },
  overnightData: {
    marginBottom: 32,
  },
  dataText: {
    fontSize: 14,
    lineHeight: 20,
  },
  question: {
    fontFamily: fontFamilies.display.regular,
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 24,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  quadrantButton: {
    width: gridSize,
    height: gridSize,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quadrantEmoji: {
    fontSize: 32,
  },
  quadrantLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
