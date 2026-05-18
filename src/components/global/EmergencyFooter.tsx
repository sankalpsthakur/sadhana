import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/fonts';
import { useAppStore } from '../../store/useAppStore';
import { GroundingModal } from '../shared/GroundingModal';

export function EmergencyFooter() {
  const { tokens, safety } = useTheme();
  const setLock = useAppStore((s) => s.setLock);
  const [groundingMode, setGroundingMode] = useState<'breath' | 'bodyscan' | null>(null);

  const handleEmergencyPress = () => {
    Alert.alert(
      'Emergency Downshift',
      'This will activate Kavacha (Armor) mode and lock all intensity practices. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Activate',
          style: 'destructive',
          onPress: () => {
            setLock('kavacha', true);
            setGroundingMode('bodyscan');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: safety.red + '20', borderColor: safety.red }]}
        onPress={handleEmergencyPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Emergency Downshift"
      >
        <Text style={[styles.icon]}>⚡</Text>
        <Text style={[styles.text, { color: safety.red }]}>Emergency Downshift</Text>
      </TouchableOpacity>
      <GroundingModal
        visible={groundingMode !== null}
        mode={groundingMode ?? 'bodyscan'}
        // Emergency flow doesn't log a practice entry, so any outcome dismisses.
        onClose={() => setGroundingMode(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 14,
  },
});
