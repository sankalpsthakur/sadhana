import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { getStabilityBand, getStabilityPips } from '../../store/selectors';
import { phaseInfo } from '../../mock/phases';
import { modeInfo } from '../../mock/modes';
import { fontFamilies } from '../../theme/fonts';

export function ModeHeader() {
  const { tokens, getConfidenceColor, getBandColor } = useTheme();
  const phase = useAppStore((state) => state.phase);
  const mode = useAppStore((state) => state.mode);
  const confidence = useAppStore((state) => state.confidence);
  const stability = useAppStore((state) => state.stability);

  const info = phaseInfo[phase];
  const mInfo = modeInfo[mode];
  const band = getStabilityBand(stability);
  const pips = getStabilityPips(stability);

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      <View style={styles.row}>
        {/* Phase Chip */}
        <TouchableOpacity style={[styles.chip, { borderColor: tokens.accent }]}>
          <Text style={[styles.chipLabel, { color: tokens.accent }]}>◉ {info.name}</Text>
          <Text style={[styles.chipSub, { color: tokens.textSecondary }]}>({info.chakra})</Text>
        </TouchableOpacity>

        {/* Mode Chip */}
        <TouchableOpacity style={[styles.chip, { borderColor: tokens.border }]}>
          <Text style={[styles.chipLabel, { color: tokens.textPrimary }]}>⚙ {mode}</Text>
          <Text style={[styles.chipSub, { color: getConfidenceColor(confidence) }]}>
            {confidence}
          </Text>
        </TouchableOpacity>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* On-device privacy indicator */}
        <View
          style={[styles.privacyChip, { backgroundColor: tokens.bgPrimary, borderColor: tokens.border }]}
          accessibilityRole="text"
          accessibilityLabel="On-device privacy: data stays local"
        >
          <Text style={[styles.privacyText, { color: tokens.textSecondary }]}>On-device</Text>
        </View>

        {/* Date */}
        <Text style={[styles.date, { color: tokens.textSecondary }]}>{today}</Text>

        {/* Stability Band */}
        <View style={styles.bandContainer}>
          <Text style={[styles.bandLabel, { color: getBandColor(band) }]}>{band}</Text>
          <View style={styles.pips}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={[
                  styles.pip,
                  {
                    backgroundColor: i <= pips ? getBandColor(band) : tokens.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  chipLabel: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 12,
  },
  chipSub: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
  },
  spacer: {
    flex: 1,
  },
  date: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 11,
  },
  privacyChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  privacyText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 11,
  },
  bandContainer: {
    alignItems: 'flex-end',
  },
  bandLabel: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 10,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  pips: {
    flexDirection: 'row',
    gap: 2,
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
