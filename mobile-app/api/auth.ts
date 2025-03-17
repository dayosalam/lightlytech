import newRequest from "./newRequest";

export const signIn = async (email: string, password: string) => {
  try {
    console.log(" Attempting to sign in with email:", email);
    console.log(" API endpoint: /auth/signin");
    
    const response = await newRequest.post("/auth/signin", {
      email,
      password,
    });
    
    console.log(" Sign in response received:", response.status);
    return response.data;
  } catch (error: any) {
    console.error(" Error signing in:", error.message);
    
    // Check if it's a network error
    if (error.message === 'Network Error') {
      console.error(" Network error detected. Please check:");
      console.error("1. Is the backend server running?");
      console.error("2. Is the API URL correct in newRequest.ts?");
      console.error("3. Are you testing on an emulator? Try using 10.0.2.2 instead of localhost");
      
      // Rethrow with more descriptive message
      throw new Error("Network Error: Cannot connect to the server. Please check your connection and server status.");
    }
    
    if (error.response) {
      console.error(" Response data:", error.response.data);
      console.error(" Response status:", error.response.status);
    }
    throw error;
  }
};

export const logOut = async () => {
  try {
    console.log(" Attempting to log out");
    const response = await newRequest.post("/auth/logout");
    console.log(" Logout successful");
    return response.data;
  } catch (error) {
    console.error(" Error logging out:", error);
    throw error;
  }
};
