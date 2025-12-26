import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
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

if (__DEV__) {
  LogBox.ignoreAllLogs(true);
}

function AppContent() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const scheme = useColorScheme();
  const phase = useAppStore((state) => state.phase);
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const nightModeActiveAt = useDailyCycleStore((s) => s.nightModeActiveAt);

  useEffect(() => {
    if (!fontsLoaded || fontError) return;
    Text.defaultProps = Text.defaultProps ?? {};
    Text.defaultProps.allowFontScaling = true;
    const existing = Text.defaultProps.style;
    Text.defaultProps.style = [
      { fontFamily: fontFamilies.text.regular },
      Array.isArray(existing) ? existing : existing ? [existing] : [],
    ];
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const statusStyle = scheme === 'light' ? 'dark' : 'light';

  return (
    <ThemeProvider phase={phase} scheme={scheme === 'light' ? 'light' : 'dark'}>
      <NavigationContainer>
        {hasOnboarded ? (
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
