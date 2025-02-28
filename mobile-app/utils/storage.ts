import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: 'hasSeenOnboarding',
};

const Storage = {
  async setHasSeenOnboarding(value: boolean) {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, JSON.stringify(value));
  },

  async getHasSeenOnboarding(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
    return value ? JSON.parse(value) : false;
  },

  async clearAll() {
    await AsyncStorage.clear();
  }
};

export { Storage };
