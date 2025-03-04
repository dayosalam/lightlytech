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

  async forceNavigateToHome(router: any) {
    try {
      await Storage.setHasSeenOnboarding(true);
      router.replace('/(home)');
      console.log('Forced navigation to home screen');
      return true;
    } catch (error) {
      console.error('Error forcing navigation to home:', error);
      return false;
    }
  }
};
