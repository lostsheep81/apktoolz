import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';

export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  isLoggedIn: false,
  loginUser: async (token, user) => {
    try {
      await Keychain.setGenericPassword('authToken', token);
      set({ token, user, isLoggedIn: true });
    } catch (error) {
      console.error('Error storing token:', error);
    }
  },
  logoutUser: async () => {
    try {
      await Keychain.resetGenericPassword();
      set({ token: null, user: null, isLoggedIn: false });
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  },
  checkAuth: async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        set({ token: credentials.password, isLoggedIn: true });
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  },
}));
