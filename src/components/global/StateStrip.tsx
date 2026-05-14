import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { useActiveLockCount, useComputedDrift } from '../../store/selectors';
import { fontFamilies } from '../../theme/fonts';

export function StateStrip() {
  const { tokens, getQuadrantColor, quadrants } = useTheme();
  const moodQuadrant = useAppStore((state) => state.moodQuadrant);
  const bodyZone = useAppStore((state) => state.bodyZone);
  const sleepStatus = useAppStore((state) => state.sleepStatus);
  const audit = useAppStore((state) => state.audit);
  const lockCount = useActiveLockCount();
  const drift = useComputedDrift();

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      {/* Row 1: Subjective */}
      <View style={styles.row}>
        <Text style={[styles.rowLabel, { color: tokens.textSecondary }]}>Subjective</Text>
        <View style={styles.tiles}>
          {/* Mood */}
          <TouchableOpacity style={styles.tile}>
            <View
              style={[
                styles.moodDot,
                { backgroundColor: moodQuadrant ? getQuadrantColor(moodQuadrant) : tokens.border },
              ]}
            />
            <Text style={[styles.tileLabel, { color: tokens.textSecondary }]}>
              {moodQuadrant || 'Mood'}
            </Text>
          </TouchableOpacity>

          {/* Body */}
          <TouchableOpacity style={styles.tile}>
            <Text style={[styles.tileValue, { color: tokens.textPrimary }]}>
              {bodyZone || '—'}
            </Text>
            <Text style={[styles.tileLabel, { color: tokens.textSecondary }]}>Body</Text>
          </TouchableOpacity>

          {/* Sleep */}
          <TouchableOpacity style={styles.tile}>
            <Text style={[styles.tileValue, { color: tokens.textPrimary }]}>
              {sleepStatus === 'Protected' ? '✓' : sleepStatus === 'AtRisk' ? '!' : '—'}
            </Text>
            <Text style={[styles.tileLabel, { color: tokens.textSecondary }]}>Sleep</Text>
          </TouchableOpacity>

          {/* Pauses */}
          <TouchableOpacity style={styles.tile}>
            <Text style={[styles.tileValue, { color: lockCount > 0 ? quadrants.Red : tokens.textPrimary }]}>
              {lockCount}
            </Text>
            <Text style={[styles.tileLabel, { color: tokens.textSecondary }]}>Pauses</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: tokens.border }]} />

      {/* Row 2: Audit (Objective) */}
      <View style={styles.row}>
        <Text style={[styles.rowLabel, { color: tokens.textSecondary }]}>Audit</Text>
        <View style={styles.tiles}>
          {/* HRV */}
          <TouchableOpacity style={styles.tile}>
            <Text style={[styles.tileValue, { color: tokens.textPrimary }]}>
              {audit.hrv || '—'}
            </Text>
            <Text style={[styles.tileLabel, { color: tokens.textSecondary }]}>HRV</Text>
          </TouchableOpacity>

          {/* Arousal */}
          <TouchableOpacity style={styles.tile}>
            <Text style={[styles.tileValue, { color: tokens.textPrimary }]}>
              {audit.arousal || '—'}
            </Text>
            <Text style={[styles.tileLabel, { color: tokens.textSecondary }]}>Arousal</Text>
          </TouchableOpacity>

          {/* Move */}
          <TouchableOpacity style={styles.tile}>
            <Text style={[styles.tileValue, { color: tokens.textPrimary }]}>
              {audit.movement || '—'}
            </Text>
            <Text style={[styles.tileLabel, { color: tokens.textSecondary }]}>Move</Text>
          </TouchableOpacity>

          {/* Breath */}
          <TouchableOpacity style={styles.tile}>
            <Text style={[styles.tileValue, { color: tokens.textPrimary }]}>
              {audit.breath || '—'}
            </Text>
            <Text style={[styles.tileLabel, { color: tokens.textSecondary }]}>Breath</Text>
          </TouchableOpacity>

          {/* Temp */}
          <TouchableOpacity style={styles.tile}>
            <Text style={[styles.tileValue, { color: tokens.textPrimary }]}>
              {audit.temp !== null ? (audit.temp > 0 ? `+${audit.temp}` : audit.temp) : '—'}
            </Text>
            <Text style={[styles.tileLabel, { color: tokens.textSecondary }]}>Temp</Text>
          </TouchableOpacity>

          {/* Drift Badge */}
          <View style={styles.driftBadge}>
            <Text
              style={[
                styles.driftIcon,
                {
                  color:
                    drift === 'Aligned'
                      ? quadrants.Green
                      : drift === 'Drift'
                      ? quadrants.Yellow
                      : tokens.textSecondary,
                },
              ]}
            >
              {drift === 'Aligned' ? '✅' : drift === 'Drift' ? '⚠️' : '—'}
            </Text>
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
    gap: 8,
  },
  rowLabel: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  tiles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tileValue: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 12,
    marginBottom: 2,
  },
  tileLabel: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 9,
    letterSpacing: 0.2,
  },
  moodDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  driftBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  driftIcon: {
    fontSize: 14,
  },
});
