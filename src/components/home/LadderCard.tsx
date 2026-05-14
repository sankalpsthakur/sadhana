import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { phaseInfo } from '../../mock/phases';
import { fontFamilies } from '../../theme/fonts';
import type { RootTabParamList } from '../../navigation/types';

export function LadderCard() {
  const { tokens } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const phase = useAppStore((state) => state.phase);

  const currentInfo = phaseInfo[phase];

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.label, { color: tokens.textSecondary }]}>Chosen Gate</Text>
          <Text style={[styles.phaseName, { color: tokens.textPrimary }]}>
            {currentInfo.obstacle}
          </Text>
          <Text style={[styles.chakra, { color: tokens.textSecondary }]}>
            {currentInfo.chakra} • {currentInfo.chakraLocation}
          </Text>
        </View>

        <View style={styles.nextBadge}>
          <Text style={[styles.nextLabel, { color: tokens.textSecondary }]}>Premium</Text>
          <Text style={[styles.nextName, { color: tokens.accent }]}>All Gates</Text>
        </View>
      </View>

      <Text style={[styles.requirement, { color: tokens.textSecondary }]}>
        {currentInfo.promise} You can switch gates at any time; safety checks only limit practices that need a steadier state.
      </Text>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Ladder')}>
        <Text style={[styles.linkText, { color: tokens.accent }]}>View your Path</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  phaseName: {
    fontFamily: fontFamilies.display.semibold,
    fontSize: 20,
    lineHeight: 26,
    marginTop: 2,
  },
  chakra: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    marginTop: 2,
  },
  nextBadge: {
    alignItems: 'flex-end',
  },
  nextLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  nextName: {
    fontFamily: fontFamilies.text.semibold,
    fontSize: 13,
  },
  requirement: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  link: {
    marginTop: 12,
  },
  linkText: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 12,
  },
});
