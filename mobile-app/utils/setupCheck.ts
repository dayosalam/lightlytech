import { Storage } from './storage';
import { router } from 'expo-router';

/**
 * Utility to check if the user has connected their box
 * and navigate to the appropriate screen
 */
export const checkBoxSetup = async (): Promise<boolean> => {
  try {
    // Check if the user has connected their box
    const hasConnectedBox = await Storage.getHasConnectedBox();
    console.log('Setup check - Has connected box:', hasConnectedBox);
    
    // Return the connection status
    return hasConnectedBox;
  } catch (error) {
    console.error('Error checking box setup:', error);
    return false;
  }
};

/**
 * Utility to navigate based on box connection status
 * This can be called after login or when checking setup status
 */
export const navigateBasedOnSetup = async (): Promise<void> => {
  try {
    const hasConnectedBox = await checkBoxSetup();
    
    if (true) {
      // If box is already connected, navigate to home
      router.replace('/(home)');
    } else {
      // If box is not connected, navigate to setup
      router.replace('/setup');
    }
  } catch (error) {
    console.error('Error navigating based on setup:', error);
    // Default to setup if there's an error
    router.replace('/setup');
  }
};
