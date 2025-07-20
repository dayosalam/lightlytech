import { Storage, SecureStorage } from "./storage";

/**
 * Debug utilities for troubleshooting storage and navigation issues
 */
export const StorageDebug = {
  /**
   * Check the current onboarding status
   */
  async checkOnboardingStatus() {
    try {
      const hasSeenOnboarding = await Storage.getHasSeenOnboarding();
      console.log("📱 Onboarding Status:", hasSeenOnboarding);
      return hasSeenOnboarding;
    } catch (error) {
      console.error("❌ Error checking onboarding status:", error);
      return null;
    }
  },

  /**
   * Reset onboarding status (useful for testing)
   */
  async resetOnboarding() {
    try {
      await Storage.setHasSeenOnboarding(false);
      console.log(
        "🔄 Onboarding status reset - user will see onboarding again"
      );
      return true;
    } catch (error) {
      console.error("❌ Error resetting onboarding:", error);
      return false;
    }
  },

  /**
   * Set onboarding as completed (useful for testing)
   */
  async completeOnboarding() {
    try {
      await Storage.setHasSeenOnboarding(true);
      console.log("✅ Onboarding marked as completed");
      return true;
    } catch (error) {
      console.error("❌ Error completing onboarding:", error);
      return false;
    }
  },

  /**
   * Check all storage states for debugging
   */
  async checkAllStates() {
    try {
      const hasSeenOnboarding = await Storage.getHasSeenOnboarding();
      const isAuthenticated = await SecureStorage.getIsAuthenticated();
      const hasConnectedBox = await Storage.getHasConnectedBox();
      const hasToken = !!(await SecureStorage.getAccessToken());
      const hasRefreshToken = !!(await SecureStorage.getRefreshToken());

      const states = {
        hasSeenOnboarding,
        isAuthenticated,
        hasConnectedBox,
        hasToken,
        hasRefreshToken,
      };

      console.log("📊 All Storage States:", states);
      return states;
    } catch (error) {
      console.error("❌ Error checking all states:", error);
      return null;
    }
  },

  /**
   * Clear all storage (complete reset)
   */
  async clearAllStorage() {
    try {
      await Storage.clearAll();
      await SecureStorage.clearAll();
      console.log("🧹 All storage cleared");
      return true;
    } catch (error) {
      console.error("❌ Error clearing storage:", error);
      return false;
    }
  },

  /**
   * Simulate different user states for testing
   */
  async simulateUserState(
    state: "new" | "returning-auth" | "returning-unauth" | "setup-incomplete"
  ) {
    try {
      // Clear everything first
      await this.clearAllStorage();

      switch (state) {
        case "new":
          // Completely new user - should see onboarding
          console.log("🆕 Simulating new user state");
          break;

        case "returning-auth":
          // Returning authenticated user - should go to home
          await Storage.setHasSeenOnboarding(true);
          await SecureStorage.setIsAuthenticated(true);
          await SecureStorage.setTokens("fake-token", "fake-refresh", 3600);
          console.log("👤 Simulating returning authenticated user");
          break;

        case "returning-unauth":
          // Returning user but not authenticated - should go to auth
          await Storage.setHasSeenOnboarding(true);
          console.log("🔓 Simulating returning unauthenticated user");
          break;

        case "setup-incomplete":
          // Authenticated but setup not complete
          await Storage.setHasSeenOnboarding(true);
          await SecureStorage.setIsAuthenticated(true);
          await SecureStorage.setTokens("fake-token", "fake-refresh", 3600);
          await Storage.setHasConnectedBox(false);
          console.log("⚙️ Simulating user with incomplete setup");
          break;
      }

      return true;
    } catch (error) {
      console.error("❌ Error simulating user state:", error);
      return false;
    }
  },
};

// Make it available globally for debugging in console
if (__DEV__) {
  (global as any).StorageDebug = StorageDebug;
  console.log(
    "🔧 StorageDebug available globally. Try: StorageDebug.checkAllStates()"
  );
}
