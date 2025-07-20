import { SecureStorage } from "./storage";
import { refreshToken } from "@/api/auth";

/**
 * Token management utility that handles token validation and refresh
 */
export class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<boolean> | null = null;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Check if the current access token is valid
   */
  async isTokenValid(): Promise<boolean> {
    try {
      const token = await SecureStorage.getAccessToken();
      if (!token) return false;

      const isExpired = await SecureStorage.isTokenExpired();

      console.log(isExpired);
      return !isExpired;
    } catch (error) {
      console.error("Error checking token validity:", error);
      return false;
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  async getValidToken(): Promise<string | null> {
    try {
      const isValid = await this.isTokenValid();

      if (isValid) {
        return await SecureStorage.getAccessToken();
      }

      // Token is expired or invalid, try to refresh
      const refreshSuccess = await this.refreshTokens();

      if (refreshSuccess) {
        return await SecureStorage.getAccessToken();
      }

      return null;
    } catch (error) {
      console.error("Error getting valid token:", error);
      return null;
    }
  }

  /**
   * Refresh the access token using the refresh token
   * Uses a singleton pattern to prevent multiple concurrent refresh attempts
   */
  async refreshTokens(): Promise<boolean> {
    if (this.refreshPromise) {
      console.log("🔄 Token refresh already in progress, waiting...");
      return await this.refreshPromise;
    }

    this.refreshPromise = this._performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async _performTokenRefresh(): Promise<boolean> {
    try {
      console.log("🔄 Starting token refresh...");

      const refreshTokenValue = await SecureStorage.getRefreshToken();

      if (!refreshTokenValue) {
        console.log("❌ No refresh token available");
        return false;
      }

      const response = await refreshToken(refreshTokenValue);

      if (response && response.access_token) {
        console.log("✅ Token refresh successful");

        // Store new tokens
        await SecureStorage.setTokens(
          response.access_token,
          response.refresh_token || refreshTokenValue,
          response.expires_in
        );

        return true;
      }

      console.log("❌ Token refresh failed - invalid response");
      return false;
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      return false;
    }
  }

  /**
   * Clear all tokens and authentication state
   */
  async clearTokens(): Promise<void> {
    try {
      await SecureStorage.clearAll();
      console.log("✅ All tokens cleared");
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  }

  /**
   * Check if user has valid authentication
   */
  async hasValidAuth(): Promise<boolean> {
    try {
      const isAuthenticated = await SecureStorage.getIsAuthenticated();
      const hasValidToken = await this.isTokenValid();
      const hasRefreshToken = !!(await SecureStorage.getRefreshToken());

      return isAuthenticated && (hasValidToken || hasRefreshToken);
    } catch (error) {
      console.error("Error checking auth validity:", error);
      return false;
    }
  }
}

// Export a singleton instance
export const tokenManager = TokenManager.getInstance();
