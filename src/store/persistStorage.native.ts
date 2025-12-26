import AsyncStorage from '@react-native-async-storage/async-storage';

const logStorage = (action: 'get' | 'set' | 'remove', name: string, value?: string | null) => {
  if (!__DEV__) return;
  const bytes = value ? value.length : 0;
  console.log('Storage', { action, name, bytes });
};

export const persistStorage = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    logStorage('get', name, value);
    return value;
  },
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
    logStorage('set', name, value);
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
    logStorage('remove', name);
  },
};
