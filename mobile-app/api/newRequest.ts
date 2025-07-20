import axios from "axios";
import { SecureStorage } from "@/utils/storage";
import { tokenManager } from "@/utils/tokenManager";

// Try different base URLs for development
const API_URL = "https://lightlytech-backend.vercel.app/api";

// Create a global variable to store auth callback
let onAuthFailure: (() => void) | null = null;

export const setAuthFailureCallback = (callback: () => void) => {
  onAuthFailure = callback;
};

const newRequest = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
  withCredentials: true, // Include credentials in cross-origin requests
});

// Request interceptor
newRequest.interceptors.request.use(
  async (config) => {
    try {
      console.log(
        `🚀 Making ${config.method?.toUpperCase()} request to: ${
          config.baseURL
        }${config.url}`
      );

      // Define endpoints that don't require authentication
      const publicEndpoints = [
        "/auth/signin",
        "/auth/signup",
        "/auth/refresh",
        "/auth/forgot-password",
        "/auth/reset-password",
      ];

      // Check if this is a public endpoint
      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      if (isPublicEndpoint) {
        return config;
      }

      // For protected endpoints, try to get a valid token
      const token = await tokenManager.getValidToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        console.log("✅ Valid token attached to request");
      } else {
        console.log("⚠️ No valid token available for protected endpoint");
        // Only trigger auth failure for protected endpoints
        if (onAuthFailure) {
          setTimeout(() => onAuthFailure?.(), 100); // Async call to avoid blocking
        }
      }

      return config;
    } catch (error) {
      console.error("❌ Error in axios request interceptor:", error);
      return config;
    }
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
newRequest.interceptors.response.use(
  (response) => {
    console.log(
      `✅ Response received from ${response.config.url} with status: ${response.status}`
    );
    return response;
  },
  async (error) => {
    console.error("❌ Response error:", error.message);

    const originalRequest = error.config;

    // Define endpoints that don't require token refresh logic
    const publicEndpoints = [
      "/auth/signin",
      "/auth/signup",
      "/auth/refresh",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    // Handle token refresh when receiving 401 Unauthorized (only for protected endpoints)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isPublicEndpoint
    ) {
      console.log(
        "🔄 401 received on protected endpoint, attempting token refresh..."
      );
      originalRequest._retry = true;

      try {
        // Use TokenManager for consistent token refresh logic
        const refreshSuccess = await tokenManager.refreshTokens();

        if (refreshSuccess) {
          console.log(
            "✅ Token refreshed successfully in response interceptor"
          );

          // Get the new token and retry the request
          const newToken = await tokenManager.getValidToken();
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return newRequest(originalRequest);
          }
        }

        // Refresh failed
        console.log("❌ Token refresh failed, triggering auth failure");
        if (onAuthFailure) onAuthFailure();
      } catch (refreshError) {
        console.error(
          "❌ Token refresh error in response interceptor:",
          refreshError
        );
        if (onAuthFailure) onAuthFailure();
      }
    } else if (
      error.response &&
      error.response.status === 401 &&
      isPublicEndpoint
    ) {
      console.log("🔓 401 on public endpoint - likely invalid credentials");
      // For public endpoints, 401 means invalid credentials, not expired token
      // Don't trigger auth failure callback, just let the error propagate
    }

    // Create a custom error object that preserves the backend error message
    let customError: any = new Error();
    customError.message = "An unexpected error occurred";

    if (error.response) {
      console.error(`❌ Response status: ${error.response.status}`);
      console.error("❌ Response data:", error.response.data);

      // Extract the error message from the backend response
      if (error.response.data && error.response.data.error) {
        // Use the backend's error message
        customError.message = error.response.data.error;
        customError.status = error.response.status;
        customError.data = error.response.data;
      } else {
        // Fallback to a generic message with the status code
        customError.message = `Request failed with status ${error.response.status}`;
        customError.status = error.response.status;
      }
    } else if (error.request) {
      console.error("❌ No response received - network issue");
      console.error(
        "❌ Request details:",
        JSON.stringify({
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        })
      );
      customError.message = "Network error - no response received";
      customError.isNetworkError = true;
    } else {
      // Something else caused the error
      customError.message = error.message || "Unknown error occurred";
    }

    return Promise.reject(customError);
  }
);

export default newRequest;
