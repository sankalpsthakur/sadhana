import React, { useEffect } from 'react';
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
import { NightModeScreen } from './src/components/flows';
import { fontAssets, fontFamilies } from './src/theme/fonts';
import { refreshSadhanaEntitlement } from './src/billing';
import { RootTabParamList } from './src/navigation/types';
import { useFeedbackLoops } from './src/services/feedbackLoops';
import { NPSPrompt } from './src/components/feedback/NPSPrompt';
import { WelcomeBackBanner } from './src/components/feedback/WelcomeBackBanner';
import { SensoryService } from './src/services/SensoryService';

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
