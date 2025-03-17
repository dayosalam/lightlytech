import axios from "axios";
import { Storage } from "@/utils/storage";

// Try different base URLs for development
const API_URL = "http://localhost:3003/api"; // For Android emulator

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
    if (error.response) {
      console.error(`❌ Response status: ${error.response.status}`);
      console.error("❌ Response data:", error.response.data);
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
    }
    return Promise.reject(error);
  }
);

export default newRequest;
