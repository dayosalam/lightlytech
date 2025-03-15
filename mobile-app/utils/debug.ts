import { Storage } from './storage';

export const DebugUtils = {
  async checkOnboardingStatus() {
    try {
      const hasSeenOnboarding = await Storage.getHasSeenOnboarding();
      console.log('Current onboarding status:', hasSeenOnboarding);
      return hasSeenOnboarding;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return null;
    }
  },

  async resetOnboardingStatus() {
    try {
      await Storage.setHasSeenOnboarding(false);
      console.log('Onboarding status reset to false');
      return true;
    } catch (error) {
      console.error('Error resetting onboarding status:', error);
      return false;
    }
  },

  async checkAllUserStates() {
    try {
      const hasSeenOnboarding = await Storage.getHasSeenOnboarding();
      const isAuthenticated = await Storage.getIsAuthenticated();
      const hasConnectedBox = await Storage.getHasConnectedBox();
      
      console.log('=== USER STATE DEBUG ===');
      console.log('Has seen onboarding:', hasSeenOnboarding);
      console.log('Is authenticated:', isAuthenticated);
      console.log('Has connected box:', hasConnectedBox);
      console.log('========================');
      
      return {
        hasSeenOnboarding,
        isAuthenticated,
        hasConnectedBox
      };
    } catch (error) {
      console.error('Error checking user states:', error);
      return null;
    }
  },
  
  async resetAllUserStates() {
    try {
      await Storage.setHasSeenOnboarding(false);
      await Storage.setIsAuthenticated(false);
      await Storage.setHasConnectedBox(false);
      console.log('All user states reset to false');
      return true;
    } catch (error) {
      console.error('Error resetting user states:', error);
      return false;
    }
  },
  
  async setTestUserStates(states: {
    hasSeenOnboarding?: boolean;
    isAuthenticated?: boolean;
    hasConnectedBox?: boolean;
  }) {
    try {
      if (states.hasSeenOnboarding !== undefined) {
        await Storage.setHasSeenOnboarding(states.hasSeenOnboarding);
      }
      if (states.isAuthenticated !== undefined) {
        await Storage.setIsAuthenticated(states.isAuthenticated);
      }
      if (states.hasConnectedBox !== undefined) {
        await Storage.setHasConnectedBox(states.hasConnectedBox);
      }
      
      console.log('User states updated:', states);
      return true;
    } catch (error) {
      console.error('Error setting user states:', error);
      return false;
    }
  },

  forceNavigateToHome(router: any) {
    try {
      router.replace('/(home)');
      console.log('Forced navigation to home');
      return true;
    } catch (error) {
      console.error('Error navigating to home:', error);
      return false;
    }
  }
};
