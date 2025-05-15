import axios from "axios";
import { Storage } from "@/utils/storage";

// Try different base URLs for development
const API_URL = "https://lightlytech.onrender.com/api"; // For Android emulator

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
  (error) => {
    console.error("❌ Response error:", error.message);
    
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
