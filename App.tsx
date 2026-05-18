import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { LogBox, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ThemeProvider } from './src/theme/ThemeContext';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { useAppStore } from './src/store/useAppStore';
import { OnboardingSequence } from './src/components/onboarding/OnboardingSequence';
import { useDailyCycleStore } from './src/store/useDailyCycleStore';
import { NightModeScreen } from './src/components/flows';
import { fontAssets, fontFamilies } from './src/theme/fonts';
import { refreshSadhanaEntitlement } from './src/billing';
import { RootTabParamList } from './src/navigation/types';
import { useFeedbackLoops } from './src/services/feedbackLoops';
import { NPSPrompt } from './src/components/feedback/NPSPrompt';
import { WelcomeBackBanner } from './src/components/feedback/WelcomeBackBanner';
import { SensoryService, sensoryCounters } from './src/services/SensoryService';
import { useSensoryStore } from './src/store/sensoryStore';
import { uiTestFlags } from './src/utils/uiTestFlags';

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
      Settings: 'open/settings',
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

  // Configure the audio session once at boot so meditation bells play with the
  // ringer switch on and TTS ducks (rather than stops) ambient music. Safe to
  // call repeatedly — SensoryService guards against double-init.
  useEffect(() => {
    void SensoryService.configureAudioSession();
  }, []);

  // XCUITest journey-acceptance hooks. All flags are no-ops in production
  // (launch arguments are absent). See src/utils/uiTestFlags.ts for the
  // enumerated flag surface and ios/SadhanaUITests/JourneyAcceptanceTests.swift
  // for the consuming tests.
  useEffect(() => {
    if (!uiTestFlags.enabled) return;

    // Default-skip onboarding under UITestMode so journey 1 (the keystone
    // tab-render gate) and downstream journeys can rely on the tab bar being
    // present at launch. Tests that want to verify the onboarding route
    // (notably J5 — paywall product fetch) opt back IN with
    // -UITestResetOnboarding 1.
    if (uiTestFlags.resetOnboarding) {
      useAppStore.setState({ hasOnboarded: false, entitlement: null });
    } else {
      useAppStore.setState({ hasOnboarded: true });
    }
    if (uiTestFlags.seedPracticesCompleted !== null) {
      useAppStore.setState({
        totalPracticesCompleted: uiTestFlags.seedPracticesCompleted,
      });
    }
    if (uiTestFlags.voiceGuidanceOff) {
      useSensoryStore.getState().setVoice(false);
    }
  }, []);

  // Sensory counter mirror — re-renders the JSON label whenever counters
  // change so XCUITest can poll a stable accessibility label. Lives only in
  // dev/test builds. The polling loop is cheap (~10 Hz) and short-circuits
  // when the bag is unchanged.
  const [countersJson, setCountersJson] = useState(() => JSON.stringify(sensoryCounters));
  useEffect(() => {
    if (!__DEV__) return;
    let last = countersJson;
    const id = setInterval(() => {
      const next = JSON.stringify(sensoryCounters);
      if (next !== last) {
        last = next;
        setCountersJson(next);
      }
    }, 100);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        {hasOnboarded ? (
          nightModeActiveAt ? (
            <NightModeScreen />
          ) : (
            <AuthenticatedShell />
          )
        ) : (
          <OnboardingSequence />
        )}
        <StatusBar style={statusStyle} />
        {__DEV__ && (
          // Test-observability surface for the XCUITest journey-acceptance
          // suite. Off-screen, zero visual impact, only mounted in dev/test
          // builds. accessibilityLabel is a JSON stringified mirror of the
          // counters in SensoryService.
          <View
            testID="sensory.counters"
            accessibilityLabel={countersJson}
            style={{ position: 'absolute', width: 1, height: 1, top: -1, left: -1 }}
          />
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}

function AuthenticatedShell() {
  const { showNps, closeNps, welcomeBackBanner, dismissWelcomeBack } = useFeedbackLoops();
  return (
    <>
      <BottomTabNavigator />
      {welcomeBackBanner && (
        <WelcomeBackBanner message={welcomeBackBanner} onDismiss={dismissWelcomeBack} />
      )}
      <NPSPrompt visible={showNps} onClose={closeNps} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
