import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BodyZone } from '../../types';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';

interface BodyMapModalProps {
  visible: boolean;
  selectedZone: BodyZone;
  onCancel: () => void;
  onSelect: (zone: Exclude<BodyZone, null>) => void;
}

const ZONES: Exclude<BodyZone, null>[] = [
  'Head',
  'Jaw',
  'Throat',
  'Chest',
  'Back',
  'Solar',
  'Belly',
  'Pelvis',
  'Hands',
  'Feet',
];

export function BodyMapModal({ visible, selectedZone, onCancel, onSelect }: BodyMapModalProps) {
  const { tokens } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.headerAction, { color: tokens.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tokens.textPrimary }]}>Body Map</Text>
          <View style={{ width: 60 }} />
        </View>

        <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
          Where is it most present right now?
        </Text>

        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {ZONES.map((zone) => {
            const isSelected = selectedZone === zone;
            return (
              <TouchableOpacity
                key={zone}
                style={[
                  styles.zone,
                  {
                    backgroundColor: isSelected ? tokens.accent + '18' : tokens.bgSecondary,
                    borderColor: isSelected ? tokens.accent : tokens.border,
                  },
                ]}
                onPress={() => onSelect(zone)}
              >
                <Text style={[styles.zoneText, { color: tokens.textPrimary }]}>{zone}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  zone: { width: '48%', paddingVertical: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  zoneText: { fontFamily: fontFamilies.text.medium, fontSize: 13 },
});
