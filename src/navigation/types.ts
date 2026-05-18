import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  Home: undefined;
  Practice: undefined;
  Journal: undefined;
  Trends: undefined;
  Ladder: undefined;
  Settings: undefined;
};

export type HomeScreenProps = BottomTabScreenProps<RootTabParamList, 'Home'>;
export type PracticeScreenProps = BottomTabScreenProps<RootTabParamList, 'Practice'>;
export type JournalScreenProps = BottomTabScreenProps<RootTabParamList, 'Journal'>;
export type TrendsScreenProps = BottomTabScreenProps<RootTabParamList, 'Trends'>;
export type LadderScreenProps = BottomTabScreenProps<RootTabParamList, 'Ladder'>;
export type SettingsScreenProps = BottomTabScreenProps<RootTabParamList, 'Settings'>;
