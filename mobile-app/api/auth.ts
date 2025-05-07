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
    const { data } = await newRequest.post("/auth/logout");
    console.log(" Logout successful");
    return data;
  } catch (error) {
    console.error(" Error logging out:", error);
    throw error;
  }
};
