import axios from "axios";
import { SecureStorage as Storage } from "@/utils/storage";

// Try different base URLs for development
const API_URL = "https://lightlytech-backend.vercel.app/api"; // For Android emulator

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

      const token = await Storage.getItem("userToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        console.log("✅ Token attached to request");
      } else {
        console.log("⚠️ No token found for request");
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
    
    // Handle token refresh when receiving 401 Unauthorized
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      console.log("🔄 Attempting to refresh token...");
      originalRequest._retry = true;
      
      try {
        // Get the refresh token
        const refreshToken = await Storage.getItem("refreshToken");
        
        if (!refreshToken) {
          console.error("❌ No refresh token available");
          throw new Error("Authentication required");
        }
        
        // Call the refresh token endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        
        if (response.status === 200) {
          console.log("✅ Token refreshed successfully");
          
          // Store the new access token
          await Storage.setItem("userToken", response.data.accessToken);
          if (response.data.refreshToken) {
            await Storage.setItem("refreshToken", response.data.refreshToken);
          }
          
          // Update the Authorization header with the new token
          originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
          
          // Retry the original request with the new token
          return newRequest(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        // Handle failed refresh - could redirect to login or clear tokens
      }
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
