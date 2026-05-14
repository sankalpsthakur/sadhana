import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { LogBox, Text, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Constants from 'expo-constants';
import { ThemeProvider } from './src/theme/ThemeContext';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { useAppStore } from './src/store/useAppStore';
import { OnboardingSequence } from './src/components/onboarding/OnboardingSequence';
import { useDailyCycleStore } from './src/store/useDailyCycleStore';
import { NightModeScreen } from './src/components/flows';
import { fontAssets, fontFamilies } from './src/theme/fonts';
import { refreshSadhanaEntitlement } from './src/billing';
import { requestHealthPermissions } from './src/health';
import { RootTabParamList } from './src/navigation/types';

// __DEV__-only bypass for App Store screenshot capture. Enabling this skips the
// StoreKit entitlement gate so the simulator can render the entitled views
// without a sandbox tester. NEVER ships in a release build because of __DEV__.
const SCREENSHOT_MODE: boolean =
  __DEV__ &&
  (process.env.EXPO_PUBLIC_SCREENSHOT_MODE === '1' ||
    process.env.EXPO_PUBLIC_SCREENSHOT_MODE === 'true' ||
    Boolean(
      (Constants?.expoConfig?.extra as { SCREENSHOT_MODE?: unknown } | undefined)
        ?.SCREENSHOT_MODE
    ));

// Optional state hints (also __DEV__ only). Used to deterministically place the
// app in a particular phase / view for a given screenshot run without relying
// on UI automation.
const SCREENSHOT_PHASE_RAW = __DEV__ ? process.env.EXPO_PUBLIC_SCREENSHOT_PHASE : undefined;
const SCREENSHOT_PHASE =
  SCREENSHOT_PHASE_RAW && /^[1-7]$/.test(SCREENSHOT_PHASE_RAW)
    ? (Number(SCREENSHOT_PHASE_RAW) as 1 | 2 | 3 | 4 | 5 | 6 | 7)
    : undefined;
const SCREENSHOT_STABILITY_RAW = __DEV__ ? process.env.EXPO_PUBLIC_SCREENSHOT_STABILITY : undefined;
const SCREENSHOT_STABILITY =
  SCREENSHOT_STABILITY_RAW && /^\d+$/.test(SCREENSHOT_STABILITY_RAW)
    ? Math.max(0, Math.min(100, Number(SCREENSHOT_STABILITY_RAW)))
    : undefined;
const SCREENSHOT_REQUEST_HEALTH =
  __DEV__ && process.env.EXPO_PUBLIC_SCREENSHOT_REQUEST_HEALTH === '1';
const SCREENSHOT_LOCK_SERPENT =
  __DEV__ && process.env.EXPO_PUBLIC_SCREENSHOT_LOCK_SERPENT === '1';
const SCREENSHOT_PAYWALL =
  __DEV__ && process.env.EXPO_PUBLIC_SCREENSHOT_PAYWALL === '1';

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
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const nightModeActiveAt = useDailyCycleStore((s) => s.nightModeActiveAt);

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

  const setPhase = useAppStore((state) => state.setPhase);
  const setStability = useAppStore((state) => state.setStability);
  const setLock = useAppStore((state) => state.setLock);

  // __DEV__-only screenshot bypass: short-circuit onboarding + synth a fake
  // active entitlement so the gate below passes without StoreKit.
  // When SCREENSHOT_PAYWALL is set, leave hasOnboarded=false so the
  // OnboardingSequence renders (it then auto-jumps to its paywall step).
  useEffect(() => {
    if (!SCREENSHOT_MODE) return;
    if (SCREENSHOT_PAYWALL) {
      // Do not seed entitlement/onboarding — we want the paywall view.
      return;
    }
    if (!hasOnboarded) {
      completeOnboarding();
    }
    if (!entitlement?.active) {
      setEntitlement({
        active: true,
        source: 'active-subscription',
        productId: 'com.sadhana.premium.annual',
        checkedAt: new Date().toISOString(),
      });
    }
    if (SCREENSHOT_PHASE !== undefined) {
      setPhase(SCREENSHOT_PHASE);
    }
    if (SCREENSHOT_STABILITY !== undefined) {
      setStability(SCREENSHOT_STABILITY);
    }
    if (SCREENSHOT_LOCK_SERPENT) {
      setLock('serpent', true);
    }
  }, [
    hasOnboarded,
    entitlement?.active,
    completeOnboarding,
    setEntitlement,
    setPhase,
    setStability,
    setLock,
  ]);

  // Fire the HealthKit permission dialog after the entitled view mounts so the
  // sheet is on-screen when the simulator screenshot is taken.
  useEffect(() => {
    if (!SCREENSHOT_MODE || !SCREENSHOT_REQUEST_HEALTH) return;
    if (!entitlement?.active) return;
    const timer = setTimeout(() => {
      requestHealthPermissions().catch(() => {
        // swallow — only used for capture
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [entitlement?.active]);

  useEffect(() => {
    if (SCREENSHOT_MODE) return;
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
