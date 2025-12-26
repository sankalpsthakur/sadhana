import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { MoodQuadrant } from '../../types';
import { formatTimeRemaining } from '../../utils/timeWindow';
import { fontFamilies } from '../../theme/fonts';

interface DreamCaptureProps {
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
  minutesRemaining: number;
}

type LucidityLevel = 'none' | 'semi' | 'full' | 'operator';
type NonNullMoodQuadrant = Exclude<MoodQuadrant, null>;

const SYMBOL_SUGGESTIONS = [
  'Water', 'Fire', 'Flying', 'Falling', 'Chase', 'Death',
  'Animals', 'Family', 'Stranger', 'House', 'Vehicle', 'Stairs',
  'Door', 'Mirror', 'Light', 'Dark', 'Forest', 'Ocean',
  'Mountain', 'Cave', 'Bridge', 'Key', 'Book', 'Clock',
];

/**
 * Dream Capture Flow (Phase 2+)
 *
 * Time-windowed capture (3h from wake) - memory degrades rapidly.
 * Quick capture: mood, lucidity, 1-3 symbols, optional voice note.
 *
 * This teaches:
 * - Attention to inner life
 * - Symbol literacy
 * - Pattern awareness
 */
export function DreamCapture({
  visible,
  onComplete,
  onSkip,
  minutesRemaining,
}: DreamCaptureProps) {
  const { tokens, quadrants } = useTheme();
  const [step, setStep] = useState<'mood' | 'lucidity' | 'symbols' | 'complete'>('mood');
  const [moodOnWaking, setMoodOnWaking] = useState<MoodQuadrant>(null);
  const [lucidity, setLucidity] = useState<LucidityLevel>('none');
  const [symbols, setSymbols] = useState<string[]>([]);
  const [customSymbol, setCustomSymbol] = useState('');
  const [isNightmare, setIsNightmare] = useState(false);

  const captureDream = useDailyCycleStore((s) => s.captureDream);
  const demoNow = useDailyCycleStore((s) => s.demoNow);

  const handleMoodSelect = (mood: NonNullMoodQuadrant) => {
    setMoodOnWaking(mood);
    // Check if it's a nightmare (Red mood on waking)
    if (mood === 'Red') {
      setIsNightmare(true);
    }
    setStep('lucidity');
  };

  const handleLuciditySelect = (level: LucidityLevel) => {
    setLucidity(level);
    setStep('symbols');
  };

  const handleSymbolToggle = (symbol: string) => {
    if (symbols.includes(symbol)) {
      setSymbols(symbols.filter((s) => s !== symbol));
    } else if (symbols.length < 3) {
      setSymbols([...symbols, symbol]);
    }
  };

  const handleAddCustomSymbol = () => {
    if (customSymbol.trim() && symbols.length < 3) {
      setSymbols([...symbols, customSymbol.trim()]);
      setCustomSymbol('');
    }
  };

  const handleSave = () => {
    captureDream({
      capturedAt: demoNow ?? new Date(),
      moodOnWaking: moodOnWaking!,
      lucidityLevel: lucidity,
      symbols,
      isNightmare,
    });

    setStep('complete');
    setTimeout(() => {
      // Reset state
      setStep('mood');
      setMoodOnWaking(null);
      setLucidity('none');
      setSymbols([]);
      setIsNightmare(false);
      onComplete();
    }, 1500);
  };

  const quadrantData: { quadrant: NonNullMoodQuadrant; label: string }[] = [
    { quadrant: 'Red', label: 'Activated' },
    { quadrant: 'Yellow', label: 'Energized' },
    { quadrant: 'Blue', label: 'Depleted' },
    { quadrant: 'Green', label: 'Calm' },
  ];

  const lucidityOptions: { level: LucidityLevel; label: string; description: string }[] = [
    { level: 'none', label: 'Passive', description: 'Watched the dream' },
    { level: 'semi', label: 'Semi-lucid', description: 'Knew it was a dream' },
    { level: 'full', label: 'Lucid', description: 'Could influence the dream' },
    { level: 'operator', label: 'Operator', description: 'Felt in control' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
        {/* Header with timer */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onSkip}>
            <Text style={[styles.skipLink, { color: tokens.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
          <View style={[styles.timerBadge, { backgroundColor: tokens.bgSecondary }]}>
            <Text style={[styles.timerText, { color: tokens.textSecondary }]}>
              Window closes in: {formatTimeRemaining(minutesRemaining)}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Step 1: Mood on waking */}
          {step === 'mood' && (
            <View style={styles.stepContent}>
              <Text style={[styles.title, { color: tokens.textPrimary }]}>
                Night Self
              </Text>
              <View style={[styles.divider, { backgroundColor: tokens.border }]} />

              <Text style={[styles.question, { color: tokens.textPrimary }]}>
                How did you feel on waking?
              </Text>

              <View style={styles.moodGrid}>
                {quadrantData.map(({ quadrant, label }) => (
                  <TouchableOpacity
                    key={quadrant}
                    style={[
                      styles.moodButton,
                      { backgroundColor: tokens.bgSecondary, borderColor: tokens.border },
                    ]}
                    onPress={() => handleMoodSelect(quadrant)}
                  >
                    <View style={[styles.moodMark, { backgroundColor: quadrants[quadrant] }]} />
                    <Text style={[styles.moodLabel, { color: tokens.textSecondary }]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 2: Lucidity */}
          {step === 'lucidity' && (
            <View style={styles.stepContent}>
              <Text style={[styles.title, { color: tokens.textPrimary }]}>
                Lucidity Level
              </Text>
              <View style={[styles.divider, { backgroundColor: tokens.border }]} />

              <View style={styles.lucidityOptions}>
                {lucidityOptions.map(({ level, label, description }) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.lucidityButton,
                      { backgroundColor: tokens.bgSecondary, borderColor: tokens.border },
                    ]}
                    onPress={() => handleLuciditySelect(level)}
                  >
                    <Text style={[styles.lucidityLabel, { color: tokens.textPrimary }]}>
                      {label}
                    </Text>
                    <Text style={[styles.lucidityDesc, { color: tokens.textSecondary }]}>
                      {description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 3: Symbols */}
          {step === 'symbols' && (
            <View style={styles.stepContent}>
              <Text style={[styles.title, { color: tokens.textPrimary }]}>
                Symbols (1-3)
              </Text>
              <View style={[styles.divider, { backgroundColor: tokens.border }]} />

              <Text style={[styles.hint, { color: tokens.textSecondary }]}>
                What appeared in the dream?
              </Text>

              {/* Selected symbols */}
              {symbols.length > 0 && (
                <View style={styles.selectedSymbols}>
                  {symbols.map((symbol) => (
                    <TouchableOpacity
                      key={symbol}
                      style={[styles.selectedChip, { backgroundColor: tokens.accent }]}
                      onPress={() => handleSymbolToggle(symbol)}
                    >
                      <Text style={[styles.selectedChipText, { color: tokens.bgPrimary }]}>
                        {symbol} ×
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Symbol grid */}
              <View style={styles.symbolGrid}>
                {SYMBOL_SUGGESTIONS.map((symbol) => (
                  <TouchableOpacity
                    key={symbol}
                    style={[
                      styles.symbolChip,
                      {
                        backgroundColor: symbols.includes(symbol)
                          ? tokens.accent + '30'
                          : tokens.bgSecondary,
                        borderColor: symbols.includes(symbol) ? tokens.accent : tokens.border,
                      },
                    ]}
                    onPress={() => handleSymbolToggle(symbol)}
                    disabled={symbols.length >= 3 && !symbols.includes(symbol)}
                  >
                    <Text
                      style={[
                        styles.symbolText,
                        {
                          color: symbols.includes(symbol)
                            ? tokens.accent
                            : tokens.textSecondary,
                        },
                      ]}
                    >
                      {symbol}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom symbol input */}
              <View style={styles.customInputRow}>
                <TextInput
                  style={[
                    styles.customInput,
                    { backgroundColor: tokens.bgSecondary, borderColor: tokens.border, color: tokens.textPrimary },
                  ]}
                  placeholder="Other symbol..."
                  placeholderTextColor={tokens.textSecondary}
                  value={customSymbol}
                  onChangeText={setCustomSymbol}
                  onSubmitEditing={handleAddCustomSymbol}
                />
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: tokens.accent }]}
                  onPress={handleAddCustomSymbol}
                  disabled={!customSymbol.trim() || symbols.length >= 3}
                >
                  <Text style={[styles.addButtonText, { color: tokens.bgPrimary }]}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Save button */}
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: symbols.length > 0 ? tokens.accent : tokens.border,
                    opacity: symbols.length > 0 ? 1 : 0.5,
                  },
                ]}
                onPress={handleSave}
                disabled={symbols.length === 0}
              >
                <Text
                  style={[
                    styles.saveButtonText,
                    { color: symbols.length > 0 ? tokens.bgPrimary : tokens.textSecondary },
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && (
            <View style={styles.completeContent}>
              <Text style={styles.completeEmoji}>✓</Text>
              <Text style={[styles.completeText, { color: tokens.textPrimary }]}>
                Dream captured
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  skipLink: {
    fontSize: 14,
  },
  timerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 12,
  },
  scrollContent: {
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  question: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  moodGrid: {
    gap: 12,
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  moodMark: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  moodLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  lucidityOptions: {
    gap: 12,
  },
  lucidityButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  lucidityLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  lucidityDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  selectedSymbols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectedChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedChipText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  symbolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  symbolChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  symbolText: {
    fontSize: 12,
    lineHeight: 16,
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 24,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  completeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  completeEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  completeText: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 26,
    lineHeight: 32,
  },
});
