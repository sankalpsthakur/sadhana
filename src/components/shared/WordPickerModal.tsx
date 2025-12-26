import React, { useMemo } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MoodQuadrant } from '../../types';
import { useTheme } from '../../theme/useTheme';
import { moodWordsByQuadrant } from '../../mock/moodWords';
import { fontFamilies } from '../../theme/fonts';

interface WordPickerModalProps {
  visible: boolean;
  quadrant: MoodQuadrant;
  selectedWord: string | null;
  onCancel: () => void;
  onSelect: (word: string) => void;
}

export function WordPickerModal({
  visible,
  quadrant,
  selectedWord,
  onCancel,
  onSelect,
}: WordPickerModalProps) {
  const { tokens, quadrants } = useTheme();

  const words = useMemo(() => {
    if (!quadrant) return [];
    return moodWordsByQuadrant[quadrant].slice(0, 24);
  }, [quadrant]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.headerAction, { color: tokens.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tokens.textPrimary }]}>Word</Text>
          <View style={{ width: 60 }} />
        </View>

        {!quadrant ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: tokens.textPrimary }]}>Pick a mood first</Text>
            <Text style={[styles.emptySub, { color: tokens.textSecondary }]}>
              Choose a quadrant on the Mood Meter, then name it.
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
              Choose one word that fits ({quadrant}).
            </Text>

            <ScrollView contentContainerStyle={styles.chips} showsVerticalScrollIndicator={false}>
              {words.map((w) => {
                const isSelected = selectedWord === w;
                const accent = quadrants[quadrant];
                return (
                  <TouchableOpacity
                    key={w}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected ? accent + '20' : tokens.bgSecondary,
                        borderColor: isSelected ? accent : tokens.border,
                      },
                    ]}
                    onPress={() => onSelect(w)}
                  >
                    <Text style={[styles.chipText, { color: tokens.textPrimary }]}>{w}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontFamily: fontFamilies.display.semibold, fontSize: 20, lineHeight: 26 },
  headerAction: { fontFamily: fontFamilies.text.medium, fontSize: 13, width: 60 },
  subtitle: { paddingHorizontal: 20, paddingBottom: 16, fontFamily: fontFamilies.text.regular, fontSize: 13, lineHeight: 20 },
  chips: { paddingHorizontal: 20, paddingBottom: 28, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  chipText: { fontFamily: fontFamilies.text.semibold, fontSize: 13 },
  empty: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  emptyTitle: { fontFamily: fontFamilies.display.semibold, fontSize: 20, lineHeight: 26, marginBottom: 8, textAlign: 'center' },
  emptySub: { fontFamily: fontFamilies.text.regular, fontSize: 13, lineHeight: 20, textAlign: 'center' },
});
