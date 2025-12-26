import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { getTimeWindow } from '../../utils/timeWindow';
import { MoodMeterModal } from '../shared/MoodMeterModal';
import { BodyMapModal } from '../shared/BodyMapModal';
import { WordPickerModal } from '../shared/WordPickerModal';
import { fontFamilies } from '../../theme/fonts';

export function QuickJournalCard() {
  const { tokens, getQuadrantColor } = useTheme();

  const recordCheckin = useDailyCycleStore((s) => s.recordCheckin);
  const demoNow = useDailyCycleStore((s) => s.demoNow);

  const moodQuadrant = useAppStore((state) => state.moodQuadrant);
  const moodCoordinates = useAppStore((state) => state.moodCoordinates);
  const bodyZone = useAppStore((state) => state.bodyZone);
  const moodWord = useAppStore((state) => state.moodWord);
  const setMood = useAppStore((s) => s.setMood);
  const setBodyZone = useAppStore((s) => s.setBodyZone);
  const setMoodWord = useAppStore((s) => s.setMoodWord);

  const isComplete = moodQuadrant && bodyZone && moodWord;

  const [showMood, setShowMood] = React.useState(false);
  const [showBody, setShowBody] = React.useState(false);
  const [showWord, setShowWord] = React.useState(false);

  const handlePlot = () => {
    setShowMood(true);
  };

  const handlePlace = () => {
    setShowBody(true);
  };

  const handleName = () => {
    setShowWord(true);
  };

  const handleSave = () => {
    if (isComplete) {
      const now = demoNow ?? new Date();
      const window = getTimeWindow(now);
      const source = window === 'EVENING' || window === 'NIGHT' ? 'evening' : 'midday';

      recordCheckin({
        timestamp: now,
        moodQuadrant,
        moodCoordinates: moodCoordinates ?? undefined,
        bodyZone,
        word: moodWord,
        source,
      });

      setBodyZone(null);
      setMoodWord(null);

      Alert.alert('Logged', 'Saved to today.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      <Text style={[styles.title, { color: tokens.textPrimary }]}>Quick Log</Text>
      <View style={[styles.divider, { backgroundColor: tokens.border }]} />

      <View style={styles.steps}>
        {/* Plot */}
        <TouchableOpacity
          style={[
            styles.step,
            {
              backgroundColor: moodQuadrant ? getQuadrantColor(moodQuadrant) + '20' : 'transparent',
              borderColor: moodQuadrant ? getQuadrantColor(moodQuadrant) : tokens.border,
            },
          ]}
          onPress={handlePlot}
          accessibilityRole="button"
          accessibilityLabel="Quick Log Plot"
        >
          <Text style={styles.stepIcon}>◉</Text>
          <Text style={[styles.stepLabel, { color: tokens.textPrimary }]}>
            {moodQuadrant || 'Plot'}
          </Text>
          <Text style={[styles.stepSub, { color: tokens.textSecondary }]}>Mood</Text>
        </TouchableOpacity>

        {/* Place */}
        <TouchableOpacity
          style={[
            styles.step,
            {
              backgroundColor: bodyZone ? tokens.accent + '20' : 'transparent',
              borderColor: bodyZone ? tokens.accent : tokens.border,
            },
          ]}
          onPress={handlePlace}
          accessibilityRole="button"
          accessibilityLabel="Quick Log Place"
        >
          <Text style={styles.stepIcon}>◯</Text>
          <Text style={[styles.stepLabel, { color: tokens.textPrimary }]}>
            {bodyZone || 'Place'}
          </Text>
          <Text style={[styles.stepSub, { color: tokens.textSecondary }]}>Body</Text>
        </TouchableOpacity>

        {/* Name */}
        <TouchableOpacity
          style={[
            styles.step,
            {
              backgroundColor: moodWord ? tokens.accent + '20' : 'transparent',
              borderColor: moodWord ? tokens.accent : tokens.border,
            },
          ]}
          onPress={handleName}
          accessibilityRole="button"
          accessibilityLabel="Quick Log Name"
        >
          <Text style={styles.stepIcon}>⟡</Text>
          <Text
            style={[styles.stepLabel, { color: tokens.textPrimary }]}
            numberOfLines={1}
          >
            {moodWord || 'Name'}
          </Text>
          <Text style={[styles.stepSub, { color: tokens.textSecondary }]}>Word</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: isComplete ? tokens.accent : tokens.border,
            opacity: isComplete ? 1 : 0.5,
          },
        ]}
        onPress={handleSave}
        disabled={!isComplete}
        accessibilityRole="button"
        accessibilityLabel="Quick Log Save"
      >
        <Text style={[styles.saveText, { color: isComplete ? tokens.bgPrimary : tokens.textSecondary }]}>
          SAVE
        </Text>
      </TouchableOpacity>

      <MoodMeterModal
        visible={showMood}
        initialQuadrant={moodQuadrant}
        initialCoordinates={moodCoordinates}
        onCancel={() => setShowMood(false)}
        onConfirm={(quadrant, coordinates) => {
          setMood(quadrant, coordinates);
          setShowMood(false);
        }}
      />

      <BodyMapModal
        visible={showBody}
        selectedZone={bodyZone}
        onCancel={() => setShowBody(false)}
        onSelect={(zone) => {
          setBodyZone(zone);
          setShowBody(false);
        }}
      />

      <WordPickerModal
        visible={showWord}
        quadrant={moodQuadrant}
        selectedWord={moodWord}
        onCancel={() => setShowWord(false)}
        onSelect={(word) => {
          setMoodWord(word);
          setShowWord(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 18,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  steps: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  stepIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  stepLabel: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 12,
    marginBottom: 2,
  },
  stepSub: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 10,
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 14,
    letterSpacing: 0.2,
  },
});
