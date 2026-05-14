import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { LogBox, Text, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ThemeProvider } from './src/theme/ThemeContext';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { useAppStore } from './src/store/useAppStore';
import { OnboardingSequence } from './src/components/onboarding/OnboardingSequence';
import { useDailyCycleStore } from './src/store/useDailyCycleStore';
import { NightModeScreen, PhaseOpenCeremony } from './src/components/flows';
import { fontAssets, fontFamilies } from './src/theme/fonts';
import { refreshSadhanaEntitlement } from './src/billing';
import { RootTabParamList } from './src/navigation/types';
import type { Phase } from './src/types';

type TextDefaults = {
  allowFontScaling?: boolean;
  style?: React.ComponentProps<typeof Text>['style'];
};

if (__DEV__) {
  LogBox.ignoreAllLogs(true);
}

const linking: LinkingOptions<RootTabParamList> = {
  prefixes: ['sadhyo://', 'sadhana://'],
  config: {
    screens: {
      Home: 'open/home',
      Practice: 'practice',
      Journal: 'flow/dream-capture',
      Trends: 'open/trends',
      Ladder: 'open/ladder',
    },
  },
};

function AppContent() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const scheme = useColorScheme();
  const phase = useAppStore((state) => state.phase);
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const entitlement = useAppStore((state) => state.entitlement);
  const setEntitlement = useAppStore((state) => state.setEntitlement);
  const clearEntitlement = useAppStore((state) => state.clearEntitlement);
  const nightModeActiveAt = useDailyCycleStore((s) => s.nightModeActiveAt);

  // Phase-open ceremony — fires when the user crosses *up* into a new phase.
  // We hold the last-seen phase in a ref so a remount doesn't retrigger the
  // ceremony for the same phase. The initial value is the persisted phase,
  // so the very first render does not fire.
  const lastPhaseRef = useRef<Phase>(phase);
  const [ceremony, setCeremony] = useState<{
    visible: boolean;
    phase: Phase;
    previousPhase: Phase;
  }>({ visible: false, phase, previousPhase: phase });

  useEffect(() => {
    if (!hasOnboarded) {
      // Don't fire during onboarding — phase changes there are setup, not progression.
      lastPhaseRef.current = phase;
      return;
    }
    const prev = lastPhaseRef.current;
    if (phase > prev) {
      setCeremony({ visible: true, phase, previousPhase: prev });
    }
    lastPhaseRef.current = phase;
  }, [phase, hasOnboarded]);

  useEffect(() => {
    if (!fontsLoaded || fontError) return;
    const textWithDefaults = Text as typeof Text & { defaultProps?: TextDefaults };
    textWithDefaults.defaultProps = textWithDefaults.defaultProps ?? {};
    textWithDefaults.defaultProps.allowFontScaling = true;
    const existing = textWithDefaults.defaultProps.style;
    textWithDefaults.defaultProps.style = [
      { fontFamily: fontFamilies.text.regular },
      Array.isArray(existing) ? existing : existing ? [existing] : [],
    ];
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (!hasOnboarded) return;

    let cancelled = false;
    refreshSadhanaEntitlement()
      .then((snapshot) => {
        if (cancelled) return;
        if (snapshot.active) {
          setEntitlement(snapshot);
          return;
        }
        clearEntitlement();
      })
      .catch(() => {
        if (!cancelled && !entitlement?.active) {
          clearEntitlement();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasOnboarded, entitlement?.active, setEntitlement, clearEntitlement]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const statusStyle = scheme === 'light' ? 'dark' : 'light';

  return (
    <ThemeProvider phase={phase} scheme={scheme === 'light' ? 'light' : 'dark'}>
      <NavigationContainer linking={linking}>
        {hasOnboarded && entitlement?.active ? (
          nightModeActiveAt ? (
            <NightModeScreen />
          ) : (
            <BottomTabNavigator />
          )
        ) : (
          <OnboardingSequence />
        )}
        <StatusBar style={statusStyle} />
        <PhaseOpenCeremony
          visible={ceremony.visible}
          phase={ceremony.phase}
          previousPhase={ceremony.previousPhase}
          onDismiss={() => setCeremony((c) => ({ ...c, visible: false }))}
        />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
