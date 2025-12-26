import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  LayoutChangeEvent,
} from 'react-native';
import { MoodCoordinates, MoodQuadrant } from '../../types';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';

interface MoodMeterModalProps {
  visible: boolean;
  initialQuadrant: MoodQuadrant;
  initialCoordinates: MoodCoordinates | null;
  onCancel: () => void;
  onConfirm: (quadrant: Exclude<MoodQuadrant, null>, coordinates: MoodCoordinates) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function defaultCoordinatesForQuadrant(quadrant: Exclude<MoodQuadrant, null>): MoodCoordinates {
  const highEnergy = quadrant === 'Red' || quadrant === 'Yellow';
  const pleasant = quadrant === 'Green' || quadrant === 'Yellow';
  return { x: highEnergy ? 0.7 : -0.7, y: pleasant ? 0.7 : -0.7 };
}

export function MoodMeterModal({
  visible,
  initialQuadrant,
  initialCoordinates,
  onCancel,
  onConfirm,
}: MoodMeterModalProps) {
  const { tokens, quadrants } = useTheme();
  const [selectedQuadrant, setSelectedQuadrant] = useState<MoodQuadrant>(initialQuadrant);
  const [coords, setCoords] = useState<MoodCoordinates | null>(initialCoordinates);
  const [chartSize, setChartSize] = useState<{ width: number; height: number } | null>(null);

  const quadrantOptions = useMemo(
    () =>
      ([
        { quadrant: 'Red', label: 'High / Low' },
        { quadrant: 'Yellow', label: 'High / High' },
        { quadrant: 'Blue', label: 'Low / Low' },
        { quadrant: 'Green', label: 'Low / High' },
      ] as const),
    []
  );

  const dotPosition = useMemo(() => {
    if (!chartSize || !coords) return null;
    const x = (coords.x + 1) / 2;
    const y = 1 - (coords.y + 1) / 2;
    return { left: x * chartSize.width, top: y * chartSize.height };
  }, [chartSize, coords]);

  const handleQuadrantPress = (quadrant: Exclude<MoodQuadrant, null>) => {
    setSelectedQuadrant(quadrant);
    setCoords((current) => current ?? defaultCoordinatesForQuadrant(quadrant));
  };

  const handleChartLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setChartSize({ width, height });
  };

  const handleChartPress = (e: any) => {
    if (!chartSize) return;
    const x = clamp((e.nativeEvent.locationX / chartSize.width) * 2 - 1, -1, 1);
    const y = clamp(1 - (e.nativeEvent.locationY / chartSize.height) * 2, -1, 1);
    setCoords({ x, y });
  };

  const canConfirm = selectedQuadrant !== null;
  const confirmCoords =
    coords ??
    (selectedQuadrant ? defaultCoordinatesForQuadrant(selectedQuadrant) : null);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.headerAction, { color: tokens.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tokens.textPrimary }]}>Mood Meter</Text>
          <TouchableOpacity
            disabled={!canConfirm || !confirmCoords}
            onPress={() => {
              if (!selectedQuadrant || !confirmCoords) return;
              onConfirm(selectedQuadrant, confirmCoords);
            }}
          >
            <Text
              style={[
                styles.headerAction,
                { color: canConfirm ? tokens.accent : tokens.textSecondary },
              ]}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
          Tap a quadrant, then refine the dot if you want.
        </Text>

        <View style={styles.grid}>
          {quadrantOptions.map(({ quadrant, label }) => {
            const isSelected = selectedQuadrant === quadrant;
            return (
              <TouchableOpacity
                key={quadrant}
                style={[
                  styles.quadrant,
                  {
                    borderColor: isSelected ? quadrants[quadrant] : tokens.border,
                    backgroundColor: isSelected ? quadrants[quadrant] + '18' : tokens.bgSecondary,
                  },
                ]}
                onPress={() => handleQuadrantPress(quadrant)}
              >
                <Text
                  style={[
                    styles.quadrantTitle,
                    { color: isSelected ? quadrants[quadrant] : tokens.textPrimary },
                  ]}
                >
                  {quadrant}
                </Text>
                <Text style={[styles.quadrantLabel, { color: tokens.textSecondary }]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: tokens.textPrimary }]}>Fine tune</Text>
          <Pressable
            onLayout={handleChartLayout}
            onPress={handleChartPress}
            style={[styles.chart, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
          >
            <View style={[styles.axisHorizontal, { backgroundColor: tokens.border }]} />
            <View style={[styles.axisVertical, { backgroundColor: tokens.border }]} />
            {dotPosition && (
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: selectedQuadrant ? quadrants[selectedQuadrant] : tokens.accent,
                    left: dotPosition.left - 6,
                    top: dotPosition.top - 6,
                  },
                ]}
              />
            )}
          </Pressable>

          <View style={styles.axisLabels}>
            <Text style={[styles.axisLabel, { color: tokens.textSecondary }]}>Low energy</Text>
            <Text style={[styles.axisLabel, { color: tokens.textSecondary }]}>High energy</Text>
          </View>
          <View style={styles.axisLabels}>
            <Text style={[styles.axisLabel, { color: tokens.textSecondary }]}>Low pleasant</Text>
            <Text style={[styles.axisLabel, { color: tokens.textSecondary }]}>High pleasant</Text>
          </View>
        </View>
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
  headerAction: { fontFamily: fontFamilies.text.medium, fontSize: 13 },
  subtitle: { paddingHorizontal: 20, paddingBottom: 16, fontFamily: fontFamilies.text.regular, fontSize: 13, lineHeight: 20 },
  grid: { paddingHorizontal: 20, gap: 10, flexDirection: 'row', flexWrap: 'wrap' },
  quadrant: { width: '48%', padding: 12, borderRadius: 12, borderWidth: 1 },
  quadrantTitle: { fontFamily: fontFamilies.text.semibold, fontSize: 14, marginBottom: 2 },
  quadrantLabel: { fontFamily: fontFamilies.text.regular, fontSize: 12 },
  chartContainer: { paddingHorizontal: 20, paddingTop: 18 },
  chartTitle: { fontFamily: fontFamilies.display.semibold, fontSize: 16, lineHeight: 22, marginBottom: 10 },
  chart: { height: 240, borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  axisHorizontal: { position: 'absolute', left: 0, right: 0, top: '50%', height: 1 },
  axisVertical: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1 },
  dot: { position: 'absolute', width: 12, height: 12, borderRadius: 6 },
  axisLabels: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  axisLabel: { fontFamily: fontFamilies.text.regular, fontSize: 11 },
});
