import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { useDailyCycleStore } from '../../store/useDailyCycleStore';
import { getAvailableTools } from '../../mock/tools';
import { ToolCard } from './ToolCard';
import { getCooldownStatus } from '../../utils/cooldowns';
import { fontFamilies } from '../../theme/fonts';

export function ModeToolsGrid() {
  const { tokens } = useTheme();
  const phase = useAppStore((state) => state.phase);
  const mode = useAppStore((state) => state.mode);
  const netiCooldownEndsAt = useAppStore((state) => state.netiCooldownEndsAt);
  const serpentCooldownEndsAt = useAppStore((state) => state.serpentCooldownEndsAt);
  const demoNow = useDailyCycleStore((s) => s.demoNow);
  const now = demoNow ?? new Date();
  const netiCooldown = getCooldownStatus(netiCooldownEndsAt, now);
  const serpentCooldown = getCooldownStatus(serpentCooldownEndsAt, now);

  const tools = getAvailableTools(phase, mode)
    .map((tool) => {
      if (tool.id === 'neti-protocol' && netiCooldown) {
        return { ...tool, state: 'Cooldown' as const, cooldownRemaining: netiCooldown.label };
      }
      if (tool.id === 'sushumna-rise' && serpentCooldown) {
        return { ...tool, state: 'Cooldown' as const, cooldownRemaining: serpentCooldown.label };
      }
      return tool;
    })
    .slice(0, 3); // Max 3 tools

  const handleToolPress = (toolId: string) => {
    Alert.alert('Tool Selected', `Starting ${toolId}...`);
  };

  if (tools.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: tokens.bgSecondary, borderColor: tokens.border }]}>
      <Text style={[styles.title, { color: tokens.textPrimary }]}>Mode Tools</Text>
      <Text style={[styles.subtitle, { color: tokens.textSecondary }]}>
        Available for {mode} mode
      </Text>

      <View style={styles.grid}>
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onPress={() => handleToolPress(tool.id)}
          />
        ))}
      </View>
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
  subtitle: {
    fontFamily: fontFamilies.text.regular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
});
