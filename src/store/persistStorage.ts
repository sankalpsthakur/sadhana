import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

const logStorage = (action: 'get' | 'set' | 'remove', name: string, value?: string | null) => {
  if (!__DEV__) return;
  const bytes = value ? value.length : 0;
  console.log('Storage', { action, name, bytes });
};

export const persistStorage: StateStorage = {
  getItem: async (name) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return null;
      const value = window.localStorage.getItem(name);
      logStorage('get', name, value);
      return value;
    }

    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const value = await AsyncStorage.getItem(name);
    logStorage('get', name, value);
    return value;
  },
  setItem: async (name, value) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(name, value);
      logStorage('set', name, value);
      return;
    }

    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem(name, value);
    logStorage('set', name, value);
  },
  removeItem: async (name) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(name);
      logStorage('remove', name);
      return;
    }

    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.removeItem(name);
    logStorage('remove', name);
  },
};
