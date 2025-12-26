export const persistStorage = {
  getItem: async (name: string) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // no-op
    }
  },
  removeItem: async (name: string) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      // no-op
    }
  },
};

