import { Storage } from "@/utils/storage";
import Constants from "expo-constants";

// API base URL - using Constants if available, or falling back to IP address
const API_URL = Constants.expoConfig?.extra?.API_URL || "http://192.168.0.185:3003/api";

console.log("Using API URL:", API_URL); // Debug log to see which URL is being used

export const signIn = async (email: string, password: string) => {
  try {
    console.log(" Attempting to sign in with email:", email);
    console.log(" API endpoint: /auth/signin");

    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    console.log(" Sign in response received with status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(" Error signing in:", error.message);

    // Check if it's a network error
    if (error.message.includes("Network") || error.message.includes("fetch")) {
      console.error(" Network error detected. Please check:");
      console.error("1. Is the backend server running?");
      console.error("2. Is the API URL correct?");
      console.error(
        "3. Are you testing on an emulator? Try using your actual IP address"
      );

      // Rethrow with more descriptive message
      throw new Error(
        "Network Error: Cannot connect to the server. Please check your connection and server status."
      );
    }

    throw error;
  }
};

export const logOut = async () => {
  try {
    console.log(" Attempting to log out");

    // Get token for authorization header
    const token = await Storage.getItem("userToken");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers,
    });

    console.log(" Logout response received with status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(" Logout successful");
    return data;
  } catch (error) {
    console.error(" Error logging out:", error);
    throw error;
  }
};
