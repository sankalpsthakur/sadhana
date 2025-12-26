import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { Mission } from '../../types/dailyCycle';
import { fontFamilies } from '../../theme/fonts';

interface MissionSelectProps {
  visible: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

type MissionDraft = Omit<Mission, 'acceptedAt' | 'status' | 'resolvedAt' | 'reflection'>;

const seedMissions: MissionDraft[] = [
  {
    id: 'R1-01',
    pillar: 'restraint',
    tier: 'ember',
    title: 'The Pause',
    instruction: 'When the impulse hits, pause for 90 seconds. No action. Just witness.',
  },
  {
    id: 'T2-01',
    pillar: 'truth',
    tier: 'flame',
    title: 'One Clean Sentence',
    instruction: 'Write one sentence you have been avoiding. Save it. Do not send it today.',
  },
  {
    id: 'S1-02',
    pillar: 'service',
    tier: 'ember',
    title: 'Small Repair',
    instruction: 'Do one small repair for someone: fix, clarify, or close a loop.',
  },
  {
    id: 'O2-03',
    pillar: 'output',
    tier: 'flame',
    title: 'Ship One Block',
    instruction: 'Produce one tangible block of work in 25 minutes. Stop when the timer ends.',
  },
  {
    id: 'RC1-01',
    pillar: 'recovery',
    tier: 'ember',
    title: 'Return to Green',
    instruction: 'Take a 10-minute downshift. Breath, water, walk. End only when calmer.',
  },
];

export function MissionSelect({ visible, onComplete, onCancel }: MissionSelectProps) {
  const { tokens } = useTheme();
  const acceptMission = useDailyCycleStore((s) => s.acceptMission);

  const missions = useMemo(() => seedMissions, []);

  const handleAccept = (mission: MissionDraft) => {
    acceptMission(mission);
    onComplete();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[styles.container, { backgroundColor: tokens.bgPrimary }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.cancelText, { color: tokens.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>Select a Mission</Text>
          <View style={{ width: 60 }} />
        </View>

        <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
          One clean action for today. Choose deliberately.
        </Text>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {missions.map((mission) => (
            <TouchableOpacity
              key={mission.id}
              style={[styles.card, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}
              onPress={() => handleAccept(mission)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: tokens.textPrimary }]}>{mission.title}</Text>
                <View style={[styles.badge, { backgroundColor: tokens.accent + '20' }]}>
                  <Text style={[styles.badgeText, { color: tokens.accent }]}>
                    {mission.pillar.toUpperCase()} • {mission.tier.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cardBody, { color: tokens.textSecondary }]}>
                {mission.instruction}
              </Text>
              <Text style={[styles.cardMeta, { color: tokens.textSecondary }]}>
                {mission.id}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cancelText: { fontFamily: fontFamilies.text.medium, fontSize: 13, width: 60 },
  title: { fontFamily: fontFamilies.display.semibold, fontSize: 20, lineHeight: 26 },
  subtitle: { fontFamily: fontFamilies.text.regular, fontSize: 13, lineHeight: 20, paddingHorizontal: 20, paddingBottom: 16 },
  scroll: { flex: 1 },
  list: { paddingHorizontal: 20, paddingBottom: 28, gap: 12 },
  card: { padding: 16, borderRadius: 14, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  cardTitle: { fontFamily: fontFamilies.text.semibold, fontSize: 16, lineHeight: 22, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeText: { fontFamily: fontFamilies.text.medium, fontSize: 11, letterSpacing: 0.4 },
  cardBody: { fontFamily: fontFamilies.text.regular, fontSize: 13, lineHeight: 20, marginTop: 8 },
  cardMeta: { fontFamily: fontFamilies.text.medium, fontSize: 11, letterSpacing: 0.2, marginTop: 10 },
});
