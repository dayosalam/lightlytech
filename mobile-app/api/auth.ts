import { Storage } from "@/utils/storage";
import newRequest from "./newRequest";

export const signIn = async (email: string, password: string) => {
  try {
    console.log(" Attempting to sign in with email:", email);
    console.log(" API endpoint: /auth/signin");

    const { status, data } = await newRequest.post("/auth/signin", {
      email,
      password,
    });

    if (status !== 200) {
      throw new Error("Login failed");
    }

    return data;
  } catch (error: any) {
    console.error(" Error signing in:", error.message);

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
