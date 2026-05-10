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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<RootTabParamList>();

interface TabIconProps {
  icon: TabIconName;
  label: string;
  focused: boolean;
  isLocked?: boolean;
}

type TabIconName = 'home' | 'practice' | 'journal' | 'trends' | 'ladder';

function TabIcon({ icon, label, focused, isLocked }: TabIconProps) {
  const { tokens } = useTheme();
  const iconColor = focused ? tokens.accentStrong : tokens.textSecondary;
  const iconAccent = focused ? tokens.accent : tokens.borderStrong;

  return (
    <View style={styles.tabIconContainer} accessibilityLabel={label}>
      <View
        style={[
          styles.iconPlate,
          {
            backgroundColor: focused ? tokens.accentSoft : 'transparent',
            borderColor: focused ? tokens.accent : tokens.border,
          },
        ]}
      >
        {isLocked ? (
          <View style={styles.lockedMark}>
            <View
              style={[
                styles.lockedSlash,
                { backgroundColor: tokens.textSecondary },
              ]}
            />
          </View>
        ) : (
          <TabGlyph icon={icon} color={iconColor} accent={iconAccent} />
        )}
      </View>
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? tokens.accent : tokens.textSecondary },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
      >
        {label}
      </Text>
    </View>
  );
}

interface TabGlyphProps {
  icon: TabIconName;
  color: string;
  accent: string;
}

function TabGlyph({ icon, color, accent }: TabGlyphProps) {
  switch (icon) {
    case 'home':
      return (
        <View style={styles.glyphBox}>
          <View style={[styles.sunRing, { borderColor: accent }]}>
            <View style={[styles.sunDot, { backgroundColor: color }]} />
          </View>
        </View>
      );
    case 'practice':
      return (
        <View style={styles.glyphBox}>
          <View style={[styles.practiceOuter, { borderColor: color }]}>
            <View style={[styles.practiceInner, { backgroundColor: accent }]} />
          </View>
        </View>
      );
    case 'journal':
      return (
        <View style={styles.glyphBox}>
          <View style={[styles.journalPage, { borderColor: color }]}>
            <View style={[styles.journalLine, { backgroundColor: accent }]} />
            <View style={[styles.journalLineShort, { backgroundColor: accent }]} />
          </View>
        </View>
      );
    case 'trends':
      return (
        <View style={[styles.glyphBox, styles.trendBox]}>
          {[8, 14, 20].map((height, index) => (
            <View
              key={height}
              style={[
                styles.trendBar,
                {
                  height,
                  backgroundColor: index === 2 ? color : accent,
                },
              ]}
            />
          ))}
        </View>
      );
    case 'ladder':
      return (
        <View style={styles.glyphBox}>
          <View style={[styles.ladderRail, styles.ladderRailLeft, { backgroundColor: color }]} />
          <View style={[styles.ladderRail, styles.ladderRailRight, { backgroundColor: color }]} />
          {[5, 12, 19].map((top) => (
            <View
              key={top}
              style={[styles.ladderStep, { top, backgroundColor: accent }]}
            />
          ))}
        </View>
      );
  }
}

export function BottomTabNavigator() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const stability = useAppStore((state) => state.stability);
  const trendsLocked = isTrendsLocked(stability);
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tokens.bgSecondary,
          borderTopColor: tokens.border,
          paddingTop: 8,
          paddingBottom: bottomInset - 4,
          height: 64 + bottomInset,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="practice" label="Practice" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="journal" label="Journal" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Trends"
        component={TrendsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="trends"
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
            <TabIcon icon="ladder" label="Ladder" focused={focused} />
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
    minWidth: 60,
  },
  iconPlate: {
    width: 32,
    height: 28,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  glyphBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  practiceOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  journalPage: {
    width: 17,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    paddingTop: 5,
    paddingHorizontal: 3,
  },
  journalLine: {
    width: 9,
    height: 2,
    borderRadius: 1,
    marginBottom: 4,
  },
  journalLineShort: {
    width: 6,
    height: 2,
    borderRadius: 1,
  },
  trendBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  trendBar: {
    width: 4,
    borderRadius: 2,
  },
  ladderRail: {
    position: 'absolute',
    top: 3,
    width: 2,
    height: 19,
    borderRadius: 1,
  },
  ladderRailLeft: {
    left: 7,
    transform: [{ rotate: '-8deg' }],
  },
  ladderRailRight: {
    right: 7,
    transform: [{ rotate: '8deg' }],
  },
  ladderStep: {
    position: 'absolute',
    left: 7,
    width: 10,
    height: 2,
    borderRadius: 1,
  },
  lockedMark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8A8076',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedSlash: {
    width: 16,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '-35deg' }],
  },
  tabLabel: {
    fontFamily: fontFamilies.text.medium,
    fontSize: 10,
    textAlign: 'center',
  },
});
