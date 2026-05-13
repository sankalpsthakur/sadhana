import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { StateStorage } from 'zustand/middleware';

const logStorage = (action: 'get' | 'set' | 'remove', name: string, value?: string | null) => {
  if (!__DEV__) return;
  const bytes = value ? value.length : 0;
  console.log('SecureStorage', { action, name, bytes });
};

export const persistStorage: StateStorage = {
  getItem: async (name: string) => {
    const value = await SecureStore.getItemAsync(name);
    if (value !== null) {
      logStorage('get', name, value);
      return value;
    }

    const legacyValue = await AsyncStorage.getItem(name);
    if (legacyValue !== null) {
      await SecureStore.setItemAsync(name, legacyValue);
      await AsyncStorage.removeItem(name);
      logStorage('set', name, legacyValue);
      return legacyValue;
    }

    logStorage('get', name, value);
    return value;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
    await AsyncStorage.removeItem(name);
    logStorage('set', name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
    await AsyncStorage.removeItem(name);
    logStorage('remove', name);
  },
};
