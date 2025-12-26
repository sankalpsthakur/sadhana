import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { RootTabParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { JournalScreen } from '../screens/JournalScreen';
import { TrendsScreen } from '../screens/TrendsScreen';
import { LadderScreen } from '../screens/LadderScreen';
import { useTheme } from '../theme/useTheme';
import { useAppStore } from '../store/useAppStore';
import { isTrendsLocked } from '../store/selectors';
import { fontFamilies } from '../theme/fonts';

const Tab = createBottomTabNavigator<RootTabParamList>();

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
  isLocked?: boolean;
}

function TabIcon({ icon, label, focused, isLocked }: TabIconProps) {
  const { tokens } = useTheme();

  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}>
        {isLocked ? '⊘' : icon}
      </Text>
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? tokens.accent : tokens.textSecondary },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export function BottomTabNavigator() {
  const { tokens } = useTheme();
  const stability = useAppStore((state) => state.stability);
  const trendsLocked = isTrendsLocked(stability);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tokens.bgSecondary,
          borderTopColor: tokens.border,
          paddingTop: 8,
          height: 80,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⌂" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="◎" label="Practice" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⟡" label="Journal" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Trends"
        component={TrendsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="◫"
              label="Trends"
              focused={focused}
              isLocked={trendsLocked}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Ladder"
        component={LadderScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="△" label="Ladder" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 10,
  },
});
