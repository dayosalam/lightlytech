import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: 'hasSeenOnboarding',
  HAS_CONNECTED_BOX: 'hasConnectedBox',
  IS_AUTHENTICATED: 'isAuthenticated',
  USER_TOKEN: 'userToken',
};

const Storage = {
  async setHasSeenOnboarding(value: boolean) {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, JSON.stringify(value));
  },

  async getHasSeenOnboarding(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
    return value ? JSON.parse(value) : false;
  },

  async setHasConnectedBox(value: boolean) {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_CONNECTED_BOX, JSON.stringify(value));
  },

  async getHasConnectedBox(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_CONNECTED_BOX);
    return value ? JSON.parse(value) : false;
  },

  async setIsAuthenticated(value: boolean) {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, JSON.stringify(value));
  },

  async getIsAuthenticated(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
    return value ? JSON.parse(value) : false;
  },

  // Generic methods for storing and retrieving any data
  async setItem(key: string, value: any) {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  },

  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  },

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  },

  async clearAll() {
    await AsyncStorage.clear();
  }
};


const SecureStorage = {
    async setItem(key: string, value: any) {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await SecureStore.setItemAsync(key, stringValue);
    },

    async getItem(key: string): Promise<string | null> {
        return await SecureStore.getItemAsync(key);
    },

    async removeItem(key: string) {
        await SecureStore.deleteItemAsync(key);
    },

    async setIsAuthenticated(value: boolean) {
        await SecureStore.setItemAsync(STORAGE_KEYS.IS_AUTHENTICATED, JSON.stringify(value));
    },

    async getIsAuthenticated(): Promise<boolean> {
        const value = await SecureStore.getItemAsync(STORAGE_KEYS.IS_AUTHENTICATED);
        return value ? JSON.parse(value) : false;
    },

    async clearAll() {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_TOKEN);
    }
};


export { Storage, SecureStorage };
